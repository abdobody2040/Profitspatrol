const fs = require('fs');

['de', 'es', 'fr'].forEach(l => {
  const p = 'src/locales/' + l + '.ts';
  let c = fs.readFileSync(p, 'utf8');
  
  // Find "translation: {" and get everything from the { onwards
  const translationIdx = c.indexOf('translation:');
  const startBrace = c.indexOf('{', translationIdx);
  
  if (startBrace === -1) {
      console.log(`Failed to find translation { for ${l}`);
      return;
  }
  
  let jsonPart = c.substring(startBrace);
  
  let validStr = false;
  let len = jsonPart.length;
  
  while(len > 0) {
      const attempt = jsonPart.substring(0, len);
      try {
          JSON.parse(attempt);
          jsonPart = attempt; // Successfully parsed!
          validStr = true;
          break; 
      } catch (e) {
          len--;
      }
  }
  
  if (validStr) {
      const finalTs = `export const ${l} = {\n  translation: ` + jsonPart + '\n};\n';
      fs.writeFileSync(p, finalTs);
      console.log('Successfully repaired ' + l);
  } else {
      console.log('Failed to parse inner JSON of ' + l);
  }
});
