# Manual User Creation for Testing Payment Flow

The automated registration is still encountering issues. Let's create a test user manually in Supabase.

## Steps

### 1. Create User in Supabase Auth

1. Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/auth/users>
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `payment_test@example.com`
   - **Password**: `Test123456!`
   - ✅ **Auto Confirm User**: Check this box
4. Click **"Create user"**
5. **Copy the User ID** (UUID format like `a1b2c3d4-...`)

### 2. Create Profile in Database

1. Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/editor>
2. Click on **`profiles`** table
3. Click **"Insert"** → **"Insert row"**
4. Fill in:
   - **id**: Paste the User ID from step 1
   - **username**: `payment_test`
   - **full_name**: `Payment Test User`
   - **subscription_tier**: `intern`
   - **subscription_status**: `active`
5. Click **"Save"**

### 3. Test Login & Payment

1. Go to: <http://localhost:5000/login>
2. Log in with:
   - Email: `payment_test@example.com`
   - Password: `Test123456!`
3. Navigate to: <http://localhost:5000/checkout/founder>
4. Click **"Subscribe"**
5. **Verify the Stripe checkout shows $9.99** (not $0.10!)

## Expected Result

You should be redirected to Stripe Checkout with the correct price of **$9.99/month** for the Founder plan.
