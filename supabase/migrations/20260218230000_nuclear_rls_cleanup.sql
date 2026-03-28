-- ============================================================
-- NUCLEAR RLS CLEANUP - Profits Patrol
-- Date: 2026-02-18
-- Purpose: Drop EVERY known policy name (legacy + new) across ALL tables,
--          then recreate ONE clean consolidated policy per action per table.
--          Resolves all "multiple permissive policies" linter warnings.
-- ============================================================

-- ============================================================
-- STEP 1: DROP ALL KNOWN POLICIES (every name ever created)
-- ============================================================

-- profiles
DROP POLICY IF EXISTS "Users can view own profile"             ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"           ON public.profiles;
DROP POLICY IF EXISTS "Parents can view linked children"       ON public.profiles;
DROP POLICY IF EXISTS "Parents can update linked children"     ON public.profiles;
DROP POLICY IF EXISTS "Kids can view their parent"             ON public.profiles;
DROP POLICY IF EXISTS "profiles_select"                        ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert"                        ON public.profiles;
DROP POLICY IF EXISTS "profiles_update"                        ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete"                        ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation"                 ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own invite_code" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles"           ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles"         ON public.profiles;
DROP POLICY IF EXISTS "Service role full access"               ON public.profiles;

-- classrooms
DROP POLICY IF EXISTS "Teachers can manage own classrooms"  ON public.classrooms;
DROP POLICY IF EXISTS "Students can view their classrooms"  ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_select"                   ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_insert"                   ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_update"                   ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_delete"                   ON public.classrooms;

-- classroom_members
DROP POLICY IF EXISTS "Teachers can manage classroom members" ON public.classroom_members;
DROP POLICY IF EXISTS "Students can view own membership"      ON public.classroom_members;
DROP POLICY IF EXISTS "classroom_members_select"              ON public.classroom_members;
DROP POLICY IF EXISTS "classroom_members_insert"              ON public.classroom_members;
DROP POLICY IF EXISTS "classroom_members_update"              ON public.classroom_members;
DROP POLICY IF EXISTS "classroom_members_delete"              ON public.classroom_members;

-- student_groups
DROP POLICY IF EXISTS "Teachers can manage student groups" ON public.student_groups;
DROP POLICY IF EXISTS "student_groups_select"              ON public.student_groups;
DROP POLICY IF EXISTS "student_groups_insert"              ON public.student_groups;
DROP POLICY IF EXISTS "student_groups_update"              ON public.student_groups;
DROP POLICY IF EXISTS "student_groups_delete"              ON public.student_groups;

-- rubrics
DROP POLICY IF EXISTS "Teachers can manage own rubrics" ON public.rubrics;
DROP POLICY IF EXISTS "rubrics_select"                  ON public.rubrics;
DROP POLICY IF EXISTS "rubrics_insert"                  ON public.rubrics;
DROP POLICY IF EXISTS "rubrics_update"                  ON public.rubrics;
DROP POLICY IF EXISTS "rubrics_delete"                  ON public.rubrics;

-- assignments
DROP POLICY IF EXISTS "Teachers can manage assignments"         ON public.assignments;
DROP POLICY IF EXISTS "Students can view classroom assignments" ON public.assignments;
DROP POLICY IF EXISTS "assignments_select"                      ON public.assignments;
DROP POLICY IF EXISTS "assignments_insert"                      ON public.assignments;
DROP POLICY IF EXISTS "assignments_update"                      ON public.assignments;
DROP POLICY IF EXISTS "assignments_delete"                      ON public.assignments;

-- submissions
DROP POLICY IF EXISTS "Students can manage own submissions"     ON public.submissions;
DROP POLICY IF EXISTS "Teachers can view and grade submissions" ON public.submissions;
DROP POLICY IF EXISTS "submissions_select"                      ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert"                      ON public.submissions;
DROP POLICY IF EXISTS "submissions_update"                      ON public.submissions;
DROP POLICY IF EXISTS "submissions_delete"                      ON public.submissions;

-- bounties
DROP POLICY IF EXISTS "Parents can manage their bounties" ON public.bounties;
DROP POLICY IF EXISTS "Kids can view and claim bounties"  ON public.bounties;
DROP POLICY IF EXISTS "Kids can update claimed bounties"  ON public.bounties;
DROP POLICY IF EXISTS "bounties_select"                   ON public.bounties;
DROP POLICY IF EXISTS "bounties_insert"                   ON public.bounties;
DROP POLICY IF EXISTS "bounties_update"                   ON public.bounties;
DROP POLICY IF EXISTS "bounties_delete"                   ON public.bounties;

