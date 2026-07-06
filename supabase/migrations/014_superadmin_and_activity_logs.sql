-- Platform activity logs (insert via service role only; no user RLS policies)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx
  ON public.activity_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS activity_logs_action_idx
  ON public.activity_logs (action);

CREATE INDEX IF NOT EXISTS activity_logs_actor_id_idx
  ON public.activity_logs (actor_id);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Superadmin role on profiles (optional; env allowlist also supported)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'superadmin'));
