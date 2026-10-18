-- 023_dodo_payments.sql
-- Stores Dodo Payments checkout results for the in-app billing history.
-- Dodo remains the merchant of record and owns the official invoice PDF.

CREATE TABLE IF NOT EXISTS public.dodo_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'succeeded',
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  plan TEXT,
  interval TEXT,
  customer_email TEXT,
  invoice_url TEXT,
  payment_method TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dodo_payments_user_id_idx
  ON public.dodo_payments (user_id);

CREATE INDEX IF NOT EXISTS dodo_payments_paid_at_idx
  ON public.dodo_payments (paid_at DESC);

ALTER TABLE public.dodo_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own dodo payments" ON public.dodo_payments;

CREATE POLICY "Users read own dodo payments"
  ON public.dodo_payments FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.dodo_payments IS
  'Dodo Payments results used for the Cloud billing history and receipts.';

COMMENT ON COLUMN public.dodo_payments.amount IS
  'Amount charged in the currency smallest unit, for example 605 is $6.05 USD.';
