const fs = require('fs');
const filePath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
  const trimmed = line.trim();
  // If a line contains a backtick but it's not starting or ending a property value
  if (line.includes('`')) {
    // Property value start/end are usually like:
    // fullContent_child: `...
    // ... `
    // If a backtick is in the middle of text and it's not escaped
    if (!trimmed.startsWith('fullContent_') && !trimmed.endsWith('`,') && !trimmed.endsWith('`')) {
       // Check if there is only one backtick on the line
       const count = (line.match(/`/g) || []).length;
       if (count % 2 !== 0) {
          console.log((i + 1) + ': ' + line);
       }
    }
  }
});
