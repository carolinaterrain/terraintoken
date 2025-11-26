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
          error: 'API key not configured',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Fetching holder count for TRN token using Helius RPC...');

    // Use Helius RPC method getTokenLargestAccounts instead of REST endpoint
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'holder-count',
          method: 'getTokenLargestAccounts',
          params: [TRN_MINT_ADDRESS],
        }),
      }
    );

    if (!response.ok) {
      console.error('Helius RPC error:', response.status, await response.text());
      throw new Error(`Helius RPC error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Helius RPC error:', data.error);
      throw new Error(`Helius RPC error: ${data.error.message}`);
    }

    if (!data.result || !data.result.value) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Helius RPC');
    }

    // Count accounts with non-zero balances
    const activeHolders = data.result.value.filter((holder: any) => {
      const balance = holder.amount || holder.uiAmount || 0;
      return balance > 0;
    });

    const holderCount = activeHolders.length;
    console.log(`Successfully fetched ${holderCount} active holders from Helius RPC`);

    return new Response(
      JSON.stringify({
        holderCount,
        lastUpdated: new Date().toISOString(),
        source: 'helius',
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=120, s-maxage=120', // 2 min cache
        },
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
