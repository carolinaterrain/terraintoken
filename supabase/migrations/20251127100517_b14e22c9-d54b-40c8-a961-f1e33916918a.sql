
-- STEP 3: Fix remaining RLS policies

-- =====================================================
-- Fix price_alerts RLS policies (drop and recreate with unique names)
-- =====================================================
DROP POLICY IF EXISTS "Users can view own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can insert own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can update own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can delete own alerts" ON public.price_alerts;

CREATE POLICY "View own price alerts"
ON public.price_alerts FOR SELECT
USING (user_email = public.get_user_email());

CREATE POLICY "Insert own price alerts"
ON public.price_alerts FOR INSERT
WITH CHECK (user_email = public.get_user_email());

CREATE POLICY "Update own price alerts"
ON public.price_alerts FOR UPDATE
USING (user_email = public.get_user_email());

CREATE POLICY "Delete own price alerts"
ON public.price_alerts FOR DELETE
USING (user_email = public.get_user_email());

-- =====================================================
-- Fix invoice_codes RLS policies
-- =====================================================
DROP POLICY IF EXISTS "Users can view own invoice codes" ON public.invoice_codes;

CREATE POLICY "View own invoice codes"
ON public.invoice_codes FOR SELECT
USING (customer_email = public.get_user_email() OR public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- Fix governance_proposals RLS policies
-- =====================================================
DROP POLICY IF EXISTS "Proposal creators can update proposals" ON public.governance_proposals;

CREATE POLICY "Creators can update proposals"
ON public.governance_proposals FOR UPDATE
USING (created_by_wallet = public.get_user_wallet_address());

-- =====================================================
-- Fix portfolio_holdings RLS policies
-- =====================================================
DROP POLICY IF EXISTS "Users can view own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can update own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can delete own holdings" ON public.portfolio_holdings;

CREATE POLICY "View own portfolio holdings"
ON public.portfolio_holdings FOR SELECT
USING (user_wallet = public.get_user_wallet_address());

CREATE POLICY "Update own portfolio holdings"
ON public.portfolio_holdings FOR UPDATE
USING (user_wallet = public.get_user_wallet_address());

CREATE POLICY "Delete own portfolio holdings"
ON public.portfolio_holdings FOR DELETE
USING (user_wallet = public.get_user_wallet_address());

-- =====================================================
-- Fix market_predictions RLS policies
-- =====================================================
DROP POLICY IF EXISTS "Users can update own predictions" ON public.market_predictions;

CREATE POLICY "Update own market predictions"
ON public.market_predictions FOR UPDATE
USING (user_wallet = public.get_user_wallet_address());

-- =====================================================
-- Fix terrainscape_waitlist - users view own only
-- =====================================================
DROP POLICY IF EXISTS "Users can view own waitlist entry" ON public.terrainscape_waitlist;

CREATE POLICY "View own waitlist entry"
ON public.terrainscape_waitlist FOR SELECT
USING (email = public.get_user_email() OR public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- Fix trn_redemptions - users view own only
-- =====================================================
DROP POLICY IF EXISTS "Users can view own redemptions" ON public.trn_redemptions;

CREATE POLICY "View own redemptions"
ON public.trn_redemptions FOR SELECT
USING (
  email = public.get_user_email() 
  OR wallet_address = public.get_user_wallet_address()
  OR public.has_role(auth.uid(), 'admin')
);

-- =====================================================
-- Fix referral_tracking - admin only
-- =====================================================
DROP POLICY IF EXISTS "Admins can view referral tracking" ON public.referral_tracking;

CREATE POLICY "Admin view referral tracking"
ON public.referral_tracking FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- Fix referral_rewards - users view own only
-- =====================================================
DROP POLICY IF EXISTS "Users can view own referral rewards" ON public.referral_rewards;

CREATE POLICY "View own referral rewards"
ON public.referral_rewards FOR SELECT
USING (
  referred_email = public.get_user_email()
  OR public.has_role(auth.uid(), 'admin')
);

-- =====================================================
-- Fix trn_rewards_ledger - users view own only
-- =====================================================
DROP POLICY IF EXISTS "Users can view own rewards" ON public.trn_rewards_ledger;

CREATE POLICY "View own rewards ledger"
ON public.trn_rewards_ledger FOR SELECT
USING (
  wallet_address = public.get_user_wallet_address()
  OR user_email = public.get_user_email()
  OR public.has_role(auth.uid(), 'admin')
);

-- =====================================================
-- Create secure aggregate function for public stats
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_referral_stats()
RETURNS TABLE (
  total_referrals bigint,
  total_rewards_distributed numeric,
  active_referrers bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*)::bigint as total_referrals,
    COALESCE(SUM(trn_amount), 0)::numeric as total_rewards_distributed,
    COUNT(DISTINCT referrer_code)::bigint as active_referrers
  FROM referral_rewards
  WHERE status = 'paid'
$$;
