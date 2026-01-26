import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { 
  fetchWithRetry, 
  isCircuitOpen, 
  getCircuitStatus,
  isCacheValid,
  getCacheAgeSeconds,
  CONFIG 
} from "../_shared/heliusGateway.ts";

// CORRECT TRN Token Address - Token-2022 with Interest-Bearing Extension
const TRN_MINT_ADDRESS = "Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m";
const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration: 15 minutes for fresh data (reduces Helius rate limiting significantly)
const CACHE_DURATION_MS = 15 * 60 * 1000;

interface UnifiedTokenData {
  totalSupply: number;
  circulatingSupply: number;
  decimals: number;
  holderCount: number;
  holderTiers: {
    shrimp: number;
    crab: number;
    fish: number;
    dolphin: number;
    shark: number;
    whale: number;
    humpback: number;
  };
  top10Percentage: number;
  priceUsd: string;
  priceSol: string;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  cacheAge?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Helper to get cached data - checks multiple cache sources for valid holder count
  async function getCachedData(): Promise<UnifiedTokenData | null> {
    try {
      // Check all possible cache entries, prioritize by recency and validity
      const { data: allCaches } = await supabase
        .from('holder_count_cache')
        .select('*')
        .in('id', ['unified-token-data', 'holder_distribution', 'current', 'unified'])
        .order('last_updated', { ascending: false });

      if (!allCaches || allCaches.length === 0) return null;

      // Try to get tier data from holder_distribution (most reliable source)
      let tierData = null;
      const holderDistCache = allCaches.find(c => c.id === 'holder_distribution');
      if (holderDistCache?.source) {
        try {
          const parsed = JSON.parse(holderDistCache.source);
          if (parsed.tiers && Object.values(parsed.tiers).some((v: any) => v > 0)) {
            tierData = parsed.tiers;
            console.log('Found valid tier data in holder_distribution cache');
          }
        } catch (e) {
          console.warn('Failed to parse holder_distribution cache');
        }
      }

      // Find best cache: valid holder count > 0, most recent
      for (const cached of allCaches) {
        if (cached.holder_count > 0) {
          // If it has full source data, use it
          if (cached.source) {
            try {
              const parsedData = JSON.parse(cached.source);
              if (parsedData.holderCount > 0) {
                console.log(`Using cache from ${cached.id} with ${parsedData.holderCount} holders`);
                
                // Merge tier data if the current cache has all zeros
                let finalTiers = parsedData.holderTiers;
                if (tierData && Object.values(parsedData.holderTiers || {}).every((v: any) => v === 0)) {
                  console.log('Merging tier data from holder_distribution into cached response');
                  finalTiers = tierData;
                }
                
                return {
                  ...parsedData,
                  holderTiers: finalTiers,
                  lastUpdated: cached.last_updated,
                };
              }
            } catch (e) {
              // Source parse failed, but holder_count is valid
            }
          }
          // Return minimal cached data with valid holder count
          console.log(`Using holder_count ${cached.holder_count} from ${cached.id}`);
          return {
            ...getFallbackData(),
            holderCount: cached.holder_count,
            holderTiers: tierData || getFallbackData().holderTiers,
            lastUpdated: cached.last_updated,
            source: 'cache',
          };
        }
      }
    } catch (e) {
      console.error('Error reading cache:', e);
    }
    return null;
  }

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');

    // Check cache first
    const cached = await getCachedData();
    const cacheAge = cached?.lastUpdated 
      ? Date.now() - new Date(cached.lastUpdated).getTime()
      : Infinity;
    
    // Always fetch fresh market data from DexScreener (no rate limits)
    // This ensures price/volume/marketCap is always current even when using cached holder data
    const freshMarketData = await fetchMarketData();
    
