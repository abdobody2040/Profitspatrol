-- Migration: Add Referral System
-- Description: Adds referral tracking to profiles, generates unique codes, and creates an RPC for rewards.

-- 1. Add referral columns to public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;

-- 2. Function to generate a random 6-character alphanumeric referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
    is_unique BOOLEAN := false;
BEGIN
    WHILE NOT is_unique LOOP
        result := '';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if it exists
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = result) THEN
            is_unique := true;
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Trigger to auto-generate referral code for new users
CREATE OR REPLACE FUNCTION set_referral_code_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON public.profiles;
CREATE TRIGGER trigger_set_referral_code
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_referral_code_on_insert();

-- 4. Backfill existing users with referral codes
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM public.profiles WHERE referral_code IS NULL LOOP
        UPDATE public.profiles 
        SET referral_code = generate_referral_code() 
        WHERE id = r.id;
    END LOOP;
END;
$$;

-- 5. RPC Function to process a referral signup and grant rewards
-- This should be called by the client AFTER successful registration if an invite code was used.
CREATE OR REPLACE FUNCTION process_referral_signup(
    p_invite_code TEXT,
    p_new_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_referrer_id UUID;
    v_reward_amount INTEGER := 500; -- BizCoins reward
BEGIN
    -- Find the referrer
    SELECT id INTO v_referrer_id 
    FROM public.profiles 
    WHERE referral_code = p_invite_code;

    -- If referrer doesn't exist, exit slightly gracefully (return false)
    IF v_referrer_id IS NULL THEN
        RETURN false;
    END IF;

    -- Prevent self-referral
    IF v_referrer_id = p_new_user_id THEN
        RETURN false;
    END IF;

    -- Update the new user's referred_by field
    UPDATE public.profiles 
    SET referred_by = v_referrer_id 
    WHERE id = p_new_user_id;

    -- Increment the referrer's total_referrals count
    UPDATE public.profiles 
    SET total_referrals = total_referrals + 1 
    WHERE id = v_referrer_id;

    -- Grant the reward to the referrer using the existing add_bizcoins function (assuming it exists)
    -- Or directly update the balance if add_bizcoins is not a DB function
    UPDATE public.profiles
    SET bizcoins = COALESCE(bizcoins, 0) + v_reward_amount
    WHERE id = v_referrer_id;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
