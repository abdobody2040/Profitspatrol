-- ============================================
-- PROFITS PATROL - COMPREHENSIVE FIX (RLS & PERMISSIONS)
-- ============================================

-- 1. FIX SEARCH PATH (Potential 500 Error Cause)
-- "Database error querying schema" often happens if the API role can't find 'auth' schema.
ALTER ROLE authenticator SET search_path = public, auth, extensions;
ALTER ROLE service_role SET search_path = public, auth, extensions;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;

-- 2. ENABLE RLS ON PROFILES (Crucial Step)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RESET POLICIES (Clean Slate)
DROP POLICY IF EXISTS "profiles_select_debug" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- 4. CREATE CORRECT POLICIES (OPTIMIZED)
-- We use (select auth.uid()) to avoid re-evaluating the function for every row.
-- This fixes the "Suboptimal query performance" warning.

-- Allow users to view their own profile (and any profile for app logic like leaderboards/friends)
CREATE POLICY "profiles_select" ON public.profiles 
FOR SELECT TO authenticated 
USING (true); 

-- Allow users to update ONLY their own profile
CREATE POLICY "profiles_update" ON public.profiles 
FOR UPDATE TO authenticated 
USING (id = (select auth.uid()));

-- Allow insert (for sign up triggers or manual creation)
CREATE POLICY "profiles_insert" ON public.profiles 
FOR INSERT TO authenticated 
WITH CHECK (id = (select auth.uid()));

-- 5. RE-VERIFY TEACHER TEST USER
DO $$
BEGIN
    -- Ensure the teacher user exists in auth and is confirmed
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'teacher_test@profits.com') THEN
        UPDATE auth.users 
        SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            last_sign_in_at = NULL, -- Reset sign in state to force fresh token
            encrypted_password = crypt('TestPass123!', gen_salt('bf')) -- Ensure password is valid
        WHERE email = 'teacher_test@profits.com';
    END IF;
END $$;
