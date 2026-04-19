const fs = require('fs');
['de', 'es', 'fr'].forEach(l => {
  const p = 'src/locales/' + l + '.ts';
  let c = fs.readFileSync(p, 'utf8');
  // Find the first {
  const firstBrace = c.indexOf('{');
  // Find the last } safely by just matching regex to the end
  // Actually, we can just use `eval` to get the object since it's just a JS object!
  // To avoid syntax errors from the literal \\n, we first strip the export
  c = c.substring(c.indexOf('=') + 1).trim();
  // c might end with multiple }\\n};\\n
  // Let's just fix it by replacing ALL literal `\\n` with nothing at the end of the file.
  c = c.replace(/\\\\n/g, ''); // just remove all literal \n from the entire file ! Wait, what if there's \n in translations?
  // Let's cleanly fix ONLY the very end.
  // We know the valid JSON string we want ends at the matched brackets.
  // A simpler way:
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/\\}?\\\\n\\}?\\\\n\\}?;?\\\\n?$/g, '\\n};\\n');
  // Just brutally find `translation:` and parse the rest if possible?
  
  // Easiest regex to fix the end of the file:
  // It looks like: }\n}\n};\n at the end right now
  let clean = fs.readFileSync(p, 'utf8');
  // remove all "\n" strings at the end, and all extra "}"
  clean = clean.replace(/(?:\\\\n|\\n|\\}|;)+$/g, '\\n};\\n');
  fs.writeFileSync(p, clean);
  console.log('Fixed end of ' + l);
});
