/**
 * ARCHIVED: This edge function is not currently called from the frontend.
 * No marketplace purchase flow UI exists in the app.
 * 
 * Dependencies:
 * - marketplace_items table
 * - marketplace_transactions table
 * - token_burns table
 * 
 * To reactivate: Build marketplace purchase UI.
 * Last archived: 2025-12-04
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemId, buyerWallet, priceTrn } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: item } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (!item) {
      throw new Error('Item not found');
    }

    const platformFee = priceTrn * 0.05;
    const feeBurned = platformFee / 2;
    const sellerPayout = priceTrn - platformFee;

    const { data: transaction } = await supabase
      .from('marketplace_transactions')
      .insert({
        item_id: itemId,
        buyer_wallet: buyerWallet,
        seller_wallet: item.seller_wallet,
        price_paid: priceTrn,
        platform_fee: platformFee,
        fee_burned: feeBurned,
        seller_payout: sellerPayout,
      })
      .select()
      .single();

    if (!buyerWallet) {
      throw new Error('buyer_wallet is required for burn tracking');
    }
    
    await supabase.from('token_burns').insert({
      burn_source: 'marketplace_fee',
      burn_amount: feeBurned,
      user_wallet: buyerWallet,
      related_transaction_id: transaction.id,
      transaction_signature: 'pending_verification',
      metadata: {
        item_id: itemId,
        verification_status: 'pending',
        recorded_at: new Date().toISOString()
      }
    });
    
    console.log(`[Burn] Marketplace fee burn recorded: ${feeBurned} TRN from ${buyerWallet}`);

    await supabase
      .from('marketplace_items')
      .update({
        sales_count: item.sales_count + 1,
      })
      .eq('id', itemId);

    return new Response(JSON.stringify({ success: true, transaction }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
