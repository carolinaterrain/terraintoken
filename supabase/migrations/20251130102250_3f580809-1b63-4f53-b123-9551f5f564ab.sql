-- Fix 3: Mark old token_burns with null user_wallet as legacy data
UPDATE token_burns 
SET metadata = jsonb_set(
  COALESCE(metadata::jsonb, '{}'::jsonb), 
  '{legacy_data}', 
  'true'::jsonb
)
WHERE user_wallet IS NULL;

-- Fix 4: Reconcile DemoWallet123456789 - create matching trn_rewards record
INSERT INTO trn_rewards (
  user_wallet_address,
  media_id,
  reward_type,
  trn_amount,
  transaction_status,
  reward_metadata,
  created_at
) VALUES (
  'DemoWallet123456789',
  NULL,
  'upload_reward',
  75,
  'completed',
  '{"legacy_reconciliation": true, "breakdown": {"base": 50, "consent": 10, "wallet": 10, "category": 5}}'::jsonb,
  '2025-11-20 09:34:29.131554+00'
);

-- Refresh trn_live_stats cache
UPDATE trn_live_stats 
SET updated_at = now()
WHERE id = (SELECT id FROM trn_live_stats ORDER BY created_at DESC LIMIT 1);