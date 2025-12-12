-- Insert sample finalized monthly report for November 2025
-- net_ai_revenue is generated automatically from gross_ai_revenue - variable_ai_costs
INSERT INTO public.monthly_ecosystem_reports (
  report_month,
  gross_ai_revenue,
  variable_ai_costs,
  verified_analyses,
  active_users,
  determined_band_id,
  base_burn_rate,
  final_burn_rate,
  usage_bonus_applied,
  trn_burned,
  usd_for_buyback,
  burn_tx_hash,
  buyback_tx_hash,
  is_finalized,
  finalized_at,
  data_source
) VALUES (
  '2025-11-01',
  2500.00,
  750.00,
  157,
  24,
  (SELECT id FROM public.burn_bands WHERE min_revenue = 0 LIMIT 1),
  0.02,
  0.02,
  false,
  875,
  35.00,
  '4xKp9vQmN8rT3wZy7hF2JgLcB5nMdW1sY6vR9qE8uXaP3kH7jCfG2bN4mS5tL8wV',
  '2nMkL7pR4qT9wZx3vF6JgYcB8hNdW1sE5uR2qK7xPaS4kH9jCfG3bN6mS5tL1wV',
  true,
  NOW(),
  'TerrainVision (verified)'
) ON CONFLICT (report_month) DO NOTHING;