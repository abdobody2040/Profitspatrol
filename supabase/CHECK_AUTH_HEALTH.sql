-- ============================================
-- PROFITS PATROL - AUTH HEALTH CHECK
-- ============================================
-- The error "Database error querying schema" suggests the API cannot read/write to auth tables.
-- This script tests if the `auth` schema is writable by the `postgres` role.

-- 1. CHECK SCHEMA PERMISSIONS
SELECT schema_name, schema_owner FROM information_schema.schemata WHERE schema_name = 'auth';

-- 2. CHECK TABLE EXISTENCE
SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth';

-- 3. ATTEMPT MANUAL INSERT INTO SESSIONS (Simulate Login)
-- We use a dummy user ID just to see if the INSERT triggers a crash.
DO $$
DECLARE
    test_uid uuid := 'b2222222-2222-2222-2222-222222222222'; -- Teacher Test ID
BEGIN
    -- We can't insert a real session easily without a valid JWT logic, 
    -- but we can try to insert a refresh token if the user exists.
    
    -- Check if user exists first
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = test_uid) THEN
        RAISE EXCEPTION 'Test user does not exist!';
    END IF;

    -- Dry Run Insert
    BEGIN
        INSERT INTO auth.refresh_tokens (instance_id, token, user_id, parent, rev2)
        VALUES (
            '00000000-0000-0000-0000-000000000000', 
            'test_token_' || gen_random_uuid(), 
            test_uid, 
            NULL, 
            true
        );
        RAISE NOTICE 'Insert into auth.refresh_tokens SUCCEEDED';
        
        -- Rollback so we don't leave trash
        ROLLBACK;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Insert into auth.refresh_tokens FAILED: %', SQLERRM;
    END;
    
END $$;

-- 4. CHECK IF EXTENSIONS ARE HEALTHY
SELECT * FROM pg_extension;
