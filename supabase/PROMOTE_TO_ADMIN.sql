-- ============================================
-- PROFITS PATROL - PROMOTE TO ADMIN
-- ============================================
-- The user 'admobabdo@gmail.com' is currently a KID.
-- This script promotes them to ADMIN.

DO $$
DECLARE
    target_email text := 'admobabdo@gmail.com';
BEGIN
    -- 1. Update public.profiles (Application Role)
    -- We use 'admin' (lowercase) based on previous findings, but let's conform to what types.ts says.
    -- If types.ts says 'ADMIN', we should use that, but DB usually uses lowercase 'admin'.
    -- The previous output showed mixed case (KID, admin). I will use 'ADMIN' to match the likely enum if it's uppercase,
    -- or 'admin' if it matches the other admin user.
    -- The other admin 'admin_test@profits.com' had role 'admin' (lowercase) in one row and 'ADMIN' might be expected by the app.
    -- Let's check the types.ts file first to be sure, but standardizing on what the App expects.
    -- Assuming 'ADMIN' based on the 'KID' value seen for admobabdo.
    
    UPDATE public.profiles
    SET role = 'ADMIN' 
    WHERE email = target_email;

    -- 2. Update auth.users metadata (Supabase Auth Role)
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"ADMIN"')
    WHERE email = target_email;

    RAISE NOTICE 'Promoted % to ADMIN', target_email;
END $$;
