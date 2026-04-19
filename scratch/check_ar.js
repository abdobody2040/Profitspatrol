const fs = require('fs');
const path = require('path');

const filePath = path.resolve('g:/Vibe coding/Profitspatrol/src/locales/ar.ts');

// Read with explicit UTF-8
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);
console.log('Lines 6648-6656:', lines.slice(6647, 6656).map((l, i) => `${6648+i}: ${l.substring(0,80)}`).join('\n'));
console.log('Lines 6944-6951:', lines.slice(6943, 6951).map((l, i) => `${6944+i}: ${l.substring(0,80)}`).join('\n'));
