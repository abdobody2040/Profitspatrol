-- ============================================
-- PROFITS PATROL - MASTER DATABASE SCHEMA
-- ============================================
-- Version: 2.0
-- Created: 2026-02-14
-- Purpose: Comprehensive schema for all application features
-- Features: Auth, Profiles, Family Linking, Education, Games, Subscriptions, Security

-- ============================================
-- 1. CORE TABLES
-- ============================================

-- Profiles Table (Main User Data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Info
    email TEXT UNIQUE,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL CHECK (role IN ('kid', 'parent', 'teacher', 'admin')) DEFAULT 'kid',
    age INTEGER,
    
    -- Family Linking
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    invite_code TEXT UNIQUE,
    
    -- Progression
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    biz_coins INTEGER DEFAULT 100,
    streak INTEGER DEFAULT 1,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    
    -- Education
    current_module_id TEXT DEFAULT 'mod_1',
    completed_lesson_ids TEXT[] DEFAULT '{}',
    read_book_ids TEXT[] DEFAULT '{}',
    completed_book_tasks JSONB DEFAULT '[]',
    book_task_streak INTEGER DEFAULT 0,
    last_book_task_date DATE,
    badges TEXT[] DEFAULT ARRAY['Newbie'],
    
    -- Inventory & Customization
    inventory TEXT[] DEFAULT '{}',
    equipped_items TEXT[] DEFAULT '{}',
    placed_items JSONB DEFAULT '[]',
    business_logo JSONB,
    hq_level TEXT DEFAULT 'hq_garage',
    hq_theme TEXT DEFAULT 'blue',
    unlocked_skills TEXT[] DEFAULT '{}',
    
    -- Portfolio & Assets
    portfolio JSONB DEFAULT '[]',
    properties JSONB DEFAULT '[]',
    
    -- Subscription & Energy
    subscription_status TEXT DEFAULT 'FREE' CHECK (subscription_status IN ('FREE', 'PREMIUM')),
    subscription_tier TEXT DEFAULT 'intern' CHECK (subscription_tier IN ('intern', 'founder', 'board_member', 'tycoon', 'classroom')),
    billing_cycle TEXT CHECK (billing_cycle IN ('MONTHLY', 'YEARLY')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    energy INTEGER DEFAULT 5 CHECK (energy >= 0 AND energy <= 5),
    last_energy_refill BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
    
    -- Settings
    settings JSONB DEFAULT '{
        "soundEnabled": true,
        "musicEnabled": true,
        "darkMode": false,
        "language": "en",
        "notifications": true
    }',
    
    -- Security & Compliance
    parental_gate_attempts INTEGER DEFAULT 0,
    parental_gate_locked_until TIMESTAMP,
    parental_gate_passed_at TIMESTAMP,
    deletion_requested_at TIMESTAMP,
    deletion_scheduled_for TIMESTAMP,
    deletion_cancelled_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Classrooms Table
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    locked_modules TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Classroom Members (Junction Table)
CREATE TABLE IF NOT EXISTS public.classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')) DEFAULT 'student',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(classroom_id, user_id)
);

-- Student Groups
CREATE TABLE IF NOT EXISTS public.student_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    student_ids UUID[] DEFAULT ARRAY[]::UUID[],
    color TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rubrics
CREATE TABLE IF NOT EXISTS public.rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    criteria JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    student_group_id UUID REFERENCES public.student_groups(id) ON DELETE SET NULL,
    specific_student_ids UUID[] DEFAULT ARRAY[]::UUID[],
    scheduled_at TIMESTAMP,
    due_date TIMESTAMP,
    rubric_id UUID REFERENCES public.rubrics(id) ON DELETE SET NULL,
    max_points INTEGER DEFAULT 100,
    resource_url TEXT,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'GRADED', 'LATE')),
    grade NUMERIC,
    feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- ============================================
-- 2. FAMILY FEATURES
-- ============================================

-- Family Bounties (Chores/Tasks)
CREATE TABLE IF NOT EXISTS public.bounties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reward INTEGER NOT NULL CHECK (reward > 0),
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLAIMED', 'IN_PROGRESS', 'PENDING_APPROVAL', 'COMPLETED', 'CANCELLED')),
    claimed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    claimed_at TIMESTAMP,
    completed_at TIMESTAMP,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. SECURITY & MODERATION
-- ============================================

