-- Phase 1: Strengthen ecosystem_events with idempotency + correlation
ALTER TABLE public.ecosystem_events
ADD COLUMN IF NOT EXISTS producer TEXT DEFAULT 'trn',
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS correlation_id UUID,
ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Create unique index for idempotency (allows NULL for legacy events)
CREATE UNIQUE INDEX IF NOT EXISTS ecosystem_events_idempotency_key_idx 
ON public.ecosystem_events(idempotency_key) 
WHERE idempotency_key IS NOT NULL;

-- Create index for correlation queries
CREATE INDEX IF NOT EXISTS ecosystem_events_correlation_id_idx 
ON public.ecosystem_events(correlation_id) 
WHERE correlation_id IS NOT NULL;

-- Create webhook_inbox table for idempotent processing
CREATE TABLE IF NOT EXISTS public.webhook_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT NOT NULL UNIQUE,
  producer TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  claimed_by TEXT,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ
);

-- Index for unclaimed webhooks
CREATE INDEX IF NOT EXISTS webhook_inbox_unclaimed_idx 
ON public.webhook_inbox(received_at) 
WHERE claimed_at IS NULL AND processed_at IS NULL;

-- Index for retry processing
CREATE INDEX IF NOT EXISTS webhook_inbox_retry_idx 
ON public.webhook_inbox(next_retry_at) 
WHERE processed_at IS NULL AND next_retry_at IS NOT NULL;

-- Create sync_state table for tracking consumption cursors
CREATE TABLE IF NOT EXISTS public.sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_name TEXT NOT NULL UNIQUE,
  last_processed_event_id UUID,
  last_processed_at TIMESTAMPTZ,
  cursor_position BIGINT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase 3: Wallet link challenges for cryptographic verification
CREATE TABLE IF NOT EXISTS public.wallet_link_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  wallet_address TEXT NOT NULL,
  nonce TEXT NOT NULL,
  message TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  verification_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for pending challenges
CREATE INDEX IF NOT EXISTS wallet_link_challenges_pending_idx 
ON public.wallet_link_challenges(wallet_address, expires_at) 
WHERE verified_at IS NULL;

-- Enable RLS on new tables
ALTER TABLE public.webhook_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_link_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for webhook_inbox (service role only)
CREATE POLICY "Service role can manage webhook inbox" ON public.webhook_inbox
FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS policies for sync_state (service role only)
CREATE POLICY "Service role can manage sync state" ON public.sync_state
FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS policies for wallet_link_challenges
CREATE POLICY "Anyone can create challenges" ON public.wallet_link_challenges
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own challenges" ON public.wallet_link_challenges
FOR SELECT USING (
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
  OR user_id = auth.uid()
);

CREATE POLICY "Service role can manage challenges" ON public.wallet_link_challenges
FOR ALL USING ((auth.jwt() ->> 'role') = 'service_role');

-- Create ecosystem_health_kpis view for Phase 4 dashboard
CREATE OR REPLACE VIEW public.ecosystem_health_kpis AS
SELECT
  (SELECT COUNT(*) FROM webhook_inbox WHERE processed_at IS NULL AND error_message IS NOT NULL) as webhooks_failed,
  (SELECT COUNT(*) FROM webhook_inbox WHERE claimed_at IS NOT NULL AND processed_at IS NULL) as webhooks_in_flight,
  (SELECT COUNT(*) FROM ecosystem_events WHERE created_at > now() - interval '1 hour') as events_last_hour,
  (SELECT MAX(received_at) FROM webhook_inbox) as last_webhook_received,
  (SELECT MAX(created_at) FROM ecosystem_events) as last_event_created,
  (SELECT COUNT(*) FROM monthly_ecosystem_reports WHERE is_finalized = true) as reports_finalized,
  (SELECT COUNT(*) FROM monthly_ecosystem_reports WHERE is_finalized = false) as reports_pending,
  (SELECT COALESCE(SUM(trn_burned), 0) FROM monthly_ecosystem_reports WHERE is_finalized = true) as total_trn_burned,
  (SELECT COUNT(*) FROM wallet_link_challenges WHERE verified_at IS NOT NULL) as wallets_verified,
  now() as snapshot_at;