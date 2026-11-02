const fs = require('fs');
const content = fs.readFileSync('src/features/library/data/classicBooks.ts', 'utf-8');
const ids = ['empire-state-of-mind', 'invent-and-wander', 'iacocca', 'big-magic', 'war-of-art', 'factfulness'];
ids.forEach(id => {
  const regex = new RegExp("id:\\s*'" + id + "',[\\s\\S]*?title:\\s*'([^']+)',[\\s\\S]*?summary:\\s*'([^']+)'");
  const match = regex.exec(content);
  if (match) {
    console.log('ID:', id);
    console.log('Title:', match[1]);
    console.log('Summary:', match[2]);
    console.log('---');
  }
});