    // Return cached holder data + fresh market data if cache is less than 15 minutes old
    if (cached && cacheAge < CACHE_DURATION_MS) {
      console.log('Returning cached holder data with fresh market data');
      return new Response(
        JSON.stringify({
          ...cached,
          // Override market data with fresh values
          priceUsd: freshMarketData.priceUsd,
          priceSol: freshMarketData.priceSol,
          priceChange24h: freshMarketData.priceChange24h,
          marketCap: freshMarketData.marketCap,
          volume24h: freshMarketData.volume24h,
          liquidity: freshMarketData.liquidity,
          source: 'cache',
          cacheAge: Math.floor(cacheAge / 1000),
        }),
        { headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'x-cache': 'hit',
          'x-cache-age': Math.floor(cacheAge / 1000).toString(),
        } }
      );
    }

    // Check circuit breaker before making Helius calls
    if (await isCircuitOpen(supabase)) {
      const status = await getCircuitStatus(supabase);
      console.log('[fetch-unified-token-data] Circuit breaker open, returning cached data');
      if (cached) {
        return new Response(
          JSON.stringify({
            ...cached,
            source: 'cache',
            circuitStatus: status,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-cache': 'stale' } }
        );
      }
    }

    console.log('Fetching fresh unified token data...');

    // Fetch all data in parallel
    const [supplyData, holderData, marketData] = await Promise.all([
      fetchTokenSupply(HELIUS_API_KEY, supabase),
      fetchHolderData(HELIUS_API_KEY, cached, supabase),
      fetchMarketData(),
    ]);

    const now = new Date().toISOString();
    
    // Merge holder tier data from holder_distribution cache if tiers are all zeros
    let finalTiers = holderData.tiers;
    if (Object.values(holderData.tiers).every(v => v === 0) && holderData.holderCount > 0) {
      try {
        const { data: tierCache } = await supabase
          .from('holder_count_cache')
          .select('source')
          .eq('id', 'holder_distribution')
          .single();
        
        if (tierCache?.source) {
          const parsed = JSON.parse(tierCache.source);
          if (parsed.tiers && Object.values(parsed.tiers).some((v: any) => v > 0)) {
            console.log('Merging tier data from holder_distribution cache');
            finalTiers = parsed.tiers;
          }
        }
      } catch (e) {
        console.warn('Could not merge tier data from cache:', e);
      }
    }
    
    const responseData: UnifiedTokenData = {
      totalSupply: supplyData.totalSupply,
      circulatingSupply: supplyData.circulatingSupply,
      decimals: supplyData.decimals,
      holderCount: holderData.holderCount,
      holderTiers: finalTiers,
      top10Percentage: holderData.top10Percentage,
      priceUsd: marketData.priceUsd,
      priceSol: marketData.priceSol,
      priceChange24h: marketData.priceChange24h,
      marketCap: marketData.marketCap,
      volume24h: marketData.volume24h,
      liquidity: marketData.liquidity,
      lastUpdated: now,
      source: 'live',
    };

    // ONLY cache if we have valid holder count (not 0)
    if (responseData.holderCount > 0) {
      await supabase
        .from('holder_count_cache')
        .upsert({
          id: 'unified-token-data',
          holder_count: holderData.holderCount,
          last_updated: now,
          source: JSON.stringify(responseData),
        });

      // Also update legacy cache for backwards compatibility
      await supabase
        .from('holder_count_cache')
        .upsert({
          id: 'unified',
          holder_count: holderData.holderCount,
          last_updated: now,
          source: JSON.stringify({
            holderCount: holderData.holderCount,
            totalHolders: holderData.holderCount,
            tiers: holderData.tiers,
            top10Percentage: holderData.top10Percentage,
          }),
        });

      console.log('Unified token data fetched and cached successfully');
    } else {
      console.warn('Skipping cache update - holder count is 0');
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=120',
          'x-cache': 'miss',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching unified token data:', error);
    
    // Try to return stale cache on error
    const cached = await getCachedData();
    if (cached) {
      console.log('Returning stale cached data due to error');
      return new Response(
        JSON.stringify({ 
          ...cached, 
          source: 'cache',
          error: error instanceof Error ? error.message : 'Unknown error', 
        }),
        { headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'x-cache': 'stale',
        } }
      );
    }
    
    // Return fallback data as last resort
    return new Response(
      JSON.stringify(getFallbackData()),
      {
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'x-cache': 'fallback',
        },
      }
    );
  }
});

// Fetch token supply from Helius
async function fetchTokenSupply(apiKey: string | undefined, supabase: SupabaseClient) {
  if (!apiKey) {
    console.warn('HELIUS_API_KEY not configured, using fallback supply');
    return { totalSupply: 1000000000000000, circulatingSupply: 550000000000000, decimals: 6 };
  }

  try {
    const [supplyResponse, holdersResponse] = await Promise.all([
      fetchWithRetry(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenSupply',
          params: [TRN_MINT_ADDRESS]
        })
      }, supabase),
      fetchWithRetry(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'getTokenLargestAccounts',
          params: [TRN_MINT_ADDRESS]
        })
      }, supabase)
    ]);

    const supplyData = await supplyResponse.json();
    const holdersData = await holdersResponse.json();
    
    const supply = supplyData.result?.value;
    const accounts = holdersData.result?.value || [];
    
    if (!supply) {
      throw new Error('No supply data returned');
    }

    const totalSupply = parseInt(supply.amount);
    const decimals = supply.decimals;
    
    let circulatingSupply = totalSupply;
    if (accounts.length > 0) {
      const largestAccount = accounts[0];
      const largestHolderAmount = parseInt(largestAccount.amount);
      const largestPercentage = (largestHolderAmount / totalSupply) * 100;
      
      if (largestPercentage > 40) {
        circulatingSupply = totalSupply - largestHolderAmount;
      }
    }

    console.log(`Token supply fetched: ${totalSupply / Math.pow(10, decimals)} TRN (decimals: ${decimals})`);

    return { totalSupply, circulatingSupply, decimals };
  } catch (error) {
    console.error('Error fetching token supply:', error);
    return { totalSupply: 1000000000000000, circulatingSupply: 550000000000000, decimals: 6 };
  }
}

