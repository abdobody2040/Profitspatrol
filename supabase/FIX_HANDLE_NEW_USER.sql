-- ============================================
-- FIX: Update handle_new_user function to use 'name' column
-- ============================================

-- 1. Ensure the profiles table has the correct column 'name' (not 'full_name')
DO $$
BEGIN
    -- Check if 'full_name' column exists, if so, rename it to 'name'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles RENAME COLUMN full_name TO name;
    END IF;

    -- If 'name' doesn't exist (and 'full_name' didn't exist), add 'name'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
END $$;

-- 2. Update the handle_new_user function to use 'name'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
        -- Use username from metadata, or fall back to email part
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        -- Use full_name OR name from metadata, or fall back to username/email part
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        -- Default to 'kid' if no role specified
        COALESCE(NEW.raw_user_meta_data->>'role', 'kid')::text,
        NOW(),
        NOW()
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the transaction (optional, but good for debugging)
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Re-create the trigger to be sure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Clean up any bad state (optional)
-- Remove profiles that might have been half-created if any (unlikely due to transaction)
