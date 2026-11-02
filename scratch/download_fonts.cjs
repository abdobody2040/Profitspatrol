const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

function fetch(url, userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36') {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': userAgent } }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(data), text: Buffer.concat(data).toString('utf-8') }));
    }).on('error', reject);
  });
}

async function run() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Cairo:wght@600;700;900&display=swap';
  console.log('Fetching Google Fonts CSS...');
  const { text: css } = await fetch(cssUrl);

  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  let localCssRules = [];
  let fileIndex = 0;

  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const urlMatch = block.match(/src:\s*url\((https:[^)]+\.woff2)\)/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+);/);

    if (familyMatch && weightMatch && urlMatch) {
      const family = familyMatch[1].trim();
      const weight = weightMatch[1].trim();
      const style = styleMatch ? styleMatch[1].trim() : 'normal';
      const remoteUrl = urlMatch[1].trim();
      const unicodeRange = unicodeMatch ? unicodeMatch[1].trim() : null;

      const safeFamily = family.toLowerCase().replace(/\s+/g, '-');
      const filename = `${safeFamily}-${weight}-${style}-${++fileIndex}.woff2`;
      const localFilePath = path.join(fontsDir, filename);

      console.log(`Downloading ${filename} from ${remoteUrl}...`);
      const { buffer } = await fetch(remoteUrl);
      fs.writeFileSync(localFilePath, buffer);

      let rule = `@font-face {\n  font-family: '${family}';\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n  src: url('/fonts/${filename}') format('woff2');`;
      if (unicodeRange) {
        rule += `\n  unicode-range: ${unicodeRange};`;
      }
      rule += '\n}';
      localCssRules.push(rule);
    }
  }

  const outputCssPath = path.join(__dirname, '..', 'public', 'fonts', 'fonts.css');
  fs.writeFileSync(outputCssPath, localCssRules.join('\n\n'));
  console.log(`Generated ${outputCssPath} with ${localCssRules.length} font faces.`);
}

run().catch(console.error);
