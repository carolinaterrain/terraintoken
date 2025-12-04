-- Database Cleanup: Archive unused tables
-- These tables have 0 rows and no active UI implementation

-- Add archive comments to unused tables
COMMENT ON TABLE public.staking_positions IS 'ARCHIVED: No staking UI implemented - 0 rows';
COMMENT ON TABLE public.terrainscape_waitlist IS 'ARCHIVED: No waitlist form implemented - 0 rows';
COMMENT ON TABLE public.season_passes IS 'ARCHIVED: Unused gamification feature - 0 rows';
COMMENT ON TABLE public.season_pass_holders IS 'ARCHIVED: Unused gamification feature - 0 rows';
COMMENT ON TABLE public.mystery_box_opens IS 'ARCHIVED: No mystery box UI - 0 rows';
COMMENT ON TABLE public.subscription_payments IS 'ARCHIVED: No subscription UI - 0 rows';
COMMENT ON TABLE public.tournament_entries IS 'ARCHIVED: Related to removed prediction games';

-- Clean up prediction game remnants (already archived)
COMMENT ON TABLE public.market_predictions IS 'ARCHIVED: Prediction games removed for regulatory compliance';
COMMENT ON TABLE public.prediction_stakes IS 'ARCHIVED: Prediction games removed for regulatory compliance';
COMMENT ON TABLE public.prediction_challenges IS 'ARCHIVED: Prediction games removed for regulatory compliance';
COMMENT ON TABLE public.prediction_tournaments IS 'ARCHIVED: Prediction games removed for regulatory compliance';