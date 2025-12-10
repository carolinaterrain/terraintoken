-- Fix user_stats RLS to only allow viewing own stats or aggregates
-- First check if the policy exists and drop it
DROP POLICY IF EXISTS "Anyone can view user stats" ON public.user_stats;

-- Create new restrictive policy - users can only view their own stats
CREATE POLICY "Users can view own stats only" 
ON public.user_stats 
FOR SELECT 
USING (
  user_wallet_address = get_user_wallet_address() 
  OR has_role(auth.uid(), 'admin'::app_role)
);