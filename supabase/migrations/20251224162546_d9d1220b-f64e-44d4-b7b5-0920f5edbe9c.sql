-- Add Jobber reference columns to canonical tables for ecosystem integration
-- These are reference-only columns - Jobber remains the execution CRM

-- Add Jobber reference to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS jobber_client_id text;

-- Add Jobber reference to properties table  
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS jobber_property_id text;

-- Add Jobber references to work_orders table
ALTER TABLE public.work_orders 
ADD COLUMN IF NOT EXISTS jobber_job_id text,
ADD COLUMN IF NOT EXISTS jobber_quote_id text;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_jobber_client_id ON public.leads(jobber_client_id) WHERE jobber_client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_jobber_property_id ON public.properties(jobber_property_id) WHERE jobber_property_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_work_orders_jobber_job_id ON public.work_orders(jobber_job_id) WHERE jobber_job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_work_orders_jobber_quote_id ON public.work_orders(jobber_quote_id) WHERE jobber_quote_id IS NOT NULL;

-- Add comments documenting the purpose
COMMENT ON COLUMN public.leads.jobber_client_id IS 'Reference to Jobber client ID - Jobber is execution CRM only';
COMMENT ON COLUMN public.properties.jobber_property_id IS 'Reference to Jobber property ID - for sync purposes only';
COMMENT ON COLUMN public.work_orders.jobber_job_id IS 'Reference to Jobber job ID - mirrored after work order approval';
COMMENT ON COLUMN public.work_orders.jobber_quote_id IS 'Reference to Jobber quote ID - for invoice tracking';