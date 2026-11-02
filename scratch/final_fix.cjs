const fs = require('fs');
let content = fs.readFileSync('src/locales/ar/exclusive_books.ts', 'utf8');

// Match lines like: fullContent_child: ## 👦👦 ... ,
// and replace with: fullContent_child: `## 👦👦 ... `,
content = content.replace(/^(\s*fullContent(?:_child|_teen)?: )([^`'"{].*),?$/gm, (match, p1, p2) => {
  let value = p2.trim();
  if (value.endsWith(',')) value = value.substring(0, value.length - 1);
  return `${p1}\`${value}\`,`;
});

// Also fix lines that have a backtick but no comma
content = content.replace(/^(\s*fullContent(?:_child|_teen)?: `.*`)$(?!\s*,)/gm, '$1,');

fs.writeFileSync('src/locales/ar/exclusive_books.ts', content, 'utf8');
