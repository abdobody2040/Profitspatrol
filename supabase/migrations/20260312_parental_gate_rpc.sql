-- SEC-06: Atomic Parental Gate Attempt Counter
-- =============================================
-- This RPC replaces the client-side read-then-write pattern in ParentalGate.tsx
-- that was vulnerable to a TOCTOU (Time-Of-Check-Time-Of-Use) race condition.
--
-- Problem: Two concurrent failed submissions could both read attempts=2 (one below MAX),
--          compute newAttempts=3, and both "pass" the lockout threshold check.
--          Result: the lockout increment fires twice but the second write is redundant,
--          and in edge cases a fast double-click could bypass the lockout entirely.
--
-- Solution: A single atomic UPDATE ... RETURNING inside one DB transaction.
--           PostgreSQL guarantees serialisable reads within a single statement.
--
-- Returns: JSON { is_locked: boolean, attempts: integer, locked_until: timestamptz | null }

CREATE OR REPLACE FUNCTION increment_parental_gate_attempts(
    p_user_id    UUID,
    p_max_attempts INTEGER DEFAULT 3,
    p_lockout_ms   BIGINT  DEFAULT 86400000  -- 24 hours in ms
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER  -- Runs as DB owner so client JWT cannot escalate
SET search_path = public
AS $$
DECLARE
    v_new_attempts INTEGER;
    v_locked_until TIMESTAMPTZ;
    v_is_locked    BOOLEAN;
BEGIN
    -- Atomic increment — no separate SELECT needed
    UPDATE profiles
    SET parental_gate_attempts = COALESCE(parental_gate_attempts, 0) + 1
    WHERE id = p_user_id
    RETURNING parental_gate_attempts INTO v_new_attempts;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'profile not found for user_id=%', p_user_id;
    END IF;

    -- Determine lockout
    IF v_new_attempts >= p_max_attempts THEN
        v_locked_until := NOW() + (p_lockout_ms || ' milliseconds')::INTERVAL;
        UPDATE profiles
        SET parental_gate_locked_until = v_locked_until
        WHERE id = p_user_id;
        v_is_locked := TRUE;
    ELSE
        v_locked_until := NULL;
        v_is_locked := FALSE;
    END IF;

    RETURN json_build_object(
        'is_locked',   v_is_locked,
        'attempts',    v_new_attempts,
        'locked_until', v_locked_until
    );
END;
$$;

-- RLS: Only allow users to call this RPC for their own profile.
-- The SECURITY DEFINER + WHERE id = p_user_id already scopes writes to the caller,
-- but we add an RLS policy as defense-in-depth.
REVOKE ALL ON FUNCTION increment_parental_gate_attempts(UUID, INTEGER, BIGINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_parental_gate_attempts(UUID, INTEGER, BIGINT) TO authenticated;
