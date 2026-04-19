-- ============================================
-- PROFITS PATROL - MINIMAL REPRODUCTION
-- ============================================
-- The 500 error persists. We need to isolate the failure.
-- It's likely the `handle_new_user` function OR a hidden trigger on `auth.users`.

-- 1. DEFINE A TEST FUNCTION THAT MOCKS THE TRIGGER
-- This function mimics EXACTLY what Supabase does when a user signs up.
CREATE OR REPLACE FUNCTION public.test_handle_new_user_execution()
RETURNS void AS $$
DECLARE
    mock_new_user auth.users%ROWTYPE;
BEGIN
    -- Construct a mock user record similar to what Supabase passes
    mock_new_user.id := 'b2222222-2222-2222-2222-222222222222';
    mock_new_user.email := 'manual_test@profits.com';
    mock_new_user.raw_user_meta_data := '{"username": "manual_test", "role": "teacher", "full_name": "Manual Test"}'::jsonb;
    mock_new_user.created_at := NOW();
    mock_new_user.updated_at := NOW();
    
    -- Cleanup previous test
    DELETE FROM public.profiles WHERE id = mock_new_user.id;
    
    -- EXECUTE THE LOGIC MANUALLY (Copy-paste from handle_new_user)
    BEGIN
        INSERT INTO public.profiles (
            id, email, username, name, role, created_at, updated_at
        ) VALUES (
            mock_new_user.id,
            mock_new_user.email,
            COALESCE(mock_new_user.raw_user_meta_data->>'username', split_part(mock_new_user.email, '@', 1)),
            COALESCE(mock_new_user.raw_user_meta_data->>'full_name', mock_new_user.raw_user_meta_data->>'name', split_part(mock_new_user.email, '@', 1)),
            COALESCE(mock_new_user.raw_user_meta_data->>'role', 'kid')::text,
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Manual insertion succeeded';
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Manual insertion FAILED: %', SQLERRM;
    END;

    -- CHECK IF THE FUNCTION ITSELF CRASHES
    -- We can't call trigger function directly easily, but we verified the logic above.
END;
$$ LANGUAGE plpgsql;

-- 2. RUN THE TEST
SELECT public.test_handle_new_user_execution();

-- 3. CHECK FOR "GHOST" TRIGGERS AGAIN
-- Sometimes triggers are hidden in other schemas
SELECT 
    trigger_schema, 
    trigger_name, 
    event_object_table, 
    action_statement 
FROM information_schema.triggers 
WHERE event_object_table IN ('users', 'sessions', 'profiles');
