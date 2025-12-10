-- Security RLS Fixes for Phase 3

-- 1. Fix terrainscape_waitlist email exposure - restrict public reads
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.terrainscape_waitlist;
DROP POLICY IF EXISTS "View own waitlist entry" ON public.terrainscape_waitlist;

-- Recreate with stricter policies
CREATE POLICY "Anyone can join waitlist" 
ON public.terrainscape_waitlist 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can only view own waitlist entry by email" 
ON public.terrainscape_waitlist 
FOR SELECT 
USING (
  email = get_user_email() 
  OR has_role(auth.uid(), 'admin')
);

-- 2. Fix referral_tracking exposure - restrict visibility to own referrals
DROP POLICY IF EXISTS "Anyone can insert referrals" ON public.referral_tracking;
DROP POLICY IF EXISTS "Referrers can view their referrals" ON public.referral_tracking;

CREATE POLICY "Anyone can insert referrals" 
ON public.referral_tracking 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Referrers can view only their own referrals" 
ON public.referral_tracking 
FOR SELECT 
USING (
  referrer_code IN (
    SELECT referral_code FROM public.terrainscape_waitlist 
    WHERE email = get_user_email()
  )
  OR has_role(auth.uid(), 'admin')
);

-- 3. Strengthen trn_rewards_ledger to prevent session correlation attacks
DROP POLICY IF EXISTS "Users can view own rewards by session" ON public.trn_rewards_ledger;

-- Only allow wallet-based or email-based access, not session-based for security
CREATE POLICY "Users can view own rewards securely" 
ON public.trn_rewards_ledger 
FOR SELECT 
USING (
  (wallet_address IS NOT NULL AND wallet_address = get_user_wallet_address())
  OR (user_email IS NOT NULL AND user_email = get_user_email())
  OR has_role(auth.uid(), 'admin')
);

-- 4. Fix price_alerts to prevent email enumeration
DROP POLICY IF EXISTS "Users can view their own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can create their own alerts" ON public.price_alerts;

CREATE POLICY "Users can view own price alerts securely"
ON public.price_alerts
FOR SELECT
USING (user_email = get_user_email() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own price alerts"
ON public.price_alerts
FOR INSERT
WITH CHECK (user_email = get_user_email());

CREATE POLICY "Users can update own price alerts"
ON public.price_alerts
FOR UPDATE
USING (user_email = get_user_email());

CREATE POLICY "Users can delete own price alerts"
ON public.price_alerts
FOR DELETE
USING (user_email = get_user_email());