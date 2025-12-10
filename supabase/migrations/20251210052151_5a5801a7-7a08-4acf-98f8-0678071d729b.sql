-- Clean up duplicate RLS policies on price_alerts (keep only the secure ones)
DROP POLICY IF EXISTS "Delete own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Insert own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Update own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can create own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can delete own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can update own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "View own price alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can view own price alerts" ON public.price_alerts;

-- Keep only: Admins can manage all alerts, Authenticated users can create price alerts, 
-- Users can manage their own price alerts, Users can view own price alerts securely

-- Add column-level security for collector_drop_purchases shipping_address
-- Create a secure view that excludes shipping_address from public queries
CREATE OR REPLACE FUNCTION public.get_purchase_summary(p_wallet text)
RETURNS TABLE (
  id uuid,
  drop_id uuid,
  certificate_id uuid,
  order_status text,
  nft_transfer_status text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cdp.id,
    cdp.drop_id,
    cdp.certificate_id,
    cdp.order_status,
    cdp.nft_transfer_status,
    cdp.created_at
  FROM collector_drop_purchases cdp
  WHERE cdp.buyer_wallet = p_wallet;
$$;