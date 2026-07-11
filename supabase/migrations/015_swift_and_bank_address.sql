-- Separate SWIFT/BIC and bank address from combined IBAN field usage

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS default_swift_code TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_bank_address TEXT NOT NULL DEFAULT '';

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS swift_code TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bank_address TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.profiles.default_swift_code IS 'SWIFT/BIC for international wire transfers';
COMMENT ON COLUMN public.profiles.default_bank_address IS 'Bank branch address for wire transfers';
COMMENT ON COLUMN public.invoices.swift_code IS 'SWIFT/BIC for international wire transfers';
COMMENT ON COLUMN public.invoices.bank_address IS 'Bank branch address for wire transfers';
