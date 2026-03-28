const fs = require('fs');
['de', 'es', 'fr'].forEach(l => {
  const p = 'src/locales/' + l + '.ts';
  let c = fs.readFileSync(p, 'utf8');
  // Just find the last index of '}' and slice up to it
  const lastBrace = c.lastIndexOf('}');
  if (lastBrace > -1) {
     c = c.substring(0, lastBrace + 1);
     c += '\n};\n';
     fs.writeFileSync(p, c);
     console.log('Fixed exactly ' + l);
  }
});
