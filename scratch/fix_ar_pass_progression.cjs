const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Skills Section
  "MBA Skill Tree": "شجرة مهارات الإدارة (MBA)",
  "Unlock permanent boosts for your business empire.": "افتح تحسينات دائمة لإمبراطوريتك التجارية.",
  "ACTIVE": "نشط",
  "Unlock": "فتح",
  "Need": "تحتاج إلى",
  "Locked": "مغلق",
  "Wisdom": "الحكمة",
  "Efficiency": "الكفاءة",
  "Charisma": "الكاريزما",
  "Silver Tongue": "اللسان الفضي",
  "Customers pay 5% more.": "يدفع العملاء 5% أكثر.",
  "Negotiator": "المفاوض",
  "Supplier costs reduced by 10%.": "انخفاض تكاليف الموردين بنسبة 10%.",
  "Local Celebrity": "مشاهير المنطقة",
  "Can charge 15% more for everything.": "يمكنك زيادة الأسعار بنسبة 15% لكل شيء.",
  "Fast Hands": "الأيدي السريعة",
  "Click/Swipe actions are 10% faster.": "أفعال النقر والسحب أسرع بنسبة 10%.",
  "Multitasker": "متعدد المهام",
  "Game timers run 15% slower.": "مؤقتات اللعبة تعمل أبطأ بنسبة 15%.",
  "Robotic Workers": "العمال الروبوتيون",
  "Operational costs reduced by 20%.": "انخفاض التكاليف التشغيلية بنسبة 20%.",
  "Fast Learner": "المتعلم السريع",
  "Earn +20% XP from lessons.": "اكسب 20% إضافية من XP من الدروس.",
  "Tycoon Mindset": "عقلية التايكون",
  "Portfolio earns 10% more income.": "تربح المحفظة الاستثمارية 10% دخلاً أكثر.",
  "Business Guru": "خبير الأعمال",
  "Earn +50% XP from everything.": "اكسب 50% إضافية من XP من كل شيء.",
  
  // Portfolio Section
  "My Portfolio": "محفظتي الاستثمارية",
  "Earn money even while you sleep!": "اكسب المال حتى وأنت نائم!",
  "Active": "نشط",
  "Hire": "توظيف",
  "Collect": "جمع",
  "Generating...": "جاري التوليد...",
  "Manager Lvl": "مستوى المدير",
  "Rate": "المعدل",
  "Earning...": "جاري الكسب...",
  "Hire a manager to automate this business and earn passive income.": "وظف مديراً لأتمتة هذا العمل وكسب دخل سلبي.",
  
  // Leaderboard Section
  "Top Entrepreneurs": "كبار رواد الأعمال",
  "Weekly Reset: 3 Days": "إعادة التعيين الأسبوعي: 3 أيام",
  "YOU": "أنت",
  
  // Stats Section
  "Streak": "سلسلة الانتصارات",
  "days": "أيام",
  "PTokens": "عملات PTokens",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
console.log('Skills and Portfolio Arabic translation pass complete.');
