/**
 * Check Ecosystem Health and Send Alerts
 * Scheduled function (call via cron) to monitor ecosystem health
 * and send alerts when producers go stale or failure rates spike
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, getServiceSupabase } from "../_shared/ecosystem.ts";

const ALERT_THRESHOLDS = {
  NO_EVENTS_HOURS: 24,
  HIGH_FAILURE_RATE: 0.1,
  STUCK_WEBHOOK_HOURS: 1,
};

const ADMIN_EMAIL = "admin@terraintoken.fun";

interface Alert {
  type: "ecosystem" | "error" | "security";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify cron secret for scheduled invocation
  const cronSecret = req.headers.get('x-cron-secret');
  const expectedSecret = Deno.env.get('CRON_API_KEY');
  
  if (cronSecret !== expectedSecret && req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = getServiceSupabase();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const alerts: Alert[] = [];
    const knownProducers = ['terrainvision', 'stormwaterscm', 'carolinaterrain', 'terrainguard'];

    console.log('Running ecosystem health check...');

    // Check each producer for staleness
    for (const producer of knownProducers) {
      const { data: lastEvent } = await supabase
        .from('ecosystem_events')
        .select('created_at')
        .eq('producer', producer)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastEvent) {
        const hoursSinceLastEvent = (now.getTime() - new Date(lastEvent.created_at).getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastEvent > ALERT_THRESHOLDS.NO_EVENTS_HOURS) {
          alerts.push({
            type: 'ecosystem',
            severity: hoursSinceLastEvent > 48 ? 'high' : 'medium',
            title: `${producer} has gone silent`,
            message: `No events received from ${producer} for ${Math.round(hoursSinceLastEvent)} hours. Last event: ${lastEvent.created_at}`,
            metadata: {
              producer,
              hours_since_last_event: Math.round(hoursSinceLastEvent),
              last_event_at: lastEvent.created_at,
            },
          });
        }
      } else {
        // Check if we've ever seen events from this producer
        const { count } = await supabase
          .from('ecosystem_events')
          .select('id', { count: 'exact', head: true })
          .eq('producer', producer);
        
        if (count === 0) {
          console.log(`Producer ${producer} has never sent events - skipping alert`);
        }
      }
    }

    // Check webhook failure rate
    const { count: totalWebhooks } = await supabase
      .from('webhook_inbox')
      .select('id', { count: 'exact', head: true })
      .gte('received_at', oneDayAgo.toISOString());

    const { count: failedWebhooks } = await supabase
      .from('webhook_inbox')
      .select('id', { count: 'exact', head: true })
      .gte('received_at', oneDayAgo.toISOString())
      .not('error_message', 'is', null);

    if (totalWebhooks && totalWebhooks > 10) {
      const failureRate = (failedWebhooks || 0) / totalWebhooks;
      if (failureRate > ALERT_THRESHOLDS.HIGH_FAILURE_RATE) {
        alerts.push({
          type: 'error',
          severity: failureRate > 0.25 ? 'high' : 'medium',
          title: 'High webhook failure rate',
          message: `Webhook failure rate is ${(failureRate * 100).toFixed(1)}% (${failedWebhooks}/${totalWebhooks}) in the last 24 hours.`,
          metadata: {
            failure_rate: failureRate,
            failed_count: failedWebhooks,
            total_count: totalWebhooks,
          },
        });
      }
    }

    // Check for stuck webhooks
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const { data: stuckWebhooks, count: stuckCount } = await supabase
      .from('webhook_inbox')
      .select('idempotency_key, producer, claimed_at', { count: 'exact' })
      .not('claimed_at', 'is', null)
      .is('processed_at', null)
      .lt('claimed_at', oneHourAgo.toISOString());

    if (stuckCount && stuckCount > 0) {
      alerts.push({
        type: 'error',
        severity: stuckCount > 5 ? 'high' : 'medium',
        title: 'Webhooks stuck in processing',
        message: `${stuckCount} webhook(s) have been claimed but not processed for over an hour.`,
        metadata: {
          stuck_count: stuckCount,
          stuck_webhooks: stuckWebhooks?.slice(0, 5),
        },
      });
    }

    // Check compliance overdue
    const { count: overdueCount } = await supabase
      .from('compliance_schedules')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'overdue');

    if (overdueCount && overdueCount > 0) {
      alerts.push({
        type: 'ecosystem',
        severity: overdueCount > 10 ? 'high' : 'medium',
        title: 'Compliance items overdue',
        message: `${overdueCount} compliance schedule(s) are overdue.`,
        metadata: {
          overdue_count: overdueCount,
        },
      });
    }

    console.log(`Health check complete. Found ${alerts.length} alert(s).`);

    // Send alerts via Resend if any
    if (alerts.length > 0) {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Alerts <onboarding@resend.dev>';

      if (resendApiKey) {
        for (const alert of alerts) {
          const severityEmoji: Record<string, string> = {
            low: 'ℹ️',
            medium: '⚠️',
            high: '🚨',
            critical: '🔥',
          };

          const subject = `${severityEmoji[alert.severity]} Ecosystem Alert: ${alert.title}`;
          const html = `
            <h1>${severityEmoji[alert.severity]} ${alert.title}</h1>
            <p><strong>Severity:</strong> ${alert.severity.toUpperCase()}</p>
            <p><strong>Type:</strong> ${alert.type}</p>
            <hr />
            <p>${alert.message}</p>
            ${alert.metadata ? `
              <hr />
              <h3>Details:</h3>
              <pre>${JSON.stringify(alert.metadata, null, 2)}</pre>
            ` : ''}
            <hr />
            <p><small>Terrain Ecosystem Health Check - ${now.toISOString()}</small></p>
          `;

          try {
            const emailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: fromEmail,
                to: [ADMIN_EMAIL],
                subject,
                html,
              }),
            });

            if (emailResponse.ok) {
              console.log(`Alert sent: ${alert.title}`);
            } else {
              console.error(`Failed to send alert: ${alert.title}`, await emailResponse.text());
            }
          } catch (emailError) {
            console.error(`Error sending alert email: ${alert.title}`, emailError);
          }
        }
      } else {
        console.warn('RESEND_API_KEY not configured, alerts not sent via email');
      }

      // Log alerts to ecosystem_events for audit trail
      for (const alert of alerts) {
        await supabase.from('ecosystem_events').insert({
          event_type: 'trn.alert.triggered',
          source_app: 'trn',
          producer: 'trn',
          payload: alert,
          idempotency_key: `alert-${now.toISOString()}-${alert.title.slice(0, 20)}`,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alerts_found: alerts.length,
        alerts,
        checked_at: now.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-ecosystem-health:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
