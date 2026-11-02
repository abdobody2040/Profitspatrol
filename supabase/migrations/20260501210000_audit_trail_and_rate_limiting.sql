-- ================================================================
-- SECURITY HARDENING PHASE 2: Immutable Audit Trail + Rate Limiting
--
-- This migration implements:
-- 1. security_audit_logs  — insert-only event ledger (tamper-proof)
-- 2. Automatic triggers   — captures role/pp_tokens changes server-side
-- 3. Rate limiting        — integrated into award_pp_tokens RPC
-- 4. Lean admin fetch     — fetch_all_profiles_admin redacted to PII minimum
-- ================================================================


-- ================================================================
-- 1. IMMUTABLE AUDIT TRAIL TABLE
--    - No UPDATE or DELETE policy — rows are permanent.
--    - Admins can SELECT; only the system (triggers/RPCs) can INSERT.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),

    -- WHO performed the action (the authenticated caller, or NULL for system triggers)
    actor_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

    -- WHAT changed
    action      TEXT        NOT NULL, -- e.g. 'role_changed', 'pp_tokens_awarded', 'login_failed', 'admin_access'
    target_id   UUID,                 -- the user record that was affected

    -- CONTEXT
    old_value   TEXT,                 -- value before change
    new_value   TEXT,                 -- value after change
    reason      TEXT,                 -- reason / reward source
    metadata    JSONB       NOT NULL  DEFAULT '{}'
);

-- Index for fast lookups by actor, target, and time range
CREATE INDEX IF NOT EXISTS idx_sal_actor     ON public.security_audit_logs (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sal_target    ON public.security_audit_logs (target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sal_action    ON public.security_audit_logs (action, created_at DESC);

-- Enable RLS
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs; other users can only see their own log entries
CREATE POLICY "Admins can read all audit logs"
    ON public.security_audit_logs FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND lower(role) = 'admin')
        OR target_id = auth.uid()
    );

-- NOBODY (not even admins) can update or delete audit log rows via the API
-- Inserts are handled exclusively by triggers and SECURITY DEFINER RPCs
CREATE POLICY "No direct INSERT — use RPCs only"
    ON public.security_audit_logs FOR INSERT
    WITH CHECK (false);

-- Grant SELECT to authenticated users (filtered by RLS above)
GRANT SELECT ON public.security_audit_logs TO authenticated;
-- The RPCs (SECURITY DEFINER) run as the function owner who has full table access
GRANT INSERT ON public.security_audit_logs TO postgres;


