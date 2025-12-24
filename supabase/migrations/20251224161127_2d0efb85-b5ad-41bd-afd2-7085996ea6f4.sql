
-- TERRAIN ECOSYSTEM: Canonical Lifecycle Tables (v1)
-- Shared foundation for TerrainVision, StormwaterSCM, TerrainGuard, TerrainToken

-- 1. Leads table (source of all customer journeys)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- 'wix', 'terrainvision', 'stormwaterscm', 'referral'
  source_id TEXT, -- external reference ID
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, closed
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Properties table (canonical "where" for all work)
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'NC',
  zip TEXT,
  lat NUMERIC,
  lng NUMERIC,
  property_type TEXT, -- residential, commercial, hoa, municipal
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Work Orders table (scopes tied to properties)
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  source_type TEXT, -- 'ai_analysis', 'inspection', 'manual'
  source_id UUID, -- FK to analysis or inspection record
  title TEXT,
  scope TEXT,
  status TEXT DEFAULT 'draft', -- draft, quoted, approved, scheduled, in_progress, completed, cancelled
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  scheduled_date DATE,
  completed_date DATE,
  assigned_to TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Documents table (photos, reports, as-builts)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  doc_type TEXT NOT NULL, -- 'photo', 'ai_report', 'inspection_report', 'as_built', 'permit', 'invoice', 'other'
  title TEXT,
  description TEXT,
  storage_path TEXT NOT NULL,
  storage_bucket TEXT DEFAULT 'documents',
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT, -- email or wallet
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Compliance Schedules table (reminders and tracking)
CREATE TABLE public.compliance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  schedule_type TEXT NOT NULL, -- 'inspection', 'maintenance', 'permit_renewal', 'cleaning'
  title TEXT,
  frequency_months INTEGER DEFAULT 12,
  next_due_date DATE NOT NULL,
  last_completed_date DATE,
  status TEXT DEFAULT 'pending', -- pending, scheduled, overdue, completed
  reminder_sent_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Add property_id to ecosystem_events for lifecycle linking
ALTER TABLE public.ecosystem_events 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL;

-- INDEXES for performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_properties_lead_id ON public.properties(lead_id);
CREATE INDEX idx_properties_address ON public.properties(address);
CREATE INDEX idx_work_orders_property_id ON public.work_orders(property_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_documents_property_id ON public.documents(property_id);
CREATE INDEX idx_documents_work_order_id ON public.documents(work_order_id);
CREATE INDEX idx_compliance_schedules_property_id ON public.compliance_schedules(property_id);
CREATE INDEX idx_compliance_schedules_next_due ON public.compliance_schedules(next_due_date);
CREATE INDEX idx_compliance_schedules_status ON public.compliance_schedules(status);
CREATE INDEX idx_ecosystem_events_property_id ON public.ecosystem_events(property_id);

-- ENABLE RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_schedules ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: Service role has full access (edge functions)
CREATE POLICY "Service role full access to leads"
  ON public.leads FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service role full access to properties"
  ON public.properties FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service role full access to work_orders"
  ON public.work_orders FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service role full access to documents"
  ON public.documents FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service role full access to compliance_schedules"
  ON public.compliance_schedules FOR ALL
  USING ((auth.jwt() ->> 'role') = 'service_role');

-- RLS: Admins can view all records
CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all properties"
  ON public.properties FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all work_orders"
  ON public.work_orders FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all compliance_schedules"
  ON public.compliance_schedules FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS: Public read for properties (for ecosystem apps to query)
CREATE POLICY "Public can view properties"
  ON public.properties FOR SELECT
  USING (true);

-- RLS: Public read for documents (photos/reports are shareable)
CREATE POLICY "Public can view documents"
  ON public.documents FOR SELECT
  USING (true);

-- TRIGGERS for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_schedules_updated_at
  BEFORE UPDATE ON public.compliance_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Public read access to documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Service role can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND (auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
