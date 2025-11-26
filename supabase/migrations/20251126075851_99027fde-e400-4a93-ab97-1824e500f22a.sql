-- Create investor_interests table for tracking investor inquiries
CREATE TABLE investor_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  wallet_address TEXT,
  investment_tier TEXT CHECK (investment_tier IN ('supporter', 'partner', 'strategic')),
  investment_range TEXT NOT NULL,
  reason TEXT[] DEFAULT '{}',
  is_accredited BOOLEAN DEFAULT FALSE,
  nda_accepted BOOLEAN DEFAULT FALSE,
  discord_handle TEXT,
  additional_notes TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  CONSTRAINT unique_email_per_tier UNIQUE(email, investment_tier)
);

-- Enable RLS
ALTER TABLE investor_interests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit interest (public form)
CREATE POLICY "Anyone can submit investor interest"
  ON investor_interests
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view investor interests"
  ON investor_interests
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can update status
CREATE POLICY "Admins can update investor interests"
  ON investor_interests
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Create index for faster lookups
CREATE INDEX idx_investor_interests_email ON investor_interests(email);
CREATE INDEX idx_investor_interests_tier ON investor_interests(investment_tier);
CREATE INDEX idx_investor_interests_status ON investor_interests(status);
CREATE INDEX idx_investor_interests_created_at ON investor_interests(created_at DESC);