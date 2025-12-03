-- Update achievement_definitions to only include achievements that are actually awarded
-- The calculate-trn-reward function awards: first_drop, data_knight, week_warrior

-- First, delete all existing achievement definitions
DELETE FROM achievement_definitions;

-- Insert only the achievements that are actually awarded by the system
INSERT INTO achievement_definitions (id, name, description, icon, rarity, trn_reward, requirement_type, requirement_value) VALUES
  ('first_drop', 'First Drop', 'Complete your first terrain photo upload', '📸', 'common', 50, 'upload_count', 1),
  ('data_knight', 'Data Knight', 'Allow AI training on 5 of your uploads', '🛡️', 'rare', 100, 'data_consent_count', 5),
  ('week_warrior', 'Week Warrior', 'Maintain a 7-day upload streak', '🔥', 'epic', 200, 'streak_days', 7);