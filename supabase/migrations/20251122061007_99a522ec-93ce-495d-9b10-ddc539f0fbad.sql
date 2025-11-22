-- Fix search_path security warning for cleanup_rate_limits function
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM rate_limit_tracker 
  WHERE created_at < now() - interval '24 hours';
END;
$$;