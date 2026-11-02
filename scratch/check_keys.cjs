const fs = require('fs');

function parseTs(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/^export\s+(const\s+\w+\s*=|default)\s*/m, '');
  content = content.replace(/as\s+const\s*;?\s*$/, '');
  content = content.replace(/;\s*$/, '');
  return eval('(' + content + ')');
}

['src/locales/en.ts', 'src/locales/es.ts', 'src/locales/fr.ts', 'src/locales/de.ts'].forEach(file => {
  const obj = parseTs(file);
  console.log(file, {
    'games.districts': !!(obj.games && obj.games.districts),
    'districts': !!obj.districts,
    'games.pricing_lab': !!(obj.games && obj.games.pricing_lab),
    'games.play_now': !!(obj.games && obj.games.play_now),
    'arcade.cat_retail': !!(obj.arcade && obj.arcade.cat_retail)
  });
});
