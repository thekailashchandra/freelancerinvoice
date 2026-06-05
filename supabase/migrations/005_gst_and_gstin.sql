-- Indian GST supply type and GSTIN fields
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS gst_supply_type TEXT NOT NULL DEFAULT 'intra',
  ADD COLUMN IF NOT EXISTS seller_gstin TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_gstin TEXT NOT NULL DEFAULT '';
