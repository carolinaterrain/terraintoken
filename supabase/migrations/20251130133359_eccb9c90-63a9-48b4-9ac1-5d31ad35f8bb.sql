-- Add streak tracking columns to user_stats
ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;

-- Create index for efficient streak queries
CREATE INDEX IF NOT EXISTS idx_user_stats_last_upload_date ON user_stats(last_upload_date);