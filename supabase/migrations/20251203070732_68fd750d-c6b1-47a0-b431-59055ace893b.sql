-- Drop the expire_old_invoice_codes function
DROP FUNCTION IF EXISTS public.expire_old_invoice_codes();

-- Drop the invoice_codes table (this will also drop any associated RLS policies)
DROP TABLE IF EXISTS public.invoice_codes;