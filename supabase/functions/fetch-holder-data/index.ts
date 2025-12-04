import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TRN_MINT_ADDRESS } from "../_shared/constants.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration in milliseconds (5 minutes for consistency)
const CACHE_DURATION_MS = 300000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check unified cache first
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('*')
      .eq('id', 'unified')
      .single();

    const cacheAge = cached?.last_updated 
      ? Date.now() - new Date(cached.last_updated).getTime()
      : Infinity;
    
    // Return cached data if less than 5 minutes old
    if (cached && cacheAge < CACHE_DURATION_MS) {
      console.log('Returning cached unified holder data');
      const cachedData = cached.source ? JSON.parse(cached.source) : null;
      if (cachedData) {
        return new Response(
          JSON.stringify({
            ...cachedData,
            source: 'cache',
            lastUpdated: cached.last_updated,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!HELIUS_API_KEY) {
      console.warn('HELIUS_API_KEY not configured');
      // Try to return stale cache if available
      if (cached?.source) {
        const staleData = JSON.parse(cached.source);
        return new Response(
          JSON.stringify({
            ...staleData,
            source: 'stale-cache',
            lastUpdated: cached.last_updated,
            warning: 'API key not configured, using stale cache',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({
          holderCount: 0,
          totalHolders: 0,
          tiers: { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 },
          top10Percentage: 0,
          holders: [],
          source: 'error',
          error: 'API key not configured',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching TRN holder data using paginated getTokenAccounts...');

    // Paginate through ALL token accounts to get accurate distribution
    const holders: Array<{ address: string; balance: number }> = [];
    let cursor: string | undefined;
    let pageCount = 0;
    const MAX_PAGES = 50;
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
        
        // On rate limit, return cached data if available
        if (response.status === 429 && cached?.source) {
          console.log('Rate limited, returning cached data');
          const staleData = JSON.parse(cached.source);
          return new Response(
            JSON.stringify({
              ...staleData,
              source: 'cache',
              lastUpdated: cached.last_updated,
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
      
      // Add non-zero balance accounts to our list
      for (const acc of tokenAccounts) {
        const balance = parseInt(acc.amount, 10) / 1e6; // Convert to TRN with 6 decimals
        if (balance > 0) {
          holders.push({
            address: acc.owner,
            balance: balance,
          });
        }
      }
      
      cursor = result?.cursor;
      pageCount++;

      console.log(`Page ${pageCount}: found ${tokenAccounts.length} accounts (total holders: ${holders.length})`);

      if (tokenAccounts.length < PAGE_SIZE) {
        break;
      }

    } while (cursor && pageCount < MAX_PAGES);

    console.log(`Successfully fetched ${holders.length} total holders across ${pageCount} pages`);

    // Calculate tier distribution
    const tiers = {
      shrimp: 0,   // < 10K
      crab: 0,     // 10K - 100K
      fish: 0,     // 100K - 500K
      dolphin: 0,  // 500K - 1M
      shark: 0,    // 1M - 5M
      whale: 0,    // 5M - 10M
      humpback: 0, // > 10M
    };

    holders.forEach((holder) => {
      const balance = holder.balance;
      if (balance < 10000) tiers.shrimp++;
      else if (balance < 100000) tiers.crab++;
      else if (balance < 500000) tiers.fish++;
      else if (balance < 1000000) tiers.dolphin++;
      else if (balance < 5000000) tiers.shark++;
      else if (balance < 10000000) tiers.whale++;
      else tiers.humpback++;
    });

    // Calculate total supply and top 10 percentage
    const totalSupply = holders.reduce((sum, h) => sum + h.balance, 0);
    const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance);
    const top10Sum = sortedHolders.slice(0, 10).reduce((sum, h) => sum + h.balance, 0);
    const top10Percentage = totalSupply > 0 ? (top10Sum / totalSupply) * 100 : 0;

    // Add percentage to each holder
    const holdersWithPercentage = sortedHolders.slice(0, 50).map((h) => ({
      ...h,
      percentage: totalSupply > 0 ? parseFloat(((h.balance / totalSupply) * 100).toFixed(2)) : 0,
    }));

    const now = new Date().toISOString();
    
    const responseData = {
      holderCount: holders.length, // For backwards compatibility with useLiveHolderCount
      totalHolders: holders.length,
      tiers,
      top10Percentage,
      holders: holdersWithPercentage, // Return top 50 with percentages
    };

    // Cache the result in unified cache entry
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: 'unified',
        holder_count: holders.length,
        last_updated: now,
        source: JSON.stringify(responseData),
      });

    // Also update legacy cache entries for backwards compatibility
    await supabase
      .from('holder_count_cache')
      .upsert([
        {
          id: 'current',
          holder_count: holders.length,
          last_updated: now,
          source: 'helius-das-unified',
        },
        {
          id: 'holder_distribution',
          holder_count: holders.length,
          last_updated: now,
          source: JSON.stringify(responseData),
        },
      ]);

    console.log('Unified holder data cached successfully');

    return new Response(
      JSON.stringify({
        ...responseData,
        source: 'helius-das',
        lastUpdated: now,
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
    console.error('Error fetching holder data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to return cached data on error
    try {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
      const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      const { data: cached } = await supabase
        .from('holder_count_cache')
        .select('*')
        .eq('id', 'unified')
        .single();

      if (cached?.source) {
        const cachedData = JSON.parse(cached.source);
        return new Response(
          JSON.stringify({ 
            ...cachedData, 
            source: 'cache',
            lastUpdated: cached.last_updated,
            error: errorMessage, 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (cacheError) {
      console.error('Cache fetch also failed:', cacheError);
    }
    
    // Return zero state as last resort (no fake data)
    return new Response(
      JSON.stringify({
        holderCount: 0,
        totalHolders: 0,
        tiers: { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 },
        top10Percentage: 0,
        holders: [],
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
