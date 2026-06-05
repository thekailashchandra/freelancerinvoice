-- Optional invoice metadata (payment terms, PO, project, T&C)
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS payment_terms TEXT NOT NULL DEFAULT 'Due on receipt',
  ADD COLUMN IF NOT EXISTS purchase_order TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS project_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT NOT NULL DEFAULT '';
