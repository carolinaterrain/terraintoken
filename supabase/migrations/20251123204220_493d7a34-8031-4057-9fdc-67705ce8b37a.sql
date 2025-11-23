-- Fix function search path with CASCADE
DROP FUNCTION IF EXISTS update_leaderboard_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_leaderboard_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_leaderboard_timestamp
BEFORE UPDATE ON public.purchase_leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard_updated_at();