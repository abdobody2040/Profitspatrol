const fs = require('fs');
const path = require('path');

const targets = [
  'npc', 'tank', 'estate', 'capstone', 'library', 'mission', 'gameregistry', 'gameresult', 'competenc', 'mastery'
];

function searchFiles(dir) {
  let list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') searchFiles(full);
    } else {
      const lower = file.toLowerCase();
      targets.forEach(t => {
        if (lower.includes(t)) {
          console.log(`Matched [${t}]: ${full.replace(/\\/g, '/')}`);
        }
      });
    }
  });
}

searchFiles('src');
