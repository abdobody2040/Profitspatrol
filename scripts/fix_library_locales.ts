
const fs = require('fs');
const path = require('path');
// We can't easily require the TS file for data because of compilation.
// So we will just read the file content of libraryBooks.ts and regex extract the object!
// Or, simplified approach: Use ts-node but with CJS imports?
// No, the data file uses 'export const'.
// Let's stick to TS but run with compatible flags.
// Actually, 'ERR_UNKNOWN_FILE_EXTENSION' often means it doesn't like .ts extension in node unless loader is used.

// New strategy:
// 1. Read 'src/data/libraryBooks.ts' as text.
// 2. Extract the IDs, Titles, Summaries via regex. Avoid importing.
// 3. Generate the JSON.
// 4. Inject.

const libraryPath = path.join(__dirname, '../src/data/libraryBooks.ts');
const localePath = path.join(__dirname, '../src/locales/en.ts');

const libraryContent = fs.readFileSync(libraryPath, 'utf8');

// Regex to find objects in the array.
// This is brittle but safer than fighting module loaders for a one-off script.
// Match: id: "..." ... title: "..." ... summary: "..." ... keyLessons: [ ... ]
// We will iterate through matchAll.

const bookRegex = /id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?summary:\s*"([^"]+)",[\s\S]*?keyLessons:\s*\[([\s\S]*?)\]/g;

const booksObj = {};
let match;

while ((match = bookRegex.exec(libraryContent)) !== null) {
    const id = match[1];
    const title = match[2];
    const summary = match[3]; // might have newlines?
    const lessonsBlock = match[4];

    // Clean summary (remove newlines/excess space)
    const cleanSummary = summary.replace(/\s+/g, ' ').trim();

    // keyLessons lines
    // "Lesson 1", "Lesson 2", etc.
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

console.log(`Found ${Object.keys(booksObj).length} books.`);

const booksString = JSON.stringify(booksObj, null, 2).replace(/\n/g, '\n      ');
const newBlock = `library_books: ${booksString},`;

let content = fs.readFileSync(localePath, 'utf8');

// Use the same replace logic as before
const regex = /library_books:\s*\{[\s\S]*?\},\s*\/\/\s*ASSIGNMENTS/m;

if (regex.test(content)) {
    const replacement = `${newBlock}\n\n      // ASSIGNMENTS`;
    const newContent = content.replace(regex, replacement);
    fs.writeFileSync(localePath, newContent);
    console.log('Successfully overwrote library_books.');
} else {
    console.log('Could not find existing block.');
}
