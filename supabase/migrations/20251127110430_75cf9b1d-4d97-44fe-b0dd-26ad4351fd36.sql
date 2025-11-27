-- =============================================
-- PHASE 1: Fix remaining auth.users references
-- =============================================

-- Fix tournament_entries INSERT policy
DROP POLICY IF EXISTS "Users can join tournaments" ON public.tournament_entries;
CREATE POLICY "Users can join tournaments" 
ON public.tournament_entries 
FOR INSERT 
WITH CHECK (user_wallet = get_user_wallet_address());

-- Fix tournament_entries UPDATE policy
DROP POLICY IF EXISTS "Users can update their own entries" ON public.tournament_entries;
CREATE POLICY "Users can update their own entries" 
ON public.tournament_entries 
FOR UPDATE 
USING (user_wallet = get_user_wallet_address());

-- Fix tournament_entries SELECT policy
DROP POLICY IF EXISTS "Anyone can view tournament entries" ON public.tournament_entries;
CREATE POLICY "Anyone can view tournament entries" 
ON public.tournament_entries 
FOR SELECT 
USING (true);

-- Fix service_redemptions INSERT policy
DROP POLICY IF EXISTS "Users can create their own redemptions" ON public.service_redemptions;
CREATE POLICY "Users can create their own redemptions" 
ON public.service_redemptions 
FOR INSERT 
WITH CHECK (user_wallet = get_user_wallet_address());

-- Fix service_redemptions SELECT policy
DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.service_redemptions;
CREATE POLICY "Users can view their own redemptions" 
ON public.service_redemptions 
FOR SELECT 
USING (user_wallet = get_user_wallet_address() OR has_role(auth.uid(), 'admin'));

-- Fix trn_rewards_ledger SELECT policy
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.trn_rewards_ledger;
CREATE POLICY "Users can view their own rewards" 
ON public.trn_rewards_ledger 
FOR SELECT 
USING (wallet_address = get_user_wallet_address() OR has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 2: Fix Critical Data Exposure (ERROR-level)
-- =============================================

-- 2. price_alerts - Require authentication for INSERT
DROP POLICY IF EXISTS "Anyone can create price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can create their own price alerts" ON public.price_alerts;
CREATE POLICY "Authenticated users can create price alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_email = get_user_email());

-- Fix price_alerts SELECT - users can only see their own
DROP POLICY IF EXISTS "Users can view their own alerts" ON public.price_alerts;
CREATE POLICY "Users can view their own alerts" 
ON public.price_alerts 
FOR SELECT 
USING (user_email = get_user_email());

-- Fix price_alerts UPDATE - users can only update their own
DROP POLICY IF EXISTS "Users can update their own alerts" ON public.price_alerts;
CREATE POLICY "Users can update their own alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (user_email = get_user_email());

-- Fix price_alerts DELETE - users can only delete their own
DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.price_alerts;
CREATE POLICY "Users can delete their own alerts" 
ON public.price_alerts 
FOR DELETE 
USING (user_email = get_user_email());

-- 3. trn_redemptions - Require authentication for INSERT
DROP POLICY IF EXISTS "Anyone can create redemptions" ON public.trn_redemptions;
DROP POLICY IF EXISTS "Users can create their own redemptions" ON public.trn_redemptions;
CREATE POLICY "Authenticated users can create redemptions" 
ON public.trn_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix trn_redemptions SELECT - users see only their own
DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.trn_redemptions;
DROP POLICY IF EXISTS "Admins can view all redemptions" ON public.trn_redemptions;
CREATE POLICY "Users can view their own redemptions" 
ON public.trn_redemptions 
FOR SELECT 
USING (email = get_user_email() OR has_role(auth.uid(), 'admin'));

-- Fix trn_redemptions UPDATE - admins only
DROP POLICY IF EXISTS "Admins can update redemptions" ON public.trn_redemptions;
CREATE POLICY "Admins can update redemptions" 
ON public.trn_redemptions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 3: Fix Medium Issues (WARN-level)
-- =============================================

-- 1. referral_tracking - Restrict SELECT to admin only (contains PII)
DROP POLICY IF EXISTS "Anyone can view referral tracking" ON public.referral_tracking;
DROP POLICY IF EXISTS "Public can view referrals" ON public.referral_tracking;
CREATE POLICY "Admins can view referral tracking" 
ON public.referral_tracking 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- 2. market_predictions - Restrict SELECT to own predictions + public leaderboard view
DROP POLICY IF EXISTS "Anyone can view predictions" ON public.market_predictions;
CREATE POLICY "Users can view own predictions or resolved ones" 
ON public.market_predictions 
FOR SELECT 
USING (user_wallet = get_user_wallet_address() OR resolved_at IS NOT NULL);

-- 3. trn_purchases - Restrict SELECT to own purchases only
DROP POLICY IF EXISTS "Anyone can view purchases" ON public.trn_purchases;
DROP POLICY IF EXISTS "Public can view purchases" ON public.trn_purchases;
CREATE POLICY "Users can view their own purchases" 
ON public.trn_purchases 
FOR SELECT 
USING (wallet_address = get_user_wallet_address() OR has_role(auth.uid(), 'admin'));

-- 4. purchase_leaderboard - Fix policy to properly use is_public flag
DROP POLICY IF EXISTS "Anyone can view public leaderboard" ON public.purchase_leaderboard;
DROP POLICY IF EXISTS "Public can view leaderboard entries" ON public.purchase_leaderboard;
CREATE POLICY "View public leaderboard or own entry" 
ON public.purchase_leaderboard 
FOR SELECT 
USING (is_public = true OR wallet_address = get_user_wallet_address() OR has_role(auth.uid(), 'admin'));

-- Fix purchase_leaderboard UPDATE - users can only update their own
DROP POLICY IF EXISTS "Users can update their own entry" ON public.purchase_leaderboard;
CREATE POLICY "Users can update their own entry" 
ON public.purchase_leaderboard 
FOR UPDATE 
USING (wallet_address = get_user_wallet_address());