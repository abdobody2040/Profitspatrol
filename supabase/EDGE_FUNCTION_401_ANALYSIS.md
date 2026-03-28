# Edge Function 401 Error - Root Cause Analysis

## Problem

The `create-checkout-session` Edge Function returns **401 Unauthorized** when called from the frontend, even after deploying with `--no-verify-jwt`.

## Root Cause

The `--no-verify-jwt` flag only disables JWT verification at the **Supabase Gateway level**, but the **Edge Function code itself** still performs authentication checks (lines 44-65 in `index.ts`):

```typescript
// Edge Function still checks for auth header
const authHeader = req.headers.get('authorization');
if (!authHeader) {
    return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
        { status: 401, headers }
    );
}
```

## Why Demo Account Fails

The demo account (`mom/123`) is likely a **local-only account** that doesn't have a Supabase Auth session. Therefore:

1. No JWT token is generated for this user
2. No `Authorization` header is sent with the Edge Function request
3. Edge Function rejects the request with 401

## Solutions

### Option 1: Create Real Supabase User (Recommended)

1. Create a user in Supabase Auth Dashboard
2. Add corresponding profile in database
3. Log in with real credentials
4. Test payment flow

### Option 2: Modify Edge Function for Testing

Remove auth checks temporarily for testing:

```typescript
// TEMPORARY: Skip auth for testing
const authHeader = req.headers.get('authorization');
let authUser = null;

if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
        authUser = user;
    }
}

// For testing: allow requests without auth
// TODO: Re-enable auth before production
```

### Option 3: Fix Local Auth Integration

Update the local authentication system to create Supabase Auth sessions for demo accounts.

## Next Steps

1. **Immediate**: Create a real Supabase user for testing
2. **Short-term**: Add debug logging to see exact error (already done, needs redeployment)
3. **Long-term**: Integrate local auth with Supabase Auth properly

## Deployment Issue

Current blocker: Supabase deployment timing out with "Bundle generation timed out"

- Try again later
- Or use Supabase Dashboard to view Edge Function logs
