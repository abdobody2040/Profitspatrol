const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Real Estate Section
  "Real Estate Tycoon": "تايكون العقارات",
  "Build your property empire and earn passive income.": "ابنِ إمبراطورية عقاراتك واكسب دخلاً سلبياً.",
  "Market": "السوق",
  "Daily Income": "الدخل اليومي",
  "Pending": "قيد الانتظار",
  "Collect All": "جمع الكل",
  "Available in v2.0": "متوفر في الإصدار 2.0",
  "Upgrade": "ترقية",
  "Buy Now": "اشترِ الآن",
  "Sell": "بيع",
  "Sell for ${{amount}}?": "بيع مقابل {{amount}} دولار؟",
  "You'll get back 60% of the purchase price.": "ستسترد 60% من سعر الشراء.",
  "Renovate": "تجديد",
  "Renovate (${{cost}})": "تجديد ({{cost}} دولار)",
  "Fully Renovated": "مجدد بالكامل",
  "Get Insurance": "احصل على تأمين",
  "Insured": "مؤمن عليه",
  "Cancel Insurance": "إلغاء التأمين",
  "Insurance (${{cost}})": "التأمين ({{cost}} دولار)",
  "Level {{level}} Required": "مطلوب مستوى {{level}}",
  "Sneak Peek": "نظرة خاطفة",
  "Fully Upgraded!": "تمت الترقية بالكامل!",
  "after upgrade": "بعد الترقية",
  "Tenant Bonus!": "مكافأة المستأجر!",
  "Tenant Issue": "مشكلة مع المستأجر",
  "Collected all pending rent!": "تم جمع كل الإيجارات المعلقة!",
  "Total Income/day": "إجمالي الدخل اليومي",
  "Portfolio Value": "قيمة المحفظة",
  "Daily Challenges": "تحديات يومية",
  "Collect rent 3 times today": "اجمع الإيجار 3 مرات اليوم",
  "Buy a new property": "اشترِ عقاراً جديداً",
  "Max-upgrade any property": "قم بترقية أي عقار للمستوى الأقصى",
  "+{{xp}} XP": "+{{xp}} من نقاط الخبرة",
  "Top Landlords": "كبار الملاك",
  "City": "المدينة",
  "Metro": "المترو",
  "Global": "العالمي",
  "Hot Market": "سوق ساخن",
  "Slow Market": "سوق هادئ",
  
  // Property Names & Descriptions
  "Pop-Up Stand": "كشك متنقل",
  "A simple table to sell lemonade. Small but mighty.": "طاولة بسيطة لبيع الليمون. صغيرة ولكنها قوية.",
  "Suburban Garage": "مرآب في الضواحي",
  "The birthplace of many startups.": "مسقط رأس العديد من الشركات الناشئة.",
  "Taco Truck": "شاحنة تاكو",
  "Mobile food empire. Everyone loves tacos.": "إمبراطورية طعام متنقلة. الجميع يحب التاكو.",
  "Retro Arcade": "صالة ألعاب قديمة",
  "Quarters turn into dollars here.": "هنا تتحول العملات المعدنية إلى دولارات.",
  "Startup Loft": "شقة للشركات الناشئة",
  "Open floor plan with bean bags. Very trendy.": "تصميم مفتوح مع مقاعد 'بين باج'. عصري جداً.",
  "Widget Factory": "مصنع أدوات",
  "Mass production at its finest.": "الإنتاج الضخم في أفضل حالاته.",
  "Beach House": "بيت شاطئي",
  "Sun, surf, and passive income. The Malibu dream.": "شمس، ركوب أمواج، ودخل سلبي. حلم ماليبو.",
  "Shopping Mall": "مركز تسوق",
  "Every brand under one roof. Retail royalty.": "كل العلامات التجارية تحت سقف واحد. ملوك التجزئة.",
  "Tech Campus": "مجمع تقني",
  "Where unicorns are born. Silicon Valley vibes.": "حيث تولد الشركات المليارية. أجواء وادي السليكون.",
  
  "Residential": "سكني",
  "Commercial": "تجاري",
  "Industrial": "صناعي",

  // Pricing Page
  "Choose Your Plan": "اختر خطتك",
  "Invest in your future today": "استثمر في مستقبلك اليوم",
  "Secure payment via Stripe": "دفع آمن عبر Stripe",
  "Get Funded": "احصل على تمويل",
  "Start Family": "ابدأ للعائلة",
  "Annual plan only": "الخطة السنوية فقط",
  "Upgrade to Pro": "الترقية لنسخة برو",
  "Get School License": "احصل على ترخيص مدرسي",
  "Select Plan": "اختر الخطة",
  "For Educators": "للمعلمين",
  "Empowered Educators": "معلمون متمكنون",
  "Up to 100 Students": "حتى 100 طالب",
  "Up to 500 Students": "حتى 500 طالب",
  "Unlimited Students": "طلاب غير محدودين",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
