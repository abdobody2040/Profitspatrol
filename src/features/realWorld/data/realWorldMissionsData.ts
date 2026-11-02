import { RealWorldMission } from '../types/realWorld';

export const REAL_WORLD_MISSIONS: RealWorldMission[] = [
  {
    id: 'rwm_grocery',
    category: 'smart_shopping',
    titleEn: 'Grocery Detective: Price Comparison',
    titleAr: 'محقق السوبرماركت: مقارنة الأسعار الذكية',
    descriptionEn: 'Visit a local grocery store or supermarket with your family and compare 3 competing brands of the same product.',
    descriptionAr: 'زر متجر بقالة أو سوبرماركت مع عائلتك وقارن بين 3 علامات تجارية مختلفة لنفس السلعة (مثل الحليب أو الحبوب أو البسكويت).',
    icon: '🛒',
    stepsEn: [
      'Find 3 brands of the same product (e.g. cereal, pasta, or juice)',
      'Check the price of each and observe packaging size or weight',
      'Identify which option provides the best value per gram/milliliter'
    ],
    stepsAr: [
      'ابحث عن 3 علامات تجارية لنفس المنتج (مثل حبوب الإفطار أو العصير أو المكرونة)',
      'سجل سعر كل منتج ولاحظ حجم العبوة أو الوزن المكتوب',
      'حدد أي الخيارات يقدم أفضل قيمة وأعلى جودة مقابل المال المدفوع'
    ],
    discussionQuestionEn: 'Why do you think the most advertised brand is often more expensive?',
    discussionQuestionAr: 'لماذا تعتقد أن المنتج الأكثر إعلاناً وشهرة يكون غالباً أغلى سعراً؟',
    rewardTokens: 120,
    rewardXp: 80,
    badgeId: 'badge_grocery_detective',
    badgeNameEn: 'Smart Shopper Badge',
    badgeNameAr: 'وسام المتسوق الذكي'
  },
  {
    id: 'rwm_savings_jar',
    category: 'home_savings',
    titleEn: 'Home Savings Goal Jar',
    titleAr: 'حصالة التوفير المنزلية لهدف حقيقي',
    descriptionEn: 'Set a physical savings jar, piggy bank, or envelope at home for a goal you want to achieve.',
    descriptionAr: 'اصنع حصالة أو خصص مظروفاً في منزلك وضع عليه ملصقاً لهدف ترغب في شرائه بنفسك.',
    icon: '🏺',
    stepsEn: [
      'Choose a specific realistic goal (e.g. a book, puzzle, or gift for someone)',
      'Calculate how many weeks of saving a portion of your allowance it will take',
      'Label the jar with your goal name and target date'
    ],
    stepsAr: [
      'اختر هدفاً واقعياً ومحدداً (مثل كتاب، لعبة تفكير، أو هدية لشخص تحبه)',
      'احسب كم أسبوعاً تحتاج إذا ادخرت جزءاً صغيراً من مصروفك أسبوعياً',
      'اكتب اسم الهدف وتاريخ الوصول على الحصالة وضعه في مكان مرئي'
    ],
    discussionQuestionEn: 'How does having a visible goal prevent impulsive spending on small sweets?',
    discussionQuestionAr: 'كيف يساعدك وجود هدف مكتوب أمامك على مقاومة إغراء شراء الحلوى غير الضرورية؟',
    rewardTokens: 150,
    rewardXp: 100,
    badgeId: 'badge_savings_master',
    badgeNameEn: 'Piggy Bank Champion',
    badgeNameAr: 'بطل الادخار المنزلي'
  },
  {
    id: 'rwm_customer_interview',
    category: 'customer_research',
    titleEn: 'Family Customer Interview',
    titleAr: 'مقابلة العميل في العائلة',
    descriptionEn: 'Interview a parent, sibling, or grandparent about why they regularly buy a favorite product.',
    descriptionAr: 'أجرِ مقابلة سريعة مع أحد والديك أو إخوتك واسأله لماذا يفضل شراء ماركة معينة دائماً.',
    icon: '🎤',
    stepsEn: [
      'Ask them: "What made you choose this brand over cheaper alternatives?"',
      'Ask them: "If they changed the recipe or raised the price, would you still buy it?"',
      'Note down 2 key reasons (quality, habit, emotional connection, or convenience)'
    ],
    stepsAr: [
      'اسأل الشخص: "ما الذي يجعلك تفضل هذا المنتج تحديداً عن غيره؟"',
      'اسأله: "لو رفعوا السعر قليلاً أو غيروا التغليف، هل ستستمر في شرائه؟"',
      'دوّن في ملاحظاتك سببين أساسيين (الجودة، الثقة، الراحة، أو حسن المعاملة)'
    ],
    discussionQuestionEn: 'What is the secret behind customer loyalty that businesses strive for?',
    discussionQuestionAr: 'ما هو سر ولاء الزبائن للعلامة التجارية في رأيك؟',
    rewardTokens: 130,
    rewardXp: 90,
    badgeId: 'badge_customer_empathy',
    badgeNameEn: 'Customer Empathy Badge',
    badgeNameAr: 'وسام فهم احتياجات العميل'
  },
  {
    id: 'rwm_home_solution',
    category: 'home_solution',
    titleEn: 'Household Problem-Solver Pitch',
    titleAr: 'حل مشكلة منزلية: مقترح ريادي',
    descriptionEn: 'Find an everyday household chore, clutter area, or organization problem, sketch a creative solution, and pitch it to your family.',
    descriptionAr: 'لاحظ مشكلة يومية في البيت (فوضى أسلاك، تنظيم ألعاب، أو تذكير بالمهام)، وارسم حلاً مبتكراً واعرضه على أسرتك.',
    icon: '🛠️',
    stepsEn: [
      'Identify a daily frustration or inefficiency at home',
      'Sketch a simple organizer, sign, or routine schedule that fixes it',
      'Pitch your idea to your family and ask for constructive feedback'
    ],
    stepsAr: [
      'حدد حاجة أو فوضى تتكرر في المنزل وتحتاج إلى تنظيم',
      'ارسم على ورقة تصميماً بسيطاً أو جدولاً أو فكرة ذكية لحل هذه المشكلة',
      'اعرض فكرتك على عائلتك واطلب منهم إبداء رأيهم واقتراحاتهم'
    ],
    discussionQuestionEn: 'How do entrepreneurs turn daily annoyances into thriving business ideas?',
    discussionQuestionAr: 'كيف يحول رواد الأعمال المتاعب اليومية إلى مشاريع تجارية ناجحة؟',
    rewardTokens: 160,
    rewardXp: 110,
    badgeId: 'badge_home_innovator',
    badgeNameEn: 'Household Innovator',
    badgeNameAr: 'وسام المبتكر المنزلي'
  },
  {
    id: 'rwm_recycling_eco',
    category: 'sustainability',
    titleEn: 'Eco-Sorting & Value Recovery',
    titleAr: 'مشروع التدوير واسترجاع القيمة الخضراء',
    descriptionEn: 'Collect and clean 5 recyclable containers (paper, plastic, or cans) at home and learn about resource recovery.',
    descriptionAr: 'اجمع 5 علب أو عبوات قابلة للتدوير في المنزل ونظفها، واكتشف كيف تصنع الاستدامة قيمة اقتصادية.',
    icon: '♻️',
    stepsEn: [
      'Collect 5 clean recyclable plastic, aluminum, or paper containers',
      'Look for the recycling code symbols (numbers 1-7) on plastic bottles',
      'Place them in the proper recycling bin or reuse them creatively'
    ],
    stepsAr: [
      'اجمع 5 عبوات بلاستيكية أو ورقية أو معدنية نظيفة في المنزل',
      'ابحث عن رمز مثلث إعادة التدوير والأرقام (1 إلى 7) لمعرفة نوع البلاستيك',
      'ضعها في صندوق إعادة التدوير المخصص أو أعد استخدامها بأسلوب إبداعي'
    ],
    discussionQuestionEn: 'Why do forward-thinking businesses treat recycling as a resource, not waste?',
    discussionQuestionAr: 'لماذا تعد الشركات الحديثة إعادة التدوير استثماراً مربحاً وليس مجرد نفايات؟',
    rewardTokens: 140,
    rewardXp: 90,
    badgeId: 'badge_green_founder',
    badgeNameEn: 'Green Founder Badge',
    badgeNameAr: 'وسام رائد الأعمال الأخضر'
  }
];
