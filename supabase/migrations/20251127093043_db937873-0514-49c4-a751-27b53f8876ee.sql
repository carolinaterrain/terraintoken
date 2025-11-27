-- Complete security hardening for trn_rewards and user_stats
-- Drop existing policies first to avoid conflicts

-- trn_rewards cleanup and recreation
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.trn_rewards;
DROP POLICY IF EXISTS "Admins can view all rewards" ON public.trn_rewards;
DROP POLICY IF EXISTS "Service role can manage rewards" ON public.trn_rewards;

CREATE POLICY "Users can view their own rewards"
ON public.trn_rewards
FOR SELECT
USING (
  user_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  OR user_wallet_address = (SELECT (raw_user_meta_data ->> 'wallet_address') FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can view all rewards"
ON public.trn_rewards
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage rewards"
ON public.trn_rewards
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role');

-- user_stats cleanup and recreation
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Admins can view all user stats" ON public.user_stats;
DROP POLICY IF EXISTS "Service role can manage user stats" ON public.user_stats;

CREATE POLICY "Users can view their own stats"
ON public.user_stats
FOR SELECT
USING (
  user_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  OR user_wallet_address = (SELECT (raw_user_meta_data ->> 'wallet_address') FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can update their own stats"
ON public.user_stats
FOR UPDATE
USING (
  user_wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  OR user_wallet_address = (SELECT (raw_user_meta_data ->> 'wallet_address') FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can view all user stats"
ON public.user_stats
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage user stats"
ON public.user_stats
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role');

-- Create secure aggregate functions
CREATE OR REPLACE FUNCTION public.get_public_leaderboard(limit_count integer DEFAULT 10)
RETURNS TABLE (
  rank bigint,
  masked_wallet text,
  total_trn_earned numeric,
  reputation_score integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ROW_NUMBER() OVER (ORDER BY total_trn_earned DESC) as rank,
    CONCAT(LEFT(user_wallet_address, 4), '...', RIGHT(user_wallet_address, 4)) as masked_wallet,
    total_trn_earned,
    reputation_score
  FROM user_stats
  ORDER BY total_trn_earned DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_leaderboard(integer) TO anon, authenticated;