-- Create a table to cache holder count data to prevent rate limiting issues
CREATE TABLE IF NOT EXISTS public.holder_count_cache (
  id text PRIMARY KEY DEFAULT 'current',
  holder_count integer NOT NULL DEFAULT 0,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  source text DEFAULT 'helius'
);

-- Insert initial row
INSERT INTO public.holder_count_cache (id, holder_count, last_updated, source)
VALUES ('current', 0, now(), 'initial')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.holder_count_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access (holder count is public data)
CREATE POLICY "Allow public read access to holder count cache"
ON public.holder_count_cache
FOR SELECT
USING (true);

-- Allow service role to update
CREATE POLICY "Allow service role to update holder count cache"
ON public.holder_count_cache
FOR ALL
USING (true)
WITH CHECK (true);