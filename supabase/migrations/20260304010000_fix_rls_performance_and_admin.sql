-- ============================================================
-- Migration: Fix Admin Grant + All RLS Performance Warnings
-- Date: 2026-03-04
-- ============================================================
-- Resolves:
--   1. Admin JWT claim re-grant (previous migration rolled back due to
--      profiles_role_check constraint rejecting 'ADMIN').
--      The auth.users update is what actually matters for RLS — the
--      profiles.role mirror is a "best-effort" UI display field only.
--   2. All 12 Supabase linter warnings:
--      - auth.<fn>() called without (select ...) wrapper in 12 RLS policies
--      - Duplicate permissive policies on public.profiles
-- ============================================================

-- ============================================================
-- PART 1: ADMIN JWT CLAIM (re-run — previous transaction rolled back)
-- ============================================================
DO $$
DECLARE
    v_user_id UUID;
    v_admin_email TEXT := 'YOUR_ADMIN_USER_EMAIL@example.com'; -- ← REPLACE THIS before running
BEGIN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_admin_email
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user with email % not found in auth.users. '
                        'Make sure the account is registered first.',
                        v_admin_email;
    END IF;

    -- ✅ CRITICAL: Set the JWT claim that the RLS Admin policies check
    UPDATE auth.users
    SET raw_app_meta_data =
        COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
    WHERE id = v_user_id;

    -- Mirror to profiles.role — wrapped in its own block so that a
    -- CHECK constraint mismatch does NOT roll back the auth.users update above.
    BEGIN
        UPDATE public.profiles
        SET role = (
            -- Detect the case convention used by the existing CHECK constraint.
            -- Try 'admin' (lowercase) first; if the column already stores
            -- uppercase values the constraint will have its own default.
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM public.profiles WHERE UPPER(role) IN ('KID','PARENT','TEACHER')
                    AND role = LOWER(role) LIMIT 1
                ) THEN 'admin'   -- lowercase convention detected
                ELSE 'ADMIN'     -- uppercase convention
            END
        )
        WHERE id = v_user_id;
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'profiles.role update skipped (CHECK constraint): JWT claim in auth.users was still set successfully.';
    END;

    RAISE NOTICE 'Admin JWT claim granted to user % (%)', v_admin_email, v_user_id;
END $$;


-- ============================================================
-- PART 2: REMOVE DUPLICATE PERMISSIVE POLICIES
-- The 20260225000000 migration created profiles_select / profiles_insert /
-- profiles_update but the 20260218140000 migration then recreated the
-- named policies ("Users can view own profile", etc.) on top — leaving
-- two sets of permissive policies per action/role combination.
-- ============================================================

-- Drop the verbose-named duplicates (the 20260225 consolidated ones take over)
DROP POLICY IF EXISTS "Users can view own profile"       ON public.profiles;
DROP POLICY IF EXISTS "Parents can view linked children" ON public.profiles;
DROP POLICY IF EXISTS "Kids can view their parent"       ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Parents can update linked children" ON public.profiles;

-- Also drop any surviving Admin policies from 20260220155000 that now
-- conflict with the JWT-based ones from 20260218140000
DROP POLICY IF EXISTS "Admins can view all profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles"  ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles"      ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete"                 ON public.profiles;


-- ============================================================
-- PART 3: RECREATE ADMIN POLICIES WITH (select auth.jwt())
-- Supabase linter: auth.jwt() must be wrapped with (select ...) so
-- the result is cached per-statement instead of re-evaluated per-row.
-- ============================================================

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((select auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING  ((select auth.jwt() ->> 'role') = 'admin')
    WITH CHECK ((select auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can delete profiles"
    ON public.profiles FOR DELETE
    TO authenticated
    USING ((select auth.jwt() ->> 'role') = 'admin');


-- ============================================================
-- PART 4: FIX CORPORATIONS RLS POLICIES
-- Wrap auth.uid() with (select ...) for per-statement caching.
-- ============================================================

DROP POLICY IF EXISTS "corps_insert_auth"   ON public.corporations;
DROP POLICY IF EXISTS "corps_ceo_update"    ON public.corporations;
DROP POLICY IF EXISTS "corps_ceo_delete"    ON public.corporations;
DROP POLICY IF EXISTS "corp_members_insert" ON public.corporation_members;
DROP POLICY IF EXISTS "corp_members_delete" ON public.corporation_members;

CREATE POLICY "corps_insert_auth"
    ON public.corporations FOR INSERT
    WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "corps_ceo_update"
    ON public.corporations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.corporation_members
            WHERE corporation_id = corporations.id
              AND user_id = (select auth.uid())
              AND role = 'CEO'
        )
    );

CREATE POLICY "corps_ceo_delete"
    ON public.corporations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.corporation_members
            WHERE corporation_id = corporations.id
              AND user_id = (select auth.uid())
              AND role = 'CEO'
        )
    );

CREATE POLICY "corp_members_insert"
    ON public.corporation_members FOR INSERT
    WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "corp_members_delete"
    ON public.corporation_members FOR DELETE
    USING (user_id = (select auth.uid()));


-- ============================================================
-- PART 5: FIX STOCK MARKET RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "stocks_read_all"       ON public.stock_companies;
DROP POLICY IF EXISTS "stocks_service_update" ON public.stock_companies;
DROP POLICY IF EXISTS "portfolio_own_select"  ON public.stock_portfolio;
DROP POLICY IF EXISTS "portfolio_own_insert"  ON public.stock_portfolio;
DROP POLICY IF EXISTS "portfolio_own_update"  ON public.stock_portfolio;
DROP POLICY IF EXISTS "portfolio_own_delete"  ON public.stock_portfolio;

CREATE POLICY "stocks_read_all"
    ON public.stock_companies FOR SELECT
    USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "stocks_service_update"
    ON public.stock_companies FOR UPDATE
    USING ((select auth.role()) = 'service_role');

CREATE POLICY "portfolio_own_select"
    ON public.stock_portfolio FOR SELECT
    USING (user_id = (select auth.uid()));

CREATE POLICY "portfolio_own_insert"
    ON public.stock_portfolio FOR INSERT
    WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "portfolio_own_update"
    ON public.stock_portfolio FOR UPDATE
    USING (user_id = (select auth.uid()));

CREATE POLICY "portfolio_own_delete"
    ON public.stock_portfolio FOR DELETE
    USING (user_id = (select auth.uid()));


-- ============================================================
-- PART 6: FIX PARENT REPORT LOG RLS POLICIES
-- ============================================================

DROP POLICY IF EXISTS "report_log_parent_read"    ON public.parent_report_log;
DROP POLICY IF EXISTS "report_log_service_insert" ON public.parent_report_log;

CREATE POLICY "report_log_parent_read"
    ON public.parent_report_log FOR SELECT
    USING (parent_id = (select auth.uid()));

CREATE POLICY "report_log_service_insert"
    ON public.parent_report_log FOR INSERT
    WITH CHECK (
        (select auth.role()) = 'service_role'
        OR (select auth.uid()) = parent_id
    );
