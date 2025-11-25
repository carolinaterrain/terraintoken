-- =====================================================
-- FIX REMAINING SECURITY ISSUES
-- =====================================================

-- 1. Move pg_net extension from public to extensions schema
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Fix prediction_leaderboard and prediction_user_stats views
-- Recreate them with security_invoker=true

-- Drop existing views
DROP VIEW IF EXISTS public.prediction_leaderboard CASCADE;
DROP VIEW IF EXISTS public.prediction_user_stats CASCADE;

-- Recreate prediction_user_stats with security invoker
CREATE VIEW public.prediction_user_stats
WITH (security_invoker=true) AS
SELECT 
  user_wallet,
  COUNT(*) AS total_predictions,
  SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) AS correct_predictions,
  SUM(CASE WHEN was_correct = FALSE THEN 1 ELSE 0 END) AS incorrect_predictions,
  ROUND(
    (SUM(CASE WHEN was_correct THEN 1 ELSE 0 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100), 2
  ) AS accuracy_percentage,
  SUM(COALESCE(points_earned, 0)) AS total_points,
  MAX(COALESCE(streak_count, 0)) AS best_streak,
  MAX(COALESCE(points_multiplier, 1)) AS highest_multiplier,
  MIN(predicted_at) AS first_prediction,
  MAX(predicted_at) AS last_prediction,
  COUNT(DISTINCT DATE(predicted_at)) AS active_days
FROM public.market_predictions
WHERE resolved_at IS NOT NULL
GROUP BY user_wallet;

-- Recreate prediction_leaderboard with security invoker
CREATE VIEW public.prediction_leaderboard
WITH (security_invoker=true) AS
SELECT 
  user_wallet,
  total_predictions,
  correct_predictions,
  incorrect_predictions,
  accuracy_percentage,
  total_points,
  best_streak,
  highest_multiplier,
  first_prediction,
  last_prediction,
  active_days,
  ROW_NUMBER() OVER (ORDER BY total_points DESC, accuracy_percentage DESC) AS rank
FROM public.prediction_user_stats
ORDER BY total_points DESC, accuracy_percentage DESC;