import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseRequest {
  certificate_id: string;
  buyer_wallet: string;
  buyer_email?: string;
  shopify_order_id?: string;
  shipping_address?: {
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      certificate_id, 
      buyer_wallet, 
      buyer_email,
      shopify_order_id,
      shipping_address 
    }: PurchaseRequest = await req.json();

    if (!certificate_id || !buyer_wallet) {
      return new Response(
        JSON.stringify({ error: 'Missing certificate_id or buyer_wallet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
          details: mintResult,
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
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
