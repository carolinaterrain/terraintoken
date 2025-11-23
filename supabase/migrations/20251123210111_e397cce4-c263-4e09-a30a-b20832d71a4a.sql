-- Add streak tracking and wisdom score to market_predictions
ALTER TABLE market_predictions 
ADD COLUMN IF NOT EXISTS points_multiplier numeric DEFAULT 1,
ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 0;

-- Create prediction challenges table
CREATE TABLE IF NOT EXISTS prediction_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  requirement_type text NOT NULL, -- 'streak', 'accuracy', 'volume', 'special'
  requirement_value integer NOT NULL,
  badge_icon text NOT NULL,
  trn_reward numeric DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user challenge progress table
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet text NOT NULL,
  challenge_id text NOT NULL REFERENCES prediction_challenges(challenge_id),
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  claimed boolean DEFAULT false,
  claimed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_wallet, challenge_id)
);

-- Create prediction tournaments table
CREATE TABLE IF NOT EXISTS prediction_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  prize_pool jsonb NOT NULL, -- {1: 100000, 2: 50000, 3: 50000, ...}
  status text DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed'
  created_at timestamp with time zone DEFAULT now()
);

-- Create tournament entries table
CREATE TABLE IF NOT EXISTS tournament_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES prediction_tournaments(id),
  user_wallet text NOT NULL,
  total_predictions integer DEFAULT 0,
  correct_predictions integer DEFAULT 0,
  accuracy_rate numeric DEFAULT 0,
  total_points integer DEFAULT 0,
  final_rank integer,
  prize_won numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(tournament_id, user_wallet)
);

-- Create prediction insights view
CREATE OR REPLACE VIEW prediction_user_stats AS
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

-- Enable RLS
ALTER TABLE prediction_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view challenges"
  ON prediction_challenges FOR SELECT
  USING (active = true);

CREATE POLICY "Users can view their own progress"
  ON user_challenge_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own progress"
  ON user_challenge_progress FOR ALL
  USING (user_wallet = user_wallet)
  WITH CHECK (user_wallet = user_wallet);

CREATE POLICY "Anyone can view tournaments"
  ON prediction_tournaments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view tournament entries"
  ON tournament_entries FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their tournament entries"
  ON tournament_entries FOR ALL
  USING (user_wallet = user_wallet)
  WITH CHECK (user_wallet = user_wallet);

-- Insert initial challenges
INSERT INTO prediction_challenges (challenge_id, name, description, requirement_type, requirement_value, badge_icon, trn_reward) VALUES
  ('first_prediction', 'Crystal Ball Novice', 'Make your first price prediction', 'volume', 1, '🔮', 1000),
  ('hot_streak_5', 'Hot Streak', 'Get 5 predictions correct in a row', 'streak', 5, '🔥', 5000),
  ('hot_streak_10', 'Unstoppable', 'Get 10 predictions correct in a row', 'streak', 10, '⚡', 25000),
  ('accuracy_master', 'Market Sage', 'Achieve 90% accuracy over 30 predictions', 'accuracy', 90, '🧙', 50000),
  ('contrarian_king', 'Contrarian King', 'Be correct when 80%+ of community was wrong', 'special', 1, '👑', 10000),
  ('volume_trader', 'Prediction Addict', 'Make 100 predictions', 'volume', 100, '📊', 20000)
ON CONFLICT (challenge_id) DO NOTHING;

-- Create current monthly tournament
INSERT INTO prediction_tournaments (name, description, start_date, end_date, prize_pool, status) VALUES
  (
    'November 2025 Prediction Championship',
    'Compete for 500,000 TRN in prizes! Top 10 most accurate predictors win.',
    '2025-11-01 00:00:00+00',
    '2025-11-30 23:59:59+00',
    '{"1": 100000, "2": 50000, "3": 50000, "4": 10000, "5": 10000, "6": 10000, "7": 10000, "8": 10000, "9": 10000, "10": 10000}'::jsonb,
    'active'
  )
ON CONFLICT DO NOTHING;

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE user_challenge_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE tournament_entries;