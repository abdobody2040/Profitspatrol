-- ============================================
-- RESET ADMIN PASSWORD
-- ============================================
-- This will allow you to set a new password for admin@profitspatrol.com
-- Run this in Supabase SQL Editor
-- ============================================

-- Option 1: Send a password reset email
-- Uncomment and run this if you want to reset via email
-- SELECT auth.send_password_reset_email('admin@profitspatrol.com');

-- Option 2: Directly update the password (ADMIN ONLY - USE WITH CAUTION)
-- Replace 'your-new-password-here' with your desired password
-- This uses Supabase's crypt function to hash the password

-- First, check if the user exists
SELECT 
    'Admin user in auth.users:' as status,
    id,
    email,
    created_at
FROM auth.users
WHERE email = 'admin@profitspatrol.com';

-- To reset the password, you need to use Supabase Dashboard:
-- 1. Go to Authentication → Users
-- 2. Find admin@profitspatrol.com
-- 3. Click the three dots menu → "Send Password Recovery"
-- 4. Check your email and reset the password

-- OR create a new admin user:
-- Go to Authentication → Users → Add User
-- Email: admin@profitspatrol.com (or use a new email)
-- Password: (your choice)
-- Auto Confirm User: YES
-- Then run the migration script again to create the profile
