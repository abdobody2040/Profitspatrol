const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimize() {
  const brandDir = path.join(__dirname, '..', 'public', 'brand');
  const srcImg = path.join(brandDir, 'ollie-logo.png');
  
  if (fs.existsSync(srcImg)) {
    // Generate webp version
    await sharp(srcImg)
      .resize(256, 256, { fit: 'cover' })
      .webp({ quality: 90 })
      .toFile(path.join(brandDir, 'ollie-logo.webp'));
      
    await sharp(srcImg)
      .resize(256, 256, { fit: 'cover' })
      .png({ quality: 90 })
      .toFile(path.join(brandDir, 'ollie-logo-opt.png'));

    console.log('Successfully optimized Ollie brand avatar to WebP and PNG');
  }
}

optimize().catch(console.error);
