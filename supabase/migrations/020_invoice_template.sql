-- 020_invoice_template.sql
-- Persists the selected invoice template so saved invoices reopen with the
-- same layout. Safe to run more than once.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS template_id TEXT;

UPDATE public.invoices
SET template_id = 'classic'
WHERE template_id IS NULL
   OR btrim(template_id) = '';

ALTER TABLE public.invoices
  ALTER COLUMN template_id SET DEFAULT 'classic';

ALTER TABLE public.invoices
  ALTER COLUMN template_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS invoices_template_id_idx
  ON public.invoices (template_id);

COMMENT ON COLUMN public.invoices.template_id IS
  'Invoice layout id: classic, modern, minimal, bold, corporate, studio, geometric, or swiss.';
