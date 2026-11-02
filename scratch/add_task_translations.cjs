const fs = require('fs');
const path = require('path');

// Add generic task type translation keys to both en.ts and ar.ts
const EN_PATH = path.join(__dirname, '../src/locales/en.ts');
const AR_PATH = path.join(__dirname, '../src/locales/ar.ts');

const enKeys = `      // Generic task type labels (fallback for BookTaskCard)
      task_quiz_title: 'Test Your Knowledge',
      task_quiz_desc: 'Answer questions to check your understanding.',
      task_reflection_title: 'Personal Reflection',
      task_reflectiontitle: 'Personal Reflection',
      task_reflection_desc: "Connect the book's lessons to your own life.",
      task_actionchallenge_title: 'Apply It Daily',
      task_action_challenge_title: 'Apply It Daily',
      task_actionchallenge_desc: 'Take action on what you learned.',
      task_action_challenge_desc: 'Take action on what you learned.',
      task_shareteach_title: 'Teach to Learn',
      task_share_teach_title: 'Teach to Learn',
      task_shareteach_desc: 'Share the wisdom with someone else.',
      task_share_teach_desc: 'Share the wisdom with someone else.',
      task_application_title: 'Real World Application',
      task_application_desc: 'Use the strategies in real life.',`;

const arKeys = `      // Generic task type labels (fallback for BookTaskCard)
      task_quiz_title: 'اختبر معرفتك',
      task_quiz_desc: 'أجب على أسئلة للتحقق من فهمك.',
      task_reflection_title: 'تأمل شخصي',
      task_reflectiontitle: 'تأمل شخصي',
      task_reflection_desc: 'اربط دروس الكتاب بحياتك الخاصة.',
      task_actionchallenge_title: 'طبّقه يومياً',
      task_action_challenge_title: 'طبّقه يومياً',
      task_actionchallenge_desc: 'تصرف بناءً على ما تعلمته.',
      task_action_challenge_desc: 'تصرف بناءً على ما تعلمته.',
      task_shareteach_title: 'علّم لتتعلم',
      task_share_teach_title: 'علّم لتتعلم',
      task_shareteach_desc: 'شارك الحكمة مع شخص آخر.',
      task_share_teach_desc: 'شارك الحكمة مع شخص آخر.',
      task_application_title: 'تطبيق في العالم الحقيقي',
      task_application_desc: 'استخدم الاستراتيجيات في الحياة الواقعية.',`;

// Inject into en.ts - find the tasks section closing and insert before it
let en = fs.readFileSync(EN_PATH, 'utf8');
const enMarker = "      track_progress: 'Track Your Progress:',\n      },\n      exclusive_banner_desc:";
if (en.includes(enMarker)) {
  en = en.replace(enMarker,
    "      track_progress: 'Track Your Progress:',\n      },\n" + enKeys + '\n' + "      exclusive_banner_desc:");
  fs.writeFileSync(EN_PATH, en, 'utf8');
} else {
  // Find library tasks section end
  const alt = "      exclusive_banner_desc: 'Hand-picked";
  if (en.includes(alt)) {
    en = en.replace(alt, enKeys + '\n      exclusive_banner_desc: \'Hand-picked');
    fs.writeFileSync(EN_PATH, en, 'utf8');
  } else {
    console.error('⚠️  en.ts: marker not found, skipping');
  }
}

// Inject into ar.ts
let ar = fs.readFileSync(AR_PATH, 'utf8');
const arMarker = "      exclusive_banner_desc: '\u0643\u062a\u0628 \u0645\u062e\u062a\u0627\u0631\u0629";
if (ar.includes(arMarker)) {
  ar = ar.replace(arMarker, arKeys + '\n      exclusive_banner_desc: \'\u0643\u062a\u0628 \u0645\u062e\u062a\u0627\u0631\u0629');
  fs.writeFileSync(AR_PATH, ar, 'utf8');
} else {
  console.error('⚠️  ar.ts: marker not found');
}

// Syntax check ar.ts
const arSrc = fs.readFileSync(AR_PATH, 'utf8');
const js = arSrc.replace('export const ar', 'const ar').replace('} as const;', '}');
catch(e) { console.error('❌ SYNTAX ERROR:', e.message); }
