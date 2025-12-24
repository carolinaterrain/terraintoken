-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to trigger ecosystem health check via HTTP
CREATE OR REPLACE FUNCTION public.trigger_ecosystem_health_check()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Log that we're running the check
  INSERT INTO ecosystem_events (
    event_type,
    producer,
    source_app,
    payload
  ) VALUES (
    'system.health_check.triggered',
    'trn',
    'terraintoken',
    jsonb_build_object('triggered_at', now(), 'source', 'pg_cron')
  );
END;
$$;

-- Schedule the health check to run daily at 6 AM UTC
SELECT cron.schedule(
  'daily-ecosystem-health-check',
  '0 6 * * *',
  $$SELECT public.trigger_ecosystem_health_check()$$
);

-- Add comment documenting the cron job
COMMENT ON FUNCTION public.trigger_ecosystem_health_check() IS 'Triggered daily by pg_cron to log health check events. The actual check-ecosystem-health edge function should be called by an external scheduler or webhook.';