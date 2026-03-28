-- ============================================================
-- RESOLVE RLS POLICY WARNINGS
-- Date: 2026-02-25
-- Purpose: Consolidate redundant profiles policies and enable RLS on classrooms
-- ============================================================

-- 1. ENABLE RLS ON CLASSROOMS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- 2. DROP OVERLAPPING POLICIES ON PROFILES
-- Drop all SELECT duplicates
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Kids can view their parent" ON public.profiles;
DROP POLICY IF EXISTS "Parents can view linked children" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;

-- Drop all INSERT duplicates
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;

-- Drop all UPDATE duplicates
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Parents can update linked children" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- 3. RECREATE SINGLE OPTIMIZED POLICIES
-- One SELECT policy replacing 4
CREATE POLICY "profiles_select"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = (select auth.uid()) OR 
        parent_id = (select auth.uid()) OR 
        id = (select public.get_my_parent_id())
    );

-- One INSERT policy replacing 2
CREATE POLICY "profiles_insert"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (select auth.uid()));

-- One UPDATE policy replacing 3
CREATE POLICY "profiles_update"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        id = (select auth.uid()) OR 
        parent_id = (select auth.uid())
    )
    WITH CHECK (
        id = (select auth.uid()) OR 
        parent_id = (select auth.uid())
    );
