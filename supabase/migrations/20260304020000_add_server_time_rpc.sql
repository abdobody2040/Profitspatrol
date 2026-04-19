-- ============================================================
-- Migration: Add get_server_time() RPC function
-- Purpose  : Provide a trusted server timestamp to the client
--            for idle-income clock-skew detection (CRIT-05).
--
-- Security notes:
--   - Exposed to the 'anon' role (unauthenticated callers OK;
--     timestamp is not sensitive data).
--   - Security definer is NOT used — no elevated privileges needed.
--   - Returns UTC epoch milliseconds (same unit as Date.now()).
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_server_time()
RETURNS bigint
LANGUAGE sql
STABLE          -- does not modify data; result is consistent within a transaction
AS $$
  SELECT EXTRACT(EPOCH FROM NOW())::bigint * 1000;  -- UTC milliseconds
$$;

-- Grant execute to both anonymous and authenticated callers
GRANT EXECUTE ON FUNCTION public.get_server_time() TO anon;
GRANT EXECUTE ON FUNCTION public.get_server_time() TO authenticated;

COMMENT ON FUNCTION public.get_server_time() IS
  'Returns the current UTC time as milliseconds since epoch (same unit as JS Date.now()). '
  'Used by the client to detect forward clock-skew in idle income collection (CRIT-05).';
