-- ============================================================
-- ADD SUBSCRIPTION COLUMNS
-- Date: 2026-02-20
-- Purpose: Adds subscription_tier and subscription_status to the profiles table,
--          which the Admin Console expects for role differentiation.
-- ============================================================

-- Add columns if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'intern',
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'FREE';

-- Backfill existing data based on roles
UPDATE public.profiles
SET 
  subscription_status = 'PREMIUM',
  subscription_tier = 'tycoon'
WHERE UPPER(role) IN ('ADMIN', 'TEACHER');

-- Ensure parents get a generic active status if needed, or leave as FREE intern
UPDATE public.profiles
SET 
  subscription_status = 'FREE',
  subscription_tier = 'intern'
WHERE UPPER(role) IN ('PARENT', 'KID') AND subscription_tier IS NULL;
