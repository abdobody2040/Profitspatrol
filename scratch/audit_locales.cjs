const fs = require('fs');

function parse(lang) {
  let content = fs.readFileSync('src/locales/' + lang + '.ts', 'utf8');
  content = content.replace(/export\s+const\s+\w+\s*=/, 'const _x =');
  content = content.replace(/}\s*as\s*const\s*;\s*$/, '}');
  const fn = new Function(content + '; return _x.translation || _x;');
  return fn();
}

['en', 'es', 'fr', 'de'].forEach(lang => {
  const obj = parse(lang);
  console.log(`\n=== ${lang.toUpperCase()} NAV ===`);
  console.log(JSON.stringify(obj.nav, null, 2));
  console.log(`=== ${lang.toUpperCase()} BOTTOM NAV ===`);
  console.log(JSON.stringify(obj.bottomNav, null, 2));
});

