-- 019_brand_color.sql
-- Adds the optional brand accent used by invoice templates.
-- Safe to run more than once and on a live database.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS brand_color TEXT;

-- Repair any existing rows before enforcing the format.
UPDATE public.profiles
SET brand_color = '#111111'
WHERE brand_color IS NULL
   OR brand_color !~ '^#[0-9a-fA-F]{6}$';

ALTER TABLE public.profiles
  ALTER COLUMN brand_color SET DEFAULT '#111111';

ALTER TABLE public.profiles
  ALTER COLUMN brand_color SET NOT NULL;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_brand_color_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_brand_color_check
  CHECK (brand_color ~ '^#[0-9a-fA-F]{6}$');

COMMENT ON COLUMN public.profiles.brand_color IS
  'Hex accent color used by Corporate, Studio, Geometric, and Swiss invoice templates.';
