-- ====================================================================
-- FIX: REPAIR USER LOGIN CREDENTIALS & IDENTITIES
-- Issue: The user exists but cannot log in due to either a missing 
--        auth identity or an invalid/raw password hash.
-- ====================================================================

DO $$
DECLARE
    target_email TEXT := 'teacher_test@profits.com';
    target_user_id UUID;
    identity_exists BOOLEAN;
BEGIN
    -- 1. Find the user ID based on the email
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User % not found in auth.users!', target_email;
    END IF;

    -- 2. Update the password to a correctly hashed version of 'TestPass123!'
    --    Also ensure the email is marked as confirmed.
    UPDATE auth.users 
    SET 
        encrypted_password = crypt('TestPass123!', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        updated_at = NOW()
    WHERE id = target_user_id;

    -- 3. Check if the user has an 'email' provider identity.
    --    Supabase requires this for email/password logins to work.
    SELECT EXISTS (
        SELECT 1 FROM auth.identities 
        WHERE user_id = target_user_id AND provider = 'email'
    ) INTO identity_exists;

    -- 4. Insert the missing identity if it does not exist
    IF NOT identity_exists THEN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(), -- ID of the identity record
            target_user_id,    -- The user it belongs to
            json_build_object('sub', target_user_id, 'email', target_email), -- Identity payload
            'email',           -- Provider name
            target_email,      -- The unique provider ID (for email, it is the email address)
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Missing identity created for %', target_email;
    END IF;

    RAISE NOTICE 'Success! User % password reset to TestPass123! and login data repaired.', target_email;
END $$;
