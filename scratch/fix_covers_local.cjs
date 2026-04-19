/**
 * Downloads exclusive book covers from Open Library and saves them locally.
 * Also fixes all classicBooks.ts coverUrl to use local /images/books/ paths.
 */
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const BOOKS_DIR = path.join(__dirname, '../public/images/books');

// Exclusive books: id → ISBN for Open Library cover download
const exclusiveCovers = [
  { id: 'the-little-engine-that-could',   isbn: '9780448405209', filename: 'the-little-engine-that-could.jpg' },
  { id: 'kidpreneurs',                     isbn: '9781599183602', filename: 'kidpreneurs.jpg' },
  { id: 'rich-dad-poor-dad-for-teens',    isbn: '9780762439621', filename: 'rich-dad-poor-dad-for-teens.jpg' },
  { id: 'the-boy-who-harnessed-the-wind', isbn: '9780803740808', filename: 'the-boy-who-harnessed-the-wind.jpg' },
  { id: 'charlie-chocolate-factory',      isbn: '9780142410318', filename: 'charlie-chocolate-factory.jpg' },
  { id: 'the-alchemist-pp',              isbn: '9780061122415', filename: 'the-alchemist-pp.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => {
      fs.unlink(dest, () => {});
      reject(e);
    });
  });
}

