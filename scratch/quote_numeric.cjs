const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');
content = content.replace(/^  ([0-9][a-zA-Z0-9_]+): \{/gm, '  "$1": {');
fs.writeFileSync('src/locales/ar/exclusive_books.ts', content, 'utf8');
