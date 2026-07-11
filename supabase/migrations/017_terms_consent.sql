-- Record explicit Terms of Service acceptance (paired with privacy consent)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_version TEXT;

COMMENT ON COLUMN public.profiles.terms_accepted_at IS
  'Timestamp when the user accepted the Terms of Service.';
COMMENT ON COLUMN public.profiles.terms_version IS
  'Terms of Service version string accepted by the user.';
