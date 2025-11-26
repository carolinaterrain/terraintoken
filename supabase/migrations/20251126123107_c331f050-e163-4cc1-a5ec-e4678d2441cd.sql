-- Fix Critical Security Issues: Tighten RLS on PII-containing tables (Corrected)

-- 1. INVESTOR_INTERESTS: Add explicit denial for anonymous users
CREATE POLICY "Public cannot view investor details"
ON public.investor_interests
FOR SELECT
TO anon
USING (false);

-- 2. EMAIL_PREFERENCES: Restrict INSERT to authenticated users
DROP POLICY IF EXISTS "Anyone can insert email preferences" ON public.email_preferences;

CREATE POLICY "Authenticated users can insert email preferences"
ON public.email_preferences
FOR INSERT
TO authenticated
WITH CHECK (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Service role can insert email preferences"
ON public.email_preferences
FOR INSERT
TO service_role
WITH CHECK (true);

-- 3. PRICE_ALERTS: Ensure users can only access their own alerts
CREATE POLICY "Users can view own alerts"
ON public.price_alerts
FOR SELECT
TO authenticated
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert own alerts"
ON public.price_alerts
FOR INSERT
TO authenticated
WITH CHECK (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own alerts"
ON public.price_alerts
FOR UPDATE
TO authenticated
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete own alerts"
ON public.price_alerts
FOR DELETE
TO authenticated
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all alerts"
ON public.price_alerts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. REFERRAL_TRACKING: Restrict viewing to referrer only
CREATE POLICY "Users can view their referrals"
ON public.referral_tracking
FOR SELECT
TO authenticated
USING (
  referrer_code IN (
    SELECT referral_code FROM public.referral_codes 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can manage all referrals"
ON public.referral_tracking
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. REFERRAL_REWARDS: Restrict viewing to referrer only
CREATE POLICY "Users can view their referral rewards"
ON public.referral_rewards
FOR SELECT
TO authenticated
USING (
  referrer_code IN (
    SELECT referral_code FROM public.referral_codes 
    WHERE wallet_address = (
      SELECT raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Admins can manage all rewards"
ON public.referral_rewards
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. Add policy comments for documentation
COMMENT ON POLICY "Public cannot view investor details" ON public.investor_interests IS 
'Prevents anonymous users from accessing sensitive investor information';

COMMENT ON POLICY "Users can view own alerts" ON public.price_alerts IS 
'Restricts price alert access to the alert owner only';

COMMENT ON POLICY "Users can view their referrals" ON public.referral_tracking IS
'Users can only view referrals they generated';

COMMENT ON POLICY "Users can view their referral rewards" ON public.referral_rewards IS
'Users can only view rewards for their own referrals';