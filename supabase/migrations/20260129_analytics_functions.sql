-- Migration: Analytics RPC Functions
-- Created: 2026-01-29
-- Purpose: Provide aggregated data for Admin Reports Dashboard

-- 1. Get User Growth (New Users per Date)
CREATE OR REPLACE FUNCTION get_user_growth_stats(days_lookback INT DEFAULT 30)
RETURNS TABLE (
    date DATE,
    count BIGINT
) AS $$
BEGIN
    -- Security Check
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
    FROM profiles
    WHERE created_at >= NOW() - (days_lookback || ' days')::INTERVAL
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Get Economy Stats (Total Money Supply & Distribution)
CREATE OR REPLACE FUNCTION get_economy_stats()
RETURNS JSON AS $$
DECLARE
    total_coins BIGINT;
    avg_coins NUMERIC;
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
        COALESCE(SUM(biz_coins), 0),
        COALESCE(AVG(biz_coins), 0),
        COUNT(*)
    INTO total_coins, avg_coins, total_users
    FROM profiles;

    -- Define "Tycoon" as having more than 5000 BizCoins
    SELECT COUNT(*) INTO tycoons_count FROM profiles WHERE biz_coins > 5000;

    RETURN json_build_object(
        'total_supply', total_coins,
        'avg_balance_per_user', ROUND(avg_coins, 2),
        'total_users', total_users,
        'tycoons_count', tycoons_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Get Learning Stats (Quiz Performance from Submissions)
CREATE OR REPLACE FUNCTION get_learning_stats(days_lookback INT DEFAULT 30)
RETURNS TABLE (
    date DATE,
    avg_grade NUMERIC,
    submissions_count BIGINT
) AS $$
BEGIN
    -- Security Check
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
    SELECT 
        DATE(submitted_at) as date,
        ROUND(AVG(COALESCE(grade, 0)), 2) as avg_grade,
        COUNT(*) as submissions_count
    FROM submissions
    WHERE submitted_at >= NOW() - (days_lookback || ' days')::INTERVAL
    GROUP BY DATE(submitted_at)
    ORDER BY DATE(submitted_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
