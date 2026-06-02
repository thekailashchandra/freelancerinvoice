-- Country on organization profile + extra payment columns on invoices

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country_code TEXT NOT NULL DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS default_bank_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_account_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_upi_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_routing_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_iban TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_sort_code TEXT NOT NULL DEFAULT '';

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS routing_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS iban TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sort_code TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.profiles.country_code IS 'ISO 3166-1 alpha-2 or EU/OTHER for invoice defaults';
COMMENT ON COLUMN public.invoices.routing_number IS 'ABA (US), BSB (AU), transit (CA), etc.';
COMMENT ON COLUMN public.invoices.iban IS 'IBAN for EU/UK/international';
COMMENT ON COLUMN public.invoices.sort_code IS 'UK sort code';
