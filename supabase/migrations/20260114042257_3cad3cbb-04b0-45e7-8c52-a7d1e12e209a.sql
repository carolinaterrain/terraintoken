-- Create table for artist drop submissions
CREATE TABLE public.artist_drop_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_name TEXT NOT NULL,
  artist_email TEXT NOT NULL,
  artist_wallet TEXT,
  title TEXT NOT NULL,
  description TEXT,
  design_concept TEXT NOT NULL,
  portfolio_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  product_types TEXT[] NOT NULL DEFAULT '{"shirt"}',
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'live')),
  admin_notes TEXT,
  shopify_product_id TEXT,
  total_sales INTEGER DEFAULT 0,
  total_trn_earned NUMERIC(18,6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT
);

-- Enable RLS
ALTER TABLE public.artist_drop_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit (insert)
CREATE POLICY "Anyone can submit art" 
ON public.artist_drop_submissions 
FOR INSERT 
WITH CHECK (true);

-- Policy: Artists can view their own submissions by email
CREATE POLICY "Artists can view their submissions" 
ON public.artist_drop_submissions 
FOR SELECT 
USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_artist_drop_submissions_updated_at
BEFORE UPDATE ON public.artist_drop_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for status filtering
CREATE INDEX idx_artist_submissions_status ON public.artist_drop_submissions(status);
CREATE INDEX idx_artist_submissions_email ON public.artist_drop_submissions(artist_email);