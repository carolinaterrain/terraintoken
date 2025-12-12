-- Phase 1: Ecosystem Integration Data Infrastructure

-- 1.1 Burn Bands Configuration Table
CREATE TABLE public.burn_bands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_revenue NUMERIC NOT NULL DEFAULT 0,
  max_revenue NUMERIC, -- NULL means no upper limit
  burn_rate NUMERIC NOT NULL, -- Percentage as decimal (e.g., 0.02 = 2%)
  usage_bonus_rate NUMERIC DEFAULT 0, -- Additional rate for high usage
  usage_bonus_threshold INTEGER DEFAULT 0, -- Analyses needed to qualify
  effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  effective_until TIMESTAMP WITH TIME ZONE, -- NULL means currently active
  created_by TEXT, -- governance proposal id or 'initial'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_revenue_range CHECK (max_revenue IS NULL OR max_revenue > min_revenue),
  CONSTRAINT valid_burn_rate CHECK (burn_rate >= 0 AND burn_rate <= 1)
);

-- Enable RLS
ALTER TABLE public.burn_bands ENABLE ROW LEVEL SECURITY;

-- Public read access, admin write
CREATE POLICY "Anyone can view burn bands"
  ON public.burn_bands FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage burn bands"
  ON public.burn_bands FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default burn bands
INSERT INTO public.burn_bands (min_revenue, max_revenue, burn_rate, usage_bonus_rate, usage_bonus_threshold, created_by) VALUES
  (0, 10000, 0.02, 0.005, 1000, 'initial'),
  (10000, 50000, 0.03, 0.005, 5000, 'initial'),
  (50000, 100000, 0.04, 0.01, 10000, 'initial'),
  (100000, NULL, 0.05, 0.01, 25000, 'initial');

-- 1.2 Monthly Ecosystem Reports Table
CREATE TABLE public.monthly_ecosystem_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_month DATE NOT NULL, -- First day of the month
  gross_ai_revenue NUMERIC NOT NULL DEFAULT 0,
  variable_ai_costs NUMERIC NOT NULL DEFAULT 0,
  net_ai_revenue NUMERIC GENERATED ALWAYS AS (gross_ai_revenue - variable_ai_costs) STORED,
  verified_analyses INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  determined_band_id UUID REFERENCES public.burn_bands(id),
  base_burn_rate NUMERIC,
  usage_bonus_applied BOOLEAN DEFAULT false,
  final_burn_rate NUMERIC,
  usd_for_buyback NUMERIC,
  trn_burned NUMERIC,
  buyback_tx_hash TEXT,
  burn_tx_hash TEXT,
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  finalized_at TIMESTAMP WITH TIME ZONE,
  data_source TEXT DEFAULT 'terrainvision',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(report_month)
);

-- Enable RLS
ALTER TABLE public.monthly_ecosystem_reports ENABLE ROW LEVEL SECURITY;

-- Public read access for finalized reports
CREATE POLICY "Anyone can view finalized reports"
  ON public.monthly_ecosystem_reports FOR SELECT
  USING (is_finalized = true);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON public.monthly_ecosystem_reports FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can manage reports
CREATE POLICY "Service role can manage reports"
  ON public.monthly_ecosystem_reports FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Trigger to prevent updates to finalized reports
CREATE OR REPLACE FUNCTION public.prevent_finalized_report_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_finalized = true AND NEW.is_finalized = true THEN
    RAISE EXCEPTION 'Cannot modify finalized ecosystem report';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER prevent_finalized_report_update
  BEFORE UPDATE ON public.monthly_ecosystem_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_finalized_report_update();

-- 1.3 Ecosystem Events Table (Append-only audit log)
CREATE TABLE public.ecosystem_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- TV_MONTH_CLOSED, BAND_DETERMINED, BURN_EXECUTED, REPORT_PUBLISHED
  source_app TEXT NOT NULL, -- 'terrainvision' or 'trn'
  report_month DATE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_event_type CHECK (event_type IN ('TV_MONTH_CLOSED', 'BAND_DETERMINED', 'BURN_EXECUTED', 'REPORT_PUBLISHED', 'GOVERNANCE_CHANGE'))
);

-- Enable RLS
ALTER TABLE public.ecosystem_events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view ecosystem events"
  ON public.ecosystem_events FOR SELECT
  USING (true);

-- Service role can insert events
CREATE POLICY "Service role can insert events"
  ON public.ecosystem_events FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Service role can update events (for processing)
