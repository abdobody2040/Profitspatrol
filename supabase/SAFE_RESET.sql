-- ============================================
-- COMPLETE DATABASE SETUP - ALL IN ONE
-- ============================================
-- This script does EVERYTHING in the correct order
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- STEP 1: Drop everything (ignore errors if things don't exist)
DO $$ 
BEGIN
    -- Drop policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Parents can view linked children" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Kids can view their parent" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Parents can update linked children" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage own classrooms" ON public.classrooms';
    EXECUTE 'DROP POLICY IF EXISTS "Students can view their classrooms" ON public.classrooms';
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage classroom members" ON public.classroom_members';
    EXECUTE 'DROP POLICY IF EXISTS "Students can view own membership" ON public.classroom_members';
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage student groups" ON public.student_groups';
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage own rubrics" ON public.rubrics';
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage assignments" ON public.assignments';
    EXECUTE 'DROP POLICY IF EXISTS "Students can view classroom assignments" ON public.assignments';
    EXECUTE 'DROP POLICY IF EXISTS "Students can manage own submissions" ON public.submissions';
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can view and grade submissions" ON public.submissions';
    EXECUTE 'DROP POLICY IF EXISTS "Parents can manage their bounties" ON public.bounties';
    EXECUTE 'DROP POLICY IF EXISTS "Kids can view and claim bounties" ON public.bounties';
    EXECUTE 'DROP POLICY IF EXISTS "Kids can update claimed bounties" ON public.bounties';
    EXECUTE 'DROP POLICY IF EXISTS "Service role can manage security events" ON public.security_events';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own moderated content" ON public.moderated_content';
    EXECUTE 'DROP POLICY IF EXISTS "Service role can manage moderated content" ON public.moderated_content';
    EXECUTE 'DROP POLICY IF EXISTS "Users can manage own friendships" ON public.friends';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Policies dropped or did not exist';
END $$;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_classrooms_updated_at ON public.classrooms;
DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_my_parent_id();
DROP FUNCTION IF EXISTS public.get_user_subscription_status(UUID);
DROP FUNCTION IF EXISTS public.update_updated_at();

-- Drop tables
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.rubrics CASCADE;
DROP TABLE IF EXISTS public.student_groups CASCADE;
DROP TABLE IF EXISTS public.classroom_members CASCADE;
DROP TABLE IF EXISTS public.classrooms CASCADE;
DROP TABLE IF EXISTS public.bounties CASCADE;
DROP TABLE IF EXISTS public.friends CASCADE;
DROP TABLE IF EXISTS public.security_events CASCADE;
DROP TABLE IF EXISTS public.moderated_content CASCADE;
DROP TABLE IF EXISTS public.moderation_whitelist CASCADE;
DROP TABLE IF EXISTS public.moderation_blacklist CASCADE;
DROP TABLE IF EXISTS public.parental_gate CASCADE;
DROP TABLE IF EXISTS public.account_deletion CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

RAISE NOTICE 'Database reset complete. Now paste and run your MASTER_SCHEMA.sql';
