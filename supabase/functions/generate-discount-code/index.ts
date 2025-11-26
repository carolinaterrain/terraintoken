import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DISCOUNT_TIERS = [
  { trn: 500000, discount: 30, name: "Platinum" },
  { trn: 100000, discount: 20, name: "Gold" },
  { trn: 10000, discount: 10, name: "Silver" },
  { trn: 1000, discount: 5, name: "Bronze" },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, serviceType } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user's TRN balance (placeholder - integrate with actual balance check)
    const trnBalance = 50000; // This should be fetched from actual wallet balance

    // Determine discount tier
    const tier = DISCOUNT_TIERS.find(t => trnBalance >= t.trn) || DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1];

    // Generate unique code
    const discountCode = `TRN-${serviceType.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create redemption record
    await supabase.from('service_redemptions').insert({
      user_wallet: walletAddress,
      service_type: serviceType,
      discount_code: discountCode,
      discount_percent: tier.discount,
      trn_required: tier.trn,
      trn_balance_snapshot: trnBalance,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return new Response(JSON.stringify({ 
      success: true, 
      discountCode,
      discountPercent: tier.discount,
    }), {
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