CREATE POLICY "Service role can update events"
  ON public.ecosystem_events FOR UPDATE
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Enable realtime for ecosystem_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.ecosystem_events;

-- 1.4 Guardrails Table
CREATE TABLE public.guardrails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guardrail_type TEXT NOT NULL, -- 'max_burn_usd', 'max_burn_percent', 'smoothing_factor', 'circuit_breaker'
  value NUMERIC NOT NULL,
  description TEXT,
  effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  effective_until TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(guardrail_type, effective_from)
);

-- Enable RLS
ALTER TABLE public.guardrails ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view guardrails"
  ON public.guardrails FOR SELECT
  USING (true);

-- Admins can manage guardrails
CREATE POLICY "Admins can manage guardrails"
  ON public.guardrails FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default guardrails
INSERT INTO public.guardrails (guardrail_type, value, description, created_by) VALUES
  ('max_burn_usd', 50000, 'Maximum USD to spend on buyback per month', 'initial'),
  ('max_burn_percent', 0.10, 'Maximum percentage of net revenue to burn (10%)', 'initial'),
  ('smoothing_factor', 0.7, 'Smoothing factor for revenue volatility (0-1)', 'initial'),
  ('circuit_breaker_drop', 0.5, 'Halt if revenue drops more than 50% month-over-month', 'initial');

-- 1.5 Glossary Terms Table (Shared Vocabulary SSOT)
CREATE TABLE public.glossary_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term_key TEXT NOT NULL UNIQUE, -- e.g., 'ai_net_revenue', 'variable_ai_costs'
  term_name TEXT NOT NULL, -- Display name: 'AI Net Revenue'
  definition TEXT NOT NULL,
  example TEXT,
  related_terms TEXT[], -- Array of related term_keys
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view glossary terms"
  ON public.glossary_terms FOR SELECT
  USING (true);

-- Admins can manage glossary
CREATE POLICY "Admins can manage glossary"
  ON public.glossary_terms FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert canonical definitions
INSERT INTO public.glossary_terms (term_key, term_name, definition, example, related_terms) VALUES
  ('ai_net_revenue', 'AI Net Revenue', 'AI revenue minus variable AI costs only. This is the base for calculating the buyback-and-burn amount.', 'If gross AI revenue is $50,000 and variable AI costs are $15,000, AI Net Revenue is $35,000.', ARRAY['variable_ai_costs', 'burn_band']),
  ('variable_ai_costs', 'Variable AI Costs', 'Costs that scale directly with AI usage: inference compute, per-analysis storage, and third-party AI API usage. Does not include fixed costs like development or infrastructure.', 'GPU inference costs, OpenAI API calls, cloud storage for analysis results.', ARRAY['ai_net_revenue']),
  ('burn_band', 'Burn Band', 'A revenue tier that determines the percentage of AI Net Revenue used for buyback-and-burn. Higher revenue unlocks higher burn rates.', 'At $35,000 net revenue, the burn band might be 3%, resulting in $1,050 for buyback.', ARRAY['ai_net_revenue', 'buyback_burn']),
  ('buyback_burn', 'Buyback + Burn', 'A programmatic process where USD is used to purchase TRN tokens on the open market (buyback), then those tokens are permanently destroyed by sending to a burn address (burn).', 'Using $1,050 to buy TRN at market price, then sending purchased tokens to the burn address.', ARRAY['burn_band']),
  ('verified_analysis', 'Verified Analysis', 'A completed AI terrain analysis that passed quality validation and generated billable revenue.', 'A user uploads site photos, AI processes them, and the system confirms the analysis met quality thresholds.', ARRAY['ai_net_revenue']),
  ('usage_bonus', 'Usage Bonus', 'An additional burn rate applied when monthly verified analyses exceed a threshold, rewarding high platform activity.', 'If the threshold is 5,000 analyses and the bonus is 0.5%, exceeding this adds 0.5% to the base burn rate.', ARRAY['burn_band', 'verified_analysis']);

-- Add indexes for performance
CREATE INDEX idx_burn_bands_effective ON public.burn_bands(effective_from, effective_until);
CREATE INDEX idx_monthly_reports_month ON public.monthly_ecosystem_reports(report_month);
CREATE INDEX idx_ecosystem_events_type ON public.ecosystem_events(event_type, created_at);
CREATE INDEX idx_ecosystem_events_month ON public.ecosystem_events(report_month);
CREATE INDEX idx_guardrails_type ON public.guardrails(guardrail_type, effective_from);