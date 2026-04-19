# Supabase Edge Functions Configuration

This directory contains Supabase Edge Functions for secure server-side operations.

## Functions

### 1. create-checkout-session
**Purpose:** Create Stripe checkout sessions with server-side pricing authority

**Security:** 
- ✅ Pricing controlled server-side (prevents client manipulation)
- ✅ Validates plan IDs
- ✅ Includes user metadata for tracking

**Environment Variables Required:**
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_test_... or sk_live_...)

**Usage:**
```typescript
const { data } = await supabase.functions.invoke('create-checkout-session', {
  body: { planId: 'founder', userId: user.id }
});
```

---

### Supabase Edge Functions - Payment Security

This directory contains secure, server-side Edge Functions for payment processing with Stripe.

---

## 🔒 Security Features

### ✅ Critical Security Fixes (Jan 28, 2026)

1. **Idempotency Protection** - Prevents duplicate webhook processing
2. **User Authentication** - JWT token verification for checkout sessions
3. **Modern Stripe API** - Uses recommended redirect approach

---

## 📦 Functions

### 1. `create-checkout-session`

Creates Stripe checkout sessions with **server-side pricing authority**.

**Security:**
- ✅ Server controls pricing (client cannot manipulate)
- ✅ JWT authentication required
- ✅ User ID validation (prevents unauthorized checkouts)
- ✅ Plan validation

**Request:**
```json
{
  "planId": "founder",
  "userId": "user-uuid"
}
```

**Headers Required:**
```
Authorization: Bearer <supabase-jwt-token>
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

### 2. `stripe-webhook`

Handles Stripe webhook events with **cryptographic signature verification**.

**Security:**
- ✅ Signature verification (prevents fake webhooks)
- ✅ Idempotency check (prevents duplicate processing)
- ✅ Error logging for failed events

**Events Handled:**
- `checkout.session.completed` - Upgrade user subscription
- `customer.subscription.deleted` - Downgrade to free tier
- `invoice.payment_failed` - Log payment failures

---

## 🗄️ Database Setup

### Required Migration

Before deploying, run the database migration to create the `webhook_events` table:

```bash
# Apply migration
psql $DATABASE_URL -f supabase/migrations/20260128_webhook_events.sql

# Or via Supabase CLI
supabase db push
```

**Table Schema:**
```sql
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT CHECK (status IN ('processed', 'failed')),
    error_message TEXT,
    processed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);
```

---

## 🚀 Deployment

### 1. Set Environment Variables

In **Supabase Dashboard > Edge Functions > Secrets**:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 2. Deploy Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy both functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### 3. Configure Stripe Webhook

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy **Signing secret** → Set as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testing

### Test Checkout Flow

```bash
# Use Stripe test card
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# Trigger test event
stripe trigger checkout.session.completed
```

---

## 📊 Monitoring

### Check Webhook Processing

```sql
-- View recent webhook events
SELECT * FROM webhook_events 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for failed events
SELECT * FROM webhook_events 
WHERE status = 'failed'
ORDER BY created_at DESC;

-- Find duplicate events (should be none)
SELECT stripe_event_id, COUNT(*) 
FROM webhook_events 
GROUP BY stripe_event_id 
HAVING COUNT(*) > 1;
```

### Edge Function Logs

View logs in **Supabase Dashboard > Edge Functions > Logs**

---

## 🔧 Troubleshooting

### "Unauthorized: Missing authorization header"
- Ensure client sends `Authorization: Bearer <token>` header
- Check Supabase client is authenticated

### "Forbidden: User ID mismatch"
- User trying to checkout for different user
- Security feature working correctly

### "Webhook signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure webhook endpoint URL is correct

### "Duplicate webhook event"
- Normal - Stripe may retry webhooks
- Idempotency protection working correctly

---

## 📝 Notes

- **Deno TypeScript Errors:** Expected and safe to ignore (Edge Functions run in Deno, not Node.js)
- **Test Mode:** Use `sk_test_` and `pk_test_` keys during development
- **Production:** Switch to `sk_live_` and `pk_live_` keys only in production

---

**Last Updated:** January 28, 2026  
**Version:** 2.0 (Critical Security Fixes Applied)
t:** Only `VITE_STRIPE_PUBLISHABLE_KEY` should be in client code

---

## Monitoring

Check function logs in Supabase Dashboard > Edge Functions > Logs

Common issues:
- Missing environment variables
- Invalid Stripe keys
- Webhook signature mismatch
- Database permission errors
