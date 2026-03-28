-- ============================================
-- PROFITS PATROL - CHECK USER ROLES
-- ============================================
-- User reports seeing "Intern View" (Kid Dashboard).
-- We need to check the role of the users.

SELECT email, role, username FROM public.profiles;

-- Also check auth metadata
SELECT email, raw_user_meta_data->>'role' as meta_role FROM auth.users;
