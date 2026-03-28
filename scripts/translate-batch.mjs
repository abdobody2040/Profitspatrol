import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from 'bing-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const SOURCE_LANG = 'en';

const TARGETS = {
    es: 'es',
    fr: 'fr',
    de: 'de'
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

    for (const [langCode, bingCode] of Object.entries(TARGETS)) {
        console.log(`\nTranslating to ${langCode}...`);

        const translatedObj = {};
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

        // Batch by combining text with a separator
        const BATCH_SIZE = 25;
        const SEPARATOR = ' ||| ';
        let totalTranslated = 0;

        for (let i = 0; i < stringsArr.length; i += BATCH_SIZE) {
            const chunk = stringsArr.slice(i, i + BATCH_SIZE);
            const combinedText = chunk.map(b => b.val).join(SEPARATOR);

            try {
                const res = await translate(combinedText, null, bingCode);
                const translatedParts = res.translation.split(SEPARATOR).map(s => s.trim());

                // If the separator was mangled, we fallback to translating one by one in this chunk
                if (translatedParts.length !== chunk.length) {
                    console.log(`Separator mangled in chunk ${i}, doing one by one...`);
                    for (let j = 0; j < chunk.length; j++) {
                        try {
                            const singleRes = await translate(chunk[j].val, null, bingCode);
                            setStringAtPath(translatedObj, chunk[j].path, singleRes.translation);
                        } catch (e) {
                            setStringAtPath(translatedObj, chunk[j].path, chunk[j].val);
                        }
                        await new Promise(r => setTimeout(r, 100));
                    }
                } else {
                    for (let j = 0; j < chunk.length; j++) {
                        setStringAtPath(translatedObj, chunk[j].path, translatedParts[j]);
                    }
                }
            } catch (e) {
                console.log(`Error on batch ${i}: ${e.message}, falling back to english`);
                for (const b of chunk) {
                    setStringAtPath(translatedObj, b.path, b.val);
                }
            }

            totalTranslated += chunk.length;
            if (totalTranslated % 250 === 0) {
                console.log(`Translated ${totalTranslated} / ${stringsArr.length}`);
            }
            await new Promise(r => setTimeout(r, 500)); // Delay between batches
        }

        const fileContent = `export const ${langCode} = {\n  translation: ${formatAsTypeScript(translatedObj, 4)}\n} as const;\n`;
        fs.writeFileSync(path.join(LOCALES_DIR, `${langCode}.ts`), fileContent, 'utf-8');
        console.log(`Saved ${langCode}.ts`);
    }
}

run().catch(console.error);
