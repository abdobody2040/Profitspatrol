import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const SOURCE_LANG = 'en';

const TARGETS = {
    es: 'Spanish',
    fr: 'French',
    de: 'German'
};

function formatAsTypeScript(obj, indent = 2) {
    const spaces = ' '.repeat(indent);
    let result = '{\n';

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += `${spaces}${key}: ${formatAsTypeScript(value, indent + 2)},\n`;
        } else if (typeof value === 'string') {
            const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
            result += `${spaces}${key}: "${escaped}",\n`;
        } else if (Array.isArray(value)) {
            result += `${spaces}${key}: ${JSON.stringify(value)},\n`;
        } else {
            result += `${spaces}${key}: ${value},\n`;
        }
    }

    result += ' '.repeat(indent - 2) + '}';
    return result;
}

function extractAllStrings(obj, path = [], result = []) {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            extractAllStrings(value, [...path, key], result);
        } else if (typeof value === 'string') {
            result.push({ path: [...path, key], val: value });
        }
    }
    return result;
}

function setStringAtPath(obj, pathArr, value) {
    let current = obj;
    for (let i = 0; i < pathArr.length - 1; i++) {
        const p = pathArr[i];
        if (!current[p]) current[p] = {};
        current = current[p];
    }
    current[pathArr[pathArr.length - 1]] = value;
}

async function run() {
    const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LANG}.ts`);
    const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
    const match = sourceContent.match(/export const \w+ = ({[\s\S]*?}) as const;/);
    if (!match) throw new Error("Could not parse en.ts");

    const sourceTranslations = eval(`(${match[1]})`).translation;
    const stringsArr = extractAllStrings(sourceTranslations);
    console.log(`Found ${stringsArr.length} strings to translate.`);

    for (const [langCode, langName] of Object.entries(TARGETS)) {
        console.log(`\nTranslating to ${langName} (${langCode})...`);

        // Check if we can resume or if it exists. For simplicity, we just do it.
        // Individual translation logic with concurrency limit
        const CONCURRENCY = 10;
        const translatedObj = {};

        // Add existing non-string values
        function copyNonStrings(src, dst) {
            for (const [k, v] of Object.entries(src)) {
                if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                    dst[k] = {};
                    copyNonStrings(v, dst[k]);
                } else if (typeof v !== 'string') {
                    dst[k] = v;
                }
            }
        }
        copyNonStrings(sourceTranslations, translatedObj);

        // Convert to chunks of CONCURRENCY
        for (let i = 0; i < stringsArr.length; i += CONCURRENCY) {
            const chunk = stringsArr.slice(i, i + CONCURRENCY);

            await Promise.all(chunk.map(async (b) => {
                try {
                    const res = await translate(b.val, { to: langCode });
                    setStringAtPath(translatedObj, b.path, res.text);
                } catch (e) {
                    // If we get blocked or error, fallback to english
                    setStringAtPath(translatedObj, b.path, b.val);
                }
            }));

            if (i % 500 === 0) {
                console.log(`Translated ${i}/${stringsArr.length} for ${langCode}`);
            }

            // Small delay to prevent IP block
            await new Promise(r => setTimeout(r, 200));
        }

        const fileContent = `export const ${langCode} = {\n  translation: ${formatAsTypeScript(translatedObj, 4)}\n};\n`;
        fs.writeFileSync(path.join(LOCALES_DIR, `${langCode}.ts`), fileContent, 'utf-8');
        console.log(`Saved ${langCode}.ts`);
    }
}

run().catch(console.error);
