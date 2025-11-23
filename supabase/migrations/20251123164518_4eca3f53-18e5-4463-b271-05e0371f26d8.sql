-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create TRN redemptions table for tracking service discount redemptions
CREATE TABLE public.trn_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  trn_amount BIGINT NOT NULL,
  discount_usd DECIMAL(10,2) NOT NULL,
  service_type TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'phone')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.trn_redemptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own redemptions
CREATE POLICY "Users can view their own redemptions"
ON public.trn_redemptions
FOR SELECT
USING (true);

-- Policy: Anyone can create redemption requests
CREATE POLICY "Anyone can create redemption requests"
ON public.trn_redemptions
FOR INSERT
WITH CHECK (true);

-- Create invoice codes table for rewarding customers with TRN
CREATE TABLE public.invoice_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  invoice_number TEXT NOT NULL,
  trn_reward BIGINT NOT NULL DEFAULT 10000,
  customer_email TEXT,
  customer_name TEXT,
  invoice_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  redeemed_at TIMESTAMPTZ,
  redeemed_by_wallet TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days')
);

-- Enable RLS
ALTER TABLE public.invoice_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active codes (for redemption checking)
CREATE POLICY "Anyone can view codes"
ON public.invoice_codes
FOR SELECT
USING (true);

-- Policy: Anyone can redeem codes (update redeemed status)
CREATE POLICY "Anyone can redeem codes"
ON public.invoice_codes
FOR UPDATE
USING (status = 'active' AND expires_at > now());

-- Create indexes for performance
CREATE INDEX idx_trn_redemptions_wallet ON public.trn_redemptions(wallet_address);
CREATE INDEX idx_trn_redemptions_status ON public.trn_redemptions(status);
CREATE INDEX idx_trn_redemptions_created ON public.trn_redemptions(created_at DESC);
CREATE INDEX idx_invoice_codes_code ON public.invoice_codes(code);
CREATE INDEX idx_invoice_codes_status ON public.invoice_codes(status);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trn_redemptions_updated_at
BEFORE UPDATE ON public.trn_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-expire old invoice codes
CREATE OR REPLACE FUNCTION expire_old_invoice_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE invoice_codes
  SET status = 'expired'
  WHERE status = 'active' 
  AND expires_at < now();
END;
$$;