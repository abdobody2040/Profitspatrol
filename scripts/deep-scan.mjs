// scripts/deep-scan.mjs
import fs from 'fs';
import path from 'path';

const FILES = [
  'src/features/library/data/classicBooks.ts',
  'src/features/library/data/moreBooks.ts',
];

const BOOKS_DIR = 'public/images/books';
const existingFiles = new Set(fs.readdirSync(BOOKS_DIR).map(f => f.toLowerCase()));

let extTotal = 0, localOk = 0, localMissing = 0;

for (const f of FILES) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const m = line.match(/coverUrl:\s*['"]([^'"]+)['"]/);
    if (!m) return;
    const url = m[1];
    if (url.startsWith('http')) {
      extTotal++;
      console.log(`EXT  ${f}:${i+1} => ${url.substring(0, 90)}`);
    } else {
      const fname = path.basename(url).toLowerCase();
      if (!existingFiles.has(fname)) {
        localMissing++;
        console.log(`MISS ${f}:${i+1} => ${url}`);
      } else {
        localOk++;
      }
    }
  });
}

console.log(`\nExternal URLs: ${extTotal}`);
console.log(`Local OK:      ${localOk}`);
console.log(`Local MISSING: ${localMissing}`);
