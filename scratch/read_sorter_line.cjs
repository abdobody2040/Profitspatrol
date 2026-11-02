const fs = require('fs');
const c = fs.readFileSync('src/features/games/components/GameRunner.tsx', 'utf8');
const lines = c.split('\n');
console.log(lines[166]);
console.log(lines[167]);
console.log(lines[168]);

