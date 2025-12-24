/**
 * Get Ecosystem Health KPIs
 * Returns aggregated health metrics for admin/observability dashboard
 * Includes per-producer stats, last-seen timestamps, and alert conditions
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase } from "../_shared/ecosystem.ts";

// Alert thresholds
const ALERT_THRESHOLDS = {
  NO_EVENTS_HOURS: 24, // Alert if no events from producer for 24h
  HIGH_FAILURE_RATE: 0.1, // Alert if >10% failure rate
  STALE_WEBHOOK_HOURS: 1, // Alert if webhooks stuck for >1h
};

interface ProducerStats {
  producer: string;
  events_24h: number;
  events_7d: number;
  last_event_at: string | null;
  hours_since_last_event: number | null;
  is_stale: boolean;
}

interface HealthKPIs {
  // Webhook metrics
  webhooks_total: number;
  webhooks_pending: number;
  webhooks_failed: number;
  webhooks_in_flight: number;
  webhook_failure_rate: number;
  
  // Event metrics
  events_last_hour: number;
  events_last_24h: number;
  events_last_7d: number;
  last_event_at: string | null;
  
  // Per-producer breakdown
  producers: ProducerStats[];
  
  // Report metrics
  reports_finalized: number;
  reports_pending: number;
  total_trn_burned: number;
  
  // Wallet metrics
  wallets_verified: number;
  wallets_connected: number;
  
  // Lifecycle metrics
  properties_count: number;
  work_orders_pending: number;
  compliance_overdue: number;
  
  // Alerts
  alerts: string[];
  
  // Meta
  snapshot_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getServiceSupabase();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const alerts: string[] = [];

    // Webhook metrics
    const [
      webhooksTotal,
      webhooksPending,
      webhooksFailed,
      webhooksInFlight,
    ] = await Promise.all([
      supabase.from('webhook_inbox').select('id', { count: 'exact', head: true }),
      supabase.from('webhook_inbox').select('id', { count: 'exact', head: true })
        .is('processed_at', null).is('error_message', null),
      supabase.from('webhook_inbox').select('id', { count: 'exact', head: true })
        .is('processed_at', null).not('error_message', 'is', null),
      supabase.from('webhook_inbox').select('id', { count: 'exact', head: true })
        .not('claimed_at', 'is', null).is('processed_at', null),
    ]);

    // Event counts
    const [
      eventsLastHour,
      eventsLast24h,
      eventsLast7d,
      lastEvent,
    ] = await Promise.all([
      supabase.from('ecosystem_events').select('id', { count: 'exact', head: true })
        .gte('created_at', oneHourAgo.toISOString()),
      supabase.from('ecosystem_events').select('id', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString()),
      supabase.from('ecosystem_events').select('id', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString()),
      supabase.from('ecosystem_events').select('created_at')
        .order('created_at', { ascending: false }).limit(1).single(),
    ]);

    // Per-producer stats
    const { data: producerEvents } = await supabase
      .from('ecosystem_events')
      .select('producer, created_at')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false });

    // Group by producer
    const producerMap = new Map<string, { events24h: number; events7d: number; lastEventAt: string | null }>();
    const knownProducers = ['terrainvision', 'stormwaterscm', 'carolinaterrain', 'terrainguard', 'trn'];
    
    knownProducers.forEach(p => {
      producerMap.set(p, { events24h: 0, events7d: 0, lastEventAt: null });
    });

    producerEvents?.forEach(event => {
      const producer = event.producer || 'unknown';
      const eventTime = new Date(event.created_at);
      
      if (!producerMap.has(producer)) {
        producerMap.set(producer, { events24h: 0, events7d: 0, lastEventAt: null });
      }
      
      const stats = producerMap.get(producer)!;
      stats.events7d++;
      
      if (eventTime >= oneDayAgo) {
        stats.events24h++;
      }
      
      if (!stats.lastEventAt || eventTime > new Date(stats.lastEventAt)) {
        stats.lastEventAt = event.created_at;
      }
    });

    const producers: ProducerStats[] = Array.from(producerMap.entries()).map(([producer, stats]) => {
      const hoursSinceLastEvent = stats.lastEventAt
        ? (now.getTime() - new Date(stats.lastEventAt).getTime()) / (1000 * 60 * 60)
        : null;
      
      const isStale = hoursSinceLastEvent !== null && hoursSinceLastEvent > ALERT_THRESHOLDS.NO_EVENTS_HOURS;
      
      // Add alert for stale producers (only if they've ever sent events)
      if (isStale && stats.events7d > 0) {
        alerts.push(`No events from ${producer} for ${Math.round(hoursSinceLastEvent!)}h`);
      }
      
      return {
        producer,
        events_24h: stats.events24h,
        events_7d: stats.events7d,
        last_event_at: stats.lastEventAt,
        hours_since_last_event: hoursSinceLastEvent ? Math.round(hoursSinceLastEvent * 10) / 10 : null,
        is_stale: isStale,
      };
    });

    // Report metrics
    const [reportsFinalized, reportsPending, totalBurnedData] = await Promise.all([
      supabase.from('monthly_ecosystem_reports').select('id', { count: 'exact', head: true })
        .eq('is_finalized', true),
      supabase.from('monthly_ecosystem_reports').select('id', { count: 'exact', head: true })
        .eq('is_finalized', false),
      supabase.from('monthly_ecosystem_reports').select('trn_burned').eq('is_finalized', true),
    ]);

    const totalTrnBurned = totalBurnedData.data?.reduce((sum, r) => sum + (r.trn_burned || 0), 0) || 0;

    // Wallet metrics
    const [walletsVerified, walletsConnected] = await Promise.all([
      supabase.from('wallet_link_challenges').select('id', { count: 'exact', head: true })
        .not('verified_at', 'is', null),
      supabase.from('wallet_connections').select('id', { count: 'exact', head: true }),
    ]);

    // Lifecycle metrics
    const [propertiesCount, workOrdersPending, complianceOverdue] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('work_orders').select('id', { count: 'exact', head: true })
        .in('status', ['draft', 'quoted', 'approved', 'scheduled']),
      supabase.from('compliance_schedules').select('id', { count: 'exact', head: true })
        .eq('status', 'overdue'),
    ]);

    // Calculate failure rate
    const totalWebhooks = webhooksTotal.count || 0;
    const failedWebhooks = webhooksFailed.count || 0;
    const failureRate = totalWebhooks > 0 ? failedWebhooks / totalWebhooks : 0;
    
    if (failureRate > ALERT_THRESHOLDS.HIGH_FAILURE_RATE) {
      alerts.push(`High webhook failure rate: ${(failureRate * 100).toFixed(1)}%`);
    }

    // Check for stuck webhooks
    const stuckCount = webhooksInFlight.count || 0;
    if (stuckCount > 0) {
      alerts.push(`${stuckCount} webhook(s) stuck in processing`);
    }

    const kpis: HealthKPIs = {
      // Webhook metrics
      webhooks_total: totalWebhooks,
      webhooks_pending: webhooksPending.count || 0,
      webhooks_failed: failedWebhooks,
      webhooks_in_flight: stuckCount,
      webhook_failure_rate: Math.round(failureRate * 1000) / 1000,
      
      // Event metrics
      events_last_hour: eventsLastHour.count || 0,
      events_last_24h: eventsLast24h.count || 0,
      events_last_7d: eventsLast7d.count || 0,
      last_event_at: lastEvent.data?.created_at || null,
      
      // Per-producer breakdown
      producers,
      
      // Report metrics
      reports_finalized: reportsFinalized.count || 0,
      reports_pending: reportsPending.count || 0,
      total_trn_burned: totalTrnBurned,
      
      // Wallet metrics
      wallets_verified: walletsVerified.count || 0,
      wallets_connected: walletsConnected.count || 0,
      
      // Lifecycle metrics
      properties_count: propertiesCount.count || 0,
      work_orders_pending: workOrdersPending.count || 0,
      compliance_overdue: complianceOverdue.count || 0,
      
      // Alerts
      alerts,
      
      // Meta
      snapshot_at: now.toISOString(),
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
