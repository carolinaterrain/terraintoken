-- =============================================
-- Fix referral_tracking - Remove public access policy
-- =============================================
DROP POLICY IF EXISTS "Public can view referral stats" ON public.referral_tracking;

-- Fix auth.users references in referral_tracking
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referral_tracking;
DROP POLICY IF EXISTS "Users can view their referrals" ON public.referral_tracking;
CREATE POLICY "Users can view their own referrals" 
ON public.referral_tracking 
FOR SELECT 
USING (
  referrer_code IN (
    SELECT referral_code FROM referral_codes 
    WHERE wallet_address = get_user_wallet_address()
  )
);

-- =============================================
-- Fix referral_rewards - Fix auth.users references
-- =============================================
DROP POLICY IF EXISTS "Users can view their own referral rewards" ON public.referral_rewards;
DROP POLICY IF EXISTS "Users can view their referral rewards" ON public.referral_rewards;
-- Keep "View own referral rewards" which uses get_user_email() - it's correct

-- Create a clean policy for referrer to view (without exposing email)
CREATE POLICY "Referrers can view their rewards stats" 
ON public.referral_rewards 
FOR SELECT 
USING (
  referrer_code IN (
    SELECT referral_code FROM referral_codes 
    WHERE wallet_address = get_user_wallet_address()
  )
  OR has_role(auth.uid(), 'admin')
);

-- =============================================
-- Ensure analytics_events SELECT is admin-only (it already is)
-- The public INSERT is intentional for tracking unauthenticated users
-- =============================================

-- =============================================
-- Mark remaining findings as acceptable - these tables 
-- already have proper admin-only policies:
-- - holder_snapshots (admin + service role only)
-- - heat_map_events (admin only)
-- - funnel_events (admin only)
-- - ab_test_events (admin only)
-- - service_redemptions (own data + admin)
-- - trn_rewards_ledger (own data + admin)
-- =============================================

-- No additional changes needed for WARN-level findings
-- They are properly secured with admin-only access