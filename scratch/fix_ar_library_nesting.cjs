const fs = require('fs');
let src = fs.readFileSync('src/locales/ar.ts', 'utf8');

// The bad structure: steps key is followed immediately by exclusive_banner_desc (missing track_progress + closing brace)
// Fix: add missing track_progress and close the tasks object before the library-level keys
src = src
  .replace(
    "        steps: '\u0627\u0644\u062e\u0637\u0648\u0627\u062a:',\n      exclusive_banner_desc:",
    "        steps: '\u0627\u0644\u062e\u0637\u0648\u0627\u062a:',\n        track_progress: '\u062a\u062a\u0628\u0639 \u062a\u0642\u062f\u0645\u0643:',\n      },\n      exclusive_banner_desc:"
  );

fs.writeFileSync('src/locales/ar.ts', src, 'utf8');

// Verify syntax
const js = src.replace('export const ar', 'const ar').replace('} as const;', '}');
try { new Function(js); console.log('SYNTAX OK'); }
catch(e) { console.error('SYNTAX ERROR:', e.message); }
