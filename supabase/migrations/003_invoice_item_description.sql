-- Add optional description for each invoice line item.
ALTER TABLE public.invoice_items
ADD COLUMN IF NOT EXISTS service_description TEXT NOT NULL DEFAULT '';
