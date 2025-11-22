-- Fix A/B test RLS policy violation (CRITICAL)
DROP POLICY IF EXISTS "Anyone can insert test assignments" ON ab_test_assignments;
CREATE POLICY "Anyone can insert test assignments" ON ab_test_assignments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own assignments" ON ab_test_assignments
  FOR UPDATE USING (session_id = session_id);

-- Referral System Tables
CREATE TABLE IF NOT EXISTS public.referral_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_code TEXT NOT NULL,
  referred_email TEXT NOT NULL,
  referred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted BOOLEAN DEFAULT false,
  conversion_value NUMERIC DEFAULT 0,
  metadata JSONB,
  UNIQUE(referrer_code, referred_email)
);

CREATE INDEX idx_referral_tracking_referrer ON referral_tracking(referrer_code);
CREATE INDEX idx_referral_tracking_converted ON referral_tracking(converted);

ALTER TABLE public.referral_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view referral stats" ON referral_tracking
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert referrals" ON referral_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update referrals" ON referral_tracking
  FOR UPDATE USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Achievement System Tables
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  trn_reward NUMERIC NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  rarity TEXT DEFAULT 'common'
);

INSERT INTO achievement_definitions (id, name, description, icon, trn_reward, requirement_type, requirement_value, rarity) VALUES
  ('first_blood', 'First Blood', 'Complete your first project upload', '🎯', 50, 'uploads', 1, 'common'),
  ('streak_master', 'Streak Master', 'Maintain a 7-day upload streak', '🔥', 200, 'streak', 7, 'rare'),
  ('social_butterfly', 'Social Butterfly', 'Share 10 posts on social media', '🦋', 100, 'shares', 10, 'common'),
  ('validator', 'The Validator', 'Have 25 projects validated', '✅', 300, 'validations', 25, 'epic'),
  ('whale', 'Terrain Whale', 'Earn 1000+ TRN tokens', '🐋', 500, 'trn_earned', 1000, 'legendary'),
  ('early_adopter', 'Early Adopter', 'Join before 1000 users', '⭐', 150, 'special', 1, 'rare'),
  ('referral_king', 'Referral King', 'Refer 10+ users', '👑', 400, 'referrals', 10, 'epic'),
  ('contest_winner', 'Contest Champion', 'Win a weekly contest', '🏆', 250, 'contest_wins', 1, 'rare');

ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view achievements" ON achievement_definitions
  FOR SELECT USING (true);

-- Heat Map Tracking
CREATE TABLE IF NOT EXISTS public.heat_map_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  x_position INTEGER,
  y_position INTEGER,
  element_id TEXT,
  element_class TEXT,
  viewport_width INTEGER,
  viewport_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_heat_map_events_page ON heat_map_events(page_url);
CREATE INDEX idx_heat_map_events_type ON heat_map_events(event_type);
CREATE INDEX idx_heat_map_events_created ON heat_map_events(created_at);

ALTER TABLE public.heat_map_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert heat map events" ON heat_map_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view heat map events" ON heat_map_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Funnel Tracking
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT true,
  time_spent_seconds INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_funnel_events_session ON funnel_events(session_id);
CREATE INDEX idx_funnel_events_step ON funnel_events(step_name);
CREATE INDEX idx_funnel_events_created ON funnel_events(created_at);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert funnel events" ON funnel_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view funnel events" ON funnel_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Social Proof Notifications
CREATE TABLE IF NOT EXISTS public.activity_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type TEXT NOT NULL,
  user_identifier TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_notifications_created ON activity_notifications(created_at DESC);

ALTER TABLE public.activity_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view recent notifications" ON activity_notifications
  FOR SELECT USING (created_at > now() - interval '24 hours');

CREATE POLICY "Service role can insert notifications" ON activity_notifications
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Push Notification Subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_push_subscriptions_session ON push_subscriptions(session_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage their push subscriptions" ON push_subscriptions
  FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for activity feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_notifications;

-- Onboarding Progress
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their onboarding" ON onboarding_progress
  FOR ALL USING (true) WITH CHECK (true);