async function main() {
  console.log('Downloading exclusive book covers...\n');
  for (const book of exclusiveCovers) {
    const dest = path.join(BOOKS_DIR, book.filename);
    if (fs.existsSync(dest)) {
      console.log('  SKIP (exists):', book.filename);
      continue;
    }
    const url = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 1000) {
        // Open Library returned a tiny "no cover" image
        fs.unlinkSync(dest);
        console.log('  ⚠️  No cover on OpenLibrary for', book.id, '— will use default');
      } else {
        console.log('  ✅', book.filename, '(' + size + ' bytes)');
      }
    } catch (e) {
      console.error('  ❌', book.id, ':', e.message);
    }
  }

  // Now fix classicBooks.ts coverUrls to use local paths
  console.log('\nFixing classicBooks.ts coverUrls to local paths...');
  const CLASSIC_PATH = path.join(__dirname, '../src/features/library/data/classicBooks.ts');
  let classic = fs.readFileSync(CLASSIC_PATH, 'utf8');

  // Map of book id → local filename (only those that exist locally)
  const localFiles = fs.readdirSync(BOOKS_DIR);
  const idToLocal = {
    'think-and-grow-rich':                   'think-and-grow-rich.jpg',
    'mindset-the-new-psychology-of-success': 'mindset.jpg',
    '7-habits-of-highly-effective-people':   '7-habits.jpg',
    'atomic-habits':                         'atomic-habits.jpg',
    'how-to-win-friends-and-influence-people':'win-friends.jpg',
    'start-with-why':                        'start-with-why.jpg',
    'grit':                                  'grit.jpg',
    'zero-to-one':                           'zero-to-one.jpg',
    'lean-startup':                          'the-lean-startup.jpg',
    'good-to-great':                         'good-to-great.jpg',
    'innovators-dilemma':                    'innovators-dilemma.jpg',
    'blue-ocean-strategy':                   'blue-ocean-strategy.jpg',
    'hooked':                                'hooked.jpg',
    'contagious':                            'contagious.jpg',
    'purple-cow':                            'purple-cow.jpg',
    'built-to-last':                         'built-to-last.jpg',
    'crossing-the-chasm':                    'crossing-the-chasm.jpg',
    'business-model-generation':             'business-model-generation.jpg',
    'sprint':                                'sprint.jpg',
    'traction':                              'traction.jpg',
    '100-startup':                           '100-startup.jpg',
    'running-lean':                          'running-lean.jpg',
    'playing-to-win':                        'playing-to-win.jpg',
    'measure-what-matters':                  'measure-what-matters.jpg',
    'made-to-stick':                         'made-to-stick.jpg',
    'dotcom-secrets':                        'dotcom-secrets.jpg',
    'influence':                             'influence.jpg',
    'leaders-eat-last':                      'leaders-eat-last.jpg',
    'rework':                                'rework.jpg',
    'e-myth-revisited':                      'e-myth-revisited.jpg',
    'this-is-marketing':                     'this-is-marketing.jpg',
    'building-a-storybrand':                 'building-a-storybrand.jpg',
    'traffic-secrets':                       'traffic-secrets.jpg',
    'rich-dad-poor-dad':                     'rich-dad-poor-dad.jpg',
    'richest-man-in-babylon':                'richest-man.jpg',
    'psychology-of-money':                   'psychology-money.jpg',
    'i-will-teach-you-to-be-rich':           'i-will-teach-you-to-be-rich.jpg',
    'profit-first':                          'profit-first.jpg',
    'automatic-millionaire':                 'automatic-millionaire.jpg',
    'magic-of-thinking-big':                 'magic-of-thinking-big.jpg',
    'power-of-positive-thinking':            'power-of-positive-thinking.jpg',
    'thinking-fast-and-slow':               'thinking-fast-and-slow.jpg',
    '4-hour-workweek':                       '4-hour-workweek.jpg',
    'quiet':                                 'quiet.jpg',
    'originals':                             'originals.jpg',
    'ego-is-the-enemy':                      'ego-is-the-enemy.jpg',
    'obstacle-is-the-way':                   'obstacle-is-the-way.jpg',
    'who-moved-my-cheese':                   'who-moved-my-cheese.jpg',
    '5-am-club':                             '5-am-club.jpg',
    'deep-work':                             'deep-work.jpg',
    'digital-minimalism':                    'digital-minimalism.jpg',
    'essentialism':                          'essentialism.jpg',
    'cant-hurt-me':                          'cant-hurt-me.jpg',
    'extreme-ownership':                     'extreme-ownership.jpg',
    'awaken-the-giant-within':               'awaken-the-giant-within.jpg',
    'limitless':                             'limitless.jpg',
    'make-your-bed':                         'make-your-bed.jpg',
    'switch':                                'switch.jpg',
    'compound-effect':                       'the-compound-effect.jpg',
    'shoe-dog':                              'shoe-dog.jpg',
    'steve-jobs':                            'steve-jobs.jpg',
    'elon-musk':                             'elon-musk.jpg',
    'creativity-inc':                        'creativity-inc.jpg',
    'made-in-america':                       'made-in-america.jpg',
    'snowball':                              'the-snowball.jpg',
    'titan':                                 'titan.jpg',
    'everything-store':                      'the-everything-store.jpg',
    'grinding-it-out':                       'grinding-it-out.jpg',
    'pour-your-heart-into-it':               'pour-your-heart-into-it.jpg',
    'delivering-happiness':                  'delivering-happiness.jpg',
    'bad-blood':                             'bad-blood.jpg',
    'alibaba':                               'alibaba.jpg',
    'disneys-land':                          'disneys-land.jpg',
    'wings-of-fire':                         'wings-of-fire.jpg',
    'open':                                  'open.jpg',
    'becoming':                              'becoming.jpg',
    'greenlights':                           'greenlights.jpg',
    'will':                                  'will.png',
    'empire-state-of-mind':                  'empire-state-of-mind.jpg',
    'ride-of-a-lifetime':                    'the-ride-of-a-lifetime.jpg',
    'invent-and-wander':                     'invent-and-wander.jpg',
    'iacocca':                               'iacocca.jpg',
    'virgin-way':                            'the-virgin-way.jpg',
    'steal-like-an-artist':                  'steal-like-an-artist.jpg',
    'show-your-work':                        'show-your-work.jpg',
    'big-magic':                             'big-magic.jpg',
    'war-of-art':                            'the-war-of-art.jpg',
    'factfulness':                           'factfulness.jpg',
    'sapiens':                               'sapiens.jpg',
    'freakonomics':                          'freakonomics.jpg',
    'outliers':                              'outliers.jpg',
    'tipping-point':                         'the-tipping-point.jpg',
    'david-and-goliath':                     'david-and-goliath.jpg',
    'money-master-the-game':                 'money-master-the-game.jpg',
    'unshakeable':                           'unshakeable.jpg',
    'intelligent-investor':                  'the-intelligent-investor.jpg',
    'one-up-on-wall-street':                 'one-up-on-wall-street.jpg',
    'team-of-teams':                         'team-of-teams.jpg',
    'trillion-dollar-coach':                 'trillion-dollar-coach.jpg',
  };

  let fixCount = 0;
  for (const [id, filename] of Object.entries(idToLocal)) {
    if (!localFiles.includes(filename)) continue;
    const localPath = `/images/books/${filename}`;
    const idEscaped = id.replace(/-/g, '\\-');
    const re = new RegExp(`(id:\\s*'${idEscaped}'[\\s\\S]{0,200}?)coverUrl:\\s*'[^']*'`, 'g');
    const before = classic;
    classic = classic.replace(re, (m, pre) => `${pre}coverUrl: '${localPath}'`);
    if (classic !== before) fixCount++;
  }
  fs.writeFileSync(CLASSIC_PATH, classic, 'utf8');
  console.log(`Fixed ${fixCount} coverUrl entries to use local paths`);

  // Fix moreBooks.ts for exclusive books that were downloaded
  console.log('\nFixing moreBooks.ts coverUrls...');
  const MORE_PATH = path.join(__dirname, '../src/features/library/data/moreBooks.ts');
  let more = fs.readFileSync(MORE_PATH, 'utf8');
  let moreFixCount = 0;
  for (const book of exclusiveCovers) {
    const dest = path.join(BOOKS_DIR, book.filename);
    const localPath = `/images/books/${book.filename}`;
    const idEscaped = book.id.replace(/-/g, '\\-');
    const re = new RegExp(`(id:\\s*["']${idEscaped}["'][\\s\\S]{0,200}?)coverUrl:\\s*["'][^"']*["']`, 'g');
    const before = more;
    more = more.replace(re, (m, pre) => `${pre}coverUrl: "${localPath}"`);
    if (more !== before) {
      moreFixCount++;
      console.log('  Updated:', book.id, '→', localPath);
    }
  }
  fs.writeFileSync(MORE_PATH, more, 'utf8');
  console.log(`Fixed ${moreFixCount} exclusive book coverUrls`);

  console.log('\n✅ All done!');
}

main().catch(console.error);
