# Quick Fix: Create Test User in Supabase Dashboard

Since signup is failing, create a test user directly in Supabase:

## Steps

1. Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/auth/users>
2. Click **"Add user"** button
3. Fill in:
   - **Email**: <testuser@example.com>
   - **Password**: Test123456!
   - **Auto Confirm User**: ✅ Check this box
4. Click "Create user"

## Then Test Payment

1. Go to your app: <http://localhost:5173/login>
2. Log in with:
   - Email: <testuser@example.com>
   - Password: Test123456!
3. Navigate to: <http://localhost:5173/checkout/founder>
4. Click "Subscribe"

This will bypass the signup issue and let you test the payment flow immediately!

---

## To Fix Signup Later

The "auth.error_generic" error is likely because:

- Email confirmation is required but not configured
- SMTP settings are missing
- Or there's a validation issue

To fix:

1. Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/auth/settings>
2. Under "Email Auth":
   - Disable "Confirm email" (for testing)
   - Or configure SMTP settings
