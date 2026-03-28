-- Add missing billing_cycle column to profiles table
-- This is necessary for SupabaseAdapter.saveUser to successfully upsert
-- the profile after a subscription upgrade without throwing a Postgres
-- "column does not exist" error, which was previously preventing the
-- parent's new premium tier from sticking.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_cycle text;
