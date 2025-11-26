import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TRN_MINT_ADDRESS, getHolderTier, HOLDER_TIERS } from "../_shared/constants.ts";

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

    console.log('Fetching TRN holder data from Helius RPC...');

    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');

    let holders: Array<{ address: string; balance: number }> = [];
    let isLiveData = false;

    try {
      if (!HELIUS_API_KEY) {
        throw new Error('HELIUS_API_KEY is not configured');
      }

      console.log('Calling Helius RPC with API key:', HELIUS_API_KEY.substring(0, 8) + '...');

      const response = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'get-holders',
            method: 'getTokenLargestAccounts',
            params: [TRN_MINT_ADDRESS],
          }),
        }
      );

      console.log('Helius RPC response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Helius RPC error: ${response.status} - ${errorText}`);
      }

      const rpcData = await response.json();
      console.log('RPC Data structure:', JSON.stringify(rpcData, null, 2));
      
      if (rpcData.error) {
        throw new Error(`RPC error: ${JSON.stringify(rpcData.error)}`);
      }

      const holderData = rpcData.result?.value || [];

      if (holderData.length === 0) {
        throw new Error('Helius returned no holder data');
      }

      holders = holderData
        .map((h: any) => ({
          address: h.address,
          balance: parseInt(h.amount, 10) / 1e6, // Convert from raw to TRN with 6 decimals
        }))
        .filter((h: any) => h.balance >= 1); // Only holders with >= 1 TRN

      // Validate that we got real wallet addresses (not mock data)
      const hasRealAddresses = holders.some(h => 
        h.address.length > 20 && !h.address.startsWith('holder')
      );

      if (!hasRealAddresses) {
        throw new Error('Received suspicious data from Helius - addresses look like mock data');
      }

      isLiveData = true;
      console.log(`✅ Successfully fetched ${holders.length} LIVE holders from Helius RPC`);
    } catch (error) {
      console.error('❌ Error fetching from Helius:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      // DO NOT use fallback mock data - throw error instead
      throw new Error(`Failed to fetch live holder data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

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
        is_live_data: isLiveData,
      }, {
        onConflict: 'snapshot_date',
      });

    if (error) {
      throw error;
    }

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
