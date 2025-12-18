import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TRN_MINT_ADDRESS } from "../_shared/constants.ts";
import { 
  fetchWithRetry, 
  isCircuitOpen, 
  getCircuitStatus,
  isCacheValid 
} from "../_shared/heliusGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration: 15 minutes
const CACHE_DURATION_MS = 15 * 60 * 1000;
const CACHE_KEY = 'token-supply-cache';

interface SupplyCache {
  totalSupply: number;
  circulatingSupply: number;
  decimals: number;
  lastUpdated: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Check cache first
    const { data: cacheData } = await supabase
      .from('holder_count_cache')
      .select('source, last_updated')
      .eq('id', CACHE_KEY)
      .single();

    if (cacheData?.source && isCacheValid(cacheData.last_updated, CACHE_DURATION_MS)) {
      try {
        const cached: SupplyCache = JSON.parse(cacheData.source);
        console.log('[fetch-token-supply] Returning cached supply data');
        return new Response(
          JSON.stringify({
            ...cached,
            source: 'cache',
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=300',
            } 
          }
        );
      } catch {
        // Cache parse failed, continue to fetch
      }
    }

    // Check circuit breaker
    if (await isCircuitOpen(supabase)) {
      const status = await getCircuitStatus(supabase);
      console.log('[fetch-token-supply] Circuit breaker open');
      
      // Return fallback data
      return new Response(
        JSON.stringify({
          totalSupply: 1006699550,
          circulatingSupply: 550000000,
          decimals: 2,
          lastUpdated: new Date().toISOString(),
          isStale: true,
          circuitStatus: status,
          source: 'fallback',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    
    if (!HELIUS_API_KEY) {
      console.error('HELIUS_API_KEY not configured');
      throw new Error('API key not configured');
    }

    console.log('[fetch-token-supply] Fetching token supply for TRN...');

    // Parallelize API calls for better performance with rate limiting protection
    const [supplyResponse, holdersResponse] = await Promise.all([
      fetchWithRetry(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenSupply',
            params: [TRN_MINT_ADDRESS]
          })
        },
        supabase
      ),
      fetchWithRetry(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'getTokenLargestAccounts',
            params: [TRN_MINT_ADDRESS]
          })
        },
        supabase
      )
    ]);

    if (!supplyResponse.ok) {
      throw new Error(`RPC error: ${supplyResponse.statusText}`);
    }

    const data = await supplyResponse.json();
    
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    const supply = data.result?.value;
    
    if (!supply) {
      throw new Error('No supply data returned');
    }

    const holdersData = await holdersResponse.json();
    const accounts = holdersData.result?.value || [];
    
    // Calculate circulating supply (total - largest holder if it's bonding curve)
    const totalSupply = parseInt(supply.amount);
    const decimals = supply.decimals;
    
    // Estimate circulating supply (total supply minus bonding curve if applicable)
    let circulatingSupply = totalSupply;
    if (accounts.length > 0) {
      const largestAccount = accounts[0];
      // If largest holder has >40%, assume it's bonding curve/liquidity
      const largestHolderAmount = parseInt(largestAccount.amount);
      const largestPercentage = (largestHolderAmount / totalSupply) * 100;
      
      if (largestPercentage > 40) {
        circulatingSupply = totalSupply - largestHolderAmount;
      }
    }

    const result: SupplyCache = {
      totalSupply,
      circulatingSupply,
      decimals,
      lastUpdated: new Date().toISOString(),
    };

    // Save to cache
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: CACHE_KEY,
        holder_count: 0,
        last_updated: result.lastUpdated,
        source: JSON.stringify(result),
      });

    console.log(`[fetch-token-supply] Token supply fetched: ${totalSupply / Math.pow(10, decimals)} TRN`);

    return new Response(
      JSON.stringify({
        ...result,
        source: 'live',
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        } 
      }
    );
  } catch (error) {
    console.error('[fetch-token-supply] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return fallback data with error flag
    return new Response(
      JSON.stringify({
        totalSupply: 1006699550, // Last known supply from blockchain
        circulatingSupply: 550000000, // Estimated circulating
        decimals: 2,
        lastUpdated: new Date().toISOString(),
        error: errorMessage,
        isStale: true,
        source: 'fallback',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 with error flag so UI can show fallback
      }
    );
  }
});
