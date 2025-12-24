/**
 * Generic Ecosystem Event Ingestion Endpoint
 * Receives events from TerrainVision, StormwaterSCM, TerrainGuard, and other producers
 * Provides idempotent, replay-safe, rate-limited processing
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  corsHeaders, 
  getServiceSupabase, 
  verifySignedWebhookOrThrow,
  normalizeEventType,
  claimWebhook,
  markWebhookProcessed,
  scheduleWebhookRetry,
  type EcosystemEvent
} from "../_shared/ecosystem.ts";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";

// Valid producers
const VALID_PRODUCERS = ['terrainvision', 'trn', 'stormwaterscm', 'carolinaterrain', 'terrainguard'];

// Rate limit: 100 requests per minute per IP
const RATE_LIMIT_CONFIG = {
  endpoint: 'ecosystem-events',
  windowMs: 60 * 1000,
  maxRequests: 100,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const workerId = crypto.randomUUID();
  const startTime = Date.now();
  console.log(`[${workerId}] Processing ecosystem event`);

  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const rateLimitResult = await checkRateLimit(clientIP, RATE_LIMIT_CONFIG, supabaseUrl, supabaseKey);
    if (!rateLimitResult.allowed) {
      console.warn(`[${workerId}] Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retry_after: rateLimitResult.retryAfter }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitResult.retryAfter || 60)
          } 
        }
      );
    }

    // Read raw body for signature verification
    const rawBody = await req.text();
    
    // Validate body size (max 1MB)
    if (rawBody.length > 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Payload too large', max_size: '1MB' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify signature
    try {
      await verifySignedWebhookOrThrow(req, rawBody);
    } catch (error) {
      console.error(`[${workerId}] Signature verification failed:`, error);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse payload with validation
    let event: EcosystemEvent;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get idempotency key from header or payload
    const idempotencyKey = req.headers.get('x-idempotency-key') || event.idempotency_key;
    const correlationId = req.headers.get('x-correlation-id') || event.correlation_id;

    // Validate required fields
    if (!idempotencyKey) {
      return new Response(
        JSON.stringify({ error: 'Missing idempotency_key in payload or x-idempotency-key header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!event.event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing event_type in payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate event_type format (must be dot-case or underscore-case)
    if (!/^[a-zA-Z][a-zA-Z0-9._-]*$/.test(event.event_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid event_type format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate producer if provided
    const producer = event.producer || 'terrainvision';
    if (!VALID_PRODUCERS.includes(producer)) {
      console.warn(`[${workerId}] Unknown producer: ${producer}`);
    }

    // Validate property_id format if provided
    if (event.property_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(event.property_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid property_id format (must be UUID)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceSupabase();

    // Normalize event type to canonical format
    const canonicalEventType = normalizeEventType(event.event_type);
    console.log(`[${workerId}] Event type: ${event.event_type} -> ${canonicalEventType}`);

    // Upsert into webhook_inbox (idempotent)
    const { error: inboxError } = await supabase
      .from('webhook_inbox')
      .upsert({
        idempotency_key: idempotencyKey,
        producer: producer,
        event_type: canonicalEventType,
        payload: event.payload || {},
        received_at: new Date().toISOString(),
      }, { 
        onConflict: 'idempotency_key',
        ignoreDuplicates: true 
      });

    if (inboxError) {
      console.error(`[${workerId}] Error upserting to webhook_inbox:`, inboxError);
    }

    // Try to claim the webhook for processing
    const claimed = await claimWebhook(supabase, idempotencyKey, workerId);
    
    if (!claimed) {
      // Already being processed or already processed
      console.log(`[${workerId}] Event ${idempotencyKey} already claimed or processed`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'already_processing',
          idempotency_key: idempotencyKey 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if event already exists in ecosystem_events (idempotent insert)
    const { data: existingEvent } = await supabase
      .from('ecosystem_events')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existingEvent) {
      console.log(`[${workerId}] Event ${idempotencyKey} already recorded`);
      await markWebhookProcessed(supabase, idempotencyKey);
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'already_recorded',
          event_id: existingEvent.id 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate property_id exists if provided
    if (event.property_id) {
      const { data: property } = await supabase
        .from('properties')
        .select('id')
        .eq('id', event.property_id)
        .single();
      
      if (!property) {
        console.warn(`[${workerId}] Property ${event.property_id} not found, proceeding without link`);
        event.property_id = undefined;
      }
    }

    // Insert into ecosystem_events
    const { data: newEvent, error: eventError } = await supabase
      .from('ecosystem_events')
      .insert({
        event_type: canonicalEventType,
        source_app: producer,
        producer: producer,
        user_id: event.user_id,
        session_id: event.session_id,
        wallet_address: event.wallet_address,
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        report_month: event.report_month,
        property_id: event.property_id,
        payload: event.payload || {},
      })
      .select()
      .single();

    if (eventError) {
      // Could be duplicate key error, which is fine
      if (eventError.code === '23505') {
        console.log(`[${workerId}] Event ${idempotencyKey} already exists (race condition)`);
        await markWebhookProcessed(supabase, idempotencyKey);
        return new Response(
          JSON.stringify({ success: true, status: 'already_recorded' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error(`[${workerId}] Error inserting event:`, eventError);
      await scheduleWebhookRetry(supabase, idempotencyKey, eventError.message);
      throw eventError;
    }

    // Route event to specific handlers if needed
    await routeEvent(supabase, canonicalEventType, event, newEvent.id);

    // Mark webhook as processed
    await markWebhookProcessed(supabase, idempotencyKey);

    const processingTime = Date.now() - startTime;
    console.log(`[${workerId}] Event recorded: ${newEvent.id} (${processingTime}ms)`);

    return new Response(
      JSON.stringify({
        success: true,
        event_id: newEvent.id,
        event_type: canonicalEventType,
        idempotency_key: idempotencyKey,
        processing_time_ms: processingTime,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${workerId}] Error in ecosystem-events:`, error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Route event to specific handlers based on type
 */
async function routeEvent(
  supabase: ReturnType<typeof getServiceSupabase>,
  eventType: string,
  event: EcosystemEvent,
  eventId: string
): Promise<void> {
  console.log(`Routing event: ${eventType}`);

  switch (eventType) {
    case 'tv.month.closed':
      // TerrainVision closed the month - could trigger determine-burn-band
      console.log('Month closed event received, ready for band determination');
      break;

    case 'tv.analysis.completed':
      // Track for rewards/metrics
      console.log('AI analysis completed, tracking for ecosystem metrics');
      break;

    case 'tv.payment.succeeded':
      // Could update usage metrics
      console.log('Payment succeeded, tracking for burn calculations');
      break;

    case 'scm.inspection.completed':
      // StormwaterSCM completed an inspection
      console.log('Inspection completed, tracking compliance');
      break;

    case 'ct.job.completed':
      // Carolina Terrain completed work
      console.log('Job completed, tracking for lifecycle');
      break;

    case 'trn.wallet.linked':
      // Update wallet_connections
      if (event.wallet_address) {
        await supabase
          .from('wallet_connections')
          .upsert({
            wallet_address: event.wallet_address,
            last_seen_at: new Date().toISOString(),
          }, { onConflict: 'wallet_address' });
      }
      break;

    default:
      console.log(`No specific handler for event type: ${eventType}`);
  }
}
