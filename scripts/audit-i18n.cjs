#!/usr/bin/env node
/**
 * audit-i18n.cjs — Full i18n audit for ProfitsPatrol
 * ====================================================
 * Finds:
 *   1. TSX/TSX files with visible text that DON'T use useTranslation
 *   2. t() calls with keys missing from en.ts
 *   3. Likely hardcoded UI strings (JSX text content NOT wrapped in t())
 *
 * Usage:
 *   node scripts/audit-i18n.cjs
 *   node scripts/audit-i18n.cjs --json   (machine-readable output)
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const SRC        = path.join(__dirname, '../src');
const EN_FILE    = path.join(__dirname, '../src/locales/en.ts');
const JSON_MODE  = process.argv.includes('--json');

// ── 1. Build flat set of all keys in en.ts ───────────────────────────────────
function buildEnKeys() {
  const src   = fs.readFileSync(EN_FILE, 'utf8');
  const keys  = new Set();
  const lines = src.split('\n');
  const stack = [];

  for (const line of lines) {
    const openM = line.match(/^(\s*)(\w+)\s*:\s*\{/);
    if (openM) { stack.push({ indent: openM[1].length, key: openM[2] }); continue; }

    if (/^\s+\}/.test(line)) {
      const myIndent = (line.match(/^(\s*)/) || ['', ''])[1].length;
      while (stack.length && stack[stack.length - 1].indent >= myIndent) stack.pop();
      continue;
    }

    const leafM = line.match(/^\s*(\w+)\s*:\s*(?:'|"|`|\[)/);
    if (leafM) {
      const prefix = stack.map(s => s.key).join('.');
      keys.add(prefix ? `${prefix}.${leafM[1]}` : leafM[1]);
    }
  }
  return keys;
}

// ── 2. Walk the src tree ──────────────────────────────────────────────────────
function walkDir(dir, exts, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      walkDir(full, exts, results);
    } else if (entry.isFile() && exts.some(e => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

// ── 3. Extract t() keys from a file ──────────────────────────────────────────
function extractTKeys(src) {
  const keys = [];
  // match t('some.key')  or t("some.key")  — static only
  const re = /\bt\(\s*['"]([^'"]+)['"]\s*[\),]/g;
  let m;
  while ((m = re.exec(src)) !== null) keys.push(m[1]);
  return keys;
}

// ── 4. Detect likely hardcoded JSX text ──────────────────────────────────────
// Heuristic: JSX text node containing 2+ letters that is NOT inside {…}
// We flag lines with >3 English letters in JSX context NOT inside braces.
function detectHardcodedText(src, filePath) {
  const issues = [];
  const lines  = src.split('\n');
  lines.forEach((line, i) => {
    // Skip comments, imports, type lines
    if (/^\s*(\/\/|\/\*|import |export type|interface |type )/.test(line)) return;
    // Skip lines that already contain t( calls
    if (line.includes('t(')) return;
    // Look for JSX text: >content< or >{stuff}< patterns where stuff is plain English
    // Pattern: > followed by 4+ alphabetic chars NOT in {}
    const jsxText = line.match(/>([A-Z][a-zA-Z\s]{3,})</);
    if (jsxText && !jsxText[1].includes('{')) {
      issues.push({ line: i + 1, text: jsxText[1].trim() });
    }
  });
  return issues;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const enKeys   = buildEnKeys();
const allFiles = walkDir(path.join(SRC, 'features'), ['.tsx', '.ts'])
  .concat(walkDir(path.join(SRC, 'components'), ['.tsx', '.ts']))
  .concat(walkDir(path.join(SRC, 'app'), ['.tsx', '.ts']));

const report = {
  missing_keys: [],      // t('key') where key not in en.ts
  no_translation: [],    // .tsx files with JSX but no useTranslation
  hardcoded_text: [],    // likely hardcoded English strings
  summary: {}
};

for (const file of allFiles) {
  const src     = fs.readFileSync(file, 'utf8');
  const rel     = path.relative(SRC, file);
  const hasTSX  = src.includes('return (') || src.includes('return(') || src.includes('<div') || src.includes('<button') || src.includes('<span') || src.includes('<p ');
  const hasTFn  = src.includes('useTranslation');

  // 1. Files with UI but no translation hook
  if (hasTSX && !hasTFn && file.endsWith('.tsx')) {
    report.no_translation.push(rel);
  }

  // 2. Missing t() keys
  const tKeys = extractTKeys(src);
  for (const key of tKeys) {
    // Strip leading 'translation.' if present
    const normalized = key.startsWith('translation.') ? key.slice(12) : key;
    if (!enKeys.has(normalized) && !enKeys.has(`translation.${normalized}`)) {
      report.missing_keys.push({ file: rel, key });
    }
  }

  // 3. Hardcoded text detection (only for tsx files with UI)
  if (file.endsWith('.tsx') && hasTSX) {
    const issues = detectHardcodedText(src, file);
    if (issues.length > 0) {
      report.hardcoded_text.push({ file: rel, issues });
    }
  }
}

// Deduplicate missing keys
report.missing_keys = [...new Map(
  report.missing_keys.map(m => [`${m.file}::${m.key}`, m])
).values()];

report.summary = {
  total_files_scanned:     allFiles.length,
  files_without_hook:      report.no_translation.length,
  missing_key_occurrences: report.missing_keys.length,
  files_with_hardcoded:    report.hardcoded_text.length,
};

// ── OUTPUT ────────────────────────────────────────────────────────────────────
if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

console.log('\n╔══════════════════════════════════════╗');
console.log('║   ProfitsPatrol i18n Audit Report    ║');
console.log('╚══════════════════════════════════════╝\n');

console.log(`📂 Files scanned : ${report.summary.total_files_scanned}`);
console.log(`🪝  No hook       : ${report.summary.files_without_hook}`);
console.log(`🔑 Missing keys  : ${report.summary.missing_key_occurrences}`);
console.log(`📝 Hardcoded     : ${report.summary.files_with_hardcoded}\n`);

// ── Missing keys ──────────────────────────────────────────────────────────────
if (report.missing_keys.length > 0) {
  console.log('─── 🔑 t() KEYS NOT IN en.ts ────────────────────────────────────\n');
  const byFile = {};
  for (const { file, key } of report.missing_keys) {
    (byFile[file] = byFile[file] || []).push(key);
  }
  for (const [file, keys] of Object.entries(byFile)) {
    console.log(`  ${file}`);
    keys.forEach(k => console.log(`    • ${k}`));
  }
  console.log();
}

// ── Files without hook ────────────────────────────────────────────────────────
if (report.no_translation.length > 0) {
  console.log('─── 🪝  TSX FILES WITH UI BUT NO useTranslation HOOK ─────────────\n');
  report.no_translation.forEach(f => console.log(`  • ${f}`));
  console.log();
}

// ── Hardcoded text (top 20 files only) ───────────────────────────────────────
if (report.hardcoded_text.length > 0) {
  console.log('─── 📝 LIKELY HARDCODED STRINGS (top offenders) ──────────────────\n');
  const top = report.hardcoded_text
    .sort((a, b) => b.issues.length - a.issues.length)
    .slice(0, 20);
  for (const { file, issues } of top) {
    console.log(`  ${file}  (${issues.length} occurrences)`);
    issues.slice(0, 5).forEach(({ line, text }) =>
      console.log(`    L${line}: "${text}"`)
    );
    if (issues.length > 5) console.log(`    … +${issues.length - 5} more`);
  }
  console.log();
}

if (report.missing_keys.length === 0 && report.no_translation.length === 0 && report.hardcoded_text.length === 0) {
  console.log('✅  No issues found — all UI appears to be correctly localised!\n');
}
