import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from 'bing-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.join(__dirname, '../src/locales');

function parseLocaleFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
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

function setDeep(obj, pathArr, value) {
  let curr = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i];
    if (!curr[key] || typeof curr[key] !== 'object' || Array.isArray(curr[key])) {
      curr[key] = {};
    }
    curr = curr[key];
  }
  curr[pathArr[pathArr.length - 1]] = value;
}

function getDeep(obj, pathArr) {
  let curr = obj;
  for (const k of pathArr) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[k];
  }
  return curr;
}

function findMissingEntries(enObj, targetObj, prefix = []) {
  let missing = [];
  for (const key of Object.keys(enObj || {})) {
    const nextPath = [...prefix, key];
    const enVal = enObj[key];
    const targetVal = getDeep(targetObj, nextPath);

    if (enVal && typeof enVal === 'object' && !Array.isArray(enVal)) {
      missing = missing.concat(findMissingEntries(enVal, targetObj, nextPath));
    } else {
      if (targetVal === undefined || targetVal === null) {
        missing.push({ path: nextPath, value: enVal });
      }
    }
  }
  return missing;
}

async function translateWithRetry(text, targetLang, retries = 3) {
  if (typeof text !== 'string') return text;
  if (!text.trim()) return text;
  // If it's pure numbers, currency, or url, skip translation
  if (/^[\d\s.,$€£%+\-*/:;!?()#@]+$/.test(text)) return text;
  if (/^https?:\/\//.test(text) || text.startsWith('/images/')) return text;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await translate(text, null, targetLang);
      if (res && res.translation) {
        return res.translation;
      }
    } catch (err) {
      if (attempt === retries) {
        console.warn(`[WARN] Failed to translate after ${retries} attempts: "${text.slice(0, 30)}..." (${err.message}). Using English fallback.`);
        return text;
      }
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
  return text;
}

async function translateArray(arr, targetLang) {
  const result = [];
  for (const item of arr) {
    if (typeof item === 'string') {
      result.push(await translateWithRetry(item, targetLang));
    } else {
      result.push(item);
    }
  }
  return result;
}

async function processLanguage(lang) {
  const langUpper = lang.toUpperCase();
  console.log(`\n========================================`);
  console.log(`🌐 Processing language: ${langUpper}`);
  console.log(`========================================`);

  const enFilePath = path.join(LOCALES_DIR, 'en.ts');
  const targetFilePath = path.join(LOCALES_DIR, `${lang}.ts`);

  const enTrans = parseLocaleFile(enFilePath);
  if (!enTrans) {
    console.error('Failed to load en.ts');
    return;
  }

  let targetTrans = fs.existsSync(targetFilePath) ? parseLocaleFile(targetFilePath) : {};
  if (!targetTrans) targetTrans = {};

  const missing = findMissingEntries(enTrans, targetTrans);
  console.log(`Found ${missing.length} missing keys for ${langUpper}.`);

  if (missing.length === 0) {
    console.log(`✅ ${langUpper} is already 100% complete!`);
    return;
  }

  const batchSize = 10;
  let completed = 0;

  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (item) => {
        let translatedValue;
        if (Array.isArray(item.value)) {
          translatedValue = await translateArray(item.value, lang);
        } else if (typeof item.value === 'string') {
          translatedValue = await translateWithRetry(item.value, lang);
        } else {
          translatedValue = item.value;
        }
        setDeep(targetTrans, item.path, translatedValue);
        completed++;
      })
    );

    const percent = Math.round((completed / missing.length) * 100);
    process.stdout.write(`\r  ⚡ Progress: ${completed}/${missing.length} keys (${percent}%) translated...`);
    // Brief sleep to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n  💾 Saving updated ${lang}.ts...`);
  const fileContent = `export const ${lang} = {\n  translation: ${JSON.stringify(targetTrans, null, 2)}\n};\n`;
  fs.writeFileSync(targetFilePath, fileContent, 'utf8');
  console.log(`  ✅ Successfully updated ${lang}.ts (100% complete)!`);
}

async function run() {
  const args = process.argv.slice(2);
  const targetLangs = args.length > 0 ? args : ['es', 'fr', 'de'];

  console.log(`🚀 Starting automated translation for: ${targetLangs.join(', ')}`);
  for (const lang of targetLangs) {
    await processLanguage(lang);
  }
  console.log('\n🎉 All target languages processed successfully!');
}

run().catch(err => {
  console.error('Fatal translation error:', err);
  process.exit(1);
});
