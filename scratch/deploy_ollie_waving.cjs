const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const newImage = 'C:\\Users\\ABDO\\.gemini\\antigravity-ide\\brain\\d5fbc1d9-b9ab-419e-80ca-98058cc2a9a5\\ollie_waving_hi_1793112842348.jpg';
const brandDir = path.join(__dirname, '..', 'public', 'brand');
const charactersOllieDir = path.join(__dirname, '..', 'public', 'characters', 'ollie');
const assetsDir = path.join(__dirname, '..', 'public', 'assets');

async function deploy() {
  if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

  // 1. Primary brand avatar (512x512)
  await sharp(newImage)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(brandDir, 'ollie-logo.png'));

  await sharp(newImage)
    .resize(512, 512, { fit: 'cover' })
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-logo.webp'));

  // 2. High-res waving assets
  await sharp(newImage)
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(path.join(brandDir, 'ollie-waving.png'));

  await sharp(newImage)
    .resize(1024, 1024, { fit: 'cover' })
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-waving.webp'));

  // 3. Characters ollie wave.webp
  if (fs.existsSync(charactersOllieDir)) {
    await sharp(newImage)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 95 })
      .toFile(path.join(charactersOllieDir, 'wave.webp'));
  }

  // 4. Assets ollie_wave.png
  if (fs.existsSync(assetsDir)) {
    await sharp(newImage)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toFile(path.join(assetsDir, 'ollie_wave.png'));
  }

  console.log('Successfully deployed Ollie waving model across public assets!');
}

deploy().catch(console.error);
