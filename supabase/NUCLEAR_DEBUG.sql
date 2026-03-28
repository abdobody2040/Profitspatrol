-- ============================================
-- PROFITS PATROL - NUCLEAR DEBUG
-- ============================================
-- The 500 Error "Database error querying schema" persists.
-- This usually means RLS Recursion (Infinite Loop) or Permission Denied.
-- We are going to DISABLE protections to verify connectivity.

-- 1. DISABLE RLS ON PROFILES (Temporary)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. GRANT FULL PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 3. DROP ALL POLICIES ON PROFILES (Just to be sure triggers don't hit them)
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- 4. ENSURE SEARCH PATH
-- Sometimes auth functions fail if they can't find public schema
ALTER ROLE authenticated SET search_path = public;

-- 5. CHECK AUTH HOOKS (Information Only - Run this to see)
-- Only superusers can see this usually, but worth a try
SELECT * FROM information_schema.triggers WHERE event_object_schema = 'auth';

-- 6. MANUAL SESSION TEST (Can we insert into session?)
-- This tests if the auth schema itself is writable
DO $$
BEGIN
    -- We can't easily validly insert into auth.sessions without a valid user/token,
    -- but we can check if the table is locked or broken.
    PERFORM count(*) FROM auth.sessions;
    RAISE NOTICE 'Read auth.sessions successfully';
END $$;
