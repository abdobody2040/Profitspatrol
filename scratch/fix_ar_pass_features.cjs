const fs = require('fs');

const arPath = 'src/locales/ar.ts';
let content = fs.readFileSync(arPath, 'utf8');

const t = {
  // Curriculum Descriptions
  "Make your money work for you through stocks, real estate, and compound interest.": "اجعل مالك يعمل من أجلك من خلال الأسهم والعقارات والفائدة المركبة.",
  "Master the art of selling your product to the right audience with perfect packaging.": "أتقن فن بيع منتجك للجمهور المناسب مع التغليف المثالي.",
  "Build strong teams, solve conflicts, and learn what it takes to guide others.": "ابنِ فرقاً قوية، وحل النزاعات، وتعلم ما يتطلبه الأمر لقيادة الآخرين.",
  "Understand supply and demand, inflation, taxes, and how the global market connects.": "افهم العرض والطلب، والتضخم، والضرائب، وكيفية ترابط السوق العالمية.",
  "Explore the future of business with AI, 3D printing, and digital safety.": "استكشف مستقبل الأعمال مع الذكاء الاصطناعي والطباعة ثلاثية الأبعاد والأمن الرقمي.",
  "Learn how kind businesses use fair trade and eco-friendly practices to change the world.": "تعلم كيف تستخدم الشركات اللطيفة التجارة العادلة والممارسات الصديقة للبيئة لتغيير العالم.",
  "Navigate international trade, currency exchange, and crossing cultural borders.": "تعرف على التجارة الدولية، وتبادل العملات، وعبور الحدود الثقافية.",
  "Protect your ideas and your portfolio from scams, phishing, and bad debt.": "احمِ أفكارك ومحفظتك من عمليات الاحتيال والتصيد والديون المعدومة.",
  "Discover how eco-friendly practices can build profitable business and save the planet.": "اكتشف كيف يمكن للممارسات الصديقة للبيئة بناء أعمال مربحة وإنقاذ الكوكب.",
  "Learn how startups raise money, deal with investors, and pitch their ideas.": "تعلم كيف تجمع الشركات الناشئة الأموال، وتتعامل مع المستثمرين، وتعرض أفكارها.",
  "Understand how large companies compete, grow, and build sustainable advantages.": "افهم كيف تتنافس الشركات الكبيرة، وتنمو، وتبني مزايا مستدامة.",
  "Understand digital currencies, decentralization, and how blockchain technology works.": "افهم العملات الرقمية، واللامركزية، وكيفية عمل تقنية البلوكشين.",
  "Explore how Artificial Intelligence is changing industries and the careers of tomorrow.": "استكشف كيف يغير الذكاء الاصطناعي الصناعات ومهن الغد.",
  "Master the complexities of international trade, supply chains, and leading on a global scale.": "أتقن تعقيدات التجارة الدولية، وسلاسل التوريد، والقيادة على نطاق عالمي.",
  "Build advanced financial models to predict business growth and evaluate opportunities.": "ابنِ نماذج مالية متقدمة للتنبؤ بنمو الأعمال وتقييم الفرص.",
  "Create powerful brands that connect with customers and stand out in the market.": "أنشئ علامات تجارية قوية تتواصل مع العملاء وتبرز في السوق.",
  "Discover the evolution of finance from traditional banking to digital currencies.": "اكتشف تطور المالية من الخدمات المصرفية التقليدية إلى العملات الرقمية.",
  "Learn strategies to negotiate deals, persuade others, and achieve win-win outcomes.": "تعلم استراتيجيات للتفاوض على الصفقات، وإقناع الآخرين، وتحقيق نتائج مربحة للجميع.",

  // Platform Features
  "Platform Features": "مميزات المنصة",
  "Discover how Profits Patrol builds the next generation of leaders through play.": "اكتشف كيف يبني بروفيتس باترول الجيل القادم من القادة من خلال اللعب.",
  "The Tank: AI Pitch Competition": "ذا تانك: مسابقة عرض الأفكار بالذكاء الاصطناعي",
  "Pitch your startup idea to our AI Sharks! They analyze your business model, ask tough questions, and offer virtual funding deals using advanced Voice AI.": "اعرض فكرة شركتك الناشئة على خبراء الذكاء الاصطناعي! سيقومون بتحليل نموذج عملك، وطرح أسئلة صعبة، وتقديم عروض تمويل افتراضية باستخدام الذكاء الاصطناعي الصوتي المتقدم.",
  "Voice-Interactive Pitching": "عرض الأفكار التفاعلي بالصوت",
  "Co-op Pitch Mode": "وضع عرض الأفكار التعاوني",
  "Real-Time Negotiation Feedback": "ملاحظات تفاوضية في الوقت الفعلي",
  "Master the art of negotiation and ethics. Face off against AI opponents in moral dilemmas and business disputes to sharpen your logic.": "أتقن فن التفاوض والأخلاقيات. واجه خصوم الذكاء الاصطناعي في معضلات أخلاقية ونزاعات تجارية لصقل منطقك.",
  "Ethics vs. Profits": "الأخلاقيات مقابل الأرباح",
  "Logic Training": "تدريب المنطق",
  "Win Arguments": "الفوز في النقاشات",
  "Read 100+ summarized business classics adapted for kids. Complete quizzes and real-world challenges to earn XP.": "اقرأ أكثر من 100 كتاب كلاسيكي في الأعمال ملخصة ومكيفة للأطفال. أكمل الاختبارات والتحديات الواقعية لكسب XP.",
  "Age-Adapted Summaries": "ملخصات مكيفة حسب العمر",
  "500 AI-Generated Tasks": "500 مهمة منشأة بالذكاء الاصطناعي",
  "Earn Knowledge Points": "اكسب نقاط المعرفة",
  "Learn to invest without the risk. Buy stocks, real estate, and bonds in a simulated market that reacts to world events to build your net worth.": "تعلم الاستثمار بدون مخاطرة. اشترِ الأسهم والعقارات والسندات في سوق محاكاة يتفاعل مع الأحداث العالمية لبناء ثروتك.",
  "Live Stock Market Sim": "محاكاة سوق الأسهم المباشر",
  "Real Estate Portfolio": "محفظة العقارات",
  "Earn Passive Income": "اكسب دخلاً سلبياً",
  "Interactive Learning Engine": "محرك التعلم التفاعلي",
  "Start with our Core Lessons as an Intern, or unlock the full advanced curriculum including AI, Global Trade, and the CEO Track.": "ابدأ بدروسنا الأساسية كمتدرب، أو افتح المنهج المتقدم الكامل بما في ذلك الذكاء الاصطناعي والتجارة العالمية ومسار المدير التنفيذي.",
  "160+ Lessons (CEO Track)": "أكثر من 160 درساً (مسار المدير التنفيذي)",
  "AI Tutor & Auto-Grading": "معلم ذكاء اصطناعي وتقييم تلقائي",
  "School Tournaments": "مسابقات مدرسية",
  "Business Arcade & Side Hustles": "ألعاب الأعمال والأعمال الجانبية",
  "Launch your first business for free. Build your empire with Tycoon Builder, or hit Gig Central for 20+ mini-games to earn extra cash.": "أطلق مشروعك الأول مجاناً. ابنِ إمبراطوريتك مع 'تايكون بيلدر'، أو توجه إلى 'مركز الأعمال الحرة' لأكثر من 20 لعبة صغيرة لكسب أموال إضافية.",
  "Gig Central (20+ Jobs)": "مركز الأعمال الحرة (أكثر من 20 وظيفة)",
  "Dynamic Mini-games": "ألعاب صغيرة ديناميكية",
  "Boss Battle Scenarios": "سيناريوهات معارك الزعماء",
  "RPG Progression": "تطور الشخصية (RPG)",
  "Level up from a Garage Intern to a Global Tycoon. Subscribers get exclusive Custom HQs, rare skins, and faster leveling.": "ارتقِ من متدرب في المرآب إلى تايكون عالمي. يحصل المشتركون على مقرات حصرية، ومظاهر نادرة، وترقية أسرع.",
  "HQ Visual Builder (87 Items)": "بناء المقر بصرياً (87 عنصراً)",
  "Avatar Shop": "متجر الأفاتار",
  "Seasonal Events & Tournaments": "أحداث ومسابقات موسمية",
  "Safe & Secure": "آمن ومحمي",
  "Compliant with COPPA & GDPR. The Parent & Teacher Dashboards provide full oversight, including Family Bounties and School Hours Control.": "متوافق مع قوانين COPPA وGDPR. توفر لوحات تحكم الوالدين والمعلمين إشرافاً كاملاً، بما في ذلك المكافآت العائلية والتحكم في ساعات المدرسة.",
  "COPPA/GDPR Compliant": "متوافق مع COPPA/GDPR",
  "Family Job Board": "لوحة وظائف العائلة",
  "Parent & Teacher Controls": "تحكم الوالدين والمعلمين",
};

Object.keys(t).forEach(eng => {
  const regex = new RegExp(":\\s*['\"]" + eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "['\"]", 'g');
  content = content.replace(regex, ": '" + t[eng] + "'");
});

fs.writeFileSync(arPath, content, 'utf8');
