import fs from 'fs';
import path from 'path';

const BOOKS_DIR = 'public/images/books';
const DATA_FILES = [
  'src/features/library/data/classicBooks.ts',
  'src/features/library/data/moreBooks.ts',
];

const TASK_SUFFIXES = ['-quiz', '-reflection', '-action', '-share', '-application'];

function extractBooks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const books = [];
  let currentId = null;
  let currentCover = null;

  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/^\s+id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
      const id = idMatch[1];
      // Only track top-level book IDs (not task IDs)
      if (!TASK_SUFFIXES.some(s => id.endsWith(s))) {
        currentId = id;
        currentCover = null;
      }
    }

    const coverMatch = lines[i].match(/^\s+coverUrl:\s*['"]([^'"]+)['"]/);
    if (coverMatch && currentId && !currentCover) {
      currentCover = coverMatch[1];
      books.push({ id: currentId, coverUrl: currentCover, file: path.basename(filePath) });
      currentId = null;
      currentCover = null;
    }
  }
  return books;
}

const allBooks = DATA_FILES.flatMap(extractBooks);
const existingFiles = new Set(fs.readdirSync(BOOKS_DIR).map(f => f.toLowerCase()));

const missing = [];
const external = [];
const ok = [];

for (const book of allBooks) {
  if (book.coverUrl.startsWith('http')) {
    external.push(book);
  } else {
    const fileName = path.basename(book.coverUrl).toLowerCase();
    if (!existingFiles.has(fileName)) {
      missing.push(book);
    } else {
      ok.push(book);
    }
  }
}

console.log(`\n📚 Total book entries: ${allBooks.length}`);
console.log(`✅ OK (local + file exists): ${ok.length}`);
console.log(`🌐 External URLs (no local file): ${external.length}`);
console.log(`❌ Local path but FILE MISSING: ${missing.length}`);

if (external.length > 0) {
  console.log('\n🌐 External URL books:');
  external.forEach(b => console.log(`  ${b.file} → id="${b.id}" → ${b.coverUrl}`));
}

if (missing.length > 0) {
  console.log('\n❌ Missing local file books:');
  missing.forEach(b => console.log(`  ${b.file} → id="${b.id}" → ${b.coverUrl}`));
}
