import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { TRN_MINT_ADDRESS } from "../_shared/constants.ts";

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

    if (!HELIUS_API_KEY) {
      console.warn('HELIUS_API_KEY not configured, using fallback');
      return new Response(
        JSON.stringify({
          holderCount: 1137,
          lastUpdated: new Date().toISOString(),
          source: 'fallback',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Fetching holder count for TRN token...');

    // Use Helius REST API for holder data
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/holders?api-key=${HELIUS_API_KEY}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      console.error('Helius API error:', response.status, await response.text());
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Helius API');
    }

    // Count holders with non-zero balances
    const activeHolders = data.filter((holder: any) => {
      const balance = holder.amount || holder.balance || 0;
      return balance > 0;
    });

    const holderCount = activeHolders.length;
    console.log(`Successfully fetched ${holderCount} active holders from Helius API`);

    return new Response(
      JSON.stringify({
        holderCount,
        lastUpdated: new Date().toISOString(),
        source: 'helius',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching holder count:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return fallback data with 200 status so frontend doesn't break
    return new Response(
      JSON.stringify({
        holderCount: 1137,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        error: errorMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});