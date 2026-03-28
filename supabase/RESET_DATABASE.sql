-- ============================================
-- COMPLETE DATABASE RESET AND SCHEMA DEPLOYMENT
-- ============================================
-- WARNING: This will DELETE ALL existing data!
-- Only run this if you're okay with losing all current data
-- ============================================

-- Step 1: Drop all existing policies (to avoid dependency issues)
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

-- Step 2: Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_classrooms_updated_at ON public.classrooms;
DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;

-- Step 3: Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_my_parent_id();
DROP FUNCTION IF EXISTS public.get_user_subscription_status(UUID);
DROP FUNCTION IF EXISTS public.update_updated_at();

-- Step 4: Drop all tables (in reverse dependency order)
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

-- Step 5: Verify all tables are dropped
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- NOW RUN YOUR MASTER_SCHEMA.SQL
-- ============================================
