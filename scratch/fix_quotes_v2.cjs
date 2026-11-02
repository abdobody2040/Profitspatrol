const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

const lines = content.split('\n');
const fixedLines = lines.map(line => {
  // If line starts with fullContent...
  if (line.trim().startsWith('fullContent')) {
    const parts = line.split(': ');
    if (parts.length === 2) {
      let value = parts[1].trim();
      // Remove trailing comma if exists
      if (value.endsWith(',')) value = value.substring(0, value.length - 1);
      
      // If value is not quoted, quote it with backticks
      if (!value.startsWith('`') && !value.startsWith("'") && !value.startsWith('"')) {
        return `${parts[0]}: \`${value}\`,`;
      } else if (!value.endsWith(',') && (value.endsWith('`') || value.endsWith("'") || value.endsWith('"'))) {
        // If it is quoted but has no comma, add comma
        return `${parts[0]}: ${value},`;
      }
    }
  }
  return line;
});

content = fixedLines.join('\n');
fs.writeFileSync('src/locales/ar/exclusive_books.ts', content, 'utf8');
