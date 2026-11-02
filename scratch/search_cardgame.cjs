const fs = require('fs');
const content = fs.readFileSync('src/games/card-game/CardGame.tsx', 'utf8');
const lines = content.split('\n');

console.log('--- Lines matching back, pattern, or renderCard ---');
lines.forEach((line, idx) => {
  if (/back|pattern|card-back|draw|flip|rotateY|face/i.test(line)) {
    console.log(`${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
