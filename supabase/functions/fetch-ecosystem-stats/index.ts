import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CT_SYNC_URL = 'https://izxzkqprhekrgiwakepm.supabase.co/functions/v1/trn-sync';

interface SyncResponse {
  success: boolean;
  timestamp: string;
  syncVersion: string;
  mode: string;
  data: {
    liveStats?: {
      price_usd: number;
      price_sol: number;
      price_change_24h: number;
      market_cap_usd: number;
      current_supply: number;
      max_supply: number;
      total_burned: number;
      volume_24h_usd: number;
      liquidity_usd: number;
      active_users: number;
      data_source: string;
      last_updated: string;
    };
    rewardStats?: {
      total_rewards_issued: number;
      total_rewards_count: number;
      pending_claims: number;
      claimed_rewards: number;
      unique_earners: number;
      rewards_by_type: Record<string, number>;
    };
    treasury?: {
      current_balance: number;
      total_income: number;
      total_expenses: number;
      recent_transactions: Array<{
        type: string;
        amount: number;
        description: string;
        tx_signature: string | null;
        solscan_url: string | null;
        timestamp: string;
      }>;
      last_updated: string;
    };
    foundation?: {
      total_allocated: number;
      pending_disbursements: number;
      grant_stats: {
        total_proposals: number;
        approved: number;
        funded: number;
        pending: number;
        completed: number;
      };
      recent_grants: Array<{
        title: string;
        recipient_type: string;
        amount: number;
        status: string;
      }>;
    };
    rewardsPool?: {
      current_balance: number;
      total_deposited: number;
      total_distributed: number;
      last_updated: string;
    };
    burns?: {
      total_burned: number;
      burn_count: number;
      pending_burns: number;
      burn_velocity_24h: number;
      burns_by_type: Record<string, number>;
      recent_burns: Array<{
        amount: number;
        burn_type: string;
        tx_signature: string;
        solscan_url: string;
        confirmed_at: string;
      }>;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'full';
    
    // Validate mode
    const validModes = ['stats', 'rewards', 'treasury', 'burns', 'full'];
    if (!validModes.includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mode', validModes }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const TRN_SYNC_SECRET = Deno.env.get('TRN_SYNC_SECRET');
    
    if (!TRN_SYNC_SECRET) {
      console.error('TRN_SYNC_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Sync secret not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching ecosystem stats from Carolina Terrain (mode: ${mode})`);

    // Call Carolina Terrain's trn-sync endpoint
    const syncResponse = await fetch(`${CT_SYNC_URL}?mode=${mode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-trn-sync-secret': TRN_SYNC_SECRET,
      },
    });

    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      console.error(`CT sync failed: ${syncResponse.status} - ${errorText}`);
      
      // Return cached/fallback data if CT is unavailable
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Carolina Terrain sync temporarily unavailable',
          fallback: true,
          data: await getFallbackData(mode),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const syncData: SyncResponse = await syncResponse.json();
    
    // Cache the data in our local database
    await cacheEcosystemData(syncData, mode);

    console.log(`Successfully synced ecosystem stats (mode: ${mode})`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        mode,
        source: 'carolina_terrain',
        data: syncData.data,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fetch ecosystem stats error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true,
        data: await getFallbackData('full'),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function cacheEcosystemData(syncData: SyncResponse, mode: string) {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Cache live stats if present
    if (syncData.data?.liveStats) {
      const stats = syncData.data.liveStats;
      await supabase.from('trn_live_stats').upsert({
        id: 'ecosystem_cache',
        price_usd: stats.price_usd,
        price_sol: stats.price_sol,
        price_change_24h: stats.price_change_24h,
        market_cap_usd: stats.market_cap_usd,
        current_supply: stats.current_supply,
        max_supply: stats.max_supply,
        total_burned: stats.total_burned,
        volume_24h_usd: stats.volume_24h_usd,
        liquidity_usd: stats.liquidity_usd,
        active_users: stats.active_users,
        data_source: 'carolina_terrain_sync',
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }

    console.log(`Cached ecosystem data for mode: ${mode}`);
  } catch (error) {
    console.error('Error caching ecosystem data:', error);
  }
}

async function getFallbackData(mode: string) {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get cached stats from our local database
    const { data: cachedStats } = await supabase
      .from('trn_live_stats')
      .select('*')
      .eq('id', 'ecosystem_cache')
      .single();

    // Get burn stats from local token_burns table
    const { data: burns } = await supabase
      .from('token_burns')
      .select('*')
      .eq('status', 'confirmed')
      .order('burned_at', { ascending: false })
      .limit(10);

    const { data: burnTotal } = await supabase
      .from('token_burns')
      .select('amount')
      .eq('status', 'confirmed');

    const totalBurned = burnTotal?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

    // Get rewards stats from local ledger
    const { data: rewards } = await supabase
      .from('trn_rewards_ledger')
      .select('amount_trn, status')
      .limit(1000);

    const totalRewards = rewards?.reduce((sum, r) => sum + (r.amount_trn || 0), 0) || 0;
    const pendingRewards = rewards?.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.amount_trn || 0), 0) || 0;

    return {
      liveStats: cachedStats ? {
        price_usd: cachedStats.price_usd || 0,
        price_sol: cachedStats.price_sol || 0,
        price_change_24h: cachedStats.price_change_24h || 0,
        market_cap_usd: cachedStats.market_cap_usd || 0,
        current_supply: cachedStats.current_supply || 1000000000,
        max_supply: 1000000000,
        total_burned: totalBurned,
        volume_24h_usd: cachedStats.volume_24h_usd || 0,
        liquidity_usd: cachedStats.liquidity_usd || 0,
        active_users: cachedStats.active_users || 0,
        data_source: 'local_cache',
        last_updated: cachedStats.created_at,
      } : null,
      burns: {
        total_burned: totalBurned,
        burn_count: burns?.length || 0,
        recent_burns: burns?.map(b => ({
          amount: b.amount,
          burn_type: b.burn_type || 'unknown',
          tx_signature: b.tx_signature,
          solscan_url: b.tx_signature ? `https://solscan.io/tx/${b.tx_signature}` : null,
          confirmed_at: b.burned_at,
        })) || [],
      },
      rewardStats: {
        total_rewards_issued: totalRewards,
        total_rewards_count: rewards?.length || 0,
        pending_claims: pendingRewards,
      },
    };
  } catch (error) {
    console.error('Error getting fallback data:', error);
    return {
      liveStats: {
        price_usd: 0,
        price_sol: 0,
        price_change_24h: 0,
        market_cap_usd: 0,
        current_supply: 1000000000,
        max_supply: 1000000000,
        total_burned: 0,
        volume_24h_usd: 0,
        liquidity_usd: 0,
        active_users: 0,
        data_source: 'fallback',
        last_updated: new Date().toISOString(),
      },
    };
  }
}
