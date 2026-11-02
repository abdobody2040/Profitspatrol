-- Add Stripe customer ID to profiles so the Billing Portal can look it up
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Index for fast lookup when a webhook fires (avoids sequential scans)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
