-- ====================================================================
-- FIX: PROVISION CLASSROOM FOR TEST TEACHER
-- Issue: Manually created teachers don't get the auto-generated 
--        profile or classroom that usually happens during frontend signup.
--        This causes the Teacher Dashboard to get stuck on "Loading".
-- ====================================================================

DO $$
DECLARE
    target_email TEXT := 'teacher_test@profits.com';
    target_user_id UUID;
    target_name TEXT;
    target_username TEXT;
    classroom_exists BOOLEAN;
BEGIN
    -- 1. Find the user ID from auth.users (the source of truth for accounts)
    SELECT id, email, split_part(email, '@', 1) 
    INTO target_user_id, target_email, target_username
    FROM auth.users 
    WHERE email = target_email LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User % not found in auth.users! Cannot proceed.', target_email;
    END IF;

    -- 2. Check if a profile exists, if not, create it
    SELECT name INTO target_name FROM public.profiles WHERE id = target_user_id;

    IF target_name IS NULL THEN
        -- Insert missing profile
        target_name := 'Teacher Test';
        
        INSERT INTO public.profiles (
            id, email, username, name, role, subscription_tier, created_at, updated_at
        ) VALUES (
            target_user_id,
            target_email,
            target_username,
            target_name,
            'teacher',
            'intern', -- Default free tier
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created missing public.profile for %', target_email;
    END IF;

    -- 3. Check if a classroom already exists
    SELECT EXISTS (
        SELECT 1 FROM public.classrooms 
        WHERE teacher_id = target_user_id
    ) INTO classroom_exists;

    -- 4. Insert the classroom if it does not exist
    IF NOT classroom_exists THEN
        INSERT INTO public.classrooms (
            id,
            name,
            code,
            teacher_id,
            locked_modules,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(), -- ID of the classroom
            COALESCE(target_name, 'Teacher') || '''s Class', -- Name
            UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)), -- Random 6-char code
            target_user_id,    -- The teacher
            '{}',              -- Locked modules (empty array)
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Classroom created for %', target_email;
    ELSE
        RAISE NOTICE 'Classroom already exists for %', target_email;
    END IF;

    RAISE NOTICE 'Success! Profile and Classroom are provisioned. Dashboard should load now.';
END $$;
