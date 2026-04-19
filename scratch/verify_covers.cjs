const fs = require('fs');
const src = fs.readFileSync('src/features/library/data/moreBooks.ts', 'utf8');
const exclusive = ['the-little-engine-that-could','kidpreneurs','rich-dad-poor-dad-for-teens','the-boy-who-harnessed-the-wind','charlie-chocolate-factory','the-alchemist-pp'];
exclusive.forEach(id => {
  const re = new RegExp('id:\\s*["\']' + id + '["\'][\\s\\S]{0,300}?coverUrl:\\s*["\']([^"\']+)["\']');
  const m = src.match(re);
  console.log(id + ': ' + (m ? m[1] : 'NOT FOUND'));
});
// Also verify local files exist
const booksDir = 'public/images/books';
exclusive.forEach(id => {
  const exists = fs.existsSync(booksDir + '/' + id + '.jpg') || fs.existsSync(booksDir + '/' + id + '.png');
  console.log('  file ' + id + '.jpg: ' + (exists ? 'EXISTS' : 'MISSING'));
});
