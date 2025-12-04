-- Fix search_path for functions
CREATE OR REPLACE FUNCTION public.get_drop_remaining_supply(p_drop_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER 
  FROM public.collector_nft_certificates 
  WHERE drop_id = p_drop_id 
  AND status = 'available';
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;