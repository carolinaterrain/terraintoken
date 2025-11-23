import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    const TRN_MINT_ADDRESS = 'GwXzGeZFF4jK1PqzVd17MHioY7pqSET7r6UY7RS1pump';

    console.log('Fetching TRN holder data from Helius...');

    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/holders`,
      {
        headers: {
          'Authorization': `Bearer ${HELIUS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();
    const holderData = data.result || [];

    const holders = holderData
      .filter((h: any) => h.amount >= 1)
      .map((h: any) => ({
        address: h.owner,
        balance: h.amount,
      }));

    console.log(`Successfully fetched ${holders.length} holders`);

    // Calculate distribution
    const tiers = {
      shrimp: 0,
      crab: 0,
      fish: 0,
      dolphin: 0,
      shark: 0,
      whale: 0,
      humpback: 0,
    };

    holders.forEach((holder: any) => {
      const balance = holder.balance;
      if (balance < 10000) tiers.shrimp++;
      else if (balance < 100000) tiers.crab++;
      else if (balance < 500000) tiers.fish++;
      else if (balance < 1000000) tiers.dolphin++;
      else if (balance < 5000000) tiers.shark++;
      else if (balance < 10000000) tiers.whale++;
      else tiers.humpback++;
    });

    const totalSupply = holders.reduce((sum: number, h: any) => sum + h.balance, 0);
    const sortedHolders = [...holders].sort((a: any, b: any) => b.balance - a.balance);
    const top10Sum = sortedHolders.slice(0, 10).reduce((sum: number, h: any) => sum + h.balance, 0);
    const top10Percentage = (top10Sum / totalSupply) * 100;

    return new Response(
      JSON.stringify({
        totalHolders: holders.length,
        tiers,
        top10Percentage,
        holders: holders.slice(0, 50), // Return top 50 for debugging
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching holder data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return fallback data
    return new Response(
      JSON.stringify({
        totalHolders: 1137,
        tiers: {
          shrimp: 450,
          crab: 320,
          fish: 200,
          dolphin: 100,
          shark: 45,
          whale: 18,
          humpback: 4,
        },
        top10Percentage: 32.5,
        error: errorMessage,
        fallback: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
