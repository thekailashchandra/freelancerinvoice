-- InvoiceFlow: initial schema, RLS, storage, and auth trigger
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.invoice_status AS ENUM (
  'draft',
  'pending',
  'sent',
  'paid',
  'overdue'
);

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  signature_url TEXT,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  tax_label TEXT NOT NULL DEFAULT 'VAT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX clients_user_id_idx ON public.clients (user_id);

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  client_id UUID REFERENCES public.clients (id) ON DELETE SET NULL,
  client_name_snapshot TEXT NOT NULL DEFAULT '',
  client_email_snapshot TEXT NOT NULL DEFAULT '',
  client_phone_snapshot TEXT NOT NULL DEFAULT '',
  client_company_snapshot TEXT NOT NULL DEFAULT '',
  client_address_snapshot TEXT NOT NULL DEFAULT '',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  tax_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  tax_label TEXT NOT NULL DEFAULT 'VAT',
  status public.invoice_status NOT NULL DEFAULT 'draft',
  notes TEXT NOT NULL DEFAULT '',
  bank_name TEXT NOT NULL DEFAULT '',
  account_number TEXT NOT NULL DEFAULT '',
  upi_id TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT invoices_user_invoice_number_unique UNIQUE (user_id, invoice_number)
);

CREATE INDEX invoices_user_id_idx ON public.invoices (user_id);
CREATE INDEX invoices_status_idx ON public.invoices (status);
CREATE INDEX invoices_created_at_idx ON public.invoices (created_at DESC);

-- ---------------------------------------------------------------------------
-- invoice_items
-- ---------------------------------------------------------------------------
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices (id) ON DELETE CASCADE,
  service_name TEXT NOT NULL DEFAULT '',
  qty INT NOT NULL DEFAULT 1 CHECK (qty > 0),
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX invoice_items_invoice_id_idx ON public.invoice_items (invoice_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER invoices_set_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    NULL
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- profiles: users manage only their own row
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- clients
CREATE POLICY "clients_select_own"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "clients_insert_own"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_update_own"
  ON public.clients FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_delete_own"
  ON public.clients FOR DELETE
  USING (auth.uid() = user_id);

-- invoices
CREATE POLICY "invoices_select_own"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "invoices_insert_own"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_update_own"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_delete_own"
  ON public.invoices FOR DELETE
  USING (auth.uid() = user_id);

-- invoice_items (via parent invoice ownership)
CREATE POLICY "invoice_items_select_own"
  ON public.invoice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "invoice_items_insert_own"
  ON public.invoice_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "invoice_items_update_own"
  ON public.invoice_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id AND i.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "invoice_items_delete_own"
  ON public.invoice_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id AND i.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage: invoice-assets bucket
-- Dashboard → Storage → New bucket: invoice-assets (public)
-- Or run the policies below after creating the bucket in the UI.
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-assets', 'invoice-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "invoice_assets_select_own_folder"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'invoice-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "invoice_assets_insert_own_folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'invoice-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "invoice_assets_update_own_folder"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'invoice-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'invoice-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "invoice_assets_delete_own_folder"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'invoice-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
