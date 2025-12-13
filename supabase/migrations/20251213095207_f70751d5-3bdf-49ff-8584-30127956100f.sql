-- Complete remaining RLS fixes (policies that weren't created yet)

-- Drop and recreate user_stats policy with correct definition  
DROP POLICY IF EXISTS "Users can view own stats only" ON public.user_stats;
CREATE POLICY "Users can view own stats only"
ON public.user_stats
FOR SELECT
USING (
  user_wallet_address = get_user_wallet_address() 
  OR has_role(auth.uid(), 'admin')
);

-- Drop and recreate user_achievements policy
DROP POLICY IF EXISTS "Users can view own achievements only" ON public.user_achievements;
CREATE POLICY "Users can view own achievements only"
ON public.user_achievements
FOR SELECT
USING (
  user_wallet_address = get_user_wallet_address() 
  OR has_role(auth.uid(), 'admin')
);

-- Drop and recreate trn_redemptions policy
DROP POLICY IF EXISTS "Users can view own redemptions only" ON public.trn_redemptions;
CREATE POLICY "Users can view own redemptions only"
ON public.trn_redemptions
FOR SELECT
USING (
  wallet_address = get_user_wallet_address() 
  OR has_role(auth.uid(), 'admin')
);

-- Drop and recreate user_quest_progress policy
DROP POLICY IF EXISTS "Users can view own quest progress only" ON public.user_quest_progress;
CREATE POLICY "Users can view own quest progress only"
ON public.user_quest_progress
FOR SELECT
USING (
  user_wallet_address = get_user_wallet_address() 
  OR has_role(auth.uid(), 'admin')
);

-- Drop and recreate push_subscriptions policy
DROP POLICY IF EXISTS "Users can view own push subscriptions only" ON public.push_subscriptions;
CREATE POLICY "Users can view own push subscriptions only"
ON public.push_subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Add unique constraint to governance_votes to prevent duplicate voting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'governance_votes_unique_vote'
  ) THEN
    ALTER TABLE public.governance_votes 
    ADD CONSTRAINT governance_votes_unique_vote 
    UNIQUE (voter_wallet, proposal_id);
  END IF;
END $$;

-- Fix analytics_events insert policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Validated session can insert analytics events" ON public.analytics_events;
CREATE POLICY "Validated session can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (
  session_id IS NOT NULL 
  AND length(session_id) <= 100
  AND event_name IS NOT NULL
  AND length(event_name) <= 100
);

-- Fix market_chat insert policy
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.market_chat;
DROP POLICY IF EXISTS "Authenticated users can insert chat messages" ON public.market_chat;
CREATE POLICY "Authenticated users can insert chat messages"
ON public.market_chat
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND length(message) <= 500
);

-- Create indexes for faster cleanup
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at 
ON public.analytics_events(created_at);

CREATE INDEX IF NOT EXISTS idx_rate_limit_tracker_created_at 
ON public.rate_limit_tracker(created_at);

-- Create cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM analytics_events 
  WHERE created_at < now() - interval '90 days';
  
  DELETE FROM rate_limit_tracker 
  WHERE created_at < now() - interval '7 days';
END;
$$;