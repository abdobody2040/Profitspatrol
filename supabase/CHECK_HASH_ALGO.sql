-- ============================================
-- PROFITS PATROL - CHECK HASH ALGORITHM
-- ============================================
-- The password "password123" (Bcrypt) failed.
-- We need to check if Supabase is using Argon2 ($argon2...) instead.

SELECT 
    email, 
    substring(encrypted_password from 1 for 20) as hash_prefix 
FROM auth.users;
