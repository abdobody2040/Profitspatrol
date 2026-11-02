const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

// Quote keys that start with a digit or are otherwise invalid identifiers
// Also, let's just quote ALL keys to be safe.
const lines = content.split('\n');
const fixedLines = lines.map(line => {
  const match = line.match(/^(\s*)([a-zA-Z0-9_]+): \{/);
  if (match) {
    return `${match[1]}'${match[2]}': {`;
  }
  return line;
});

content = fixedLines.join('\n');
fs.writeFileSync('src/locales/ar/exclusive_books.ts', content, 'utf8');
