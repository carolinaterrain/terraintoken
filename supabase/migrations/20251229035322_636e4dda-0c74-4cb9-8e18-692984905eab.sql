-- Add idempotency_key to trn_rewards for duplicate prevention
ALTER TABLE public.trn_rewards 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

-- Add index for faster idempotency lookups
CREATE INDEX IF NOT EXISTS idx_trn_rewards_idempotency_key 
ON public.trn_rewards(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Add is_test_data column to token_burns to distinguish seed data
ALTER TABLE public.token_burns 
ADD COLUMN IF NOT EXISTS is_test_data BOOLEAN DEFAULT false;

-- Mark existing seed data burns as test data
UPDATE public.token_burns 
SET is_test_data = true 
WHERE transaction_signature = 'legacy_seed_data' OR user_wallet = 'legacy_migration';

-- Add wallet_address to analytics_events for session-wallet correlation
ALTER TABLE public.analytics_events 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Add index for wallet correlation queries
CREATE INDEX IF NOT EXISTS idx_analytics_wallet_address 
ON public.analytics_events(wallet_address) WHERE wallet_address IS NOT NULL;