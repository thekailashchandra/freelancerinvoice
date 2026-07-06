-- Account holder name on payment details; optional hide for signature text fallback
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS default_account_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hide_signature_text_fallback BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS account_name TEXT NOT NULL DEFAULT '';
