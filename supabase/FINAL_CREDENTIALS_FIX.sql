-- ============================================
-- PROFITS PATROL - FINAL CREDENTIALS FIX
-- ============================================
-- "Invalid login credentials" (400) usually means:
-- 1. Wrong Password
-- 2. Wrong Instance ID (API ignores the user)
-- 3. Email not confirmed

-- This script fixes all three.

DO $$
DECLARE
    target_email text := 'teacher_login_test@profits.com';
    real_instance_id uuid;
BEGIN
    -- 1. DETECT REAL INSTANCE ID
    -- We grab the instance_id from any OTHER user that isn't our test user,
    -- or default to 0000... if none exists.
    SELECT instance_id INTO real_instance_id 
    FROM auth.users 
    WHERE email != target_email 
    LIMIT 1;

    -- Default if null
    IF real_instance_id IS NULL THEN
        real_instance_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    RAISE NOTICE 'Detected Instance ID: %', real_instance_id;

    -- 2. UPDATE USER WITH CORRECT INSTANCE ID & SIMPLE PASSWORD
    UPDATE auth.users
    SET 
        instance_id = real_instance_id,
        encrypted_password = crypt('password123', gen_salt('bf')), -- Simple password
        email_confirmed_at = NOW(),
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        aud = 'authenticated',
        role = 'authenticated'
    WHERE email = target_email;

    -- 3. UPDATE IDENTITY AS WELL
    UPDATE auth.identities
    SET identity_data = json_build_object('sub', id, 'email', target_email)
    WHERE user_id IN (SELECT id FROM auth.users WHERE email = target_email);

    RAISE NOTICE 'User % updated with password: password123', target_email;
END $$;
