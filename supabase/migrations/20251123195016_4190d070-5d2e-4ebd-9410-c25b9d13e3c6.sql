-- Create price alerts table
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own alerts"
  ON public.price_alerts
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create price alerts"
  ON public.price_alerts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own alerts"
  ON public.price_alerts
  FOR UPDATE
  USING (user_email = user_email);

CREATE POLICY "Users can delete their own alerts"
  ON public.price_alerts
  FOR DELETE
  USING (user_email = user_email);

-- Trigger for updated_at
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_price_alerts_user_email ON public.price_alerts(user_email);
CREATE INDEX idx_price_alerts_is_active ON public.price_alerts(is_active);