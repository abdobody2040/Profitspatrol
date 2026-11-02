const fs = require('fs');

const filePath = 'g:/Vibe coding/Profitspatrol/src/locales/ar/library_books.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find property values that start with ' or " and cross a newline before they close
// This is a bit complex for regex. A better way is to iterate line by line and find open quotes.

const lines = content.split('\n');
let newLines = [];
let inQuote = null; // ' or "
let quoteStartIndex = -1;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (inQuote) {
    // We are inside a multi-line string. If it ends with the same quote, we found it.
    // Actually, we want to convert these to backticks.
    if (line.includes(inQuote + ',') || line.trim().endsWith(inQuote)) {
       // Close the quote and convert both ends to backticks
       let startLineIdx = quoteStartIndex;
       newLines[startLineIdx] = newLines[startLineIdx].replace(inQuote, '`');
       newLines.push(line.replace(inQuote, '`'));
       inQuote = null;
    } else {
       newLines.push(line);
    }
  } else {
    // Look for property definitions with multi-line strings
    if (line.includes(": '") && !line.includes("',") && !line.trim().endsWith("'") && !line.includes("`")) {
       inQuote = "'";
       quoteStartIndex = i;
       newLines.push(line);
    } else if (line.includes(': "') && !line.includes('",') && !line.trim().endsWith('"') && !line.includes("`")) {
       inQuote = '"';
       quoteStartIndex = i;
       newLines.push(line);
    } else {
       newLines.push(line);
    }
  }
}

fs.writeFileSync(filePath, newLines.join('\n'));
