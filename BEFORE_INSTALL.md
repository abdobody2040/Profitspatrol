# ✅ BEFORE INSTALL — Profits Patrol Pre-Launch Checklist

> Complete every item in this file **before** deploying to production or distributing to real users.
> Last updated: 2026-03-04 | Matches audit performed on this date.

---

## 1️⃣ Environment Variables — Set All Before Build

Copy `.env.example` → `.env.production` and fill in **every** value below. Missing values will silently break features or expose data.

```env
# ─── Supabase (Required) ──────────────────────────────────────
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard

# ─── Stripe (Required for payments) ──────────────────────────
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# ─── AI (Required for Ollie / Debate / Book AI) ───────────────
VITE_GEMINI_API_KEY=your-gemini-api-key

# ─── Monitoring — REQUIRED before go-live (see section 2) ────
VITE_SENTRY_DSN=https://xxxxx@xxxxxx.ingest.sentry.io/xxxxxx
```

> ⚠️ **Never commit `.env.production` to git.** Confirm `.gitignore` contains `.env*`.

---

## 2️⃣ Sentry — Wire Production Monitoring (Critical)

The app currently has zero production error visibility. `Logger.sendToRemote()` is a stub.

### Step 1 — Install

```bash
npm install @sentry/react
```

### Step 2 — Initialize in `src/app/main.tsx`

```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        tracesSampleRate: 0.1,          // 10% of transactions
        environment: 'production',
        // Never send PII — Sentry scrubs these automatically with beforeSend
        beforeSend(event) {
            // Strip user email/name from Sentry payloads
            if (event.user) {
                delete event.user.email;
                delete event.user.username;
            }
            return event;
        },
    });
}
```

### Step 3 — Wire `sendToRemote` in `src/services/logger.ts`

```typescript
// At top of file:
import * as Sentry from '@sentry/react';

// Replace the sendToRemote stub body:
private sendToRemote(log: Record<string, unknown>) {
    if (typeof window !== 'undefined' && import.meta.env.PROD) {
        Sentry.captureMessage(log.message as string, {
            level: (log.level as string).toLowerCase() as Sentry.SeverityLevel,
            extra: log,
        });
    }
}
```

---

## 3️⃣ Supabase Edge Functions — Deploy Before Payments Work

Two Edge Functions are called by the client. Both must be deployed:

| Function | File | Purpose |
|---|---|---|
| `create-checkout-session` | `supabase/functions/create-checkout-session/` | Stripe checkout — controls pricing server-side |
| `create-billing-portal-session` | `supabase/functions/create-billing-portal-session/` | Subscription management portal |
| `log-security-event` | `supabase/functions/log-security-event/` | Security event logging from client |

### Deploy command

```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-billing-portal-session
supabase functions deploy log-security-event
```

### `create-billing-portal-session` (must implement if not already)

