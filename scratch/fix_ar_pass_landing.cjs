const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Landing Page
  "Don't just play games.": "لا تلعب الألعاب فحسب.",
  "Build an Empire.": "ابنِ إمبراطورية.",
  "Profits Patrol turns screen time into real-world business skills. Master finance, AI, and leadership through addictive mini-games, an RPG HQ Builder, and Gig Central.": "بروفيتس باترول يحول وقت الشاشة إلى مهارات تجارية واقعية. أتقن المالية والذكاء الاصطناعي والقيادة من خلال ألعاب صغيرة ممتعة، وبناء مقر بنظام RPG، ومركز الأعمال الحرة.",
  "Play Now - It's Free!": "العب الآن - إنه مجاني!",
  "How Profits Patrol Works": "كيف يعمل بروفيتس باترول",
  "We use a simple loop to make learning sticky and addictive.": "نحن نستخدم حلقة بسيطة لجعل التعلم ممتعاً ومفيداً.",
  "Real Business Simulations": "محاكاة أعمال حقيقية",
  "Kids don't just read about business; they run them. From Lemonade Stands to Real Estate and Stock Market simulators, our engine teaches supply & demand, investing, and customer service in real-time.": "الأطفال لا يقرؤون فقط عن الأعمال، بل يديرونها. من أكشاك الليمون إلى العقارات ومحاكاة سوق الأسهم، يعلم محركنا العرض والطلب والاستثمار وخدمة العملاء في الوقت الفعلي.",
  "Stock Market & Real Estate": "سوق الأسهم والعقارات",
  "AI-Powered Business Plans": "خطط عمل مدعومة بالذكاء الاصطناعي",
  "School Tournaments & Co-op Pitching": "مسابقات مدرسية وعروض تعاونية",
  "Ready to launch your startup?": "هل أنت جاهز لإطلاق شركتك الناشئة؟",
  "Join for free today. No credit card required.": "انضم مجاناً اليوم. لا حاجة لبطاقة ائتمان.",
  "Get Started Now": "ابدأ الآن",
  "View Plans": "عرض الخطط",
  "The #1 Entrepreneur Academy for Kids": "أكاديمية ريادة الأعمال رقم 1 للأطفال",
  "Join 10,000+ Future CEOs": "انضم إلى أكثر من 10,000 مدير تنفيذي مستقبلي",
  "Loved by Parents & Teachers Everywhere": "محبوب من قبل الوالدين والمعلمين في كل مكان",
  "Made with ❤️ for future leaders.": "صنع بـ ❤️ لقادة المستقبل.",
  
  // Reviews
  "My 8-year-old asked me about 'compound interest' at dinner. I was floored. This app is pure gold.": "سألني طفلي البالغ من العمر 8 سنوات عن 'الفائدة المركبة' أثناء العشاء. لقد ذهلت! هذا التطبيق كنز حقيقي.",
  "Finally, a way to teach financial literacy that isn't boring worksheets. The kids beg to play Profits Patrol.": "أخيراً، طريقة لتعليم الثقافة المالية بعيداً عن أوراق العمل المملة. الأطفال يطلبون اللعب في بروفيتس باترول.",
  "Safe, educational, and actually fun. It's the only screen time I don't feel guilty about.": "آمن، تعليمي، وممتع حقاً. إنه وقت الشاشة الوحيد الذي لا أشعر بالذنب تجاهه.",
  
  // Steps
  "Play Simulators": "لعب المحاكاة",
  "Run businesses, hit Gig Central for quick jobs, and invest in the Stock Market.": "أدِر الشركات، وتوجه لمركز الأعمال الحرة للوظائف السريعة، واستثمر في سوق الأسهم.",
  "Learn Concepts": "تعلم المفاهيم",
  "Bite-sized lessons and our CEO Library explain the 'Why' behind the money.": "دروس مبسطة ومكتبة المدير التنفيذي توضح 'السبب' وراء المال.",
  "Earn & Upgrade": "اكسب ورَقِّ",
  "Get XP, unlock cool avatars, and build your dream headquarters.": "احصل على XP، وافتح شخصيات رائعة، وابنِ مقر أحلامك.",
  
  "You Won!": "لقد فزت!",
  "New Startup": "شركة ناشئة جديدة",
  "Explore the Arcade": "استكشف الألعاب",
  "Tycoon Mode": "وضع التايكون",
  "Pizza Rush": "اندفاع البيتزا",
  "Brand Builder": "بناء العلامة التجارية",
  "Stock Market": "سوق الأسهم",
  "The Pitch Simulator": "محاكي عرض الأفكار",
  "Face the Investors in The Tank": "واجه المستثمرين في ذا تانك",
  "Pitch Your Idea": "اعرض فكرتك",
  "Debate & Ethics": "النقاش والأخلاقيات",
  "Master Ethics & Hustle": "أتقن الأخلاقيات والعمل الجاد",
  "Debate real-world business dilemmas in the Dojo against AI opponents, or take on quick mini-jobs in Gig Central to build your initial capital.": "ناقش المعضلات التجارية الواقعية في الدوجو ضد خصوم الذكاء الاصطناعي، أو قم بمهام سريعة في مركز الأعمال الحرة لبناء رأس مالك الأولي.",
  "Enter the Dojo": "ادخل الدوجو",
  "The Academy": "الأكاديمية",
  "An Expanding Business Library": "مكتبة أعمال متنامية",
  "Read hundreds of interactive books, watch engaging strategy videos, and complete hands-on curriculum tasks.": "اقرأ مئات الكتب التفاعلية، وشاهد فيديوهات استراتيجية جذابة، وأكمل مهام المنهج العملية.",
  "Browse Library": "تصفح المكتبة",
  "For Families & Schools": "للعائلات والمدارس",
  "Track Growth & Manage Classrooms": "تتبع النمو وإدارة الفصول",
  "Parents can track net worth and skills, while teachers can manage classrooms, assign tasks, and grade projects with AI assistance.": "يمكن للوالدين تتبع الثروة والمهارات، بينما يمكن للمعلمين إدارة الفصول، وتعيين المهام، وتقييم المشاريع بمساعدة الذكاء الاصطناعي.",
  "View Dashboard": "عرض لوحة التحكم",
  "Official Offer": "عرض رسمي",
  "Ethics Debates": "نقاشات الأخلاقيات",
  "Argue real-world dilemmas against an AI Judge.": "ناقش معضلات واقعية أمام حكم ذكاء اصطناعي.",
  "Wash cars & walk dogs in rapid mini-games.": "اغسل السيارات وتمشَّ مع الكلاب في ألعاب مصغرة سريعة.",

  // Curriculum Page
  "The Academy Curriculum": "منهج الأكاديمية",
  "A complete MBA for kids. Master 10 modules—from Money Basics to AI & Leadership—through interactive lessons and real-world simulations.": "ماجستير إدارة أعمال كامل للأطفال. أتقن 10 وحدات - من أساسيات المال إلى الذكاء الاصطناعي والقيادة - من خلال دروس تفاعلية ومحاكاة واقعية.",
  "Module": "وحدة",
  "Mins": "دقائق",
  "Lesson": "درس",
  "More": "المزيد",
  "Level": "مستوى",
  "Money Basics": "أساسيات المال",
  "Learn the history of money, how to earn it, save it, and spend it wisely.": "تعلم تاريخ المال، وكيفية كسبه، وادخاره، وإنفاقه بحكمة.",
  "Entrepreneurship": "ريادة الأعمال",
  "Discover how to start a business, calculate profit, and scale your ideas.": "اكتشف كيف تبدأ مشروعاً، وتحسب الأرباح، وتوسع أفكارك.",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
