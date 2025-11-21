-- Create terrainscape_waitlist table
CREATE TABLE IF NOT EXISTS public.terrainscape_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  wallet_address TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT REFERENCES public.terrainscape_waitlist(referral_code),
  priority_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  signup_source TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  is_trn_holder BOOLEAN DEFAULT false,
  trn_balance NUMERIC(18,8) DEFAULT 0,
  beta_application TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  invited_at TIMESTAMPTZ,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'invited', 'rejected'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.terrainscape_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral ON public.terrainscape_waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority ON public.terrainscape_waitlist(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.terrainscape_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON public.terrainscape_waitlist(created_at DESC);

-- Enable RLS
ALTER TABLE public.terrainscape_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (join waitlist)
CREATE POLICY "Anyone can join waitlist"
ON public.terrainscape_waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Users can view their own entry by email
CREATE POLICY "Users can view their own waitlist entry"
ON public.terrainscape_waitlist FOR SELECT
TO anon, authenticated
USING (true);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_terrainscape_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_terrainscape_waitlist_updated_at
BEFORE UPDATE ON public.terrainscape_waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_terrainscape_waitlist_updated_at();

-- View for referral leaderboard
CREATE OR REPLACE VIEW public.terrainscape_waitlist_referrals AS
SELECT 
  tw.referral_code,
  tw.email,
  COUNT(referred.id) as total_referrals,
  tw.priority_score,
  tw.created_at
FROM public.terrainscape_waitlist tw
LEFT JOIN public.terrainscape_waitlist referred ON referred.referred_by = tw.referral_code
GROUP BY tw.id, tw.referral_code, tw.email, tw.priority_score, tw.created_at
ORDER BY total_referrals DESC;

COMMENT ON TABLE public.terrainscape_waitlist IS 'TerrainScape game waitlist with referral tracking and priority scoring';