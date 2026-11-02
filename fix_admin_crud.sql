BEGIN;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (
        id = (select auth.uid()) 
        OR public.is_admin((select auth.uid()))
    );
COMMIT;
