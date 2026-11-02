const fs = require('fs');
const content = fs.readFileSync('src/features/education/data/videos.ts', 'utf8');

// Find all video IDs
const lines = content.split('\n');
const videoIds = [];
for (let line of lines) {
  const m = line.match(/(?:['"]?id['"]?)\s*:\s*['"](vid_[^'"]+)['"]/);
  if (m) {
    videoIds.push(m[1]);
  }
}

console.log('Total unique video IDs:', new Set(videoIds).size);
console.log('Total video ID occurrences:', videoIds.length);
console.log('First 5 IDs:', videoIds.slice(0, 5));
console.log('Last 5 IDs:', videoIds.slice(-5));
