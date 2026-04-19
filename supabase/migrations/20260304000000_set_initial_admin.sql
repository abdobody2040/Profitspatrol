-- ============================================================
-- INITIAL ADMIN ROLE ASSIGNMENT
-- ============================================================
-- Purpose:  Grants the 'admin' JWT claim to a specific user so that
--           the Supabase RLS Admin policies (auth.jwt() ->> 'role' = 'admin')
--           take effect immediately.
--
-- HOW TO USE:
--   1. Replace 'YOUR_ADMIN_USER_EMAIL@example.com' with the actual admin email.
--   2. Run this migration via: supabase db push
--      OR run it manually in the Supabase SQL Editor.
--
-- Why auth.users and not profiles?
--   The RLS admin policies read the role from the JWT claim
--   (auth.jwt() ->> 'role'), which is sourced from auth.users.raw_app_meta_data.
--   Editing profiles.role alone will NOT grant admin privileges at the DB level.
--
-- ⚠️  SECURITY NOTE:
--   raw_app_meta_data is only writable by service_role. Regular authenticated
--   users CANNOT modify this, preventing privilege escalation via client.
-- ============================================================

DO $$
DECLARE
    v_user_id UUID;
    v_admin_email TEXT := 'YOUR_ADMIN_USER_EMAIL@example.com'; -- ← REPLACE THIS
BEGIN
    -- Look up the user by email in auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_admin_email
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user with email % not found in auth.users. '
                        'Make sure the account is registered before running this migration.',
                        v_admin_email;
    END IF;

    -- Set the 'role' claim in app_meta_data (JWT claim source)
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
    WHERE id = v_user_id;

    -- Mirror to profiles table for UI display consistency
    UPDATE public.profiles
    SET role = 'ADMIN'
    WHERE id = v_user_id;

    RAISE NOTICE 'Admin role granted to user % (%)', v_admin_email, v_user_id;
END $$;

-- ============================================================
-- VERIFY (optional — comment out before committing)
-- ============================================================
-- SELECT id, email, raw_app_meta_data ->> 'role' AS jwt_role
-- FROM auth.users
-- WHERE email = 'YOUR_ADMIN_USER_EMAIL@example.com';
