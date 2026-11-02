const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  { input: 'public/images/hero/ollie-hero.png', output: 'public/images/hero/ollie-hero.webp', quality: 85, resize: { width: 640 } },
  { input: 'public/images/hero/hero.jpg', output: 'public/images/hero/hero.webp', quality: 85, resize: { width: 1000 } },
  { input: 'public/images/logo.png', output: 'public/images/logo.webp', quality: 90, resize: { width: 120 } },
  { input: 'public/images/logo_text.png', output: 'public/images/logo_text.webp', quality: 90, resize: { width: 400 } },
  { input: 'public/images/features/tycoon-thumb.png', output: 'public/images/features/tycoon-thumb.webp', quality: 85, resize: { width: 480 } },
  { input: 'public/images/features/pizza-thumb.png', output: 'public/images/features/pizza-thumb.webp', quality: 85, resize: { width: 480 } },
  { input: 'public/images/features/brand-thumb.png', output: 'public/images/features/brand-thumb.webp', quality: 85, resize: { width: 480 } },
  { input: 'public/images/features/stock-thumb.png', output: 'public/images/features/stock-thumb.webp', quality: 85, resize: { width: 480 } },
  { input: 'public/images/features/dashboard-preview.png', output: 'public/images/features/dashboard-preview.webp', quality: 85, resize: { width: 1200 } },
  { input: 'public/images/books/rich-dad-poor-dad.jpg', output: 'public/images/books/rich-dad-poor-dad.webp', quality: 85, resize: { width: 320 } },
  { input: 'public/images/books/atomic-habits.jpg', output: 'public/images/books/atomic-habits.webp', quality: 85, resize: { width: 320 } },
  { input: 'public/images/books/zero-to-one.jpg', output: 'public/images/books/zero-to-one.webp', quality: 85, resize: { width: 320 } },
];

async function run() {
  for (const img of images) {
    const inPath = path.join(__dirname, '..', img.input);
    const outPath = path.join(__dirname, '..', img.output);
    if (!fs.existsSync(inPath)) {
      console.warn('File not found:', inPath);
      continue;
    }
    const beforeSize = fs.statSync(inPath).size;
    let s = sharp(inPath);
    if (img.resize) {
      s = s.resize(img.resize.width, img.resize.height, { fit: 'inside' });
    }
    await s.webp({ quality: img.quality }).toFile(outPath);
    const afterSize = fs.statSync(outPath).size;
    console.log(`${img.output}: ${(beforeSize/1024).toFixed(1)}KB -> ${(afterSize/1024).toFixed(1)}KB (-${(100 - (afterSize/beforeSize)*100).toFixed(1)}%)`);
  }
}

run().catch(console.error);
