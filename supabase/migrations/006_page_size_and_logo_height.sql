-- Page size per invoice + default logo height on profile
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS page_size TEXT NOT NULL DEFAULT 'a4';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS logo_height INTEGER NOT NULL DEFAULT 80;
