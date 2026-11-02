const fs = require('fs');
const path = require('path');
const booksDir = 'public/images/books';
const dataDir = 'src/features/library/data';
const existingImages = new Set(fs.readdirSync(booksDir));
const missing = [];
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const regex = /coverUrl:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const url = match[1];
      if (url.startsWith('/images/books/')) {
        const img = url.replace('/images/books/', '');
        if (!existingImages.has(img)) missing.push({file, img});
      }
    }
  }
});
console.error(missing);
