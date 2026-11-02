
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

    // Check fields (supports base, _child, or _teen)
    const hasTitle = bookTranslation.title || bookTranslation.title_child || bookTranslation.title_teen;
    if (!hasTitle) {
        console.error(`⚠️  Missing TITLE for: "${book.title}"`);
        errorCount++;
    }
    
    // Check if it's an exclusive book (using fullContent) or a classic book (using summary)
    if (ar.translation.exclusive_books && (ar.translation.exclusive_books as any)[key]) {
        const hasFullContent = bookTranslation.fullContent || bookTranslation.fullContent_child || bookTranslation.fullContent_teen;
        if (!hasFullContent) {
            console.error(`⚠️  Missing FULL_CONTENT for: "${book.title}"`);
            errorCount++;
        }
        const hasKeyLessons = (bookTranslation.keyLessons && bookTranslation.keyLessons.length > 0) ||
                              (bookTranslation.keyLessons_child && bookTranslation.keyLessons_child.length > 0) ||
                              (bookTranslation.keyLessons_teen && bookTranslation.keyLessons_teen.length > 0) ||
                              bookTranslation.lesson_0 || bookTranslation.lesson_0_child || bookTranslation.lesson_0_teen;
        if (!hasKeyLessons) {
            console.error(`⚠️  Missing KEY_LESSONS for: "${book.title}"`);
            errorCount++;
        }
    } else {
        const hasSummary = bookTranslation.summary || bookTranslation.summary_child || bookTranslation.summary_teen;
        if (!hasSummary) {
            console.error(`⚠️  Missing SUMMARY for: "${book.title}"`);
            errorCount++;
        }
        // Check lessons for classic books
        if (book.keyLessons && Array.isArray(book.keyLessons)) {
            book.keyLessons.forEach((_: any, index: number) => {
                const hasLesson = bookTranslation[`lesson_${index}`] || 
                                  bookTranslation[`lesson_${index}_child`] || 
                                  bookTranslation[`lesson_${index}_teen`];
                if (!hasLesson) {
                    console.error(`⚠️  Missing Lesson ${index + 1} for: "${book.title}"`);
                    errorCount++;
                }
            });
        }
    }
});

if (missingCount === 0 && errorCount === 0) {
    console.log("✅ All 100% of library content is translated!");
    process.exit(0);
} else {
    console.log(`\nFound ${missingCount} missing books and ${errorCount} missing fields.`);
    process.exit(1);
}
