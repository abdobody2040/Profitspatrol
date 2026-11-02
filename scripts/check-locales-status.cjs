const fs = require('fs');
const path = require('path');

function parseLocaleFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Just transform export const xx = into const _x = and strip as const
  content = content.replace(/export\s+const\s+\w+\s*=/, 'const _x =');
  content = content.replace(/}\s*as\s*const\s*;\s*$/, '}');
  try {
    const fn = new Function(content + '; return _x.translation;');
    return fn();
  } catch (err) {
    console.error('Failed to parse ' + filePath + ':', err.message);
    return null;
  }
}

function getLeafKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj || {})) {
    const val = obj[k];
    const p = prefix ? prefix + '.' + k : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      keys = keys.concat(getLeafKeys(val, p));
    } else {
      keys.push(p);
    }
  }
  return keys;
}

const localesDir = path.join(__dirname, '../src/locales');
const enObj = parseLocaleFile(path.join(localesDir, 'en.ts'));
const esObj = parseLocaleFile(path.join(localesDir, 'es.ts'));
const frObj = parseLocaleFile(path.join(localesDir, 'fr.ts'));
const deObj = parseLocaleFile(path.join(localesDir, 'de.ts'));

const enKeys = getLeafKeys(enObj);
const esKeys = getLeafKeys(esObj);
const frKeys = getLeafKeys(frObj);
const deKeys = getLeafKeys(deObj);

console.log('=== PROFITSPATROL LOCALE STATUS ===');
console.log('EN (Master):', enKeys.length, 'leaf keys in', Object.keys(enObj || {}).length, 'sections');
console.log('ES (Spanish):', esKeys.length, 'leaf keys (', Object.keys(esObj || {}).length, 'sections)');
console.log('FR (French):', frKeys.length, 'leaf keys (', Object.keys(frObj || {}).length, 'sections)');
console.log('DE (German):', deKeys.length, 'leaf keys (', Object.keys(deObj || {}).length, 'sections)');

function compare(name, locKeys, locObj) {
  const locSet = new Set(locKeys);
  const missing = enKeys.filter(k => !locSet.has(k));
  console.log(`\n--- ${name} vs EN ---`);
  console.log(`Missing from ${name}: ${missing.length} keys`);
  
  // Group missing by top-level section
  const sectionCounts = {};
  for (const k of missing) {
    const sec = k.split('.')[0];
    sectionCounts[sec] = (sectionCounts[sec] || 0) + 1;
  }
  console.log('Missing breakdown by top-level section:');
  for (const [sec, count] of Object.entries(sectionCounts)) {
    console.log(`  - ${sec}: ${count} keys missing`);
  }
}

compare('ES', esKeys, esObj);
compare('FR', frKeys, frObj);
compare('DE', deKeys, deObj);
