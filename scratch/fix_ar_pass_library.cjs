const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Library UI
  "The Library": "المكتبة",
  "Read books to grow your CEO brain!": "اقرأ الكتب لتنمية عقلك القيادي!",
  "Business Bestsellers": "أفضل الكتب مبيعاً في الأعمال",
  "Profits Patrol Exclusives": "حصريات بروفيتس باترول",
  "Read Summary": "اقرأ الملخص",
  "No books in the library yet.": "لا توجد كتب في المكتبة بعد.",
  "What's it about?": "عن ماذا يتحدث الكتاب؟",
  "Tasks & Challenges": "المهام والتحديات",
  "Key Lessons": "الدروس الرئيسية",
  "Close Book": "أغلق الكتاب",
  "Mindset": "العقلية",
  "Finance": "المالية",
  "Strategy": "الاستراتيجية",
  "Category": "الفئة",
  "Biography": "سيرة ذاتية",
  "Fiction": "خيالي",
  "Hand-picked books only available inside Profits Patrol": "كتب مختارة بعناية متوفرة فقط داخل بروفيتس باترول",
  "from classic stories to young entrepreneur guides!": "من القصص الكلاسيكية إلى أدلة رواد الأعمال الصغار!",
  "EXCLUSIVE": "حصري",
  "Unlock Premium": "فتح النسخة المميزة",
  "Premium Only": "للمشتركين فقط",
  
  // Tasks UI
  "Start Task": "ابدأ المهمة",
  "min": "دقيقة",
  "Quiz Results": "نتائج الاختبار",
  "Keep Learning!": "استمر في التعلم!",
  "Claim Rewards": "استلم المكافآت",
  "You got {{count}} out of {{total}} correct": "لقد أجبت بشكل صحيح على {{count}} من أصل {{total}}",
  "Submit Reflection": "أرسل تأملاتك",
  "Submit Application": "أرسل التطبيق العملي",
  "Complete Challenge": "أكمل التحدي",
  "I've Shared This!": "لقد شاركت هذا!",
  "Share what you learned!": "شارك ما تعلمته!",
  "Explain this concept to a friend, family member, or classmate. Teaching others is one of the best ways to learn!": "اشرح هذا المفهوم لصديق أو أحد أفراد العائلة أو زميل في الدراسة. تعليم الآخرين هو أحد أفضل الطرق للتعلم!",
  "Tip: Try to explain it in your own words without looking at the book!": "تلميح: حاول شرحه بكلماتك الخاصة دون النظر إلى الكتاب!",
  "Describe how you applied what you learned from this book in real life:": "صف كيف طبقت ما تعلمته من هذا الكتاب في الحياة الواقعية:",
  "words": "كلمة",
  "Progress": "التقدم",
  "Steps:": "الخطوات:",
  "Track Your Progress:": "تتبع تقدمك:",

  // Book Summaries - Think and Grow Rich
  "The Power of Big Dreams": "قوة الأحلام الكبيرة",
  "Think and Grow Rich": "فكر وازدد ثراءً",
  "Imagine if you had a magic map to reach any goal! This book teaches you that your brain is like a muscle. If you have a clear dream, write it down, and work with your friends, you can build anything": "تخيل لو كان لديك خريطة سحرية للوصول إلى أي هدف! هذا الكتاب يعلمك أن عقلك مثل العضلات. إذا كان لديك حلم واضح، واكتبه، وعملت مع أصدقائك، يمكنك بناء أي شيء",
  "from a lemonade empire to a robot factory!": "من إمبراطورية الليمون إلى مصنع روبوتات!",
  "Based on 20 years of research on 500 millionaires, this classic reveals that success starts in the mind. You'll learn how to develop 'definiteness of purpose,' use the power of your subconscious, and form a 'Master Mind' group to turn your ambitions into financial reality.": "بناءً على 20 عاماً من البحث على 500 مليونير، يكشف هذا الكتاب الكلاسيكي أن النجاح يبدأ في العقل. ستتعلم كيفية تطوير 'تحديد الهدف'، واستخدام قوة عقلك الباطن، وتكوين مجموعة 'العقل المدبر' لتحويل طموحاتك إلى واقع مالي.",
  "Have a clear goal of what you want to achieve.": "ضع هدفاً واضحاً لما تريد تحقيقه.",
  "Define a specific, measurable financial goal.": "حدد هدفاً مالياً محدداً وقابلاً للقياس.",
  "Don't give up, even when things get tough!": "لا تستسلم، حتى عندما تصبح الأمور صعبة!",
  "Develop persistence to overcome temporary failures.": "طور الإصرار للتغلب على الفشل المؤقت.",
  "Team up with friends to solve big problems.": "تعاون مع الأصدقاء لحل المشكلات الكبيرة.",
  "Build a Master Mind group for collective wisdom.": "ابنِ مجموعة 'العقل المدبر' للحصول على حكمة جماعية.",

  // Book Summaries - Rich Dad Poor Dad
  "Rich Dad, Smart Kid": "أب غني، طفل ذكي",
  "Rich Dad Poor Dad": "الأب الغني والأب الفقير",
  "Did you know that money can work for YOU like a little robot? Instead of just working for money, this book shows you how to buy 'assets' (things that put coins in your pocket) and avoid 'liabilities' (things that take coins out).": "هل تعلم أن المال يمكن أن يعمل من أجلك مثل روبوت صغير؟ بدلاً من العمل من أجل المال فقط، يوضح لك هذا الكتاب كيفية شراء 'الأصول' (الأشياء التي تضع النقود في جيبك) وتجنب 'الالتزامات' (الأشياء التي تأخذ النقود منه).",
  "An asset is something that earns you money.": "الأصل هو شيء يكسبك المال.",
  "Buy assets that generate cash flow, not liabilities.": "اشترِ الأصول التي تولد تدفقاً نقدياً، وليس الالتزامات.",
  "Learn how money works so you can be its boss.": "تعلم كيف يعمل المال حتى تكون أنت سيده.",
  "Mind your own business by building your asset column.": "اهتم بعملك الخاص من خلال بناء عمود الأصول الخاص بك.",
  "Don't be afraid to try new business ideas!": "لا تخف من تجربة أفكار تجارية جديدة!",
  "Take calculated risks and learn from every investment.": "تحمل مخاطر محسوبة وتعلم من كل استثمار.",

  // Book Summaries - How to Win Friends
  "Super Friend Guide": "دليل الصديق الخارق",
  "How to Win Friends & Influence People": "كيف تكسب الأصدقاء وتؤثر في الناس",
  "Being a great leader means being a great friend! Learn the 'superpowers' of listening, smiling, and making others feel important. When people like and trust you, they'll want to help you build your business.": "أن تكون قائداً عظيماً يعني أن تكون صديقاً عظيماً! تعلم 'القوى الخارقة' للاستماع والابتسام وجعل الآخرين يشعرون بأهميتهم. عندما يحبك الناس ويثقون بك، سيرغبون في مساعدتك في بناء مشروعك.",
  "In business, relationships are everything. Dale Carnegie's timeless advice teaches you how to handle people, make them like you, and win them over to your way of thinking without causing resentment. These are the soft skills every CEO needs.": "في العمل، العلاقات هي كل شيء. تعلمك نصيحة ديل كارنيجي الخالدة كيفية التعامل مع الناس، وجعلهم يحبونك، وكسبهم إلى طريقة تفكيرك دون إثارة استياء. هذه هي المهارات الناعمة التي يحتاجها كل مدير تنفيذي.",
  "Always smile and be kind to everyone you meet.": "ابتسم دائماً وكن لطيفاً مع كل من تقابله.",
  "Become genuinely interested in other people.": "كن مهتماً بصدق بالآخرين.",
  "Listen more than you talk to understand others.": "استمع أكثر مما تتكلم لتفهم الآخرين.",
  "Be a good listener and encourage others to talk.": "كن مستمعاً جيداً وشجع الآخرين على التحدث.",
  "Make people feel special by using their names.": "اجعل الناس يشعرون بالتميز باستخدام أسمائهم.",
  "Make the other person feel important": "اجعل الشخص الآخر يشعر بالأهمية",

  // Book Summaries - 7 Habits
  "7 Habits of Happy Kids": "العادات السبع للأطفال السعداء",
  "7 Habits of Highly Effective Teens": "العادات السبع للمراهقين الأكثر فعالية",
  "Do you want to be the captain of your own ship? These 7 habits show you how to be responsible, plan ahead, and work well with others. It's like a secret code for being happy and successful in school and business!": "هل تريد أن تكون قبطان سفينتك الخاصة؟ توضح لك هذه العادات السبع كيف تكون مسؤولاً، وتخطط مسبقاً، وتعمل بشكل جيد مع الآخرين. إنها مثل رمز سري لتكون سعيداً وناجحاً في المدرسة والعمل!",
  "Be the boss of your own actions (Be Proactive).": "كن سيد أفعالك (كن مبادراً).",
  "Take responsibility for your life (Be Proactive).": "تحمل مسؤولية حياتك (كن مبادراً).",
  "Draw a map before you start a journey.": "ارسم خريطة قبل أن تبدأ الرحلة.",
  "Define your mission and goals in life.": "حدد رسالتك وأهدافك في الحياة.",
  "Work first, then play (Put First Things First).": "العمل أولاً، ثم اللعب (ضع الأهم أولاً).",
  "Prioritize your most important tasks every day.": "حدد أولويات مهامك الأكثر أهمية كل يوم.",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
console.log('Library and Books Arabic translation pass complete.');
