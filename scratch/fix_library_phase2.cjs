const fs = require('fs');
const path = require('path');
const AR_PATH = path.join(__dirname, '../src/locales/ar.ts');
let src = fs.readFileSync(AR_PATH, 'utf8');

// Remove the bad injection first
const badStart = src.indexOf('\n    exclusive_books: {');
const badEnd = src.indexOf('\n  },\n} as const;');
if (badStart !== -1 && badStart < badEnd) {
  src = src.slice(0, badStart) + '\n  },\n} as const;';
}

// Use string arrays (no trailing commas inside) to avoid template literal issues
const lines = [
'',
'    exclusive_books: {',
'      the_little_engine_that_could: {',
"        title: 'القاطرة الصغيرة التي استطاعت',",
"        summary: 'قصة كلاسيكية عن قاطرة صغيرة تتغلب على جبل شاهق بالإيمان بالنفس وترديد أعتقد أنني أستطيع.',",
'        keyLessons: [',
"          'الإيمان بالنفس هو أول خطوة نحو النجاح',",
"          'المثابرة تؤتي ثمارها عند مواجهة المهام الصعبة',",
"          'مساعدة الآخرين في أوقات الحاجة عمل نبيل'",
'        ],',
'      },',
'      kidpreneurs: {',
"        title: 'أطفال رواد أعمال: شباب بأفكار كبيرة!',",
"        summary: 'دليل ممتع وسهل القراءة يعلم الأطفال المبادئ الأساسية لبدء وإدارة أعمالهم الخاصة.',",
'        keyLessons: [',
"          'لا تحتاج إلى الانتظار حتى تكبر لبدء عمل تجاري',",
"          'العمل التجاري يحل مشكلة للآخرين',",
"          'توفير المال واستثماره لا يقل أهمية عن كسبه'",
'        ],',
'      },',
'      rich_dad_poor_dad_for_teens: {',
"        title: 'أبي الغني أبي الفقير للمراهقين',",
"        summary: 'أسرار المال التي لا تتعلمها في المدرسة، مُكيَّفة للمراهقين.',",
'        keyLessons: [',
"          'الأغنياء لا يعملون من أجل المال، بل المال يعمل من أجلهم',",
"          'افهم الفرق بين الأصول والخصوم',",
"          'الثقافة المالية ضرورية لبناء الثروة'",
'        ],',
'      },',
'      the_boy_who_harnessed_the_wind: {',
"        title: 'الصبي الذي روّض الريح',",
"        summary: 'قصة حقيقية لصبي في ملاوي بنى طاحونة هوائية من خردة معدنية لإضاءة قريته.',",
'        keyLessons: [',
"          'الابتكار يمكن أن يأتي من أي مكان',",
"          'التعليم والقراءة أداتان قويتان للتغيير',",
"          'لا تستسلم أبدًا لأفكارك حتى لو ضحك الآخرون'",
'        ],',
'      },',
'      charlie_chocolate_factory: {',
"        title: 'تشارلي ومصنع الشوكولاتة',",
"        summary: 'صبي فقير يفوز بتذكرة ذهبية لزيارة مصنع الشوكولاتة السحري لويلي ونكا.',",
'        keyLessons: [',
"          'الأخلاق الحسنة والتواضع يُكافآن',",
"          'الجشع وسوء الأخلاق يؤديان إلى المشاكل',",
"          'الخيال هو مفتاح خلق أشياء رائعة'",
'        ],',
'      },',
'      the_alchemist_pp: {',
"        title: 'الخيميائي',",
"        summary: 'رحلة سحرية لراعي غنم يكتشف أن الكنز الذي يبحث عنه أقرب مما يتخيل.',",
'        keyLessons: [',
"          'كل إنسان لديه أسطورة شخصية - غرض وُلد لتحقيقه',",
"          'الكون يساعد من يسعى بكل قلبه نحو حلمه',",
"          'رحلة النمو هي الكنز الحقيقي'",
'        ],',
'      },',
'    },',
];

const newBlock = lines.join('\n');
const marker = '\n  },\n} as const;';
const idx = src.lastIndexOf(marker);
if (idx === -1) { console.error('Marker not found'); process.exit(1); }
src = src.slice(0, idx) + newBlock + marker + '\n';
fs.writeFileSync(AR_PATH, src, 'utf8');

// Also add library keys to existing library section
src = fs.readFileSync(AR_PATH, 'utf8');
const libRe = /(track_progress:\s*'[^']*',\s*\},\s*\},\s*)(library_books:)/;
if (libRe.test(src)) {
  src = src.replace(libRe, (m, before, after) => {
    return before + "      exclusive_banner_desc: 'كتب مختارة بعناية متاحة داخل بروفيتس باترول فقط — من القصص الكلاسيكية إلى أدلة رواد الأعمال الشباب!',\n      school_license_unlocked: 'تم الفتح عبر رخصة المدرسة',\n    },\n    " + after;
  });
  fs.writeFileSync(AR_PATH, src, 'utf8');
} else {
  console.error('⚠️  library section pattern not found, skipping');
}

// Syntax check
const js = src.replace('export const ar', 'const ar').replace('} as const;', '}');
catch(e) { console.error('❌ SYNTAX ERROR:', e.message); }
