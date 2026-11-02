const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Join Class
  "Class Joined!": "تم الانضمام للفصل!",
  "Get ready to learn.": "استعد للتعلم.",
  "Join a Classroom": "انضم إلى فصل دراسي",
  "Enter the 6-digit code from your teacher.": "أدخل الرمز المكون من 6 أرقام من معلمك.",
  "Join Class": "انضم للفصل",
  "Invalid Class Code": "رمز الفصل غير صحيح",
  
  // Lemonade Tycoon
  "Learn supply & demand on a hot summer day!": "تعلم العرض والطلب في يوم صيفي حار!",
  "Day": "يوم",
  "Help": "مساعدة",
  "Efficiency Discount Active": "خصم الكفاءة نشط",
  "Charisma Boost Active": "تعزيز الكاريزما نشط",
  "Lemons": "ليمون",
  "(1 lemon makes 5 cups)": "(ليمونة واحدة تصنع 5 أكواب)",
  "Sugar": "سكر",
  "(servings)": "(حصص)",
  "(units)": "(وحدات)",
  "Set Your Price": "حدد سعرك",
  "Open for Business!": "مفتوح للعمل!",
  "Selling Lemonade...": "جاري بيع الليمون...",
  "Cups Sold": "الأكواب المباعة",
  "Profit": "الربح",
  "Skill Bonus": "مكافأة المهارة",
  "CEO Ollie Says": "المدير التنفيذي أولي يقول",
  "Check the weather forecast.": "تحقق من توقعات الطقس.",
  "Buy Lemons, Sugar, and Cups.": "اشترِ الليمون والسكر والأكواب.",
  "Set a price (Too high? No sales!)": "حدد السعر (مرتفع جداً؟ لا مبيعات!)",
  "Start the day and make profit!": "ابدأ اليوم وحقق الأرباح!",
  
  // Common
  "Lessons": "دروس",
  "DUE": "مستحق",
  "CERTIFICATE": "شهادة",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
