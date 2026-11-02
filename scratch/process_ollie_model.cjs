const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputPath = 'C:\\Users\\ABDO\\.gemini\\antigravity-ide\\brain\\d5fbc1d9-b9ab-419e-80ca-98058cc2a9a5\\.user_uploaded\\media_1793111734465.png';

async function process() {
  const metadata = await sharp(inputPath).metadata();
  console.log(`Image dimensions: ${metadata.width}x${metadata.height}`);
  
  // The image has 3 columns and 2 rows.
  // Col 1, Row 1 (top-left): Front-view T-pose
  // Col 3, Row 2 (bottom-right): 3/4 Perspective front view
  
  const colWidth = Math.round(metadata.width / 3);
  const rowHeight = Math.round(metadata.height / 2);
  
  console.log(`Col width: ${colWidth}, Row height: ${rowHeight}`);
  
  // Top-left full figure
  const topLeftFull = path.join(__dirname, '..', 'public', 'brand', 'ollie_model_front_full.png');
  await sharp(inputPath)
    .extract({ left: 0, top: 0, width: colWidth, height: rowHeight })
    .toFile(topLeftFull);

  // Top-left bust/portrait (crop to focus on head and upper body for avatar circle)
  // Let's crop centered horizontally in col 1, top ~5% to ~70%
  const bustWidth = Math.round(colWidth * 0.85);
  const bustHeight = Math.round(rowHeight * 0.75);
  const bustLeft = Math.round((colWidth - bustWidth) / 2);
  const bustTop = Math.round(rowHeight * 0.05);
  
  const brandDir = path.join(__dirname, '..', 'public', 'brand');
  
  // Save bust avatar
  await sharp(inputPath)
    .extract({ left: bustLeft, top: bustTop, width: bustWidth, height: bustHeight })
    .resize(400, 400, { fit: 'cover', position: 'top' })
    .png()
    .toFile(path.join(brandDir, 'ollie-logo.png'));

  await sharp(inputPath)
    .extract({ left: bustLeft, top: bustTop, width: bustWidth, height: bustHeight })
    .resize(400, 400, { fit: 'cover', position: 'top' })
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-logo.webp'));

  // Also extract bottom-right 3/4 perspective view
  const brLeft = colWidth * 2;
  const brTop = rowHeight;
  const brWidth = metadata.width - brLeft;
  const brHeight = metadata.height - brTop;
  
  await sharp(inputPath)
    .extract({ left: brLeft, top: brTop, width: brWidth, height: brHeight })
    .toFile(path.join(brandDir, 'ollie_model_perspective_full.png'));

  // Also save a 3/4 bust avatar
  const brBustWidth = Math.round(brWidth * 0.85);
  const brBustHeight = Math.round(brHeight * 0.75);
  const brBustLeft = brLeft + Math.round((brWidth - brBustWidth) / 2);
  const brBustTop = brTop + Math.round(brHeight * 0.05);

  await sharp(inputPath)
    .extract({ left: brBustLeft, top: brBustTop, width: brBustWidth, height: brBustHeight })
    .resize(400, 400, { fit: 'cover', position: 'top' })
    .webp({ quality: 95 })
    .toFile(path.join(brandDir, 'ollie-mentor-34.webp'));

  console.log('Successfully generated Ollie model avatars from uploaded model sheet!');
}

process().catch(console.error);
