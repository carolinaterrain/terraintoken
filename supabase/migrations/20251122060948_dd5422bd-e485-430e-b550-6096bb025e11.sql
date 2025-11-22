-- Fix email_preferences RLS policy to restrict to authenticated user's own email
DROP POLICY IF EXISTS "Users can update their own email preferences" ON email_preferences;
CREATE POLICY "Users can update their own email preferences" 
ON email_preferences FOR UPDATE 
USING (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Add storage RLS policies for better access control
CREATE POLICY "Authenticated users can upload to projects bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'carolina-terrain-projects');

CREATE POLICY "Authenticated users can upload to meme submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'meme-submissions');

CREATE POLICY "Admins can upload to team bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'carolina-terrain-team' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Make team bucket private (will serve via signed URLs)
UPDATE storage.buckets 
SET public = false 
WHERE name = 'carolina-terrain-team';

-- Create rate limiting table for tracking submissions
CREATE TABLE IF NOT EXISTS rate_limit_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate_limit_tracker
ALTER TABLE rate_limit_tracker ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage rate limits
CREATE POLICY "Service role can manage rate limits"
ON rate_limit_tracker FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for efficient rate limit queries
CREATE INDEX idx_rate_limit_ip_endpoint_time 
ON rate_limit_tracker(ip_address, endpoint, created_at);

-- Add function to clean up old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limit_tracker 
  WHERE created_at < now() - interval '24 hours';
END;
$$;