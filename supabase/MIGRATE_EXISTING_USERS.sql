-- ============================================
-- MIGRATE EXISTING AUTH USERS TO PROFILES
-- ============================================
-- This creates profile entries for all existing auth.users
-- who don't have a profile yet
-- ============================================

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
);

-- Verify the migration
SELECT 
    'Auth users' as type, 
    count(*) as count 
FROM auth.users
UNION ALL
SELECT 
    'Profile entries' as type, 
    count(*) as count 
FROM public.profiles;
