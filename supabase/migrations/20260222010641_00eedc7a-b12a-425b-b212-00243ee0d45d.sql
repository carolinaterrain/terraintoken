
-- Create safe public view excluding PII (email, x_handle)
CREATE OR REPLACE VIEW public.meme_submissions_public
WITH (security_invoker = on) AS
  SELECT id, image_url, caption, x_post_url, status, created_at, 
         engagement_score, placement, prize, contest_date
  FROM public.meme_submissions
  WHERE status IN ('approved', 'pending');

-- Restrict base table SELECT to own submissions or admin
CREATE POLICY "Users can view own meme submissions"
  ON public.meme_submissions FOR SELECT
  USING (
    email = get_user_email() 
    OR has_role(auth.uid(), 'admin')
  );
