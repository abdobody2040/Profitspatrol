-- ============================================
-- PROFITS PATROL - CREDENTIALS DEBUG
-- ============================================
-- Authentication is rejecting the password "password123".
-- This script dumps necessary debug info.

-- 1. CHECK INSTANCE ID DISTRIBUTION
-- Do we have multiple instance_ids?
SELECT instance_id, count(*) 
FROM auth.users 
GROUP BY instance_id;

-- 2. DUMP THE TARGET USER
SELECT 
    id,
    email,
    instance_id,
    aud,
    role,
    email_confirmed_at,
    (encrypted_password IS NOT NULL) as has_password,
    substring(encrypted_password from 1 for 10) as password_start,
    raw_app_meta_data
FROM auth.users
WHERE email = 'teacher_login_test@profits.com';

-- 3. CHECK IDENTITIES
SELECT * FROM auth.identities
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'teacher_login_test@profits.com');
