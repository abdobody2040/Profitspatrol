const fs = require('fs');
const moreBooksStr = fs.readFileSync('src/features/library/data/moreBooks.ts', 'utf8');
const classicBooksStr = fs.readFileSync('src/features/library/data/classicBooks.ts', 'utf8');

const arBooksStr = fs.readFileSync('src/locales/ar/library_books.ts', 'utf8');
const arExcStr = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

function getBooks(str) {
  const books = [];
  const lines = str.split('\n');
  let currentId = null;
  for (const line of lines) {
    const idMatch = line.match(/^    id:\s*['"]([^'"]+)['"]/);
    if (idMatch) currentId = idMatch[1];
    
    const titleMatch = line.match(/^    title:\s*['"]([^'"]+)['"]/);
    if (titleMatch && currentId) {
      books.push({ id: currentId, title: titleMatch[1] });
      currentId = null;
    }
  }
  return books;
}

const classic = getBooks(classicBooksStr);
const exclusive = getBooks(moreBooksStr);

const missingClassic = classic.filter(b => {
  const key = b.id.replace(/-/g, '_');
  return !arBooksStr.includes('  ' + key + ':') && !arBooksStr.includes('  \'' + key + '\':') && !arBooksStr.includes('  "' + key + '":');
});

const missingExclusive = exclusive.filter(b => {
  const key = b.id.replace(/-/g, '_');
  return !arExcStr.includes('  ' + key + ':') && !arExcStr.includes('  \'' + key + '\':') && !arExcStr.includes('  "' + key + '":');
});

fs.writeFileSync('scratch/missing_books_clean.json', JSON.stringify({ classic: missingClassic, exclusive: missingExclusive }, null, 2));
console.error('Classic missing:', missingClassic.length);
console.error('Exclusive missing:', missingExclusive.length);
