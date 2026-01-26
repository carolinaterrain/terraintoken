import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { 
  fetchWithRetry, 
  isCircuitOpen, 
  isCacheValid 
} from "../_shared/heliusGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TRN token constants - Token-2022 with Interest-Bearing Extension
const TRN_MINT_ADDRESS = "Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m";
const TRN_TREASURY_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";
const CACHE_KEY = 'treasury-balance';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes - reduced API calls

interface TreasuryBalanceResponse {
  balance: number;
  balanceFormatted: string;
  walletAddress: string;
  lastUpdated: string;
  source: 'helius' | 'fallback' | 'cache';
  cacheAgeMinutes?: number;
}

async function fetchTreasuryBalance(heliusApiKey: string, supabase: any): Promise<number> {
  const heliusUrl = `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`;
  
  // Use shared circuit breaker from heliusGateway
  const response = await fetchWithRetry(heliusUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'treasury-balance',
      method: 'getTokenAccountsByOwner',
      params: [
        TRN_TREASURY_WALLET,
        { mint: TRN_MINT_ADDRESS },
        { encoding: 'jsonParsed' }
      ]
    })
  }, supabase);

  if (!response.ok) {
    throw new Error(`Helius RPC error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  const accounts = data.result?.value || [];
  
  if (accounts.length === 0) {
    console.log('No TRN token accounts found for treasury wallet');
    return 0;
  }

  let totalBalance = 0;
  for (const account of accounts) {
    const tokenAmount = account.account?.data?.parsed?.info?.tokenAmount;
    if (tokenAmount) {
      totalBalance += Number(tokenAmount.uiAmount || 0);
    }
  }

  return totalBalance;
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000_000) {
    return `${(balance / 1_000_000_000).toFixed(2)}B TRN`;
  }
  if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(2)}M TRN`;
  }
  if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(2)}K TRN`;
  }
  return `${balance.toLocaleString()} TRN`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Check cache first with 30 minute TTL
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('*')
      .eq('id', CACHE_KEY)
      .single();

    if (cached?.source) {
      const cacheValid = isCacheValid(cached.last_updated, CACHE_TTL_MS);
      
      if (cacheValid) {
        try {
          const cachedData = JSON.parse(cached.source);
          const cacheAgeMinutes = Math.floor((Date.now() - new Date(cached.last_updated).getTime()) / 60000);
          console.log(`Returning cached treasury balance: ${cachedData.balance} (${cacheAgeMinutes}m old)`);
          return new Response(JSON.stringify({
            ...cachedData,
            source: 'cache',
            cacheAgeMinutes
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        } catch (e) {
          console.warn('Failed to parse cached treasury data');
        }
      }
    }

    // Check if circuit breaker is open before attempting fetch
    const circuitOpen = await isCircuitOpen(supabase);
    if (circuitOpen) {
      console.log('Circuit breaker open, returning stale cache if available');
      
      // Return stale cache when circuit is open
      if (cached?.source) {
        try {
          const cachedData = JSON.parse(cached.source);
          const cacheAgeMinutes = Math.floor((Date.now() - new Date(cached.last_updated).getTime()) / 60000);
          return new Response(JSON.stringify({
            ...cachedData,
            source: 'cache',
            cacheAgeMinutes
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        } catch (e) {}
      }
      
      // No cache available - return fallback
      return new Response(JSON.stringify({
        balance: 0,
        balanceFormatted: '—',
        walletAddress: TRN_TREASURY_WALLET,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    const heliusApiKey = Deno.env.get('HELIUS_API_KEY');
    
    if (!heliusApiKey) {
      console.error('HELIUS_API_KEY not configured');
      // Return cached data if available, even if stale
      if (cached?.source) {
        try {
          const cachedData = JSON.parse(cached.source);
          return new Response(JSON.stringify({
            ...cachedData,
            source: 'cache'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        } catch (e) {}
      }
      
      return new Response(JSON.stringify({
        balance: 0,
        balanceFormatted: '—',
        walletAddress: TRN_TREASURY_WALLET,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    console.log('Fetching treasury balance for wallet:', TRN_TREASURY_WALLET);
    
    const balance = await fetchTreasuryBalance(heliusApiKey, supabase);
    
    console.log(`Treasury balance: ${balance.toLocaleString()} TRN`);

    const response: TreasuryBalanceResponse = {
      balance,
      balanceFormatted: formatBalance(balance),
      walletAddress: TRN_TREASURY_WALLET,
      lastUpdated: new Date().toISOString(),
      source: 'helius'
    };

    // Cache the result
    await supabase.from('holder_count_cache').upsert({
      id: CACHE_KEY,
      holder_count: balance,
      source: JSON.stringify(response),
      last_updated: new Date().toISOString()
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error fetching treasury balance:', error);
    
    // Return cached data on error
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('*')
      .eq('id', CACHE_KEY)
      .single();

    if (cached?.source) {
      try {
        const cachedData = JSON.parse(cached.source);
        const cacheAgeMinutes = Math.floor((Date.now() - new Date(cached.last_updated).getTime()) / 60000);
        console.log('Returning stale cache due to error');
        return new Response(JSON.stringify({
          ...cachedData,
          source: 'cache',
          cacheAgeMinutes
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (e) {}
    }
    
    return new Response(JSON.stringify({
      balance: 0,
      balanceFormatted: '—',
      walletAddress: TRN_TREASURY_WALLET,
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});
