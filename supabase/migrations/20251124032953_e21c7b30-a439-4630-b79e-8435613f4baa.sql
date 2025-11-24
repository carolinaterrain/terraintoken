-- Fix live_viewers tautological policy
DROP POLICY IF EXISTS "Users can update their viewer record" ON live_viewers;
CREATE POLICY "Users can update their viewer record"
ON live_viewers FOR UPDATE
USING (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id'));

-- Fix purchase_leaderboard overly permissive policy
DROP POLICY IF EXISTS "Users can update their stats" ON purchase_leaderboard;

CREATE POLICY "Users can view leaderboard"
ON purchase_leaderboard FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own stats"
ON purchase_leaderboard FOR INSERT
WITH CHECK (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own stats"
ON purchase_leaderboard FOR UPDATE
USING (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()))
WITH CHECK (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own stats"
ON purchase_leaderboard FOR DELETE
USING (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- Fix push_subscriptions overly permissive policy
DROP POLICY IF EXISTS "Anyone can manage their push subscriptions" ON push_subscriptions;

CREATE POLICY "Users can manage their own subscriptions"
ON push_subscriptions FOR ALL
USING (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id'))
WITH CHECK (session_id = (current_setting('request.jwt.claims', true)::json->>'session_id'));