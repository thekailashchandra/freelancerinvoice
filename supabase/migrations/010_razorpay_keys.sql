-- Razorpay BYOK credentials for Indian users (secret never exposed to client)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS razorpay_key_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS razorpay_key_secret TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.profiles.razorpay_key_id IS 'Razorpay Key ID from dashboard - used for client checkout';
COMMENT ON COLUMN public.profiles.razorpay_key_secret IS 'Razorpay Key Secret - server-side only, never returned to browser';
