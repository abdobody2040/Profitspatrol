-- ============================================
-- FIX HANDLE_NEW_USER TRIGGER - LOWERCASE ROLE
-- ============================================
-- The trigger was failing because it didn't convert role to lowercase
-- The profiles table CHECK constraint requires lowercase roles
-- ============================================

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

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
        role
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'kid'))::text  -- FIX: Convert to lowercase
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Verify
SELECT 'Trigger fixed!' as status;
