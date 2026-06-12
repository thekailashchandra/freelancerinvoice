-- Track Razorpay orders for invoice/template payments (refunds, webhooks, mapping)
CREATE TABLE IF NOT EXISTS public.razorpay_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('invoice', 'template')),
  template_id TEXT,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  amount_paise INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
  customer_email TEXT,
  customer_name TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS razorpay_payments_user_id_idx
  ON public.razorpay_payments (user_id);

CREATE INDEX IF NOT EXISTS razorpay_payments_invoice_id_idx
  ON public.razorpay_payments (invoice_id);

CREATE INDEX IF NOT EXISTS razorpay_payments_order_id_idx
  ON public.razorpay_payments (razorpay_order_id);

ALTER TABLE public.razorpay_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own razorpay payments"
  ON public.razorpay_payments FOR SELECT
  USING (auth.uid() = user_id);
