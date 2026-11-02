const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputPath = 'C:\\Users\\ABDO\\.gemini\\antigravity-ide\\brain\\d5fbc1d9-b9ab-419e-80ca-98058cc2a9a5\\.user_uploaded\\media_1793111734465.png';
const brandDir = path.join(__dirname, '..', 'public', 'brand');

async function fineTuneCrop() {
  const size = 260;
  const left = 68; // Centered on beak
  const top = 25;

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

  // Also update public/images/characters_clean/ollie_idle.png or fallback if appropriate
  // Also save the full turnaround sheet in public/brand/ for reference
  fs.copyFileSync(inputPath, path.join(brandDir, 'ollie_turnaround_sheet.png'));

  console.log('Fine-tuned Ollie model avatar saved to public/brand/');
}

fineTuneCrop().catch(console.error);
