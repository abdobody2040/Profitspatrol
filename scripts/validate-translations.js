import { INITIAL_LIBRARY } from '../src/features/library/data/libraryBooks';
import { ar } from '../src/locales/ar';
console.log("🔍 Checking translation completeness...");
const libraryBooks = INITIAL_LIBRARY;
// @ts-ignore
const translatedBooks = ar.translation.library_books || {};
let missingCount = 0;
let errorCount = 0;
libraryBooks.forEach((book) => {
    const normalizeId = (id) => id.replace(/-/g, '_');
    const key = normalizeId(book.id);
    // @ts-ignore
    const bookTranslation = translatedBooks[key];
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
    if (!bookTranslation.summary) {
        console.error(`⚠️  Missing SUMMARY for: "${book.title}"`);
        errorCount++;
    }
    // Check lessons
    book.keyLessons.forEach((_, index) => {
        if (!bookTranslation[`lesson_${index}`]) {
            console.error(`⚠️  Missing Lesson ${index + 1} for: "${book.title}"`);
            errorCount++;
        }
    });
});
if (missingCount === 0 && errorCount === 0) {
    console.log("✅ All 100% of library content is translated!");
    process.exit(0);
}
else {
    console.log(`\nFound ${missingCount} missing books and ${errorCount} missing fields.`);
    process.exit(1);
}
