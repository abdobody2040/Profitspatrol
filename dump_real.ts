import { MORE_BOOKS } from './src/features/library/data/moreBooks';
import { INITIAL_LIBRARY } from './src/features/library/data/classicBooks';
import fs from 'fs';

const arBooksStr = fs.readFileSync('src/locales/ar/library_books.ts', 'utf8');
const arExcStr = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

const missingClassic = [];
for (const b of INITIAL_LIBRARY) {
  const key = b.id.replace(/-/g, '_');
  if (!arBooksStr.includes(`'${key}':`) && !arBooksStr.includes(`${key}:`) && !arBooksStr.includes(`"${key}":`)) {
    missingClassic.push({ id: b.id, title: b.title });
  }
}

const missingExclusive = [];
for (const b of MORE_BOOKS) {
  const key = b.id.replace(/-/g, '_');
  if (!arExcStr.includes(`'${key}':`) && !arExcStr.includes(`${key}:`) && !arExcStr.includes(`"${key}":`)) {
    missingExclusive.push({ id: b.id, title: b.title });
  }
}

console.error('Missing Classic:', missingClassic.length);
console.error('Missing Exclusive:', missingExclusive.length);

fs.writeFileSync('scratch/missing_real.json', JSON.stringify({ classic: missingClassic, exclusive: missingExclusive }, null, 2));
