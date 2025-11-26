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

    // Get item details
    const { data: item } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (!item) {
      throw new Error('Item not found');
    }

    // Calculate fees (5% total: 2.5% to seller, 2.5% burned)
    const platformFee = priceTrn * 0.05;
    const feeBurned = platformFee / 2;
    const sellerPayout = priceTrn - platformFee;

    // Record transaction
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

    // Record burn
    await supabase.from('token_burns').insert({
      burn_source: 'marketplace_fee',
      burn_amount: feeBurned,
      user_wallet: buyerWallet,
      related_transaction_id: transaction.id,
    });

    // Update item stats
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
