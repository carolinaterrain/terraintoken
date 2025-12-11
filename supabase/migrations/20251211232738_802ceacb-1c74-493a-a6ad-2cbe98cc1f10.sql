-- Add trace_id column to analytics_events for end-to-end request tracing
ALTER TABLE public.analytics_events 
ADD COLUMN IF NOT EXISTS trace_id text;