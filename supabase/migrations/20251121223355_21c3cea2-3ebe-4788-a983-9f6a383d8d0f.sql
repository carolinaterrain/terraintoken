-- Fix security issue: Remove SECURITY DEFINER from trigger function
-- The function only updates timestamp, doesn't need elevated privileges
CREATE OR REPLACE FUNCTION public.update_terrainscape_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop and recreate view without security definer issues
DROP VIEW IF EXISTS public.terrainscape_waitlist_referrals;

-- Don't create view since it can be queried directly when needed by admins