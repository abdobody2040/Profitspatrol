#!/usr/bin/env node
/**
 * Translation Completeness Checker
 * 
 * Compares all language files against en.ts (source of truth)
 * and reports missing keys and completion percentage.
 * 
 * Usage: node scripts/check-translations.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const SOURCE_LANG = 'en';

// Helper to extract all keys from a nested object
function getAllKeys(obj, prefix = '') {
    const keys = [];

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys.push(...getAllKeys(value, fullKey));
        } else {
            keys.push(fullKey);
        }
    }

    return keys;
}

// Load a language file
function loadLanguage(lang) {
    const filePath = path.join(LOCALES_DIR, `${lang}.ts`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    // Read and parse the TypeScript file
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract the translation object (simplified parsing)
    const match = content.match(/export const \w+ = \{[\s\S]*translation: (\{[\s\S]*\}),?\s*\};/);

    if (!match) {
        console.error(`❌ Could not parse ${lang}.ts`);
        return null;
    }

    try {
        // Use eval to parse the object (safe in this controlled context)
        const translationObj = eval(`(${match[1]})`);
        return translationObj;
    } catch (error) {
        console.error(`❌ Error parsing ${lang}.ts:`, error.message);
        return null;
    }
}

// Main function
function checkTranslations() {
    console.log('🔍 Translation Completeness Checker\n');
    console.log('━'.repeat(60));

    // Load source language
    const sourceTranslations = loadLanguage(SOURCE_LANG);

    if (!sourceTranslations) {
        console.error(`❌ Could not load source language: ${SOURCE_LANG}.ts`);
        process.exit(1);
    }

    const sourceKeys = getAllKeys(sourceTranslations);
    console.log(`✅ Source (${SOURCE_LANG}.ts): ${sourceKeys.length} keys\n`);

    // Get all language files
    const langFiles = fs.readdirSync(LOCALES_DIR)
        .filter(file => file.endsWith('.ts') && file !== `${SOURCE_LANG}.ts` && file !== 'index.ts')
        .map(file => file.replace('.ts', ''));

    if (langFiles.length === 0) {
        console.log('ℹ️  No other language files found.');
        return;
    }

    // Check each language
    const results = [];

    for (const lang of langFiles) {
        const translations = loadLanguage(lang);

        if (!translations) {
            results.push({ lang, error: true });
            continue;
        }

        const langKeys = getAllKeys(translations);
        const missingKeys = sourceKeys.filter(key => !langKeys.includes(key));
        const extraKeys = langKeys.filter(key => !sourceKeys.includes(key));
        const completeness = ((langKeys.length / sourceKeys.length) * 100).toFixed(2);

        results.push({
            lang,
            total: langKeys.length,
            missing: missingKeys,
            extra: extraKeys,
            completeness: parseFloat(completeness)
        });
    }

    // Display results
    console.log('📊 Results:\n');

    for (const result of results) {
        if (result.error) {
            console.log(`❌ ${result.lang}.ts - Error loading file\n`);
            continue;
        }

        const status = result.completeness === 100 ? '✅' : result.completeness >= 90 ? '⚠️' : '❌';

        console.log(`${status} ${result.lang}.ts`);
        console.log(`   Completeness: ${result.completeness}% (${result.total}/${sourceKeys.length} keys)`);

        if (result.missing.length > 0) {
            console.log(`   Missing keys: ${result.missing.length}`);
            if (result.missing.length <= 10) {
                result.missing.forEach(key => console.log(`     - ${key}`));
            } else {
                result.missing.slice(0, 10).forEach(key => console.log(`     - ${key}`));
                console.log(`     ... and ${result.missing.length - 10} more`);
            }
        }

        if (result.extra.length > 0) {
            console.log(`   Extra keys (not in source): ${result.extra.length}`);
        }

        console.log('');
    }

    console.log('━'.repeat(60));

    // Summary
    const avgCompleteness = results.reduce((sum, r) => sum + (r.completeness || 0), 0) / results.length;
    console.log(`\n📈 Average Completeness: ${avgCompleteness.toFixed(2)}%`);

    const incomplete = results.filter(r => r.completeness < 100);
    if (incomplete.length > 0) {
        console.log(`\n⚠️  ${incomplete.length} language(s) need attention`);
        process.exit(1);
    } else {
        console.log('\n✅ All translations are complete!');
    }
}

// Run
checkTranslations();
