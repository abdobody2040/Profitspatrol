const fs = require('fs');
const content = fs.readFileSync('g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  const line = l.trim();
  if (line.includes('`') && line.includes("'")) {
    // Potential mismatch
    // Except if one is inside the other or it's a template literal with a single quote
    // But in our case, they are usually at the start/end of the line
    if ((line.startsWith('`') && line.endsWith("',")) || (line.startsWith("'") && line.endsWith("`,"))) {
       console.log((i + 1) + ': ' + l);
    }
    // Also check for backticks in keys
    if (line.startsWith('`') && line.includes("': {")) {
       console.log((i + 1) + ': ' + l);
    }
  }
});
