# Supabase Edge Functions - TypeScript Configuration

**Note:** Edge Functions run in Deno runtime, not Node.js.

The TypeScript errors you see for Deno imports are **expected and safe to ignore**.

## Why These Errors Occur

Edge Functions use Deno-specific imports:
- `https://deno.land/std@0.168.0/http/server.ts`
- `https://esm.sh/stripe@14.0.0?target=deno`
- `https://esm.sh/@supabase/supabase-js@2`

These are valid in Deno but not recognized by the TypeScript compiler in your IDE.

## Solution

The `tsconfig.json` in this directory excludes all files to prevent IDE errors.

**These files will compile correctly when deployed to Supabase.**

## Deployment

```bash
# Deploy functions (will work despite IDE errors)
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

The Deno runtime will resolve these imports correctly.
