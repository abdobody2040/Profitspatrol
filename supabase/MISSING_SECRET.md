# Missing Secret - Action Required

## Issue

The payment flow is failing because the Edge Function is missing the `SUPABASE_SERVICE_ROLE_KEY` secret.

## How to Fix

1. **Get your Service Role Key:**
   - Go to: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/settings/api>
   - Scroll to "Project API keys"
   - Copy the **service_role** key (starts with `eyJ...`)

2. **Set the secret:**

   ```bash
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...YOUR_KEY_HERE
   ```

3. **Test again:**
   - Navigate to `/checkout/founder`
   - Try the payment flow

The service role key is needed for the Edge Function to:

- Verify user authentication
- Update user profiles after payment
- Access the database with elevated permissions
