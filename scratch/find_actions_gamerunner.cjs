const fs = require('fs');
const c = fs.readFileSync('src/features/games/components/GameRunner.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('primary-action') || l.includes('secondary-action')) {
    console.log(i + 1, l.trim());
  }
});

