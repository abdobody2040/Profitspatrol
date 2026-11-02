-- Fix fetch_all_profiles_admin return type mismatch
-- badges is TEXT[] in the database, not JSONB

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
    last_activity_date  DATE,
    created_at          TIMESTAMP,
    hq_level            TEXT,
    badges              TEXT[],
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
