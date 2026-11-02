const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Debate Section
  "Choose a challenge to test your Ethics & Logic!": "اختر تحدياً لاختبار أخلاقياتك ومنطقك!",
  "Ethics": "الأخلاقيات",
  "Logic": "المنطق",
  "Verdict": "الحكم",
  "Dojo Results": "نتائج الدوجو",
  "Victory!": "انتصار!",
  "+100 BizCoins & +50 XP": "+100 من عملات BizCoins و +50 XP",
  "Argue your case!": "قدم حجتك!",
  "Thinking...": "جاري التفكير...",
  "Oops! My brain froze. Try again?": "عذراً! لقد تجمد عقلي. حاول مرة أخرى؟",
  "Type your argument...": "اكتب حجتك...",
  "Welcome to the Dojo!": "مرحباً بك في الدوجو!",
  
  // Debate Topics
  "The Cup Crisis": "أزمة الأكواب",
  "Your lemonade stand is growing! You need to buy cups. Plastic cups are very cheap ($0.05) but bad for the environment. Paper cups are expensive ($0.15) but eco-friendly.": "مشروع الليمون الخاص بك يكبر! تحتاج لشراء أكواب. الأكواب البلاستيكية رخيصة جداً (0.05 دولار) لكنها ضارة بالبيئة. الأكواب الورقية غالية (0.15 دولار) لكنها صديقة للبيئة.",
  "Which cups do you choose and why?": "أي الأكواب تختار ولماذا؟",
  
  "Fair Pay vs. Profits": "الأجر العادل مقابل الأرباح",
  "Your friend wants to help squeeze lemons. If you pay them $5/hour, you make a huge profit. If you pay them $10/hour (a fair wage), you make less money but they are happier.": "يريد صديقك مساعدتك في عصر الليمون. إذا دفعت له 5 دولارات في الساعة، فستحقق ربحاً كبيراً. إذا دفعت له 10 دولارات في الساعة (أجر عادل)، فستكسب مالاً أقل لكنه سيكون أكثر سعادة.",
  "How much do you pay your friend and why?": "كم ستدفع لصديقك ولماذا؟",
  
  "The Secret Ingredient": "المكون السري",
  "You found a 'super sweetener' that makes lemonade taste 10x better, but it might give some kids a tummy ache if they drink too much. No laws ban it yet.": "وجدت 'محلياً فائقاً' يجعل طعم الليمون أفضل بـ 10 مرات، لكنه قد يسبب آلاماً في المعدة لبعض الأطفال إذا شربوا الكثير منه. لا توجد قوانين تمنعه بعد.",
  "Do you use the secret ingredient to sell more?": "هل تستخدم المكون السري لبيع المزيد؟",
  
  "Remote vs. Office": "العمل عن بعد مقابل المكتب",
  "Your software company is growing. Working from home saves money on rent and keeps employees happy. Working in an office helps teams talk better and come up with ideas faster.": "شركتك للبرمجيات تنمو. العمل من المنزل يوفر المال في الإيجار ويجعل الموظفين سعداء. العمل في المكتب يساعد الفرق على التواصل بشكل أفضل وابتكار الأفكار بشكل أسرع.",
  "Should your company stay 100% remote or open an office?": "هل يجب أن تبقى شركتك تعمل عن بعد بنسبة 100% أم تفتح مكتباً؟",

  // Engine Section
  "Briefing": "الإحاطة",
  "Decision Required": "مطلوب اتخاذ قرار",
  "Check the briefing again!": "تحقق من الإحاطة مرة أخرى!",
  "Oops! I couldn't load the hint, but try reading the briefing again.": "عذراً! لم أتمكن من تحميل التلميح، لكن حاول قراءة الإحاطة مرة أخرى.",
  "All Levels": "جميع المستويات",
  "Project Brief": "ملخص المشروع",
  
  // Project Section
  "Launch Your Business": "أطلق مشروعك",
  "Create a concept for a business that solves a real problem.": "أنشئ مفهوماً لمشروع يحل مشكلة حقيقية.",
  "Write a short plan describing your product, customers, and price. Upload a drawing of your logo!": "اكتب خطة قصيرة تصف منتجك وعملاءك وسعرك. ارفع رسماً لشعارك!",
  "Marketing Campaign": "حملة تسويقية",
  "Design a poster or ad to sell a product.": "صمم ملصقاً أو إعلاناً لبيع منتج.",
  "Create a slogan and upload a picture of your poster.": "أنشئ شعاراً وارفع صورة لملصقك.",
  "Show Your Work": "أظهر عملك",
  "Demonstrate what you learned in this module.": "أظهر ما تعلمته في هذه الوحدة.",
  "Answer the prompt and upload any supporting images.": "أجب عن السؤال وارفع أي صور تدعم إجابتك.",
  "Start Project": "ابدأ المشروع",
  "Back to Brief": "العودة للملخص",
  "What to Expect": "ماذا تتوقع",
  "Submit Your Project": "قدم مشروعك",
  "Show Ollie what you built!": "أظهر لأولي ما بنيته!",
  "Your Response": "ردك",
  "Type your answer here...": "اكتب إجابتك هنا...",
  "Attachments": "المرفقات",
  "{{count}} files selected": "{{count}} ملفات مختارة",
  "Click to upload photos (Optional)": "انقر لرفع الصور (اختياري)",
  "Ollie is grading...": "أولي يقوم بالتقييم...",
  "Submit to Ollie": "أرسل إلى أولي",
  
  // KPI Section
  "Creativity": "الإبداع",
  "Is the idea unique?": "هل الفكرة فريدة؟",
  "Viability": "الجدوى",
  "Can it be built?": "هل يمكن بناؤه؟",
  "Impact": "الأثر",
  "Does it help people?": "هل يساعد الناس؟",
  "Clarity": "الوضوح",
  "Is the message clear?": "هل الرسالة واضحة؟",
  "Appeal": "الجذب",
  "Does it look good?": "هل يبدو جيداً؟",
  "Persuasion": "الإقناع",
  "Does it make me want to buy?": "هل يجعلني أرغب في الشراء؟",
  "Effort": "الجهد",
  "Did you try your best?": "هل بذلت قصارى جهدك؟",
  "Understanding": "الفهم",
  "Did you use key terms?": "هل استخدمت المصطلحات الرئيسية؟",
  "Presentation": "العرض",
  "Is it neat and organized?": "هل هو مرتب ومنظم؟",

  // Pricing Section
  "Choose Your Path to Success": "اختر طريقك للنجاح",
  "Whether you're starting a lemonade stand or a global empire, we have a plan for you.": "سواء كنت تبدأ ببيع الليمون أو بناء إمبراطورية عالمية، لدينا خطة تناسبك.",
  "Intern": "متدرب",
  "For curious kids just starting out.": "للأطفال الفضوليين في بداياتهم.",
  "Founder": "مؤسس",
  "Serious about building an empire.": "جاد بشأن بناء إمبراطورية.",
  "Board Member": "عضو مجلس إدارة",
  "For the whole family.": "لجميع أفراد العائلة.",
  "Tycoon": "تايكون",
  "The ultimate VIP experience.": "تجربة VIP القصوى.",
  "1 Business Slot": "مساحة لمشروع واحد",
  "Standard Energy": "طاقة قياسية",
  "Core Lessons": "الدروس الأساسية",
  "Standard Avatar": "أفاتار قياسي",
  "Unlimited Energy": "طاقة غير محدودة",
  "3 Business Slots": "3 مساحات للمشاريع",
  "Custom HQ": "مقر مخصص",
  "Offline Mode": "وضع العمل بدون إنترنت",
  "No Ads": "بدون إعلانات",
  "3 Child Accounts": "3 حسابات للأطفال",
  "Parent Dashboard Pro": "لوحة تحكم الوالدين (نسخة برو)",
  "All Founder Perks": "جميع مزايا المؤسس",
  "Hire Ollie AI": "توظيف أولي (الذكاء الاصطناعي)",
  "Gold Avatar Skin": "مظهر أفاتار ذهبي",
  "Advanced Modules": "وحدات متقدمة",
  "Beta Access": "وصول لنسخة البيتا",
  "Classroom Management": "إدارة الفصل",
  "Curriculum Mode": "وضع المنهج",
  "Gradebook": "سجل الدرجات",
  "Build Your Empire": "ابنِ إمبراطوريتك",
  "Join the Board": "انضم لمجلس الإدارة",
  "Hire Ollie": "وظف أولي",
  "Select": "اختر",
  "Start Teaching": "ابدأ التدريس",
  "Ask Parent to Upgrade": "اطلب من والديك الترقية",
  "monthly": "شهرياً",
  "Most Popular": "الأكثر رواجاً",
  "Billed Yearly": "يتم الدفع سنوياً",
  "Annual Only": "خطة سنوية فقط",

  // Common Section
  "Plan": "خطة",
  "Parent Account": "حساب الوالدين",
  "Energy": "طاقة",
  "Ads support free learning. Upgrade to remove.": "الإعلانات تدعم التعلم المجاني. قم بالترقية لإزالتها.",
  "Out of Energy! Wait for refill or Upgrade to Founder.": "نفدت الطاقة! انتظر حتى تمتلئ أو قم بالترقية لخطة المؤسس.",
  "Loading...": "جاري التحميل...",
  "Save": "حفظ",
  "Cancel": "إلغاء",
  "Back": "رجوع",
  "Next": "التالي",
  "Close": "إغلاق",
  "Menu": "القائمة",
  "Let's Go!": "هيا بنا!",
  "Great Job!": "عمل رائع!",
  "Game Over": "انتهت اللعبة",
  "Score": "النتيجة",
  "Replay": "إعادة اللعب",
};

Object.keys(t).forEach(eng => {
  // Replace values like: key: 'English Text'
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
