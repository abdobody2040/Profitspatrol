/**
 * Phase 1b — Fix moreBooks.ts exclusive book covers & authors
 */
const fs = require('fs');
const path = require('path');

const MORE_PATH = path.join(__dirname, '../src/features/library/data/moreBooks.ts');
let src = fs.readFileSync(MORE_PATH, 'utf8');

const coverFixes = {
  'the-little-engine-that-could':  'https://covers.openlibrary.org/b/isbn/9780448405209-L.jpg',
  'kidpreneurs':                    'https://covers.openlibrary.org/b/isbn/9781599183602-L.jpg',
  'rich-dad-poor-dad-for-teens':   'https://covers.openlibrary.org/b/isbn/9780762439621-L.jpg',
  'the-boy-who-harnessed-the-wind':'https://covers.openlibrary.org/b/isbn/9780803740808-L.jpg',
  'charlie-chocolate-factory':     'https://covers.openlibrary.org/b/isbn/9780142410318-L.jpg',
  'the-alchemist-pp':              'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
};

for (const [id, newUrl] of Object.entries(coverFixes)) {
  const idEscaped = id.replace(/-/g, '\\-');
  // Match double-quoted strings (moreBooks uses double quotes)
  const re = new RegExp(
    `(id:\\s*["']${idEscaped}["'][\\s\\S]{0,200}?)coverUrl:\\s*["'][^"']*["']`,
    'g'
  );
  src = src.replace(re, (m, pre) => `${pre}coverUrl: "${newUrl}"`);
}

fs.writeFileSync(MORE_PATH, src, 'utf8');
