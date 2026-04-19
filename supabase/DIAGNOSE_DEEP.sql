-- ============================================
-- PROFITS PATROL - DEEP DIAGNOSTIC (Auth & System)
-- ============================================

-- 1. Check Triggers on OTHER Auth Tables
-- Login writes to auth.sessions and auth.refresh_tokens. 
-- If these have broken triggers, login fails.
SELECT 
    event_object_schema as schema,
    event_object_table as table,
    trigger_name
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table IN ('sessions', 'refresh_tokens', 'identities');

-- 2. Check Triggers on Public Tables that might cascade
SELECT 
    event_object_schema as schema,
    event_object_table as table,
    trigger_name
FROM information_schema.triggers
WHERE event_object_schema = 'public';

-- 3. Check for the Test User's Profile specifically
-- We want to see if the profile exists and looks correct.
SELECT * FROM public.profiles WHERE email = 'teacher_test@profits.com';

-- 4. Check Auth User status
SELECT id, email, last_sign_in_at, confirmed_at 
FROM auth.users 
WHERE email = 'teacher_test@profits.com';

-- 5. SIMULATE HANDLE_NEW_USER (for debugging)
-- We will try to run the function manually with dummy data to see if it crashes.
DO $$
DECLARE
    dummy_user jsonb;
BEGIN
    -- Mock the NEW row that the trigger would receive
    -- Note: We can't actually invoke the trigger function directly easily without a table event,
    -- but we can test the INSERT logic it contains.
    
    INSERT INTO public.profiles (id, email, username, name, role)
    VALUES (
        gen_random_uuid(), 
        'simulation_test@profits.com', 
        'simulation_test', 
        'Simulation User', 
        'kid'
    );
    
    RAISE NOTICE 'Manual profile insert succeeded.';
    
    -- Cleanup
    DELETE FROM public.profiles WHERE email = 'simulation_test@profits.com';
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Manual profile insert FAILED: %', SQLERRM;
END $$;
