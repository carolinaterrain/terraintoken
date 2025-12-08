import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration: 2 minutes for fresh data
const CACHE_DURATION_MS = 120000;

interface UnifiedTokenData {
  // Supply data
  totalSupply: number;
  circulatingSupply: number;
  decimals: number;
  
  // Holder data
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
  
  // Market data
  priceUsd: string;
  priceSol: string;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  
  // Meta
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  cacheAge?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check cache first
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('*')
      .eq('id', 'unified-token-data')
      .single();

    const cacheAge = cached?.last_updated 
      ? Date.now() - new Date(cached.last_updated).getTime()
      : Infinity;
    
    // Return cached data if less than 2 minutes old
    if (cached && cacheAge < CACHE_DURATION_MS) {
      console.log('Returning cached unified token data');
      try {
        const cachedData = JSON.parse(cached.source || '{}');
        return new Response(
          JSON.stringify({
            ...cachedData,
            source: 'cache',
            cacheAge: Math.floor(cacheAge / 1000),
            lastUpdated: cached.last_updated,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }

    console.log('Fetching fresh unified token data...');

    // Fetch all data in parallel
    const [supplyData, holderData, marketData] = await Promise.all([
      fetchTokenSupply(HELIUS_API_KEY),
      fetchHolderData(HELIUS_API_KEY),
      fetchMarketData(),
    ]);

    const now = new Date().toISOString();
    
    const responseData: UnifiedTokenData = {
      // Supply - use blockchain truth (6 decimals)
      totalSupply: supplyData.totalSupply,
      circulatingSupply: supplyData.circulatingSupply,
      decimals: supplyData.decimals,
      
      // Holders
      holderCount: holderData.holderCount,
      holderTiers: holderData.tiers,
      top10Percentage: holderData.top10Percentage,
      
      // Market
      priceUsd: marketData.priceUsd,
      priceSol: marketData.priceSol,
      priceChange24h: marketData.priceChange24h,
      marketCap: marketData.marketCap,
      volume24h: marketData.volume24h,
      liquidity: marketData.liquidity,
      
      // Meta
      lastUpdated: now,
      source: 'live',
    };

    // Cache the result
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: 'unified-token-data',
        holder_count: holderData.holderCount,
        last_updated: now,
        source: JSON.stringify(responseData),
      });

    // Also update legacy caches for backwards compatibility
    await supabase
      .from('holder_count_cache')
      .upsert([
        {
          id: 'unified',
          holder_count: holderData.holderCount,
          last_updated: now,
          source: JSON.stringify({
            holderCount: holderData.holderCount,
            totalHolders: holderData.holderCount,
            tiers: holderData.tiers,
            top10Percentage: holderData.top10Percentage,
          }),
        },
      ]);

    console.log('Unified token data fetched and cached successfully');

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching unified token data:', error);
    
    // Try to return stale cache on error
    try {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
      const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      const { data: cached } = await supabase
        .from('holder_count_cache')
        .select('*')
        .eq('id', 'unified-token-data')
        .single();

      if (cached?.source) {
        const cachedData = JSON.parse(cached.source);
        return new Response(
          JSON.stringify({ 
            ...cachedData, 
            source: 'cache',
            lastUpdated: cached.last_updated,
            error: error instanceof Error ? error.message : 'Unknown error', 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (cacheError) {
      console.error('Cache fetch also failed:', cacheError);
    }
    
    // Return fallback data as last resort
    return new Response(
      JSON.stringify(getFallbackData()),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Fetch token supply from Helius
async function fetchTokenSupply(apiKey: string | undefined) {
  if (!apiKey) {
    console.warn('HELIUS_API_KEY not configured, using fallback supply');
    return { totalSupply: 1000000000000000, circulatingSupply: 550000000000000, decimals: 6 };
  }

  try {
    const [supplyResponse, holdersResponse] = await Promise.all([
      fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenSupply',
          params: [TRN_MINT_ADDRESS]
        })
      }),
      fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'getTokenLargestAccounts',
          params: [TRN_MINT_ADDRESS]
        })
      })
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
    
    // Calculate circulating supply
    let circulatingSupply = totalSupply;
    if (accounts.length > 0) {
      const largestAccount = accounts[0];
      const largestHolderAmount = parseInt(largestAccount.amount);
      const largestPercentage = (largestHolderAmount / totalSupply) * 100;
      
      // If largest holder has >40%, assume it's bonding curve/liquidity
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

// Fetch holder data from Helius DAS
async function fetchHolderData(apiKey: string | undefined) {
  const defaultTiers = { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 };
  
  if (!apiKey) {
    console.warn('HELIUS_API_KEY not configured, using fallback holder data');
    return { holderCount: 0, tiers: defaultTiers, top10Percentage: 0 };
  }

  try {
    const holders: Array<{ address: string; balance: number }> = [];
    let cursor: string | undefined;
    let pageCount = 0;
    const MAX_PAGES = 50;
    const PAGE_SIZE = 1000;

    do {
      const response = await fetch(
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
        }
      );

      if (!response.ok) {
        throw new Error(`Helius DAS API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Helius RPC error: ${data.error.message || JSON.stringify(data.error)}`);
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
    console.error('Error fetching holder data:', error);
    return { holderCount: 0, tiers: defaultTiers, top10Percentage: 0 };
  }
}

// Fetch market data from DexScreener
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
