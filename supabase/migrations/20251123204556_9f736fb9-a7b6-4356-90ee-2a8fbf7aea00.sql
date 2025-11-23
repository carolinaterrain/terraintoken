-- Create referral system tables
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  total_bonus_trn NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_wallet ON public.referral_codes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(referral_code);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view referral codes"
ON public.referral_codes
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own referral code"
ON public.referral_codes
FOR INSERT
WITH CHECK (true);

-- Create referral redemptions table
CREATE TABLE IF NOT EXISTS public.referral_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT NOT NULL,
  referee_wallet TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  bonus_amount NUMERIC NOT NULL,
  purchase_amount NUMERIC NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referrer ON public.referral_redemptions(referrer_wallet);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referee ON public.referral_redemptions(referee_wallet);

-- Enable RLS
ALTER TABLE public.referral_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view redemptions"
ON public.referral_redemptions
FOR SELECT
USING (true);

CREATE POLICY "System can insert redemptions"
ON public.referral_redemptions
FOR INSERT
WITH CHECK (true);

-- Create whale alerts table
CREATE TABLE IF NOT EXISTS public.whale_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  amount_trn NUMERIC NOT NULL,
  alert_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whale_alerts_created ON public.whale_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whale_alerts_type ON public.whale_alerts(alert_type);

-- Enable RLS
ALTER TABLE public.whale_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view whale alerts"
ON public.whale_alerts
FOR SELECT
USING (true);

CREATE POLICY "System can insert whale alerts"
ON public.whale_alerts
FOR INSERT
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.whale_alerts;