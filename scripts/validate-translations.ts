
import { INITIAL_LIBRARY } from '../src/features/library/data/libraryBooks';
import { ar } from '../src/locales/ar';

console.log("🔍 Checking translation completeness...");

const libraryBooks = INITIAL_LIBRARY;
// @ts-ignore
const translatedBooks = ar.translation.library_books || {};

import { COURSE_MAP } from '../src/features/education/data/curriculum';

let missingCount = 0;
let errorCount = 0;

console.log("🔍 Checking curriculum module translations...");

const translatedCurriculum = ar.translation.curriculum || {};

COURSE_MAP.forEach((module: any) => {
    // @ts-ignore
    const titleTranslation = translatedCurriculum[module.id];
    // @ts-ignore
    const briefTranslation = translatedCurriculum[`${module.id}_brief`];

    if (!titleTranslation) {
        console.error(`❌ Missing TITLE translations for module: "${module.title}" (ID: ${module.id})`);
        missingCount++;
    }
    
    if (!briefTranslation) {
        console.error(`❌ Missing BRIEF translations for module: "${module.title}" (ID: ${module.id})`);
        missingCount++;
    }
});

console.log("🔍 Checking library book completeness...");

libraryBooks.forEach((book: any) => {
    const normalizeId = (id: string) => id.replace(/-/g, '_');
    const key = normalizeId(book.id);
    // @ts-ignore
    const bookTranslation = translatedBooks[key] || (ar.translation.exclusive_books && (ar.translation.exclusive_books as any)[key]);

    if (!bookTranslation) {
        console.error(`❌ Missing ALL translations for book: "${book.title}" (ID: ${book.id})`);
        missingCount++;
        return;
    }

    // Check fields
    if (!bookTranslation.title) {
        console.error(`⚠️  Missing TITLE for: "${book.title}"`);
        errorCount++;
    }
    
    // Check if it's an exclusive book (using fullContent) or a classic book (using summary)
    if (ar.translation.exclusive_books && (ar.translation.exclusive_books as any)[key]) {
        if (!bookTranslation.fullContent) {
            console.error(`⚠️  Missing FULL_CONTENT for: "${book.title}"`);
            errorCount++;
        }
        if (!bookTranslation.keyLessons || bookTranslation.keyLessons.length === 0) {
            console.error(`⚠️  Missing KEY_LESSONS for: "${book.title}"`);
            errorCount++;
        }
    } else {
        if (!bookTranslation.summary) {
            console.error(`⚠️  Missing SUMMARY for: "${book.title}"`);
            errorCount++;
        }
        // Check lessons for classic books
        book.keyLessons.forEach((_: any, index: number) => {
            if (!bookTranslation[`lesson_${index}`]) {
                console.error(`⚠️  Missing Lesson ${index + 1} for: "${book.title}"`);
                errorCount++;
            }
        });
    }
});

if (missingCount === 0 && errorCount === 0) {
    console.log("✅ All 100% of library content is translated!");
    process.exit(0);
} else {
    console.log(`\nFound ${missingCount} missing books and ${errorCount} missing fields.`);
    process.exit(1);
}
