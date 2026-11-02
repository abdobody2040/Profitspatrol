const fs = require('fs');
const path = require('path');
const dataDir = 'src/features/library/data';
const arFile = 'src/locales/ar/library_books.ts';
const arContent = fs.readFileSync(arFile, 'utf-8');

const missingIds = [];

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const regex = /id:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const id = match[1];
      if (id.includes('-quiz-') || id.includes('-reflection-') || id.includes('-action-') || id.includes('-share-') || id.includes('-application-') || id.includes('-video-')) continue;
      
      const key = id.replace(/-/g, '_');
      if (!arContent.includes(key + ': {') && !arContent.includes("'" + key + "': {")) {
        missingIds.push(id);
      }
    }
  }
});
console.error('Total missing:', missingIds.length);
fs.writeFileSync('missing_ids.json', JSON.stringify(missingIds, null, 2));
