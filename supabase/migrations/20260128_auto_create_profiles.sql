-- Migration: Auto-create profile when user signs up
-- Created: 2026-01-28
-- Purpose: Automatically create a profile entry when a new user is created in auth.users

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        username,
        role,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'kid')::text,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Add comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up';

-- For existing users without profiles, create them now
INSERT INTO public.profiles (id, email, username, role, created_at)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
    COALESCE(u.raw_user_meta_data->>'role', 'kid')::text,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

