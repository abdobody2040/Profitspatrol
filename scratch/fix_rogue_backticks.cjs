const fs = require('fs');
const filePath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const newLines = lines.map((line, i) => {
  const trimmed = line.trim();
  if (line.includes('`')) {
    // If it's a property start or end, leave it
    if (trimmed.startsWith('fullContent_') && trimmed.endsWith('`')) return line; // Single line backtick
    if (trimmed.startsWith('fullContent_') && line.includes('`')) {
       // If it has ONLY ONE backtick and it's at the start of the value, leave it
       const firstIdx = line.indexOf('`');
       const lastIdx = line.lastIndexOf('`');
       if (firstIdx === lastIdx) return line;
    }
    if (trimmed.endsWith('`,') || trimmed.endsWith('`')) {
       // If it has ONLY ONE backtick and it's at the end, leave it
       const firstIdx = line.indexOf('`');
       const lastIdx = line.lastIndexOf('`');
       if (firstIdx === lastIdx) return line;
    }
    
    // Otherwise, replace all backticks with double quotes on this line
    // UNLESS it's a legitimate template literal that somehow got caught
    // But in our identified list, they are all rogue.
    return line.replace(/`/g, '"');
  }
  return line;
});

fs.writeFileSync(filePath, newLines.join('\n'));
