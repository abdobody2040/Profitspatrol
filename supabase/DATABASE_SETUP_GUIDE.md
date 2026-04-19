# Database Setup Guide - Profits Patrol

## Overview

This guide explains how to deploy the comprehensive `MASTER_SCHEMA.sql` to your Supabase project.

## ⚠️ IMPORTANT: Fresh Start Required

The `MASTER_SCHEMA.sql` is designed for a **clean database**. If you have existing data or conflicting policies, you need to clean up first.

## Option 1: Fresh Database (Recommended)

### Step 1: Reset Database (Supabase Dashboard)

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **Reset Database** section
3. Click **Reset Database** (⚠️ This deletes ALL data)
4. Confirm the reset

### Step 2: Run MASTER_SCHEMA.sql

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy the entire contents of `supabase/MASTER_SCHEMA.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)
6. Wait for completion (should take 5-10 seconds)

### Step 3: Verify Setup

Run this verification query:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Expected output:

- **Tables**: `profiles`, `classrooms`, `classroom_members`, `assignments`, `submissions`, `bounties`, `security_events`, `moderated_content`, `moderation_whitelist`, `moderation_blacklist`, `parental_gate`, `account_deletion`, `webhook_events`, `friends`, `student_groups`, `rubrics`
- **RLS Enabled**: All tables should show `rowsecurity = true`
- **Triggers**: `on_auth_user_created`, `update_profiles_updated_at`, `update_classrooms_updated_at`, `update_assignments_updated_at`

## Option 2: Incremental Update (If You Have Data)

⚠️ **Only use this if you have important data you cannot lose**

### Step 1: Backup Your Data

```sql
-- Export profiles
COPY (SELECT * FROM profiles) TO '/tmp/profiles_backup.csv' CSV HEADER;

-- Export classrooms
COPY (SELECT * FROM classrooms) TO '/tmp/classrooms_backup.csv' CSV HEADER;
```

### Step 2: Drop Conflicting Policies

```sql
-- Drop all existing policies on profiles
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Repeat for other tables as needed
```

### Step 3: Run MASTER_SCHEMA.sql

Follow Step 2 from Option 1.

## Post-Deployment Checklist

### 1. Test User Registration

```sql
-- Check if trigger creates profiles automatically
SELECT * FROM auth.users LIMIT 1;
SELECT * FROM profiles WHERE id = '<user_id_from_above>';
```

### 2. Test Family Linking

```sql
-- Generate invite code for a parent
UPDATE profiles 
SET invite_code = 'TEST-' || substr(md5(random()::text), 1, 6)
WHERE id = '<parent_user_id>';

-- Link a kid to parent
UPDATE profiles 
SET parent_id = '<parent_user_id>'
WHERE id = '<kid_user_id>';

-- Verify subscription inheritance
SELECT * FROM get_user_subscription_status('<kid_user_id>');
```

### 3. Test RLS Policies

```sql
-- As a user, try to view another user's profile (should fail)
SET request.jwt.claims.sub = '<user_a_id>';
SELECT * FROM profiles WHERE id = '<user_b_id>';
-- Expected: No rows returned

-- As a parent, view linked child (should succeed)
SET request.jwt.claims.sub = '<parent_id>';
SELECT * FROM profiles WHERE parent_id = '<parent_id>';
-- Expected: Child profile returned
```

## Troubleshooting

### Error: "relation already exists"

**Solution**: You have existing tables. Use Option 2 (Incremental Update) or reset the database.

### Error: "policy already exists"

**Solution**: The schema uses `DROP POLICY IF EXISTS` to prevent this. If you still see this error, manually drop policies:

```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Error: "permission denied for table"

**Solution**: RLS is blocking you. Make sure you're authenticated:

```sql
SELECT auth.uid(); -- Should return your user ID
```

### Registration fails with "401 Unauthorized"

**Solution**: The trigger `on_auth_user_created` should handle this. Verify it exists:

```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

## Key Features Included

✅ **Profiles**: Complete user data with family linking  
✅ **Education**: Classrooms, assignments, submissions, rubrics  
✅ **Family**: Bounties (chores), parent-child linking, subscription inheritance  
✅ **Security**: Event logging, content moderation, parental gate  
✅ **Subscriptions**: Stripe integration, tiered access  
✅ **Social**: Friends system  
✅ **Performance**: Optimized indexes on all foreign keys  
✅ **Compliance**: GDPR deletion requests, audit trails  

## Next Steps

1. ✅ Run `MASTER_SCHEMA.sql` in Supabase SQL Editor
2. ✅ Verify all tables and triggers are created
3. ✅ Test user registration from your app
4. ✅ Test family linking flow
5. ✅ Configure Stripe webhook endpoint (if using subscriptions)

## Support

If you encounter issues, check:

- Supabase Dashboard → **Logs** → **Postgres Logs**
- Browser Console for client-side errors
- `supabase/FIX_PROFILE_TRIGGER.sql` (legacy, now integrated into MASTER_SCHEMA)
