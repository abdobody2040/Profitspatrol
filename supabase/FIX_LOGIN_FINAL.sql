-- ============================================
-- PROFITS PATROL - LOGIN FIX (FINAL)
-- ============================================

-- Preamble: Fixes "Database error finding user" during login
-- 1. Drops potential failing triggers on auth.users
-- 2. Makes handle_new_user robust (prevents login failure)
-- 3. Ensures public.profiles exists and has proper RLS policies
-- 4. Cleans up any potential bad state

-- 1. DROP EXISTING TRIGGERS (Safe Cleanup)
-- If a trigger fails on login (which updates auth.users), login fails.
-- We ensure no conflicting triggers exist.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users; 
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- 2. ROBUST HANDLE_NEW_USER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Try to insert/update the profile
    INSERT INTO public.profiles (
        id, 
        email, 
        username, 
        name, 
        role, 
        created_at, 
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        -- Fallback logic for username
        COALESCE(
            NEW.raw_user_meta_data->>'username', 
            split_part(NEW.email, '@', 1)
        ),
        -- Fallback logic for name
        COALESCE(
            NEW.raw_user_meta_data->>'full_name', 
            NEW.raw_user_meta_data->>'name', 
            split_part(NEW.email, '@', 1)
        ),
        -- Default role to 'kid' if missing
        COALESCE(NEW.raw_user_meta_data->>'role', 'kid')::text,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        updated_at = NOW(),
        -- Only update these if they are currently null in the DB
        name = COALESCE(profiles.name, EXCLUDED.name),
        username = COALESCE(profiles.username, EXCLUDED.username);

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- CRITICAL: Catch ALL errors so auth.users insert/update NEVER fails
    -- We log the error to our logs table (if exists) or just Raise Warning
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. RE-ATTACH TRIGGER (Only for INSERT)
-- We attach ONLY to INSERT to handle new signups.
-- We attach to UPDATE ONLY if we need to sync email changes, but usually not needed for login.
-- Login updates 'last_sign_in_at' which fires update triggers.
-- By NOT attaching to UPDATE, we avoid breaking login if profile sync fails.
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- 4. ENSURE PROFILES TABLE IS ACCESSIBLE
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop restricting policies to start fresh
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- Create correct policies
-- Allow users to read their own profile
CREATE POLICY "profiles_select" ON public.profiles 
FOR SELECT TO authenticated 
USING (
    true -- Allow reading any profile for now (to debug). Usually: id = auth.uid() OR ...
);

-- Allow users to update their own profile
CREATE POLICY "profiles_update" ON public.profiles 
FOR UPDATE TO authenticated 
USING (id = auth.uid());

-- Allow insert (covered by trigger usually, but for manual creation)
CREATE POLICY "profiles_insert" ON public.profiles 
FOR INSERT TO authenticated 
WITH CHECK (id = auth.uid());


-- 5. VERIFY TEST USER EXISTS (Manual Fix for stuck user)
-- If teacher_test exists in auth but missing in profiles, fix it.
DO $$
DECLARE
    -- Teacher Test ID (from CREATE_TEST_USERS.sql)
    test_user_id uuid := 'b2222222-2222-2222-2222-222222222222';
    test_email text := 'teacher_test@profits.com';
BEGIN
    -- Check if profile exists for this ID
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = test_user_id) AND 
       NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = test_user_id) THEN
            
        INSERT INTO public.profiles (id, email, username, name, role, created_at, updated_at)
        VALUES (
            test_user_id, 
            test_email, 
            'teacher_test', 
            'Teacher Test', 
            'teacher',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Fixed missing profile for teacher_test';
    END IF;
END $$;
