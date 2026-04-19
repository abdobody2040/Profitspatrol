#!/usr/bin/env node
/**
 * sync-locales.cjs  —  ProfitsPatrol Translation Dev Tool
 * =========================================================
 * Commands
 *   node scripts/sync-locales.cjs check          → lint all locale files
 *   node scripts/sync-locales.cjs sync <locale>  → add missing keys from en.ts
 *   node scripts/sync-locales.cjs diff <locale>  → show what keys are missing
 *   node scripts/sync-locales.cjs fix-quotes      → auto-fix embedded-quote errors
 */
'use strict';
const fs   = require('fs');
const path = require('path');

// ── helpers ──────────────────────────────────────────────────────────────────
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const EN_FILE     = path.join(LOCALES_DIR, 'en.ts');
const LOCALES     = ['ar', 'es', 'fr', 'de'];

function readTS(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeTS(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

/** Attempt a quick syntax check by wrapping in a Function() call */
function syntaxCheck(file) {
  const src = readTS(file);
  const varName = path.basename(file, '.ts');
  const js = src
    .replace(/^export const \w+ =/, 'const _x =')
    .replace(/} as const;\s*$/, '}');
  try {
    new Function(js); // eslint-disable-line no-new-func
    return null; // no error
  } catch (e) {
    return e.message;
  }
}

/** Fix single-quotes embedded inside single-quoted string values */
function fixQuotes(file) {
  const lines = readTS(file).split('\n');
  let fixed = 0;
  const out = lines.map(line => {
    // match:  <prefix>: 'value'<optional comma>
    const m = line.match(/^(\s*\S.*?:\s*)'(.*)',?\s*$/);
    if (!m) return line;
    const rawValue = m[2];
    const unescaped = (rawValue.match(/(?<!\\)'/g) || []).length;
    if (unescaped === 0) return line;
    fixed++;
    const safeValue   = rawValue.replace(/"/g, '\\"');
    const trailingComma = line.trimEnd().endsWith(',') ? ',' : '';
    return `${m[1]}"${safeValue}"${trailingComma}`;
  });
  if (fixed > 0) {
    writeTS(file, out.join('\n'));
    console.log(`  ✅ Fixed ${fixed} quote error(s) in ${path.basename(file)}`);
  } else {
    console.log(`  ✅ No quote errors in ${path.basename(file)}`);
  }
}

/** Extract every leaf string key from a TS locale object (flat dotted paths) */
function extractKeys(src) {
  const keys = new Set();
  // Match:  someKey: 'value'  or  someKey: "value"  or  someKey: `value`
  const lineRe = /^\s*(\w+)\s*:\s*(?:'[^']*'|"[^"]*"|`[^`]*`)/gm;
  // We also want object paths — build a crude stack
  const stackRe = /^(\s*)(\w+)\s*:\s*\{/gm;
  const stack = [];
  const lines = src.split('\n');

  for (const line of lines) {
    // Track object open
    const openM = line.match(/^(\s*)(\w+)\s*:\s*\{/);
    if (openM) {
      stack.push({ indent: openM[1].length, key: openM[2] });
      continue;
    }
    // Track object close
    if (/^\s+\}/.test(line)) {
      const myIndent = line.match(/^(\s*)/)[1].length;
      while (stack.length && stack[stack.length - 1].indent >= myIndent) {
        stack.pop();
      }
      continue;
    }
    // Leaf value
    const leafM = line.match(/^\s*(\w+)\s*:\s*(?:'|"|`)/);
    if (leafM) {
      const prefix = stack.map(s => s.key).join('.');
      keys.add(prefix ? `${prefix}.${leafM[1]}` : leafM[1]);
    }
  }
  return keys;
}

/** Print a check report for every locale */
function cmdCheck() {
  console.log('\n🔍  Checking all locale files…\n');
  for (const locale of LOCALES) {
    const file = path.join(LOCALES_DIR, `${locale}.ts`);
    if (!fs.existsSync(file)) { console.log(`  ⚠️  ${locale}.ts not found`); continue; }

    // 1. Syntax
    const err = syntaxCheck(file);
    if (err) {
      console.log(`  ❌ ${locale}.ts  SYNTAX ERROR: ${err}`);
      continue;
    }

    // 2. Missing keys
    const enSrc   = readTS(EN_FILE);
    const locSrc  = readTS(file);
    const enKeys  = extractKeys(enSrc);
    const locKeys = extractKeys(locSrc);
    const missing = [...enKeys].filter(k => !locKeys.has(k));

    if (missing.length === 0) {
      console.log(`  ✅ ${locale}.ts — ${locKeys.size} keys — all present`);
    } else {
      console.log(`  ⚠️  ${locale}.ts — ${missing.length} missing keys:`);
      missing.slice(0, 20).forEach(k => console.log(`       • ${k}`));
      if (missing.length > 20) console.log(`       … and ${missing.length - 20} more`);
    }
  }
  console.log();
}

/** Add missing keys to a locale (copies raw English value as placeholder) */
function cmdSync(locale) {
  const file = path.join(LOCALES_DIR, `${locale}.ts`);
  if (!fs.existsSync(file)) { console.error(`${locale}.ts not found`); process.exit(1); }

  console.log(`\n🔄  Syncing missing keys into ${locale}.ts…\n`);

  const enLines  = readTS(EN_FILE).split('\n');
  let   locSrc   = readTS(file);
  const locKeys  = extractKeys(locSrc);
  const enKeys   = extractKeys(readTS(EN_FILE));

  const missing  = [...enKeys].filter(k => !locKeys.has(k));
  if (missing.length === 0) { console.log('  ✅ Nothing to sync — all keys present!\n'); return; }

  console.log(`  Adding ${missing.length} missing keys (English value as placeholder)…`);

  // For each missing leaf key, find its line in en.ts and inject it just before the closing
  // brace of the parent section in the locale file.
  for (const dotKey of missing) {
    const leafKey = dotKey.split('.').pop();
    // Find the line in en.ts
    const enLine = enLines.find(l => {
      const m = l.match(/^\s*(\w+)\s*:/);
      return m && m[1] === leafKey;
    });
    if (!enLine) continue;

    // Inject it at the end of the translation object (just before final `} as const`)
    const marker = '} as const;';
    const valueRaw = enLine.match(/:\s*(.*?),?\s*$/)?.[1] || `'TODO'`;
    // Wrap value to indicate it needs translation
    const safeLine = `    ${leafKey}: /* TODO:${locale} */ ${valueRaw},`;
    locSrc = locSrc.replace(marker, `${safeLine}\n${marker}`);
  }

  writeTS(file, locSrc);
  console.log(`  ✅ Done — please translate the /* TODO:${locale} */ entries.\n`);
}

/** Show diff without writing */
function cmdDiff(locale) {
  const file = path.join(LOCALES_DIR, `${locale}.ts`);
  if (!fs.existsSync(file)) { console.error(`${locale}.ts not found`); process.exit(1); }

  const enKeys  = extractKeys(readTS(EN_FILE));
  const locKeys = extractKeys(readTS(file));
  const missing = [...enKeys].filter(k => !locKeys.has(k));

  console.log(`\n📋  Keys in en.ts missing from ${locale}.ts (${missing.length}):\n`);
  missing.forEach(k => console.log(`  • ${k}`));
  console.log();
}

/** Fix quote errors in all locale files */
function cmdFixQuotes() {
  console.log('\n🔧  Auto-fixing embedded-quote errors…\n');
  for (const locale of LOCALES) {
    const file = path.join(LOCALES_DIR, `${locale}.ts`);
    if (fs.existsSync(file)) fixQuotes(file);
  }
  console.log();
}

// ── CLI dispatch ──────────────────────────────────────────────────────────────
const [cmd, arg] = process.argv.slice(2);
switch (cmd) {
  case 'check':      cmdCheck(); break;
  case 'sync':       cmdSync(arg || 'ar'); break;
  case 'diff':       cmdDiff(arg || 'ar'); break;
  case 'fix-quotes': cmdFixQuotes(); break;
  default:
    console.log(`
ProfitsPatrol Locale Dev Tool
Usage:
  node scripts/sync-locales.cjs check            # Lint all locale files
  node scripts/sync-locales.cjs sync <locale>    # Add missing keys from en.ts
  node scripts/sync-locales.cjs diff <locale>    # Show missing keys (no changes)
  node scripts/sync-locales.cjs fix-quotes       # Auto-fix quote syntax errors
`);
}
