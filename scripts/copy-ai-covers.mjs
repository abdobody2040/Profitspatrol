/**
 * scripts/copy-ai-covers.mjs
 * 
 * Copies AI-generated covers from the artifacts folder to public/images/books/
 * and patches the source data files to point to local URLs.
 * 
 * Usage:
 *   node scripts/copy-ai-covers.mjs
 */

import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\ABDO\\.gemini\\antigravity\\brain\\b2ea58e5-d7a1-44da-b03d-db0e4dbed902';
const BOOKS_DIR = 'public/images/books';
const DATA_FILES = [
  'src/features/library/data/classicBooks.ts',
  'src/features/library/data/moreBooks.ts',
];

// Map of book-id → artifact filename prefix (before the timestamp)
const AI_COVERS = {
  'five-am-club-teen':         'five_am_club_teen',
  'the-hobbit-business':       'the_hobbit_business',
  'charlottes-web-pr':         'charlottes_web_pr',
  'treasure-island-biz':       'treasure_island_biz',
  'enders-game-biz':           'enders_game_biz',
  'the-big-short-biz':         'the_big_short_biz',
  'the-little-prince-biz':     'the_little_prince_biz',
  'the-giver-biz':             'the_giver_biz',
  'richest-man-babylon-teens': 'richest_man_babylon_teens',
  'dune-biz':                  'dune_biz',
  'fahrenheit-451-biz':        'fahrenheit_451_biz',
  'bad-blood-biz':             'bad_blood_biz',
  'liars-poker-biz':           'liars_poker_biz',
  'disneywar-biz':             'disneywar_biz',
  'red-notice-biz':            'red_notice_biz',
  'billion-dollar-whale-biz':  'billion_dollar_whale_biz',
  'win-friends-biz':           'win_friends_biz',
  'art-of-war-biz':            'art_of_war_biz',
};

function findArtifact(prefix) {
  const files = fs.readdirSync(ARTIFACTS_DIR);
  // Find matching PNG file
  const match = files.find(f => f.startsWith(prefix + '_') && (f.endsWith('.png') || f.endsWith('.jpg')));
  return match ? path.join(ARTIFACTS_DIR, match) : null;
}

function patchCoverUrl(id, newUrl) {
  for (const filePath of DATA_FILES) {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let foundId = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(new RegExp(`id:\\s*['"]${id}['"]`))) {
        foundId = true;
      }
      if (foundId && lines[i].match(/coverUrl:/)) {
        const oldLine = lines[i];
        lines[i] = lines[i].replace(/coverUrl:\s*['"][^'"]*['"]/, `coverUrl: '${newUrl}'`);
        if (lines[i] !== oldLine) {
          fs.writeFileSync(filePath, lines.join('\n'));
          return true;
        }
        foundId = false;
      }
    }
  }
  return false;
}

async function main() {
  if (!fs.existsSync(BOOKS_DIR)) fs.mkdirSync(BOOKS_DIR, { recursive: true });

  let copied = 0;
  let missing = 0;

  for (const [bookId, prefix] of Object.entries(AI_COVERS)) {
    const destName = `${bookId}.jpg`;
    const destPath = path.join(BOOKS_DIR, destName);
    const localUrl = `/images/books/${destName}`;

    // Skip if already a good local file
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      process.stdout.write(`⏩ [SKIP] ${bookId} — already exists locally\n`);
      // Still patch in case it's still an external URL
      patchCoverUrl(bookId, localUrl);
      copied++;
      continue;
    }

    const src = findArtifact(prefix);
    if (!src) {
      console.log(`❌ [MISS] ${bookId} — artifact not found for prefix "${prefix}"`);
      missing++;
      continue;
    }

    try {
      fs.copyFileSync(src, destPath);
      patchCoverUrl(bookId, localUrl);
      console.log(`✅ [COPY] ${bookId} ← ${path.basename(src)}`);
      copied++;
    } catch (e) {
      console.log(`❌ [FAIL] ${bookId} — ${e.message}`);
      missing++;
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Copied & patched: ${copied}`);
  console.log(`❌ Missing artifact: ${missing}`);
}

main();
