/**
 * Fix unescaped single quotes inside single-quoted strings in ar.ts.
 * Strategy: for every line that has  : '...  and contains an unescaped ' inside the value,
 * we replace the outer delimiters with double-quotes and escape any inner double-quotes.
 */
const fs = require('fs');
const path = 'src/locales/ar.ts';
let src = fs.readFileSync(path, 'utf8');
const lines = src.split('\n');

const fixed = lines.map((line, i) => {
  // Only touch lines whose value part starts with '  (key: 'value' pattern)
  // Look for:  <whitespace><key>: '<body>'<optional comma>
  const m = line.match(/^(\s*\S+\s*:\s*)'(.*)',?\s*$/);
  if (!m) return line;

  const prefix = line.match(/^(\s*\S+\s*:\s*)/)[0]; // everything up to opening quote
  const rawValue = m[2]; // everything between the outer single quotes

  // Count unescaped single quotes inside the value
  const unescaped = (rawValue.match(/(?<!\\)'/g) || []).length;
  if (unescaped === 0) return line; // nothing to fix

  // Switch to double-quote delimiters; escape any existing double-quotes in value
  const safeValue = rawValue.replace(/"/g, '\\"');
  const trailingComma = line.trimEnd().endsWith(',') ? ',' : '';
  return `${prefix}"${safeValue}"${trailingComma}`;
});

const result = fixed.join('\n');
fs.writeFileSync(path, result, 'utf8');
console.log('Fixed unescaped single-quote strings in ar.ts');
