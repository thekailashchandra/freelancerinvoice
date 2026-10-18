-- 018_cloud_subscription.sql
-- Hosted Cloud plan: ₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere.
-- Self-hosted installs bypass billing entirely (NEXT_PUBLIC_SELF_HOSTED=true).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'none'
    CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled')),
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
  ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_last_payment_id TEXT;

CREATE INDEX IF NOT EXISTS profiles_subscription_expires_at_idx
  ON public.profiles (subscription_expires_at);

-- Allow subscription orders in the shared Razorpay ledger.
ALTER TABLE public.razorpay_payments
  DROP CONSTRAINT IF EXISTS razorpay_payments_purpose_check;

ALTER TABLE public.razorpay_payments
  ADD CONSTRAINT razorpay_payments_purpose_check
  CHECK (purpose IN ('invoice', 'template', 'subscription'));

COMMENT ON COLUMN public.profiles.subscription_status IS
  'Cloud plan state: none | active | past_due | canceled. Self-hosted builds ignore this column.';
COMMENT ON COLUMN public.profiles.subscription_expires_at IS
  'End of paid access. One monthly payment grants 30 days from the later of now or the current expiry.';
