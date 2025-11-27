-- Add admin SELECT policy to holder_snapshots (dropped accidentally)
-- Only admins and service role should have direct access
-- Public uses get_holder_stats() function for aggregate data

DROP POLICY IF EXISTS "Admins can view holder snapshots" ON public.holder_snapshots;

CREATE POLICY "Admins can view holder snapshots"
ON public.holder_snapshots
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));