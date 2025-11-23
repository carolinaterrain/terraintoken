-- Fix SECURITY DEFINER view warnings by recreating views without SECURITY DEFINER
DROP VIEW IF EXISTS public.prediction_user_stats;
DROP VIEW IF EXISTS public.prediction_leaderboard;

-- Recreate prediction_user_stats without SECURITY DEFINER
CREATE VIEW public.prediction_user_stats AS
SELECT 
  user_wallet,
  COUNT(*) as total_predictions,
  SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END) as correct_predictions,
  SUM(CASE WHEN was_correct = false THEN 1 ELSE 0 END) as incorrect_predictions,
  ROUND(
    (SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END)::numeric / 
    NULLIF(COUNT(*)::numeric, 0) * 100), 2
  ) as accuracy_percentage,
  MAX(streak_count) as best_streak,
  SUM(COALESCE(points_earned, 0)) as lifetime_points,
  MAX(points_multiplier) as highest_multiplier,
  COUNT(DISTINCT DATE(predicted_at)) as active_days
FROM public.market_predictions
WHERE resolved_at IS NOT NULL
GROUP BY user_wallet;

-- Recreate prediction_leaderboard without SECURITY DEFINER
CREATE VIEW public.prediction_leaderboard AS
SELECT 
  user_wallet,
  COUNT(*) as total_predictions,
  SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END) as correct_predictions,
  SUM(CASE WHEN was_correct = false THEN 1 ELSE 0 END) as incorrect_predictions,
  ROUND(
    (SUM(CASE WHEN was_correct = true THEN 1 ELSE 0 END)::numeric / 
    NULLIF(COUNT(*)::numeric, 0) * 100), 2
  ) as accuracy_percentage,
  SUM(COALESCE(points_earned, 0)) as total_points,
  MAX(streak_count) as best_streak,
  MAX(points_multiplier) as highest_multiplier,
  COUNT(DISTINCT DATE(predicted_at)) as active_days,
  MIN(predicted_at) as first_prediction,
  MAX(predicted_at) as last_prediction
FROM public.market_predictions
WHERE resolved_at IS NOT NULL
GROUP BY user_wallet
ORDER BY total_points DESC, accuracy_percentage DESC;