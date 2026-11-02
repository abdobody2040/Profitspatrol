// scratch/combine_and_append_100.cjs
const fs = require('fs');
const path = require('path');

const { BATCH_51_60 } = require('./batch_51_60.cjs');
const { BATCH_61_70 } = require('./batch_61_70.cjs');
const { BATCH_71_80 } = require('./batch_71_80.cjs');
const { BATCH_81_90 } = require('./batch_81_90.cjs');
const { BATCH_91_100 } = require('./batch_91_100.cjs');

const NEW_50_VIDEOS = [
  ...BATCH_51_60,
  ...BATCH_61_70,
  ...BATCH_71_80,
  ...BATCH_81_90,
  ...BATCH_91_100,
];

console.log(`Total new videos collected: ${NEW_50_VIDEOS.length}`);

// Validation
const allowedVisualTypes = ['chart', 'coins', 'piggybank', 'store', 'lemonade', 'stocks', 'trophy', 'umbrella'];
const allowedCategories = ['Shorts', 'Challenge', 'OllieExplains', 'Parent', 'Mindset', 'Finance', 'Strategy', 'CaseStudy', 'Tutorial'];

let validationErrors = [];
const seenIds = new Set();

NEW_50_VIDEOS.forEach((v, idx) => {
  if (!v.id) validationErrors.push(`Video index ${idx} has no ID`);
  if (seenIds.has(v.id)) validationErrors.push(`Duplicate ID: ${v.id}`);
  seenIds.add(v.id);

  if (!v.title || !v.titleAr) validationErrors.push(`${v.id} missing title/titleAr`);
  if (!v.description || !v.descriptionAr) validationErrors.push(`${v.id} missing description/descriptionAr`);
  if (!v.keyTerm || !v.keyTermAr) validationErrors.push(`${v.id} missing keyTerm/keyTermAr`);
  if (!allowedCategories.includes(v.category)) validationErrors.push(`${v.id} invalid category: ${v.category}`);

  // Scenes
  if (!v.animationConfig || !v.animationConfig.scenes || v.animationConfig.scenes.length === 0) {
    validationErrors.push(`${v.id} missing scenes`);
  } else {
    v.animationConfig.scenes.forEach((s, sIdx) => {
      if (!s.caption || !s.captionAr) validationErrors.push(`${v.id} scene ${sIdx} missing caption/captionAr`);
      if (s.visualType && !allowedVisualTypes.includes(s.visualType)) {
        validationErrors.push(`${v.id} scene ${sIdx} invalid visualType: ${s.visualType}`);
      }
    });
  }

  // Quiz
  if (!v.quiz) {
    validationErrors.push(`${v.id} missing quiz`);
  } else {
    if (!v.quiz.question || !v.quiz.questionAr) validationErrors.push(`${v.id} quiz missing question/questionAr`);
    if (!v.quiz.options || v.quiz.options.length !== 4) validationErrors.push(`${v.id} quiz options != 4`);
    if (!v.quiz.optionsAr || v.quiz.optionsAr.length !== 4) validationErrors.push(`${v.id} quiz optionsAr != 4`);
    if (!v.quiz.explanation || !v.quiz.explanationAr) validationErrors.push(`${v.id} quiz missing explanation/explanationAr`);
    if (typeof v.quiz.correctIndex !== 'number') validationErrors.push(`${v.id} quiz missing correctIndex`);
  }

  // Challenge (if present)
  if (v.challenge) {
    if (!v.challenge.id) validationErrors.push(`${v.id} challenge missing id`);
    if (!v.challenge.title || !v.challenge.titleAr) validationErrors.push(`${v.id} challenge missing title/titleAr`);
    if (!v.challenge.instructions || !v.challenge.instructionsAr) validationErrors.push(`${v.id} challenge missing instructions`);
    if (!v.challenge.rewardXp || !v.challenge.rewardTokens) validationErrors.push(`${v.id} challenge missing rewards`);
    if (!v.challenge.proofType) validationErrors.push(`${v.id} challenge missing proofType`);
  }
});

if (validationErrors.length > 0) {
  console.error(`Validation failed with ${validationErrors.length} errors:`, validationErrors);
  process.exit(1);
}
console.log('All 50 new videos passed rigorous validation with 0 errors!');

// Read videos.ts
const videosPath = path.resolve(__dirname, '../src/features/education/data/videos.ts');
const originalContent = fs.readFileSync(videosPath, 'utf8');

// Find closing `];`
const lastClosingBracket = originalContent.lastIndexOf('];');
if (lastClosingBracket === -1) {
  console.error("Could not find closing '];' in videos.ts");
  process.exit(1);
}

function formatVideoToTs(v) {
  return '  ' + JSON.stringify(v, null, 2).split('\n').join('\n  ') + ',\n';
}

const formattedVideos = NEW_50_VIDEOS.map(formatVideoToTs).join('');
const updatedContent = originalContent.slice(0, lastClosingBracket).trimEnd() + '\n' + formattedVideos + '];\n';

fs.writeFileSync(videosPath, updatedContent, 'utf8');
console.log('Successfully written all 50 new videos to videos.ts!');

// Verify 100 videos in videos.ts
const finalContent = fs.readFileSync(videosPath, 'utf8');
const finalLines = finalContent.split('\n');
const allVideoIds = [];
for (let line of finalLines) {
  const m = line.match(/(?:['"]?id['"]?)\s*:\s*['"](vid_[^'"]+)['"]/);
  if (m) {
    allVideoIds.push(m[1]);
  }
}

const uniqueCount = new Set(allVideoIds).size;
console.log(`Total video ID occurrences: ${allVideoIds.length}`);
console.log(`Total UNIQUE video IDs: ${uniqueCount}`);

if (uniqueCount === 100) {
  console.log('🎉 SUCCESS! Exactly 100 unique videos in videos.ts!');
} else {
  console.error(`⚠️ Expected 100 unique videos, but found ${uniqueCount}`);
  process.exit(1);
}
