const fs = require('fs');

const content = fs.readFileSync('ultimate upgrades.md', 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines in ultimate upgrades.md:', lines.length);

const sections = [];
lines.forEach((line, idx) => {
  if (line.startsWith('# ')) {
    sections.push({ line: idx + 1, level: 1, text: line });
  } else if (line.startsWith('## ')) {
    sections.push({ line: idx + 1, level: 2, text: line });
  }
});

sections.forEach(s => {
  const indent = s.level === 1 ? '' : '  ';
  console.log(`${s.line.toString().padStart(4)}: ${indent}${s.text}`);
});
