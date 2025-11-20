-- Seed daily quests templates
INSERT INTO daily_quests (quest_date, quest_type, description, trn_reward, target_count, active) VALUES
  (CURRENT_DATE, 'upload', 'Upload 1 terrain photo today', 20, 1, true),
  (CURRENT_DATE, 'validate', 'Validate 3 AI predictions', 30, 3, true),
  (CURRENT_DATE, 'share', 'Share 1 result on social media', 15, 1, true),
  (CURRENT_DATE, 'streak', 'Maintain your upload streak', 25, 1, true)
ON CONFLICT (quest_date, quest_type) DO NOTHING;