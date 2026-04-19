-- ============================================================
-- FIX SERVICE ROLE POLICY OVERLAP
-- Date: 2026-02-18
-- Problem: Policies using FOR ALL without TO clause apply to ALL roles
--          including `authenticated`, causing "multiple permissive" warnings
--          on SELECT for moderated_content, moderation_whitelist, moderation_blacklist
-- Fix: Drop the *_all_service policies and recreate them scoped TO service_role
-- ============================================================

-- ── MODERATED CONTENT ─────────────────────────────────────
DROP POLICY IF EXISTS "moderated_content_all_service" ON public.moderated_content;

-- Service role gets full access (scoped to service_role only)
CREATE POLICY "moderated_content_all_service"
    ON public.moderated_content FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ── MODERATION WHITELIST ──────────────────────────────────
DROP POLICY IF EXISTS "moderation_whitelist_all_service" ON public.moderation_whitelist;

CREATE POLICY "moderation_whitelist_all_service"
    ON public.moderation_whitelist FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ── MODERATION BLACKLIST ──────────────────────────────────
DROP POLICY IF EXISTS "moderation_blacklist_all_service" ON public.moderation_blacklist;

CREATE POLICY "moderation_blacklist_all_service"
    ON public.moderation_blacklist FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ── SECURITY EVENTS ───────────────────────────────────────
DROP POLICY IF EXISTS "security_events_all" ON public.security_events;

CREATE POLICY "security_events_all"
    ON public.security_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ── WEBHOOK EVENTS ────────────────────────────────────────
DROP POLICY IF EXISTS "webhook_events_all_service" ON public.webhook_events;

CREATE POLICY "webhook_events_all_service"
    ON public.webhook_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- END OF SERVICE ROLE POLICY FIX
-- ============================================================
