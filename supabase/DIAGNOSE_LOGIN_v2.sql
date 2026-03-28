-- ============================================
-- PROFITS PATROL - DIAGNOSTIC CHECK
-- ============================================
-- Run this in the Supabase SQL Editor to pinpoint the login failure.

-- 1. Check if the User Exists (Auth vs Profile)
SELECT 
    au.id as auth_id, 
    au.email as auth_email, 
    au.role as auth_role, 
    au.raw_app_meta_data, 
    au.raw_user_meta_data,
    pp.id as profile_id, 
    pp.email as profile_email,
    pp.role as profile_role
FROM auth.users au
LEFT JOIN public.profiles pp ON au.id = pp.id
WHERE au.email = 'teacher_test@profits.com';

-- 2. List Active Triggers on auth.users
-- This will confirm if any bad triggers (like 'on_auth_user_login') are still active.
SELECT 
    trigger_name,
    event_manipulation as event,
    action_timing as timing,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users';

-- 3. Verify Access to Public Profile (Test permissions)
-- Attempt to read the profile directly (simulating a login check)
DO $$
DECLARE
    test_profile RECORD;
BEGIN
    SELECT * INTO test_profile 
    FROM public.profiles 
    WHERE email = 'teacher_test@profits.com';
    
    IF FOUND THEN
        RAISE NOTICE 'Profile exists and is readable.';
    ELSE
        RAISE NOTICE 'Profile NOT found or not readable.';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error reading profile: %', SQLERRM;
END $$;
