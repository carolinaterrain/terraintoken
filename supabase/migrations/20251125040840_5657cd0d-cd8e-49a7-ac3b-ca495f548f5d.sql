-- Add transaction_signature column to whale_alerts table for deduplication
ALTER TABLE whale_alerts 
ADD COLUMN IF NOT EXISTS transaction_signature TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_whale_alerts_signature 
ON whale_alerts(transaction_signature);

-- Add index for created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_whale_alerts_created_at 
ON whale_alerts(created_at DESC);
