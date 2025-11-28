import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (!HELIUS_API_KEY) {
      console.warn('HELIUS_API_KEY not configured, using cached fallback');
      const { data: cached } = await supabase
        .from('holder_count_cache')
        .select('holder_count, last_updated')
        .eq('id', 'current')
        .single();

      return new Response(
        JSON.stringify({
          holderCount: cached?.holder_count || 0,
          lastUpdated: cached?.last_updated || new Date().toISOString(),
          source: 'cache',
          error: 'API key not configured',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching holder count using Helius DAS getTokenAccounts API...');

    // Use Helius DAS API getTokenAccounts - returns total count and token accounts
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'get-holder-count',
          method: 'getTokenAccounts',
          params: {
            mint: TRN_MINT_ADDRESS,
            limit: 1, // We only need the total count
            options: {
              showZeroBalance: false,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Helius DAS API error: ${response.status}`, errorText);
      
      // On rate limit (429), return cached data
      if (response.status === 429) {
        console.log('Rate limited, returning cached holder count...');
        const { data: cached } = await supabase
          .from('holder_count_cache')
          .select('holder_count, last_updated')
          .eq('id', 'current')
          .single();

        return new Response(
          JSON.stringify({
            holderCount: cached?.holder_count || 0,
            lastUpdated: cached?.last_updated || new Date().toISOString(),
            source: 'cache',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Helius DAS API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Helius RPC error:', data.error);
      throw new Error(`Helius RPC error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    // DAS getTokenAccounts returns: { result: { total: number, limit: number, cursor: string, token_accounts: [...] } }
    const holderCount = data.result?.total || 0;
    
    console.log(`Successfully fetched holder count: ${holderCount} holders`);

    // Update cache with new holder count
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: 'current',
        holder_count: holderCount,
        last_updated: new Date().toISOString(),
        source: 'helius-das',
      });

    return new Response(
      JSON.stringify({
        holderCount,
        lastUpdated: new Date().toISOString(),
        source: 'helius-das',
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=120, s-maxage=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching holder count:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to return cached data on any error
    try {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      
      const { data: cached } = await supabase
        .from('holder_count_cache')
        .select('holder_count, last_updated')
        .eq('id', 'current')
        .single();

      if (cached && cached.holder_count > 0) {
        return new Response(
          JSON.stringify({
            holderCount: cached.holder_count,
            lastUpdated: cached.last_updated,
            source: 'cache',
            error: errorMessage,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (cacheError) {
      console.error('Cache fetch also failed:', cacheError);
    }
    
    // Return 0 as last resort (no fake data)
    return new Response(
      JSON.stringify({
        holderCount: 0,
        lastUpdated: new Date().toISOString(),
        source: 'error',
        error: errorMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
