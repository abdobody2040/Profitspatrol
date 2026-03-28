-- Add invite_code and parent_id to profiles if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS invite_code TEXT,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.profiles(id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON public.profiles(invite_code);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON public.profiles(parent_id);

-- Function to lookup parent by invite code (Bypasses RLS for this specific lookup)
CREATE OR REPLACE FUNCTION public.get_profile_by_invite_code(code TEXT)
RETURNS TABLE (id UUID, role TEXT) 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.role::text
    FROM public.profiles p
    WHERE p.invite_code = code
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Grant execute to auth users
GRANT EXECUTE ON FUNCTION public.get_profile_by_invite_code TO authenticated;

-- Allow users to update their own invite_code (if not already allowed)
-- Allow users to update their own invite_code (if not already allowed)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own invite_code'
    ) THEN
        CREATE POLICY "Users can update their own invite_code"
        ON public.profiles
        FOR UPDATE
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;
