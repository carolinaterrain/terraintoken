-- Create storage buckets for Carolina Terrain projects
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('carolina-terrain-projects', 'carolina-terrain-projects', true),
  ('carolina-terrain-team', 'carolina-terrain-team', true);

-- Create storage policies for project images
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'carolina-terrain-projects');

CREATE POLICY "Anyone can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'carolina-terrain-projects');

CREATE POLICY "Public can view team images"
ON storage.objects FOR SELECT
USING (bucket_id = 'carolina-terrain-team');

CREATE POLICY "Anyone can upload team images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'carolina-terrain-team');

-- Project Media Table
CREATE TABLE public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  image_url TEXT NOT NULL,
  title TEXT,
  category TEXT NOT NULL CHECK (category IN ('drainage', 'hardscape', 'erosion', 'before-after', 'team', 'outdoor-living')),
  location TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Google Reviews / Testimonials Table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  location TEXT,
  review_date DATE,
  google_review_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_media (public read)
CREATE POLICY "Public can view all project media"
ON public.project_media FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert project media"
ON public.project_media FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update project media"
ON public.project_media FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project media"
ON public.project_media FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for testimonials (public read)
CREATE POLICY "Public can view all testimonials"
ON public.testimonials FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better query performance
CREATE INDEX idx_project_media_category ON public.project_media(category);
CREATE INDEX idx_project_media_featured ON public.project_media(is_featured);
CREATE INDEX idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX idx_testimonials_rating ON public.testimonials(rating);