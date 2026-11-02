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
  const root = obj.translation || obj;
  console.log(file, {
    hasRootTranslation: !!obj.translation,
    'games.districts.money': root.games?.districts?.money,
    'arcade.cat_retail': root.arcade?.cat_retail,
    'arcade.play_now': root.arcade?.play_now,
    'games.pricing_lab': !!root.games?.pricing_lab,
  });
});
