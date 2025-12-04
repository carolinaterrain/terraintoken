-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Anyone can reserve available certificates" ON public.collector_nft_certificates;
DROP POLICY IF EXISTS "Public can view certificates" ON public.collector_nft_certificates;

-- Create permissive SELECT policy for public viewing
CREATE POLICY "Public can view certificates"
  ON public.collector_nft_certificates
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create permissive UPDATE policy for reservations
CREATE POLICY "Anyone can reserve available certificates"
  ON public.collector_nft_certificates
  FOR UPDATE
  TO anon, authenticated
  USING (
    (status = 'available') 
    OR (status = 'reserved' AND reserved_at < now() - interval '15 minutes')
  )
  WITH CHECK (
    status IN ('available', 'reserved', 'claimed')
  );