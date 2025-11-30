-- Fix remaining RLS policies - drop existing first then recreate
DROP POLICY IF EXISTS "Anyone can view wallet connections" ON public.wallet_connections;
DROP POLICY IF EXISTS "Anyone can insert wallet connections" ON public.wallet_connections;
DROP POLICY IF EXISTS "Anyone can update their wallet connections" ON public.wallet_connections;

-- Recreate wallet_connections policies
CREATE POLICY "Anyone can view wallet connections"
ON public.wallet_connections FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert wallet connections"
ON public.wallet_connections FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their wallet connections"
ON public.wallet_connections FOR UPDATE
USING (true);

-- Fix trn_rewards - drop then recreate
DROP POLICY IF EXISTS "Anyone can view rewards" ON public.trn_rewards;
DROP POLICY IF EXISTS "Service role can manage rewards" ON public.trn_rewards;

CREATE POLICY "Anyone can view rewards"
ON public.trn_rewards FOR SELECT
USING (true);

CREATE POLICY "Service role can manage rewards"
ON public.trn_rewards FOR ALL
USING (true);

-- Fix user_stats - drop then recreate  
DROP POLICY IF EXISTS "Anyone can view user stats" ON public.user_stats;
DROP POLICY IF EXISTS "Service role can manage user stats" ON public.user_stats;

CREATE POLICY "Anyone can view user stats"
ON public.user_stats FOR SELECT
USING (true);

CREATE POLICY "Service role can manage user stats"
ON public.user_stats FOR ALL
USING (true);

-- Fix user_achievements - drop then recreate
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Service role can manage achievements" ON public.user_achievements;

CREATE POLICY "Anyone can view achievements"
ON public.user_achievements FOR SELECT
USING (true);

CREATE POLICY "Service role can manage achievements"
ON public.user_achievements FOR ALL
USING (true);