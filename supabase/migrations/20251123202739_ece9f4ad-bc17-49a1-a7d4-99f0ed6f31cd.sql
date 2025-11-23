-- Create price prediction game table
CREATE TABLE IF NOT EXISTS public.market_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('bull', 'bear', 'stable')),
  current_price NUMERIC NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  predicted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  actual_price NUMERIC,
  was_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market achievements table
CREATE TABLE IF NOT EXISTS public.market_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id TEXT NOT NULL,
  user_wallet TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(achievement_id, user_wallet)
);

-- Create wallet connections table for tracking connected users
CREATE TABLE IF NOT EXISTS public.wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  first_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  connection_count INTEGER DEFAULT 1
);

-- Create live viewers tracking
CREATE TABLE IF NOT EXISTS public.live_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  page_path TEXT NOT NULL,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.market_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_viewers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for market_predictions
CREATE POLICY "Anyone can view predictions"
  ON public.market_predictions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own predictions"
  ON public.market_predictions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own predictions"
  ON public.market_predictions FOR UPDATE
  USING (user_wallet = user_wallet);

-- RLS Policies for market_achievements
CREATE POLICY "Anyone can view achievements"
  ON public.market_achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can insert achievements"
  ON public.market_achievements FOR INSERT
  WITH CHECK (true);

-- RLS Policies for wallet_connections
CREATE POLICY "Anyone can view wallet connections"
  ON public.wallet_connections FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert wallet connections"
  ON public.wallet_connections FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update wallet connections"
  ON public.wallet_connections FOR UPDATE
  USING (true);

-- RLS Policies for live_viewers
CREATE POLICY "Anyone can manage live viewers"
  ON public.live_viewers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_predictions_user ON public.market_predictions(user_wallet);
CREATE INDEX idx_predictions_date ON public.market_predictions(target_date);
CREATE INDEX idx_achievements_user ON public.market_achievements(user_wallet);
CREATE INDEX idx_live_viewers_page ON public.live_viewers(page_path);
CREATE INDEX idx_live_viewers_last_ping ON public.live_viewers(last_ping);

-- Function to cleanup old live viewer records
CREATE OR REPLACE FUNCTION cleanup_stale_viewers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM live_viewers 
  WHERE last_ping < NOW() - INTERVAL '5 minutes';
END;
$$;