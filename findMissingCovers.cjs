const fs = require('fs');
const path = require('path');

const booksDir = 'public/images/books';
const dataDir = 'src/features/library/data';

const existingImages = new Set(fs.readdirSync(booksDir));
const missingImages = [];

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /coverUrl:\s*['"]\/images\/books\/([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const imageName = match[1];
    if (!existingImages.has(imageName)) {
      missingImages.push({ file: path.basename(filePath), image: imageName });
    }
  }
}

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    checkFile(path.join(dataDir, file));
  }
});

console.error('Missing covers:', missingImages);
