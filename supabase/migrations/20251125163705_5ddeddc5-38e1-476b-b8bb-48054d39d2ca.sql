-- Create tool_usage_proofs table for campaign
CREATE TABLE tool_usage_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  tool_name TEXT NOT NULL CHECK (tool_name IN ('terrainvision', 'flowguardian', 'referral-router')),
  proof_type TEXT NOT NULL CHECK (proof_type IN ('screenshot', 'result_url', 'x_post')),
  proof_url TEXT NOT NULL,
  x_post_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'rewarded')),
  trn_reward NUMERIC DEFAULT 0,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE tool_usage_proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit proofs" 
  ON tool_usage_proofs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view proofs" 
  ON tool_usage_proofs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Service role can update proofs" 
  ON tool_usage_proofs 
  FOR UPDATE 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Fix holder_snapshots data quality
ALTER TABLE holder_snapshots ADD COLUMN IF NOT EXISTS is_live_data BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX idx_tool_proofs_wallet ON tool_usage_proofs(wallet_address);
CREATE INDEX idx_tool_proofs_status ON tool_usage_proofs(status);
CREATE INDEX idx_tool_proofs_created ON tool_usage_proofs(created_at DESC);

-- Enable realtime for new tables only (whale_alerts already enabled)
ALTER PUBLICATION supabase_realtime ADD TABLE tool_usage_proofs;