-- ================================================================
-- 2. TRIGGER FUNCTION: log_profile_sensitive_changes
--    Fires AFTER UPDATE on profiles for pp_tokens or role columns.
--    Runs as SECURITY DEFINER (function owner) so it can bypass
--    the INSERT WITH CHECK (false) policy above.
-- ================================================================
CREATE OR REPLACE FUNCTION log_profile_sensitive_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log pp_tokens changes
    IF OLD.pp_tokens IS DISTINCT FROM NEW.pp_tokens THEN
        INSERT INTO public.security_audit_logs (actor_id, action, target_id, old_value, new_value, reason, metadata)
        VALUES (
            auth.uid(),
            'pp_tokens_changed',
            NEW.id,
            OLD.pp_tokens::TEXT,
            NEW.pp_tokens::TEXT,
            'profile_update_trigger',
            jsonb_build_object('delta', NEW.pp_tokens - COALESCE(OLD.pp_tokens, 0))
        );
    END IF;

    -- Log role changes — these are high-value security events
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        INSERT INTO public.security_audit_logs (actor_id, action, target_id, old_value, new_value, reason, metadata)
        VALUES (
            auth.uid(),
            'role_changed',
            NEW.id,
            OLD.role,
            NEW.role,
            'profile_update_trigger',
            jsonb_build_object('elevated_privilege', NEW.role = 'ADMIN')
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Attach trigger to profiles table
DROP TRIGGER IF EXISTS trg_audit_profile_changes ON public.profiles;
CREATE TRIGGER trg_audit_profile_changes
    AFTER UPDATE OF pp_tokens, role ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_profile_sensitive_changes();


-- ================================================================
-- 3. UPDATED award_pp_tokens RPC — adds:
--    a) Rate limiting (max 1 self-award per 30 seconds per reason)
--    b) Audit log entry on every award
-- ================================================================
CREATE OR REPLACE FUNCTION award_pp_tokens(
    target_user_id UUID,
    amount         INT,
    reason         TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_role      TEXT;
    recent_award_count INT;
BEGIN
    -- 1. Get the calling user's role
    SELECT lower(role) INTO caller_role FROM profiles WHERE id = auth.uid();

    -- 2. Authorization: non-admins can only award to themselves
    IF target_user_id <> auth.uid() AND caller_role <> 'admin' THEN
        RAISE EXCEPTION 'Access denied. Cannot award tokens to another user.';
    END IF;

    -- 3. Allowlist self-award reasons
    IF target_user_id = auth.uid() AND caller_role <> 'admin' AND reason NOT IN (
        'lesson_complete', 'game_reward', 'referral_bonus',
        'daily_mission', 'weekly_challenge', 'debate_win',
        'gig_complete', 'rent_collection', 'corporation_reward'
    ) THEN
        RAISE EXCEPTION 'Invalid reward reason: %', reason;
    END IF;

    -- 4. Amount validation: clamp between 1 and 10,000
    IF amount <= 0 OR amount > 10000 THEN
        RAISE EXCEPTION 'Invalid award amount: %. Must be between 1 and 10000.', amount;
    END IF;

    -- 5. RATE LIMITING: max 1 award per same reason per 30 seconds for self-awards
    IF target_user_id = auth.uid() AND caller_role <> 'admin' THEN
        SELECT COUNT(*) INTO recent_award_count
        FROM public.security_audit_logs
        WHERE actor_id    = auth.uid()
          AND action      = 'pp_tokens_awarded'
          AND reason      = award_pp_tokens.reason
          AND created_at  > now() - interval '30 seconds';

        IF recent_award_count > 0 THEN
            RAISE EXCEPTION 'Rate limit exceeded. Please wait before claiming another reward for: %', reason;
        END IF;
    END IF;

    -- 6. Apply the token update
    UPDATE profiles
    SET pp_tokens = COALESCE(pp_tokens, 0) + amount
    WHERE id = target_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', target_user_id;
    END IF;

    -- 7. Write an explicit audit log entry for this award
    INSERT INTO public.security_audit_logs (actor_id, action, target_id, new_value, reason, metadata)
    VALUES (
        auth.uid(),
        'pp_tokens_awarded',
        target_user_id,
        amount::TEXT,
        reason,
        jsonb_build_object('awarded_by_admin', caller_role = 'admin')
    );
END;
$$;

REVOKE ALL ON FUNCTION award_pp_tokens(UUID, INT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION award_pp_tokens(UUID, INT, TEXT) TO authenticated;


-- ================================================================
-- 4. UPDATED admin_update_user_role RPC — adds audit log entry
-- ================================================================
CREATE OR REPLACE FUNCTION admin_update_user_role(
    target_user_id UUID,
    new_role       TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    old_role TEXT;
BEGIN
    -- Only admins can change roles
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND lower(role) = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    -- Validate the new role is in the allowed set
    IF new_role NOT IN ('KID', 'PARENT', 'TEACHER', 'ADMIN') THEN
        RAISE EXCEPTION 'Invalid role: %. Must be KID, PARENT, TEACHER, or ADMIN.', new_role;
    END IF;

    -- Capture old role before changing
    SELECT role INTO old_role FROM profiles WHERE id = target_user_id;

    UPDATE profiles SET role = new_role WHERE id = target_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', target_user_id;
    END IF;

    -- Explicit audit trail (the trigger will also fire, creating a second record for defense-in-depth)
    INSERT INTO public.security_audit_logs (actor_id, action, target_id, old_value, new_value, reason, metadata)
    VALUES (
        auth.uid(),
        'admin_role_change',
        target_user_id,
        old_role,
        new_role,
        'admin_rpc_call',
        jsonb_build_object('elevated_to_admin', new_role = 'ADMIN')
    );
END;
$$;

REVOKE ALL ON FUNCTION admin_update_user_role(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_update_user_role(UUID, TEXT) TO authenticated;


-- ================================================================
-- 5. LEAN fetch_all_profiles_admin
--    Returns only the columns needed for the Admin Console.
--    Omits PII like parent_id, billing data from the bulk payload.
-- ================================================================
-- Must DROP first — return type changed from SETOF profiles → specific TABLE columns
DROP FUNCTION IF EXISTS fetch_all_profiles_admin();

CREATE OR REPLACE FUNCTION fetch_all_profiles_admin()
RETURNS TABLE (
    id                  UUID,
    username            TEXT,
    role                TEXT,
    email               TEXT,
    xp                  INT,
    level               INT,
    pp_tokens           INT,
    subscription_tier   TEXT,
    subscription_status TEXT,
    last_activity_date  TEXT,
    created_at          TIMESTAMPTZ,
    hq_level            TEXT,
    badges              JSONB,
    invite_code         TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Server-side role check
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND lower(profiles.role) = 'admin'
    ) THEN
        -- Log the unauthorized access attempt
        INSERT INTO public.security_audit_logs (actor_id, action, reason, metadata)
        VALUES (auth.uid(), 'admin_access_denied', 'fetch_all_profiles_admin', '{}');
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    -- Log this admin data access event
    INSERT INTO public.security_audit_logs (actor_id, action, reason, metadata)
    VALUES (auth.uid(), 'admin_data_access', 'fetch_all_profiles_admin', jsonb_build_object('table', 'profiles'));

    RETURN QUERY
        SELECT
            p.id, p.username, p.role, p.email,
            p.xp, p.level, p.pp_tokens,
            p.subscription_tier, p.subscription_status,
            p.last_activity_date, p.created_at,
            p.hq_level, p.badges, p.invite_code
        FROM public.profiles p;
END;
$$;

REVOKE ALL ON FUNCTION fetch_all_profiles_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION fetch_all_profiles_admin() TO authenticated;
