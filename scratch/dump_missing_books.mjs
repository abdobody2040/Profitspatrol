import fs from 'fs';

const moreBooksStr = fs.readFileSync('src/features/library/data/moreBooks.ts', 'utf8');
const classicBooksStr = fs.readFileSync('src/features/library/data/classicBooks.ts', 'utf8');

const arBooksStr = fs.readFileSync('src/locales/ar/library_books.ts', 'utf8');
const arExcStr = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

function getBooks(str) {
  const books = [];
  const lines = str.split('\n');
  let currentId = null;
  
  for (const line of lines) {
    const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
    if (idMatch && !idMatch[1].includes('-quiz') && !idMatch[1].includes('-action') && !idMatch[1].includes('-reflection')) {
      currentId = idMatch[1];
    }
    const titleMatch = line.match(/^\s*title:\s*['"]([^'"]+)['"]/);
    if (titleMatch && currentId) {
      books.push({ id: currentId, title: titleMatch[1] });
      currentId = null;
    }
  }
  return books;
}

const classic = getBooks(classicBooksStr);
const exclusive = getBooks(moreBooksStr);

const missingClassic = [];
for (const b of classic) {
  const key = b.id.replace(/-/g, '_');
  if (!arBooksStr.includes(`'${key}':`) && !arBooksStr.includes(`${key}:`) && !arBooksStr.includes(`"${key}":`)) {
    missingClassic.push(b);
  }
}

const missingExclusive = [];
for (const b of exclusive) {
  const key = b.id.replace(/-/g, '_');
  if (!arExcStr.includes(`'${key}':`) && !arExcStr.includes(`${key}:`) && !arExcStr.includes(`"${key}":`)) {
    missingExclusive.push(b);
  }
}

console.error('Missing Classic:', missingClassic.length);
console.error('Missing Exclusive:', missingExclusive.length);

fs.writeFileSync('scratch/missing_books.json', JSON.stringify({ classic: missingClassic, exclusive: missingExclusive }, null, 2));
