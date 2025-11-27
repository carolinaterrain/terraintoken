-- Remove remaining overly permissive public SELECT policies

-- holder_snapshots
DROP POLICY IF EXISTS "Public can view holder snapshots" ON public.holder_snapshots;

-- project_media  
DROP POLICY IF EXISTS "Public can view all project media" ON public.project_media;

-- trn_rewards
DROP POLICY IF EXISTS "Public can view rewards" ON public.trn_rewards;

-- user_stats
DROP POLICY IF EXISTS "Public can view user stats" ON public.user_stats;