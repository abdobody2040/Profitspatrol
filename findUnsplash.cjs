const fs = require('fs');
const path = require('path');
const dataDir = 'src/features/library/data';

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?coverUrl:\s*['"](http[^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const id = match[1];
      const url = match[2];
      if (!id.includes('-quiz-') && !id.includes('-reflection-') && !id.includes('-action-') && !id.includes('-share-') && !id.includes('-application-') && !id.includes('-video-')) {
         console.log(id, '->', url);
      }
    }
  }
});
