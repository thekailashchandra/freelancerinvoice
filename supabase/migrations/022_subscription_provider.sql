-- 022_subscription_provider.sql
-- Tracks which payment provider owns the Cloud access pass.
-- Razorpay is used for India. Dodo Payments is used for USD passes.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_provider TEXT;

COMMENT ON COLUMN public.profiles.subscription_provider IS
  'Payment provider for the active Cloud pass: razorpay or dodo.';
