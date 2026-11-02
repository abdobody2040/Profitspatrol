const fs = require('fs');
const path = require('path');

const booksDir = 'public/images/books';
const dataDir = 'src/features/library/data';

const existingImages = fs.readdirSync(booksDir);
const usedImages = new Set();

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /coverUrl:\s*['"]\/images\/books\/([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    usedImages.add(match[1]);
  }
}

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    checkFile(path.join(dataDir, file));
  }
});

const unusedImages = existingImages.filter(img => !usedImages.has(img));
