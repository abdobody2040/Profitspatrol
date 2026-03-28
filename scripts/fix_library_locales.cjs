const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../src/data/libraryBooks.ts');
const localePath = path.join(__dirname, '../src/locales/en.ts');

console.log('Reading library from:', libraryPath);
const libraryContent = fs.readFileSync(libraryPath, 'utf8');

// Regex to find objects in the array.
const bookRegex = /id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?summary:\s*"([^"]+)",[\s\S]*?keyLessons:\s*\[([\s\S]*?)\]/g;

const booksObj = {};
let match;
let count = 0;

while ((match = bookRegex.exec(libraryContent)) !== null) {
    count++;
    const id = match[1];
    const title = match[2];
    const summary = match[3];
    const lessonsBlock = match[4];

    // Clean summary (remove newlines/excess space)
    const cleanSummary = summary.replace(/\s+/g, ' ').trim();

    // keyLessons lines
    const lessonMatches = lessonsBlock.match(/"([^"]+)"/g);

    const key = id.replace(/-/g, '_');
    booksObj[key] = {
        title: title,
        summary: cleanSummary
    };

    if (lessonMatches) {
        lessonMatches.forEach((l, i) => {
            booksObj[key][`lesson_${i}`] = l.replace(/"/g, '');
        });
    }
}

console.log(`Found ${count} books in libraryBooks.ts.`);
console.log(`Generated keys: ${Object.keys(booksObj).join(', ')}`);

const booksString = JSON.stringify(booksObj, null, 2).replace(/\n/g, '\n      ');
const newBlock = `library_books: ${booksString},`;

let content = fs.readFileSync(localePath, 'utf8');

// Use the same replace logic as before
// Matches: library_books: { ... }, // ASSIGNMENTS (or just // ASSIGNMENTS)
// Need to match the EXISTING library_books block OR insert if missing.
// The existing file HAS:
//       // LIBRARY BOOKS
//       library_books: {
//         ...
//       },
// 
//       // ASSIGNMENTS UI

const regex = /library_books:\s*\{[\s\S]*?\},\s*(?=\/\/ ASSIGNMENTS)/m;

// More robust regex: find "library_books:" until next top-level key or specific marker
// content has:
//       library_books: {
//         ...
//       },
//       // ASSIGNMENTS UI

// Try to match from `library_books:` up to `// ASSIGNMENTS`
// Note: `[^]*?` is all chars.
// We want to replace the whole `library_books: { ... },` block.

const simpleRegex = /(library_books:\s*\{[\s\S]*?\},\s*)(\/\/ ASSIGNMENTS)/;

if (simpleRegex.test(content)) {
    console.log('Found block with simple regex.');
    const replacement = `${newBlock}\n\n      $2`; // $2 is // ASSIGNMENTS
    const newContent = content.replace(simpleRegex, replacement);
    fs.writeFileSync(localePath, newContent);
    console.log('Successfully overwrote library_books.');
} else {
    console.log('Could not find exact block match. Trying relaxed regex.');
    // Try relaxed: just find `library_books: { ... }` and hope it ends correctly.
    // It's scary to replace without bounds.
    // Let's search for the start `library_books:` and the ENDING `      },` before `// ASSIGNMENTS`

    // Actually, looking at file view:
    // 938:       },
    // 939: 
    // 940:       // ASSIGNMENTS UI

    // So there is whitespace.
    const looseRegex = /library_books:\s*\{[\s\S]*?^\s*\},/m;
    if (looseRegex.test(content)) {
        console.log('Found block with loose regex.');
        const newContent = content.replace(looseRegex, newBlock);
        fs.writeFileSync(localePath, newContent);
        console.log('Successfully overwrote library_books (loose).');
    } else {
        console.error('FAILED: Could not locate library_books block in en.ts');
    }
}
