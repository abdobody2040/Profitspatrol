const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/missing_books_clean.json', 'utf8'));
const exclusiveBooks = data.exclusive;

const translations = {
  "Zero to One (Teen Edition)": "من الصفر إلى الواحد (نسخة المراهقين)",
  "How to Turn $100 into $1,000,000": "كيف تحول 100 دولار إلى مليون دولار",
  "Better Than a Lemonade Stand": "أفضل من كشك ليموناضة",
  "Do Hard Things": "افعل الأشياء الصعبة",
  "I Am Malala (Young Readers Edition)": "أنا ملالا (نسخة القراء الصغار)",
  "Hidden Figures Young Readers": "شخصيات مخفية (القراء الصغار)",
  "Max Einstein: The Genius Experiment": "ماكس أينشتاين: تجربة العبقرية",
  "George": "جورج",
  "A Long Walk to Water": "طريق طويل للماء",
  "The Crossover": "التقاطع",
  "Teen Entrepreneur Toolbox": "صندوق أدوات المراهق رائد الأعمال",
  "Kid CEO": "الطفل المدير التنفيذي",
  "The Young Entrepreneur": "رائد الأعمال الشاب",
  "Rock, Brock and the Savings Shock": "روك وبروك وصدمة التوفير",
  "The Total Money Makeover (Teen Edition)": "التحول المالي الشامل (نسخة المراهقين)",
  "Broke Millennial": "جيل الألفية المفلس",
  "Make Your Kid a Money Genius": "اجعل طفلك عبقرياً في المال",
  "The Richest Kid in the World": "أغنى طفل في العالم",
  "Young Money": "المال الشاب",
  "Money Can Buy Happiness": "المال يمكن أن يشتري السعادة",
  "Grit (Young Reader": "العزيمة (للقراء الصغار)",
  "The Power of Yet": "قوة كلمة بعد",
  "You Are a Badass (Teen Edition)": "أنت رائع (نسخة المراهقين)",
  "The 5 AM Club (Teen Edition)": "نادي الخامسة صباحاً (نسخة المراهقين)",
  "The Energy Bus for Kids": "حافلة الطاقة للأطفال",
  "Growth Mindset Coach": "مدرب عقلية النمو",
  "Can": "يستطيع (Can)",
  "The Lion, the Witch and the Wardrobe": "الأسد والساحرة وخزانة الملابس",
  "Matilda": "ماتيلدا",
  "James and the Giant Peach": "جيمس والخوخة العملاقة",
  "The Hobbit": "الهوبيت",
  "Charlotte": "شبكة شارلوت",
  "Alice": "أليس في بلاد العجائب",
  "The Little Prince": "الأمير الصغير",
  "Treasure Island": "جزيرة الكنز",
  "Harry Potter and the Sorcerer": "هاري بوتر وحجر الفيلسوف",
  "The Giver": "المعطي",
  "Peter Pan": "بيتر بان",
  "A Wrinkle in Time": "تجعد في الزمن",
  "The Wonderful Wizard of Oz": "ساحر أوز العجيب",
  "The Richest Man in Babylon (For Teens)": "أغنى رجل في بابل (للمراهقين)",
  "Rich Kid, Smart Kid": "طفل غني، طفل ذكي",
  "I Will Teach You to Be Rich (Teen Edition)": "سأعلمك كيف تكون غنياً (نسخة المراهقين)",
  "The Motley Fool Investment Guide for Teens": "دليل أحمق موتلي للاستثمار للمراهقين",
  "Make Your Bed": "رتب سريرك",
  "Extreme Ownership": "الملكية القصوى",
  "The 7 Habits of Highly Effective Teens": "العادات السبع للمراهقين الأكثر فعالية",
  "The Hunger Games": "مباريات الجوع",
  "Dune": "كثيب",
  "Fahrenheit 451": "فهرنهايت 451",
  "1984": "1984",
  "Ender": "إندر",
  "Brave New World": "عالم جديد شجاع",
  "The Martian": "المريخي",
  "Ready Player One": "ريدي بلاير وان",
  "Snow Crash": "تحطم الثلج",
  "The Time Machine": "آلة الزمن",
  "Foundation": "المؤسسة",
  "I, Robot": "أنا، روبوت",
  "The Hitchhiker": "دليل المسافر للمجرة",
  "Animal Farm": "مزرعة الحيوان",
  "Barbarians at the Gate": "البرابرة على الأبواب",
  "Bad Blood": "دم فاسد",
  "Shoe Dog": "بائع الأحذية",
  "The Everything Store": "متجر كل شيء",
  "Too Big to Fail": "أكبر من أن يفشل",
  "The Big Short": "العجز الكبير",
  "Steve Jobs": "ستيف جوبز",
  "Flash Boys": "فتيان الفلاش",
  "Liar": "لعبة الكاذب",
  "DisneyWar": "حرب ديزني",
  "Hatching Twitter": "تفريخ تويتر",
  "Super Pumped": "مشحون جداً (قصة أوبر)",
  "Red Notice": "إشعار أحمر",
  "Billion Dollar Whale": "حوت بمليار دولار",
  "How to Win Friends and Influence People": "كيف تكسب الأصدقاء وتؤثر في الناس",
  "Start with Why": "ابدأ مع لماذا",
  "Good to Great": "من الجيد إلى العظيم",
  "The Art of War": "فن الحرب",
  "Thinking, Fast and Slow": "التفكير السريع والبطيء",
  "The Lean Startup": "الشركة الناشئة المرنة"
};

const defaultSummary = "كتاب رائع وملهم يعلم مهارات قيمة للحياة والعمل والنجاح المستقبلي.";

let codeToAppend = "";

for (const book of exclusiveBooks) {
  const key = book.id.replace(/-/g, '_');
  const title = translations[book.title] || book.title;
  
  // Using JSON.stringify ensures perfect escaping and double quotes
  // which works perfectly in TypeScript object literals!
  const fullContentStr = JSON.stringify("## 📖 نظرة عامة\nهذا الكتاب يقدم أفكاراً عميقة ومفيدة جداً.\n\n## 💡 أهم الدروس\n1. العمل الجاد والمثابرة هما مفتاح النجاح.\n2. التعلم المستمر يفتح أبواباً جديدة.\n3. بناء علاقات إيجابية يعزز فرصك في الحياة.");
  const titleStr = JSON.stringify(title);
  const summaryStr = JSON.stringify(defaultSummary);

  codeToAppend += `
  ${key}: {
    title_child: ${titleStr},
    title: ${titleStr},
    title_teen: ${titleStr},
    summary_child: ${summaryStr},
    summary: ${summaryStr},
    summary_teen: ${summaryStr},
    keyLessons_child: ['المثابرة', 'التعلم المستمر', 'الابتكار'],
    keyLessons_teen: ['المثابرة', 'التعلم المستمر', 'الابتكار'],
    fullContent_child: ${fullContentStr},
    fullContent_teen: ${fullContentStr},
    fullContent: ${fullContentStr},
  },`;
}

const targetFile = 'src/locales/ar/exclusive_books.ts';
let content = fs.readFileSync(targetFile, 'utf8');

// revert back to the pristine state
const idx = content.indexOf('zero_to_one_teens: {');
if (idx !== -1) {
  content = content.substring(0, idx);
} else {
  // if not found, just chop off the last closing brace
  const lastBraceIndex = content.lastIndexOf('}');
  content = content.substring(0, lastBraceIndex);
}

content = content + codeToAppend + '\n};\n';
fs.writeFileSync(targetFile, content, 'utf8');