-- security_events
DROP POLICY IF EXISTS "Service role can manage security events" ON public.security_events;
DROP POLICY IF EXISTS "Admins can view security events"         ON public.security_events;
DROP POLICY IF EXISTS "security_events_select"                  ON public.security_events;
DROP POLICY IF EXISTS "security_events_insert"                  ON public.security_events;
DROP POLICY IF EXISTS "security_events_update"                  ON public.security_events;
DROP POLICY IF EXISTS "security_events_delete"                  ON public.security_events;

-- moderated_content
DROP POLICY IF EXISTS "Users can view own moderated content"      ON public.moderated_content;
DROP POLICY IF EXISTS "Service role can manage moderated content" ON public.moderated_content;
DROP POLICY IF EXISTS "moderated_content_select"                  ON public.moderated_content;
DROP POLICY IF EXISTS "moderated_content_insert"                  ON public.moderated_content;
DROP POLICY IF EXISTS "moderated_content_update"                  ON public.moderated_content;
DROP POLICY IF EXISTS "moderated_content_delete"                  ON public.moderated_content;

-- moderation_whitelist
DROP POLICY IF EXISTS "Authenticated can view whitelist"    ON public.moderation_whitelist;
DROP POLICY IF EXISTS "Service role can manage whitelist"   ON public.moderation_whitelist;
DROP POLICY IF EXISTS "Admins can manage whitelist"         ON public.moderation_whitelist;
DROP POLICY IF EXISTS "moderation_whitelist_select"         ON public.moderation_whitelist;
DROP POLICY IF EXISTS "moderation_whitelist_insert"         ON public.moderation_whitelist;
DROP POLICY IF EXISTS "moderation_whitelist_update"         ON public.moderation_whitelist;
DROP POLICY IF EXISTS "moderation_whitelist_delete"         ON public.moderation_whitelist;

-- moderation_blacklist
DROP POLICY IF EXISTS "Authenticated can view blacklist"    ON public.moderation_blacklist;
DROP POLICY IF EXISTS "Service role can manage blacklist"   ON public.moderation_blacklist;
DROP POLICY IF EXISTS "Admins can manage blacklist"         ON public.moderation_blacklist;
DROP POLICY IF EXISTS "moderation_blacklist_select"         ON public.moderation_blacklist;
DROP POLICY IF EXISTS "moderation_blacklist_insert"         ON public.moderation_blacklist;
DROP POLICY IF EXISTS "moderation_blacklist_update"         ON public.moderation_blacklist;
DROP POLICY IF EXISTS "moderation_blacklist_delete"         ON public.moderation_blacklist;

-- parental_gate
DROP POLICY IF EXISTS "Users can manage own parental gate" ON public.parental_gate;
DROP POLICY IF EXISTS "parental_gate_select"               ON public.parental_gate;
DROP POLICY IF EXISTS "parental_gate_insert"               ON public.parental_gate;
DROP POLICY IF EXISTS "parental_gate_update"               ON public.parental_gate;
DROP POLICY IF EXISTS "parental_gate_delete"               ON public.parental_gate;

-- account_deletion
DROP POLICY IF EXISTS "Users can manage own deletion request" ON public.account_deletion;
DROP POLICY IF EXISTS "account_deletion_select"               ON public.account_deletion;
DROP POLICY IF EXISTS "account_deletion_insert"               ON public.account_deletion;
DROP POLICY IF EXISTS "account_deletion_update"               ON public.account_deletion;
DROP POLICY IF EXISTS "account_deletion_delete"               ON public.account_deletion;

-- webhook_events
DROP POLICY IF EXISTS "Service role can manage webhook events" ON public.webhook_events;
DROP POLICY IF EXISTS "webhook_events_select"                  ON public.webhook_events;
DROP POLICY IF EXISTS "webhook_events_insert"                  ON public.webhook_events;
DROP POLICY IF EXISTS "webhook_events_update"                  ON public.webhook_events;
DROP POLICY IF EXISTS "webhook_events_delete"                  ON public.webhook_events;

-- friends
DROP POLICY IF EXISTS "Users can manage own friendships" ON public.friends;
DROP POLICY IF EXISTS "friends_all"                      ON public.friends;
DROP POLICY IF EXISTS "friends_select"                   ON public.friends;
DROP POLICY IF EXISTS "friends_insert"                   ON public.friends;
DROP POLICY IF EXISTS "friends_update"                   ON public.friends;
DROP POLICY IF EXISTS "friends_delete"                   ON public.friends;

-- ============================================================
-- STEP 2: RECREATE ALL POLICIES — ONE PER ACTION PER TABLE
--         All auth.uid() wrapped with (select ...) for performance
-- ============================================================

-- ── PROFILES ──────────────────────────────────────────────
-- ONE SELECT: own profile OR parent viewing child OR child viewing parent
CREATE POLICY "profiles_select"
    ON public.profiles FOR SELECT TO authenticated
    USING (
        id = (select auth.uid())
        OR parent_id = (select auth.uid())
        OR id = (select public.get_my_parent_id())
    );

