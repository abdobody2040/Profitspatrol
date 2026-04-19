-- ============================================
-- NUCLEAR RESET - FORCE DROP EVERYTHING
-- ============================================
-- This uses CASCADE to force drop all dependencies
-- Run this ONCE, then run MASTER_SCHEMA_CLEAN.sql
-- ============================================

-- Drop all tables with CASCADE (this will drop all dependent objects)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.classrooms CASCADE;
DROP TABLE IF EXISTS public.classroom_members CASCADE;
DROP TABLE IF EXISTS public.student_groups CASCADE;
DROP TABLE IF EXISTS public.rubrics CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.bounties CASCADE;
DROP TABLE IF EXISTS public.friends CASCADE;
DROP TABLE IF EXISTS public.security_events CASCADE;
DROP TABLE IF EXISTS public.moderated_content CASCADE;
DROP TABLE IF EXISTS public.moderation_whitelist CASCADE;
DROP TABLE IF EXISTS public.moderation_blacklist CASCADE;
DROP TABLE IF EXISTS public.parental_gate CASCADE;
DROP TABLE IF EXISTS public.account_deletion CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_my_parent_id() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_subscription_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

-- Verify everything is gone
SELECT 'Tables remaining:' as status, count(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT 'Functions remaining:' as status, count(*) as count
FROM information_schema.routines
WHERE routine_schema = 'public';
