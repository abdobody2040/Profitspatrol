const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputPath = 'C:\\Users\\ABDO\\.gemini\\antigravity-ide\\brain\\d5fbc1d9-b9ab-419e-80ca-98058cc2a9a5\\.user_uploaded\\media_1793111734465.png';
const brandDir = path.join(__dirname, '..', 'public', 'brand');

async function testCrop() {
  // Crop around head and upper body
  // Head width is ~200px, centered around x=170 in col 1 (0..341)
  // Let's take a 250x250 square centered at x=170, y=155
  const size = 250;
  const left = 45; // 170 - 125
  const top = 30;  // 155 - 125

  await sharp(inputPath)
    .extract({ left, top, width: size, height: size })
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(brandDir, 'ollie-logo.png'));

  await sharp(inputPath)
    .extract({ left, top, width: size, height: size })
    .resize(512, 512, { fit: 'cover' })
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-logo.webp'));

  // Also do a slightly wider full-head-and-tie version
  const size2 = 280;
  const left2 = 30;
  const top2 = 25;

  await sharp(inputPath)
    .extract({ left: left2, top: top2, width: size2, height: size2 })
    .resize(512, 512, { fit: 'cover' })
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-logo-wide.webp'));

  console.log('Done test crops');
}

testCrop().catch(console.error);
