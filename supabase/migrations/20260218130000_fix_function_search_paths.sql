-- Fix Security Lint: "Function Search Path Mutable"
-- These functions flagged by linter need explicit search_path set to 'public' to prevent search_path hijacking.

-- 1. Fix public.get_profile_by_invite_code
ALTER FUNCTION public.get_profile_by_invite_code(text) SET search_path = public;

-- 2. Fix public.test_handle_new_user_execution (if it exists in the DB from repro scripts)
-- We wrap in a DO block to avoid error if the function doesn't exist (e.g. production env)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'test_handle_new_user_execution') THEN
        ALTER FUNCTION public.test_handle_new_user_execution() SET search_path = public;
    END IF;
END
$$;
