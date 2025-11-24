
-- Secure wallet_connections table with proper ownership restrictions
-- Drop overly permissive update policy
DROP POLICY IF EXISTS "Anyone can update wallet connections" ON wallet_connections;

-- Create restricted policy: users can only update their own wallet connections
CREATE POLICY "Users can update their own wallet connections"
ON wallet_connections FOR UPDATE
USING (
  wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  wallet_address = (
    SELECT raw_user_meta_data->>'wallet_address' 
    FROM auth.users 
    WHERE id = auth.uid()
  )
);

-- Add comment explaining the security model
COMMENT ON POLICY "Users can update their own wallet connections" ON wallet_connections IS 
'Restricts wallet connection updates to the authenticated user who owns that wallet address. Prevents cross-user data modification.';
