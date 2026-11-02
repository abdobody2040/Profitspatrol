const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

// Fix unquoted fullContent lines
// Pattern: fullContent: followed by something that doesn't start with ` or ' or "
// and ends with , at the end of the line.
const lines = content.split('\n');
const fixedLines = lines.map(line => {
  const match = line.match(/^(\s*fullContent(?:_child|_teen)?: )([^`'"{].+),$/);
  if (match) {
    return `${match[1]}\`${match[2]}\`,`;
  }
  return line;
});

content = fixedLines.join('\n');
fs.writeFileSync('src/locales/ar/exclusive_books.ts', content, 'utf8');
