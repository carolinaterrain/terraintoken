-- Fix security definer view by making it security invoker
DROP VIEW IF EXISTS public.ecosystem_health_kpis;

CREATE VIEW public.ecosystem_health_kpis 
WITH (security_invoker = true)
AS
SELECT
  (SELECT COUNT(*) FROM webhook_inbox WHERE processed_at IS NULL AND error_message IS NOT NULL) as webhooks_failed,
  (SELECT COUNT(*) FROM webhook_inbox WHERE claimed_at IS NOT NULL AND processed_at IS NULL) as webhooks_in_flight,
  (SELECT COUNT(*) FROM ecosystem_events WHERE created_at > now() - interval '1 hour') as events_last_hour,
  (SELECT MAX(received_at) FROM webhook_inbox) as last_webhook_received,
  (SELECT MAX(created_at) FROM ecosystem_events) as last_event_created,
  (SELECT COUNT(*) FROM monthly_ecosystem_reports WHERE is_finalized = true) as reports_finalized,
  (SELECT COUNT(*) FROM monthly_ecosystem_reports WHERE is_finalized = false) as reports_pending,
  (SELECT COALESCE(SUM(trn_burned), 0) FROM monthly_ecosystem_reports WHERE is_finalized = true) as total_trn_burned,
  (SELECT COUNT(*) FROM wallet_link_challenges WHERE verified_at IS NOT NULL) as wallets_verified,
  now() as snapshot_at;