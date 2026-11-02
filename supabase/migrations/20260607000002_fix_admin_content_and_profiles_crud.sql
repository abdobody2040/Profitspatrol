-- ================================================================
-- Migration: Fix Admin Content & Profiles CRUD RLS Policies
-- Date: 2026-06-07
-- Enables administrators to manage games, books, cms_content,
-- and handle profile inserts/deletions securely.
-- ================================================================

BEGIN;

-- 1. GAMES
DROP POLICY IF EXISTS "Admins can manage games" ON public.games;
CREATE POLICY "Admins can manage games"
    ON public.games FOR ALL
    TO authenticated
    USING (public.is_admin((select auth.uid())));

-- 2. BOOKS
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;
CREATE POLICY "Admins can manage books"
    ON public.books FOR ALL
    TO authenticated
    USING (public.is_admin((select auth.uid())));

-- 3. CMS CONTENT
DROP POLICY IF EXISTS "Admins can manage cms" ON public.cms_content;
CREATE POLICY "Admins can manage cms"
    ON public.cms_content FOR ALL
    TO authenticated
    USING (public.is_admin((select auth.uid())));

-- 4. PROFILES (Delete & Insert)
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
