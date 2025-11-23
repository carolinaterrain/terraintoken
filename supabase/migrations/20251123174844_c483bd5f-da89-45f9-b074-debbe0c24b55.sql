-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the holder snapshot collection to run daily at 2 AM UTC
SELECT cron.schedule(
  'collect-holder-snapshot-daily',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url:='https://dihbqhofqfcvjgpzmskx.supabase.co/functions/v1/collect-holder-snapshot',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaGJxaG9mcWZjdmpncHptc2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODY3NDgsImV4cCI6MjA3OTE2Mjc0OH0.vU770o-WF0s109JD8yCsbH1GuvsOz76vLp8S7HRHnU0"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
