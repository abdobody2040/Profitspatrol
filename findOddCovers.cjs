const fs = require('fs');
const path = require('path');
const dataDir = 'src/features/library/data';
const oddUrls = [];
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const regex = /coverUrl:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const url = match[1];
      if (!url.startsWith('/images/books/') && !url.startsWith('http')) {
        oddUrls.push({file, url});
      }
    }
  }
});
