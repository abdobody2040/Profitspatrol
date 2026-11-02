const fs = require('fs');
const path = require('path');
function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) search(full);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('Play Now') || content.includes('play_now')) {
        console.log('MATCH:', full);
      }
    }
  }
}
search('src');

