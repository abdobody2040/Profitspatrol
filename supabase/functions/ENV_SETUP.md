# Payment Security - Environment Variables

## Required Environment Variables

Add these to your `.env` file:

```bash
# Stripe (Client-side - SAFE to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51T0KeJGpy11OSRPTeSCiVoH4Ez278d9XoyyGWHGgPlkcJkBWRgcCjQUWcfhaC7y43zkiIQbLngqTzOGepptOpzhq00OEVLPa2b  # Get from Stripe Dashboard

# Supabase (Client-side - SAFE to expose)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Get from Supabase Dashboard
```

## Supabase Edge Function Secrets

Set these in **Supabase Dashboard > Edge Functions > Secrets**:

```bash
# Stripe (Server-side - NEVER expose in client)
STRIPE_SECRET_KEY=sk_test_51T0KeJGpy11OSRPTc9DPFPqP2sf6BSxKmVDHxRYcrCG638j89aA8N3mLxmewBEdK1IvROplk9Ps3n1uTNORLJtkb00iYIRpDCA # Get from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...  # Get after creating webhook endpoint

# Supabase (Server-side - NEVER expose in client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Get from Supabase Dashboard > Settings > API
```

---

## Setup Instructions

### 1. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY` (for Edge Functions)

### 2. Create Stripe Products & Prices

1. Go to Stripe Dashboard > Products
2. Create products for each tier:
   - **Founder** - $9.99/month  price_1T0L85Gpy11OSRPTUZ1sd9Mk
   - **Board Member** - $19.99/month
   price_1T0L8nGpy11OSRPTLjd3VN80
   - **Tycoon** - $49.99/month
   price_1T0L99Gpy11OSRPT108LWOpN
3. Copy each **Price ID** (starts with `price_...`)

4. Update `supabase/functions/create-checkout-session/index.ts`:

   ```typescript
   const TIER_PRICING = {
     'founder': { price: 999, priceId: 'price_YOUR_FOUNDER_ID' },
     'board': { price: 1999, priceId: 'price_YOUR_BOARD_ID' },
     'tycoon': { price: 4999, priceId: 'price_YOUR_TYCOON_ID' },
   };
   ```

### 3. Set up Webhook

1. Deploy `stripe-webhook` Edge Function first:

   ```bash
   supabase functions deploy stripe-webhook
   ```

2. Go to Stripe Dashboard > Developers > Webhooks
3. Click "Add endpoint"
4. Enter URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
6. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`
whsec_7dyhyIY4tmidUPPTyKffszBDhYo3rsEn

### 4. Test Payment Flow

```bash
# Use Stripe test card
Card number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## Security Checklist

- ✅ `VITE_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_` or `pk_live_`
- ✅ `STRIPE_SECRET_KEY` starts with `sk_test_` or `sk_live_`
- ✅ `STRIPE_WEBHOOK_SECRET` starts with `whsec_`
- ✅ Never commit `.env` file to git
- ✅ Use test keys during development
- ✅ Switch to live keys only in production

---

## Troubleshooting

### "No session ID returned"

- Check Edge Function logs in Supabase Dashboard
- Verify `STRIPE_SECRET_KEY` is set correctly
- Ensure Stripe products/prices exist

### "Webhook signature verification failed"

- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check webhook endpoint URL is correct
- Ensure Edge Function is deployed

### "Payment not updating user subscription"

- Check `stripe-webhook` Edge Function logs
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Ensure `profiles` table exists in Supabase
