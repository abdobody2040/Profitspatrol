
import fs from 'fs';
import path from 'path';

const CLASSIC_PATH = 'src/features/library/data/classicBooks.ts';
const MORE_PATH = 'src/features/library/data/moreBooks.ts';
const BOOKS_DIR = 'public/images/books';

function getBooks(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const books = [];
    
    // Improved regex to find top-level book objects
    // It looks for objects that have id, title, author, and coverUrl
    const bookBlockRegex = /\{[\s\S]+?id:\s*['"]([^'"]+)['"][\s\S]+?title:\s*['"]([^'"]+)['"][\s\S]+?author:\s*['"]([^'"]+)['"][\s\S]+?coverUrl:\s*['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = bookBlockRegex.exec(content)) !== null) {
        books.push({
            id: match[1],
            title: match[2],
            author: match[3],
            coverUrl: match[4],
            fullMatch: match[0],
            index: match.index
        });
    }
    return { books, content };
}

function main() {
    if (!fs.existsSync(BOOKS_DIR)) {
        fs.mkdirSync(BOOKS_DIR, { recursive: true });
    }

    const classic = getBooks(CLASSIC_PATH);
    const more = getBooks(MORE_PATH);
    
    const allBooks = [...classic.books, ...more.books];
    const missingLocal = [];
    const external = [];
    
    allBooks.forEach(book => {
        if (book.coverUrl.startsWith('http')) {
            external.push(book);
        } else {
            const fileName = path.basename(book.coverUrl);
            const fullPath = path.join(BOOKS_DIR, fileName);
            if (!fs.existsSync(fullPath)) {
                missingLocal.push(book);
            }
        }
    });
    
    console.log(`Total Books Found: ${allBooks.length}`);
    console.log(`External URLs: ${external.length}`);
    console.log(`Missing Local Files: ${missingLocal.length}`);
    
    fs.writeFileSync('scripts/external_covers.json', JSON.stringify(external, null, 2));
    fs.writeFileSync('scripts/missing_local_covers.json', JSON.stringify(missingLocal, null, 2));
}

main();
