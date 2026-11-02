const fs = require('fs');

const filePath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// Also ensure all multi-line strings use backticks (re-run fix)
const lines = content.split('\n');
let newLines = [];
let inQuote = null;
let quoteStartIndex = -1;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (inQuote) {
    if (line.includes(inQuote + ',') || line.trim().endsWith(inQuote) || line.trim() === inQuote + '}') {
       newLines[quoteStartIndex] = newLines[quoteStartIndex].replace(inQuote, '`');
       newLines.push(line.replace(inQuote, '`'));
       inQuote = null;
    } else {
       newLines.push(line);
    }
  } else {
    if ((line.includes(": '") || line.trim().startsWith("'")) && !line.includes("',") && !line.trim().endsWith("'") && !line.includes("`")) {
       inQuote = "'";
       quoteStartIndex = i;
       newLines.push(line);
    } else if ((line.includes(': "') || line.trim().startsWith('"')) && !line.includes('",') && !line.trim().endsWith('"') && !line.includes("`")) {
       inQuote = '"';
       quoteStartIndex = i;
       newLines.push(line);
    } else {
       newLines.push(line);
    }
  }
}

fs.writeFileSync(filePath, newLines.join('\n'));
