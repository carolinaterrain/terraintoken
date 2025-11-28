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

    // First check cache - only refresh every 5 minutes
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('holder_count, last_updated')
      .eq('id', 'current')
      .single();

    const cacheAge = cached?.last_updated 
      ? Date.now() - new Date(cached.last_updated).getTime()
      : Infinity;
    
    // Return cached data if less than 5 minutes old
    if (cached && cached.holder_count > 0 && cacheAge < 300000) {
      console.log(`Returning cached holder count: ${cached.holder_count}`);
      return new Response(
        JSON.stringify({
          holderCount: cached.holder_count,
          lastUpdated: cached.last_updated,
          source: 'cache',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!HELIUS_API_KEY) {
      console.warn('HELIUS_API_KEY not configured, using cached fallback');
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

    console.log('Fetching holder count by paginating through all token accounts...');

    // Paginate through ALL token accounts to get accurate count
    let totalHolders = 0;
    let cursor: string | undefined;
    let pageCount = 0;
    const MAX_PAGES = 50; // Safety limit
    const PAGE_SIZE = 1000;

    do {
      const response = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: `get-holders-page-${pageCount}`,
            method: 'getTokenAccounts',
            params: {
              mint: TRN_MINT_ADDRESS,
              limit: PAGE_SIZE,
              cursor: cursor,
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
        
        if (response.status === 429 && cached && cached.holder_count > 0) {
          console.log('Rate limited, returning cached holder count...');
          return new Response(
            JSON.stringify({
              holderCount: cached.holder_count,
              lastUpdated: cached.last_updated,
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

      const result = data.result;
      const tokenAccounts = result?.token_accounts || [];
      
      // Count non-zero balance accounts
      const activeAccounts = tokenAccounts.filter((acc: { amount: string }) => 
        parseInt(acc.amount, 10) > 0
      );
      
      totalHolders += activeAccounts.length;
      cursor = result?.cursor;
      pageCount++;

      console.log(`Page ${pageCount}: found ${activeAccounts.length} holders (total so far: ${totalHolders})`);

      // If we got less than PAGE_SIZE results, we've reached the end
      if (tokenAccounts.length < PAGE_SIZE) {
        break;
      }

    } while (cursor && pageCount < MAX_PAGES);

    console.log(`Successfully counted ${totalHolders} total holders across ${pageCount} pages`);

    // Update cache with new holder count
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: 'current',
        holder_count: totalHolders,
        last_updated: new Date().toISOString(),
        source: 'helius-das-paginated',
      });

    return new Response(
      JSON.stringify({
        holderCount: totalHolders,
        lastUpdated: new Date().toISOString(),
        source: 'helius-das',
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=300',
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
