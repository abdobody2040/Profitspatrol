-- ============================================
-- FIX ALL SUPABASE LINT WARNINGS
-- ============================================
-- This script fixes:
-- 1. RLS performance issues (auth.uid() → (SELECT auth.uid()))
-- 2. Function search_path security issue
-- ============================================

-- STEP 1: Fix the update_updated_at function
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public  -- FIX: Add search_path
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the triggers that were dropped by CASCADE
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_classrooms_updated_at ON public.classrooms;
CREATE TRIGGER update_classrooms_updated_at
    BEFORE UPDATE ON public.classrooms
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;
CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- STEP 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Parents can view linked children" ON public.profiles;
DROP POLICY IF EXISTS "Kids can view their parent" ON public.profiles;
DROP POLICY IF EXISTS "Parents can update linked children" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can manage own classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Students can view their classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Teachers can manage classroom members" ON public.classroom_members;
DROP POLICY IF EXISTS "Students can view own membership" ON public.classroom_members;
DROP POLICY IF EXISTS "Teachers can manage student groups" ON public.student_groups;
DROP POLICY IF EXISTS "Teachers can manage own rubrics" ON public.rubrics;
DROP POLICY IF EXISTS "Teachers can manage assignments" ON public.assignments;
DROP POLICY IF EXISTS "Students can view classroom assignments" ON public.assignments;
DROP POLICY IF EXISTS "Students can manage own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Teachers can view and grade submissions" ON public.submissions;
DROP POLICY IF EXISTS "Parents can manage their bounties" ON public.bounties;
DROP POLICY IF EXISTS "Kids can view and claim bounties" ON public.bounties;
DROP POLICY IF EXISTS "Kids can update claimed bounties" ON public.bounties;
DROP POLICY IF EXISTS "Service role can manage security events" ON public.security_events;
DROP POLICY IF EXISTS "Users can view own moderated content" ON public.moderated_content;
DROP POLICY IF EXISTS "Service role can manage moderated content" ON public.moderated_content;
DROP POLICY IF EXISTS "Users can manage own friendships" ON public.friends;

-- STEP 3: Recreate all policies with optimized auth.uid() calls

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = (SELECT auth.uid()));

CREATE POLICY "Parents can view linked children"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (parent_id = (SELECT auth.uid()));

CREATE POLICY "Kids can view their parent"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = get_my_parent_id());

CREATE POLICY "Parents can update linked children"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (parent_id = (SELECT auth.uid()));

-- CLASSROOMS POLICIES
CREATE POLICY "Teachers can manage own classrooms"
    ON public.classrooms FOR ALL
    TO authenticated
    USING (teacher_id = (SELECT auth.uid()));

CREATE POLICY "Students can view their classrooms"
    ON public.classrooms FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_members cm
            WHERE cm.classroom_id = public.classrooms.id
            AND cm.user_id = (SELECT auth.uid())
        )
    );

-- CLASSROOM MEMBERS POLICIES
CREATE POLICY "Teachers can manage classroom members"
    ON public.classroom_members FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.classroom_members.classroom_id
            AND c.teacher_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Students can view own membership"
    ON public.classroom_members FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- STUDENT GROUPS POLICIES
CREATE POLICY "Teachers can manage student groups"
    ON public.student_groups FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.student_groups.classroom_id
            AND c.teacher_id = (SELECT auth.uid())
        )
    );

-- RUBRICS POLICIES
CREATE POLICY "Teachers can manage own rubrics"
    ON public.rubrics FOR ALL
    TO authenticated
    USING (teacher_id = (SELECT auth.uid()));

-- ASSIGNMENTS POLICIES
CREATE POLICY "Teachers can manage assignments"
    ON public.assignments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.assignments.classroom_id
            AND c.teacher_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Students can view classroom assignments"
    ON public.assignments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_members cm
            WHERE cm.classroom_id = public.assignments.classroom_id
            AND cm.user_id = (SELECT auth.uid())
        )
    );

-- SUBMISSIONS POLICIES
CREATE POLICY "Students can manage own submissions"
    ON public.submissions FOR ALL
    TO authenticated
    USING (student_id = (SELECT auth.uid()));

CREATE POLICY "Teachers can view and grade submissions"
    ON public.submissions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON c.id = a.classroom_id
            WHERE a.id = public.submissions.assignment_id
            AND c.teacher_id = (SELECT auth.uid())
        )
    );

-- BOUNTIES POLICIES
CREATE POLICY "Parents can manage their bounties"
    ON public.bounties FOR ALL
    TO authenticated
    USING (parent_id = (SELECT auth.uid()));

CREATE POLICY "Kids can view and claim bounties"
    ON public.bounties FOR SELECT
    TO authenticated
    USING (
        parent_id = get_my_parent_id() OR
        claimed_by = (SELECT auth.uid())
    );

CREATE POLICY "Kids can update claimed bounties"
    ON public.bounties FOR UPDATE
    TO authenticated
    USING (claimed_by = (SELECT auth.uid()));

-- SECURITY & MODERATION POLICIES
CREATE POLICY "Service role can manage security events"
    ON public.security_events FOR ALL
    USING ((SELECT auth.role()) = 'service_role');

CREATE POLICY "Users can view own moderated content"
    ON public.moderated_content FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Service role can manage moderated content"
    ON public.moderated_content FOR ALL
    USING ((SELECT auth.role()) = 'service_role');

-- FRIENDS POLICIES
CREATE POLICY "Users can manage own friendships"
    ON public.friends FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()) OR friend_id = (SELECT auth.uid()));

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Policies fixed!' as status, count(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public';
