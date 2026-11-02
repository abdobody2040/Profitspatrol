const fs = require('fs');
const path = require('path');

const dataDir = 'src/features/library/data';
const imagesDir = 'public/images/books';

const images = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
const imageNames = images.map(i => i.replace('.jpg', '').replace('.png', ''));

let replacedCount = 0;

fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    
    // regex to match id and coverUrl
    const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?coverUrl:\s*['"](http[^'"]+)['"]/g;
    let match;
    const replacements = [];
    while ((match = regex.exec(content)) !== null) {
      const id = match[1];
      const urlMatch = match[2];
      
      // try to find a local image
      let localMatch = null;
      
      // perfect match with ID
      if (imageNames.includes(id)) {
        localMatch = id;
      } else {
        // try to find partial match
        const parts = id.split('-');
        // check if any image starts with the first few parts
        const possible = imageNames.find(i => id.includes(i) || i.includes(id.replace('-quiz', '').replace('-teen', '')));
        if (possible) {
          localMatch = possible;
        }
      }
      
      if (localMatch) {
        const fullFileName = images.find(i => i.startsWith(localMatch));
        if (fullFileName) {
          replacements.push({ url: urlMatch, local: '/images/books/' + fullFileName });
        }
      }
    }
    
    replacements.forEach(r => {
      content = content.replace(r.url, r.local);
      changed = true;
      replacedCount++;
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content);
    }
  }
});
