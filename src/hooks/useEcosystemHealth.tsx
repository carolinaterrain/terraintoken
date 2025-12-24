import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProducerStats {
  producer: string;
  events_24h: number;
  events_7d: number;
  last_event_at: string | null;
  hours_since_last_event: number | null;
  is_stale: boolean;
}

export interface EcosystemHealthKPIs {
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
  
  // Legacy fields for backward compatibility
  last_webhook_received?: string | null;
  last_event_created?: string | null;
  
  // Meta
  snapshot_at: string;
}

export function useEcosystemHealth() {
  return useQuery({
    queryKey: ['ecosystem-health-kpis'],
    queryFn: async (): Promise<EcosystemHealthKPIs | null> => {
      const { data, error } = await supabase.functions.invoke('get-ecosystem-health');
      
      if (error) {
        console.error('Error fetching ecosystem health:', error);
        return null;
      }
      
      return data;
    },
    refetchInterval: 30000,
  });
}

export interface WebhookInboxItem {
  id: string;
  idempotency_key: string;
  producer: string;
  event_type: string;
  payload: Record<string, unknown>;
  received_at: string;
  claimed_at: string | null;
  processed_at: string | null;
  error_message: string | null;
  retry_count: number;
}

export interface EcosystemEvent {
  id: string;
  event_type: string;
  source_app: string;
  producer: string | null;
  correlation_id: string | null;
  idempotency_key: string | null;
  report_month: string | null;
  payload: unknown;
  created_at: string;
}

export function useWebhookInbox(limit = 20) {
  return useQuery({
    queryKey: ['webhook-inbox', limit],
    queryFn: async (): Promise<WebhookInboxItem[]> => {
      const { data, error } = await supabase.functions.invoke('get-webhook-inbox', {
        body: { limit }
      });
      
      if (error) {
        console.error('Error fetching webhook inbox:', error);
        return [];
      }
      
      return data || [];
    },
    refetchInterval: 10000,
  });
}

export function useEcosystemEvents(limit = 50) {
  return useQuery({
    queryKey: ['ecosystem-events-list', limit],
    queryFn: async (): Promise<EcosystemEvent[]> => {
      const { data, error } = await supabase
        .from('ecosystem_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching ecosystem events:', error);
        return [];
      }
      
      return data || [];
    },
    refetchInterval: 10000,
  });
}

export function useMonthlyReportPipeline() {
  return useQuery({
    queryKey: ['monthly-report-pipeline'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_ecosystem_reports')
        .select('*')
        .order('report_month', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }
      
      return data || [];
    },
    refetchInterval: 60000,
  });
}
