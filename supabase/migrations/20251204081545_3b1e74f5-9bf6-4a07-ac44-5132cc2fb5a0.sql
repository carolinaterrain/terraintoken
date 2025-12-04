-- Update collector_drops price from 49.99 to 100
UPDATE public.collector_drops 
SET price_usd = 100, updated_at = now() 
WHERE symbol = 'TRNCE0';

-- Create supporter_nfts table for digital NFT purchases
CREATE TABLE public.supporter_nfts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_wallet TEXT NOT NULL,
  buyer_email TEXT,
  mint_address TEXT,
  metadata_uri TEXT,
  shopify_order_id TEXT,
  shopify_variant_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.supporter_nfts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create supporter NFT purchases"
ON public.supporter_nfts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own supporter NFTs"
ON public.supporter_nfts
FOR SELECT
USING (buyer_wallet = get_user_wallet_address());

CREATE POLICY "Service role can manage supporter NFTs"
ON public.supporter_nfts
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Admins can view all supporter NFTs"
ON public.supporter_nfts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add item_type column to collector_nft_certificates for tracking which item was purchased
ALTER TABLE public.collector_nft_certificates 
ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'shirt';

-- Add item_type column to collector_drop_purchases
ALTER TABLE public.collector_drop_purchases 
ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'shirt';