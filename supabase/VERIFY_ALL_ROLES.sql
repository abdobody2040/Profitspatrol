-- ============================================
-- VERIFY ALL USER ROLES IN DATABASE
-- ============================================
-- Check that users of all roles can be created
-- ============================================

-- Check total users and profiles
SELECT 
    'Total Auth Users' as type,
    count(*) as count
FROM auth.users
UNION ALL
SELECT 
    'Total Profiles' as type,
    count(*) as count
FROM public.profiles
UNION ALL
SELECT 
    'Profiles by Role' as type,
    count(*) as count
FROM public.profiles
GROUP BY role;

-- Show all profiles with their roles
SELECT 
    id,
    email,
    username,
    name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 20;

-- Verify the trigger function exists and is correct
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- Verify the trigger is attached
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
AND trigger_name = 'on_auth_user_created';
