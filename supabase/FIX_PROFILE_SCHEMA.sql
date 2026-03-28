-- 1. Add missing columns if they don't exist
alter table profiles add column if not exists role text default 'kid';
alter table profiles add column if not exists subscription_status text default 'free';
alter table profiles add column if not exists subscription_tier text default 'intern';

-- 2. Update the admin user to have the correct role and privileges
-- IMPORTANT: 'Tycoon' is just a subscription tier. 'admin' is the User Role.
-- We set the role to 'admin' to grant access to the Admin Dashboard (Settings).
update profiles
set 
    role = 'ADMIN', -- Must be 'ADMIN' (case sensitive if matching enum, but usually lowercase in DB - let's try uppercase to match Enum ID or lowercase if app maps it)
    -- Actually, let's check how SupabaseAdapter maps it. It maps directly: role: profile.role.
    -- The Enum is "ADMIN". So we should store "ADMIN".
    subscription_status = 'active',
    subscription_tier = 'tycoon', -- Admins can have Tycoon features too
    biz_coins = 1000000
where username = 'admin';

-- 3. Verify the result
select * from profiles where username = 'admin';
