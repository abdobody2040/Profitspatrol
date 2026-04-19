-- ============================================================
-- ADMIN ACCESS RESTORATION
-- Date: 2026-02-20
-- Purpose: Restores ADMIN role access to view, update, and delete all profiles,
--          which was dropped during the nuclear RLS cleanup.
--          Uses a SECURITY DEFINER function to prevent infinite recursion.
-- ============================================================

-- Create a helper function to verify admin status safely (bypassing RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- Drop existing tight policies
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;

-- Recreate SELECT with admin bypass
CREATE POLICY "profiles_select"
    ON public.profiles FOR SELECT TO authenticated
    USING (
        id = (select auth.uid())
        OR parent_id = (select auth.uid())
        OR id = (select public.get_my_parent_id())
        OR public.is_admin()
    );

-- Recreate UPDATE with admin bypass
CREATE POLICY "profiles_update"
    ON public.profiles FOR UPDATE TO authenticated
    USING (
        id = (select auth.uid()) 
        OR parent_id = (select auth.uid())
        OR public.is_admin()
    )
    WITH CHECK (
        id = (select auth.uid()) 
        OR parent_id = (select auth.uid())
        OR public.is_admin()
    );

-- Create DELETE stringently for admins only
CREATE POLICY "profiles_delete"
    ON public.profiles FOR DELETE TO authenticated
    USING (
        public.is_admin()
    );
