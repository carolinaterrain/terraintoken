-- Add RLS policies for storage buckets to prevent unauthorized uploads
-- Policy for meme-submissions bucket
CREATE POLICY "Authenticated users can upload memes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'meme-submissions'
);

CREATE POLICY "Public can view meme submissions"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'meme-submissions');

-- Policy for carolina-terrain-projects bucket
CREATE POLICY "Anyone can upload carolina terrain projects"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'carolina-terrain-projects'
);

CREATE POLICY "Public can view carolina terrain projects"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'carolina-terrain-projects');

-- Policy for carolina-terrain-team bucket
CREATE POLICY "Admins can upload team photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'carolina-terrain-team'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view team photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'carolina-terrain-team');

-- Add length constraints to meme_submissions table
ALTER TABLE public.meme_submissions
ADD CONSTRAINT meme_submissions_email_length CHECK (char_length(email) <= 255),
ADD CONSTRAINT meme_submissions_x_handle_length CHECK (char_length(x_handle) <= 50),
ADD CONSTRAINT meme_submissions_caption_length CHECK (char_length(caption) <= 1000),
ADD CONSTRAINT meme_submissions_x_post_url_length CHECK (char_length(x_post_url) <= 500);