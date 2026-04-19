-- ============================================
-- PROFITS PATROL - COMPREHENSIVE FIX SCRIPT
-- ============================================
-- Version: Final Comprehensive (Strict One-Policy-Per-Action + ALL Tables)
-- 1. Login Fix: Updates handle_new_user for 'name' column
-- 2. Performance: Uses (select auth.uid()) to avoid row-by-row re-evaluation
-- 3. Warnings: Eliminates "Multiple Permissive Policies" by consolidating logic
-- 4. Coverage: Includes policies for every table (books, games, cms_content, etc.)

-- ============================================
-- 1. FIX LOGIN TRIGGER (handle_new_user)
-- ============================================

DO $$
BEGIN
    -- Ensure 'name' column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles RENAME COLUMN full_name TO name;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id, email, username, name, role, created_at, updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'kid')::text,
        NOW(),
        NOW()
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 2. FIX RLS POLICIES (One Policy Per Action)
-- ============================================

-- Drop existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Enable RLS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END $$;

-- --------------------------------------------
-- PROFILES
-- --------------------------------------------

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (
    id = (select auth.uid()) OR 
    parent_id = (select auth.uid()) OR 
    id = (select parent_id from public.profiles where id = (select auth.uid()))
);

CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (
    id = (select auth.uid())
);

CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (
    id = (select auth.uid()) OR 
    parent_id = (select auth.uid())
);

-- --------------------------------------------
-- CLASSROOMS
-- --------------------------------------------

CREATE POLICY "classrooms_select" ON public.classrooms FOR SELECT TO authenticated USING (
    teacher_id = (select auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.classroom_members cm WHERE cm.classroom_id = id AND cm.user_id = (select auth.uid()))
);

CREATE POLICY "classrooms_insert" ON public.classrooms FOR INSERT TO authenticated WITH CHECK (
    teacher_id = (select auth.uid())
);

CREATE POLICY "classrooms_update" ON public.classrooms FOR UPDATE TO authenticated USING (
    teacher_id = (select auth.uid())
);

CREATE POLICY "classrooms_delete" ON public.classrooms FOR DELETE TO authenticated USING (
    teacher_id = (select auth.uid())
);

-- --------------------------------------------
-- CLASSROOM_MEMBERS
-- --------------------------------------------

CREATE POLICY "classroom_members_select" ON public.classroom_members FOR SELECT TO authenticated USING (
    user_id = (select auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "classroom_members_insert" ON public.classroom_members FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "classroom_members_delete" ON public.classroom_members FOR DELETE TO authenticated USING (
    user_id = (select auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

-- --------------------------------------------
-- STUDENT_GROUPS
-- --------------------------------------------

CREATE POLICY "student_groups_select" ON public.student_groups FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.classroom_members cm WHERE cm.classroom_id = classroom_id AND cm.user_id = (select auth.uid()))
);

CREATE POLICY "student_groups_insert" ON public.student_groups FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "student_groups_update" ON public.student_groups FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "student_groups_delete" ON public.student_groups FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

-- --------------------------------------------
-- RUBRICS
-- --------------------------------------------

CREATE POLICY "rubrics_select" ON public.rubrics FOR SELECT TO authenticated USING (
    teacher_id = (select auth.uid()) OR
    -- Students view via assignment check? Or just allow authenticated read?
    -- Safest is explicit teacher check + general student check if needed.
    -- For simplicity, let's assume teacher manages and students view if assigned.
    -- Or simply allow authenticated users to view rubrics (low risk).
    -- But let's mirror ownership.
    teacher_id = (select auth.uid()) OR
    EXISTS ( -- Student in a classroom owned by this teacher
         SELECT 1 FROM public.classroom_members cm
         JOIN public.classrooms c ON c.id = cm.classroom_id
         WHERE c.teacher_id = rubrics.teacher_id AND cm.user_id = (select auth.uid())
    )
);

CREATE POLICY "rubrics_insert" ON public.rubrics FOR INSERT TO authenticated WITH CHECK (
    teacher_id = (select auth.uid())
);

CREATE POLICY "rubrics_update" ON public.rubrics FOR UPDATE TO authenticated USING (
    teacher_id = (select auth.uid())
);

CREATE POLICY "rubrics_delete" ON public.rubrics FOR DELETE TO authenticated USING (
    teacher_id = (select auth.uid())
);


-- --------------------------------------------
-- ASSIGNMENTS
-- --------------------------------------------

CREATE POLICY "assignments_select" ON public.assignments FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid())) OR
    EXISTS (SELECT 1 FROM public.classroom_members cm WHERE cm.classroom_id = classroom_id AND cm.user_id = (select auth.uid()))
);

CREATE POLICY "assignments_insert" ON public.assignments FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "assignments_update" ON public.assignments FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "assignments_delete" ON public.assignments FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

-- --------------------------------------------
-- SUBMISSIONS
-- --------------------------------------------

