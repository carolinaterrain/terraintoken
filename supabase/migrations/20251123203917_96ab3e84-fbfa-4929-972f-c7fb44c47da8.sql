-- Create purchase tracking table
CREATE TABLE IF NOT EXISTS public.trn_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  amount_trn NUMERIC NOT NULL,
  amount_sol NUMERIC NOT NULL,
  purchase_tier TEXT NOT NULL,
  transaction_signature TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_trn_purchases_wallet ON public.trn_purchases(wallet_address);
CREATE INDEX IF NOT EXISTS idx_trn_purchases_created_at ON public.trn_purchases(created_at DESC);

-- Enable RLS
ALTER TABLE public.trn_purchases ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view purchases (for live feed)
CREATE POLICY "Anyone can view purchases"
ON public.trn_purchases
FOR SELECT
USING (true);

-- Users can insert their own purchases
CREATE POLICY "Users can insert purchases"
ON public.trn_purchases
FOR INSERT
WITH CHECK (true);

-- Create purchase leaderboard table
CREATE TABLE IF NOT EXISTS public.purchase_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  total_purchases BIGINT DEFAULT 0,
  total_trn_purchased NUMERIC DEFAULT 0,
  fastest_buy_seconds INTEGER,
  biggest_purchase_trn NUMERIC DEFAULT 0,
  consecutive_days INTEGER DEFAULT 0,
  last_purchase_date DATE,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_leaderboard_wallet ON public.purchase_leaderboard(wallet_address);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total ON public.purchase_leaderboard(total_trn_purchased DESC);

-- Enable RLS
ALTER TABLE public.purchase_leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view leaderboard
CREATE POLICY "Anyone can view leaderboard"
ON public.purchase_leaderboard
FOR SELECT
USING (true);

-- Users can update their own stats
CREATE POLICY "Users can update their stats"
ON public.purchase_leaderboard
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_leaderboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leaderboard_timestamp
BEFORE UPDATE ON public.purchase_leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_updated_at();

-- Enable realtime for live purchase feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.trn_purchases;