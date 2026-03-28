-- ============================================
-- FIX DUPLICATE POLICY WARNINGS
-- This separates SELECT from INSERT/UPDATE/DELETE
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ============================================
-- PROFILES TABLE
-- ============================================

CREATE POLICY "profiles_select"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "profiles_update"
ON public.profiles FOR UPDATE
USING ((SELECT auth.uid()) = id);

-- ============================================
-- CLASSROOMS TABLE
-- Separate SELECT from INSERT/UPDATE/DELETE
-- ============================================

CREATE POLICY "classrooms_select"
ON public.classrooms FOR SELECT
USING (
  (SELECT auth.uid()) = teacher_id OR
  student_ids @> to_jsonb((SELECT auth.uid())::text)
);

CREATE POLICY "classrooms_insert"
ON public.classrooms FOR INSERT
WITH CHECK ((SELECT auth.uid()) = teacher_id);

CREATE POLICY "classrooms_update"
ON public.classrooms FOR UPDATE
USING ((SELECT auth.uid()) = teacher_id);

CREATE POLICY "classrooms_delete"
ON public.classrooms FOR DELETE
USING ((SELECT auth.uid()) = teacher_id);

-- ============================================
-- ASSIGNMENTS TABLE
-- Separate SELECT from INSERT/UPDATE/DELETE
-- ============================================

CREATE POLICY "assignments_select"
ON public.assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = assignments.class_id
    AND (
      teacher_id = (SELECT auth.uid()) OR
      student_ids @> to_jsonb((SELECT auth.uid())::text)
    )
  )
);

CREATE POLICY "assignments_insert"
ON public.assignments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = assignments.class_id
    AND teacher_id = (SELECT auth.uid())
  )
);

CREATE POLICY "assignments_update"
ON public.assignments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = assignments.class_id
    AND teacher_id = (SELECT auth.uid())
  )
);

CREATE POLICY "assignments_delete"
ON public.assignments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = assignments.class_id
    AND teacher_id = (SELECT auth.uid())
  )
);

-- ============================================
-- SUBMISSIONS TABLE
-- ============================================

CREATE POLICY "submissions_select"
ON public.submissions FOR SELECT
USING (
  (SELECT auth.uid()) = student_id OR
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classrooms c ON c.id = a.class_id
    WHERE a.id::text = submissions.assignment_id
    AND c.teacher_id = (SELECT auth.uid())
  )
);

CREATE POLICY "submissions_insert"
ON public.submissions FOR INSERT
WITH CHECK ((SELECT auth.uid()) = student_id);

CREATE POLICY "submissions_update"
ON public.submissions FOR UPDATE
USING (
  (SELECT auth.uid()) = student_id OR
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classrooms c ON c.id = a.class_id
    WHERE a.id::text = submissions.assignment_id
    AND c.teacher_id = (SELECT auth.uid())
  )
);

CREATE POLICY "submissions_delete"
ON public.submissions FOR DELETE
USING ((SELECT auth.uid()) = student_id);

-- ============================================
-- BOOKS, GAMES, CMS_CONTENT
-- ============================================

CREATE POLICY "books_select"
ON public.books FOR SELECT
USING (true);

CREATE POLICY "games_select"
ON public.games FOR SELECT
USING (true);

CREATE POLICY "cms_content_select"
ON public.cms_content FOR SELECT
USING (true);

-- ============================================
-- SECURITY_EVENTS TABLE
-- ============================================

CREATE POLICY "security_events_insert"
ON public.security_events FOR INSERT
WITH CHECK ((SELECT auth.role()) = 'service_role');

CREATE POLICY "security_events_select"
ON public.security_events FOR SELECT
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- ACCOUNT_DELETION_LOG TABLE
-- ============================================

CREATE POLICY "account_deletion_log_all"
ON public.account_deletion_log FOR ALL
USING ((SELECT auth.role()) = 'service_role');

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    'Fixed duplicate policy warnings!' as status,
    COUNT(*) as total_policies,
    COUNT(DISTINCT tablename) as tables_with_policies
FROM pg_policies
WHERE schemaname = 'public';
