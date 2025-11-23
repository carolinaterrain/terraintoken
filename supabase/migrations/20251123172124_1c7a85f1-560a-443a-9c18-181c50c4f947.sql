-- Add admin_notes column to trn_redemptions
ALTER TABLE trn_redemptions ADD COLUMN IF NOT EXISTS admin_notes text;

-- Create referral_rewards table
CREATE TABLE IF NOT EXISTS referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_code text NOT NULL,
  referred_email text NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('waitlist_signup', 'trn_purchase', 'service_booking')),
  trn_amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  verification_data jsonb,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz
);

-- Create holder_snapshots table for retention tracking
CREATE TABLE IF NOT EXISTS holder_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL UNIQUE,
  total_holders integer NOT NULL,
  holder_addresses jsonb NOT NULL,
  holder_balances jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE holder_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS policies for referral_rewards
CREATE POLICY "Admins can manage referral rewards"
  ON referral_rewards
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own referral rewards"
  ON referral_rewards
  FOR SELECT
  USING (
    referrer_code IN (
      SELECT referral_code FROM terrainscape_waitlist 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS policies for holder_snapshots
CREATE POLICY "Public can view holder snapshots"
  ON holder_snapshots
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage snapshots"
  ON holder_snapshots
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_code);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);
CREATE INDEX IF NOT EXISTS idx_holder_snapshots_date ON holder_snapshots(snapshot_date);