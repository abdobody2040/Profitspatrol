-- ============================================
-- PROFITS PATROL - USER RESET & PROVISION
-- ============================================
-- The triggers are clean. The RLS is fixed.
-- The 500 Error on login suggests the specific `teacher_test` user data is corrupted
-- (likely missing identity or bad password hash from previous manual inserts).

-- 1. CLEANUP OLD USERS
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'teacher_test@profits.com');
DELETE FROM public.profiles WHERE email = 'teacher_test@profits.com';
DELETE FROM auth.users WHERE email = 'teacher_test@profits.com';

-- 2. CREATE NEW TEST USER (CORRECTLY)
-- We use a fresh UUID to ensure no stale references.
DO $$
DECLARE
    new_uid uuid := gen_random_uuid();
    new_email text := 'teacher_login_test@profits.com'; -- NEW EMAIL to avoid rate limits/caches
BEGIN
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        new_uid,
        '00000000-0000-0000-0000-000000000000', -- standard instance_id
        new_uid,
        'authenticated',
        'authenticated',
        new_email,
        crypt('TestPass123!', gen_salt('bf')), -- Correct bcrypt hash
        NOW(), -- confirmed immediately
        '{"provider":"email","providers":["email"]}',
        '{"name": "Teacher Login Test", "role": "teacher"}',
        false,
        NOW(),
        NOW(),
        '',
        ''
    );

    -- Insert into auth.identities (CRITICAL for Login to work)
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
        new_uid,
        new_uid,
        json_build_object('sub', new_uid, 'email', new_email),
        'email',
        new_email, -- provider_id for email provider is the email itself
        NOW(),
        NOW(),
        NOW()
    );

    -- Insert into public.profiles (Trigger might do this, but safe to do manual)
    INSERT INTO public.profiles (
        id, email, username, name, role, created_at, updated_at
    ) VALUES (
        new_uid,
        new_email,
        'teacher_login_test',
        'Teacher Login Test',
        'teacher',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Created User: %', new_email;
END $$;
