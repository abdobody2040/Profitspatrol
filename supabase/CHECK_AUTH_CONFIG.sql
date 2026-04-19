-- ============================================
-- DIAGNOSTIC: Check Supabase Auth Configuration
-- ============================================
-- Run this to see if there are any auth configuration issues
-- ============================================

-- Check if email confirmation is required
-- (This query won't work in SQL Editor, but it's for reference)
-- You need to check this in Supabase Dashboard:
-- Authentication → Settings → Email Auth → "Confirm email" toggle

-- Check recent auth attempts and errors
SELECT 
    'Recent auth users (last 10)' as info,
    id,
    email,
    created_at,
    email_confirmed_at,
    confirmation_sent_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Check if there are any users waiting for email confirmation
SELECT 
    'Users awaiting confirmation' as info,
    count(*) as count
FROM auth.users
WHERE email_confirmed_at IS NULL;

-- Check profiles table
SELECT 
    'Total profiles' as info,
    count(*) as count
FROM public.profiles;
