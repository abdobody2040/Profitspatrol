-- Add season_xp to profiles
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS season_xp INTEGER DEFAULT 0;

-- Function to reset seasonal XP (can be called by cron or admin)
CREATE OR REPLACE FUNCTION public.reset_seasonal_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles SET season_xp = 0;
END;
$$;

-- Function to get seasonal leaderboard securely
CREATE OR REPLACE FUNCTION public.get_seasonal_leaderboard(limit_count integer DEFAULT 100)
RETURNS TABLE (
  id uuid,
  username text,
  xp integer,
  season_xp integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.xp, p.season_xp
  FROM public.profiles p
  ORDER BY p.season_xp DESC NULLS LAST, p.xp DESC NULLS LAST
  LIMIT limit_count;
END;
$$;

-- Ensure get_leaderboard returns the all-time leaderboard as expected (in case it wasn't defined in migrations)
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count integer DEFAULT 100)
RETURNS TABLE (
  id uuid,
  username text,
  xp integer,
  season_xp integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.xp, p.season_xp
  FROM public.profiles p
  ORDER BY p.xp DESC NULLS LAST
  LIMIT limit_count;
END;
$$;

-- Trigger to automatically calculate season_xp delta when xp increases
CREATE OR REPLACE FUNCTION public.tr_update_season_xp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.xp > OLD.xp THEN
    -- Ignore whatever season_xp was sent, just add the delta
    NEW.season_xp := OLD.season_xp + (NEW.xp - OLD.xp);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_profiles_season_xp ON public.profiles;
CREATE TRIGGER tr_profiles_season_xp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.tr_update_season_xp();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_seasonal_leaderboard(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(integer) TO authenticated;