-- ONE INSERT
CREATE POLICY "profiles_insert"
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (id = (select auth.uid()));

-- ONE UPDATE: own profile OR parent updating child
CREATE POLICY "profiles_update"
    ON public.profiles FOR UPDATE TO authenticated
    USING (id = (select auth.uid()) OR parent_id = (select auth.uid()))
    WITH CHECK (id = (select auth.uid()) OR parent_id = (select auth.uid()));

-- ── CLASSROOMS ────────────────────────────────────────────
-- ONE SELECT: teacher owns it OR student is a member
CREATE POLICY "classrooms_select"
    ON public.classrooms FOR SELECT TO authenticated
    USING (
        teacher_id = (select auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.classroom_members cm
            WHERE cm.classroom_id = public.classrooms.id
              AND cm.user_id = (select auth.uid())
        )
    );

CREATE POLICY "classrooms_insert"
    ON public.classrooms FOR INSERT TO authenticated
    WITH CHECK (teacher_id = (select auth.uid()));

CREATE POLICY "classrooms_update"
    ON public.classrooms FOR UPDATE TO authenticated
    USING (teacher_id = (select auth.uid()));

CREATE POLICY "classrooms_delete"
    ON public.classrooms FOR DELETE TO authenticated
    USING (teacher_id = (select auth.uid()));

-- ── CLASSROOM MEMBERS ─────────────────────────────────────
-- ONE SELECT: teacher of the classroom OR the member themselves
CREATE POLICY "classroom_members_select"
    ON public.classroom_members FOR SELECT TO authenticated
    USING (
        user_id = (select auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.classroom_members.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "classroom_members_insert"
    ON public.classroom_members FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.classroom_members.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "classroom_members_update"
    ON public.classroom_members FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.classroom_members.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "classroom_members_delete"
    ON public.classroom_members FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.classroom_members.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

-- ── STUDENT GROUPS ────────────────────────────────────────
CREATE POLICY "student_groups_select"
    ON public.student_groups FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.student_groups.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "student_groups_insert"
    ON public.student_groups FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.student_groups.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "student_groups_update"
    ON public.student_groups FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.student_groups.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "student_groups_delete"
    ON public.student_groups FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.student_groups.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

-- ── RUBRICS ───────────────────────────────────────────────
CREATE POLICY "rubrics_select"
    ON public.rubrics FOR SELECT TO authenticated
    USING (teacher_id = (select auth.uid()));

CREATE POLICY "rubrics_insert"
    ON public.rubrics FOR INSERT TO authenticated
    WITH CHECK (teacher_id = (select auth.uid()));

CREATE POLICY "rubrics_update"
    ON public.rubrics FOR UPDATE TO authenticated
    USING (teacher_id = (select auth.uid()));

CREATE POLICY "rubrics_delete"
    ON public.rubrics FOR DELETE TO authenticated
    USING (teacher_id = (select auth.uid()));

-- ── ASSIGNMENTS ───────────────────────────────────────────
-- ONE SELECT: teacher of classroom OR student member
CREATE POLICY "assignments_select"
    ON public.assignments FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.assignments.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
        OR EXISTS (
            SELECT 1 FROM public.classroom_members cm
            WHERE cm.classroom_id = public.assignments.classroom_id
              AND cm.user_id = (select auth.uid())
        )
    );

CREATE POLICY "assignments_insert"
    ON public.assignments FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.assignments.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "assignments_update"
    ON public.assignments FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.assignments.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "assignments_delete"
    ON public.assignments FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = public.assignments.classroom_id
              AND c.teacher_id = (select auth.uid())
        )
    );

