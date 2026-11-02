const fs = require('fs');
const content = fs.readFileSync('src/features/library/data/classicBooks.ts', 'utf-8');
const ids = ['empire-state-of-mind', 'invent-and-wander', 'iacocca', 'big-magic', 'war-of-art', 'factfulness'];
ids.forEach(id => {
  const lines = content.split('\n');
  const index = lines.findIndex(l => l.includes("id: '" + id + "'"));
  if (index !== -1) {
    for (let i = index; i < index + 10; i++) {
      if (lines[i] && lines[i].includes('coverUrl')) {
        console.log(id, '->', lines[i].trim());
      }
    }
  }
});