-- Security Events
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('prompt_injection', 'suspicious_activity', 'unauthorized_access', 'data_breach')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Moderated Content
CREATE TABLE IF NOT EXISTS public.moderated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('chat', 'project', 'comment', 'profile')),
    original_content TEXT NOT NULL,
    sanitized_content TEXT,
    flags TEXT[] DEFAULT '{}',
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    action_taken TEXT CHECK (action_taken IN ('approved', 'rejected', 'edited')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Moderation Whitelist
CREATE TABLE IF NOT EXISTS public.moderation_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern TEXT NOT NULL UNIQUE,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('keyword', 'regex')),
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Moderation Blacklist
CREATE TABLE IF NOT EXISTS public.moderation_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern TEXT NOT NULL UNIQUE,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('keyword', 'regex')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. COMPLIANCE & AUDIT
-- ============================================

-- Parental Gate Attempts
CREATE TABLE IF NOT EXISTS public.parental_gate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    attempt_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP,
    locked_until TIMESTAMP,
    passed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Account Deletion Requests
CREATE TABLE IF NOT EXISTS public.account_deletion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_at TIMESTAMP DEFAULT NOW(),
    scheduled_for TIMESTAMP NOT NULL,
    cancelled_at TIMESTAMP,
    completed_at TIMESTAMP,
    reason TEXT,
    UNIQUE(user_id)
);

-- ============================================
-- 5. PAYMENTS & WEBHOOKS
-- ============================================

-- Webhook Events (Stripe)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    error TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. SOCIAL FEATURES
-- ============================================

-- Friends
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'BLOCKED')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- ============================================
-- 7. FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        username,
        name,
        role
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'kid')::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function to get parent ID (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_my_parent_id()
RETURNS UUID
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT parent_id FROM profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql STABLE;

-- Get subscription status (with family inheritance)
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_uuid UUID)
RETURNS TABLE (priority_tier TEXT, priority_status TEXT) 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    my_role TEXT;
    my_parent UUID;
    parent_tier TEXT;
    parent_status TEXT;
    my_tier TEXT;
    my_status TEXT;
BEGIN
    SELECT role, parent_id, subscription_tier, subscription_status 
    INTO my_role, my_parent, my_tier, my_status 
    FROM profiles WHERE id = user_uuid;
    
    IF my_role = 'kid' AND my_parent IS NOT NULL THEN
        SELECT subscription_tier, subscription_status 
        INTO parent_tier, parent_status 
        FROM profiles WHERE id = my_parent;
        
        RETURN QUERY SELECT parent_tier, parent_status;
    ELSE
        RETURN QUERY SELECT my_tier, my_status;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps
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

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_gate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES (consolidated - no duplicate permissive policies)
-- ============================================================

-- Drop ALL known legacy policy names
DROP POLICY IF EXISTS "Users can view own profile"             ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"           ON public.profiles;
DROP POLICY IF EXISTS "Parents can view linked children"       ON public.profiles;
DROP POLICY IF EXISTS "Parents can update linked children"     ON public.profiles;
DROP POLICY IF EXISTS "Kids can view their parent"             ON public.profiles;
DROP POLICY IF EXISTS "profiles_select"                        ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert"                        ON public.profiles;
DROP POLICY IF EXISTS "profiles_update"                        ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation"                 ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own invite_code" ON public.profiles;

-- ONE SELECT policy (prevents multiple permissive policy warning)
CREATE POLICY "profiles_select"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        id = (select auth.uid())
        OR parent_id = (select auth.uid())
        OR id = (select public.get_my_parent_id())
    );

-- ONE INSERT policy
CREATE POLICY "profiles_insert"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = (select auth.uid()));

