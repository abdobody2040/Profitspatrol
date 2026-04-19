const fs = require('fs');
['de', 'es', 'fr'].forEach(l => {
  const p = 'src/locales/' + l + '.ts';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(`export const ${l} = {\\n  translation:`, `export const ${l} = {
  translation:`);
  c = c.replace('\\n};\\n', '\\n};\\n'); // Wait, the end tag is fine! Actually let's just use regex to fix all the literal \\n into real newlines. No wait, just split and join.
  c = c.split('\\n};\\n').join('\\n};\\n'); // No, let's just use replace with right string.
  c = c.split('\\\\n};\\\\n').join('\\n};\\n');
  fs.writeFileSync(p, c);
  console.log('Fixed ' + l);
});
