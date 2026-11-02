const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

// Remove the "export const exclusive_books = " part
const prefix = "export const exclusive_books = ";
const objectStr = content.substring(content.indexOf(prefix) + prefix.length);

// We need to handle the fact that it might end with a semicolon
let cleanObjectStr = objectStr.trim();
if (cleanObjectStr.endsWith(';')) cleanObjectStr = cleanObjectStr.substring(0, cleanObjectStr.length - 1);

try {
  // Use a Function constructor to safely evaluate the object literal
  const obj = new Function(`return ${cleanObjectStr}`)();
  
  // Now stringify it back with nice formatting
  // We want to preserve backticks for fullContent
  const newContent = prefix + '{\n' + Object.keys(obj).map(key => {
    const b = obj[key];
    return `  ${key}: {
    title_child: ${JSON.stringify(b.title_child)},
    title: ${JSON.stringify(b.title)},
    title_teen: ${JSON.stringify(b.title_teen)},
    summary_child: ${JSON.stringify(b.summary_child)},
    summary: ${JSON.stringify(b.summary)},
    summary_teen: ${JSON.stringify(b.summary_teen)},
    keyLessons_child: ${JSON.stringify(b.keyLessons_child)},
    keyLessons_teen: ${JSON.stringify(b.keyLessons_teen)},
    fullContent_child: \`${b.fullContent_child.replace(/`/g, '\\`')}\`,
    fullContent_teen: \`${b.fullContent_teen.replace(/`/g, '\\`')}\`,
    fullContent: \`${b.fullContent.replace(/`/g, '\\`')}\`,
  },`;
  }).join('\n') + '\n};\n';

  fs.writeFileSync('src/locales/ar/exclusive_books.ts', newContent, 'utf8');
} catch (e) {
  console.error('Failed to parse object:', e.message);
  // If eval fails, it's because of the syntax error.
  // We need to fix the syntax error first.
}
