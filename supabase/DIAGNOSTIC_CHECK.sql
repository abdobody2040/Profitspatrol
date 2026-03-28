-- ============================================
-- DIAGNOSTIC SCRIPT - Check Database State
-- ============================================

-- 1. Check if admin user exists in auth.users
SELECT 'Admin in auth.users:' as check_type, 
       email, 
       id,
       raw_user_meta_data->>'role' as metadata_role
FROM auth.users 
WHERE email = 'admin@profitspatrol.com';

-- 2. Check if admin user has a profile
SELECT 'Admin in profiles:' as check_type,
       email,
       username,
       role
FROM public.profiles 
WHERE email = 'admin@profitspatrol.com';

-- 3. Count all users vs profiles
SELECT 'Total auth users' as metric, count(*) as count FROM auth.users
UNION ALL
SELECT 'Total profiles' as metric, count(*) as count FROM public.profiles;

-- 4. Check if handle_new_user trigger exists
SELECT 'Trigger exists:' as check_type,
       trigger_name,
       event_manipulation,
       action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 5. Check if the function exists
SELECT 'Function exists:' as check_type,
       routine_name,
       routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 6. Find users without profiles
SELECT 'Users without profiles:' as check_type,
       au.email,
       au.id
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;
