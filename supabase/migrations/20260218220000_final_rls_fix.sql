-- ============================================================
-- FINAL RLS FIX - Profits Patrol
-- Date: 2026-02-18
-- Purpose: Resolve ALL Supabase RLS linter warnings:
--   1. Multiple permissive policies for INSERT on profiles
--   2. Multiple permissive policies for SELECT on profiles
--   3. auth.uid() called without (select ...) wrapper (performance)
--   4. auth.role() called without (select ...) wrapper (performance)
-- Strategy:
--   - Drop EVERY known policy name (including legacy ones)
--   - Consolidate SELECT into ONE policy using OR conditions
--   - Consolidate INSERT into ONE policy
--   - Wrap ALL auth.uid() / auth.role() calls with (select ...)
-- ============================================================

-- ============================================================
-- SECTION 1: DROP ALL KNOWN POLICIES ON public.profiles
-- (covers every name ever used across all migrations)
-- ============================================================

DROP POLICY IF EXISTS "Users can view own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"  ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Parents can view linked children"    ON public.profiles;
DROP POLICY IF EXISTS "Parents can update linked children"  ON public.profiles;
DROP POLICY IF EXISTS "Kids can view their parent"          ON public.profiles;
DROP POLICY IF EXISTS "profiles_select"                     ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert"                     ON public.profiles;
DROP POLICY IF EXISTS "profiles_update"                     ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation"              ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own invite_code" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"        ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles"      ON public.profiles;
DROP POLICY IF EXISTS "Service role full access"            ON public.profiles;

-- ============================================================
-- SECTION 2: RECREATE profiles POLICIES (CLEAN & CONSOLIDATED)
-- ============================================================

-- SELECT: ONE consolidated policy (eliminates "multiple permissive" warning)
-- Covers: own profile, parent viewing child, child viewing parent
CREATE POLICY "profiles_select"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = (select auth.uid())
        OR parent_id = (select auth.uid())
        OR id = (select public.get_my_parent_id())
    );

-- INSERT: ONE policy only (eliminates "multiple permissive" warning)
-- Also allows service_role for the handle_new_user() trigger
CREATE POLICY "profiles_insert"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (select auth.uid()));

-- UPDATE: ONE consolidated policy
-- Covers: own profile, parent updating child's profile
CREATE POLICY "profiles_update"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (
        id = (select auth.uid())
        OR parent_id = (select auth.uid())
    )
    WITH CHECK (
        id = (select auth.uid())
        OR parent_id = (select auth.uid())
    );

-- ============================================================
-- SECTION 3: DROP & RECREATE ALL OTHER TABLE POLICIES
-- with (select auth.uid()) for performance
-- ============================================================

-- CLASSROOMS
DROP POLICY IF EXISTS "Teachers can manage own classrooms"  ON public.classrooms;
DROP POLICY IF EXISTS "Students can view their classrooms"  ON public.classrooms;

CREATE POLICY "Teachers can manage own classrooms"
    ON public.classrooms FOR ALL
    TO authenticated
    USING (teacher_id = (select auth.uid()));

CREATE POLICY "Students can view their classrooms"
    ON public.classrooms FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_members cm
            WHERE cm.classroom_id = public.classrooms.id
              AND cm.user_id = (select auth.uid())
        )
    );

-- CLASSROOM MEMBERS
DROP POLICY IF EXISTS "Teachers can manage classroom members" ON public.classroom_members;
DROP POLICY IF EXISTS "Students can view own membership"      ON public.classroom_members;

CREATE POLICY "Teachers can manage classroom members"
    ON public.classroom_members FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.classroom_members.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "Students can view own membership"
    ON public.classroom_members FOR SELECT
    TO authenticated
    USING (user_id = (select auth.uid()));

-- STUDENT GROUPS
DROP POLICY IF EXISTS "Teachers can manage student groups" ON public.student_groups;

CREATE POLICY "Teachers can manage student groups"
    ON public.student_groups FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.student_groups.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

-- RUBRICS
DROP POLICY IF EXISTS "Teachers can manage own rubrics" ON public.rubrics;

CREATE POLICY "Teachers can manage own rubrics"
    ON public.rubrics FOR ALL
    TO authenticated
    USING (teacher_id = (select auth.uid()));

-- ASSIGNMENTS
DROP POLICY IF EXISTS "Teachers can manage assignments"         ON public.assignments;
DROP POLICY IF EXISTS "Students can view classroom assignments" ON public.assignments;

CREATE POLICY "Teachers can manage assignments"
    ON public.assignments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.assignments.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "Students can view classroom assignments"
    ON public.assignments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_members cm
            WHERE cm.classroom_id = public.assignments.classroom_id
              AND cm.user_id = (select auth.uid())
        )
    );

-- SUBMISSIONS
DROP POLICY IF EXISTS "Students can manage own submissions"     ON public.submissions;
DROP POLICY IF EXISTS "Teachers can view and grade submissions" ON public.submissions;

