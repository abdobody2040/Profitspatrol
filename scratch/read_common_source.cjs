const fs = require('fs');
const c = fs.readFileSync('src/features/games/locales/sourceResources.ts', 'utf8');
const lines = c.split('\n');
console.log('Total lines:', lines.length);
// Find common keys
console.log(lines.slice(0, 35).join('\n'));

