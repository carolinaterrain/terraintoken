-- Security Hardening Phase 1: Fix overly permissive RLS policies

-- 1. Fix prediction_stakes UPDATE policy - restrict to service role only
DROP POLICY IF EXISTS "System can update stakes" ON prediction_stakes;
CREATE POLICY "Service role can update stakes" ON prediction_stakes 
  FOR UPDATE USING ((auth.jwt() ->> 'role') = 'service_role');

-- 2. Fix contest_stakes INSERT policy - add wallet validation
DROP POLICY IF EXISTS "Users can insert contest stakes" ON contest_stakes;
CREATE POLICY "Users can insert own contest stakes" ON contest_stakes 
  FOR INSERT WITH CHECK (user_wallet = get_user_wallet_address());

-- 3. Fix nft_achievements INSERT policy - add wallet validation  
DROP POLICY IF EXISTS "Users can mint their own NFT achievements" ON nft_achievements;
CREATE POLICY "Users can mint own NFT achievements" ON nft_achievements 
  FOR INSERT WITH CHECK (user_wallet = get_user_wallet_address());

-- 4. Create error_logs table for Error Monitoring
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  error_fingerprint TEXT,
  user_agent TEXT,
  page_url TEXT,
  user_id UUID,
  session_id TEXT,
  severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert errors (for client-side error reporting)
CREATE POLICY "Anyone can insert errors" ON error_logs 
  FOR INSERT WITH CHECK (true);

-- Only admins can view errors
CREATE POLICY "Admins can view errors" ON error_logs 
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Only admins can update errors (mark as resolved)
CREATE POLICY "Admins can update errors" ON error_logs 
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Create index for efficient querying
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_fingerprint ON error_logs(error_fingerprint);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);

-- 5. Create audit_log table for security auditing
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  user_id UUID,
  user_wallet TEXT,
  ip_address TEXT,
  user_agent TEXT,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs" ON audit_log 
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_log 
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Create index for efficient querying
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);