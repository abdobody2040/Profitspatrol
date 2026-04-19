-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_gate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Teachers can view student profiles in their classrooms
CREATE POLICY "Teachers can view student profiles"
ON public.profiles
FOR SELECT
USING (
  role = 'teacher' AND
  EXISTS (
    SELECT 1 FROM public.classroom_members cm
    WHERE cm.user_id = auth.uid()
    AND cm.role = 'teacher'
  )
);

-- ============================================
-- CLASSROOMS TABLE POLICIES
-- ============================================

-- Teachers can view their own classrooms
CREATE POLICY "Teachers can view own classrooms"
ON public.classrooms
FOR SELECT
USING (teacher_id = auth.uid());

-- Teachers can create classrooms
CREATE POLICY "Teachers can create classrooms"
ON public.classrooms
FOR INSERT
WITH CHECK (teacher_id = auth.uid());

-- Teachers can update their own classrooms
CREATE POLICY "Teachers can update own classrooms"
ON public.classrooms
FOR UPDATE
USING (teacher_id = auth.uid());

-- Teachers can delete their own classrooms
CREATE POLICY "Teachers can delete own classrooms"
ON public.classrooms
FOR DELETE
USING (teacher_id = auth.uid());

-- Students can view classrooms they're members of
CREATE POLICY "Students can view their classrooms"
ON public.classrooms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm
    WHERE cm.classroom_id = id
    AND cm.user_id = auth.uid()
  )
);

-- ============================================
-- CLASSROOM_MEMBERS TABLE POLICIES
-- ============================================

-- Teachers can manage members in their classrooms
CREATE POLICY "Teachers can manage classroom members"
ON public.classroom_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms c
    WHERE c.id = classroom_id
    AND c.teacher_id = auth.uid()
  )
);

-- Students can view their own membership
CREATE POLICY "Students can view own membership"
ON public.classroom_members
FOR SELECT
USING (user_id = auth.uid());

-- ============================================
-- ASSIGNMENTS TABLE POLICIES
-- ============================================

-- Teachers can manage assignments in their classrooms
CREATE POLICY "Teachers can manage assignments"
ON public.assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms c
    WHERE c.id = classroom_id
    AND c.teacher_id = auth.uid()
  )
);

-- Students can view assignments in their classrooms
CREATE POLICY "Students can view classroom assignments"
ON public.assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm
    WHERE cm.classroom_id = classroom_id
    AND cm.user_id = auth.uid()
  )
);

-- ============================================
-- SUBMISSIONS TABLE POLICIES
-- ============================================

-- Students can create their own submissions
CREATE POLICY "Students can create submissions"
ON public.submissions
FOR INSERT
WITH CHECK (student_id = auth.uid());

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
ON public.submissions
FOR SELECT
USING (student_id = auth.uid());

-- Students can update their own submissions
CREATE POLICY "Students can update own submissions"
ON public.submissions
FOR UPDATE
USING (student_id = auth.uid());

-- Teachers can view submissions in their classrooms
CREATE POLICY "Teachers can view classroom submissions"
ON public.submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classrooms c ON c.id = a.classroom_id
    WHERE a.id = assignment_id
    AND c.teacher_id = auth.uid()
  )
);

-- Teachers can update submissions (for grading)
CREATE POLICY "Teachers can grade submissions"
ON public.submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classrooms c ON c.id = a.classroom_id
    WHERE a.id = assignment_id
    AND c.teacher_id = auth.uid()
  )
);

-- ============================================
-- SECURITY_EVENTS TABLE POLICIES
-- ============================================

-- Only service role can insert security events
CREATE POLICY "Service role can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Teachers can view security events for their students
CREATE POLICY "Teachers can view student security events"
ON public.security_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_members cm
    WHERE cm.user_id = user_id
    AND cm.classroom_id IN (
      SELECT id FROM public.classrooms WHERE teacher_id = auth.uid()
    )
  )
);

-- ============================================
-- MODERATED_CONTENT TABLE POLICIES
-- ============================================

-- Users can view their own moderated content
CREATE POLICY "Users can view own moderated content"
ON public.moderated_content
FOR SELECT
USING (user_id = auth.uid());

-- Service role can manage moderated content
CREATE POLICY "Service role can manage moderated content"
ON public.moderated_content
FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- MODERATION_WHITELIST TABLE POLICIES
-- ============================================

-- Teachers can manage whitelist for their classrooms
CREATE POLICY "Teachers can manage whitelist"
ON public.moderation_whitelist
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms c
    WHERE c.id = classroom_id
    AND c.teacher_id = auth.uid()
  )
);

-- ============================================
-- PARENTAL_GATE TABLE POLICIES
-- ============================================

-- Users can view their own parental gate attempts
CREATE POLICY "Users can view own parental gate"
ON public.parental_gate
FOR SELECT
USING (user_id = auth.uid());

-- Service role can manage parental gate
CREATE POLICY "Service role can manage parental gate"
ON public.parental_gate
FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- ACCOUNT_DELETION TABLE POLICIES
-- ============================================

-- Users can create their own deletion requests
CREATE POLICY "Users can request account deletion"
ON public.account_deletion
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can view their own deletion requests
CREATE POLICY "Users can view own deletion requests"
ON public.account_deletion
FOR SELECT
USING (user_id = auth.uid());

-- Service role can manage deletion requests
CREATE POLICY "Service role can manage deletions"
ON public.account_deletion
FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- WEBHOOK_EVENTS TABLE POLICIES
-- ============================================

-- Only service role can manage webhook events
CREATE POLICY "Service role can manage webhook events"
ON public.webhook_events
FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- PERFORMANCE OPTIMIZATIONS
-- ============================================

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_classroom_members_user_id ON public.classroom_members(user_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_classroom_id ON public.classroom_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignments_classroom_id ON public.assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_moderated_content_user_id ON public.moderated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_classroom_members_lookup 
ON public.classroom_members(classroom_id, user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_lookup 
ON public.submissions(assignment_id, student_id);
