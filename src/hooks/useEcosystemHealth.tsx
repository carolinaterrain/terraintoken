import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EcosystemHealthKPIs {
  webhooks_failed: number;
  webhooks_in_flight: number;
  events_last_hour: number;
  last_webhook_received: string | null;
  last_event_created: string | null;
  reports_finalized: number;
  reports_pending: number;
  total_trn_burned: number;
  wallets_verified: number;
  snapshot_at: string;
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

export function useEcosystemHealth() {
  return useQuery({
    queryKey: ['ecosystem-health-kpis'],
    queryFn: async (): Promise<EcosystemHealthKPIs | null> => {
      // Query the view - need service role access, so we use edge function
      const { data, error } = await supabase.functions.invoke('get-ecosystem-health');
      
      if (error) {
        console.error('Error fetching ecosystem health:', error);
        return null;
      }
      
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
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
    refetchInterval: 10000, // Refresh every 10 seconds
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
