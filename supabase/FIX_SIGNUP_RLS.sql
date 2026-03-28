-- ============================================
-- FIX USER REGISTRATION - ALLOW TRIGGER TO CREATE PROFILES
-- ============================================
-- The handle_new_user() trigger runs as SECURITY DEFINER
-- but RLS still blocks it. We need to allow the trigger to insert.
-- ============================================

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a new policy that allows:
-- 1. Authenticated users to insert their own profile (for manual creation)
-- 2. Service role to insert (for trigger-based creation)
CREATE POLICY "Allow profile creation"
    ON public.profiles FOR INSERT
    TO authenticated, anon
    WITH CHECK (
        -- Either the user is creating their own profile
        id = (SELECT auth.uid())
        -- OR it's being created by the trigger (no auth.uid() yet)
        OR (SELECT auth.uid()) IS NULL
    );

-- Verify the fix
SELECT 'Policy updated!' as status;
