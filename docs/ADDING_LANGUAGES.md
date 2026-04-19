# Adding New Languages to Profits Patrol

This guide explains how to add a new language to the application in **less than 30 minutes**.

## Prerequisites

- Node.js installed
- Basic understanding of JSON/TypeScript objects
- Access to translation services (optional but recommended)

## Quick Start

### Step 1: Generate Language Template

Run the language template generator:

```bash
node scripts/generate-language-template.js <language-code>
```

**Example:**
```bash
node scripts/generate-language-template.js fr  # French
node scripts/generate-language-template.js es  # Spanish (already exists)
node scripts/generate-language-template.js de  # German
```

This creates a new file `src/locales/<language-code>.ts` with all translation keys marked as `[TODO]`.

### Step 2: Translate Strings

Open the generated file (e.g., `src/locales/fr.ts`) and replace all `[TODO]` markers with translations:

**Before:**
```typescript
nav: {
  map: "[TODO] Adventure Map",
  games: "[TODO] Arcade",
  // ...
}
```

**After:**
```typescript
nav: {
  map: "Carte d'Aventure",
  games: "Arcade",
  // ...
}
```

**Translation Tips:**
- Use Find & Replace to search for `[TODO]`
- Keep formatting characters like `{{variable}}` unchanged
- Preserve line breaks (`\n`) in multi-line strings
- Test special characters (é, ñ, ü, etc.) display correctly

### Step 3: Register Language

Add the new language to `src/locales/index.ts`:

```typescript
import { en } from './en';
import { ar } from './ar';
import { fr } from './fr';  // Add this

export const resources = {
  en: { translation: en.translation },
  ar: { translation: ar.translation },
  fr: { translation: fr.translation }  // Add this
};
```

### Step 4: Add Language Selector Option

Update the language selector in `src/components/layout/Layout.tsx`:

Find the language dropdown and add your language:

```typescript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }  // Add this
];
```

### Step 5: Verify Completeness

Run the translation checker:

```bash
node scripts/check-translations.js
```

This will show:
- Translation completeness percentage
- Missing keys (if any)
- Extra keys (if any)

**Example output:**
```
✅ fr.ts
   Completeness: 100% (1850/1850 keys)
```

### Step 6: Test in Browser

1. Start the dev server: `npm run dev`
2. Open the app in your browser
3. Switch to the new language using the language selector
4. Navigate through all pages to verify translations display correctly
5. Check for:
   - Untranslated strings (showing English or `[TODO]`)
   - Layout issues (text overflow, broken UI)
   - Special characters rendering correctly

## Common Language Codes

| Code | Language | Native Name |
|:-----|:---------|:------------|
| `en` | English | English |
| `ar` | Arabic | العربية |
| `fr` | French | Français |
| `es` | Spanish | Español |
| `de` | German | Deutsch |
| `it` | Italian | Italiano |
| `pt` | Portuguese | Português |
| `ru` | Russian | Русский |
| `zh` | Chinese | 中文 |
| `ja` | Japanese | 日本語 |
| `ko` | Korean | 한국어 |
| `hi` | Hindi | हिन्दी |
| `tr` | Turkish | Türkçe |

## Translation Best Practices

### 1. Context Matters

Some words have different translations based on context:

```typescript
// "Play" as a verb (to play a game)
play_game: "Jouer"

// "Play" as a noun (a theatrical play)
theater_play: "Pièce"
```

### 2. Preserve Variables

Keep variable placeholders unchanged:

```typescript
// ✅ Correct
greeting: "Bonjour, {{name}}!"

// ❌ Wrong
greeting: "Bonjour, {{nom}}!"  // Don't translate variable names
```

### 3. Maintain Formatting

Preserve special formatting:

```typescript
// Keep line breaks
multiline: "Line 1\nLine 2\nLine 3"

// Keep markdown
formatted: "**Bold** and *italic*"

// Keep HTML entities
special: "Price: ${{amount}}"
```

### 4. Cultural Adaptation

Adapt content for cultural relevance:

```typescript
// English (US dollars)
currency: "Earn $100"

// French (Euros might be more relevant)
currency: "Gagnez 100€"
```

### 5. Right-to-Left (RTL) Languages

For RTL languages like Arabic, Hebrew, Urdu:

- Text direction is handled automatically by i18next
- Test UI layout carefully
- Some icons/arrows may need mirroring

## Troubleshooting

### Issue: Translation keys showing as raw text

**Symptom:** Seeing `the_tank.tier_tycoon` instead of translated text

**Cause:** String concatenation in `t()` calls

**Solution:** Use translation mappings from `src/utils/translationMappings.ts`:

```typescript
// ❌ Wrong
t('the_tank.tier_' + tier)

// ✅ Correct
import { TIER_KEYS } from '@/utils/translationMappings';
t(TIER_KEYS[tier])
```

### Issue: TypeScript errors after adding language

**Symptom:** Type errors in IDE

**Solution:** Restart TypeScript server:
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Or restart your IDE

### Issue: Missing translations in production

**Symptom:** Some strings show in English even though translated

**Solution:**
1. Run `node scripts/check-translations.js`
2. Check for missing keys
3. Verify language file is imported in `src/locales/index.ts`

## Automated Translation (Optional)

For quick first drafts, you can use AI translation services:

### Using Google Translate API

```bash
# Install dependencies
npm install @google-cloud/translate

# Create translation script
node scripts/auto-translate.js fr
```

### Using ChatGPT/Claude

1. Copy the English translation object
2. Paste into ChatGPT with prompt:
   ```
   Translate this TypeScript object to French.
   Keep all keys unchanged, only translate string values.
   Preserve {{variables}} and formatting.
   ```
3. Review and refine the output

**⚠️ Important:** Always review automated translations for:
- Context accuracy
- Cultural appropriateness
- Technical term correctness

## Maintenance

### Updating Existing Languages

When adding new features with new translation keys:

1. Add keys to `en.ts` first (source of truth)
2. Run `node scripts/check-translations.js`
3. Add missing keys to other language files
4. Test all languages

### Deprecating Keys

When removing features:

1. Remove keys from `en.ts`
2. Run checker to find extra keys in other languages
3. Remove extra keys to keep files clean

## Support

For questions or issues:
- Check existing translations in `src/locales/`
- Review translation mappings in `src/utils/translationMappings.ts`
- Run `node scripts/check-translations.js` for diagnostics
