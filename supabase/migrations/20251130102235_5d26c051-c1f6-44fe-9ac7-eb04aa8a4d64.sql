-- Fix 2: Add updated_at column to trn_live_stats for cache freshness tracking
ALTER TABLE trn_live_stats 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_trn_live_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_trn_live_stats_timestamp ON trn_live_stats;
CREATE TRIGGER update_trn_live_stats_timestamp
BEFORE UPDATE ON trn_live_stats
FOR EACH ROW
EXECUTE FUNCTION update_trn_live_stats_updated_at();