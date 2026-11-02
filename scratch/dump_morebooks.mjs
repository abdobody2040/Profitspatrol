import fs from 'fs';
const content = fs.readFileSync('src/features/library/data/moreBooks.ts', 'utf-8');
const lines = content.split('\n');

const results = [];
let currentId = null;

for(let i=0; i<lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/^\s+id:\s*['"]([^'"]+)['"]/);
  if(idMatch && !idMatch[1].includes('-quiz') && !idMatch[1].includes('-reflection') && !idMatch[1].includes('-action')) {
    currentId = idMatch[1];
  }
  
  const coverMatch = line.match(/^\s+coverUrl:\s*['"]([^'"]+)['"]/);
  if(coverMatch && currentId) {
    results.push({ id: currentId, coverUrl: coverMatch[1] });
    currentId = null;
  }
}

console.log(JSON.stringify(results.slice(0, 10), null, 2));
