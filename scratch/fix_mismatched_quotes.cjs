const fs = require('fs');
const filePath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const newLines = lines.map(line => {
  let l = line.trim();
  // Fix backticked keys: `key': { -> 'key': {
  if (l.startsWith('`') && l.includes("': {")) {
    return line.replace('`', "'");
  }
  // Fix mismatched start/end: `text' -> 'text'
  if (l.startsWith('`') && l.endsWith("',")) {
    return line.replace('`', "'");
  }
  return line;
});

fs.writeFileSync(filePath, newLines.join('\n'));