```typescript
// supabase/functions/create-billing-portal-session/index.ts
import Stripe from 'https://esm.sh/stripe@13.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

Deno.serve(async (req) => {
    const { userId } = await req.json();
    // Look up stripeCustomerId from your DB using userId
    const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${Deno.env.get('SITE_URL')}/settings`,
    });
    return new Response(JSON.stringify({ url: session.url }), {
        headers: { 'Content-Type': 'application/json' },
    });
});
```

---

## 4️⃣ Stripe Webhook — Configure in Dashboard

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing Secret** → add to Supabase Secrets:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 5️⃣ Supabase Database — Apply All Migrations

```bash
supabase db push
```

Verify these tables exist:

- `profiles` — with RLS policies for kid/parent/teacher/admin roles
- `moderation_whitelist`
- `moderation_blacklist`
- `security_events` (logged by `log-security-event` function)

---

## 6️⃣ Admin Account — Assign via Supabase (Never via Registration Form)

The registration form **does not allow `role: 'admin'`** (fixed in audit). To create an admin:

```sql
-- Run in Supabase SQL Editor
UPDATE profiles
SET role = 'ADMIN'
WHERE email = 'your-admin@email.com';
```

---

## 7️⃣ Security Verification — Run Before Launch

### a) Dependency Audit

```bash
npm audit --audit-level=high
```

Resolve all HIGH and CRITICAL CVEs before launch.

### b) XSS Test

1. Create a test account with username: `<script>alert('xss')</script>`
2. Navigate to Profile → Year End Report → Preview
3. **Expected:** Alert does NOT execute. Name renders as plain text.

### c) Rate Limit Test

```bash
# Run 15 AI chat requests in rapid succession
# The 11th request must be blocked with a rate limit message
```

### d) Role Escalation Test

1. Open browser DevTools console while logged in as a kid
2. Run: `useAppStore.setState({ currentUser: { ...store.currentUser, role: 'ADMIN' } })`
3. **Expected:** Admin dashboard must NOT be accessible — Supabase RLS must reject all admin queries server-side regardless of client state.

### e) Payment Tampering Test

1. Open DevTools Network tab
2. Initiate checkout for `intern` (free tier)
3. **Expected:** The price sent to Stripe is controlled entirely by the Edge Function. Intercepting and modifying the request must NOT change the charged amount.

---

## 8️⃣ COPPA / GDPR Compliance Checklist

- [ ] **Privacy Policy** — Published at a public URL, linked from registration and footer
- [ ] **Parental Consent** — Math gate implemented in `ParentalGate.tsx` — verify it's shown before any kid data is collected
- [ ] **Data Deletion** — `AccountDeletionService.ts` tested end-to-end — verify Supabase cascade deletes all child data
- [ ] **Cookie Banner** — If using cookies/analytics, banner must appear before any tracking
- [ ] **Right to Access** — `DataExportService.ts` generates and delivers user's own data on request
- [ ] **Data Minimization** — localStorage no longer stores child name/email (applied in audit)
- [ ] **Age Gate** — Registration must confirm parent email for all `kid` role accounts

---

## 9️⃣ Performance — Pre-Launch Checks

```bash
# Build and check bundle size
npm run build
npx vite-bundle-visualizer

# Run Lighthouse audit on production build
npm run preview
# Then run Lighthouse in Chrome DevTools → target > 90 Performance score
```

Key checks:

- [ ] All heavy routes are **lazy loaded** (`React.lazy()`)
- [ ] `localStorage` usage is below 3MB (run `JSON.stringify(localStorage).length` in DevTools console)
- [ ] No uncleared `setInterval` / `setTimeout` in components that unmount frequently

---

## 🔟 Final Deployment Commands

```bash
# 1. Run dependency audit
npm audit --audit-level=high

# 2. Type-check
npx tsc --noEmit

# 3. Lint
npm run lint

# 4. Build
npm run build

# 5. Deploy Edge Functions
supabase functions deploy --all

# 6. Apply DB migrations
supabase db push

# 7. Deploy frontend (example: Vercel)
vercel --prod
```

---

## 🔑 Quick Reference — What the Audit Fixed (Automatically)

| Fix | File | Status |
|---|---|---|
| XSS via `dangerouslySetInnerHTML` | `YearEndReport.tsx` | ✅ Fixed |
| Rate limiter random clear bug | `gemini.ts` | ✅ Fixed |
| Raw error objects leaked to console | `logger.ts` | ✅ Fixed |
| `console.warn` instead of Logger in security events | `promptSanitizer.ts` | ✅ Fixed |
| Child PII keys missing from log redaction | `logger.ts` | ✅ Fixed |
| `admin` role self-assignable from registration | `authSchemas.ts` | ✅ Fixed |
| Unsalted SHA-256 password hashing | `security.ts` | ✅ Fixed |
| Full user PII stored in localStorage | `store/index.ts` | ✅ Fixed |
| Whitelist bypassed all moderation | `ContentModerationService.ts` | ✅ Fixed |
| Stripe portal returned hardcoded dashboard URL | `stripe.ts` | ✅ Fixed |
| `generateBookDetails` had no security guards | `gemini.ts` | ✅ Fixed |

---

## 🚨 Incident Response — Quick Reference

| Scenario | Action |
|---|---|
| Data breach suspected | Revoke all Supabase sessions: `supabase auth admin signOut --all-users` |
| Stripe key compromised | Rotate in Stripe Dashboard → update `STRIPE_SECRET_KEY` in Supabase Secrets |
| Gemini API abuse detected | Rotate key in Google Cloud Console → update `VITE_GEMINI_API_KEY` |
| GDPR breach notification | Must notify affected users **within 72 hours** of discovery |
| Child safety incident | Contact NCMEC (US): `1-800-843-5678` or `CyberTipline.org` |