CREATE POLICY "submissions_select" ON public.submissions FOR SELECT TO authenticated USING (
    student_id = (select auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.assignments a JOIN public.classrooms c ON c.id = a.classroom_id WHERE a.id = assignment_id AND c.teacher_id = (select auth.uid()))
);

CREATE POLICY "submissions_insert" ON public.submissions FOR INSERT TO authenticated WITH CHECK (
    student_id = (select auth.uid())
);

CREATE POLICY "submissions_update" ON public.submissions FOR UPDATE TO authenticated USING (
    student_id = (select auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.assignments a JOIN public.classrooms c ON c.id = a.classroom_id WHERE a.id = assignment_id AND c.teacher_id = (select auth.uid()))
);

-- --------------------------------------------
-- BOUNTIES
-- --------------------------------------------

CREATE POLICY "bounties_select" ON public.bounties FOR SELECT TO authenticated USING (
    parent_id = (select auth.uid()) OR 
    claimed_by = (select auth.uid()) OR 
    parent_id = (select parent_id from public.profiles where id = (select auth.uid()))
);

CREATE POLICY "bounties_insert" ON public.bounties FOR INSERT TO authenticated WITH CHECK (
    parent_id = (select auth.uid())
);

CREATE POLICY "bounties_update" ON public.bounties FOR UPDATE TO authenticated USING (
    parent_id = (select auth.uid()) OR 
    claimed_by = (select auth.uid())
);

CREATE POLICY "bounties_delete" ON public.bounties FOR DELETE TO authenticated USING (
    parent_id = (select auth.uid())
);

-- --------------------------------------------
-- MODERATED CONTENT
-- --------------------------------------------

CREATE POLICY "moderated_content_select" ON public.moderated_content FOR SELECT TO authenticated USING (
    user_id = (select auth.uid())
);

CREATE POLICY "moderated_content_service_role" ON public.moderated_content FOR ALL TO service_role USING (true) WITH CHECK (true);

-- --------------------------------------------
-- CONTENT TABLES (Books, Games, CMS)
-- --------------------------------------------

-- Books: Usually read-only for users, managed by admin/service
CREATE POLICY "books_select" ON public.books FOR SELECT TO authenticated USING (true);
CREATE POLICY "books_service_role" ON public.books FOR ALL TO service_role USING (true) WITH CHECK (true);
-- If Users can create/edit books? Assuming Admin/Service only for now. If admins exist:
-- CREATE POLICY "books_admin_all" ON public.books FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Games: Same logic
CREATE POLICY "games_select" ON public.games FOR SELECT TO authenticated USING (true);
CREATE POLICY "games_service_role" ON public.games FOR ALL TO service_role USING (true) WITH CHECK (true);

-- CMS Content: Same logic
CREATE POLICY "cms_content_select" ON public.cms_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "cms_content_service_role" ON public.cms_content FOR ALL TO service_role USING (true) WITH CHECK (true);


-- --------------------------------------------
-- REMAINING TABLES (Service Role / Simple User Access)
-- --------------------------------------------

-- generic service role policies
CREATE POLICY "security_events_service_role" ON public.security_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "webhook_events_service_role" ON public.webhook_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "parental_gate_service_role" ON public.parental_gate FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "account_deletion_service_role" ON public.account_deletion FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "account_deletion_log_service_role" ON public.account_deletion_log FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "moderation_blacklist_service_role" ON public.moderation_blacklist FOR ALL TO service_role USING (true) WITH CHECK (true);

-- user access policies
CREATE POLICY "security_events_select" ON public.security_events FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classroom_members cm WHERE cm.user_id = user_id AND cm.classroom_id IN (SELECT id FROM public.classrooms WHERE teacher_id = (select auth.uid())))
);

CREATE POLICY "parental_gate_select" ON public.parental_gate FOR SELECT TO authenticated USING (
    user_id = (select auth.uid())
);

CREATE POLICY "account_deletion_select" ON public.account_deletion FOR SELECT TO authenticated USING (
    user_id = (select auth.uid())
);

CREATE POLICY "account_deletion_insert" ON public.account_deletion FOR INSERT TO authenticated WITH CHECK (
    user_id = (select auth.uid())
);

CREATE POLICY "friends_all" ON public.friends FOR ALL TO authenticated USING (
    user_id = (select auth.uid()) OR friend_id = (select auth.uid())
);

CREATE POLICY "moderation_whitelist_select" ON public.moderation_whitelist FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);
CREATE POLICY "moderation_whitelist_insert" ON public.moderation_whitelist FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);
CREATE POLICY "moderation_whitelist_update" ON public.moderation_whitelist FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);
CREATE POLICY "moderation_whitelist_delete" ON public.moderation_whitelist FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.classrooms c WHERE c.id = classroom_id AND c.teacher_id = (select auth.uid()))
);

-- ============================================
-- END OF FIX SCRIPT
-- ============================================
