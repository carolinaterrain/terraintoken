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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Fetching dashboard metrics...');

    // Calculate date ranges
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // BATCH 1: Parallel holder snapshot queries (historical data)
    const [latestSnapshotResult, yesterdaySnapshotResult, weekSnapshotResult] = await Promise.all([
      supabase
        .from('holder_snapshots')
        .select('*')
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('holder_snapshots')
        .select('total_holders')
        .lte('snapshot_date', yesterday.toISOString().split('T')[0])
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('holder_snapshots')
        .select('total_holders')
        .lte('snapshot_date', weekAgo.toISOString().split('T')[0])
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const latestSnapshot = latestSnapshotResult.data;
    const yesterdaySnapshot = yesterdaySnapshotResult.data;
    const weekSnapshot = weekSnapshotResult.data;

    // Calculate holder changes
    const currentHolders = latestSnapshot?.total_holders || 0;
    const change24h = yesterdaySnapshot 
      ? currentHolders - yesterdaySnapshot.total_holders 
      : 0;
    const change7d = weekSnapshot 
      ? currentHolders - weekSnapshot.total_holders 
      : 0;

    // BATCH 2: Parallel on-chain and activity queries (live data)
    const [
      transactionsResult,
      recentPurchasesResult,
      toolEventsResult,
      proofsResult,
      rewardsResult,
      activeUsersResult,
    ] = await Promise.all([
      // Transaction count (24h)
      supabase
        .from('trn_purchases')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString()),
      
      // Recent purchases for buyer/seller analysis
      supabase
        .from('trn_purchases')
        .select('wallet_address, amount_trn')
        .gte('created_at', oneDayAgo.toISOString()),
      
      // Tool usage events (7 days) - optimized query
      supabase
        .from('analytics_events')
        .select('session_id')
        .gte('created_at', sevenDaysAgo.toISOString())
        .or('event_name.eq.tool_use,event_name.eq.terrainvision_scan,event_name.eq.flowguardian_check,event_name.ilike.tool_%'),
      
      // Proof submissions (24h)
      supabase
        .from('tool_usage_proofs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString()),
      
      // Rewards issued (24h)
      supabase
        .from('trn_rewards')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString()),
      
      // Active users (7 days)
      supabase
        .from('analytics_events')
        .select('session_id')
        .gte('created_at', sevenDaysAgo.toISOString()),
    ]);

    // Process results
    const transactions24h = transactionsResult.count || 0;
    const recentPurchases = recentPurchasesResult.data || [];
    
    const uniqueBuyers24h = new Set(
      recentPurchases.filter(p => p.amount_trn > 0).map(p => p.wallet_address)
    ).size;

    const uniqueSellers24h = new Set(
      recentPurchases.filter(p => p.amount_trn < 0).map(p => p.wallet_address)
    ).size;

    const volume24h = recentPurchases.reduce((sum, p) => sum + Math.abs(p.amount_trn), 0);
    
    const toolUsers7d = new Set(toolEventsResult.data?.map(e => e.session_id)).size;
    const proofsSubmitted24h = proofsResult.count || 0;
    const rewardsIssued24h = rewardsResult.count || 0;
    const activeUsers7d = new Set(activeUsersResult.data?.map(e => e.session_id)).size;

    const metrics = {
      onChain: {
        holders: {
          current: currentHolders,
          change24h,
          change7d,
        },
        transactions24h: transactions24h || 0,
        uniqueBuyers24h,
        uniqueSellers24h,
        volume24h,
        isLiveData: latestSnapshot?.is_live_data || false,
      },
      utility: {
        toolUsers7d,
        proofsSubmitted24h: proofsSubmitted24h || 0,
        rewardsIssued24h: rewardsIssued24h || 0,
        activeUsers7d,
      },
      trust: {
        lockPercentage: 0, // TODO: Integrate Streamflow API
        daysSinceDevSell: '∞',
        multisigStatus: 'active',
      },
      lastUpdated: new Date().toISOString(),
    };

    console.log('Dashboard metrics fetched:', metrics);

    return new Response(
      JSON.stringify(metrics),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in dashboard-metrics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        fallback: {
          onChain: { holders: { current: 0, change24h: 0, change7d: 0 } },
          utility: { toolUsers7d: 0, proofsSubmitted24h: 0, rewardsIssued24h: 0, activeUsers7d: 0 },
          trust: { lockPercentage: 0, daysSinceDevSell: '∞', multisigStatus: 'unknown' },
          lastUpdated: new Date().toISOString(),
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
