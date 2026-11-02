const fs = require('fs');
const path = require('path');

const allowedVisualTypes = ['chart', 'coins', 'piggybank', 'store', 'lemonade', 'stocks', 'trophy', 'umbrella'];

function fixVideo(v) {
  // Fix scenes visualType
  if (v.animationConfig && v.animationConfig.scenes) {
    v.animationConfig.scenes.forEach(s => {
      if (s.visualType && !allowedVisualTypes.includes(s.visualType)) {
        if (s.visualType === 'tree') s.visualType = 'stocks';
        else if (s.visualType === 'target') s.visualType = 'trophy';
        else if (s.visualType === 'piggy') s.visualType = 'piggybank';
        else s.visualType = 'coins';
      }
    });
  }

  // Fix challenge
  if (v.challenge) {
    const ch = v.challenge;
    const instructions = ch.instructions || ch.steps || [];
    const instructionsAr = ch.instructionsAr || ch.stepsAr || [];
    const rewardXp = ch.rewardXp || ch.xpReward || 100;
    const rewardTokens = ch.rewardTokens || ch.tokenReward || 50;
    const proofType = ch.proofType || 'photo';

    v.challenge = {
      id: ch.id,
      title: ch.title,
      titleAr: ch.titleAr,
      description: ch.description,
      descriptionAr: ch.descriptionAr,
      instructions,
      instructionsAr,
      rewardXp,
      rewardTokens,
      proofType,
    };
    if (ch.badgeReward) {
      v.challenge.badgeReward = ch.badgeReward;
    }
  }

  return v;
}

// 1. Update scratch/generate_50_videos.cjs
const genFilePath = path.resolve(__dirname, 'generate_50_videos.cjs');
let { NEW_VIDEOS } = require(genFilePath);
NEW_VIDEOS = NEW_VIDEOS.map(fixVideo);

// Check if any visualType is still invalid
let invalidVisuals = [];
NEW_VIDEOS.forEach(v => {
  v.animationConfig?.scenes?.forEach(s => {
    if (s.visualType && !allowedVisualTypes.includes(s.visualType)) {
      invalidVisuals.push({ videoId: v.id, visualType: s.visualType });
    }
  });
});
console.log('Invalid visuals remaining in NEW_VIDEOS:', invalidVisuals.length);

// 2. Now let's reconstruct src/features/education/data/videos.ts from scratch
// Read original 14 videos from git or keep lines 1 to 1302
const videosPath = path.resolve(__dirname, '../src/features/education/data/videos.ts');
const fullContent = fs.readFileSync(videosPath, 'utf8');

// Find the marker where vid_inflation_icecream starts, or keep lines 1-1302
const splitMarker = '  {\n    "id": "vid_inflation_icecream"';
const altSplitMarker = '  {\n    id: "vid_inflation_icecream"';
const altSplitMarker2 = '  {\n    id: \'vid_inflation_icecream\'';

let baseContent;
if (fullContent.includes(splitMarker)) {
  baseContent = fullContent.split(splitMarker)[0];
} else if (fullContent.includes(altSplitMarker)) {
  baseContent = fullContent.split(altSplitMarker)[0];
} else if (fullContent.includes(altSplitMarker2)) {
  baseContent = fullContent.split(altSplitMarker2)[0];
} else {
  // Otherwise find index of 14th video's end
  const idx = fullContent.indexOf('  {\n    "id": "vid_inflation_icecream"');
  baseContent = fullContent.slice(0, 64275); // approx size before append
}

// Make sure baseContent ends cleanly before `];`
if (baseContent.trimEnd().endsWith('];')) {
  baseContent = baseContent.trimEnd().slice(0, -2);
}

function formatVideoToTs(v) {
  return '  ' + JSON.stringify(v, null, 2).split('\n').join('\n  ') + ',\n';
}

const formattedNewVideos = NEW_VIDEOS.map(formatVideoToTs).join('');
const finalFileContent = baseContent.trimEnd() + '\n' + formattedNewVideos + '];\n';

fs.writeFileSync(videosPath, finalFileContent, 'utf8');
console.log('Successfully re-wrote videos.ts with valid TypeScript types!');
