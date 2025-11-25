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

    // Get latest holder snapshot
    const { data: latestSnapshot } = await supabase
      .from('holder_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    // Get snapshot from 24h ago
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { data: yesterdaySnapshot } = await supabase
      .from('holder_snapshots')
      .select('total_holders')
      .lte('snapshot_date', yesterday.toISOString().split('T')[0])
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    // Get snapshot from 7 days ago
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weekSnapshot } = await supabase
      .from('holder_snapshots')
      .select('total_holders')
      .lte('snapshot_date', weekAgo.toISOString().split('T')[0])
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .single();

    // Calculate holder changes
    const currentHolders = latestSnapshot?.total_holders || 0;
    const change24h = yesterdaySnapshot 
      ? currentHolders - yesterdaySnapshot.total_holders 
      : 0;
    const change7d = weekSnapshot 
      ? currentHolders - weekSnapshot.total_holders 
      : 0;

    // Get recent transactions (24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { count: transactions24h } = await supabase
      .from('trn_purchases')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    // Get unique buyers/sellers 24h
    const { data: recentPurchases } = await supabase
      .from('trn_purchases')
      .select('wallet_address, amount_trn')
      .gte('created_at', oneDayAgo.toISOString());

    const uniqueBuyers24h = new Set(
      recentPurchases?.filter(p => p.amount_trn > 0).map(p => p.wallet_address)
    ).size;

    const uniqueSellers24h = new Set(
      recentPurchases?.filter(p => p.amount_trn < 0).map(p => p.wallet_address)
    ).size;

    const volume24h = recentPurchases?.reduce((sum, p) => sum + Math.abs(p.amount_trn), 0) || 0;

    // Get tool usage metrics (7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const { data: toolEvents } = await supabase
      .from('analytics_events')
      .select('event_name, session_id')
      .or('event_name.ilike.%tool%,event_name.ilike.%terrainvision%,event_name.ilike.%flowguardian%')
      .gte('created_at', sevenDaysAgo.toISOString());

    const toolUsers7d = new Set(toolEvents?.map(e => e.session_id)).size;

    // Get proofs submitted 24h
    const { count: proofsSubmitted24h } = await supabase
      .from('tool_usage_proofs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    // Get rewards issued 24h
    const { count: rewardsIssued24h } = await supabase
      .from('trn_rewards')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    // Get active users (7 days)
    const { data: activeUserEvents } = await supabase
      .from('analytics_events')
      .select('session_id')
      .gte('created_at', sevenDaysAgo.toISOString());

    const activeUsers7d = new Set(activeUserEvents?.map(e => e.session_id)).size;

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
