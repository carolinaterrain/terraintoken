/**
 * ARCHIVED: This edge function is not currently called from the frontend.
 * No energy purchase UI exists in the app.
 * 
 * Dependencies:
 * - energy_balances table
 * - energy_purchases table
 * - token_burns table
 * 
 * To reactivate: Build energy purchase UI in the app.
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
    const { walletAddress, packageType, energyAmount, trnCost } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const trnBurned = trnCost / 2;

    const { data: balance } = await supabase
      .from('energy_balances')
      .select('*')
      .eq('user_wallet', walletAddress)
      .maybeSingle();

    if (balance) {
      await supabase
        .from('energy_balances')
        .update({
          energy_balance: balance.energy_balance + energyAmount,
          total_energy_purchased: balance.total_energy_purchased + energyAmount,
          trn_spent_on_energy: balance.trn_spent_on_energy + trnCost,
        })
        .eq('user_wallet', walletAddress);
    } else {
      await supabase.from('energy_balances').insert({
        user_wallet: walletAddress,
        energy_balance: 5 + energyAmount,
        total_energy_purchased: energyAmount,
        trn_spent_on_energy: trnCost,
      });
    }

    const { data: purchase } = await supabase
      .from('energy_purchases')
      .insert({
        user_wallet: walletAddress,
        package_type: packageType,
        energy_amount: energyAmount,
        trn_cost: trnCost,
        trn_burned: trnBurned,
      })
      .select()
      .single();

    if (!walletAddress) {
      throw new Error('wallet_address is required for burn tracking');
    }
    
    await supabase.from('token_burns').insert({
      burn_source: 'energy_purchase',
      burn_amount: trnBurned,
      user_wallet: walletAddress,
      related_transaction_id: purchase.id,
      transaction_signature: 'pending_verification',
      metadata: {
        package_type: packageType,
        verification_status: 'pending',
        recorded_at: new Date().toISOString()
      }
    });
    
    console.log(`[Burn] Energy purchase burn recorded: ${trnBurned} TRN from ${walletAddress}`);

    return new Response(JSON.stringify({ success: true, purchase }), {
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
