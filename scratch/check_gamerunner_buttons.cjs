const fs = require('fs');
const c = fs.readFileSync('src/features/games/components/GameRunner.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<button') && !l.includes('primary-action') && !l.includes('secondary-action') && !l.includes('money-piece') && !l.includes('choice-button')) {
    console.log(i + 1, l.trim().slice(0, 100));
  }
});

