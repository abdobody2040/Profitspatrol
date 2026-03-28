-- Test script to find the exact line causing UUID/TEXT error
-- Run this line by line in Supabase SQL Editor to find which one fails

-- Test 1: Create profiles table
CREATE TABLE IF NOT EXISTS public.test_profiles (
    id UUID PRIMARY KEY,
    username TEXT
);

-- Test 2: Create classrooms table
CREATE TABLE IF NOT EXISTS public.test_classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.test_profiles(id)
);

-- Test 3: Create student_groups with UUID array
CREATE TABLE IF NOT EXISTS public.test_student_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.test_classrooms(id),
    student_ids UUID[] DEFAULT ARRAY[]::UUID[]
);

-- Test 4: Create assignments with UUID array
CREATE TABLE IF NOT EXISTS public.test_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.test_classrooms(id),
    specific_student_ids UUID[] DEFAULT ARRAY[]::UUID[]
);

-- If all tests pass, the issue is in the RLS policies
-- Clean up
DROP TABLE IF EXISTS public.test_assignments CASCADE;
DROP TABLE IF EXISTS public.test_student_groups CASCADE;
DROP TABLE IF EXISTS public.test_classrooms CASCADE;
DROP TABLE IF EXISTS public.test_profiles CASCADE;
