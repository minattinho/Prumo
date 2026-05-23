ALTER TABLE public.professional_profiles
  ADD COLUMN IF NOT EXISTS price_per_hour NUMERIC,
  ADD COLUMN IF NOT EXISTS price_per_day NUMERIC,
  ADD COLUMN IF NOT EXISTS price_per_month NUMERIC,
  ADD COLUMN IF NOT EXISTS price_per_service NUMERIC,
  ADD COLUMN IF NOT EXISTS price_currency TEXT DEFAULT 'BRL';
