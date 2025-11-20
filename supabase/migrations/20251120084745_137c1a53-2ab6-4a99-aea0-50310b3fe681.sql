-- Drop and recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS terrain_contributors_leaderboard;
DROP VIEW IF EXISTS weekly_contributors;

-- Recreate All-Time Leaderboard View (without SECURITY DEFINER)
CREATE VIEW terrain_contributors_leaderboard 
WITH (security_invoker=true) AS
SELECT 
  us.user_wallet_address,
  us.total_uploads,
  us.total_validations,
  us.total_trn_earned,
  us.reputation_score,
  us.streak_days,
  COUNT(DISTINCT ua.achievement_id) as badges_earned,
  RANK() OVER (ORDER BY us.total_trn_earned DESC) as rank
FROM user_stats us
LEFT JOIN user_achievements ua ON us.user_wallet_address = ua.user_wallet_address
GROUP BY us.user_wallet_address, us.total_uploads, us.total_validations, 
         us.total_trn_earned, us.reputation_score, us.streak_days
ORDER BY us.total_trn_earned DESC;

-- Recreate Weekly Leaderboard View (without SECURITY DEFINER)
CREATE VIEW weekly_contributors
WITH (security_invoker=true) AS
SELECT 
  tr.user_wallet_address,
  COUNT(DISTINCT tr.media_id) as weekly_uploads,
  SUM(tr.trn_amount) as weekly_trn_earned,
  RANK() OVER (ORDER BY SUM(tr.trn_amount) DESC) as weekly_rank
FROM trn_rewards tr
WHERE tr.created_at >= date_trunc('week', CURRENT_DATE)
GROUP BY tr.user_wallet_address
ORDER BY weekly_trn_earned DESC;