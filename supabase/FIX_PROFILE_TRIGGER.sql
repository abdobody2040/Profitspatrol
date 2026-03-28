-- FIX PROFILE CREATION (TRIGGER)
-- This script moves profile creation to the Database side.
-- It runs automatically when a user signs up, bypassing the need for client-side RLS permissions during registration.

-- 1. Create the Function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role, subscription_status, subscription_tier, biz_coins, xp, level)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username', -- Extract username from metadata
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'KID'), -- Default to KID if missing
    'free',
    'intern',
    0,
    0,
    1
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Explanation
-- Now, when a user signs up, this function runs immediately with admin privileges.
-- The profile is created before the client even tries to save it.
-- This solves the 401 Unauthorized error permanently.