// Fetch holder data from Helius DAS with rate limit handling
async function fetchHolderData(apiKey: string | undefined, cachedData: UnifiedTokenData | null, supabase: SupabaseClient) {
  const defaultTiers = { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 };
  
  // Use cached data as fallback if available
  const fallbackData = cachedData ? {
    holderCount: cachedData.holderCount,
    tiers: cachedData.holderTiers,
    top10Percentage: cachedData.top10Percentage,
  } : { holderCount: 0, tiers: defaultTiers, top10Percentage: 0 };
  
  if (!apiKey) {
    console.warn('HELIUS_API_KEY not configured, using cached/fallback holder data');
    return fallbackData;
  }

  try {
    const holders: Array<{ address: string; balance: number }> = [];
    let cursor: string | undefined;
    let pageCount = 0;
    const MAX_PAGES = 50;
    const PAGE_SIZE = 1000;

    do {
      const response = await fetchWithRetry(
        `https://mainnet.helius-rpc.com/?api-key=${apiKey}`,
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
              options: { showZeroBalance: false },
            },
          }),
        },
        supabase,
        2 // Only 2 retries for holder data to avoid long waits
      );

      if (!response.ok) {
        // On rate limit or error, return cached data instead of 0
        console.warn(`Helius API returned ${response.status}, using cached data`);
        return fallbackData;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Helius RPC error:', data.error);
        return fallbackData;
      }

      const result = data.result;
      const tokenAccounts = result?.token_accounts || [];
      
      for (const acc of tokenAccounts) {
        const balance = parseInt(acc.amount, 10) / 1e6;
        if (balance > 0) {
          holders.push({ address: acc.owner, balance });
        }
      }
      
      cursor = result?.cursor;
      pageCount++;

      if (tokenAccounts.length < PAGE_SIZE) break;
    } while (cursor && pageCount < MAX_PAGES);

    // If we got 0 holders but have cached data, use cached
    if (holders.length === 0 && fallbackData.holderCount > 0) {
      console.warn('Got 0 holders from API, using cached data');
      return fallbackData;
    }

    console.log(`Fetched ${holders.length} holders across ${pageCount} pages`);

    // Calculate tier distribution
    const tiers = { ...defaultTiers };
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

    // Calculate top 10 percentage
    const totalSupply = holders.reduce((sum, h) => sum + h.balance, 0);
    const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance);
    const top10Sum = sortedHolders.slice(0, 10).reduce((sum, h) => sum + h.balance, 0);
    const top10Percentage = totalSupply > 0 ? (top10Sum / totalSupply) * 100 : 0;

    return { holderCount: holders.length, tiers, top10Percentage };
  } catch (error) {
    console.error('Error fetching holder data, using cached:', error);
    return fallbackData;
  }
}

// Fetch market data from DexScreener (no rate limiting concerns)
async function fetchMarketData() {
  try {
    const response = await fetch(`${DEXSCREENER_API}/${TRN_MINT_ADDRESS}`);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data = await response.json();
    const pair = data.pairs?.[0];
    
    if (!pair) {
      throw new Error('No pair data available');
    }
    
    return {
      priceUsd: pair.priceUsd || "0",
      priceSol: pair.priceNative || "0",
      priceChange24h: parseFloat(pair.priceChange?.h24 || "0"),
      marketCap: parseFloat(pair.fdv || pair.marketCap || "0"),
      volume24h: parseFloat(pair.volume?.h24 || "0"),
      liquidity: parseFloat(pair.liquidity?.usd || "0"),
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      priceUsd: "0",
      priceSol: "0",
      priceChange24h: 0,
      marketCap: 0,
      volume24h: 0,
      liquidity: 0,
    };
  }
}

function getFallbackData(): UnifiedTokenData {
  return {
    totalSupply: 1000000000000000,
    circulatingSupply: 550000000000000,
    decimals: 6,
    holderCount: 0,
    holderTiers: { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 },
    top10Percentage: 0,
    priceUsd: "0",
    priceSol: "0",
    priceChange24h: 0,
    marketCap: 0,
    volume24h: 0,
    liquidity: 0,
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  };
}
