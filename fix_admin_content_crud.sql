BEGIN;

-- GAMES
DROP POLICY IF EXISTS "Admins can manage games" ON public.games;
CREATE POLICY "Admins can manage games"
    ON public.games FOR ALL
    TO authenticated
    USING (public.is_admin((select auth.uid())));

-- BOOKS
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
CREATE POLICY "Admins can manage books"
    ON public.books FOR ALL
    TO authenticated
    USING (public.is_admin((select auth.uid())));

-- CMS CONTENT
DROP POLICY IF EXISTS "Admins can manage cms" ON public.cms_content;
CREATE POLICY "Admins can manage cms"
    ON public.cms_content FOR ALL
    TO authenticated
    USING (public.is_admin((select auth.uid())));

COMMIT;
