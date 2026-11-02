const fs = require('fs');
const c = fs.readFileSync('src/features/games/styles/game-ui.css', 'utf8');
const lines = c.split('\n');
console.log('Total lines in game-ui.css:', lines.length);
console.log(lines.slice(25, 110).join('\n'));