-- ONE UPDATE policy (own + parent's children)
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

-- CLASSROOMS POLICIES
DROP POLICY IF EXISTS "Teachers can manage own classrooms" ON public.classrooms;
CREATE POLICY "Teachers can manage own classrooms"
    ON public.classrooms FOR ALL
    TO authenticated
    USING (teacher_id = (select auth.uid()));

DROP POLICY IF EXISTS "Students can view their classrooms" ON public.classrooms;
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

-- CLASSROOM MEMBERS POLICIES
DROP POLICY IF EXISTS "Teachers can manage classroom members" ON public.classroom_members;
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

DROP POLICY IF EXISTS "Students can view own membership" ON public.classroom_members;
CREATE POLICY "Students can view own membership"
    ON public.classroom_members FOR SELECT
    TO authenticated
    USING (user_id = (select auth.uid()));

-- STUDENT GROUPS POLICIES
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

-- RUBRICS POLICIES
DROP POLICY IF EXISTS "Teachers can manage own rubrics" ON public.rubrics;
CREATE POLICY "Teachers can manage own rubrics"
    ON public.rubrics FOR ALL
    TO authenticated
    USING (teacher_id = (select auth.uid()));

-- ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Teachers can manage assignments" ON public.assignments;
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

DROP POLICY IF EXISTS "Students can view classroom assignments" ON public.assignments;
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

-- SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Students can manage own submissions" ON public.submissions;
CREATE POLICY "Students can manage own submissions"
    ON public.submissions FOR ALL
    TO authenticated
    USING (student_id = (select auth.uid()));

DROP POLICY IF EXISTS "Teachers can view and grade submissions" ON public.submissions;
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

-- BOUNTIES POLICIES
DROP POLICY IF EXISTS "Parents can manage their bounties" ON public.bounties;
CREATE POLICY "Parents can manage their bounties"
    ON public.bounties FOR ALL
    TO authenticated
    USING (parent_id = (select auth.uid()));

DROP POLICY IF EXISTS "Kids can view and claim bounties" ON public.bounties;
CREATE POLICY "Kids can view and claim bounties"
    ON public.bounties FOR SELECT
    TO authenticated
    USING (
        parent_id = (select public.get_my_parent_id())
        OR claimed_by = (select auth.uid())
    );

DROP POLICY IF EXISTS "Kids can update claimed bounties" ON public.bounties;
CREATE POLICY "Kids can update claimed bounties"
    ON public.bounties FOR UPDATE
    TO authenticated
    USING (claimed_by = (select auth.uid()));

-- SECURITY & MODERATION POLICIES
DROP POLICY IF EXISTS "Service role can manage security events" ON public.security_events;
CREATE POLICY "Service role can manage security events"
    ON public.security_events FOR ALL
    USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Users can view own moderated content" ON public.moderated_content;
CREATE POLICY "Users can view own moderated content"
    ON public.moderated_content FOR SELECT
    TO authenticated
    USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Service role can manage moderated content" ON public.moderated_content;
CREATE POLICY "Service role can manage moderated content"
    ON public.moderated_content FOR ALL
    USING ((select auth.role()) = 'service_role');

-- FRIENDS POLICIES
DROP POLICY IF EXISTS "Users can manage own friendships" ON public.friends;
CREATE POLICY "Users can manage own friendships"
    ON public.friends FOR ALL
    TO authenticated
    USING (
        user_id = (select auth.uid())
        OR friend_id = (select auth.uid())
    );

-- ============================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON public.profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON public.profiles(invite_code);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_classroom_members_user_id ON public.classroom_members(user_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_classroom_id ON public.classroom_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_lookup ON public.classroom_members(classroom_id, user_id);

CREATE INDEX IF NOT EXISTS idx_assignments_classroom_id ON public.assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_lookup ON public.submissions(assignment_id, student_id);

CREATE INDEX IF NOT EXISTS idx_bounties_parent_id ON public.bounties(parent_id);
CREATE INDEX IF NOT EXISTS idx_bounties_claimed_by ON public.bounties(claimed_by);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON public.bounties(status);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_moderated_content_user_id ON public.moderated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);

CREATE INDEX IF NOT EXISTS idx_friends_user_id ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON public.friends(friend_id);

-- ============================================
-- 11. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.profiles IS 'Main user profiles with progression, inventory, and family linking';
COMMENT ON TABLE public.classrooms IS 'Teacher-managed classrooms for education features';
COMMENT ON TABLE public.bounties IS 'Parent-created chores/tasks for kids with BizCoin rewards';
COMMENT ON TABLE public.security_events IS 'Security monitoring and audit trail';
COMMENT ON TABLE public.moderated_content IS 'Content moderation queue for admin review';

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile when user signs up';
COMMENT ON FUNCTION public.get_my_parent_id() IS 'Helper to prevent RLS recursion when checking parent relationship';
COMMENT ON FUNCTION public.get_user_subscription_status(UUID) IS 'Returns subscription with family inheritance logic';

-- ============================================
-- END OF SCHEMA
-- ============================================
