-- 1. Wallet identity must come from server-controlled app metadata only
CREATE OR REPLACE FUNCTION public.get_user_wallet_address()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (raw_app_meta_data->>'wallet_address')::text FROM auth.users WHERE id = auth.uid()
$function$;

-- 2. Remove policies that trusted user-editable metadata / request headers
DROP POLICY IF EXISTS "Users can update their progress" ON public.user_challenge_progress;
CREATE POLICY "Users can update their progress" ON public.user_challenge_progress
  FOR UPDATE TO authenticated
  USING (user_wallet = public.get_user_wallet_address())
  WITH CHECK (user_wallet = public.get_user_wallet_address());

DROP POLICY IF EXISTS "Users can view own rewards by wallet" ON public.trn_rewards_ledger;
DROP POLICY IF EXISTS "Proposal creators can update their proposals" ON public.governance_proposals;

DROP POLICY IF EXISTS "Users can update their own waitlist entry" ON public.terrainscape_waitlist;
CREATE POLICY "Users can update their own waitlist entry" ON public.terrainscape_waitlist
  FOR UPDATE TO authenticated
  USING (email = public.get_user_email() OR (wallet_address IS NOT NULL AND wallet_address = public.get_user_wallet_address()))
  WITH CHECK (email = public.get_user_email() OR (wallet_address IS NOT NULL AND wallet_address = public.get_user_wallet_address()));

DROP POLICY IF EXISTS "Users can insert their own stats" ON public.purchase_leaderboard;
CREATE POLICY "Users can insert their own stats" ON public.purchase_leaderboard
  FOR INSERT TO authenticated
  WITH CHECK (wallet_address = public.get_user_wallet_address());
DROP POLICY IF EXISTS "Users can delete their own stats" ON public.purchase_leaderboard;
CREATE POLICY "Users can delete their own stats" ON public.purchase_leaderboard
  FOR DELETE TO authenticated
  USING (wallet_address = public.get_user_wallet_address());
DROP POLICY IF EXISTS "Users can update their own stats" ON public.purchase_leaderboard;
DROP POLICY IF EXISTS "Users can view their own leaderboard entry" ON public.purchase_leaderboard;
DROP POLICY IF EXISTS "Users can view leaderboard" ON public.purchase_leaderboard;

DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Service role can manage user stats" ON public.user_stats;

DROP POLICY IF EXISTS "Users can update their own predictions" ON public.market_predictions;

DROP POLICY IF EXISTS "Users can view own challenges" ON public.wallet_link_challenges;
CREATE POLICY "Users can view own challenges" ON public.wallet_link_challenges
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Anyone can create challenges" ON public.wallet_link_challenges;

DROP POLICY IF EXISTS "Users can view their own rewards" ON public.trn_rewards;
CREATE POLICY "Users can view their own rewards" ON public.trn_rewards
  FOR SELECT
  USING (
    user_wallet_address = ((current_setting('request.jwt.claims', true))::json ->> 'wallet_address')
    OR user_wallet_address = public.get_user_wallet_address()
  );
DROP POLICY IF EXISTS "Anyone can view rewards" ON public.trn_rewards;
DROP POLICY IF EXISTS "Service role can manage rewards" ON public.trn_rewards;
CREATE POLICY "Admins can manage rewards" ON public.trn_rewards
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can delete their own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can update their own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Users can view their own holdings" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "Authenticated users can insert holdings" ON public.portfolio_holdings;
CREATE POLICY "Users can insert their own holdings" ON public.portfolio_holdings
  FOR INSERT TO authenticated
  WITH CHECK (user_wallet = public.get_user_wallet_address());

