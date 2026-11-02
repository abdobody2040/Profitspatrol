const fs = require('fs');
const path = require('path');
const { NEW_VIDEOS } = require('./generate_50_videos.cjs');

console.log(`Loaded ${NEW_VIDEOS.length} new videos.`);

// Path to videos.ts
const videosPath = path.resolve(__dirname, '../src/features/education/data/videos.ts');
let content = fs.readFileSync(videosPath, 'utf8');

// Check existing count
const matchExisting = content.match(/id:\s*['"]vid_/g);
console.log(`Found ${matchExisting ? matchExisting.length : 0} existing videos in videos.ts`);

// We want to append NEW_VIDEOS right before the final `];`
const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find closing '];' in videos.ts");
  process.exit(1);
}

// Convert NEW_VIDEOS to formatted TypeScript code
function formatVideoToTs(v) {
  return '  ' + JSON.stringify(v, null, 2).split('\n').join('\n  ') + ',\n';
}

const formattedVideos = NEW_VIDEOS.map(formatVideoToTs).join('');

const newContent = content.slice(0, lastBracketIndex) + formattedVideos + '];\n';

fs.writeFileSync(videosPath, newContent, 'utf8');
console.log('Successfully updated videos.ts!');

// Verify new count
const updatedContent = fs.readFileSync(videosPath, 'utf8');
const newMatches = updatedContent.match(/id:\s*['"]vid_/g);
console.log(`New total videos count in videos.ts: ${newMatches ? newMatches.length : 0}`);
