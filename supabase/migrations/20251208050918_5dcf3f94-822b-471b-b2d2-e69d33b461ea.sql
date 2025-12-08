-- Phase 1.2: Fix RLS Security Vulnerabilities

-- 1. Fix wallet_connections - restrict to own wallet only
DROP POLICY IF EXISTS "Anyone can view wallet connections" ON wallet_connections;
DROP POLICY IF EXISTS "Anyone can update their wallet connections" ON wallet_connections;

-- Create secure policies for wallet_connections
CREATE POLICY "Users can view own wallet connections" 
ON wallet_connections FOR SELECT 
USING (wallet_address = get_user_wallet_address());

CREATE POLICY "Users can update own wallet connections" 
ON wallet_connections FOR UPDATE 
USING (wallet_address = get_user_wallet_address());

-- 2. Clean up duplicate waitlist policies  
DROP POLICY IF EXISTS "Anyone can insert waitlist entries" ON terrainscape_waitlist;
-- Keep only "Anyone can join waitlist" for INSERT which should exist