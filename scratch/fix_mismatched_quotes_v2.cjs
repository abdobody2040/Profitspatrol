const fs = require('fs');
const filePath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Regex for property values with mismatched quotes
// Matches things like title: `text', or summary: 'text`,
content = content.replace(/:\s*`([^`']*)',/g, ": '$1',");
content = content.replace(/:\s*'([^`']*)`,/g, ": '$1',");

// Also fix the keys
content = content.replace(/^\s*`([^`']*)':/gm, "  '$1':");

fs.writeFileSync(filePath, content);
