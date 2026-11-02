const fs = require('fs');
const path = require('path');

const dataDir = 'src/features/library/data';
const localesPath = 'src/locales/ar/library_books.ts';

const classicBooks = fs.readFileSync(path.join(dataDir, 'classicBooks.ts'), 'utf-8');
const arLocale = fs.readFileSync(localesPath, 'utf-8');

const ids = [];
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = idRegex.exec(classicBooks)) !== null) {
  // Exclude task IDs which usually contain '-quiz-', '-reflection-', etc.
  if (!match[1].includes('-quiz-') && !match[1].includes('-reflection-') && !match[1].includes('-action-') && !match[1].includes('-share-') && !match[1].includes('-application-') && !match[1].includes('-video-')) {
    ids.push(match[1]);
  }
}

const missingTranslations = [];
ids.forEach(id => {
  const key = id.replace(/-/g, '_');
  if (!arLocale.includes(key + ': {') && !arLocale.includes("'" + key + "': {")) {
    missingTranslations.push(id);
  }
});

console.error('Missing Translations:', missingTranslations);
