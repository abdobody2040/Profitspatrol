# ProfitsPatrol — Translation Style Guide

> **Goal**: Zero-error localisation for every new feature, with a repeatable workflow any developer can follow.

---

## 🗂️ File Layout

```
src/locales/
  en.ts   ← MASTER  (single source of truth — never translate this file)
  ar.ts   ← Arabic
  es.ts   ← Spanish
  fr.ts   ← French
  de.ts   ← German
scripts/
  sync-locales.cjs  ← dev tool (see §5)
```

---

## ✅ Rule 1 — `en.ts` is the only source of truth

- **Always add new keys to `en.ts` first.**
- Never add a key to a locale file that does not exist in `en.ts`.
- Never rename or delete a key from `en.ts` without updating every locale file.

---

## ✅ Rule 2 — String quoting rules (most common crash cause)

Locale values are TypeScript string literals. Follow these rules to avoid syntax errors:

### ✅ Safe: No quotes inside value
```ts
title: 'The Secret Ingredient',
```

### ✅ Safe: Single quotes inside → use double-quote delimiters
```ts
scenario: "You found a 'super sweetener' that makes lemonade taste better.",
```

### ✅ Safe: Double quotes inside → use single-quote delimiters
```ts
feedback: 'Investors say "I love it!" when you mention revenue.',
```

### ✅ Safe: Both types of quotes inside → use a template literal
```ts
msg: `He said "Don't worry!" and left.`,
```

### ❌ Wrong: Same delimiter used inside and outside
```ts
// ❌ CRASH — parser sees the string end at the first inner '
scenario: 'You found a 'super sweetener'',
```

> **Quick fix**: Run `npm run locale:fix-quotes` and it fixes this automatically for every locale file.

---

## ✅ Rule 3 — Arrays must always be arrays

Game instructions, review lists, and step arrays **must** be JavaScript arrays `[]`, never objects `{}`.

### ✅ Correct
```ts
instructions: [
  'اضبط منزلقات استراتيجيتك.',
  'اشترِ ترقيات.',
],
```

### ❌ Wrong (causes `instructions.map is not a function` crash)
```ts
instructions: { 0: 'اضبط...', 1: 'اشترِ...' },
```

---

## ✅ Rule 4 — Interpolation variables must be preserved exactly

i18next uses `{{variable}}` syntax. The variable name must be **identical** to the English version.

### ✅ Correct
```ts
// en.ts
read_count: '{{done}}/{{total}} articles read today',

// ar.ts
read_count: 'تمت قراءة {{done}} من أصل {{total}} مقالات اليوم',
```

### ❌ Wrong
```ts
// ar.ts — variable renamed → will show raw text in UI
read_count: 'تمت قراءة {{تم}}/{{الكل}} مقالات',
```

---

## ✅ Rule 5 — How to add a new feature (step-by-step)

### Step 1 — Add keys to `en.ts`
```ts
// en.ts — inside the appropriate section:
my_feature: {
  title: 'My New Feature',
  desc: 'A description of what it does.',
  btn: 'Click Me',
},
```

### Step 2 — Check what is missing in all locales
```bash
npm run locale:check
```
Output shows each locale and its missing key count.

### Step 3 — Sync missing keys (auto-adds English placeholders)
```bash
npm run locale:sync ar   # for Arabic
npm run locale:sync es   # for Spanish  (etc.)
```
The tool inserts the English value with a `/* TODO:ar */` comment so you can find it easily.

### Step 4 — Translate the TODO entries
Open `src/locales/ar.ts`, search for `TODO:ar`, and replace with the Arabic translation.

### Step 5 — Fix any quote errors
```bash
npm run locale:fix-quotes
```

### Step 6 — Final check
```bash
npm run locale:check
```
All locales should show ✅.

---

## ✅ Rule 6 — `t()` key patterns

### ✅ Use static keys
```tsx
const { t } = useTranslation();
return <h1>{t('nav.map')}</h1>;
```

### ❌ Never concatenate keys dynamically
```tsx
// ❌ CRASH — i18next cannot resolve dynamic keys
return <h1>{t('nav.' + section)}</h1>;
```

### ✅ Use the key-mapping utility instead
```tsx
import { TIER_KEYS } from '@/utils/translationMappings';

const label = t(TIER_KEYS[user.subscriptionTier]);
```
Add new mappings to `src/utils/translationMappings.ts` as needed.

---

## 🛠️ Available CLI Commands

| Command | What it does |
|---|---|
| `npm run locale:check` | Lint all locale files — syntax + missing keys |
| `npm run locale:diff ar` | Show exactly which keys are missing in Arabic |
| `npm run locale:sync ar` | Add missing keys as English placeholders |
| `npm run locale:fix-quotes` | Auto-fix embedded-quote syntax errors |

---

## 📋 Quick Checklist for every PR that adds UI text

- [ ] New strings added to `en.ts` first
- [ ] `npm run locale:check` shows 0 missing keys
- [ ] No embedded quotes using the same delimiter
- [ ] All `{{variables}}` preserved in every locale
- [ ] All list values use `[]` arrays, not `{}` objects
- [ ] `npm run locale:fix-quotes` run before committing

---

## 🚨 Most Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Expected "}" but found "X"` | Embedded single-quote in single-quoted string | `npm run locale:fix-quotes` |
| `instructions.map is not a function` | Array stored as object `{}` | Change to `[]` array |
| Translation key shown raw in UI | Dynamic string concatenation in `t()` | Use `translationMappings.ts` |
| Missing key falls back to English | Key added to locale but not `en.ts` (or vice versa) | Run `locale:check` |
