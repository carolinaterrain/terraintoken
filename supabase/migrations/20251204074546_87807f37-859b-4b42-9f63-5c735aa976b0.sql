-- Create collector_drops table for drop metadata
CREATE TABLE public.collector_drops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  description TEXT NOT NULL,
  total_supply INTEGER NOT NULL,
  price_usd NUMERIC NOT NULL,
  shopify_product_id TEXT,
  nft_image_url TEXT,
  treasury_wallet TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collector_nft_certificates table for pre-minted NFTs
CREATE TABLE public.collector_nft_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drop_id UUID NOT NULL REFERENCES public.collector_drops(id),
  serial_number INTEGER NOT NULL,
  mint_address TEXT,
  metadata_uri TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  reserved_at TIMESTAMP WITH TIME ZONE,
  reserved_by_session TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by_wallet TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(drop_id, serial_number)
);

-- Create collector_drop_purchases table to link purchases
CREATE TABLE public.collector_drop_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drop_id UUID NOT NULL REFERENCES public.collector_drops(id),
  certificate_id UUID NOT NULL REFERENCES public.collector_nft_certificates(id),
  buyer_wallet TEXT NOT NULL,
  buyer_email TEXT,
  shopify_order_id TEXT,
  order_status TEXT NOT NULL DEFAULT 'pending',
  nft_transfer_status TEXT NOT NULL DEFAULT 'pending',
  nft_transfer_signature TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collector_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collector_nft_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collector_drop_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collector_drops
CREATE POLICY "Public can view active drops"
ON public.collector_drops FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage drops"
ON public.collector_drops FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for collector_nft_certificates
CREATE POLICY "Public can view certificates"
ON public.collector_nft_certificates FOR SELECT
USING (true);

CREATE POLICY "Service role can manage certificates"
ON public.collector_nft_certificates FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Anyone can reserve available certificates"
ON public.collector_nft_certificates FOR UPDATE
USING (status = 'available' OR (status = 'reserved' AND reserved_at < now() - interval '15 minutes'));

-- RLS Policies for collector_drop_purchases
CREATE POLICY "Users can view their own purchases"
ON public.collector_drop_purchases FOR SELECT
USING (buyer_wallet = get_user_wallet_address());

CREATE POLICY "Anyone can create purchases"
ON public.collector_drop_purchases FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all purchases"
ON public.collector_drop_purchases FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage purchases"
ON public.collector_drop_purchases FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create function to get remaining supply
CREATE OR REPLACE FUNCTION public.get_drop_remaining_supply(p_drop_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER 
  FROM public.collector_nft_certificates 
  WHERE drop_id = p_drop_id 
  AND status = 'available';
$$ LANGUAGE sql SECURITY DEFINER;

-- Create function to reserve next available certificate
CREATE OR REPLACE FUNCTION public.reserve_next_certificate(p_drop_id UUID, p_session_id TEXT)
RETURNS TABLE(certificate_id UUID, serial_number INTEGER) AS $$
DECLARE
  v_cert_id UUID;
  v_serial INTEGER;
BEGIN
  -- Clear expired reservations first
  UPDATE public.collector_nft_certificates
  SET status = 'available', reserved_at = NULL, reserved_by_session = NULL
  WHERE drop_id = p_drop_id 
  AND status = 'reserved' 
  AND reserved_at < now() - interval '15 minutes';
  
  -- Get and reserve the next available certificate
  UPDATE public.collector_nft_certificates
  SET status = 'reserved', reserved_at = now(), reserved_by_session = p_session_id
  WHERE id = (
    SELECT id FROM public.collector_nft_certificates
    WHERE drop_id = p_drop_id AND status = 'available'
    ORDER BY serial_number ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING id, collector_nft_certificates.serial_number INTO v_cert_id, v_serial;
  
  RETURN QUERY SELECT v_cert_id, v_serial;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert Drop #0 with 50 pre-minted certificate slots
INSERT INTO public.collector_drops (name, symbol, description, total_supply, price_usd, nft_image_url, status)
VALUES (
  'TRN Collector Edition #0',
  'TRNCE0',
  'Official Terrain Token Community Edition Drop #0. Each physical merch item includes a unique on-chain authenticity certificate.',
  50,
  49.99,
  '/branding/trn-logo-full.png',
  'active'
);

-- Pre-populate 50 certificate slots
INSERT INTO public.collector_nft_certificates (drop_id, serial_number, status)
SELECT 
  (SELECT id FROM public.collector_drops WHERE symbol = 'TRNCE0' LIMIT 1),
  generate_series(1, 50),
  'available';