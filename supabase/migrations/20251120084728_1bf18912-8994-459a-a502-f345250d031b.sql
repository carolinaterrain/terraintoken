-- Extend existing project_media table with TRN reward tracking
ALTER TABLE project_media 
  ADD COLUMN IF NOT EXISTS user_wallet_address TEXT,
  ADD COLUMN IF NOT EXISTS data_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_validation_score INTEGER,
  ADD COLUMN IF NOT EXISTS trn_earned DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS shared_on_social BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS goblin_grade TEXT;

-- Add index for wallet lookups
CREATE INDEX IF NOT EXISTS idx_project_media_wallet ON project_media(user_wallet_address);

-- Create TRN Rewards Ledger
CREATE TABLE IF NOT EXISTS trn_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet_address TEXT NOT NULL,
  media_id UUID REFERENCES project_media(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  trn_amount DECIMAL(10, 2) NOT NULL,
  transaction_status TEXT DEFAULT 'pending',
  reward_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  claimed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trn_rewards_wallet ON trn_rewards(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_trn_rewards_status ON trn_rewards(transaction_status);

-- Create User Achievement Tracking
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet_address TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  trn_bonus DECIMAL(10, 2) NOT NULL,
  UNIQUE(user_wallet_address, achievement_id)
);

-- Create User Statistics
CREATE TABLE IF NOT EXISTS user_stats (
  user_wallet_address TEXT PRIMARY KEY,
  total_uploads INTEGER DEFAULT 0,
  total_validations INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  total_trn_earned DECIMAL(10, 2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_upload_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Weekly Contests
CREATE TABLE IF NOT EXISTS contest_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES project_media(id),
  user_wallet_address TEXT NOT NULL,
  contest_week TEXT NOT NULL,
  contest_category TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  goblin_endorsed BOOLEAN DEFAULT false,
  prize_won DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Daily Quests
CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_date DATE NOT NULL,
  quest_type TEXT NOT NULL,
  description TEXT NOT NULL,
  trn_reward DECIMAL(10, 2) NOT NULL,
  target_count INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  UNIQUE(quest_date, quest_type)
);

CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet_address TEXT NOT NULL,
  quest_id UUID REFERENCES daily_quests(id),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_wallet_address, quest_id)
);

-- Create All-Time Leaderboard View
CREATE OR REPLACE VIEW terrain_contributors_leaderboard AS
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

-- Create Weekly Leaderboard View
CREATE OR REPLACE VIEW weekly_contributors AS
SELECT 
  tr.user_wallet_address,
  COUNT(DISTINCT tr.media_id) as weekly_uploads,
  SUM(tr.trn_amount) as weekly_trn_earned,
  RANK() OVER (ORDER BY SUM(tr.trn_amount) DESC) as weekly_rank
FROM trn_rewards tr
WHERE tr.created_at >= date_trunc('week', CURRENT_DATE)
GROUP BY tr.user_wallet_address
ORDER BY weekly_trn_earned DESC;

-- Enable RLS on new tables
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE trn_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for leaderboards
CREATE POLICY "Public can view user stats" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Public can view achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Public can view rewards" ON trn_rewards FOR SELECT USING (true);
CREATE POLICY "Public can view contest entries" ON contest_entries FOR SELECT USING (true);
CREATE POLICY "Public can view daily quests" ON daily_quests FOR SELECT USING (true);
CREATE POLICY "Public can view quest progress" ON user_quest_progress FOR SELECT USING (true);

-- Service role policies for management
CREATE POLICY "Service role can manage user stats" ON user_stats FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage achievements" ON user_achievements FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage rewards" ON trn_rewards FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage contests" ON contest_entries FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage quests" ON daily_quests FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage quest progress" ON user_quest_progress FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');