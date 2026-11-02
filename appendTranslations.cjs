const fs = require('fs');
const matched = require('./user_books_ids.json');
const arFile = 'src/locales/ar/library_books.ts';
let arContent = fs.readFileSync(arFile, 'utf-8');

let appendText = '';
const added = new Set();

matched.forEach(({id, title}) => {
  const key = id.replace(/-/g, '_');
  if (arContent.includes(key + ':') || added.has(key)) return;
  
  added.add(key);
  
  const safeTitle = title.replace(/'/g, "\\'");
  
  appendText += `  '${key}': {
    title_child: '${safeTitle}',
    title_teen: '${safeTitle}',
    summary_child: 'اقرأ ملخص كتاب ${safeTitle} وتعلم أهم الدروس والمهارات.',
    summary_teen: 'اقرأ ملخص كتاب ${safeTitle} وتعلم أهم الدروس والمهارات.',
    fullContent_child: '## 🚀 الفكرة الرئيسية\\nيحتوي هذا الكتاب على دروس قيمة ومهمة لنموك الشخصي والمهني.\\n\\n## 💡 التعلم المستمر\\nاستمر في القراءة والتعلم لتطوير مهاراتك بشكل دائم.\\n\\n## 🤝 التطبيق العملي\\nحاول تطبيق ما تعلمته من هذا الكتاب في حياتك اليومية.',
    fullContent_teen: '## 🚀 الفكرة الرئيسية\\nيحتوي هذا الكتاب على دروس قيمة ومهمة لنموك الشخصي والمهني.\\n\\n## 💡 التعلم المستمر\\nاستمر في القراءة والتعلم لتطوير مهاراتك بشكل دائم.\\n\\n## 🤝 التطبيق العملي\\nحاول تطبيق ما تعلمته من هذا الكتاب في حياتك اليومية.',
    lesson_0_child: 'تعلم باستمرار ولا تتوقف عن القراءة.',
    lesson_0_teen: 'تعلم باستمرار ولا تتوقف عن القراءة.',
    lesson_1_child: 'طبق ما تتعلمه في حياتك.',
    lesson_1_teen: 'طبق ما تتعلمه في حياتك.',
    lesson_2_child: 'شارك المعرفة مع الآخرين.',
    lesson_2_teen: 'شارك المعرفة مع الآخرين.',
  },\n`;
});

if (appendText.length > 0) {
  arContent = arContent.replace(/\s*};\s*$/, '\n' + appendText + '};\n');
  fs.writeFileSync(arFile, arContent);
} else {
  console.log('No new translations to append.');
}
