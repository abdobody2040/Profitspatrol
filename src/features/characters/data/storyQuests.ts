import { CharacterStoryQuest } from '../types/quests';

export const CHARACTER_STORY_QUESTS: CharacterStoryQuest[] = [
  // ─── OLLIE (PLAN) QUESTS ──────────────────────────────────────────
  {
    id: 'quest_ollie_1',
    characterId: 'ollie',
    requiredTier: 1,
    titleEn: 'The Grand Ledger Blueprint',
    titleAr: 'مخطط السجل المالي الكبير',
    narrativeEn: "Welcome apprentice! A true business leader builds upon rock-solid planning. Study our foundational strategies so your venture never stumbles into blind spending.",
    narrativeAr: "أهلاً بك يا بطل! القائد الريادي الحقيقي يبدأ دائماً بخطة مالية محكمة. تعلم استراتيجياتنا التأسيسية لتضمن أن مشروعك لن يقع في فخ الإنفاق العشوائي.",
    objectiveEn: 'Complete 2 Planning or Strategy Lessons',
    objectiveAr: 'أكمل درسين في التخطيط أو الاستراتيجية المالية',
    metricType: 'lessons_completed',
    targetCount: 2,
    reward: {
      hqItemId: 'decor_ollie_clock',
      hqItemNameEn: 'Golden Owl Antique Clock',
      hqItemNameAr: 'ساعة البومة الذهبية الأثرية',
      hqItemIcon: '🕰️',
      xp: 75,
      ppTokens: 50,
      badgeId: 'badge_ollie_apprentice',
      badgeTitleEn: "Planner's Compass",
      badgeTitleAr: 'بوصلة المخطط'
    }
  },
  {
    id: 'quest_ollie_2',
    characterId: 'ollie',
    requiredTier: 2,
    titleEn: 'The Emergency Vault Audit',
    titleAr: 'تدقيق خزنة الطوارئ',
    narrativeEn: "Markets fluctuate like shifting winds. We must ensure our savings reserve is fortified before seeking aggressive business expansion.",
    narrativeAr: "الأسواق تتقلب كالرياح! علينا أن نحصن احتياطي الطوارئ ونثبت كفاءة إدارة ميزانيتنا قبل أن نتوسع بمشاريع كبرى.",
    objectiveEn: 'Maintain 200+ ppTokens in Treasury and complete 3 Strategy Lessons',
    objectiveAr: 'حافظ على رصيد 200 عملة في الخزينة وأكمل 3 دروس استراتيجية',
    metricType: 'lessons_completed',
    targetCount: 3,
    reward: {
      hqItemId: 'decor_ollie_whiteboard',
      hqItemNameEn: 'Grand Strategy Whiteboard',
      hqItemNameAr: 'سبورة التخطيط الاستراتيجي الكبرى',
      hqItemIcon: '📋',
      xp: 120,
      ppTokens: 100,
      badgeId: 'badge_ollie_strategist',
      badgeTitleEn: 'Master of Forecasting',
      badgeTitleAr: 'خبير التنبؤ المالي'
    }
  },
  {
    id: 'quest_ollie_3',
    characterId: 'ollie',
    requiredTier: 3,
    titleEn: 'The Capstone Empire Pitch',
    titleAr: 'عرض الإمبراطورية الاستراتيجي',
    narrativeEn: "The time has come. You've earned my deepest strategic trust. Present our complete business roadmap to city investors with absolute confidence!",
    narrativeAr: "لقد حانت اللحظة الحاسمة! لقد نلت ثقتي الاستراتيجية الكاملة. حان وقت عرض خارطة طريق إمبراطوريتنا على كبار المستثمرين بثقة تامة.",
    objectiveEn: 'Complete 5 Advanced Strategy Modules',
    objectiveAr: 'أكمل 5 وحدات استراتيجية متقدمة',
    metricType: 'lessons_completed',
    targetCount: 5,
    reward: {
      hqItemId: 'decor_ollie_globe',
      hqItemNameEn: 'Crystal Expansion Globe',
      hqItemNameAr: 'مجسم الكرة الأرضية الكريستالي',
      hqItemIcon: '🌐',
      xp: 250,
      ppTokens: 200,
      badgeId: 'badge_ollie_grand_mentor',
      badgeTitleEn: 'Grand Strategist Crown',
      badgeTitleAr: 'تاج المخطط الأسطوري'
    }
  },

  // ─── REEMA (CONNECT) QUESTS ───────────────────────────────────────
  {
    id: 'quest_reema_1',
    characterId: 'reema',
    requiredTier: 1,
    titleEn: 'First Impression Broadcast',
    titleAr: 'بث الانطباع الأول',
    narrativeEn: "Hey there! A brilliant product is invisible if nobody knows about it. Let's find your authentic brand voice and share your message with the district!",
    narrativeAr: "مرحباً يا بطل! أروع منتج في العالم لن يراه أحد إذا لم نبتكر له هوية تجذب القلوب. هيا نكتشف نبرة علامتك التجارية وننشرها في الحي!",
    objectiveEn: 'Complete 2 Marketing & Communication Lessons',
    objectiveAr: 'أكمل درسين في التسويق والتواصل مع العملاء',
    metricType: 'marketing_campaign',
    targetCount: 2,
    reward: {
      hqItemId: 'decor_reema_neon',
      hqItemNameEn: 'Arctic Neon Brand Sign',
      hqItemNameAr: 'لافتة نيون الثعلب القطبي المضيئة',
      hqItemIcon: '⚡',
      xp: 75,
      ppTokens: 50,
      badgeId: 'badge_reema_spark',
      badgeTitleEn: 'Brand Spark',
      badgeTitleAr: 'شرارة العلامة التجارية'
    }
  },
  {
    id: 'quest_reema_2',
    characterId: 'reema',
    requiredTier: 2,
    titleEn: 'The Golden Testimonial Wave',
    titleAr: 'موجة التقييمات الذهبية',
    narrativeEn: "Word of mouth is pure gold! When you treat customers with care and honesty, their recommendations become an unstoppable marketing machine.",
    narrativeAr: "التسويق الشفهي وتوصيات الزبائن أثمن من الذهب! عندما تعامل زبائنك بصدق وتقدير، تصبح توصياتهم أقوى محرك مبيعات في المدينة.",
    objectiveEn: 'Complete 3 Marketing & Customer Connection Lessons',
    objectiveAr: 'أكمل 3 دروس في بناء شبكة ولاء العملاء والتسويق',
    metricType: 'marketing_campaign',
    targetCount: 3,
    reward: {
      hqItemId: 'decor_reema_mic',
      hqItemNameEn: 'Pro Podcaster Studio Mic',
      hqItemNameAr: 'ميكروفون استوديو البودكاست الاحترافي',
      hqItemIcon: '🎙️',
      xp: 120,
      ppTokens: 100,
      badgeId: 'badge_reema_voice',
      badgeTitleEn: 'Respected Community Voice',
      badgeTitleAr: 'صوت المجتمع الموثوق'
    }
  },
  {
    id: 'quest_reema_3',
    characterId: 'reema',
    requiredTier: 3,
    titleEn: 'The Citywide Viral Buzz',
    titleAr: 'صدى الانتشار الكاسح',
    narrativeEn: "Incredible momentum! The whole city is buzzing with your story. Let's install our permanent holographic beacon so every visitor feels inspired.",
    narrativeAr: "زخم استثنائي! المدينة بأسرها تتحدث عن قصة نجاحك. دعنا نثبت منارتنا الهولوغرافية في المقر لتبقى شاهداً على قوة تواصلك مع الجماهير.",
    objectiveEn: 'Complete 5 Marketing & Social Proof Lessons',
    objectiveAr: 'أكمل 5 دروس في صناعة المحتوى والانتشار المؤثر',
    metricType: 'marketing_campaign',
    targetCount: 5,
    reward: {
      hqItemId: 'decor_reema_holo_fox',
      hqItemNameEn: 'Holographic Arctic Fox Mascot',
      hqItemNameAr: 'مجسم ثعلب هولوغرافي مضيء ثلاثي الأبعاد',
      hqItemIcon: '🦊',
      xp: 250,
      ppTokens: 200,
      badgeId: 'badge_reema_virtuoso',
      badgeTitleEn: 'Connection Virtuoso',
      badgeTitleAr: 'مايسترو التواصل الجماهيري'
    }
  },

  // ─── FILO (PROTECT) QUESTS ────────────────────────────────────────
  {
    id: 'quest_filo_1',
    characterId: 'filo',
    requiredTier: 1,
    titleEn: 'The Shield of Ethical Deals',
    titleAr: 'درع الصفقات النزيهة',
    narrativeEn: "Stay sharp little elephant! Not every shiny offer is genuine. Let me teach you how to spot predatory scams, hidden interest rates, and unfair contracts.",
    narrativeAr: "انتبه جيداً يا صديقي! ليست كل صفقة براقة صادقة. دعني أعلمك كيف تكشف الاحتيال المالي، الفوائد المخفية، والشروط الجائرة.",
    objectiveEn: 'Complete 2 Risk & Ethics Protection Lessons',
    objectiveAr: 'أكمل درسين في الحماية المالية وأخلاقيات الأعمال',
    metricType: 'savings_milestone',
    targetCount: 2,
    reward: {
      hqItemId: 'decor_filo_safe',
      hqItemNameEn: 'Titanium Mini Piggy Safe',
      hqItemNameAr: 'خزنة الفيل التيتانيوم الحصينة',
      hqItemIcon: '🪙',
      xp: 75,
      ppTokens: 50,
      badgeId: 'badge_filo_shield',
      badgeTitleEn: 'Scam-Proof Shield',
      badgeTitleAr: 'درع الحماية من الاحتيال'
    }
  },
  {
    id: 'quest_filo_2',
    characterId: 'filo',
    requiredTier: 2,
    titleEn: 'Defending the District Treasury',
    titleAr: 'حماية خزينة الحي',
    narrativeEn: "A prudent business never compromises ethical standards under pressure. Stand firm on honest pricing and protect your customers' privacy.",
    narrativeAr: "الريادي النبيل لا يتنازل عن معاييره الأخلاقية تحت أي ضغط. حافظ على التسعير العادل واحمِ بيانات وحقوق عملائك.",
    objectiveEn: 'Complete 3 Ethical Operations Lessons',
    objectiveAr: 'أكمل 3 دروس في النزاهة وأمان العمليات التجارية',
    metricType: 'savings_milestone',
    targetCount: 3,
    reward: {
      hqItemId: 'decor_filo_drone',
      hqItemNameEn: 'Smart Security Sentry Drone',
      hqItemNameAr: 'طائرة حراسة أمنية ذكية للمقر',
      hqItemIcon: '🛡️',
      xp: 120,
      ppTokens: 100,
      badgeId: 'badge_filo_sentinel',
      badgeTitleEn: 'Guardian Sentinel',
      badgeTitleAr: 'حارس النزاهة المالية'
    }
  },
  {
    id: 'quest_filo_3',
    characterId: 'filo',
    requiredTier: 3,
    titleEn: 'The Fortress of Prudence',
    titleAr: 'حصن الأمان المالي',
    narrativeEn: "You have proven that supreme wealth comes from unshakeable integrity. Here is the Golden Scale of Justice to grace your headquarters forever.",
    narrativeAr: "لقد أثبتّ أن الثروة الحقيقية تدوم بالنزاهة والمسؤولية! تفضل ميزان العدالة الذهبي ليزين مقرك الرئيسي إلى الأبد.",
    objectiveEn: 'Complete 5 Risk Protection & Prudence Lessons',
    objectiveAr: 'أكمل 5 دروس متقدمة في الأمان والمسؤولية المالية',
    metricType: 'savings_milestone',
    targetCount: 5,
    reward: {
      hqItemId: 'decor_filo_scales',
      hqItemNameEn: 'Golden Scales of Business Ethics',
      hqItemNameAr: 'ميزان العدالة وأخلاقيات التجارة الذهبي',
      hqItemIcon: '⚖️',
      xp: 250,
      ppTokens: 200,
      badgeId: 'badge_filo_guardian',
      badgeTitleEn: 'Guardian of Ethics Crown',
      badgeTitleAr: 'وسام حامي العدالة المالية'
    }
  },

  // ─── KAMI (CREATE) QUESTS ─────────────────────────────────────────
  {
    id: 'quest_kami_1',
    characterId: 'kami',
    requiredTier: 1,
    titleEn: 'The Spark of Experimentation',
    titleAr: 'شرارة التجربة الأولى',
    narrativeEn: "Woohoo! Welcome to the lab! Forget boring rules for a second—what happens when we mix solar energy with reusable coffee cups? Let's build your first prototype!",
    narrativeAr: "مرحى! أهلاً بك في معمل الابتكار! دعنا ننسى القواعد التقليدية للحظة؛ ماذا يحدث لو دمجنا الطاقة الشمسية مع أكواب قابلة لإعادة التدوير؟ هيا نصنع نموذجك الأولي!",
    objectiveEn: 'Synthesize 1 Prototype in Kami’s Lab',
    objectiveAr: 'اصنع نموذجاً أولياً واحداً في معمل كامي',
    metricType: 'prototypes_crafted',
    targetCount: 1,
    reward: {
      hqItemId: 'decor_kami_beaker',
      hqItemNameEn: 'Chameleon Alchemy Beaker',
      hqItemNameAr: 'مجموعة قوارير كيمياء الابتكار المضيئة',
      hqItemIcon: '🧪',
      xp: 75,
      ppTokens: 50,
      badgeId: 'badge_kami_tinkerer',
      badgeTitleEn: 'Curious Tinkerer',
      badgeTitleAr: 'مبتكر شغوف'
    }
  },
  {
    id: 'quest_kami_2',
    characterId: 'kami',
    requiredTier: 2,
    titleEn: 'The High-Demand Breakthrough',
    titleAr: 'طفرة الطلب العالي',
    narrativeEn: "Creating is great, but creating something people are desperate to buy? That is pure magic! Let's iterate until the customer demand meter hits the red zone!",
    narrativeAr: "الابتكار ممتع، لكن ابتكار منتج يتهافت عليه الزبائن بحماس؟ هذا هو السحر الريادي الحقيقي! هيا نعدل المكونات حتى ينفجر مقياس الطلب!",
    objectiveEn: 'Craft a Prototype with HIGH or VIRAL Demand',
    objectiveAr: 'اصنع نموذجاً أولياً بتقييم طلب مرتفع (HIGH) أو واسع الانتشار (VIRAL)',
    metricType: 'high_demand_prototype',
    targetCount: 1,
    reward: {
      hqItemId: 'decor_kami_3d_printer',
      hqItemNameEn: 'Quantum Mini 3D Fabricator',
      hqItemNameAr: 'طابعة مجسمات ثلاثية الأبعاد كمومية للمقر',
      hqItemIcon: '🖨️',
      xp: 120,
      ppTokens: 100,
      badgeId: 'badge_kami_inventor',
      badgeTitleEn: 'Breakthrough Creator',
      badgeTitleAr: 'صانع الطفرات الابتكارية'
    }
  },
  {
    id: 'quest_kami_3',
    characterId: 'kami',
    requiredTier: 3,
    titleEn: "The Disruptor's Masterpiece",
    titleAr: 'تحفة المبتكر الخارق',
    narrativeEn: "Incredible! Your inventions are transforming the entire Patrol District. Here is our prized Prismatic Chameleon Trophy—a badge of legendary creativity!",
    narrativeAr: "مذهل ومبهر! اختراعاتك أحدثت ثورة حقيقية في أحياء المدينة. تفضل كأس الحرباء المنشوري—شارة الإبداع الأسطوري الخالد!",
    objectiveEn: 'Synthesize 3 High-Scoring Prototypes in Kami’s Lab',
    objectiveAr: 'اصنع 3 نماذج ابتكارية متميزة في معمل كامي',
    metricType: 'prototypes_crafted',
    targetCount: 3,
    reward: {
      hqItemId: 'decor_kami_rainbow_trophy',
      hqItemNameEn: 'Prismatic Chameleon Innovation Trophy',
      hqItemNameAr: 'كأس الحرباء المنشوري للابتكار الخارق',
      hqItemIcon: '🏆',
      xp: 250,
      ppTokens: 200,
      badgeId: 'badge_kami_master',
      badgeTitleEn: 'Master Disruptor Crown',
      badgeTitleAr: 'تاج المبتكر الأسطوري'
    }
  },

  // ─── REX (RIVAL RACCOON) QUESTS ───────────────────────────────────
  {
    id: 'quest_rex_1',
    characterId: 'rex',
    requiredTier: 1,
    titleEn: "Rex's Street Market Gauntlet",
    titleAr: 'تحدي سوق الشارع مع ريكس',
    narrativeEn: "*Smirks and crosses arms* Think you can step into my turf and set up shop? Prove you've got real guts, rookie. Face me in a market showdown!",
    narrativeAr: "*يبتسم بسخرية ويعقد ذراعيه* تظن أنك تستطيع دخول منطقتي وإدارة متجر؟ أرني شجاعتك في السوق الحقيقي! واجهني في نزال الحصة السوقية!",
    objectiveEn: 'Engage Rex in at least 1 District Showdown',
    objectiveAr: 'خُض نزالاً واحداً على الأقل ضد ريكس في أي حي',
    metricType: 'rex_confrontation',
    targetCount: 1,
    reward: {
      hqItemId: 'decor_rex_gloves',
      hqItemNameEn: 'Framed Rivalry Boxing Gloves',
      hqItemNameAr: 'قفازات ملاكمة النزال التنافسي المؤطرة',
      hqItemIcon: '🥊',
      xp: 75,
      ppTokens: 50,
      badgeId: 'badge_rex_challenger',
      badgeTitleEn: 'Fearless Contender',
      badgeTitleAr: 'متحدٍ بلا تردد'
    }
  },
  {
    id: 'quest_rex_2',
    characterId: 'rex',
    requiredTier: 2,
    titleEn: 'The Market Share Pushback',
    titleAr: 'نزاع الحصة السوقية الشرس',
    narrativeEn: "Hmph. You didn't fold like the other amateurs. But can you actually beat my pricing and outmaneuver my supply chain? Let's see it!",
    narrativeAr: "همم.. لم تستسلم كبقية الهواة كما توقعت! لكن هل تستطيع حقاً التغلب على أسعاري ومناورة سلاسل إمدادي؟ هيا نرى ذلك في الميدان!",
    objectiveEn: 'Achieve a Victory or Tactical Draw against Rex',
    objectiveAr: 'حقق فوزاً أو تعادلاً تكتيكياً ضد ريكس في نزال السوق',
    metricType: 'rex_victory',
    targetCount: 1,
    reward: {
      hqItemId: 'decor_rex_arcade',
      hqItemNameEn: 'Retro Rivalry Arcade Cabinet',
      hqItemNameAr: 'جهاز ألعاب أركيد التحدي الكلاسيكي للمقر',
      hqItemIcon: '🕹️',
      xp: 120,
      ppTokens: 100,
      badgeId: 'badge_rex_respected',
      badgeTitleEn: 'Respected Rival',
      badgeTitleAr: 'خصم يُحسب له حساب'
    }
  },
  {
    id: 'quest_rex_3',
    characterId: 'rex',
    requiredTier: 3,
    titleEn: 'The Unlikely Co-Op Treaty',
    titleAr: 'معاهدة التحالف الاستثنائي',
    narrativeEn: "Look... between you and me? You're the sharpest operator in this town. If we team up on a pitch, nobody can touch us. Take this statue as proof of our alliance.",
    narrativeAr: "اسمعني جيداً.. بيني وبينك؟ أنت أذكى ريادي رأيته في هذه المدينة. إن وضعنا أيدينا معاً في قاعة المستثمرين فلن يقف أمامنا أحد! خذ هذا التمثال كعهد بيننا.",
    objectiveEn: 'Achieve 2 Victories against Rex in District Showdowns',
    objectiveAr: 'حقق فوزين في نزالات الأحياء ضد ريكس',
    metricType: 'rex_victory',
    targetCount: 2,
    reward: {
      hqItemId: 'decor_rex_statue',
      hqItemNameEn: 'Golden Rex Champion Statue',
      hqItemNameAr: 'تمثال ريكس الذهبي للشراكة التنافسية',
      hqItemIcon: '🦖',
      xp: 250,
      ppTokens: 200,
      badgeId: 'badge_rex_brotherhood',
      badgeTitleEn: 'Brother in Business',
      badgeTitleAr: 'رفيق ريادة الأعمال'
    }
  }
];

export const getQuestsForCharacter = (characterId: string): CharacterStoryQuest[] => {
  return CHARACTER_STORY_QUESTS.filter(q => q.characterId === characterId);
};

export const getQuestById = (questId: string): CharacterStoryQuest | undefined => {
  return CHARACTER_STORY_QUESTS.find(q => q.id === questId);
};
