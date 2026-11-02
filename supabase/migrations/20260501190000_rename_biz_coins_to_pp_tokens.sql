-- Rename biz_coins to pp_tokens in profiles table (Idempotent)
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'biz_coins'
    ) THEN
        ALTER TABLE public.profiles RENAME COLUMN biz_coins TO pp_tokens;
    END IF;
END $$;

-- Update comments
COMMENT ON COLUMN public.profiles.pp_tokens IS 'User currency (formerly BizCoins)';

-- Update functions that use biz_coins
CREATE OR REPLACE FUNCTION get_economy_stats()
RETURNS JSON AS $$
DECLARE
    total_tokens BIGINT;
    avg_tokens NUMERIC;
    total_users INT;
    tycoons_count INT;
BEGIN
    -- Security Check
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    SELECT 
        COALESCE(SUM(pp_tokens), 0),
        COALESCE(AVG(pp_tokens), 0),
        COUNT(*)
    INTO total_tokens, avg_tokens, total_users
    FROM profiles;

    -- Define "Tycoon" as having more than 5000 PP Tokens
    SELECT COUNT(*) INTO tycoons_count FROM profiles WHERE pp_tokens > 5000;

    RETURN json_build_object(
        'total_supply', total_tokens,
        'avg_balance_per_user', ROUND(avg_tokens, 2),
        'total_users', total_users,
        'tycoons_count', tycoons_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
