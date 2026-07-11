-- Record explicit Privacy Policy / DPDP Act consent at registration
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS privacy_policy_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT;

COMMENT ON COLUMN public.profiles.privacy_policy_accepted_at IS
  'Timestamp when the user accepted the Privacy Policy (incl. India DPDP Act notice).';
COMMENT ON COLUMN public.profiles.privacy_policy_version IS
  'Privacy policy version string accepted at signup.';