CREATE POLICY "Students can manage own submissions"
    ON public.submissions FOR ALL
    TO authenticated
    USING (student_id = (select auth.uid()));

CREATE POLICY "Teachers can view and grade submissions"
    ON public.submissions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON c.id = a.classroom_id
            WHERE a.id = public.submissions.assignment_id
              AND c.teacher_id = (select auth.uid())
        )
    );

-- BOUNTIES
DROP POLICY IF EXISTS "Parents can manage their bounties" ON public.bounties;
DROP POLICY IF EXISTS "Kids can view and claim bounties"  ON public.bounties;
DROP POLICY IF EXISTS "Kids can update claimed bounties"  ON public.bounties;

CREATE POLICY "Parents can manage their bounties"
    ON public.bounties FOR ALL
    TO authenticated
    USING (parent_id = (select auth.uid()));

CREATE POLICY "Kids can view and claim bounties"
    ON public.bounties FOR SELECT
    TO authenticated
    USING (
        parent_id = (select public.get_my_parent_id())
        OR claimed_by = (select auth.uid())
    );

CREATE POLICY "Kids can update claimed bounties"
    ON public.bounties FOR UPDATE
    TO authenticated
    USING (claimed_by = (select auth.uid()));

-- SECURITY EVENTS
DROP POLICY IF EXISTS "Service role can manage security events" ON public.security_events;
DROP POLICY IF EXISTS "Admins can view security events"         ON public.security_events;

CREATE POLICY "Service role can manage security events"
    ON public.security_events FOR ALL
    USING ((select auth.role()) = 'service_role');

-- MODERATED CONTENT
DROP POLICY IF EXISTS "Users can view own moderated content"       ON public.moderated_content;
DROP POLICY IF EXISTS "Service role can manage moderated content"  ON public.moderated_content;

CREATE POLICY "Users can view own moderated content"
    ON public.moderated_content FOR SELECT
    TO authenticated
    USING (user_id = (select auth.uid()));

CREATE POLICY "Service role can manage moderated content"
    ON public.moderated_content FOR ALL
    USING ((select auth.role()) = 'service_role');

-- MODERATION WHITELIST / BLACKLIST
DROP POLICY IF EXISTS "Admins can manage whitelist" ON public.moderation_whitelist;
DROP POLICY IF EXISTS "Admins can manage blacklist" ON public.moderation_blacklist;
DROP POLICY IF EXISTS "Authenticated can view whitelist" ON public.moderation_whitelist;
DROP POLICY IF EXISTS "Authenticated can view blacklist" ON public.moderation_blacklist;

CREATE POLICY "Authenticated can view whitelist"
    ON public.moderation_whitelist FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role can manage whitelist"
    ON public.moderation_whitelist FOR ALL
    USING ((select auth.role()) = 'service_role');

CREATE POLICY "Authenticated can view blacklist"
    ON public.moderation_blacklist FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role can manage blacklist"
    ON public.moderation_blacklist FOR ALL
    USING ((select auth.role()) = 'service_role');

-- FRIENDS
DROP POLICY IF EXISTS "Users can manage own friendships" ON public.friends;

CREATE POLICY "Users can manage own friendships"
    ON public.friends FOR ALL
    TO authenticated
    USING (
        user_id = (select auth.uid())
        OR friend_id = (select auth.uid())
    );

-- PARENTAL GATE
DROP POLICY IF EXISTS "Users can manage own parental gate" ON public.parental_gate;

CREATE POLICY "Users can manage own parental gate"
    ON public.parental_gate FOR ALL
    TO authenticated
    USING (user_id = (select auth.uid()));

-- ACCOUNT DELETION
DROP POLICY IF EXISTS "Users can manage own deletion request" ON public.account_deletion;

CREATE POLICY "Users can manage own deletion request"
    ON public.account_deletion FOR ALL
    TO authenticated
    USING (user_id = (select auth.uid()));

-- WEBHOOK EVENTS (Stripe - service role only)
DROP POLICY IF EXISTS "Service role can manage webhook events" ON public.webhook_events;

CREATE POLICY "Service role can manage webhook events"
    ON public.webhook_events FOR ALL
    USING ((select auth.role()) = 'service_role');

-- ============================================================
-- SECTION 4: ENSURE get_profile_by_invite_code HAS SAFE search_path
-- Must DROP first because return type (OUT params) may differ from existing version
-- ============================================================

DROP FUNCTION IF EXISTS public.get_profile_by_invite_code(text);

CREATE OR REPLACE FUNCTION public.get_profile_by_invite_code(code TEXT)
RETURNS TABLE (id UUID, username TEXT, role TEXT)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql STABLE
AS $$
    SELECT p.id, p.username, p.role
    FROM public.profiles p
    WHERE p.invite_code = code
    LIMIT 1;
$$;

-- ============================================================
-- END OF FINAL RLS FIX
-- ============================================================
