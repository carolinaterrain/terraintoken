
-- Clean up duplicate live_viewers INSERT
DROP POLICY IF EXISTS "Users can insert their viewer record" ON public.live_viewers;

-- referral_redemptions: should be service_role only (system inserts)
DROP POLICY IF EXISTS "System can insert redemptions" ON public.referral_redemptions;
CREATE POLICY "Service role can insert referral redemptions"
  ON public.referral_redemptions FOR INSERT
  TO service_role
  WITH CHECK (true);

-- subscription_payments: should be service_role only
DROP POLICY IF EXISTS "System can insert payments" ON public.subscription_payments;
CREATE POLICY "Service role can insert subscription payments"
  ON public.subscription_payments FOR INSERT
  TO service_role
  WITH CHECK (true);

-- season_pass_holders: require auth
DROP POLICY IF EXISTS "Anyone can purchase pass" ON public.season_pass_holders;
CREATE POLICY "Authenticated users can purchase pass"
  ON public.season_pass_holders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Clean up duplicate INSERT on terrainscape_waitlist
DROP POLICY IF EXISTS "Users can insert their own waitlist entry" ON public.terrainscape_waitlist;

-- Clean up duplicate INSERT on trn_redemptions (if any remain)
DROP POLICY IF EXISTS "Anyone can create redemption requests" ON public.trn_redemptions;
DROP POLICY IF EXISTS "Users can insert their own redemptions" ON public.trn_redemptions;
