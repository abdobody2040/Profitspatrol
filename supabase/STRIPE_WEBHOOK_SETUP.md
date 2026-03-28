# Stripe Webhook Configuration

## ✅ Edge Functions Deployed

Both Edge Functions are now live in production:

- **create-checkout-session**: `https://pftydgfqwbhfyikfxcxa.supabase.co/functions/v1/create-checkout-session`
- **stripe-webhook**: `https://pftydgfqwbhfyikfxcxa.supabase.co/functions/v1/stripe-webhook`

## 🔧 Configure Stripe Webhook

Follow these steps to complete the integration:

### 1. Add Webhook Endpoint in Stripe Dashboard

1. Go to: <https://dashboard.stripe.com/test/webhooks>
2. Click **"Add endpoint"**
3. Enter the endpoint URL:

   ```
   https://pftydgfqwbhfyikfxcxa.supabase.co/functions/v1/stripe-webhook
   ```

### 2. Select Events to Listen To

Select these events:

- ✅ `checkout.session.completed` - When payment succeeds
- ✅ `customer.subscription.deleted` - When subscription is canceled
- ✅ `invoice.payment_failed` - When payment fails

### 3. Verify Webhook Secret

The webhook signing secret is already configured in Supabase:

- `STRIPE_WEBHOOK_SECRET=whsec_7dyhyIY4tmidUPPTyKffszBDhYo3rsEn`

**Important:** If you create a NEW webhook endpoint, you'll get a NEW signing secret. If that happens, update the secret:

```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_NEW_SECRET
```

### 4. Test the Webhook

After configuring, Stripe will send a test event. Check:

1. Stripe Dashboard → Webhooks → Your endpoint → "Recent deliveries"
2. Supabase Dashboard → Edge Functions → stripe-webhook → Logs

You should see successful 200 responses.

---

## 🧪 Test the Payment Flow

### Test Checkout Flow

1. Navigate to: <http://localhost:5173/checkout/founder>
2. Click "Subscribe"
3. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
4. Complete payment

### Verify Success

After payment:

1. Check Supabase Dashboard → Database → `profiles` table
2. Your user's `subscription_tier` should be updated to `'founder'`
3. Check `webhook_events` table for the logged event

---

## 📋 Deployment Checklist

- [x] Set Stripe secrets in Supabase
- [x] Deploy `create-checkout-session` function
- [x] Deploy `stripe-webhook` function
- [ ] Configure Stripe webhook endpoint
- [ ] Test payment flow end-to-end

---

## 🔗 Useful Links

- **Supabase Functions Dashboard**: <https://supabase.com/dashboard/project/pftydgfqwbhfyikfxcxa/functions>
- **Stripe Webhooks**: <https://dashboard.stripe.com/test/webhooks>
- **Stripe Test Cards**: <https://stripe.com/docs/testing#cards>
