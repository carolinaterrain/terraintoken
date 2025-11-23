-- Fix security definer view by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS prediction_user_stats;

CREATE VIEW prediction_user_stats AS
SELECT 
  user_wallet,
  COUNT(*) as total_predictions,
  COUNT(*) FILTER (WHERE was_correct = true) as correct_predictions,
  COUNT(*) FILTER (WHERE was_correct = false) as incorrect_predictions,
  ROUND((COUNT(*) FILTER (WHERE was_correct = true)::numeric / NULLIF(COUNT(*), 0)) * 100, 2) as accuracy_percentage,
  MAX(streak_count) as best_streak,
  SUM(points_earned) as lifetime_points,
  MAX(points_multiplier) as highest_multiplier,
  COUNT(DISTINCT DATE(predicted_at)) as active_days
FROM market_predictions
WHERE was_correct IS NOT NULL
GROUP BY user_wallet;