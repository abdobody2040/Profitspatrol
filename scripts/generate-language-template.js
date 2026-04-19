#!/usr/bin/env node
/**
 * Language Template Generator
 * 
 * Generates a new language file template based on en.ts
 * with all keys present but marked as needing translation.
 * 
 * Usage: node scripts/generate-language-template.js <language-code>
 * Example: node scripts/generate-language-template.js fr
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const SOURCE_LANG = 'en';

// Language names for common codes
const LANGUAGE_NAMES = {
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    hi: 'Hindi',
    tr: 'Turkish',
    pl: 'Polish',
    nl: 'Dutch',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish'
};

// Helper to mark strings for translation
function markForTranslation(obj, depth = 0) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result[key] = markForTranslation(value, depth + 1);
        } else if (typeof value === 'string') {
            // Keep English text but add TODO marker
            result[key] = `[TODO] ${value}`;
        } else {
            result[key] = value;
        }
    }

    return result;
}

// Format object as TypeScript code
function formatAsTypeScript(obj, indent = 2) {
    const spaces = ' '.repeat(indent);
    let result = '{\n';

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += `${spaces}${key}: ${formatAsTypeScript(value, indent + 2)},\n`;
        } else if (typeof value === 'string') {
            const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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

// Main function
function generateTemplate(langCode) {
    if (!langCode) {
        console.error('❌ Please provide a language code');
        console.log('\nUsage: node scripts/generate-language-template.js <language-code>');
        console.log('Example: node scripts/generate-language-template.js fr\n');
        process.exit(1);
    }

    const langName = LANGUAGE_NAMES[langCode] || langCode.toUpperCase();
    const outputPath = path.join(LOCALES_DIR, `${langCode}.ts`);

    // Check if file already exists
    if (fs.existsSync(outputPath)) {
        console.error(`❌ ${langCode}.ts already exists!`);
        console.log('   Delete it first if you want to regenerate.');
        process.exit(1);
    }

    // Load source language
    const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LANG}.ts`);

    if (!fs.existsSync(sourcePath)) {
        console.error(`❌ Source language file not found: ${SOURCE_LANG}.ts`);
        process.exit(1);
    }

    console.log(`🌍 Generating ${langName} (${langCode}) translation template...\n`);

    // Read source file
    const sourceContent = fs.readFileSync(sourcePath, 'utf-8');

    // Extract translation object
    const match = sourceContent.match(/export const \w+ = \{[\s\S]*translation: (\{[\s\S]*\}),?\s*\};/);

    if (!match) {
        console.error(`❌ Could not parse ${SOURCE_LANG}.ts`);
        process.exit(1);
    }

    try {
        // Parse the translation object
        const sourceTranslations = eval(`(${match[1]})`);

        // Mark all strings for translation
        const templateTranslations = markForTranslation(sourceTranslations);

        // Generate TypeScript file content
        const fileContent = `
export const ${langCode} = {
  translation: ${formatAsTypeScript(templateTranslations, 4)}
};
`.trim() + '\n';

        // Write to file
        fs.writeFileSync(outputPath, fileContent, 'utf-8');

        console.log(`✅ Created: ${outputPath}`);
        console.log(`\n📝 Next steps:`);
        console.log(`   1. Open ${langCode}.ts`);
        console.log(`   2. Replace all [TODO] markers with ${langName} translations`);
        console.log(`   3. Add ${langCode} to src/locales/index.ts`);
        console.log(`   4. Run: node scripts/check-translations.js`);
        console.log(`\n💡 Tip: Search for "[TODO]" to find untranslated strings\n`);

    } catch (error) {
        console.error(`❌ Error generating template:`, error.message);
        process.exit(1);
    }
}

// Run
const langCode = process.argv[2];
generateTemplate(langCode);
