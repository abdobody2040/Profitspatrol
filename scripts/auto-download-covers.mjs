/**
 * scripts/auto-download-covers.mjs
 *
 * Finds all book entries in moreBooks.ts / classicBooks.ts that still use
 * external URLs (http*) and downloads a proper cover for each one using:
 *   1. Open Library Covers API  (free, no key)
 *   2. Google Books API         (free, no key, rate-limited)
 *
 * After downloading, it patches the source file so the coverUrl points to the
 * local /images/books/<id>.jpg path.
 *
 * Usage:
 *   node scripts/auto-download-covers.mjs
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
const TASK_SUFFIXES = ['-quiz', '-reflection', '-action', '-share', '-application'];
const DELAY_MS = 800; // polite delay between API calls

// ─── Book → search title mapping (override if auto-search gives wrong result) ──
// Format:  'book-id': 'Exact search title to use'
const TITLE_OVERRIDES = {
  'five-am-club-teen':          'The 5 AM Club Robin Sharma',
  'the-hobbit-business':        'The Hobbit J.R.R. Tolkien',
  'charlottes-web-pr':          "Charlotte's Web E.B. White",
  'alice-wonderland-biz':       "Alice's Adventures in Wonderland Lewis Carroll",
  'the-little-prince-biz':      'The Little Prince Antoine de Saint-Exupery',
  'treasure-island-biz':        'Treasure Island Robert Louis Stevenson',
  'the-giver-biz':              'The Giver Lois Lowry',
  'richest-man-babylon-teens':  'The Richest Man in Babylon George Clason',
  'dune-biz':                   'Dune Frank Herbert',
  'fahrenheit-451-biz':         'Fahrenheit 451 Ray Bradbury',
  'enders-game-biz':            "Ender's Game Orson Scott Card",
  'i-robot-biz':                'I Robot Isaac Asimov',
  'bad-blood-biz':              'Bad Blood Secrets and Lies John Carreyrou',
  'everything-store-biz':       'The Everything Store Jeff Bezos Brad Stone',
  'the-big-short-biz':          'The Big Short Michael Lewis',
  'liars-poker-biz':            "Liar's Poker Michael Lewis",
  'disneywar-biz':              'DisneyWar James Stewart',
  'red-notice-biz':             'Red Notice Bill Browder',
  'billion-dollar-whale-biz':   'Billion Dollar Whale Tom Wright',
  'win-friends-biz':            'How to Win Friends and Influence People Dale Carnegie',
  'art-of-war-biz':             'The Art of War Sun Tzu',
};

// ─── Utilities ─────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'ProfitsPatrol/1.0 cover-downloader' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    lib.get(url, { headers: { 'User-Agent': 'ProfitsPatrol/1.0 cover-downloader' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// ─── Source 1: Open Library ────────────────────────────────────────────────────
async function tryOpenLibrary(title, destPath) {
  const query = encodeURIComponent(title);
  const searchUrl = `https://openlibrary.org/search.json?q=${query}&limit=5&fields=key,cover_i,title`;
  const res = await get(searchUrl);
  if (res.status !== 200) return false;

  let data;
  try { data = JSON.parse(res.body); } catch { return false; }

  const docs = (data.docs || []).filter(d => d.cover_i);
  if (!docs.length) return false;

  const coverId = docs[0].cover_i;
  const imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

  try {
    await downloadFile(imageUrl, destPath);
    // Verify it's actually an image (Open Library returns 1x1 GIF for missing covers)
    const stat = fs.statSync(destPath);
    if (stat.size < 5000) {
      fs.unlinkSync(destPath);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Source 2: Google Books ────────────────────────────────────────────────────
async function tryGoogleBooks(title, destPath) {
  const query = encodeURIComponent(title);
  const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&fields=items(volumeInfo(imageLinks))`;
  const res = await get(searchUrl);
  if (res.status !== 200) return false;

  let data;
  try { data = JSON.parse(res.body); } catch { return false; }

  const items = data.items || [];
  for (const item of items) {
    const links = item?.volumeInfo?.imageLinks;
    if (!links) continue;
    // Prefer highest resolution available
    const url = (links.extraLarge || links.large || links.medium || links.thumbnail || '')
      .replace('http://', 'https://')
      .replace('zoom=1', 'zoom=3');
    if (!url) continue;

    try {
      await downloadFile(url, destPath);
      const stat = fs.statSync(destPath);
      if (stat.size < 3000) {
        fs.unlinkSync(destPath);
        continue;
      }
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

// ─── Extract book list from TS source ─────────────────────────────────────────
function extractBooksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const books = [];
  let currentId = null;

  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/^\s+id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
      const id = idMatch[1];
      if (!TASK_SUFFIXES.some(s => id.endsWith(s))) {
        currentId = id;
      }
    }

    const coverMatch = lines[i].match(/^\s+coverUrl:\s*['"]([^'"]+)['"]/);
    if (coverMatch && currentId) {
      books.push({ id: currentId, coverUrl: coverMatch[1], lineIndex: i, filePath });
      currentId = null;
    }
  }
  return books;
}

// ─── Patch source file ─────────────────────────────────────────────────────────
function patchCoverUrl(filePath, lineIndex, newUrl) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  lines[lineIndex] = lines[lineIndex].replace(/coverUrl:\s*['"][^'"]*['"]/, `coverUrl: '${newUrl}'`);
  fs.writeFileSync(filePath, lines.join('\n'));
}

// ─── ID → readable title ───────────────────────────────────────────────────────
function idToTitle(id) {
  return id
    .replace(/-biz$|-teen$|-teens$|-yr$|-pp$|-young-reader$|-biz$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(BOOKS_DIR)) fs.mkdirSync(BOOKS_DIR, { recursive: true });

  const allBooks = DATA_FILES.flatMap(extractBooksFromFile);
  const needDownload = allBooks.filter(b => b.coverUrl.startsWith('http'));

  if (needDownload.length === 0) {
    console.log('✅ All covers are already local! Nothing to download.');
    return;
  }

  console.log(`\n🔍 Found ${needDownload.length} books still using external URLs. Downloading...\n`);

  let success = 0;
  let failed = 0;

  for (const book of needDownload) {
    const destName = `${book.id}.jpg`;
    const destPath = path.join(BOOKS_DIR, destName);
    const localUrl = `/images/books/${destName}`;
    const searchTitle = TITLE_OVERRIDES[book.id] || idToTitle(book.id);

    // Skip if already downloaded in a previous run
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      console.log(`⏩ [SKIP]  ${book.id} — already exists`);
      patchCoverUrl(book.filePath, book.lineIndex, localUrl);
      success++;
      continue;
    }

    process.stdout.write(`📥 [${book.id}] Searching "${searchTitle}"... `);

    let downloaded = false;

    // Try Open Library first
    try {
      downloaded = await tryOpenLibrary(searchTitle, destPath);
      if (downloaded) process.stdout.write(`✅ Open Library\n`);
    } catch (e) {
      // ignore, fall through
    }

    // Fall back to Google Books
    if (!downloaded) {
      await sleep(DELAY_MS);
      try {
        downloaded = await tryGoogleBooks(searchTitle, destPath);
        if (downloaded) process.stdout.write(`✅ Google Books\n`);
      } catch (e) {
        // ignore
      }
    }

    if (downloaded) {
      patchCoverUrl(book.filePath, book.lineIndex, localUrl);
      success++;
    } else {
      process.stdout.write(`❌ FAILED — keeping external URL\n`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅ Downloaded & patched: ${success}`);
  console.log(`❌ Failed (kept original): ${failed}`);
  if (failed === 0) {
    console.log(`\n🎉 All covers are now local!`);
  } else {
    console.log(`\n⚠️  Run "node scripts/check-missing-covers.mjs" to see remaining issues.`);
  }
}

main().catch(console.error);
