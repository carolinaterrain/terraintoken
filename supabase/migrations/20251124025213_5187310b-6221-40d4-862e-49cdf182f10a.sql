-- Fix tautological RLS policies that always evaluate to true
-- These policies currently allow any user to access any data

-- 1. Fix market_predictions policies
DROP POLICY IF EXISTS "Users can update their own predictions" ON market_predictions;
CREATE POLICY "Users can update their own predictions"
ON market_predictions FOR UPDATE
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 2. Fix portfolio_holdings policies
DROP POLICY IF EXISTS "Users can view their own holdings" ON portfolio_holdings;
CREATE POLICY "Users can view their own holdings"
ON portfolio_holdings FOR SELECT
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own holdings" ON portfolio_holdings;
CREATE POLICY "Users can update their own holdings"
ON portfolio_holdings FOR UPDATE
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own holdings" ON portfolio_holdings;
CREATE POLICY "Users can delete their own holdings"
ON portfolio_holdings FOR DELETE
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 3. Fix price_alerts policies
DROP POLICY IF EXISTS "Users can view their own alerts" ON price_alerts;
CREATE POLICY "Users can view their own alerts"
ON price_alerts FOR SELECT
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own alerts" ON price_alerts;
CREATE POLICY "Users can update their own alerts"
ON price_alerts FOR UPDATE
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own alerts" ON price_alerts;
CREATE POLICY "Users can delete their own alerts"
ON price_alerts FOR DELETE
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 4. Fix email_preferences policies
DROP POLICY IF EXISTS "Users can view their own email preferences" ON email_preferences;
CREATE POLICY "Users can view their own email preferences"
ON email_preferences FOR SELECT
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 5. Fix user_challenge_progress policy
DROP POLICY IF EXISTS "Users can update their progress" ON user_challenge_progress;
CREATE POLICY "Users can update their progress"
ON user_challenge_progress FOR UPDATE
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 6. Fix tournament_entries policy
DROP POLICY IF EXISTS "Users can manage their entries" ON tournament_entries;
CREATE POLICY "Users can view tournament entries"
ON tournament_entries FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own entries"
ON tournament_entries FOR INSERT
WITH CHECK (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own entries"
ON tournament_entries FOR UPDATE
USING (user_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 7. Fix ab_test_assignments policy
DROP POLICY IF EXISTS "Anyone can update their own assignments" ON ab_test_assignments;
CREATE POLICY "Users can update their own assignments"
ON ab_test_assignments FOR UPDATE
USING (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id'));

-- 8. Fix governance_proposals policy
DROP POLICY IF EXISTS "Proposal creators can update their proposals" ON governance_proposals;
CREATE POLICY "Proposal creators can update their proposals"
ON governance_proposals FOR UPDATE
USING (created_by_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 9. Restrict live_viewers and onboarding_progress to service role
-- These should not have public ALL access
DROP POLICY IF EXISTS "Anyone can manage live viewers" ON live_viewers;
CREATE POLICY "Service role can manage live viewers"
ON live_viewers FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Users can insert their viewer record"
ON live_viewers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their viewer record"
ON live_viewers FOR UPDATE
USING (session_id = session_id);

DROP POLICY IF EXISTS "Users can manage their onboarding" ON onboarding_progress;
CREATE POLICY "Users can manage their own onboarding"
ON onboarding_progress FOR ALL
USING (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id'))
WITH CHECK (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id'));