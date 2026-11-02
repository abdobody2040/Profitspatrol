const fs = require('fs');
const path = require('path');

const brandDir = path.join(__dirname, '..', 'public', 'brand');
if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

// Check source generated image
const generatedImage = 'C:\\Users\\ABDO\\.gemini\\antigravity-ide\\brain\\d5fbc1d9-b9ab-419e-80ca-98058cc2a9a5\\ollie_mentor_avatar_1793110462105.jpg';

if (fs.existsSync(generatedImage)) {
  fs.copyFileSync(generatedImage, path.join(brandDir, 'ollie-logo.png'));
  fs.copyFileSync(generatedImage, path.join(brandDir, 'ollie-mentor.jpg'));
  console.log('Copied generated image to public/brand/ollie-logo.png');
} else {
  // Fallback to ollie_wave.png
  const fallback = path.join(__dirname, '..', 'public', 'assets', 'ollie_wave.png');
  if (fs.existsSync(fallback)) {
    fs.copyFileSync(fallback, path.join(brandDir, 'ollie-logo.png'));
    console.log('Copied ollie_wave.png to public/brand/ollie-logo.png');
  }
}
