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

// Cache duration: 5 minutes for transactions (more time-sensitive)
const CACHE_DURATION_MS = 5 * 60 * 1000;
const CACHE_KEY = 'trn-transactions-cache';

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
        const cached = JSON.parse(cacheData.source);
        console.log('[fetch-trn-transactions] Returning cached transaction data');
        return new Response(
          JSON.stringify({
            ...cached,
            source: 'cache',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch {
        // Cache parse failed, continue to fetch
      }
    }

    // Check circuit breaker
    if (await isCircuitOpen(supabase)) {
      const status = await getCircuitStatus(supabase);
      console.log('[fetch-trn-transactions] Circuit breaker open');
      return new Response(
        JSON.stringify({
          transactions: [],
          lastUpdated: new Date().toISOString(),
          circuitStatus: status,
          source: 'circuit-open',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');

    if (!HELIUS_API_KEY) {
      throw new Error('HELIUS_API_KEY not configured');
    }

    console.log('[fetch-trn-transactions] Fetching recent TRN transactions...');

    // Fetch recent transactions using Helius Enhanced Transactions API with rate limiting protection
    const response = await fetchWithRetry(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/transactions?api-key=${HELIUS_API_KEY}&limit=20`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      supabase
    );

    if (!response.ok) {
      console.error('[fetch-trn-transactions] Helius API error:', response.status);
      throw new Error(`Helius API error: ${response.status}`);
    }

    const transactions = await response.json();
    console.log(`[fetch-trn-transactions] Found ${transactions.length} recent transactions`);

    // Parse and format transactions
    const formattedTxs = transactions.slice(0, 10).map((tx: any) => {
      const timestamp = tx.timestamp * 1000; // Convert to ms
      const type = tx.type?.toLowerCase().includes('swap') 
        ? (tx.nativeBalanceChange > 0 ? 'buy' : 'sell')
        : 'transfer';
      
      // Extract amount from token transfers
      let amount = 0;
      if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
        const trnTransfer = tx.tokenTransfers.find(
          (t: any) => t.mint === TRN_MINT_ADDRESS
        );
        if (trnTransfer) {
          amount = trnTransfer.tokenAmount || 0;
        }
      }

      return {
        signature: tx.signature,
        timestamp,
        type,
        amount,
        fromAddress: tx.feePayer?.substring(0, 8) + '...',
        toAddress: tx.accountData?.[0]?.account?.substring(0, 8) + '...' || 'unknown',
        success: !tx.err,
      };
    });

    const result = {
      transactions: formattedTxs,
      lastUpdated: new Date().toISOString(),
    };

    // Save to cache
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: CACHE_KEY,
        holder_count: formattedTxs.length,
        last_updated: result.lastUpdated,
        source: JSON.stringify(result),
      });

    return new Response(
      JSON.stringify({
        ...result,
        source: 'live',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[fetch-trn-transactions] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to return cached data on error
    const { data: cacheData } = await supabase
      .from('holder_count_cache')
      .select('source')
      .eq('id', CACHE_KEY)
      .single();

    if (cacheData?.source) {
      try {
        const cached = JSON.parse(cacheData.source);
        return new Response(
          JSON.stringify({
            ...cached,
            error: errorMessage,
            source: 'stale-cache',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch {
        // Cache parse failed
      }
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        transactions: [],
        source: 'error',
      }),
      {
        status: 200, // Return 200 with empty data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
