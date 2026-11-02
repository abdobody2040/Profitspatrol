const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');
const lines = content.split('\n');
const fixedLines = lines.map(line => {
  const trimmed = line.trim();
  if (trimmed.endsWith('`') && !trimmed.endsWith(',`')) {
    return line + ',';
  }
  return line;
});
fs.writeFileSync('src/locales/ar/exclusive_books.ts', fixedLines.join('\n'), 'utf8');
console.error('Added missing commas after backticks.');
