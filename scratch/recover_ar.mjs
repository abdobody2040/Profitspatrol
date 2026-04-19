import { readFileSync, writeFileSync } from 'fs';

// The file was corrupted by PowerShell reading it as Default encoding 
// (Windows code page, possibly 1256 for Arabic or 1252)
// and then writing with -Encoding UTF8
// This caused each UTF-8 byte to be treated as a Windows code page character
// and then re-encoded as UTF-8

// Strategy: Read raw bytes, convert from UTF-8-as-latin1 back to original
const rawBuf = readFileSync('src/locales/ar.ts');

// Try to detect what happened:
// The raw bytes contain the "double-encoded" UTF-8
// Each original UTF-8 byte was treated as a Windows-1252/Latin-1 character
// and encoded as UTF-8, so each Arabic char (2-3 byte UTF-8) became 4-6 bytes

// Reverse: decode raw bytes as UTF-8, then take each char code as a byte
const asUtf8String = rawBuf.toString('utf8');

// Convert each character back to its byte value (Latin-1 decode)
const recoveredBytes = [];
for (let i = 0; i < asUtf8String.length; i++) {
  const code = asUtf8String.charCodeAt(i);
  if (code <= 0xFF) {
    recoveredBytes.push(code);
  } else {
    // Multi-byte char that was already part of UTF-8 sequence mapped via code page
    // This shouldn't happen if the encoding was consistent Latin-1
    recoveredBytes.push(63); // '?' as placeholder
  }
}

const recoveredBuf = Buffer.from(recoveredBytes);
const result = recoveredBuf.toString('utf8');

if (result.includes('أ') && result.includes('library_books') && result.includes('debate')) {
  // Check a few key lines
  const lines = result.split('\n');
  console.log('Success! Lines:', lines.length);
  console.log('Line 50:', lines[49]);
  console.log('Line 100:', lines[99]);
  
  // Now we need to also remove the duplicate section
  // The second library_books starts at line 6652 in the ORIGINAL
  // But after recovery we need to check what line that maps to
  let libCount = 0;
  let secondLibLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'library_books: {' || lines[i].trim() === 'library_books:{') {
      libCount++;
      if (libCount === 2) { secondLibLine = i; break; }
    }
  }
  console.log('Second library_books at line:', secondLibLine + 1);
  
  writeFileSync('src/locales/ar.ts', result, 'utf8');
} else {
  console.log('Recovery approach failed');
  console.log('First 200 chars:', result.substring(0, 200));
  console.log('Has Arabic:', /[\u0600-\u06FF]/.test(result));
}
