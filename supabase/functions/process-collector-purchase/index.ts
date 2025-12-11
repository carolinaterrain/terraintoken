import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { checkRateLimit, getClientIP } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const PurchaseRequestSchema = z.object({
  certificate_id: z.string().uuid("Invalid certificate ID format"),
  buyer_wallet: z.string()
    .min(32, "Wallet address too short")
    .max(64, "Wallet address too long")
    .regex(/^[A-Za-z0-9]+$/, "Invalid wallet address format"),
  buyer_email: z.string().email("Invalid email format").optional(),
  shopify_order_id: z.string().max(100).optional(),
  shipping_address: z.object({
    name: z.string().max(100).optional(),
    address1: z.string().max(200).optional(),
    address2: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(50).optional(),
    zip: z.string().max(20).optional(),
    country: z.string().max(100).optional(),
  }).optional(),
});

type PurchaseRequest = z.infer<typeof PurchaseRequestSchema>;

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  try {
    // Rate limiting: 10 requests per 15 minutes per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = await checkRateLimit(
      clientIP,
      {
        endpoint: 'process-collector-purchase',
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 10,
      },
      supabaseUrl,
      supabaseServiceKey
    );

    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimitResult.retryAfter || 900)
          } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = PurchaseRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.flatten());
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      certificate_id, 
      buyer_wallet, 
      buyer_email,
      shopify_order_id,
      shipping_address 
    }: PurchaseRequest = parseResult.data;

    console.log(`Processing purchase for certificate ${certificate_id} by wallet ${buyer_wallet}`);

    // Fetch certificate and drop details
    const { data: certificate, error: certError } = await supabase
      .from('collector_nft_certificates')
      .select(`
        *,
        collector_drops (*)
      `)
      .eq('id', certificate_id)
      .single();

    if (certError || !certificate) {
      console.error('Certificate fetch error:', certError);
      return new Response(
        JSON.stringify({ error: 'Certificate not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify certificate is reserved (not already claimed)
    if (certificate.status === 'claimed') {
      return new Response(
        JSON.stringify({ error: 'Certificate already claimed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify certificate is reserved by checking reserved_by_session exists
    if (certificate.status !== 'reserved') {
      return new Response(
        JSON.stringify({ error: 'Certificate must be reserved before purchase' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const drop = certificate.collector_drops;

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('collector_drop_purchases')
      .insert({
        drop_id: drop.id,
        certificate_id: certificate_id,
        buyer_wallet: buyer_wallet,
        buyer_email: buyer_email || null,
        shopify_order_id: shopify_order_id || null,
        shipping_address: shipping_address || null,
        order_status: 'confirmed',
        nft_transfer_status: 'pending'
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Failed to create purchase record:', purchaseError);
      throw new Error('Failed to create purchase record');
    }

    console.log(`Created purchase record ${purchase.id}`);

    // Trigger NFT minting
    const mintResponse = await fetch(`${supabaseUrl}/functions/v1/mint-collector-nft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        certificate_id: certificate_id,
        recipient_wallet: buyer_wallet
      })
    });

    const mintResult = await mintResponse.json();

    if (!mintResponse.ok) {
      console.error('NFT minting failed:', mintResult);
      
      // Update purchase with failed status
      await supabase
        .from('collector_drop_purchases')
        .update({ nft_transfer_status: 'failed' })
        .eq('id', purchase.id);

      return new Response(
        JSON.stringify({ 
          error: 'NFT minting failed', 
          purchase_id: purchase.id 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update purchase with mint details
    const { error: updateError } = await supabase
      .from('collector_drop_purchases')
      .update({
        nft_transfer_status: 'completed',
        nft_transfer_signature: mintResult.mint_address
      })
      .eq('id', purchase.id);

    if (updateError) {
      console.error('Failed to update purchase:', updateError);
    }

    console.log(`Purchase complete! NFT ${mintResult.mint_address} minted to ${buyer_wallet}`);

    // Create activity notification
    await supabase
      .from('activity_notifications')
      .insert({
        activity_type: 'collector_purchase',
        user_identifier: buyer_wallet.slice(0, 4) + '...' + buyer_wallet.slice(-4),
        message: `Claimed TRN Collector Edition #${certificate.serial_number}/50`,
        metadata: {
          serial_number: certificate.serial_number,
          mint_address: mintResult.mint_address,
          drop_symbol: drop.symbol
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        purchase_id: purchase.id,
        serial_number: certificate.serial_number,
        mint_address: mintResult.mint_address,
        metadata_uri: mintResult.metadata_uri
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Purchase processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});