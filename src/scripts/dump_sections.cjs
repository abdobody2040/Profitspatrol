const fs = require('fs');

const content = fs.readFileSync('ultimate upgrades.md', 'utf8');
const lines = content.split(/\r?\n/);

const sections = [];
let currentSec = null;

lines.forEach((line, idx) => {
  const match = line.match(/^# ([0-9]+)\. (.*)/);
  if (match) {
    if (currentSec) {
      currentSec.endLine = idx;
    }
    currentSec = {
      num: parseInt(match[1], 10),
      title: match[2].trim(),
      startLine: idx + 1,
      endLine: lines.length,
      subsections: []
    };
    sections.push(currentSec);
  } else if (currentSec && line.startsWith('## ')) {
    currentSec.subsections.push(line.replace(/^## /, '').trim());
  }
});

console.log('Discovered', sections.length, 'numbered master sections.');
fs.writeFileSync('src/scripts/sections_dump.json', JSON.stringify(sections, null, 2), 'utf8');
console.log('Saved sections dump to src/scripts/sections_dump.json');
