-- Fix RLS: Multiple Permissive Policies & Auth Performance
-- 1. Remove redundant policies
-- 2. Optimize auth.uid() calls with (select auth.uid()) for better performance

-- ========================================================
-- CLEANUP
-- ========================================================

-- Drop redundant policy created by strict-mode checks or duplicate migrations
DROP POLICY IF EXISTS "Users can update their own invite_code" ON public.profiles;

-- Drop generic policy name if it exists (linter flagged 'profiles_update')
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- Use DO block to handle policies that might not exist to avoid errors during standard cleanup if names differ
DO $$
BEGIN
    -- We can just use DROP POLICY IF EXISTS, it's safe.
END
$$;


-- ========================================================
-- OPTIMIZED POLICIES (public.profiles)
-- ========================================================

-- 1. VIEW OWN PROFILE
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = (select auth.uid()));

-- 2. INSERT OWN PROFILE
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (select auth.uid()));

-- 3. UPDATE OWN PROFILE (Consolidated)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = (select auth.uid()))
    WITH CHECK (id = (select auth.uid()));

-- 4. VIEW LINKED CHILDREN (Parents)
DROP POLICY IF EXISTS "Parents can view linked children" ON public.profiles;
CREATE POLICY "Parents can view linked children"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (parent_id = (select auth.uid()));

-- 5. UPDATE LINKED CHILDREN (Parents)
DROP POLICY IF EXISTS "Parents can update linked children" ON public.profiles;
CREATE POLICY "Parents can update linked children"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (parent_id = (select auth.uid()));

-- 6. VIEW PARENT (Kids) - Optimized get_my_parent_id usage if possible
-- Note: get_my_parent_id() likely calls auth.uid(), so wrapping it in select might help if it wasn't stable.
-- It is defined as STABLE in MASTER_SCHEMA, but (select ...) is safer for RLS.
DROP POLICY IF EXISTS "Kids can view their parent" ON public.profiles;
CREATE POLICY "Kids can view their parent"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = (select public.get_my_parent_id()));

-- ========================================================
-- ADMIN BYPASS POLICIES
-- ✅ SECURITY FIX: The previous migration omitted Admin RLS policies.
-- Without these, an Admin user would silently receive empty result sets
-- from Supabase because RLS never errors — it just filters rows.
-- IMPORTANT: We read the role from auth.jwt() (server-assigned JWT claim)
-- NOT from the profiles table, to prevent a client-side privilege escalation
-- where a user could manipulate their own profile row's role field.
-- The 'role' JWT claim is set by the handle_new_user() trigger on signup
-- and is only writable by service_role — not by authenticated users.
-- ========================================================

-- 7. ADMIN: SELECT ALL PROFILES
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((select auth.jwt() ->> 'role') = 'admin');

-- 8. ADMIN: UPDATE ALL PROFILES
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((select auth.jwt() ->> 'role') = 'admin')
    WITH CHECK ((select auth.jwt() ->> 'role') = 'admin');

-- 9. ADMIN: DELETE PROFILES (e.g., ban users)
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
    ON public.profiles FOR DELETE
    TO authenticated
    USING ((select auth.jwt() ->> 'role') = 'admin');
