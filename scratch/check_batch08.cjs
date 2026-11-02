const fs = require('fs');
const c = fs.readFileSync('src/features/games/styles/batch08.css', 'utf8');
const lines = c.split('\n');
console.log(lines.slice(0, 5).join('\n'));

