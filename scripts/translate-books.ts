import { MORE_BOOKS } from '../src/features/library/data/moreBooks';
import { ar } from '../src/locales/ar';
import * as fs from 'fs';
import * as path from 'path';

import translate from 'translate';

translate.engine = 'google';

async function translateText(text: string): Promise<string> {
    try {
        const res = await translate(text, { to: 'ar' });
        return res;
    } catch (e) {
        console.error("Translation error for text:", text.substring(0, 50), e);
        return text; // Fallback to English on error
    }
}

async function run() {
    const existingKeys = Object.keys(ar.translation.exclusive_books || {});
    console.log(`Currently have ${existingKeys.length} translated exclusive books.`);

    const missingBooks = MORE_BOOKS.filter(book => {
        const normalizedId = book.id.replace(/-/g, '_');
        return !existingKeys.includes(normalizedId);
    });

    console.log(`Found ${missingBooks.length} missing books to translate. Starting translation...`);
    
    let newTranslations: Record<string, any> = {};
    const outputPath = path.join(process.cwd(), 'scripts', 'new_translations.json');
    if (fs.existsSync(outputPath)) {
        try {
            newTranslations = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        } catch(e) {}
    }

    // Filter missingBooks to those not yet fully translated (i.e. titles still match English)
    const booksToProcess = missingBooks.filter(book => {
        const normalizedId = book.id.replace(/-/g, '_');
        if (newTranslations[normalizedId] && /[\u0600-\u06FF]/.test(newTranslations[normalizedId].title)) {
            return false;
        }
        return true;
    });

    console.log(`Actually translating ${booksToProcess.length} books...`);

    const batchSize = 1; // Do 1 by 1 and wait 3 seconds to avoid rate limits
    for (let i = 0; i < booksToProcess.length; i += batchSize) {
        const batch = booksToProcess.slice(i, i + batchSize);
        console.log(`Translating book ${i + 1} of ${booksToProcess.length}...`);
        
        await Promise.all(batch.map(async (book) => {
            const normalizedId = book.id.replace(/-/g, '_');
            console.log(`Translating: ${book.title}`);
            
            const titleAr = await translateText(book.title);
            const fullContentAr = await translateText(book.fullContent || '');
            
            const keyLessonsAr = [];
            for (const lesson of book.keyLessons) {
                keyLessonsAr.push(await translateText(lesson));
            }
            
            newTranslations[normalizedId] = {
                title: titleAr,
                fullContent: fullContentAr,
                keyLessons: keyLessonsAr
            };
        }));
        
        // Save progressively
        fs.writeFileSync(outputPath, JSON.stringify(newTranslations, null, 2), 'utf-8');
        
        // Wait 3 seconds to prevent rate limiting
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log(`\n🎉 Translations complete! Saved to ${outputPath}`);
}

run().catch(console.error);
