-- Create product_images table for storing AI-generated and Shopify images
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT NOT NULL, -- 'shirt-front', 'shirt-model', 'hat-front', 'hat-model', 'flat-lay', 'bundle', 'certificate'
  image_source TEXT NOT NULL DEFAULT 'ai_generated', -- 'ai_generated', 'shopify', 'manual'
  storage_path TEXT,
  public_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public can view active images
CREATE POLICY "Public can view active product images"
ON public.product_images
FOR SELECT
USING (is_active = true);

-- Service role can manage all images
CREATE POLICY "Service role can manage product images"
ON public.product_images
FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

-- Admins can manage images
CREATE POLICY "Admins can manage product images"
ON public.product_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_product_images_type ON public.product_images(product_type);
CREATE INDEX idx_product_images_active ON public.product_images(is_active) WHERE is_active = true;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images bucket
CREATE POLICY "Anyone can view product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Service role can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Service role can update product images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Service role can delete product images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images');