-- Create TRN Rewards Ledger table for tracking rewards from external sources
CREATE TABLE public.trn_rewards_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_project TEXT NOT NULL,
  source_reward_id TEXT NOT NULL,
  wallet_address TEXT,
  user_email TEXT,
  session_id TEXT,
  reward_type TEXT NOT NULL,
  amount_trn INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'claimed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_project, source_reward_id)
);

-- Create TRN Live Stats table for real-time token metrics
CREATE TABLE public.trn_live_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  current_supply BIGINT NOT NULL DEFAULT 0,
  total_issued BIGINT NOT NULL DEFAULT 0,
  max_supply BIGINT NOT NULL DEFAULT 1000000000,
  active_users INTEGER NOT NULL DEFAULT 0,
  price_usd NUMERIC(18, 10) DEFAULT 0,
  price_sol NUMERIC(18, 10) DEFAULT 0,
  price_change_24h NUMERIC(8, 4) DEFAULT 0,
  market_cap_usd NUMERIC(18, 2) DEFAULT 0,
  volume_24h_usd NUMERIC(18, 2) DEFAULT 0,
  liquidity_usd NUMERIC(18, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_trn_rewards_ledger_wallet ON public.trn_rewards_ledger(wallet_address);
CREATE INDEX idx_trn_rewards_ledger_session ON public.trn_rewards_ledger(session_id);
CREATE INDEX idx_trn_rewards_ledger_source ON public.trn_rewards_ledger(source_project);
CREATE INDEX idx_trn_rewards_ledger_status ON public.trn_rewards_ledger(status);
CREATE INDEX idx_trn_live_stats_created ON public.trn_live_stats(created_at DESC);

-- Enable RLS on both tables
ALTER TABLE public.trn_rewards_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trn_live_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trn_rewards_ledger

-- Users can view their own rewards by wallet address
CREATE POLICY "Users can view own rewards by wallet"
ON public.trn_rewards_ledger
FOR SELECT
USING (
  wallet_address IS NOT NULL AND 
  wallet_address = (
    SELECT (raw_user_meta_data ->> 'wallet_address')
    FROM auth.users
    WHERE id = auth.uid()
  )
);

-- Users can view their own rewards by session ID
CREATE POLICY "Users can view own rewards by session"
ON public.trn_rewards_ledger
FOR SELECT
USING (
  session_id IS NOT NULL AND 
  session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id')
);

-- Service role can do everything on rewards ledger
CREATE POLICY "Service role full access to rewards ledger"
ON public.trn_rewards_ledger
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS Policies for trn_live_stats

-- Anyone can read live stats (public)
CREATE POLICY "Public read access to live stats"
ON public.trn_live_stats
FOR SELECT
USING (true);

-- Only service role can insert/update stats
CREATE POLICY "Service role can manage live stats"
ON public.trn_live_stats
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

-- Insert initial stats row
INSERT INTO public.trn_live_stats (
  current_supply,
  total_issued,
  max_supply,
  active_users,
  price_usd,
  price_sol,
  price_change_24h,
  market_cap_usd,
  volume_24h_usd,
  liquidity_usd
) VALUES (
  550000000,
  1006699550,
  1000000000,
  0,
  0.0000001,
  0.000000001,
  0,
  55,
  0,
  0
);