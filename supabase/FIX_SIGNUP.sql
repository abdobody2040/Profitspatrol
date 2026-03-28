-- ============================================
-- FIX SIGNUP ISSUE - MISSING INSERT POLICY
-- Run this in Supabase SQL Editor
-- ============================================

-- Allow users to insert their own profile during signup
CREATE POLICY "profiles_insert"
ON public.profiles FOR INSERT
WITH CHECK ((SELECT auth.uid()) = id);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles'
AND cmd = 'INSERT';
