-- Performance Optimization Indexes for Analytics and Waitlist
-- These indexes significantly improve query performance for common operations

-- Analytics Events Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_session 
  ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created 
  ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name 
  ON analytics_events(event_name);

CREATE INDEX IF NOT EXISTS idx_analytics_events_utm 
  ON analytics_events(utm_source, utm_campaign) 
  WHERE utm_source IS NOT NULL;

-- Waitlist Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_priority 
  ON terrainscape_waitlist(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_waitlist_email 
  ON terrainscape_waitlist(email);

CREATE INDEX IF NOT EXISTS idx_waitlist_referral 
  ON terrainscape_waitlist(referral_code);

-- Partial index for pending waitlist entries
CREATE INDEX IF NOT EXISTS idx_waitlist_pending 
  ON terrainscape_waitlist(created_at DESC, priority_score DESC) 
  WHERE status = 'pending';

-- Composite index for referral tracking
CREATE INDEX IF NOT EXISTS idx_waitlist_referred_by_status 
  ON terrainscape_waitlist(referred_by, status) 
  WHERE referred_by IS NOT NULL;

-- User Stats Indexes for Leaderboard Queries
CREATE INDEX IF NOT EXISTS idx_user_stats_trn_earned 
  ON user_stats(total_trn_earned DESC);

CREATE INDEX IF NOT EXISTS idx_user_stats_reputation 
  ON user_stats(reputation_score DESC);

-- Project Media Indexes
CREATE INDEX IF NOT EXISTS idx_project_media_featured 
  ON project_media(is_featured, sort_order) 
  WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_project_media_validation 
  ON project_media(validation_status, created_at DESC);

-- Comment on indexes for documentation
COMMENT ON INDEX idx_analytics_events_session IS 'Optimize session-based analytics queries';
COMMENT ON INDEX idx_waitlist_priority IS 'Optimize priority-based waitlist position calculations';
COMMENT ON INDEX idx_waitlist_pending IS 'Optimize pending waitlist queries with both date and priority';
