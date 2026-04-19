-- Friends table to track relationships
CREATE TABLE friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    friend_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT friends_status_check CHECK (user_id != friend_id)
);

-- Unique index to prevent duplicate friendships (A->B and B->A should be treated as same link logically, 
-- but usually apps store one record per direction or enforce A < B. 
-- Here we enforce uniqueness on the pair to ensure only one record exists regardless of direction if we sort them, 
-- OR we can just rely on the application to always query both directions.
-- A simpler approach for queries is to simple ensure (user_id, friend_id) is unique, but that allows A->B and B->A.
-- Let's stick to the double-entry or single-entry system. 
-- For a robust social graph, usually we want:
-- 1. "Request" is A->B (status=pending)
-- 2. "Friends" is A->B (status=accepted) AND B->A (status=accepted) OR valid if just one record exists.
-- Let's go with the single-record approach where we query (user_id = X OR friend_id = X).
-- To prevent duplicates:
CREATE UNIQUE INDEX friends_unique_pair_idx ON friends (LEAST(user_id, friend_id), GREATEST(user_id, friend_id));

-- RLS Policies
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Users can view their own friendships or pending requests involving them
CREATE POLICY "Users can view their own friendships"
ON friends FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can insert a friend request (sender = auth.uid())
CREATE POLICY "Users can send friend requests"
ON friends FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update status if they are the recipient (accept) or sender (cancel/block)
CREATE POLICY "Users can update their friendships"
ON friends FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Function to get leaderboard (Global)
CREATE OR REPLACE FUNCTION get_global_leaderboard(result_limit INT DEFAULT 50, result_offset INT DEFAULT 0)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    avatar_url TEXT,
    level INT,
    xp INT,
    net_worth NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as user_id,
        p.username,
        p.avatar_url,
        COALESCE(g.level, 1) as level,
        COALESCE(g.xp, 0) as xp,
        COALESCE(g.coins, 0) as net_worth -- Using coins as proxy for net worth for now, ideally it's assets + cash
    FROM profiles p
    LEFT JOIN game_state g ON p.id = g.user_id
    ORDER BY g.coins DESC NULLS LAST
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
