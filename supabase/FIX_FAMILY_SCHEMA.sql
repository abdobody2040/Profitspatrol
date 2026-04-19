-- 1. Add Parent-Child Columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;

-- 2. Create Index for Performance
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_invite_code ON profiles(invite_code);

-- 3. RLS Policies for Family Access

-- Allow Parents to see their Kids' profiles
DROP POLICY IF EXISTS "Parents can view linked children" ON profiles;
CREATE POLICY "Parents can view linked children" 
ON profiles FOR SELECT 
TO authenticated
USING (parent_id = (select auth.uid()));

-- Allow Kids to see their Parent's profile (for subscription sync)
-- Helper to prevent RLS recursion
CREATE OR REPLACE FUNCTION get_my_parent_id()
RETURNS UUID
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT parent_id FROM profiles WHERE id = (select auth.uid());
$$ LANGUAGE sql STABLE;

-- Allow Kids to see their Parent's profile (for subscription sync)
DROP POLICY IF EXISTS "Kids can view their parent" ON profiles;
CREATE POLICY "Kids can view their parent" 
ON profiles FOR SELECT 
TO authenticated
USING (id = get_my_parent_id());

-- Allow Parents to update their Kids' profiles (e.g. settings)
DROP POLICY IF EXISTS "Parents can update linked children" ON profiles;
CREATE POLICY "Parents can update linked children" 
ON profiles FOR UPDATE 
TO authenticated
USING (parent_id = (select auth.uid()));

-- Allow Users to insert their own profile (Critical for registration)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (id = (select auth.uid()));

-- Allow Users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (id = (select auth.uid()));

-- 4. Database Function to Get Family Subscription Status
-- This function can be called by the app to determine if a user has premium access
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid UUID)
RETURNS TABLE (priority_tier TEXT, priority_status TEXT) 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    my_role TEXT;
    my_parent UUID;
    parent_tier TEXT;
    parent_status TEXT;
    my_tier TEXT;
    my_status TEXT;
BEGIN
    -- Get current user details
    SELECT role, parent_id, subscription_tier, subscription_status 
    INTO my_role, my_parent, my_tier, my_status 
    FROM profiles WHERE id = user_uuid;

    -- CASE 1: Admin always gets Tycoon
    IF my_role = 'ADMIN' THEN
        RETURN QUERY SELECT 'tycoon', 'active';
        RETURN;
    END IF;

    -- CASE 2: Parent returns their own status (defaults to free/intern if null)
    IF my_role = 'PARENT' OR my_role = 'TEACHER' THEN
        RETURN QUERY SELECT COALESCE(my_tier, 'intern'), COALESCE(my_status, 'free');
        RETURN;
    END IF;

    -- CASE 3: Kid check for Parent
    IF my_role = 'KID' OR my_role = 'kid' THEN
        IF my_parent IS NOT NULL THEN
            -- Fetch Parent Status
            SELECT subscription_tier, subscription_status 
            INTO parent_tier, parent_status 
            FROM profiles WHERE id = my_parent;
            
            -- If Parent is active, inherit it. Otherwise, use Kid's own status (which might be free)
            IF parent_status = 'active' THEN
                RETURN QUERY SELECT parent_tier, 'active';
                RETURN;
            END IF;
        END IF;

        -- Fallback to Kid's own status
        RETURN QUERY SELECT COALESCE(my_tier, 'intern'), COALESCE(my_status, 'free');
        RETURN;
    END IF;

    -- Default fallback
    RETURN QUERY SELECT 'intern', 'free';
END;
$$ LANGUAGE plpgsql;
