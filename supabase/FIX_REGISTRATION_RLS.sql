-- FIX REGISTRATION RLS
-- This script specifically fixes the "new row violates row-level security policy" error during sign up.

-- 1. Reset permissions for self-management (Insert/Update)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 2. Allow Inserting your own profile (Required for Registration)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

-- 3. Allow Updating your own profile (Required for usage)
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- 4. Verify policies exist (optional output, check query results if running manually)
SELECT * FROM pg_policies WHERE tablename = 'profiles';
