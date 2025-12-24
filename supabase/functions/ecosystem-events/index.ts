/**
 * Generic Ecosystem Event Ingestion Endpoint
 * Receives events from TerrainVision and other producers
 * Provides idempotent, replay-safe processing
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const workerId = crypto.randomUUID();
  console.log(`[${workerId}] Processing ecosystem event`);

  try {
    // Read raw body for signature verification
    const rawBody = await req.text();
    
    // Verify signature
    try {
      await verifySignedWebhookOrThrow(req, rawBody);
    } catch (error) {
      console.error('Signature verification failed:', error);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse payload
    const event: EcosystemEvent = JSON.parse(rawBody);
    
    // Get idempotency key from header or payload
    const idempotencyKey = req.headers.get('x-idempotency-key') || event.idempotency_key;
    const correlationId = req.headers.get('x-correlation-id') || event.correlation_id;

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

    const supabase = getServiceSupabase();

    // Normalize event type to canonical format
    const canonicalEventType = normalizeEventType(event.event_type);
    console.log(`Event type: ${event.event_type} -> ${canonicalEventType}`);

    // Upsert into webhook_inbox (idempotent)
    const { error: inboxError } = await supabase
      .from('webhook_inbox')
      .upsert({
        idempotency_key: idempotencyKey,
        producer: event.producer || 'unknown',
        event_type: canonicalEventType,
        payload: event.payload || {},
        received_at: new Date().toISOString(),
      }, { 
        onConflict: 'idempotency_key',
        ignoreDuplicates: true 
      });

    if (inboxError) {
      console.error('Error upserting to webhook_inbox:', inboxError);
    }

    // Try to claim the webhook for processing
    const claimed = await claimWebhook(supabase, idempotencyKey, workerId);
    
    if (!claimed) {
      // Already being processed or already processed
      console.log(`Event ${idempotencyKey} already claimed or processed`);
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
      console.log(`Event ${idempotencyKey} already recorded`);
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

    // Insert into ecosystem_events
    const { data: newEvent, error: eventError } = await supabase
      .from('ecosystem_events')
      .insert({
        event_type: canonicalEventType,
        source_app: event.producer || 'terrainvision',
        producer: event.producer || 'terrainvision',
        user_id: event.user_id,
        session_id: event.session_id,
        wallet_address: event.wallet_address,
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        report_month: event.report_month,
        property_id: event.property_id, // Lifecycle linking
        payload: event.payload || {},
      })
      .select()
      .single();

    if (eventError) {
      // Could be duplicate key error, which is fine
      if (eventError.code === '23505') {
        console.log(`Event ${idempotencyKey} already exists (race condition)`);
        await markWebhookProcessed(supabase, idempotencyKey);
        return new Response(
          JSON.stringify({ success: true, status: 'already_recorded' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error inserting event:', eventError);
      await scheduleWebhookRetry(supabase, idempotencyKey, eventError.message);
      throw eventError;
    }

    // Route event to specific handlers if needed
    await routeEvent(supabase, canonicalEventType, event, newEvent.id);

    // Mark webhook as processed
    await markWebhookProcessed(supabase, idempotencyKey);

    console.log(`Event recorded: ${newEvent.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        event_id: newEvent.id,
        event_type: canonicalEventType,
        idempotency_key: idempotencyKey,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ecosystem-events:', error);
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

    case 'tv.payment.succeeded':
      // Could update usage metrics
      console.log('Payment succeeded, tracking for burn calculations');
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
