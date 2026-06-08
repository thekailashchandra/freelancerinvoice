-- Optional removal of "Powered by" footer after voluntary PayPal support
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hide_invoice_branding BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.hide_invoice_branding IS
  'When true, omit the platform branding footer on invoice print/PDF output';
