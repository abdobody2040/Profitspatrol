const fs = require('fs');

const classicBooksPath = 'g:/Vibe coding/Profitspatrol/src/features/library/data/classicBooks.ts';
const arLibraryBooksPath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';

const classicContent = fs.readFileSync(classicBooksPath, 'utf8');
const idRegex = /id:\s*'([^']+)'/g;
const classicIds = [];
let match;
while ((match = idRegex.exec(classicContent)) !== null) {
  // Only collect book IDs (they are top-level or child of CLASSIC_BOOKS)
  // Quizzes and tasks also have IDs, we need to filter them.
  // Book IDs usually don't have suffixes like -quiz, -reflection, etc.
  const id = match[1];
  if (!id.includes('-quiz-') && !id.includes('-reflection-') && !id.includes('-action-') && !id.includes('-share-') && !id.includes('-application-')) {
    classicIds.push(id);
  }
}

const uniqueClassicIds = [...new Set(classicIds)];

const arContent = fs.readFileSync(arLibraryBooksPath, 'utf8');
const missingIds = [];

for (const id of uniqueClassicIds) {
  const normalizedId = id.replace(/-/g, '_');
  if (!arContent.includes(normalizedId + ':')) {
    missingIds.push(id);
  }
}

console.error('Missing IDs in ar/library_books.ts:', missingIds);
