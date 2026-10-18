-- 021_invoice_additional_charges.sql
-- Custom per-invoice charges such as setup fees, hosting, or travel.
-- Stored as a JSON array: [{ "id": "...", "label": "...", "amount": 0 }].
-- Safe to run more than once.

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS additional_charges JSONB;

UPDATE public.invoices
SET additional_charges = '[]'::jsonb
WHERE additional_charges IS NULL
   OR jsonb_typeof(additional_charges) <> 'array';

ALTER TABLE public.invoices
  ALTER COLUMN additional_charges SET DEFAULT '[]'::jsonb;

ALTER TABLE public.invoices
  ALTER COLUMN additional_charges SET NOT NULL;

COMMENT ON COLUMN public.invoices.additional_charges IS
  'Array of custom charges: [{ "id": "...", "label": "...", "amount": 0 }].';
