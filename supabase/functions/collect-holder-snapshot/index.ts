import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    console.log('Fetching TRN holder data...');

    // Mock holder data for now - in production, use Helius RPC API
    // Example: https://api.helius.xyz/v0/addresses/{mint}/holders
    const mockHolders = Array.from({ length: 1137 }, (_, i) => ({
      address: `holder${i}`,
      balance: Math.floor(Math.random() * 1000000) + 1000,
    })).filter(h => h.balance >= 1); // Only holders with >= 1 TRN

    const holderAddresses = mockHolders.map(h => h.address);
    const holderBalances = mockHolders.reduce((acc, h) => {
      acc[h.address] = h.balance;
      return acc;
    }, {} as Record<string, number>);

    const today = new Date().toISOString().split('T')[0];

    console.log(`Saving snapshot for ${today} with ${mockHolders.length} holders`);

    // Upsert snapshot (update if exists, insert if not)
    const { error } = await supabase
      .from('holder_snapshots')
      .upsert({
        snapshot_date: today,
        total_holders: mockHolders.length,
        holder_addresses: holderAddresses,
        holder_balances: holderBalances,
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
        holders: mockHolders.length,
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
