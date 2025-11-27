
-- STEP 1: Create SECURITY DEFINER helper functions
-- These allow safe access to auth.users from RLS policies

CREATE OR REPLACE FUNCTION public.get_user_email()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.get_user_wallet_address()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (raw_user_meta_data->>'wallet_address')::text FROM auth.users WHERE id = auth.uid()
$$;
