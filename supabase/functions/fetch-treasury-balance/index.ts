import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TRN token constants
const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
const TRN_TREASURY_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";
const CACHE_KEY = 'treasury-balance';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface TreasuryBalanceResponse {
  balance: number;
  balanceFormatted: string;
  walletAddress: string;
  lastUpdated: string;
  source: 'helius' | 'fallback' | 'cache';
}

// Phase 3.1: Retry with exponential backoff and jitter
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting
      if (response.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 8000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

async function fetchTreasuryBalance(heliusApiKey: string): Promise<number> {
  const heliusUrl = `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`;
  
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
  });

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
    return `${(balance / 1_000_000_000).toFixed(2)}B`;
  }
  if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(2)}M`;
  }
  if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(2)}K`;
  }
  return balance.toLocaleString();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // Phase 3.2: Check cache first
    const { data: cached } = await supabase
      .from('holder_count_cache')
      .select('*')
      .eq('id', CACHE_KEY)
      .single();

    if (cached?.source) {
      const cacheAge = Date.now() - new Date(cached.last_updated).getTime();
      if (cacheAge < CACHE_TTL_MS) {
        try {
          const cachedData = JSON.parse(cached.source);
          console.log('Returning cached treasury balance:', cachedData.balance);
          return new Response(JSON.stringify({
            ...cachedData,
            source: 'cache'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        } catch (e) {
          console.warn('Failed to parse cached treasury data');
        }
      }
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
      
      const fallbackResponse: TreasuryBalanceResponse = {
        balance: 0,
        balanceFormatted: '—',
        walletAddress: TRN_TREASURY_WALLET,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    console.log('Fetching treasury balance for wallet:', TRN_TREASURY_WALLET);
    
    const balance = await fetchTreasuryBalance(heliusApiKey);
    
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
        console.log('Returning stale cache due to error');
        return new Response(JSON.stringify({
          ...cachedData,
          source: 'cache'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (e) {}
    }
    
    const fallbackResponse: TreasuryBalanceResponse = {
      balance: 0,
      balanceFormatted: '—',
      walletAddress: TRN_TREASURY_WALLET,
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    };
    
    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});