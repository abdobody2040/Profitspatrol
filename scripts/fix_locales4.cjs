const fs = require('fs');

['de', 'es', 'fr'].forEach(l => {
  const p = 'src/locales/' + l + '.ts';
  let c = fs.readFileSync(p, 'utf8');
  
  // Find the exact location where the JSON starts
  const prefixMatcher = `export const ${l} = {`;
  let startIdx = c.indexOf(prefixMatcher);
  
  // If we can't find it, maybe the prefix is slightly different
  if (startIdx === -1) {
      console.log(`Failed to find prefix for ${l}`);
      return;
  }
  
  // Extract just the part after "export const de = "
  let jsonPart = c.substring(c.indexOf('{', startIdx));
  
  // We know it ends with garbage like }\n};\n
  // Let's clean it by finding the last valid closing brace that parses.
  
  // A dumb but 100% effective way: Just replace all literal \n with spaces!
  // No, that replaces \n inside translations!
  
  // Actually, we ONLY have trailing garbage.
  // We can just find the LAST instance of "translation": { ... }
  // Since we only have a single root key "translation", we can do:
  const lastTranslationIdx = jsonPart.lastIndexOf('"translation":');
  // It's a huge object, we just want to remove the specific literal string "\n"
  
  // Here is the ultimate fix:
  // The garbage is strictly at the END of the file.
  // Let's split the file by "}" and find the last valid JSON.
  let validStr = false;
  let len = jsonPart.length;
  
  while(len > 0) {
      jsonPart = jsonPart.substring(0, len);
      try {
          JSON.parse(jsonPart);
          validStr = true;
          break; // It parsed!
      } catch (e) {
          // If it fails, remove the last character and try again
          len--;
      }
  }
  
  if (validStr) {
      const finalTs = `export const ${l} = ` + jsonPart + ';\n';
      fs.writeFileSync(p, finalTs);
      console.log('Successfully repaired ' + l);
  } else {
      console.log('Failed to parse ' + l);
  }
});
