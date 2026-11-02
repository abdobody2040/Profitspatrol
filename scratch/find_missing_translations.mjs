import fs from 'fs';

const moreBooksStr = fs.readFileSync('src/features/library/data/moreBooks.ts', 'utf8');
const classicBooksStr = fs.readFileSync('src/features/library/data/classicBooks.ts', 'utf8');

const arBooksStr = fs.readFileSync('src/locales/ar/library_books.ts', 'utf8');

function getIds(str) {
  const ids = [];
  const lines = str.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
    if (m && !m[1].includes('-quiz') && !m[1].includes('-action') && !m[1].includes('-reflection')) {
      ids.push(m[1]);
    }
  }
  return ids;
}

const allIds = [...getIds(classicBooksStr), ...getIds(moreBooksStr)];

const missing = [];
for (const id of allIds) {
  // Convert hyphens to underscores for the object key
  const key = id.replace(/-/g, '_');
  // Check if it exists in library_books.ts
  if (!arBooksStr.includes(`'${key}': {`) && !arBooksStr.includes(`${key}: {`) && !arBooksStr.includes(`"${key}": {`)) {
    missing.push(id);
  }
}

console.error(`Missing translations: ${missing.length}`);
if (missing.length > 0) {
  console.error(missing.slice(0, 10)); // print first 10
}
