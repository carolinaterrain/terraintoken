import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BurnBand {
  id: string;
  min_revenue: number;
  max_revenue: number | null;
  burn_rate: number;
  usage_bonus_rate: number;
  usage_bonus_threshold: number;
  effective_from: string;
}

export interface MonthlyReport {
  id: string;
  report_month: string;
  gross_ai_revenue: number;
  variable_ai_costs: number;
  net_ai_revenue: number;
  verified_analyses: number;
  active_users: number;
  determined_band_id: string | null;
  base_burn_rate: number | null;
  usage_bonus_applied: boolean;
  final_burn_rate: number | null;
  usd_for_buyback: number | null;
  trn_burned: number | null;
  buyback_tx_hash: string | null;
  burn_tx_hash: string | null;
  is_finalized: boolean;
  finalized_at: string | null;
  data_source: string;
}

export interface GlossaryTerm {
  id: string;
  term_key: string;
  term_name: string;
  definition: string;
  example: string | null;
  related_terms: string[] | null;
}

export interface EcosystemEvent {
  id: string;
  event_type: string;
  source_app: string;
  report_month: string | null;
  payload: Record<string, unknown>;
  processed: boolean;
  created_at: string;
}

export function useBurnBands() {
  return useQuery({
    queryKey: ['burn-bands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('burn_bands')
        .select('*')
        .lte('effective_from', new Date().toISOString())
        .or('effective_until.is.null,effective_until.gte.' + new Date().toISOString())
        .order('min_revenue', { ascending: true });

      if (error) throw error;
      return data as BurnBand[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useCurrentBand(netRevenue: number | undefined) {
  const { data: bands } = useBurnBands();

  if (!bands || netRevenue === undefined) return null;

  return bands.find(band =>
    netRevenue >= band.min_revenue &&
    (band.max_revenue === null || netRevenue < band.max_revenue)
  );
}

export function useMonthlyReports(limit = 12) {
  return useQuery({
    queryKey: ['monthly-ecosystem-reports', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_ecosystem_reports')
        .select('*')
        .eq('is_finalized', true)
        .order('report_month', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as MonthlyReport[];
    },
    staleTime: 60 * 1000, // Cache for 1 minute
  });
}

export function useLatestReport() {
  return useQuery({
    queryKey: ['latest-ecosystem-report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_ecosystem_reports')
        .select('*')
        .eq('is_finalized', true)
        .order('report_month', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error
      return data as MonthlyReport | null;
    },
    staleTime: 60 * 1000,
  });
}

export function useGlossary() {
  return useQuery({
    queryKey: ['glossary-terms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .order('term_name');

      if (error) throw error;
      
      // Create a lookup map
      const lookup: Record<string, GlossaryTerm> = {};
      data?.forEach(term => {
        lookup[term.term_key] = term as GlossaryTerm;
      });

      return {
        terms: data as GlossaryTerm[],
        lookup,
      };
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour - glossary rarely changes
  });
}

export function useGlossaryTerm(termKey: string) {
  const { data } = useGlossary();
  return data?.lookup[termKey];
}

export function useEcosystemEvents(reportMonth?: string) {
  return useQuery({
    queryKey: ['ecosystem-events', reportMonth],
    queryFn: async () => {
      let query = supabase
        .from('ecosystem_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (reportMonth) {
        query = query.eq('report_month', reportMonth);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EcosystemEvent[];
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}

export function useGuardrails() {
  return useQuery({
    queryKey: ['guardrails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guardrails')
        .select('*')
        .lte('effective_from', new Date().toISOString())
        .or('effective_until.is.null,effective_until.gte.' + new Date().toISOString());

      if (error) throw error;

      // Create a lookup map
      const guardrailMap: Record<string, number> = {};
      data?.forEach(g => {
        guardrailMap[g.guardrail_type] = g.value;
      });

      return guardrailMap;
    },
    staleTime: 5 * 60 * 1000,
  });
}
