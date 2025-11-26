-- Phase 1: Fix Critical Security Issues - Comprehensive RLS Policy Cleanup and Rebuild

-- 1.1 Fix invoice_codes RLS
DROP POLICY IF EXISTS "Anyone can view codes" ON invoice_codes;
DROP POLICY IF EXISTS "Anyone can redeem codes" ON invoice_codes;
DROP POLICY IF EXISTS "Admins can view all invoice codes" ON invoice_codes;
DROP POLICY IF EXISTS "Users can view their own invoice codes" ON invoice_codes;
DROP POLICY IF EXISTS "Anyone can redeem valid codes" ON invoice_codes;

CREATE POLICY "Admins can view all invoice codes"
ON invoice_codes FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own invoice codes"
ON invoice_codes FOR SELECT
TO authenticated
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Anyone can redeem valid codes"
ON invoice_codes FOR UPDATE
USING (status = 'active' AND expires_at > now());

-- 1.2 Fix terrainscape_waitlist RLS
DROP POLICY IF EXISTS "Public can join waitlist" ON terrainscape_waitlist;
DROP POLICY IF EXISTS "Users can insert waitlist entry" ON terrainscape_waitlist;
DROP POLICY IF EXISTS "Public can view waitlist count" ON terrainscape_waitlist;
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON terrainscape_waitlist;
DROP POLICY IF EXISTS "Users can update their own waitlist entry" ON terrainscape_waitlist;
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON terrainscape_waitlist;
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON terrainscape_waitlist;

CREATE POLICY "Users can insert their own waitlist entry"
ON terrainscape_waitlist FOR INSERT
WITH CHECK (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR auth.uid() IS NULL
);

CREATE POLICY "Users can view their own waitlist entry"
ON terrainscape_waitlist FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can view all waitlist entries"
ON terrainscape_waitlist FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own waitlist entry"
ON terrainscape_waitlist FOR UPDATE
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())
);

-- 1.3 Fix referral_tracking RLS
DROP POLICY IF EXISTS "Public can view referral tracking" ON referral_tracking;
DROP POLICY IF EXISTS "Users can view their own referrals" ON referral_tracking;
DROP POLICY IF EXISTS "Admins can view all referral tracking" ON referral_tracking;

CREATE POLICY "Users can view their own referrals"
ON referral_tracking FOR SELECT
TO authenticated
USING (
  referrer_code IN (
    SELECT referral_code FROM referral_codes WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Admins can view all referral tracking"
ON referral_tracking FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 1.4 Fix referral_rewards RLS
DROP POLICY IF EXISTS "Public can view referral rewards" ON referral_rewards;
DROP POLICY IF EXISTS "Users can view their own referral rewards" ON referral_rewards;
DROP POLICY IF EXISTS "Admins can view all referral rewards" ON referral_rewards;

CREATE POLICY "Users can view their own referral rewards"
ON referral_rewards FOR SELECT
TO authenticated
USING (
  referrer_code IN (
    SELECT referral_code FROM referral_codes WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Admins can view all referral rewards"
ON referral_rewards FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 1.5 Fix price_alerts RLS
DROP POLICY IF EXISTS "Users can delete their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can insert their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can view their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can manage their own price alerts" ON price_alerts;

CREATE POLICY "Users can manage their own price alerts"
ON price_alerts FOR ALL
TO authenticated
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
WITH CHECK (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 1.6 Fix service_redemptions RLS
DROP POLICY IF EXISTS "Public can view service redemptions" ON service_redemptions;
DROP POLICY IF EXISTS "Users can view their own service redemptions" ON service_redemptions;
DROP POLICY IF EXISTS "Admins can view all service redemptions" ON service_redemptions;
DROP POLICY IF EXISTS "Authenticated users can create redemptions" ON service_redemptions;
DROP POLICY IF EXISTS "Users can view own service redemptions" ON service_redemptions;
DROP POLICY IF EXISTS "Users can create own service redemptions" ON service_redemptions;

CREATE POLICY "Users can view their own service redemptions"
ON service_redemptions FOR SELECT
TO authenticated
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all service redemptions"
ON service_redemptions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create redemptions"
ON service_redemptions FOR INSERT
TO authenticated
WITH CHECK (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));