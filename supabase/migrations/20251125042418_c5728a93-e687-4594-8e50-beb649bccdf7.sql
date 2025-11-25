-- =====================================================
-- CRITICAL SECURITY FIX: Add RLS Policies to Protect PII
-- =====================================================
-- Drop existing policies first, then recreate all policies

-- 1. USER_STATS TABLE
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Service role can manage all stats" ON public.user_stats;

CREATE POLICY "Users can view their own stats"
ON public.user_stats FOR SELECT
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update their own stats"
ON public.user_stats FOR UPDATE
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own stats"
ON public.user_stats FOR INSERT
WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Service role can manage all stats"
ON public.user_stats FOR ALL
USING (auth.role() = 'service_role');

-- 2. USER_ACHIEVEMENTS TABLE
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Service role can manage achievements" ON public.user_achievements;

CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Service role can manage achievements"
ON public.user_achievements FOR ALL
USING (auth.role() = 'service_role');

-- 3. TRN_REWARDS TABLE
ALTER TABLE public.trn_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own rewards" ON public.trn_rewards;
DROP POLICY IF EXISTS "Service role can manage rewards" ON public.trn_rewards;

CREATE POLICY "Users can view their own rewards"
ON public.trn_rewards FOR SELECT
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Service role can manage rewards"
ON public.trn_rewards FOR ALL
USING (auth.role() = 'service_role');

-- 4. PROJECT_MEDIA TABLE
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved projects" ON public.project_media;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.project_media;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.project_media;
DROP POLICY IF EXISTS "Service role can manage all projects" ON public.project_media;

CREATE POLICY "Public can view approved projects"
ON public.project_media FOR SELECT
USING (validation_status = 'approved' AND is_featured = true);

CREATE POLICY "Users can view their own projects"
ON public.project_media FOR SELECT
USING (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own projects"
ON public.project_media FOR INSERT
WITH CHECK (user_wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Service role can manage all projects"
ON public.project_media FOR ALL
USING (auth.role() = 'service_role');

-- 5. TRN_REDEMPTIONS TABLE
ALTER TABLE public.trn_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.trn_redemptions;
DROP POLICY IF EXISTS "Users can insert their own redemptions" ON public.trn_redemptions;
DROP POLICY IF EXISTS "Service role can manage all redemptions" ON public.trn_redemptions;

CREATE POLICY "Users can view their own redemptions"
ON public.trn_redemptions FOR SELECT
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert their own redemptions"
ON public.trn_redemptions FOR INSERT
WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Service role can manage all redemptions"
ON public.trn_redemptions FOR ALL
USING (auth.role() = 'service_role');

-- 6. TERRAINSCAPE_WAITLIST TABLE
ALTER TABLE public.terrainscape_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.terrainscape_waitlist;
DROP POLICY IF EXISTS "Anyone can insert waitlist entries" ON public.terrainscape_waitlist;
DROP POLICY IF EXISTS "Users can update their own waitlist entry" ON public.terrainscape_waitlist;
DROP POLICY IF EXISTS "Service role can manage all waitlist entries" ON public.terrainscape_waitlist;

CREATE POLICY "Users can view their own waitlist entry"
ON public.terrainscape_waitlist FOR SELECT
USING (
  email = current_setting('request.jwt.claims', true)::json->>'email'
  OR wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
);

CREATE POLICY "Anyone can insert waitlist entries"
ON public.terrainscape_waitlist FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own waitlist entry"
ON public.terrainscape_waitlist FOR UPDATE
USING (
  email = current_setting('request.jwt.claims', true)::json->>'email'
  OR wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
);

CREATE POLICY "Service role can manage all waitlist entries"
ON public.terrainscape_waitlist FOR ALL
USING (auth.role() = 'service_role');

-- Add indexes for policy performance
CREATE INDEX IF NOT EXISTS idx_user_stats_wallet ON public.user_stats(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_achievements_wallet ON public.user_achievements(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_trn_rewards_wallet ON public.trn_rewards(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_project_media_wallet ON public.project_media(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_project_media_status ON public.project_media(validation_status, is_featured) WHERE validation_status = 'approved';
CREATE INDEX IF NOT EXISTS idx_trn_redemptions_wallet ON public.trn_redemptions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_terrainscape_waitlist_email ON public.terrainscape_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_terrainscape_waitlist_wallet ON public.terrainscape_waitlist(wallet_address);