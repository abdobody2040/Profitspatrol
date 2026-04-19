-- ============================================
-- PROFITS PATROL - VERIFY USER CREATION
-- ============================================
-- The new user `teacher_login_test` failed to login with "Invalid login credentials".
-- This usually means the user wasn't created, or the password hash is wrong.

-- 1. CHECK IF USER EXISTS IN AUTH.USERS
SELECT id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data
FROM auth.users
WHERE email = 'teacher_login_test@profits.com';

-- 2. CHECK IF IDENTITY EXISTS (Crucial for Email Login)
SELECT * FROM auth.identities
WHERE provider_id = 'teacher_login_test@profits.com' OR user_id IN (
    SELECT id FROM auth.users WHERE email = 'teacher_login_test@profits.com'
);

-- 3. CHECK PUBLIC PROFILE
SELECT * FROM public.profiles WHERE email = 'teacher_login_test@profits.com';

-- 4. TEST PASSWORD HASH (Simulation)
-- We can't verify the hash directly, but we can verify if `crypt` generates a consistent hash
-- relative to what we see.
SELECT 
    email,
    (encrypted_password IS NOT NULL) as has_password,
    (encrypted_password LIKE '$2a$%') as is_bcrypt_hash
FROM auth.users
WHERE email = 'teacher_login_test@profits.com';
