import fs from 'fs';
import path from 'path';
import { translate } from 'bing-translate-api';
import { en } from '../src/locales/en';
import { de } from '../src/locales/de';
import { es } from '../src/locales/es';
import { fr } from '../src/locales/fr';
import { ar } from '../src/locales/ar';

const targetLangs = [
  { code: 'ar', name: 'Arabic', existing: ar },
  { code: 'de', name: 'German', existing: de },
  { code: 'es', name: 'Spanish', existing: es },
  { code: 'fr', name: 'French', existing: fr },
];

async function translateText(text: string, to: string, retries = 3): Promise<string> {
    try {
        const res = await translate(text, null, to);
        return res?.translation || text;
    } catch (e: any) {
        if (retries > 0) {
             const waitTime = (4 - retries) * 2000;
             await new Promise(r => setTimeout(r, waitTime));
             return translateText(text, to, retries - 1);
        }
        console.error(`Failed to translate: "${text}" to ${to}`, e.message);
        return text; // Fallback to English
    }
}

// Flatten an object to collect strings to translate
function flattenForTranslation(sourceObj: any, targetObj: any, path: string[] = []): { path: string[], text: string }[] {
    let toTranslate: { path: string[], text: string }[] = [];
    
    for (const key of Object.keys(sourceObj)) {
        const currentPath = [...path, key];
        if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
            toTranslate = toTranslate.concat(flattenForTranslation(sourceObj[key], targetObj?.[key] || {}, currentPath));
        } else if (typeof sourceObj[key] === 'string') {
            const sourceText = sourceObj[key];
            const targetText = targetObj?.[key];
            
            // Only translate if target is missing, empty, or exactly identical to English (which means untranslated fallback)
            if (!targetText || targetText === sourceText) {
                toTranslate.push({ path: currentPath, text: sourceText });
            }
        }
    }
    return toTranslate;
}

function setNestedValue(obj: any, path: string[], value: any) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
}

// Deep clone object
function deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

async function main() {
    console.log('Starting translation script...');
    
    for (const lang of targetLangs) {
        console.log(`\\n--- Processing ${lang.name} (${lang.code}) ---`);
        const itemsToTranslate = flattenForTranslation(en.translation, lang.existing.translation);
        console.log(`Found ${itemsToTranslate.length} missing/untranslated strings.`);
        
        const newTranslationData = deepClone(lang.existing.translation);
        
        let count = 0;
        // Process in chunks of 5 to avoid IP ban
        for (let i = 0; i < itemsToTranslate.length; i += 5) {
            const chunk = itemsToTranslate.slice(i, i + 5);
            
            await Promise.all(chunk.map(async (item) => {
                const translated = await translateText(item.text, lang.code);
                setNestedValue(newTranslationData, item.path, translated);
            }));
            
            count += chunk.length;
            process.stdout.write(`\\rTranslated ${count}/${itemsToTranslate.length}`);
            
            // Delay 1s between chunks
            await new Promise(r => setTimeout(r, 1000));
        }
        
        console.log(`\nSaving ${lang.code}.ts...`);
        const fileContent = `export const ${lang.code} = {
  translation: ${JSON.stringify(newTranslationData, null, 2)}
};
`;
        const filePath = path.join(process.cwd(), 'src/locales', `${lang.code}.ts`);
        fs.writeFileSync(filePath, fileContent, 'utf-8');
        console.log(`✅ Saved ${lang.code}.ts`);
    }
    console.log('Done!');
}

main().catch(console.error);
