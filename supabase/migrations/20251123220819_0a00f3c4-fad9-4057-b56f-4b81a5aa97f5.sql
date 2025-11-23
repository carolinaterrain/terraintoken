-- Fix overly permissive RLS policies

-- 1. Make price_alerts table private (only users can see their own alerts)
DROP POLICY IF EXISTS "Anyone can view price alerts" ON price_alerts;
CREATE POLICY "Users can view own price alerts"
ON price_alerts FOR SELECT
USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 2. Add is_public flag to purchase_leaderboard for opt-out
ALTER TABLE purchase_leaderboard 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing rows to be public by default
UPDATE purchase_leaderboard SET is_public = true WHERE is_public IS NULL;

-- 3. Update leaderboard policy to respect is_public flag
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON purchase_leaderboard;
CREATE POLICY "Anyone can view public leaderboard entries"
ON purchase_leaderboard FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can view their own leaderboard entry"
ON purchase_leaderboard FOR SELECT
USING (wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 4. Fix referral_redemptions to be private
DROP POLICY IF EXISTS "Anyone can view redemptions" ON referral_redemptions;
CREATE POLICY "Users can view own redemptions as referee"
ON referral_redemptions FOR SELECT
USING (referee_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can view own redemptions as referrer"
ON referral_redemptions FOR SELECT
USING (referrer_wallet = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid()));

-- 5. Fix SECURITY DEFINER views by recreating without it
DROP VIEW IF EXISTS prediction_user_stats CASCADE;
DROP VIEW IF EXISTS prediction_leaderboard CASCADE;

-- Recreate prediction_user_stats without SECURITY DEFINER
CREATE VIEW prediction_user_stats AS
SELECT
  user_wallet,
  COUNT(*) as total_predictions,
  SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END) as correct_predictions,
  SUM(CASE WHEN was_correct = false THEN 1 ELSE 0 END) as incorrect_predictions,
  ROUND(
    (SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END)::numeric / 
    NULLIF(COUNT(*), 0)::numeric) * 100, 
    2
  ) as accuracy_percentage,
  SUM(points_earned) as lifetime_points,
  MAX(streak_count) as best_streak,
  MAX(points_multiplier) as highest_multiplier,
  COUNT(DISTINCT DATE(predicted_at)) as active_days
FROM market_predictions
WHERE resolved_at IS NOT NULL
GROUP BY user_wallet;

-- Recreate prediction_leaderboard without SECURITY DEFINER  
CREATE VIEW prediction_leaderboard AS
SELECT
  user_wallet,
  COUNT(*) as total_predictions,
  SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END) as correct_predictions,
  SUM(CASE WHEN was_correct = false THEN 1 ELSE 0 END) as incorrect_predictions,
  ROUND(
    (SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END)::numeric / 
    NULLIF(COUNT(*), 0)::numeric) * 100, 
    2
  ) as accuracy_percentage,
  SUM(points_earned) as total_points,
  MAX(streak_count) as best_streak,
  MAX(points_multiplier) as highest_multiplier,
  COUNT(DISTINCT DATE(predicted_at)) as active_days,
  MIN(predicted_at) as first_prediction,
  MAX(predicted_at) as last_prediction
FROM market_predictions
WHERE resolved_at IS NOT NULL
GROUP BY user_wallet
ORDER BY total_points DESC;