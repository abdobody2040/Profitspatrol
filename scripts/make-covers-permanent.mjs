/**
 * scripts/make-covers-permanent.mjs
 *
 * Permanently ensures ALL coverUrl references in classicBooks.ts and moreBooks.ts
 * point to valid, existing local files in public/images/books/.
 *
 * Strategy:
 * 1. Scan every coverUrl line in both data files
 * 2. If external (http) → try to download it, then patch the source
 * 3. If local but FILE MISSING → use a smart fallback:
 *      a. Try downloading from Open Library using the book ID as a title
 *      b. Copy the closest existing cover as a placeholder
 * 4. Print a full report at the end
 *
 * Usage:
 *   node scripts/make-covers-permanent.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// ─── Config ────────────────────────────────────────────────────────────────────
const BOOKS_DIR = 'public/images/books';
const DATA_FILES = [
  'src/features/library/data/classicBooks.ts',
  'src/features/library/data/moreBooks.ts',
];
const FALLBACK_COVER = `${BOOKS_DIR}/default-book.jpg`; // always exists

// ─── HTTP helpers ──────────────────────────────────────────────────────────────
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'ProfitsPatrol/1.0' } }, res => {
      if ([301, 302].includes(res.statusCode)) return httpGet(res.headers.location).then(resolve).catch(reject);
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    lib.get(url, { headers: { 'User-Agent': 'ProfitsPatrol/1.0' } }, res => {
      if ([301, 302].includes(res.statusCode)) {
        file.close(); fs.unlink(dest, () => {});
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Open Library lookup ───────────────────────────────────────────────────────
async function downloadFromOpenLibrary(title, dest) {
  try {
    const r = await httpGet(`https://openlibrary.org/search.json?q=${encodeURIComponent(title)}&limit=3&fields=cover_i`);
    if (r.status !== 200) return false;
    const docs = JSON.parse(r.body).docs?.filter(d => d.cover_i) || [];
    if (!docs.length) return false;
    const url = `https://covers.openlibrary.org/b/id/${docs[0].cover_i}-L.jpg`;
    await downloadFile(url, dest);
    return fs.existsSync(dest) && fs.statSync(dest).size > 5000;
  } catch { return false; }
}

// ─── Google Books lookup ───────────────────────────────────────────────────────
async function downloadFromGoogleBooks(title, dest) {
  try {
    const r = await httpGet(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&maxResults=3&fields=items(volumeInfo(imageLinks))`);
    if (r.status !== 200) return false;
    const items = JSON.parse(r.body).items || [];
    for (const item of items) {
      const links = item?.volumeInfo?.imageLinks;
      if (!links) continue;
      const url = (links.extraLarge || links.large || links.medium || links.thumbnail || '')
        .replace('http://', 'https://')
        .replace('zoom=1', 'zoom=3');
      if (!url) continue;
      try {
        await downloadFile(url, dest);
        if (fs.existsSync(dest) && fs.statSync(dest).size > 3000) return true;
      } catch { continue; }
    }
    return false;
  } catch { return false; }
}

// ─── Convert book ID to readable search title ──────────────────────────────────
function idToTitle(id) {
  return id
    .replace(/-(biz|teens?|yr|pp|young-reader|business)$/g, '')
    .split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
}

// ─── Patch a specific line in a file ──────────────────────────────────────────
function patchLine(filePath, lineIndex, oldUrl, newUrl) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  if (lines[lineIndex]?.includes(oldUrl)) {
    lines[lineIndex] = lines[lineIndex].replace(oldUrl, newUrl);
    fs.writeFileSync(filePath, lines.join('\n'));
    return true;
  }
  return false;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(BOOKS_DIR)) fs.mkdirSync(BOOKS_DIR, { recursive: true });

  const existingFiles = new Set(fs.readdirSync(BOOKS_DIR).map(f => f.toLowerCase()));

  let totalCoverUrls = 0;
  let alreadyOk = 0;
  let fixed = 0;
  let usedFallback = 0;
  let issues = [];

  for (const filePath of DATA_FILES) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');

    // Also track the nearest id above each coverUrl for naming
    let currentId = null;

    for (let i = 0; i < lines.length; i++) {
      const idMatch = lines[i].match(/^\s+id:\s*['"]([^'"]+)['"]/);
      if (idMatch) currentId = idMatch[1];

      const coverMatch = lines[i].match(/^\s+coverUrl:\s*['"]([^'"]+)['"]/);
      if (!coverMatch) continue;

      totalCoverUrls++;
      const rawUrl = coverMatch[1];

      // ── Case 1: Already a valid local file ───────────────────────────────────
      if (!rawUrl.startsWith('http')) {
        const fname = path.basename(rawUrl).toLowerCase();
        if (existingFiles.has(fname)) {
          alreadyOk++;
          continue;
        }
        // Local path but file missing — fall through to repair
      }

      // ── Case 2: External URL or missing local — need to fix ──────────────────
      const bookId = currentId || `book-line-${i}`;
      const destName = `${bookId}.jpg`;
      const destPath = path.join(BOOKS_DIR, destName);
      const newLocalUrl = `/images/books/${destName}`;

      // Already downloaded in a previous pass?
      if (existingFiles.has(destName.toLowerCase()) && fs.statSync(destPath).size > 5000) {
        patchLine(filePath, i, rawUrl, newLocalUrl);
        alreadyOk++;
        continue;
      }

      const title = idToTitle(bookId);
      process.stdout.write(`🔍 [${bookId}] "${title}" ... `);

      // Try Open Library first
      let ok = await downloadFromOpenLibrary(title, destPath);
      if (ok) { process.stdout.write(`✅ Open Library\n`); }

      // Try Google Books
      if (!ok) {
        await sleep(500);
        ok = await downloadFromGoogleBooks(title, destPath);
        if (ok) { process.stdout.write(`✅ Google Books\n`); }
      }

      if (ok) {
        existingFiles.add(destName.toLowerCase());
        patchLine(filePath, i, rawUrl, newLocalUrl);
        fixed++;
      } else {
        // Use fallback cover
        process.stdout.write(`⚠️  using default cover\n`);
        if (fs.existsSync(FALLBACK_COVER)) {
          fs.copyFileSync(FALLBACK_COVER, destPath);
          existingFiles.add(destName.toLowerCase());
          patchLine(filePath, i, rawUrl, newLocalUrl);
          usedFallback++;
          issues.push({ bookId, reason: 'Could not download — using default cover' });
        }
      }

      await sleep(400);
    }
  }

  // ── Final report ─────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log(`  Total coverUrl entries scanned: ${totalCoverUrls}`);
  console.log(`  ✅ Already OK (local + file exists): ${alreadyOk}`);
  console.log(`  ✅ Fixed (downloaded + patched):      ${fixed}`);
  console.log(`  ⚠️  Used default fallback cover:      ${usedFallback}`);
  console.log('══════════════════════════════════════════');

  if (issues.length) {
    console.log('\n⚠️  Books using default cover (open to improve later):');
    issues.forEach(i => console.log(`   • ${i.bookId}: ${i.reason}`));
  }

  if (fixed === 0 && usedFallback === 0) {
    console.log('\n🎉 All covers are permanently local! Nothing to do.');
  }
}

main().catch(console.error);
