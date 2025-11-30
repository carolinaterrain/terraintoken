-- Add total_burned column to trn_live_stats table
ALTER TABLE trn_live_stats 
ADD COLUMN IF NOT EXISTS total_burned bigint DEFAULT 0;

-- Sync existing burn totals into the column
UPDATE trn_live_stats 
SET total_burned = (SELECT COALESCE(SUM(burn_amount), 0) FROM token_burns);

-- Add comment for documentation
COMMENT ON COLUMN trn_live_stats.total_burned IS 'Total TRN burned across all burn events, synced from token_burns table';