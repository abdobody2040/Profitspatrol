-- ============================================
-- COMPLETE FIX FOR LOGIN AND SIGNUP ISSUES
-- ============================================

-- Step 1: Create profiles for ALL existing auth users (including admin)
INSERT INTO public.profiles (
    id,
    email,
    username,
    name,
    role
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)) as username,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)) as name,
    LOWER(COALESCE(au.raw_user_meta_data->>'role', 'kid'))::text as role
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Make sure admin@profitspatrol.com has admin role
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@profitspatrol.com';

-- Step 3: Verify the fix
SELECT 
    'Auth users' as type, 
    count(*) as count 
FROM auth.users
UNION ALL
SELECT 
    'Profile entries' as type, 
    count(*) as count 
FROM public.profiles
UNION ALL
SELECT
    'Admin user profile' as type,
    count(*) as count
FROM public.profiles
WHERE email = 'admin@profitspatrol.com' AND role = 'admin';

-- Step 4: Test that new user trigger works
-- (This just shows the trigger - don't run this part)
-- When you create a new user, the handle_new_user() function should automatically create a profile
