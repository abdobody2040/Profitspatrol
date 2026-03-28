# Stripe Pricing Issue - Diagnostic Guide

## Problem

The pricing page shows correct amounts, but Stripe checkout shows wrong prices:

- **Expected**: Founder $9.99, Board $19.99, Tycoon $49.99
- **Actual in Stripe**: Founder $0.10, Board $0.15, Tycoon (unknown)

## Root Cause

The Stripe Price IDs in your code point to products with incorrect pricing in your Stripe account.

## Solution: Update Stripe Products

### Option 1: Verify Existing Prices (Recommended)

1. Go to: <https://dashboard.stripe.com/test/products>
2. Check each product's price:
   - **Founder** (price_1T0L85Gpy11OSRPTUZ1sd9Mk) - Should be $9.99/month
   - **Board Member** (price_1T0L8nGpy11OSRPTLjd3VN80) - Should be $19.99/month  
   - **Tycoon** (price_1T0L99Gpy11OSRPT108LWOpN) - Should be $49.99/month

3. If prices are wrong, you have two options:
   - **A)** Edit the existing prices (if Stripe allows)
   - **B)** Create new prices with correct amounts (see Option 2)

### Option 2: Create New Prices

If you need to create new prices:

1. Go to Stripe Dashboard → Products
2. For each tier, click "Add price"
3. Set the correct amount:
   - Founder: **$9.99** (enter as 9.99, NOT 999)
   - Board Member: **$19.99**
   - Tycoon: **$49.99**
4. Set billing period: **Monthly**
5. Copy the new Price ID (starts with `price_...`)

6. Update the Edge Function with new Price IDs:
   - Edit: `supabase/functions/create-checkout-session/index.ts`
   - Update lines 22-24 with your new Price IDs
   - Redeploy: `npx supabase functions deploy create-checkout-session`

## Current Price IDs in Code

```typescript
'founder': { price: 999, priceId: 'price_1T0L85Gpy11OSRPTUZ1sd9Mk' },
'board': { price: 1999, priceId: 'price_1T0L8nGpy11OSRPTLjd3VN80' },
'tycoon': { price: 4999, priceId: 'price_1T0L99Gpy11OSRPT108LWOpN' },
```

**Note**: The `price` field (999, 1999, 4999) is in CENTS and is correct. The issue is with the Stripe Price IDs pointing to products with wrong amounts.

## Quick Fix

The fastest solution is to create new recurring prices in Stripe with the correct amounts, then update the Price IDs in the code.
