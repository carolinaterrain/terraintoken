-- Fix 1: Remove stale RLS policy that references auth.users
DROP POLICY IF EXISTS "Users can update their own wallet connections" ON wallet_connections;

-- Verify remaining policies are correct (should only have anon insert/update policies)
-- No changes needed if the correct policies already exist