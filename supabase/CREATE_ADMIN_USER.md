# Create Admin User in Supabase

Follow these steps to create your admin user:

## Step 1: Create Auth User

1. Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/auth/users>
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `admin@kidcaphq.com` (or your preferred email)
   - **Password**: (choose a strong password)
   - ✅ **Auto Confirm User**: Check this box
4. Click **"Create user"**
5. **IMPORTANT: Copy the User ID** (it's a UUID like `a1b2c3d4-e5f6-...`)

## Step 2: Create Profile in Database

1. Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/editor>
2. Click on **`profiles`** table
3. Click **"Insert"** → **"Insert row"**
4. Fill in:
   - **id**: (paste the User ID from Step 1)
   - **username**: `admin`
   - **full_name**: `Admin User`
   - **email**: `admin@kidcaphq.com` (same as Step 1)
   - **subscription_tier**: `tycoon`
   - **subscription_status**: `active`
5. Click **"Save"**

## Step 3: Verify

You should now be able to log in with:

- **Email**: `admin@kidcaphq.com`
- **Password**: (the password you set in Step 1)

---

**Once you've completed these steps, let me know and I'll update the code!**
