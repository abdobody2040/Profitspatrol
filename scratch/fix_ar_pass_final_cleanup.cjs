const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // BizPulse News
  "Today's business news — read & earn XP!": "أخبار الأعمال اليوم - اقرأ واكسب XP!",
  "I Read It! +{{xp}} XP": "لقد قرأتها! +{{xp}} XP",
  "Read today ✅": "تمت القراءة اليوم ✅",
  "News Expert! 🎓": "خبير الأخبار! 🎓",
  "You read all 5 articles today. Come back tomorrow for new stories!": "لقد قرأت جميع المقالات الخمس اليوم. عُد غداً لقصص جديدة!",
  "{{done}}/{{total}} articles read today": "تمت قراءة {{done}} من أصل {{total}} مقالات اليوم",
  
  // Corporations
  "Corporations": "الشركات الكبرى",
  "Join or create a business corp with friends!": "انضم إلى شركة أو أنشئ واحدة مع أصدقائك!",
  "Your Corporation": "شركتك",
  "Found a New Corporation": "تأسيس شركة جديدة",
  "Be the first — start your own corp!": "كن الأول - ابدأ شركتك الخاصة!",
  "Create Corporation": "إنشاء شركة",
  "Corporation Name": "اسم الشركة",
  "e.g. The Profit Squad": "مثلاً: فرقة الأرباح",
  "Motto (optional)": "الشعار (اختياري)",
  "e.g. Work hard, win bigger!": "مثلاً: اعمل بجد، اربح أكثر!",
  "Launch Corporation": "إطلاق الشركة",
  "Join This Corp": "انضم لهذه الشركة",
  "Leave Corporation": "مغادرة الشركة",
  "Weekly Corp Mission": "مهمة الشركة الأسبوعية",
  "Search corporations...": "البحث عن شركات...",
  "No corporations yet — be the first!": "لا توجد شركات بعد - كن الأول!",
  
  // Stock & Avatar & Season
  "PatrolMarket": "سوق بروفيتس",
  "Buy & sell stocks. Prices update every minute!": "بيع وشراء الأسهم. الأسعار تُحدث كل دقيقة!",
  "No stocks yet — buy your first share!": "لا توجد أسهم بعد - اشترِ سهمك الأول!",
  "My Avatar": "شخصيتي",
  "Customize your look with BizCoins!": "خصص مظهرك باستخدام عملات BizCoins!",
  "Seasonal Events": "أحداث موسمية",
  "Limited-time challenges & exclusive rewards!": "تحديات لفترة محدودة ومكافآت حصرية!",
  
  // Reports & Real Estate
  "Parent Report": "تقرير الوالدين",
  "Send your child's monthly progress to their parent": "أرسل تقرير التقدم الشهري لطفلك إلى الوالدين",
  "Send Monthly Report 📧": "إرسال التقرير الشهري 📧",
  "Build your property empire & collect passive income!": "ابنِ إمبراطورية عقاراتك واكسب دخلاً سلبياً!",
  "Weekly CEO Challenge": "تحدي المدير التنفيذي الأسبوعي",
  "Complete this week's goal to claim exclusive rewards!": "أكمل هدف هذا الأسبوع للمطالبة بمكافآت حصرية!",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
