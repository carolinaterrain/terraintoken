-- Create NFT achievements table
CREATE TABLE IF NOT EXISTS public.nft_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  nft_name TEXT NOT NULL,
  nft_description TEXT NOT NULL,
  nft_image_url TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common', -- common, rare, epic, legendary
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_wallet, achievement_id)
);

-- Enable RLS
ALTER TABLE public.nft_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view NFT achievements"
  ON public.nft_achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can mint their own NFT achievements"
  ON public.nft_achievements FOR INSERT
  WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_nft_achievements_user_wallet ON public.nft_achievements(user_wallet);
CREATE INDEX idx_nft_achievements_rarity ON public.nft_achievements(rarity);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.nft_achievements;

-- Create prediction leaderboard view for enhanced stats
CREATE OR REPLACE VIEW public.prediction_leaderboard AS
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