DROP POLICY IF EXISTS "Users can insert their own entries" ON public.tournament_entries;
DROP POLICY IF EXISTS "Anyone can view tournament entries" ON public.tournament_entries;
DROP POLICY IF EXISTS "Users can view tournament entries" ON public.tournament_entries;
CREATE POLICY "Users can view own tournament entries" ON public.tournament_entries
  FOR SELECT
  USING (user_wallet = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own redemptions as referee" ON public.referral_redemptions;
CREATE POLICY "Users can view own redemptions as referee" ON public.referral_redemptions
  FOR SELECT TO authenticated
  USING (referee_wallet = public.get_user_wallet_address());
DROP POLICY IF EXISTS "Users can view own redemptions as referrer" ON public.referral_redemptions;
CREATE POLICY "Users can view own redemptions as referrer" ON public.referral_redemptions
  FOR SELECT TO authenticated
  USING (referrer_wallet = public.get_user_wallet_address());

-- 3. Live viewer counter: validated functions instead of open table access
DROP POLICY IF EXISTS "Anyone can insert their viewer session" ON public.live_viewers;
DROP POLICY IF EXISTS "Anyone can view viewer counts" ON public.live_viewers;
DROP POLICY IF EXISTS "Users can delete own viewer session" ON public.live_viewers;
DROP POLICY IF EXISTS "Users can update own viewer session" ON public.live_viewers;

CREATE OR REPLACE FUNCTION public.register_live_viewer(p_session_id text, p_page_path text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF p_session_id IS NULL OR length(p_session_id) < 6 OR length(p_session_id) > 128 THEN
    RAISE EXCEPTION 'Invalid session';
  END IF;
  IF p_page_path IS NULL OR length(p_page_path) > 200 OR left(p_page_path, 1) <> '/' THEN
    RAISE EXCEPTION 'Invalid page';
  END IF;
  INSERT INTO public.live_viewers (session_id, page_path, last_ping)
  VALUES (p_session_id, p_page_path, now())
  ON CONFLICT (session_id) DO UPDATE SET last_ping = now(), page_path = EXCLUDED.page_path;
END;
$function$;

CREATE OR REPLACE FUNCTION public.remove_live_viewer(p_session_id text)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  DELETE FROM public.live_viewers WHERE session_id = p_session_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_live_viewer_count(p_page_path text)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COUNT(*)::integer FROM public.live_viewers
  WHERE page_path = p_page_path AND last_ping > now() - interval '5 minutes';
$function$;

GRANT EXECUTE ON FUNCTION public.register_live_viewer(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.remove_live_viewer(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_live_viewer_count(text) TO anon, authenticated;

-- 4. A/B testing: validated assignment function + validated event inserts
DROP POLICY IF EXISTS "Anyone can insert test assignments" ON public.ab_test_assignments;
DROP POLICY IF EXISTS "Anyone can view their assignments" ON public.ab_test_assignments;

CREATE OR REPLACE FUNCTION public.get_or_assign_ab_variant(p_test_id uuid, p_session_id text, p_variant text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_variants jsonb;
  v_existing text;
BEGIN
  IF p_session_id IS NULL OR length(p_session_id) < 8 OR length(p_session_id) > 128 THEN
    RAISE EXCEPTION 'Invalid session';
  END IF;

  SELECT variants INTO v_variants FROM public.ab_tests WHERE id = p_test_id AND status = 'active';
  IF v_variants IS NULL THEN
    RAISE EXCEPTION 'Test not active';
  END IF;

  SELECT variant INTO v_existing FROM public.ab_test_assignments
  WHERE test_id = p_test_id AND session_id = p_session_id;
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  IF p_variant IS NULL OR NOT (v_variants ? p_variant) THEN
    RAISE EXCEPTION 'Invalid variant';
  END IF;

  INSERT INTO public.ab_test_assignments (test_id, session_id, variant)
  VALUES (p_test_id, p_session_id, p_variant)
  ON CONFLICT (test_id, session_id) DO NOTHING;

  SELECT variant INTO v_existing FROM public.ab_test_assignments
  WHERE test_id = p_test_id AND session_id = p_session_id;
  RETURN v_existing;
END;
$function$;
GRANT EXECUTE ON FUNCTION public.get_or_assign_ab_variant(uuid, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_active_ab_test(p_test_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.ab_tests WHERE id = p_test_id AND status = 'active');
$function$;
GRANT EXECUTE ON FUNCTION public.is_active_ab_test(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can track test events" ON public.ab_test_events;
CREATE POLICY "Visitors can track events for active tests" ON public.ab_test_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    public.is_active_ab_test(test_id)
    AND event_type IN ('view', 'click', 'conversion')
    AND length(session_id) BETWEEN 8 AND 128
    AND length(variant) BETWEEN 1 AND 64
    AND (event_data IS NULL OR pg_column_size(event_data) <= 8192)
  );

-- 5. Public forms: validate what anonymous visitors may submit
DROP POLICY IF EXISTS "Anyone can insert errors" ON public.error_logs;
CREATE POLICY "Visitors can report errors" ON public.error_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(error_message) BETWEEN 1 AND 10000
    AND coalesce(resolved, false) = false
    AND resolved_at IS NULL
    AND resolved_by IS NULL
    AND (severity IS NULL OR severity IN ('info', 'warning', 'error', 'critical'))
    AND (user_id IS NULL OR user_id = auth.uid())
    AND (stack_trace IS NULL OR length(stack_trace) <= 20000)
    AND (page_url IS NULL OR length(page_url) <= 2048)
    AND (user_agent IS NULL OR length(user_agent) <= 1024)
    AND (metadata IS NULL OR pg_column_size(metadata) <= 16384)
  );

DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.terrainscape_waitlist;
CREATE POLICY "Visitors can join waitlist" ON public.terrainscape_waitlist
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(email) BETWEEN 5 AND 255
    AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    AND (wallet_address IS NULL OR length(wallet_address) BETWEEN 32 AND 44)
    AND length(referral_code) BETWEEN 4 AND 32
    AND (referred_by IS NULL OR length(referred_by) <= 32)
    AND coalesce(priority_score, 0) = 0
    AND coalesce(status, 'pending') = 'pending'
    AND coalesce(is_trn_holder, false) = false
    AND coalesce(trn_balance, 0) = 0
    AND invited_at IS NULL
    AND (signup_source IS NULL OR length(signup_source) <= 64)
    AND (utm_source IS NULL OR length(utm_source) <= 128)
    AND (utm_campaign IS NULL OR length(utm_campaign) <= 128)
    AND (beta_application IS NULL OR length(beta_application) <= 5000)
    AND (metadata IS NULL OR pg_column_size(metadata) <= 8192)
  );

DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.meme_submissions;
DROP POLICY IF EXISTS "Authenticated users can insert project media" ON public.project_media;
DROP POLICY IF EXISTS "Anyone can submit investor interest" ON public.investor_interests;
DROP POLICY IF EXISTS "Anyone can insert referrals" ON public.referral_tracking;
DROP POLICY IF EXISTS "Anyone can insert heat map events" ON public.heat_map_events;
DROP POLICY IF EXISTS "Anyone can insert funnel events" ON public.funnel_events;

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials" ON public.testimonials
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Public can view all testimonials" ON public.testimonials;
CREATE POLICY "Public can view featured testimonials" ON public.testimonials
  FOR SELECT
  USING (is_featured = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can submit art" ON public.artist_drop_submissions;
CREATE POLICY "Artists can submit their own art" ON public.artist_drop_submissions
  FOR INSERT TO authenticated
  WITH CHECK (
    artist_email = public.get_user_email()
    AND status = 'pending'
    AND commission_rate = 10.00
    AND admin_notes IS NULL
    AND reviewed_at IS NULL
    AND reviewed_by IS NULL
    AND shopify_product_id IS NULL
    AND coalesce(total_sales, 0) = 0
    AND coalesce(total_trn_earned, 0) = 0
  );

DROP POLICY IF EXISTS "Authenticated users can create redemptions" ON public.trn_redemptions;
CREATE POLICY "Users can request their own redemptions" ON public.trn_redemptions
  FOR INSERT TO authenticated
  WITH CHECK (
    (email = public.get_user_email() OR wallet_address = public.get_user_wallet_address())
    AND status = 'pending'
    AND admin_notes IS NULL
    AND completed_at IS NULL
  );

DROP POLICY IF EXISTS "Authenticated users can create proposals" ON public.governance_proposals;
CREATE POLICY "Users can create their own proposals" ON public.governance_proposals
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by_wallet = public.get_user_wallet_address()
    AND votes_for = 0
    AND votes_against = 0
    AND total_voting_power = 0
  );
DROP POLICY IF EXISTS "Anyone can view proposals" ON public.governance_proposals;
CREATE POLICY "Public can view published proposals" ON public.governance_proposals
  FOR SELECT
  USING (
    status <> 'draft'
    OR created_by_wallet = public.get_user_wallet_address()
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Authenticated users can vote" ON public.governance_votes;
CREATE POLICY "Users can cast their own votes" ON public.governance_votes
  FOR INSERT TO authenticated
  WITH CHECK (voter_wallet = public.get_user_wallet_address());
DROP POLICY IF EXISTS "Anyone can view votes" ON public.governance_votes;
CREATE POLICY "Users can view own votes" ON public.governance_votes
  FOR SELECT
  USING (voter_wallet = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can insert predictions" ON public.market_predictions;
CREATE POLICY "Users can insert their own predictions" ON public.market_predictions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_wallet = public.get_user_wallet_address()
    AND resolved_at IS NULL
    AND actual_price IS NULL
    AND was_correct IS NULL
    AND coalesce(points_earned, 0) = 0
  );

DROP POLICY IF EXISTS "Authenticated users can insert wallet connections" ON public.wallet_connections;
CREATE POLICY "Users can insert their own wallet connections" ON public.wallet_connections
  FOR INSERT TO authenticated
  WITH CHECK (wallet_address = public.get_user_wallet_address());

DROP POLICY IF EXISTS "Authenticated users can create referral codes" ON public.referral_codes;
CREATE POLICY "Users can create their own referral codes" ON public.referral_codes
  FOR INSERT TO authenticated
  WITH CHECK (
    wallet_address = public.get_user_wallet_address()
    AND coalesce(total_referrals, 0) = 0
    AND coalesce(total_bonus_trn, 0) = 0
  );
DROP POLICY IF EXISTS "Anyone can view referral codes" ON public.referral_codes;
CREATE POLICY "Users can view own referral codes" ON public.referral_codes
  FOR SELECT
  USING (wallet_address = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

-- 6. Purchases / payments / stakes: server functions only
DROP POLICY IF EXISTS "Authenticated users can purchase pass" ON public.season_pass_holders;
DROP POLICY IF EXISTS "Authenticated users can create purchases" ON public.collector_drop_purchases;
DROP POLICY IF EXISTS "Authenticated users can create subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can insert energy purchases" ON public.energy_purchases;
DROP POLICY IF EXISTS "Authenticated users can insert gamification purchases" ON public.gamification_purchases;
DROP POLICY IF EXISTS "Users can insert purchases" ON public.trn_purchases;
DROP POLICY IF EXISTS "Authenticated users can create NFT purchases" ON public.supporter_nfts;
DROP POLICY IF EXISTS "Authenticated users can insert stakes" ON public.prediction_stakes;
DROP POLICY IF EXISTS "Authenticated users can insert contest stakes" ON public.contest_stakes;
DROP POLICY IF EXISTS "Anyone can view contest stakes" ON public.contest_stakes;
CREATE POLICY "Users can view own contest stakes" ON public.contest_stakes
  FOR SELECT
  USING (user_wallet = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can create service redemptions" ON public.service_redemptions;

-- 7. Per-wallet records: owner or admin only
DROP POLICY IF EXISTS "Anyone can submit proofs" ON public.tool_usage_proofs;
DROP POLICY IF EXISTS "Anyone can view proofs" ON public.tool_usage_proofs;
CREATE POLICY "Users can view own proofs" ON public.tool_usage_proofs
  FOR SELECT
  USING (wallet_address = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can view certificates" ON public.collector_nft_certificates;
CREATE POLICY "Owners and admins can view certificates" ON public.collector_nft_certificates
  FOR SELECT
  USING (
    (claimed_by_wallet IS NOT NULL AND claimed_by_wallet = public.get_user_wallet_address())
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Service role can manage achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Public can view achievements" ON public.user_achievements;

DROP POLICY IF EXISTS "Anyone can view achievements" ON public.market_achievements;
DROP POLICY IF EXISTS "Authenticated users can insert achievements" ON public.market_achievements;
CREATE POLICY "Users can view own market achievements" ON public.market_achievements
  FOR SELECT
  USING (user_wallet = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can view contest entries" ON public.contest_entries;
CREATE POLICY "Users can view own contest entries" ON public.contest_entries
  FOR SELECT
  USING (user_wallet_address = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_challenge_progress;
CREATE POLICY "Users can view their own progress" ON public.user_challenge_progress
  FOR SELECT
  USING (user_wallet = public.get_user_wallet_address() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can view quest progress" ON public.user_quest_progress;
DROP POLICY IF EXISTS "Anyone can view aggregate stats" ON public.staking_positions;
DROP POLICY IF EXISTS "Public can view documents" ON public.documents;

-- 8. Public dashboards: restrict to non-personal / real data
DROP POLICY IF EXISTS "Anyone can view burns" ON public.token_burns;
CREATE POLICY "Public can view real burns" ON public.token_burns
  FOR SELECT
  USING (is_test_data = false OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "System can insert burns" ON public.token_burns;
CREATE POLICY "Admins can record burns" ON public.token_burns
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view whale alerts" ON public.whale_alerts;
CREATE POLICY "Admins can view whale alerts" ON public.whale_alerts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "System can insert whale alerts" ON public.whale_alerts;

DROP POLICY IF EXISTS "Anyone can view ecosystem events" ON public.ecosystem_events;
CREATE POLICY "Public can view system ecosystem events" ON public.ecosystem_events
  FOR SELECT
  USING (
    (user_id IS NULL AND wallet_address IS NULL AND session_id IS NULL)
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Anyone can view burn bands" ON public.burn_bands;
CREATE POLICY "Public can view effective burn bands" ON public.burn_bands
  FOR SELECT
  USING (effective_from <= now() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can view daily quests" ON public.daily_quests;
CREATE POLICY "Public can view active daily quests" ON public.daily_quests
  FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

-- 9. File storage: uploads only via server functions or admins
DROP POLICY IF EXISTS "Authenticated users can upload to projects bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload carolina terrain projects" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload memes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload memes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to meme submissions" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload team images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view team photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view team images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;

CREATE POLICY "Admins can view team photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'carolina-terrain-team' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));