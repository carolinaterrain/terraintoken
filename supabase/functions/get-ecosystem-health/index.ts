/**
 * Get Ecosystem Health KPIs
 * Returns aggregated health metrics for admin dashboard
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase } from "../_shared/ecosystem.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getServiceSupabase();

    // Get webhook metrics
    const { data: webhooksFailed } = await supabase
      .from('webhook_inbox')
      .select('id', { count: 'exact', head: true })
      .is('processed_at', null)
      .not('error_message', 'is', null);

    const { data: webhooksInFlight } = await supabase
      .from('webhook_inbox')
      .select('id', { count: 'exact', head: true })
      .not('claimed_at', 'is', null)
      .is('processed_at', null);

    const { data: eventsLastHour } = await supabase
      .from('ecosystem_events')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    const { data: lastWebhook } = await supabase
      .from('webhook_inbox')
      .select('received_at')
      .order('received_at', { ascending: false })
      .limit(1)
      .single();

    const { data: lastEvent } = await supabase
      .from('ecosystem_events')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get report metrics
    const { data: reportsFinalized } = await supabase
      .from('monthly_ecosystem_reports')
      .select('id', { count: 'exact', head: true })
      .eq('is_finalized', true);

    const { data: reportsPending } = await supabase
      .from('monthly_ecosystem_reports')
      .select('id', { count: 'exact', head: true })
      .eq('is_finalized', false);

    const { data: totalBurned } = await supabase
      .from('monthly_ecosystem_reports')
      .select('trn_burned')
      .eq('is_finalized', true);

    const totalTrnBurned = totalBurned?.reduce((sum, r) => sum + (r.trn_burned || 0), 0) || 0;

    // Get wallet metrics
    const { data: walletsVerified } = await supabase
      .from('wallet_link_challenges')
      .select('id', { count: 'exact', head: true })
      .not('verified_at', 'is', null);

    const kpis = {
      webhooks_failed: webhooksFailed?.length || 0,
      webhooks_in_flight: webhooksInFlight?.length || 0,
      events_last_hour: eventsLastHour?.length || 0,
      last_webhook_received: lastWebhook?.received_at || null,
      last_event_created: lastEvent?.created_at || null,
      reports_finalized: reportsFinalized?.length || 0,
      reports_pending: reportsPending?.length || 0,
      total_trn_burned: totalTrnBurned,
      wallets_verified: walletsVerified?.length || 0,
      snapshot_at: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(kpis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-ecosystem-health:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
