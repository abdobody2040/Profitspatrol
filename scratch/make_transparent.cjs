const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brandDir = path.join(__dirname, '..', 'public', 'brand');
const logoPath = path.join(brandDir, 'ollie-logo.png');

async function makeTransparent() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const threshold = 248;
  const softThreshold = 238;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // If pixel is near pure white
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0; // Completely transparent
    } else if (r >= softThreshold && g >= softThreshold && b >= softThreshold) {
      // Soft feathering for edges
      const minVal = Math.min(r, g, b);
      const factor = (threshold - minVal) / (threshold - softThreshold);
      data[i + 3] = Math.round(data[i + 3] * factor);
    }
  }

  // Save transparent PNG
  const transparentPng = path.join(brandDir, 'ollie-logo-transparent.png');
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(transparentPng);

  // Save transparent WebP
  await sharp(transparentPng)
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-logo-transparent.webp'));

  console.log('Successfully created transparent Ollie model avatar!');
}

makeTransparent().catch(console.error);
