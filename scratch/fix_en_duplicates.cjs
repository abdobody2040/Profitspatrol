const fs = require('fs');
const path = 'src/locales/en.ts';
const src = fs.readFileSync(path, 'utf8');
const lines = src.split('\n');

// Find the real closing line (first occurrence of "} as const;")
const closingIdx = lines.findIndex(l => l.trim() === '} as const;');
console.log('Closing line index (0-based):', closingIdx, '=> line', closingIdx + 1);

// Everything from closingIdx+1 onwards is orphaned — extract the truly NEW blocks from it
const orphanSrc = lines.slice(closingIdx + 1).join('\n');

// Extract specific blocks from orphan
function extractBlock(name, text) {
  const re = new RegExp(`^    ${name}: \\{`, 'm');
  const start = text.search(re);
  if (start === -1) return null;
  let depth = 0;
  let i = start;
  while (i < text.length) {
    if (text[i] === '{') depth++;
    if (text[i] === '}') { depth--; if (depth === 0) return text.slice(start, i + 1); }
    i++;
  }
  return null;
}

const settingsBlock = extractBlock('settings', orphanSrc);
const familyBlock   = extractBlock('family', orphanSrc);

console.log('settings block found:', !!settingsBlock);
console.log('family block found:',   !!familyBlock);

// Build the new file: keep everything up to the closing line, inject new blocks before it, then close
const beforeClose = lines.slice(0, closingIdx).join('\n'); // everything before "  },"
// The real structure is:   translation: { ... },   — so we insert before the final `  },`
const insertionMarker = '    },\n  },'; // the ceo block closing + translation closing

let newContent = beforeClose;

// Insert settings and family before the final closing
const insertPoint = newContent.lastIndexOf('    ceo: {');
if (insertPoint !== -1) {
  const afterCeo = newContent.indexOf('\n    },', insertPoint) + '\n    },'.length;
  const toInsert = '\n' + (settingsBlock || '') + '\n\n' + (familyBlock || '');
  newContent = newContent.slice(0, afterCeo) + toInsert + '\n' + newContent.slice(afterCeo + 1);
} else {
  console.error('Could not find ceo block — aborting');
  process.exit(1);
}

newContent += '\n  },\n} as const;\n';

fs.writeFileSync(path, newContent, 'utf8');
console.log('✅ en.ts cleaned — duplicates removed, new blocks inserted');
