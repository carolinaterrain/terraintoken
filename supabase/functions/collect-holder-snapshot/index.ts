import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TRN_MINT_ADDRESS } from "../_shared/constants.ts";
import { 
  fetchWithRetry, 
  isCircuitOpen, 
  getCircuitStatus,
  isCacheValid,
  CONFIG 
} from "../_shared/heliusGateway.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache duration: 15 minutes between snapshots
const SNAPSHOT_CACHE_MS = 15 * 60 * 1000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Check if we have a recent snapshot (avoid redundant API calls)
    const today = new Date().toISOString().split('T')[0];
    const { data: existingSnapshot } = await supabase
      .from('holder_snapshots')
      .select('created_at, total_holders')
      .eq('snapshot_date', today)
      .single();

    if (existingSnapshot && isCacheValid(existingSnapshot.created_at, SNAPSHOT_CACHE_MS)) {
      console.log(`[collect-holder-snapshot] Recent snapshot exists (${existingSnapshot.total_holders} holders), skipping Helius call`);
      return new Response(
        JSON.stringify({
          success: true,
          date: today,
          holders: existingSnapshot.total_holders,
          source: 'cache',
          message: 'Using recent snapshot',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check circuit breaker before making Helius calls
    if (await isCircuitOpen(supabase)) {
      const status = await getCircuitStatus(supabase);
      console.log(`[collect-holder-snapshot] Circuit breaker open, returning cached data`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Circuit breaker open',
          circuitStatus: status,
          holders: existingSnapshot?.total_holders || 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    if (!HELIUS_API_KEY) {
      throw new Error('HELIUS_API_KEY is not configured');
    }

    console.log('[collect-holder-snapshot] Fetching TRN holder data using paginated getTokenAccounts...');

    // Paginate through ALL token accounts with rate limiting protection
    const holders: Array<{ address: string; balance: number }> = [];
    let cursor: string | undefined;
    let pageCount = 0;
    const MAX_PAGES = 50;
    const PAGE_SIZE = 1000;

    do {
      const response = await fetchWithRetry(
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
        },
        supabase
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Helius DAS API error: ${response.status}`, errorText);
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

    // Validate that we got real wallet addresses
    const hasRealAddresses = holders.some(h => 
      h.address.length > 20 && !h.address.startsWith('holder')
    );

    if (!hasRealAddresses && holders.length > 0) {
      throw new Error('Received suspicious data from Helius - addresses look like mock data');
    }

    console.log(`✅ Successfully fetched ${holders.length} LIVE holders from Helius DAS API`);

    const holderAddresses = holders.map(h => h.address);
    const holderBalances = holders.reduce((acc, h) => {
      acc[h.address] = h.balance;
      return acc;
    }, {} as Record<string, number>);

    console.log(`Saving snapshot for ${today} with ${holders.length} holders`);

    // Upsert snapshot (update if exists, insert if not)
    const { error } = await supabase
      .from('holder_snapshots')
      .upsert({
        snapshot_date: today,
        total_holders: holders.length,
        holder_addresses: holderAddresses,
        holder_balances: holderBalances,
        is_live_data: true,
      }, {
        onConflict: 'snapshot_date',
      });

    if (error) {
      throw error;
    }

    // Also update the holder_count_cache for consistency
    await supabase
      .from('holder_count_cache')
      .upsert({
        id: 'current',
        holder_count: holders.length,
        last_updated: new Date().toISOString(),
        source: 'helius-das-snapshot',
      });

    console.log('Snapshot saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        date: today,
        holders: holders.length,
        source: 'live',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in collect-holder-snapshot:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to return cached data on error
    const { data: cachedSnapshot } = await supabase
      .from('holder_snapshots')
      .select('total_holders, snapshot_date')
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        holders: cachedSnapshot?.total_holders || 0,
        source: 'fallback',
      }),
      {
        status: 200, // Return 200 with error info so frontend can handle gracefully
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
