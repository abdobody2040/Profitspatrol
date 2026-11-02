-- ================================================================
-- SECURITY HARDENING: Server-Side RPC Functions
-- Replaces client-side supabaseAdmin usage with SECURITY DEFINER
-- functions that validate the caller's role server-side.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. fetch_all_profiles_admin
--    Allows an authenticated ADMIN to fetch all profiles.
--    The function uses SECURITY DEFINER to run as the function owner
--    (bypasses RLS), but validates the caller is an admin first.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fetch_all_profiles_admin()
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Server-side role check: reject non-admins before returning any data
    IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND lower(role) = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
        SELECT * FROM profiles;
END;
$$;

-- Revoke public access; only authenticated users can call it
REVOKE ALL ON FUNCTION fetch_all_profiles_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION fetch_all_profiles_admin() TO authenticated;


-- ----------------------------------------------------------------
-- 2. award_pp_tokens
--    Server-side token award function.
--    Used instead of client-side pp_tokens arithmetic to prevent
--    manipulation. Validates caller and reason before updating.
-- ----------------------------------------------------------------
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
    caller_role TEXT;
BEGIN
    -- Get the calling user's role
    SELECT lower(role) INTO caller_role FROM profiles WHERE id = auth.uid();

    -- Only admins can award tokens to other users.
    -- A user can only award tokens to themselves if the reason is in the allowlist.
    IF target_user_id <> auth.uid() AND caller_role <> 'admin' THEN
        RAISE EXCEPTION 'Access denied. Cannot award tokens to another user.';
    END IF;

    -- Allowlist self-award reasons (game rewards, referrals, etc.)
    IF target_user_id = auth.uid() AND reason NOT IN (
        'lesson_complete', 'game_reward', 'referral_bonus',
        'daily_mission', 'weekly_challenge', 'debate_win',
        'gig_complete', 'rent_collection', 'corporation_reward'
    ) THEN
        RAISE EXCEPTION 'Invalid reward reason: %', reason;
    END IF;

    -- Clamp to a sane max per single award to prevent exploitation
    IF amount <= 0 OR amount > 10000 THEN
        RAISE EXCEPTION 'Invalid award amount: %. Must be between 1 and 10000.', amount;
    END IF;

    UPDATE profiles
    SET pp_tokens = COALESCE(pp_tokens, 0) + amount
    WHERE id = target_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', target_user_id;
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION award_pp_tokens(UUID, INT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION award_pp_tokens(UUID, INT, TEXT) TO authenticated;


-- ----------------------------------------------------------------
-- 3. admin_update_user_role
--    Allows an admin to change a user's role server-side.
--    Prevents client-side role tampering.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION admin_update_user_role(
    target_user_id UUID,
    new_role       TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

    UPDATE profiles SET role = new_role WHERE id = target_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', target_user_id;
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION admin_update_user_role(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_update_user_role(UUID, TEXT) TO authenticated;