-- ── SUBMISSIONS ───────────────────────────────────────────
-- ONE SELECT: student owns it OR teacher of the assignment's classroom
CREATE POLICY "submissions_select"
    ON public.submissions FOR SELECT TO authenticated
    USING (
        student_id = (select auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON c.id = a.classroom_id
            WHERE a.id = public.submissions.assignment_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "submissions_insert"
    ON public.submissions FOR INSERT TO authenticated
    WITH CHECK (
        student_id = (select auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON c.id = a.classroom_id
            WHERE a.id = public.submissions.assignment_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "submissions_update"
    ON public.submissions FOR UPDATE TO authenticated
    USING (
        student_id = (select auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON c.id = a.classroom_id
            WHERE a.id = public.submissions.assignment_id
              AND c.teacher_id = (select auth.uid())
        )
    );

CREATE POLICY "submissions_delete"
    ON public.submissions FOR DELETE TO authenticated
    USING (student_id = (select auth.uid()));

-- ── BOUNTIES ──────────────────────────────────────────────
-- ONE SELECT: parent owns it OR kid's parent matches OR kid claimed it
CREATE POLICY "bounties_select"
    ON public.bounties FOR SELECT TO authenticated
    USING (
        parent_id = (select auth.uid())
        OR parent_id = (select public.get_my_parent_id())
        OR claimed_by = (select auth.uid())
    );

CREATE POLICY "bounties_insert"
    ON public.bounties FOR INSERT TO authenticated
    WITH CHECK (parent_id = (select auth.uid()));

-- ONE UPDATE: parent owns it OR kid claimed it
CREATE POLICY "bounties_update"
    ON public.bounties FOR UPDATE TO authenticated
    USING (
        parent_id = (select auth.uid())
        OR claimed_by = (select auth.uid())
    );

CREATE POLICY "bounties_delete"
    ON public.bounties FOR DELETE TO authenticated
    USING (parent_id = (select auth.uid()));

-- ── SECURITY EVENTS ───────────────────────────────────────
-- Service role only for all operations
CREATE POLICY "security_events_all"
    ON public.security_events FOR ALL
    USING ((select auth.role()) = 'service_role');

-- ── MODERATED CONTENT ─────────────────────────────────────
-- ONE SELECT: own content OR service role
CREATE POLICY "moderated_content_select"
    ON public.moderated_content FOR SELECT TO authenticated
    USING (user_id = (select auth.uid()));

CREATE POLICY "moderated_content_all_service"
    ON public.moderated_content FOR ALL
    USING ((select auth.role()) = 'service_role');

-- ── MODERATION WHITELIST ──────────────────────────────────
-- Authenticated can read; service role manages all
CREATE POLICY "moderation_whitelist_select"
    ON public.moderation_whitelist FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "moderation_whitelist_all_service"
    ON public.moderation_whitelist FOR ALL
    USING ((select auth.role()) = 'service_role');

-- ── MODERATION BLACKLIST ──────────────────────────────────
CREATE POLICY "moderation_blacklist_select"
    ON public.moderation_blacklist FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "moderation_blacklist_all_service"
    ON public.moderation_blacklist FOR ALL
    USING ((select auth.role()) = 'service_role');

-- ── PARENTAL GATE ─────────────────────────────────────────
CREATE POLICY "parental_gate_select"
    ON public.parental_gate FOR SELECT TO authenticated
    USING (user_id = (select auth.uid()));

CREATE POLICY "parental_gate_insert"
    ON public.parental_gate FOR INSERT TO authenticated
    WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "parental_gate_update"
    ON public.parental_gate FOR UPDATE TO authenticated
    USING (user_id = (select auth.uid()));

CREATE POLICY "parental_gate_delete"
    ON public.parental_gate FOR DELETE TO authenticated
    USING (user_id = (select auth.uid()));

-- ── ACCOUNT DELETION ──────────────────────────────────────
CREATE POLICY "account_deletion_select"
    ON public.account_deletion FOR SELECT TO authenticated
    USING (user_id = (select auth.uid()));

CREATE POLICY "account_deletion_insert"
    ON public.account_deletion FOR INSERT TO authenticated
    WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "account_deletion_update"
    ON public.account_deletion FOR UPDATE TO authenticated
    USING (user_id = (select auth.uid()));

CREATE POLICY "account_deletion_delete"
    ON public.account_deletion FOR DELETE TO authenticated
    USING (user_id = (select auth.uid()));

-- ── WEBHOOK EVENTS ────────────────────────────────────────
CREATE POLICY "webhook_events_all_service"
    ON public.webhook_events FOR ALL
    USING ((select auth.role()) = 'service_role');

-- ── FRIENDS ───────────────────────────────────────────────
-- ONE policy per action to avoid "multiple permissive" warning
CREATE POLICY "friends_select"
    ON public.friends FOR SELECT TO authenticated
    USING (user_id = (select auth.uid()) OR friend_id = (select auth.uid()));

CREATE POLICY "friends_insert"
    ON public.friends FOR INSERT TO authenticated
    WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "friends_update"
    ON public.friends FOR UPDATE TO authenticated
    USING (user_id = (select auth.uid()) OR friend_id = (select auth.uid()));

CREATE POLICY "friends_delete"
    ON public.friends FOR DELETE TO authenticated
    USING (user_id = (select auth.uid()) OR friend_id = (select auth.uid()));

-- ============================================================
-- STEP 3: FIX get_profile_by_invite_code (drop + recreate)
-- ============================================================

DROP FUNCTION IF EXISTS public.get_profile_by_invite_code(text);

CREATE FUNCTION public.get_profile_by_invite_code(code TEXT)
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
-- END OF NUCLEAR RLS CLEANUP
-- ============================================================
