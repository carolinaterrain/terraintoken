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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');

    if (!HELIUS_API_KEY) {
      throw new Error('HELIUS_API_KEY is not configured');
    }

    console.log('Fetching TRN holder data using paginated getTokenAccounts...');

    // Paginate through ALL token accounts
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

    const today = new Date().toISOString().split('T')[0];

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
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in collect-holder-snapshot:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
