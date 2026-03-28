-- =========================================================================
-- FIX: Allow deletion of users from auth.users
-- Issue: Some tables reference auth.users(id) without ON DELETE CASCADE.
-- This prevents deleting users from the Supabase dashboard.
-- =========================================================================

-- 1. Fix 'friends' table
DO $$ 
BEGIN
    -- Drop existing constraints if they exist
    ALTER TABLE IF EXISTS public.friends DROP CONSTRAINT IF EXISTS friends_user_id_fkey;
    ALTER TABLE IF EXISTS public.friends DROP CONSTRAINT IF EXISTS friends_friend_id_fkey;
    
    -- Re-add with ON DELETE CASCADE pointing to public.profiles
    -- (auth.users CASCADE deletes profiles, which then CASCADE deletes friends)
    ALTER TABLE IF EXISTS public.friends 
        ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
        
    ALTER TABLE IF EXISTS public.friends 
        ADD CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping friends table fix (might not exist or different schema): %', SQLERRM;
END $$;

-- 2. Fix 'moderated_content' table
DO $$ 
BEGIN
    ALTER TABLE IF EXISTS public.moderated_content DROP CONSTRAINT IF EXISTS moderated_content_user_id_fkey;
    ALTER TABLE IF EXISTS public.moderated_content DROP CONSTRAINT IF EXISTS moderated_content_reviewed_by_fkey;
    
    ALTER TABLE IF EXISTS public.moderated_content 
        ADD CONSTRAINT moderated_content_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
        
    ALTER TABLE IF EXISTS public.moderated_content 
        ADD CONSTRAINT moderated_content_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping moderated_content table fix: %', SQLERRM;
END $$;

-- 3. Fix 'moderation_whitelist' table
DO $$ 
BEGIN
    ALTER TABLE IF EXISTS public.moderation_whitelist DROP CONSTRAINT IF EXISTS moderation_whitelist_created_by_fkey;
    ALTER TABLE IF EXISTS public.moderation_whitelist DROP CONSTRAINT IF EXISTS moderation_whitelist_added_by_fkey;
    
    ALTER TABLE IF EXISTS public.moderation_whitelist 
        ADD CONSTRAINT moderation_whitelist_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping moderation_whitelist table fix: %', SQLERRM;
END $$;

-- 4. Fix 'moderation_blacklist' table
DO $$ 
BEGIN
    ALTER TABLE IF EXISTS public.moderation_blacklist DROP CONSTRAINT IF EXISTS moderation_blacklist_created_by_fkey;
    
    ALTER TABLE IF EXISTS public.moderation_blacklist 
        ADD CONSTRAINT moderation_blacklist_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping moderation_blacklist table fix: %', SQLERRM;
END $$;

-- 5. Fix 'bounties' table
DO $$ 
BEGIN
    ALTER TABLE IF EXISTS public.bounties DROP CONSTRAINT IF EXISTS bounties_parent_id_fkey;
    ALTER TABLE IF EXISTS public.bounties DROP CONSTRAINT IF EXISTS bounties_claimed_by_fkey;
    
    ALTER TABLE IF EXISTS public.bounties 
        ADD CONSTRAINT bounties_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
        
    ALTER TABLE IF EXISTS public.bounties 
        ADD CONSTRAINT bounties_claimed_by_fkey FOREIGN KEY (claimed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping bounties table fix: %', SQLERRM;
END $$;

-- 6. Ensure public.profiles cascades from auth.users
DO $$ 
BEGIN
    ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
    
    ALTER TABLE IF EXISTS public.profiles 
        ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN 
    RAISE NOTICE 'Skipping profiles table fix: %', SQLERRM;
END $$;
