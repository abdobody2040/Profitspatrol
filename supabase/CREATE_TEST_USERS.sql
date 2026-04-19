-- ============================================
-- CREATE TEST USERS FOR ALL ROLES (BYPASS SIGNUP RATE LIMIT)
-- ============================================
-- This script creates 4 users:
-- 1. admin_test (Admin)
-- 2. teacher_test (Teacher)
-- 3. parent_test (Parent)
-- 4. kid_test (Kid)
--
-- Password for all: TestPass123!
-- ============================================

-- 1. CREATE AUTH USERS (If they don't exist)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
    -- Admin
    ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin_test@profits.com', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "username": "admin_test", "full_name": "Admin Test"}', NOW(), NOW()),
    
    -- Teacher
    ('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teacher_test@profits.com', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "teacher", "username": "teacher_test", "full_name": "Teacher Test"}', NOW(), NOW()),
    
    -- Parent
    ('c3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'parent_test@profits.com', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "parent", "username": "parent_test", "full_name": "Parent Test"}', NOW(), NOW()),

    -- Kid
    ('d4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kid_test@profits.com', crypt('TestPass123!', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "kid", "username": "kid_test", "full_name": "Kid Test"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING; -- Skip if exists

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
    -- Admin Identity
    (gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '{"sub": "a1111111-1111-1111-1111-111111111111", "email": "admin_test@profits.com"}', 'email', NOW(), NOW(), NOW()),
    -- Teacher Identity
    (gen_random_uuid(), 'b2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', '{"sub": "b2222222-2222-2222-2222-222222222222", "email": "teacher_test@profits.com"}', 'email', NOW(), NOW(), NOW()),
    -- Parent Identity
    (gen_random_uuid(), 'c3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', '{"sub": "c3333333-3333-3333-3333-333333333333", "email": "parent_test@profits.com"}', 'email', NOW(), NOW(), NOW()),
    -- Kid Identity
    (gen_random_uuid(), 'd4444444-4444-4444-4444-444444444444', 'd4444444-4444-4444-4444-444444444444', '{"sub": "d4444444-4444-4444-4444-444444444444", "email": "kid_test@profits.com"}', 'email', NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING; -- Skip if exists

-- 2. CREATE PROFILES (Using Safe Upsert)
-- The trigger might run automatically on auth.users insert, but let's ensure profiles exist with correct roles.

INSERT INTO public.profiles (id, username, name, email, role)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'admin_test', 'Admin Test', 'admin_test@profits.com', 'admin'),
    ('b2222222-2222-2222-2222-222222222222', 'teacher_test', 'Teacher Test', 'teacher_test@profits.com', 'teacher'),
    ('c3333333-3333-3333-3333-333333333333', 'parent_test', 'Parent Test', 'parent_test@profits.com', 'parent'),
    ('d4444444-4444-4444-4444-444444444444', 'kid_test', 'Kid Test', 'kid_test@profits.com', 'kid')
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role; -- Ensure role is correct if profile existed
