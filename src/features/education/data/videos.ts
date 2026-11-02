import { Video } from '../../../types';

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid_supply_demand',
    title: 'The Umbrella Crisis: Supply & Demand',
    titleAr: 'أزمة المظلات: العرض والطلب',
    description: 'A sudden rainstorm hits the playground! When everyone needs an umbrella but there is only one left, what happens to the price?',
    descriptionAr: 'عاصفة مطرية مفاجئة تضرب المدينة! عندما يحتاج الجميع إلى مظلة ولا توجد سوى مظلة واحدة، ماذا يحدث للسعر؟',
    category: 'Shorts',
    duration: '0:35',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_supply_demand.jpg',
    fullPosterUrl: '/images/videos/clip_supply_demand.jpg',
    keyTerm: 'Supply & Demand',
    keyTermAr: 'العرض والطلب',
    likesCount: 1420,
    viewsCount: 8930,
    tags: ['economics', 'market', 'shorts'],
    animationConfig: {
      themeColor: 'from-amber-500 to-orange-600',
      bgGradient: 'bg-gradient-to-b from-indigo-900 via-slate-900 to-amber-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 6,
          caption: 'Imagine a bright sunny day... suddenly, BOOM! Rain starts pouring down! 🌧️',
          captionAr: 'تخيل يوماً مشمساً... وفجأة، بوم! بدأ المطر ينهمر بغزارة! 🌧️',
          mascotMood: 'excited',
          visualEmoji: '⛈️',
          visualType: 'umbrella',
          soundEffect: 'click',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'Ten people are getting soaked, but Ollie has the ONLY umbrella in the whole park! ☂️',
          captionAr: 'عشرة أشخاص يبتلون، ولكن أولي يمتلك المظلة الوحيدة في الحديقة بأكملها! ☂️',
          mascotMood: 'explaining',
          visualEmoji: '☂️',
          visualType: 'umbrella',
        },
        {
          sceneId: 3,
          durationSeconds: 7,
          caption: 'That is HIGH DEMAND (everyone wants it) and LOW SUPPLY (only one exists)! 📈',
          captionAr: 'هذا هو الطلب المرتفع (الجميع يريدها) والعرض المنخفض (واحدة فقط متاحة)! 📈',
          mascotMood: 'thinking',
          visualEmoji: '📊',
          visualType: 'chart',
          soundEffect: 'coin',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'When demand skyrockets and supply is tight, value jumps up! People offered 10 PP Tokens for it! 🪙',
          captionAr: 'عندما يرتفع الطلب ويكون المعروض نادراً، تقفز القيمة! عرض الناس 10 عملات للحصول عليها! 🪙',
          mascotMood: 'celebrating',
          visualEmoji: '💰',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'Mastering Supply and Demand is the secret superpower of every great CEO! 🚀',
          captionAr: 'إتقان العرض والطلب هو القوة الخارقة لكل قائد أعمال ناجح! 🚀',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'What usually happens when demand goes WAY up, but supply stays very low?',
      questionAr: 'ماذا يحدث عادة عندما يرتفع الطلب بشكل كبير ويبقى المعروض قليلاً جداً؟',
      options: [
        'The price and value go up',
        'The price drops to zero',
        'People stop caring about it',
        'The item magically duplicates',
      ],
      optionsAr: [
        'يرتفع السعر وتزيد القيمة',
        'يهبط السعر إلى الصفر',
        'يتوقف الناس عن الاهتمام به',
        'يتضاعف الشيء سحرياً',
      ],
      correctIndex: 0,
      explanation: 'High demand with scarce supply creates competition among buyers, driving the price upward!',
      explanationAr: 'الطلب المرتفع مع ندرة المعروض يخلق تنافساً بين المشترين، مما يدفع السعر إلى الارتفاع!',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_barter',
    title: 'The Great Goat Trade: Why Money Was Born',
    titleAr: 'مقايضة الماعز الكبرى: لماذا ولد المال؟',
    description: 'Could you buy a video game console with two noisy goats? Discover the Barter System and why coins changed the world.',
    descriptionAr: 'هل يمكنك شراء جهاز ألعاب بماعزين صاخبتين؟ اكتشف نظام المقايضة ولماذا غيّر المال وجه العالم.',
    category: 'OllieExplains',
    duration: '0:40',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_goat_barter.jpg',
    fullPosterUrl: '/images/videos/clip_goat_barter.jpg',
    keyTerm: 'Barter System',
    keyTermAr: 'نظام المقايضة',
    likesCount: 980,
    viewsCount: 5410,
    tags: ['history', 'money', 'basics'],
    animationConfig: {
      themeColor: 'from-emerald-500 to-teal-700',
      bgGradient: 'bg-gradient-to-b from-teal-950 via-slate-900 to-emerald-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'Before paper bills or debit cards existed, ancient traders used the BARTER SYSTEM! 🐐',
          captionAr: 'قبل وجود العملات الورقية والبطاقات، استخدم القدماء نظام المقايضة! 🐐',
          mascotMood: 'explaining',
          visualEmoji: '🐐',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 8,
          caption: 'Want a warm pair of boots? You had to find a shoemaker who specifically wanted your two chickens! 🐔👟',
          captionAr: 'هل تريد حذاء دافئاً؟ كان عليك أن تجد صانع أحذية يريد دجاجتيك تحديداً! 🐔👟',
          mascotMood: 'thinking',
          visualEmoji: '🐔',
          visualType: 'store',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'It was super noisy, smelly, and complicated. What if the shoemaker was allergic to chickens?! 😱',
          captionAr: 'كان الأمر صاخباً ومعقداً للغاية. ماذا لو كان صانع الأحذية لديه حساسية من الدجاج؟! 😱',
          mascotMood: 'excited',
          visualEmoji: '🤯',
          visualType: 'umbrella',
        },
        {
          sceneId: 4,
          durationSeconds: 9,
          caption: 'So humanity invented MONEY: a universal store of value that EVERYONE agrees to accept! 🪙',
          captionAr: 'لذا اخترع البشر المال: وسيطاً عاماً للقيمة يتفق الجميع على قبوله بحرية! 🪙',
          mascotMood: 'celebrating',
          visualEmoji: '🪙',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 8,
          caption: 'Now you can trade your skills for tokens, and trade tokens for whatever you need! 🎯',
          captionAr: 'الآن يمكنك تبادل مهاراتك مقابل العملات، وشراء ما تحتاجه بكل سهولة! 🎯',
          mascotMood: 'happy',
          visualEmoji: '✨',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'Before modern money, how did ancient communities trade goods?',
      questionAr: 'قبل ظهور المال الحديث، كيف كانت المجتمعات القديمة تتبادل السلع؟',
      options: [
        'By swapping items directly (Barter)',
        'By tapping gold smartphones',
        'By wishing on shooting stars',
        'They never traded anything',
      ],
      optionsAr: [
        'بتبادل السلع والمنتجات مباشرة (المقايضة)',
        'باستخدام الهواتف الذكية الذهبية',
        'بالتمني عند رؤية النجوم',
        'لم يكونوا يتبادلون أي شيء أبداً',
      ],
      correctIndex: 0,
      explanation: 'The Barter system meant directly swapping what you had for what you needed before currency was invented.',
      explanationAr: 'نظام المقايضة كان يعني تبادل ما تملكه مباشرة مقابل ما تحتاجه قبل اختراع العملة.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_saving_investing',
    title: 'The Apple Tree Secret: Saving vs Investing',
    titleAr: 'سر شجرة التفاح: الادخار مقابل الاستثمار',
    description: 'Saving puts apples in a wooden basket. Investing plants the apple seeds to harvest an entire orchard! 🍎🌳',
    descriptionAr: 'الادخار يضع التفاح في السلة، بينما الاستثمار يزرع بذور التفاح لحصاد بستان كامل! 🍎🌳',
    category: 'OllieExplains',
    duration: '0:38',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_apple_investing.jpg',
    fullPosterUrl: '/images/videos/clip_apple_investing.jpg',
    keyTerm: 'Investing',
    keyTermAr: 'الاستثمار',
    likesCount: 2150,
    viewsCount: 11400,
    tags: ['investing', 'growth', 'wealth'],
    animationConfig: {
      themeColor: 'from-green-500 to-emerald-700',
      bgGradient: 'bg-gradient-to-b from-green-950 via-slate-900 to-teal-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'When you earn 10 shiny apples, you have two big choices! 🍎🍎',
          captionAr: 'عندما تكسب 10 تفاحات لامعة، يكون أمامك خياران رئيسيان! 🍎🍎',
          mascotMood: 'happy',
          visualEmoji: '🍎',
          visualType: 'piggybank',
        },
        {
          sceneId: 2,
          durationSeconds: 8,
          caption: 'Choice A is SAVING: Put apples in a secure basket for a rainy day. Safe, but it stays 10 apples. 🧺',
          captionAr: 'الخيار الأول هو الادخار: وضع التفاح في سلة آمنة لوقت الحاجة. آمن ولكنه يبقى 10 تفاحات. 🧺',
          mascotMood: 'explaining',
          visualEmoji: '🧺',
          visualType: 'piggybank',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'Choice B is INVESTING: Take some seeds, plant them in good soil, water them, and be patient! 🌱',
          captionAr: 'الخيار الثاني هو الاستثمار: أخذ بعض البذور وزراعتها في تربة خصبة والصبر عليها! 🌱',
          mascotMood: 'thinking',
          visualEmoji: '🌱',
          visualType: 'chart',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'Over time, those seeds grow into big fruitful trees that produce HUNDREDS of new apples every season! 🌳',
          captionAr: 'مع مرور الوقت، تنمو تلك البذور إلى أشجار مثمرة تنتج مئات التفاحات في كل موسم! 🌳',
          mascotMood: 'celebrating',
          visualEmoji: '🌳',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'Smart tycoons do both: Save enough for safety, and invest seeds to build an empire! 👑',
          captionAr: 'الأذكياء يجمعون بين الاثنين: يدخرون للأمان، ويستثمرون البذور لبناء إمبراطوريتهم! 👑',
          mascotMood: 'happy',
          visualEmoji: '👑',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'What is the main difference between saving and investing?',
      questionAr: 'ما هو الفرق الرئيسي بين الادخار والاستثمار؟',
      options: [
        'Saving protects money; investing puts money to work to grow more value',
        'Saving makes money disappear forever',
        'Investing is only for adults with gray hair',
        'There is no difference between them',
      ],
      optionsAr: [
        'الادخار يحفظ المال، بينما الاستثمار يجعله ينمو وينتج عوائد جديدة',
        'الادخار يجعل المال يختفي تماماً',
        'الاستثمار مخصص فقط لكبار السن ذوي الشعر الأبيض',
        'لا يوجد أي فرق بينهما إطلاقاً',
      ],
      correctIndex: 0,
      explanation: 'Saving protects your capital for short-term needs, while investing allocates resources to generate future returns.',
      explanationAr: 'الادخار يحمي رأس مالك للاحتياجات السريعة، بينما يوجه الاستثمار الموارد لتحقيق نمو وأرباح مستقبلية.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_lemonade_stand',
    title: 'Lemonade Stand Secrets: Cost vs Profit',
    titleAr: 'أسرار كشك الليمون: التكلفة مقابل الربح',
    description: 'Reema made $30 selling cups of lemonade, but she spent $18 on lemons and sugar. Did she make $30 in profit? Let us do the math!',
    descriptionAr: 'باعت ريما عصير ليمون بـ 30 دولاراً، لكنها أنفقت 18 دولاراً على الليمون والسكر. هل ربحت 30 دولاراً؟ هيا نحسبها!',
    category: 'Strategy',
    duration: '0:36',
    aspectRatio: '9:16',
    speaker: 'Reema',
    speakerAvatar: '/images/characters_clean/reema_idle.png',
    thumbnailUrl: '/images/videos/clip_lemonade_stand.jpg',
    fullPosterUrl: '/images/videos/clip_lemonade_stand.jpg',
    keyTerm: 'Profit Margin',
    keyTermAr: 'هامش الربح',
    likesCount: 1670,
    viewsCount: 9200,
    tags: ['entrepreneur', 'math', 'lemonade'],
    animationConfig: {
      themeColor: 'from-yellow-500 to-amber-600',
      bgGradient: 'bg-gradient-to-b from-yellow-950 via-slate-900 to-amber-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'Reema set up the coolest lemonade stand in Neo-Haven! 🍋🧊',
          captionAr: 'أقامت ريما أروع كشك ليمون في المدينة! 🍋🧊',
          mascotMood: 'excited',
          visualEmoji: '🍋',
          visualType: 'lemonade',
        },
        {
          sceneId: 2,
          durationSeconds: 8,
          caption: 'She sold 15 cups for $2 each. Her cash register shows $30! That is her REVENUE. 💵',
          captionAr: 'باعت 15 كوباً بسعر دولارين للكوب. صندوق النقود يحتوي 30 دولاراً! هذا هو الإيراد الإجمالي. 💵',
          mascotMood: 'happy',
          visualEmoji: '💵',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 3,
          durationSeconds: 7,
          caption: 'Wait! She spent $10 on lemons, $5 on sugar, and $3 on cups. Those are COSTS ($18 total)! 🛒',
          captionAr: 'لكن انتظر! لقد اشترت ليموناً بـ 10 دولارات، وسكراً بـ 5، وأكواباً بـ 3. هذه هي التكاليف (18 دولاراً)! 🛒',
          mascotMood: 'thinking',
          visualEmoji: '🛒',
          visualType: 'store',
        },
        {
          sceneId: 4,
          durationSeconds: 7,
          caption: 'Revenue ($30) minus Costs ($18) equals NET PROFIT ($12)! That is the money she keeps! 🎯',
          captionAr: 'الإيرادات (30) مطروحاً منها التكاليف (18) تساوي صافي الربح (12 دولاراً)! هذا هو المال الحقيقي المتبقي لها! 🎯',
          mascotMood: 'celebrating',
          visualEmoji: '💡',
          visualType: 'chart',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'Always calculate your costs before celebrating your revenue, future CEO! 🏆',
          captionAr: 'احسب تكاليفك دائماً قبل أن تحتفل بإيراداتك يا قائد المستقبل! 🏆',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'If you sell $20 worth of cookies, but the ingredients cost $8, what is your true profit?',
      questionAr: 'إذا باعت بسكويتاً بقيمة 20 دولاراً وكانت تكلفة المكونات 8 دولارات، فما هو ربحك الحقيقي؟',
      options: [
        '$12 Profit ($20 Revenue - $8 Costs)',
        '$20 Profit (You keep everything)',
        '$28 Profit (Add them together)',
        '$0 Profit (Making cookies is free)',
      ],
      optionsAr: [
        '12 دولاراً ربح (20 إيراد - 8 تكاليف)',
        '20 دولاراً ربح (تحتفظ بكل شيء)',
        '28 دولاراً ربح (جمعهما معاً)',
        'صفر ربح (صناعة البسكويت مجانية)',
      ],
      correctIndex: 0,
      explanation: 'Profit is always Revenue minus Costs. $20 - $8 = $12.',
      explanationAr: 'الربح دائماً هو الإيرادات ناقص التكاليف: 20 - 8 = 12 دولاراً.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_piggy_bank',
    title: 'Future You is Watching: The Power of Saving',
    titleAr: 'أنت في المستقبل يراقبك: قوة الادخار',
    description: 'Spending every coin on bubblegum today might give you a sugar crash. Putting coins into a savings jar builds a treasure chest for Future You!',
    descriptionAr: 'إنفاق كل قرش على الحلوى اليوم قد يشعرك بالسعادة لحظياً، لكن وضع القطع في حصالتك يصنع كنزاً حقيقياً لمستقبلك!',
    category: 'Shorts',
    duration: '0:32',
    aspectRatio: '9:16',
    speaker: 'Filo',
    speakerAvatar: '/images/characters_clean/filo_idle.png',
    thumbnailUrl: '/images/videos/clip_piggy_bank.jpg',
    fullPosterUrl: '/images/videos/clip_piggy_bank.jpg',
    keyTerm: 'Delayed Gratification',
    keyTermAr: 'تأجيل الرغبات',
    likesCount: 840,
    viewsCount: 4210,
    tags: ['saving', 'habits', 'shorts'],
    animationConfig: {
      themeColor: 'from-pink-500 to-rose-600',
      bgGradient: 'bg-gradient-to-b from-rose-950 via-slate-900 to-purple-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 6,
          caption: 'Meet Future You! They are dreaming of buying a sweet new electric skateboard. 🛹⚡',
          captionAr: 'تعرف على نسختك المستقبلية! إنها تحلم بشراء لوح تزلج كهربائي رائع. 🛹⚡',
          mascotMood: 'excited',
          visualEmoji: '🛹',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'Every time you get allowance or gig money, you have a split-second test. 🪙👀',
          captionAr: 'في كل مرة تحصل فيها على مكافأة أو أجر مهمة، تمر باختبار سريع جداً. 🪙👀',
          mascotMood: 'thinking',
          visualEmoji: '🍬',
          visualType: 'coins',
        },
        {
          sceneId: 3,
          durationSeconds: 7,
          caption: 'Buy 5 sour candies right now, or feed your trusty Piggy Bank for that skateboard? 🐷',
          captionAr: 'هل تشتري 5 قطع حلوى حامضة الآن، أم تطعم حصالتك الذكية لتصل إلى لوح التزلج؟ 🐷',
          mascotMood: 'explaining',
          visualEmoji: '🐷',
          visualType: 'piggybank',
          soundEffect: 'coin',
        },
        {
          sceneId: 4,
          durationSeconds: 6,
          caption: 'Choosing the bigger dream over the quick snack is called Delayed Gratification! 🧠✨',
          captionAr: 'اختيار الهدف الأكبر بدلاً من المكافأة السريعة يسمى تأجيل الرغبات! 🧠✨',
          mascotMood: 'celebrating',
          visualEmoji: '💡',
          visualType: 'chart',
        },
        {
          sceneId: 5,
          durationSeconds: 6,
          caption: 'Your future self will thank you with a high-five and a trophy! 🏆',
          captionAr: 'نسختك المستقبلية ستشكرك وتمنحك كأساً ذهبياً رائعاً! 🏆',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'What is it called when you wait and save for a bigger goal instead of instant candy?',
      questionAr: 'ماذا يسمى انتظارك وادخارك لتحقيق هدف أكبر بدلاً من شراء حلوى فورية؟',
      options: [
        'Delayed Gratification (Self-Discipline)',
        'Accidental Forgetting',
        'Extreme Boredom',
        'Losing your wallet',
      ],
      optionsAr: [
        'تأجيل الرغبات (الانضباط المالي)',
        'النسيان العفوي',
        'الشعور بالملل الشديد',
        'فقدان المحفظة',
      ],
      correctIndex: 0,
      explanation: 'Delayed gratification teaches your brain to prioritize high-value future achievements over temporary impulses.',
      explanationAr: 'تأجيل الرغبات يعود عقلك على تقديم الإنجازات المستقبلية الكبرى على الرغبات اللحظية العابرة.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_needs_wants',
    title: 'Needs vs Wants: The Supermarket Showdown',
    titleAr: 'الاحتياجات مقابل الرغبات: مواجهة المتجر',
    description: 'Water, fruit, and shelter keep you healthy. Video games and shiny stickers are awesome, but which comes first?',
    descriptionAr: 'الماء والفاكهة والمأوى تحافظ على صحتك. الألعاب والملصقات اللامعة ممتعة، ولكن من يأتي أولاً؟',
    category: 'Shorts',
    duration: '0:34',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_needs_wants.jpg',
    fullPosterUrl: '/images/videos/clip_needs_wants.jpg',
    keyTerm: 'Needs vs Wants',
    keyTermAr: 'الاحتياجات والرغبات',
    likesCount: 1120,
    viewsCount: 6300,
    tags: ['budget', 'shopping', 'basics'],
    animationConfig: {
      themeColor: 'from-blue-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'Imagine walking into Mega-Mart with 20 PP Tokens in your pocket. 🛒',
          captionAr: 'تخيل دخولك إلى المتجر الكبير ومعك 20 عملة في جيبك. 🛒',
          mascotMood: 'excited',
          visualEmoji: '🛒',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'NEEDS are things you MUST have to survive and learn: nutritious food, clean water, warm clothes! 🍎💧',
          captionAr: 'الاحتياجات هي الأشياء الضرورية لحياتك وتعليمك: طعام مغذٍ، ماء نقي، وملابس دافئة! 🍎💧',
          mascotMood: 'explaining',
          visualEmoji: '🥗',
          visualType: 'piggybank',
        },
        {
          sceneId: 3,
          durationSeconds: 7,
          caption: 'WANTS are fun extras: cool toy robots, neon sunglasses, and triple fudge ice cream! 🤖🕶️',
          captionAr: 'الرغبات هي كماليات ممتعة: روبوت ألعاب رائع، نظارة شمسية ملونة، وآيس كريم شوكولاتة! 🤖🕶️',
          mascotMood: 'thinking',
          visualEmoji: '🎮',
          visualType: 'umbrella',
        },
        {
          sceneId: 4,
          durationSeconds: 7,
          caption: 'Pro-Rule: Always fund your NEEDS first. Any leftover profit can go to your fun WANTS! ⚖️',
          captionAr: 'قاعدة المحترفين: موّل احتياجاتك الأساسية أولاً، وما تبقى من فائض يمكنك تخصيصه للرغبات! ⚖️',
          mascotMood: 'celebrating',
          visualEmoji: '⚖️',
          visualType: 'chart',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 6,
          caption: 'Balance is everything! You are now budget-certified! 🏅',
          captionAr: 'التوازن هو سر النجاح! لقد أصبحت خبيراً معتمداً في الميزانية! 🏅',
          mascotMood: 'happy',
          visualEmoji: '🏅',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'Which of the following items is a pure NEED?',
      questionAr: 'أي من العناصر التالية يعتبر حاجة أساسية وليست مجرد رغبة؟',
      options: [
        'A warm coat in winter and healthy meals',
        'A limited edition superhero figurine',
        'A 4K virtual reality gaming helmet',
        'Glitter stickers for your binder',
      ],
      optionsAr: [
        'معطف دافئ في الشتاء ووجبات صحية',
        'مجسم بطل خارق بإصدار محدود',
        'خوذة واقع افتراضي بدقة عالية',
        'ملصقات براقة لدفترك',
      ],
      correctIndex: 0,
      explanation: 'Needs are required for health and living safety; everything else is a want.',
      explanationAr: 'الاحتياجات هي الضروريات اللازمة للبقاء والصحة والأمان، وكل ما عدا ذلك رغبات.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_interest',
    title: 'Planting Dollar Seeds: How Interest Works',
    titleAr: 'غرس بذور النقود: كيف تعمل الفائدة البنكية؟',
    description: 'What if putting $10 in a vault made it grow into $11 without you doing anything? Welcome to compound growth!',
    descriptionAr: 'ماذا لو كان وضع 10 دولارات في الخزنة يجعلها تنمو لتصبح 11 دون أي مجهود إضافي منك؟ مرحباً بك في النمو المركب!',
    category: 'OllieExplains',
    duration: '0:36',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_dollar_seeds.jpg',
    fullPosterUrl: '/images/videos/clip_dollar_seeds.jpg',
    keyTerm: 'Interest Rate',
    keyTermAr: 'سعر الفائدة',
    likesCount: 1890,
    viewsCount: 9780,
    tags: ['banking', 'interest', 'growth'],
    animationConfig: {
      themeColor: 'from-purple-500 to-indigo-700',
      bgGradient: 'bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'When you keep money under your bed, dust bunnies sleep on it. It never grows! 🛌💤',
          captionAr: 'عندما تخبئ نقودك تحت سريرك، يتراكم عليها الغبار فقط دون أن تزيد قرشاً واحداً! 🛌💤',
          mascotMood: 'explaining',
          visualEmoji: '🛌',
          visualType: 'piggybank',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'When you deposit money in a reputable bank, they use it to help businesses build and expand. 🏦🏗️',
          captionAr: 'عندما تودع أموالك في بنك موثوق، يستخدمها البنك لدعم المشاريع والشركات للنمو والتوسع. 🏦🏗️',
          mascotMood: 'thinking',
          visualEmoji: '🏦',
          visualType: 'store',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'As a thank you, the bank pays YOU extra money called INTEREST! 💰🌱',
          captionAr: 'وتقديراً لثقتك، يدفع لك البنك مبالغ إضافية مكافأة تسمى الفائدة التراكمية! 💰🌱',
          mascotMood: 'excited',
          visualEmoji: '🌱',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 4,
          durationSeconds: 7,
          caption: 'Next year, your interest earns even MORE interest! That is compound magic at work! 🪄📈',
          captionAr: 'وفي العام التالي، تنتج تلك الأرباح أرباحاً إضافية جديدة! هذا هو سحر التراكم المالي! 🪄📈',
          mascotMood: 'celebrating',
          visualEmoji: '📈',
          visualType: 'chart',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'Time + Patience = Your financial forest! Start early and watch it thrive! 🌲✨',
          captionAr: 'الوقت + الصبر = غابتك المالية المزدهرة! ابدأ مبكراً وشاهدها تنمو! 🌲✨',
          mascotMood: 'happy',
          visualEmoji: '🌲',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'Why does a savings account pay you interest?',
      questionAr: 'لماذا يدفع لك حساب التوفير البنكي عائداً إضافياً (فائدة)؟',
      options: [
        'As a reward for leaving your money safely in the bank',
        'Because the bank accidentally printed too many dollars',
        'To trick you into eating more vegetables',
        'Only if you visit the bank every single morning',
      ],
      optionsAr: [
        'كمكافأة على إيداع أموالك بأمان لدى البنك',
        'لأن البنك طبع نقوداً بالخطأ ويريد التخلص منها',
        'لتشجيعك على تناول المزيد من الخضروات',
        'فقط إذا قمت بزيارة الفرع صباح كل يوم',
      ],
      correctIndex: 0,
      explanation: 'Banks compensate depositors with interest for allowing them to utilize their capital to support economic lending.',
      explanationAr: 'البنوك تكافئ المودعين بنسبة فائدة لأنها تستخدم هذه الودائع في تقديم قروض وتمويلات للمشاريع.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_ollie_business_moat',
    title: 'The Castle Fortress: Building a Business Moat',
    titleAr: 'قلعة الأعمال: كيف تبني خندقاً تنافسياً لا يقهر؟',
    description: 'Medieval castles had deep water moats to stop invaders. What protects your business from copycats? Discover competitive moats!',
    descriptionAr: 'كانت القلاع القديمة تحاط بخندق مائي عميق لصد الغزاة. كيف تحمي فكرة مشروعك من التقليد؟ اكتشف الخندق التنافسي الذكي!',
    category: 'OllieExplains',
    duration: '0:38',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_business_moat.jpg',
    fullPosterUrl: '/images/videos/clip_business_moat.jpg',
    keyTerm: 'Competitive Moat',
    keyTermAr: 'الخندق التنافسي',
    likesCount: 2140,
    viewsCount: 11200,
    tags: ['strategy', 'competition', 'moat'],
    animationConfig: {
      themeColor: 'from-amber-600 to-yellow-600',
      bgGradient: 'bg-gradient-to-b from-amber-950 via-slate-900 to-indigo-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'When your lemonade stand makes big profits, other kids will open their own stands next door! 🏰🍋',
          captionAr: 'عندما يحقق كشك الليمون الخاص بك أرباحاً طائلة، سيفتح أصدقاؤك أكشاكاً مجاورة لتقليدك! 🏰🍋',
          mascotMood: 'explaining',
          visualEmoji: '🏰',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'How do you keep your customers coming back? You need an economic MOAT! 🛡️🌊',
          captionAr: 'كيف تضمن بقاء الزبائن مخلصين لك دائماً؟ تحتاج إلى بناء خندق تنافسي متين! 🛡️🌊',
          mascotMood: 'thinking',
          visualEmoji: '🛡️',
          visualType: 'umbrella',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'A moat can be a secret family recipe, ultra-fast delivery, or an unforgettable brand! 🥤✨',
          captionAr: 'الخندق قد يكون وصفة سرية لذيذة، أو خدمة فائقة السرعة، أو علامة تجارية لا تنسى! 🥤✨',
          mascotMood: 'excited',
          visualEmoji: '⭐',
          visualType: 'trophy',
          soundEffect: 'coin',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'Warren Buffett calls this a "Durable Competitive Advantage". It protects your castle forever! 👑💼',
          captionAr: 'يسمي وارن بافيت هذا المبدأ: "الميزة التنافسية المستدامة". إنها تحمي قلعتك المالية للأبد! 👑💼',
          mascotMood: 'celebrating',
          visualEmoji: '👑',
          visualType: 'chart',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 8,
          caption: 'Build something unique that no competitor can easily copy, and you will reign supreme! 🏆🌟',
          captionAr: 'اصنع شيئاً فريداً ومميزاً يعجز المنافسون عن نسخه بسهولة، وستظل دائماً في القمة! 🏆🌟',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'In business, what is a "Competitive Moat"?',
      questionAr: 'ما هو "الخندق التنافسي" (Economic Moat) في عالم الأعمال؟',
      options: [
        'A unique advantage that prevents rivals from stealing your customers',
        'A ditch full of water dug around the store cash register',
        'Selling identical products at twice the market price',
        'Refusing to speak with customers when they arrive',
      ],
      optionsAr: [
        'ميزة فريدة وحصرية تحمي مشروعك وتمنع المنافسين من الاستيلاء على عملائك',
        'حفرة ماء حقيقية حول ماكينة المحاسبة في المتجر',
        'بيع نفس المنتج تماماً بضعف السعر دون أي قيمة مضافة',
        'رفض التحدث مع الزبائن فور وصولهم',
      ],
      correctIndex: 0,
      explanation: 'A competitive moat creates a defensive barrier protecting profits and loyal market share from competitors.',
      explanationAr: 'الخندق التنافسي يشكل درعاً دفاعياً استراتيجياً يحافظ على أرباحك وولاء زبائنك أمام أي منافسة.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_challenge_ollie_bank',
    title: 'DIY Ollie Piggy Bank: Action Challenge!',
    titleAr: 'اصنع حصالة أولي بنفسك: تحدي العمل الحقيقي!',
    description: 'Turn an empty cardboard box or plastic bottle into an official ProfitsPatrol Ollie Piggy Bank! Upload your photo proof to earn tokens.',
    descriptionAr: 'حول صندوق كرتوني فارغ أو زجاجة بلاستيكية إلى حصالة أولي الرسمية! ارفع صورتك لتحصل على العملات والشارة.',
    category: 'Challenge',
    duration: '0:45',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_piggy_bank.jpg',
    fullPosterUrl: '/images/videos/clip_piggy_bank.jpg',
    keyTerm: 'Real-World Action',
    keyTermAr: 'تطبيق عملي',
    likesCount: 3120,
    viewsCount: 15400,
    tags: ['craft', 'challenge', 'piggybank'],
    animationConfig: {
      themeColor: 'from-amber-500 to-yellow-600',
      bgGradient: 'bg-gradient-to-b from-amber-950 via-slate-900 to-yellow-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 8,
          caption: 'Ready for a real-world mission? You are going to build your very own Ollie Piggy Bank! ✂️🎨',
          captionAr: 'هل أنت مستعد لمهمة واقعية؟ ستقوم اليوم بصناعة حصالة أولي بنفسك! ✂️🎨',
          mascotMood: 'excited',
          visualEmoji: '✂️',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 9,
          caption: 'Step 1: Grab a clean box, bottle, or jar. Cut a careful coin slot on top with a parent! 📦',
          captionAr: 'الخطوة 1: أحضر صندوقاً أو برطماناً نظيفاً، واصنع فتحة للمعدن بمساعدة والديك! 📦',
          mascotMood: 'explaining',
          visualEmoji: '📦',
          visualType: 'umbrella',
        },
        {
          sceneId: 3,
          durationSeconds: 10,
          caption: 'Step 2: Paint it bright Ollie blue and yellow! Draw friendly owl eyes and wings! 🦉🖌️',
          captionAr: 'الخطوة 2: لونه بالأزرق والأصفر مثل أولي! ارسم عيون البومة اللطيفة والأجنحة! 🦉🖌️',
          mascotMood: 'happy',
          visualEmoji: '🎨',
          visualType: 'piggybank',
        },
        {
          sceneId: 4,
          durationSeconds: 9,
          caption: 'Step 3: Drop your first coin inside, snap a photo, and hit Submit Challenge below! 📸🪙',
          captionAr: 'الخطوة 3: ضع أول عملة بداخلها، التقط صورة، واضغط على زر تسليم التحدي في الأسفل! 📸🪙',
          mascotMood: 'celebrating',
          visualEmoji: '📸',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 9,
          caption: 'Win 50 XP, 30 PP Tokens, and unlock the exclusive Master Crafter badge! Let us roll! 🚀',
          captionAr: 'اربح 50 نقطة خبرة و30 عملة وافتح شارة الصانع الماهر الحصرية! انطلق الآن! 🚀',
          mascotMood: 'excited',
          visualEmoji: '🎖️',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    challenge: {
      id: 'ch_ollie_bank',
      title: 'Craft Your Ollie Bank',
      titleAr: 'اصنع حصالة أولي الخاصة بك',
      description: 'Build a physical piggy bank from recycled materials, style it like Ollie, and deposit your first savings coin!',
      descriptionAr: 'اصنع حصالة حقيقية من مواد معاد تدويرها، وزينها بطابع أولي، وأودع فيها أول قطعة نقدية!',
      instructions: [
        'Find a clean recyclable jar, can, or cardboard box',
        'Cut a secure coin slot on top (ask an adult for assistance)',
        'Decorate it with owl eyes, colors, and the ProfitsPatrol emblem',
        'Take a photo of your finished bank and upload it for verification',
      ],
      instructionsAr: [
        'ابحث عن برطمان أو علبة كرتونية نظيفة صالحة لإعادة التدوير',
        'اصنع فتحة للقطع النقدية في الأعلى (بمساعدة شخص بالغ)',
        'زينها برسم عيني أولي وألوان الدورية المميزة',
        'التقط صورة لحصالتك المكتملة وارفعها هنا للتحقق والاعتماد',
      ],
      rewardXp: 50,
      rewardTokens: 30,
      badgeReward: 'Master Crafter',
      proofType: 'photo',
    },
  },
  {
    id: 'vid_challenge_lemonade',
    title: 'The Real-World Lemonade Boss Challenge!',
    titleAr: 'تحدي كشك الليمون الواقعي: انطلاقة القائد!',
    description: 'Mix real lemonade or make homemade cookies, set up a tabletop stand, and make your first real sales to friends or family!',
    descriptionAr: 'اصنع عصير ليمون حقيقي أو بسكويت منزلي، وأنشئ كشكاً صغيراً وحقق مبيعاتك الأولى لأصدقائك أو عائلتك!',
    category: 'Challenge',
    duration: '0:42',
    aspectRatio: '9:16',
    speaker: 'Reema',
    speakerAvatar: '/images/characters_clean/reema_idle.png',
    thumbnailUrl: '/images/videos/clip_lemonade_stand.jpg',
    fullPosterUrl: '/images/videos/clip_lemonade_stand.jpg',
    keyTerm: 'Hands-on Business',
    keyTermAr: 'مشروع تطبيقي',
    likesCount: 2780,
    viewsCount: 13900,
    tags: ['sales', 'realworld', 'challenge'],
    animationConfig: {
      themeColor: 'from-amber-400 to-orange-500',
      bgGradient: 'bg-gradient-to-b from-amber-950 via-slate-900 to-orange-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 8,
          caption: 'Ready to graduate from simulation to the real sidewalk? Time for the Lemonade Challenge! 🍋',
          captionAr: 'هل أنت مستعد للانتقال من المحاكاة إلى أرض الواقع؟ حان وقت تحدي كشك الليمون! 🍋',
          mascotMood: 'excited',
          visualEmoji: '🍋',
          visualType: 'lemonade',
        },
        {
          sceneId: 2,
          durationSeconds: 9,
          caption: 'Write down every single ingredient cost with your parents so you know your break-even point. 📝',
          captionAr: 'سجل تكلفة كل مكون مع والديك حتى تعرف نقطة التعادل بدقة. 📝',
          mascotMood: 'explaining',
          visualEmoji: '📝',
          visualType: 'chart',
        },
        {
          sceneId: 3,
          durationSeconds: 9,
          caption: 'Design a catchy colorful sign! Smiling service and ice-cold cups will bring in loyal customers! 😊🧊',
          captionAr: 'صمم لافتة جذابة وملونة! الابتسامة اللطيفة والخدمة الجيدة ستجذب لك الزبائن! 😊🧊',
          mascotMood: 'happy',
          visualEmoji: '🪧',
          visualType: 'store',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'Serve at least 3 thirsty customers, snap your setup photo, and claim your rewards! 📸💰',
          captionAr: 'قم ببيع العصير لـ 3 زبائن على الأقل، التقط صورة لكشكك، واطلب جائزتك! 📸💰',
          mascotMood: 'celebrating',
          visualEmoji: '💰',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 8,
          caption: 'Real entrepreneurs learn by doing. Go make those first profits! 🚀',
          captionAr: 'رواد الأعمال الحقيقيون يتعلمون بالممارسة. انطلق واصنع أرباحك الأولى! 🚀',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    challenge: {
      id: 'ch_lemonade_stand',
      title: 'Run a Real Drink or Snack Stand',
      titleAr: 'إدارة كشك مشروبات أو وجبات خفيفة حقيقي',
      description: 'Set up a small weekend stand or family booth, calculate your costs, and complete at least 3 customer transactions!',
      descriptionAr: 'أقم كشكاً عائلياً صغيراً في نهاية الأسبوع، واحسب تكاليفك، وأتمم 3 مبيعات على الأقل!',
      instructions: [
        'Calculate ingredient costs with parent supervision',
        'Create a colorful handwritten pricing poster',
        'Sell 3 or more cups to neighbors, friends, or family members',
        'Upload a picture of your booth or happy customers!',
      ],
      instructionsAr: [
        'احسب تكاليف المكونات بإشراف أحد الوالدين',
        'اصنع ملصق أسعار مكتوباً بخط يدوي جميل وملون',
        'قم ببيع 3 أكواب على الأقل للجيران أو الأصدقاء أو أفراد الأسرة',
        'ارفع صورة لكشكك أو للزبائن السعداء!',
      ],
      rewardXp: 75,
      rewardTokens: 45,
      badgeReward: 'Sidewalk Titan',
      proofType: 'photo',
    },
  },
  {
    id: 'vid_parent_allowance',
    title: 'Smart Allowance Systems: Work vs Gifts',
    titleAr: 'نظام المصروف الذكي: بين الاستحقاق والعمل',
    description: 'Parent Guide: Discover how structuring allowances into Learn, Earn, and Save buckets creates lifelong financial confidence.',
    descriptionAr: 'دليل أولياء الأمور: كيف يساعد تقسيم المصروف إلى تعلم، وكسب، وادخار في بناء ثقة مالية تدوم مدى الحياة.',
    category: 'Parent',
    duration: '0:48',
    aspectRatio: '9:16',
    speaker: 'Parent Guide',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_allowance_system.jpg',
    fullPosterUrl: '/images/videos/clip_allowance_system.jpg',
    keyTerm: 'Parenting Strategy',
    keyTermAr: 'توجيه أسري',
    likesCount: 940,
    viewsCount: 3890,
    tags: ['parenting', 'allowance', 'guide'],
    animationConfig: {
      themeColor: 'from-blue-600 to-cyan-600',
      bgGradient: 'bg-gradient-to-b from-blue-950 via-slate-900 to-cyan-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 9,
          caption: 'Handing out flat allowances without effort can accidentally teach that money arrives automatically. 💸',
          captionAr: 'منح المصروف المالي دون أي ارتباط بالمسؤولية قد يغرس فكرة خاطئة بأن المال يأتي تلقائياً. 💸',
          mascotMood: 'explaining',
          visualEmoji: '💭',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 10,
          caption: 'Instead, use the ProfitsPatrol 3-Bucket System: Basics (household teamwork), Gigs (extra earning), and Learning! ⚖️',
          captionAr: 'بدلاً من ذلك، طبق نظام الصناديق الثلاثة: واجبات التعاون الأسري، مهام الكسب الإضافية، والتعلم! ⚖️',
          mascotMood: 'thinking',
          visualEmoji: '⚖️',
          visualType: 'chart',
        },
        {
          sceneId: 3,
          durationSeconds: 10,
          caption: 'When kids see that extra effort or completing education modules unlocks PP Tokens, motivation skyrockets! 🚀',
          captionAr: 'عندما يرى الأبناء أن المجهود الإضافي وإتمام الوحدات التعليمية يمنحهم مكافآت حقيقية، يتضاعف الحماس! 🚀',
          mascotMood: 'excited',
          visualEmoji: '🌟',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 4,
          durationSeconds: 10,
          caption: 'Allow them to make small buying mistakes with their own tokens now, so they avoid huge debt mistakes as adults! 🛡️',
          captionAr: 'دعوهم يرتكبون أخطاء إنفاق صغيرة بعملاتهم الافتراضية الآن، ليتجنبوا ديوناً وأخطاء باهظة في الكبر! 🛡️',
          mascotMood: 'happy',
          visualEmoji: '🛡️',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'What is the greatest benefit of a task-and-learning aligned allowance system?',
      questionAr: 'ما هي الفائدة الأكبر لنظام مصروف مرتبط بالمهام والتعلم؟',
      options: [
        'It teaches that income is earned through value creation and discipline',
        'It makes children work 16 hours a day',
        'It eliminates all need for school homework',
        'It prevents kids from ever asking for food',
      ],
      optionsAr: [
        'يعلم أن الدخل يُكتسب من خلال تقديم القيمة والانضباط',
        'يجعل الأطفال يعملون لساعات شاقة',
        'يلغي الحاجة إلى الواجبات المدرسية تماماً',
        'يمنع الأطفال من طلب الطعام',
      ],
      correctIndex: 0,
      explanation: 'Tying rewards to effort and learning anchors self-reliance and teaches kids the true origin of capital.',
      explanationAr: 'ربط المكافآت بالجهد والتعلم يرسخ الاعتماد على النفس ويعلم الأطفال المفهوم الحقيقي لإنتاج القيمة.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_1',
    title: 'How Money Works: From Coins to Cards',
    titleAr: 'كيف يعمل المال: من العملات إلى البطاقات',
    description: 'A fun animation explaining the basics of currency and value across history.',
    descriptionAr: 'رسوم متحركة ممتعة تشرح أساسيات العملة والقيمة عبر التاريخ.',
    youtubeId: 'p7HKvqRI_Bo',
    category: 'Finance',
    duration: '0:37',
    aspectRatio: '9:16',
    speaker: 'Ollie',
    speakerAvatar: '/images/characters_clean/ollie_idle.png',
    thumbnailUrl: '/images/videos/clip_money_evolution.jpg',
    fullPosterUrl: '/images/videos/clip_money_evolution.jpg',
    keyTerm: 'Evolution of Money',
    keyTermAr: 'تطور النقود',
    tags: ['money', 'history', 'finance'],
    likesCount: 1200,
    viewsCount: 6500,
    animationConfig: {
      themeColor: 'from-blue-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'Did you know that long ago, ancient traders used seashells and salt bags as money? 🐚🧂',
          captionAr: 'هل تعلم أنه قديماً، استخدم التجار الأصداف وأكياس الملح كعملة للتبادل؟ 🐚🧂',
          mascotMood: 'explaining',
          visualEmoji: '🐚',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'Carrying 50 heavy gold coins in pockets was exhausting and risky for travelers! 🪙',
          captionAr: 'كان حمل 50 قطعة نقدية ذهبية ثقيلة في الجيوب أمراً شاقاً ومحفوفاً بالمخاطر! 🪙',
          mascotMood: 'thinking',
          visualEmoji: '🪙',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'So paper banknotes were born, and later, smart plastic cards with encrypted chips! 💳',
          captionAr: 'لذا وُلدت العملات الورقية، ثم البطاقات البلاستيكية الذكية المزودة بشرائح إلكترونية! 💳',
          mascotMood: 'excited',
          visualEmoji: '💳',
          visualType: 'chart',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'Today, contactless tap-to-pay and digital tokens transfer value globally in milliseconds! ⚡',
          captionAr: 'واليوم، الدفع باللمس والعملات الرقمية تنقل القيمة حول العالم في جزء من الثانية! ⚡',
          mascotMood: 'celebrating',
          visualEmoji: '⚡',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'Money is a tool of trust. The real value is what you create and invest with it! 🏆',
          captionAr: 'المال وسيلة ثقة وتبادل، والقيمة الحقيقية تكمن فيما تبنيه وتستثمره به! 🏆',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'What is the fancy name for official paper and coin money issued by governments?',
      questionAr: 'ما هو الاسم الرسمي للقطع النقدية والأوراق المالية المعتمدة؟',
      options: ['Currency', 'Toy Tokens', 'Treasure Rocks', 'Plastic Gold'],
      optionsAr: ['العملة (Currency)', 'رموز الألعاب', 'صخور الكنز', 'الذهب البلاستيكي'],
      correctIndex: 0,
      explanation: 'Currency is the legal system of money in common use within a country.',
      explanationAr: 'العملة هي النظام القانوني للنقود المتداول والمعترف به في الدولة.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_2',
    title: 'Think Like a CEO: Mindset of Champions',
    titleAr: 'فكر كمدير تنفيذي: عقلية الأبطال',
    description: 'Understand the mindset of successful entrepreneurs and how they solve tough problems.',
    descriptionAr: 'فهم عقلية رواد الأعمال الناجحين وكيف يحلون المشكلات المعقدة.',
    youtubeId: 'F2i09t-5c7s',
    category: 'Mindset',
    duration: '0:38',
    aspectRatio: '9:16',
    speaker: 'Filo',
    speakerAvatar: '/images/characters_clean/filo_idle.png',
    thumbnailUrl: '/images/videos/clip_ceo_mindset.jpg',
    fullPosterUrl: '/images/videos/clip_ceo_mindset.jpg',
    keyTerm: 'Growth Mindset',
    keyTermAr: 'عقلية النمو',
    tags: ['leadership', 'mindset', 'ceo'],
    likesCount: 890,
    viewsCount: 4300,
    animationConfig: {
      themeColor: 'from-purple-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'When others complain about a problem, a CEO asks: "How can I invent the solution?" 💡',
          captionAr: 'عندما يتذمر الناس من مشكلة، يسأل المدير التنفيذي: "كيف أبتكر الحل وأصنع منه فرصة؟" 💡',
          mascotMood: 'explaining',
          visualEmoji: '💡',
          visualType: 'store',
        },
        {
          sceneId: 2,
          durationSeconds: 8,
          caption: 'Rule #1: Mistakes are NOT failures — they are free data lessons to level up your product! 📊',
          captionAr: 'القاعدة الأولى: الأخطاء ليست فشلاً، بل دروس مجانية لتطوير منتجك وخدماتك! 📊',
          mascotMood: 'thinking',
          visualEmoji: '📈',
          visualType: 'chart',
          soundEffect: 'click',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'Rule #2: Empower your team! Filo codes, Reema markets, and Ollie finances the dream! 🤝',
          captionAr: 'القاعدة الثانية: قوة الفريق! فيلو يبرمج، ريما تسوق، وأولي يدير الاستثمار والمال! 🤝',
          mascotMood: 'excited',
          visualEmoji: '👥',
          visualType: 'piggybank',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'Rule #3: Stay obsessed with delivering real value to your customers every day! 🎯',
          captionAr: 'القاعدة الثالثة: ركز كل اهتمامك على إسعاد عملائك وتقديم قيمة حقيقية يومياً! 🎯',
          mascotMood: 'celebrating',
          visualEmoji: '⭐',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'Train your CEO mindset every day in ProfitsPatrol, and lead your future empire! 👑',
          captionAr: 'درب عقليتك القيادية في ProfitsPatrol، وقُد إمبراطوريتك المستقبلية بثقة! 👑',
          mascotMood: 'happy',
          visualEmoji: '👑',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'What is a core trait of a successful business leader when facing an unexpected problem?',
      questionAr: 'ما هي السمة الأساسية لقائد الأعمال الناجح عند مواجهة مشكلة غير متوقعة؟',
      options: [
        'Viewing problems as opportunities to create creative solutions',
        'Giving up immediately and closing the company',
        'Blaming everyone else without investigating',
        'Ignoring the issue until it gets worse',
      ],
      optionsAr: [
        'النظر إلى المشكلات كفرص لابتكار حلول جديدة',
        'الاستسلام فوراً وإغلاق الشركة',
        'إلقاء اللوم على الآخرين دون بحث',
        'تجاهل المشكلة حتى تتفاقم',
      ],
      correctIndex: 0,
      explanation: 'Great leaders are adaptable problem-solvers who transform setbacks into stepping stones.',
      explanationAr: 'القادة الاستثنائيون يمتلكون مرونة لتحويل العقبات إلى فرص نجاح وابتكار.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    id: 'vid_3',
    title: 'Lemonade Stand Strategy: Scale Your Sales',
    titleAr: 'استراتيجية كشك الليمون: مضاعفة المبيعات',
    description: 'Pro tips to maximize profits, choose optimal locations, and upgrade your equipment.',
    descriptionAr: 'نصائح احترافية لزيادة الأرباح واختيار أفضل المواقع وتطوير المعدات.',
    youtubeId: 'M576WBa9ja0',
    category: 'Strategy',
    duration: '0:37',
    aspectRatio: '9:16',
    speaker: 'Reema',
    speakerAvatar: '/images/characters_clean/reema_idle.png',
    thumbnailUrl: '/images/videos/clip_lemonade_strategy.jpg',
    fullPosterUrl: '/images/videos/clip_lemonade_strategy.jpg',
    keyTerm: 'Scaling & Upselling',
    keyTermAr: 'التوسع والمبيعات التكميلية',
    tags: ['gameplay', 'strategy', 'sales'],
    likesCount: 760,
    viewsCount: 3800,
    animationConfig: {
      themeColor: 'from-yellow-400 to-amber-600',
      bgGradient: 'bg-gradient-to-b from-yellow-950 via-slate-900 to-amber-950',
      scenes: [
        {
          sceneId: 1,
          durationSeconds: 7,
          caption: 'Setting up a lemonade stand is fun, but how do you turn $5 into a $100 empire? 🍋🧊',
          captionAr: 'إقامة كشك عصير ليمون أمر ممتع، لكن كيف تحول 5 دولارات إلى مشروع بمئة دولار؟ 🍋🧊',
          mascotMood: 'excited',
          visualEmoji: '🍋',
          visualType: 'lemonade',
        },
        {
          sceneId: 2,
          durationSeconds: 7,
          caption: 'Secret 1: LOCATION! Pitch your stand near the sunny playground exit where runners are thirsty! 🏃‍♂️☀️',
          captionAr: 'السر الأول: الموقع! ضع كشكك قرب بوابة الملعب المشمسة حيث يشعر الرياضيون بالعطش! 🏃‍♂️☀️',
          mascotMood: 'explaining',
          visualEmoji: '📍',
          visualType: 'store',
          soundEffect: 'click',
        },
        {
          sceneId: 3,
          durationSeconds: 8,
          caption: 'Secret 2: UPSELL & BUNDLE! Offer fresh mint or crunchy cookies for just $1 extra! 🍪',
          captionAr: 'السر الثاني: المبيعات الإضافية! اعرض نعناعاً طازجاً أو كعكة مقرمشة بدولار إضافي فقط! 🍪',
          mascotMood: 'thinking',
          visualEmoji: '🍪',
          visualType: 'chart',
        },
        {
          sceneId: 4,
          durationSeconds: 8,
          caption: 'Secret 3: REINVEST! Buy an electric juicer with your first profit to squeeze 5x faster! ⚡',
          captionAr: 'السر الثالث: إعادة الاستثمار! اشترِ عصارة كهربائية من أرباحك الأولى لإنتاج أسرع 5 مرات! ⚡',
          mascotMood: 'celebrating',
          visualEmoji: '⚡',
          visualType: 'coins',
          soundEffect: 'coin',
        },
        {
          sceneId: 5,
          durationSeconds: 7,
          caption: 'That is how small startups grow into massive retail brands! Go crush it! 🏆',
          captionAr: 'هكذا تكبر المشاريع الناشئة لتصبح علامات تجارية كبرى! انطلق وحقق طموحك! 🏆',
          mascotMood: 'happy',
          visualEmoji: '🏆',
          visualType: 'trophy',
          soundEffect: 'success',
        },
      ],
    },
    quiz: {
      question: 'Where is the most profitable spot to place a hot summer drink booth?',
      questionAr: 'أين أنسب وأربح مكان لإقامة كشك مشروبات باردة في الصيف؟',
      options: [
        'Near a sunny park or busy community sports field',
        'Hidden deep inside an empty dark alley',
        'In the middle of a frozen ice rink in winter',
        'Inside an empty garage with the door closed',
      ],
      optionsAr: [
        'بالقرب من حديقة مشمسة أو ملاعب رياضية مزدحمة',
        'في زقاق مهجور ومظلم',
        'وسط حلبة تزلج متجمدة في الشتاء',
        'داخل مرآب فارغ والباب مغلق',
      ],
      correctIndex: 0,
      explanation: 'Foot traffic and sunny warm weather create high immediate demand for cold refreshments.',
      explanationAr: 'كثافة المارة والجو المشمس يخلقان طلباً فورياً كبيراً على المشروبات المنعشة.',
      xpReward: 20,
      tokenReward: 15,
    },
  },
  {
    "id": "vid_inflation_icecream",
    "title": "The Melting Ice Cream: What is Inflation?",
    "titleAr": "الآيس كريم الذائب: ما هو التضخم؟",
    "description": "Why did an ice cream cone cost $1 twenty years ago, but costs $3 today? Learn how inflation works and how to protect your money.",
    "descriptionAr": "لماذا كانت كرة الآيس كريم بدولار واحد قبل عشرين عاماً، بينما تكلف 3 دولارات اليوم؟ تعرف على سر التضخم وكيف تحمي أموالك.",
    "category": "Shorts",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Inflation",
    "keyTermAr": "التضخم",
    "likesCount": 1840,
    "viewsCount": 9200,
    "tags": [
      "economics",
      "inflation",
      "money"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-red-600",
      "bgGradient": "bg-gradient-to-b from-slate-900 via-amber-950 to-red-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine your grandparents bought a giant ice cream for just 1 dollar! 🍦",
          "captionAr": "تخيل أن أجدادك كانوا يشترون مثلجات عملاقة بدولار واحد فقط! 🍦",
          "mascotMood": "explaining",
          "visualEmoji": "🍦",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Today, that exact same ice cream costs 3 dollars! Did the ice cream get bigger? Nope! 📈",
          "captionAr": "اليوم، تكلف المثلجات نفسها 3 دولارات! هل كبر حجمها؟ كلا على الإطلاق! 📈",
          "mascotMood": "thinking",
          "visualEmoji": "📊",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That is INFLATION: when goods become more expensive over time as money loses purchasing power! 💸",
          "captionAr": "هذا هو التضخم: عندما تصبح السلع أغلى بمرور الوقت وتقل القوة الشرائية للنقود! 💸",
          "mascotMood": "explaining",
          "visualEmoji": "💸",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Keeping cash under your bed makes it melt like ice cream! Investing helps it grow faster than inflation! 🚀",
          "captionAr": "ترك المال تحت الوسادة يجعله يذوب كالآيس كريم! الاستثمار الذكي يساعده على النمو أسرع من التضخم! 🚀",
          "mascotMood": "celebrating",
          "visualEmoji": "🌱",
          "visualType": "stocks",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is inflation?",
      "questionAr": "ما هو التضخم المالي؟",
      "options": [
        "Prices of goods rising generally over time",
        "Money magically turning into gold",
        "Stores giving away free products",
        "Ice cream melting on a hot afternoon"
      ],
      "optionsAr": [
        "ارتفاع الأسعار بشكل عام بمرور الوقت",
        "تحول المال سحرياً إلى ذهب",
        "توزيع المتاجر لمنتجاتها مجاناً",
        "ذوبان المثلجات في يوم صيفي حار"
      ],
      "correctIndex": 0,
      "explanation": "Inflation means prices increase across the economy, reducing what one dollar can purchase.",
      "explanationAr": "التضخم يعني زيادة الأسعار مع الوقت، مما يقلل ما يمكنك شراؤه بنفس المبلغ من المال.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_opportunity_cost",
    "title": "The Two Ticket Dilemma: Opportunity Cost",
    "titleAr": "معضلة التذكرتين: تكلفة الفرصة البديلة",
    "description": "You have only one Friday evening: Theme park or video game tournament? Choosing one means giving up the other. That is Opportunity Cost!",
    "descriptionAr": "لديك مساء جمعة واحد فقط: مدينة الملاهي أم بطولة ألعاب الفيديو؟ اختيار أحدهما يعني التخلي عن الآخر. هذه هي تكلفة الفرصة البديلة!",
    "category": "OllieExplains",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_needs_wants.jpg",
    "fullPosterUrl": "/images/videos/clip_needs_wants.jpg",
    "keyTerm": "Opportunity Cost",
    "keyTermAr": "تكلفة الفرصة البديلة",
    "likesCount": 1520,
    "viewsCount": 7800,
    "tags": [
      "decisions",
      "economics",
      "mindset"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-700",
      "bgGradient": "bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Every time you choose to spend time or money on one thing, you say NO to another! ⚖️",
          "captionAr": "في كل مرة تختار إنفاق وقتك أو مالك على شيء، فأنت تقول \"لا\" لشيء آخر تلقائياً! ⚖️",
          "mascotMood": "explaining",
          "visualEmoji": "⚖️",
          "visualType": "chart",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "If you buy a shiny toy car with your $10, you can NOT buy that science kit you wanted! 🚗",
          "captionAr": "إذا اشتريت سيارة ألعاب بـ 10 دولارات، فلن تتمكن من شراء مجموعة العلوم التي كنت تحلم بها! 🚗",
          "mascotMood": "thinking",
          "visualEmoji": "🚗",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "The value of the NEXT BEST THING you gave up is called OPPORTUNITY COST! 💡",
          "captionAr": "قيمة أفضل خيار بديل تنازلت عنه تسمى \"تكلفة الفرصة البديلة\"! 💡",
          "mascotMood": "celebrating",
          "visualEmoji": "💡",
          "visualType": "trophy",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Great leaders always ask: \"Is this the absolute BEST use of my time and resources right now?\" 🚀",
          "captionAr": "يسأل القادة الناجحون دائماً: \"هل هذا هو أفضل استخدام ممكن لوقتي ومواردي الآن؟\" 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is an \"Opportunity Cost\"?",
      "questionAr": "ما هي تكلفة الفرصة البديلة؟",
      "options": [
        "The value of the best alternative you gave up when making a choice",
        "The delivery fee when ordering online",
        "The money you find on the sidewalk",
        "Buying two items for the price of one"
      ],
      "optionsAr": [
        "قيمة أفضل بديل تضحي به عند اتخاذ قرار معين",
        "رسوم التوصيل عند الشراء عبر الإنترنت",
        "النقود التي تجدها مصادفة على الرصيف",
        "شراء قطعتين بسعر قطعة واحدة"
      ],
      "correctIndex": 0,
      "explanation": "Opportunity cost measures what you sacrifice to choose something else.",
      "explanationAr": "تكلفة الفرصة البديلة تقيس ما تضحي به مقابل اختيارك لشيء آخر.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_scarcity_diamonds",
    "title": "The Diamond-Water Paradox: Value & Scarcity",
    "titleAr": "لغز الألماس والماء: القيمة والندرة",
    "description": "Water is essential for life, yet diamonds are worth millions. Why? Unravel the mystery of scarcity and economic utility.",
    "descriptionAr": "الماء ضروري للحياة، ومع ذلك فالألمـاس يساوي الملايين. لماذا؟ اكتشف سر الندرة والمنفعة الاقتصادية.",
    "category": "OllieExplains",
    "duration": "0:39",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_goat_barter.jpg",
    "fullPosterUrl": "/images/videos/clip_goat_barter.jpg",
    "keyTerm": "Scarcity Paradox",
    "keyTermAr": "مفارقة الندرة",
    "likesCount": 1680,
    "viewsCount": 8400,
    "tags": [
      "economics",
      "value",
      "scarcity"
    ],
    "animationConfig": {
      "themeColor": "from-cyan-500 to-blue-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-cyan-950 to-blue-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Without water, humans cannot survive 3 days! Yet tap water is almost free! 💧",
          "captionAr": "بدون الماء، لا يستطيع الإنسان العيش 3 أيام! ومع ذلك فالماء شبه مجاني! 💧",
          "mascotMood": "explaining",
          "visualEmoji": "💧",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Diamonds are just shiny rocks you do not need, but one ring can cost $10,000! 💎",
          "captionAr": "بينما الألماس حجر لامع لا تحتاجه للبقاء، لكن خاتماً واحداً قد يكلف 10,000 دولار! 💎",
          "mascotMood": "thinking",
          "visualEmoji": "💎",
          "visualType": "trophy"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Why? SCARCITY! Water is abundant everywhere, but high-grade diamonds are extremely rare! 🌍",
          "captionAr": "السر هو \"الندرة\"! الماء متوفر بوفرة، بينما الألماس النقي شديد الندرة في الطبيعة! 🌍",
          "mascotMood": "explaining",
          "visualEmoji": "🌍",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "When you create something rare and unique in business, its value multiplies tenfold! 🚀",
          "captionAr": "عندما تبتكر شيئاً نادراً وفريداً في مشروعك، تتضاعف قيمته السوقية عشرات المرات! 🚀",
          "mascotMood": "celebrating",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why are diamonds usually more expensive than water?",
      "questionAr": "لماذا يباع الألماس بأسعار أغلى بكثير من الماء عادة؟",
      "options": [
        "Because diamonds are extremely scarce compared to abundant water",
        "Because water tastes bad without sugar",
        "Because diamonds are heavier than water",
        "Because diamonds are required for cooking"
      ],
      "optionsAr": [
        "لأن الألماس نادر جداً مقارنة بوفرة المياه",
        "لأن طعم الماء غير محلى بالسكر",
        "لأن الألماس أثقل وزناً من الماء",
        "لأن الألماس ضروري لطهي الطعام"
      ],
      "correctIndex": 0,
      "explanation": "Scarcity drives value: when something is rare and in demand, people pay more for it.",
      "explanationAr": "الندرة تصنع القيمة: عندما يكون الشيء نادراً ومطلوباً، يكون الناس مستعدين لدفع مبالغ أكبر لامتلاكه.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_diversification_eggs",
    "title": "Don't Put All Eggs in One Basket: Diversification",
    "titleAr": "سلة البيض الذكية: سر تنويع الاستثمار",
    "description": "If you carry all eggs in one basket and trip, what happens? Crack! Learn how diversification shields your fortune.",
    "descriptionAr": "إذا وضعت كل البيض في سلة واحدة وتعثرت، ماذا سيحدث؟ كراك! تعلم كيف يحمي التنويع ثروتك من الانهيار.",
    "category": "Shorts",
    "duration": "0:35",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Diversification",
    "keyTermAr": "تنويع المحفظة",
    "likesCount": 1490,
    "viewsCount": 7600,
    "tags": [
      "investing",
      "safety",
      "wealth"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine putting 10 fragile eggs in a single basket. One trip and... SPLAT! All gone! 🥚",
          "captionAr": "تخيل أنك تحمل 10 بيضات في سلة واحدة. تعثر واحد و... بوم! تكسر الجميع! 🥚",
          "mascotMood": "excited",
          "visualEmoji": "🥚",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Smart investors split their money into DIFFERENT baskets: businesses, real estate, and cash reserves! 🧺",
          "captionAr": "المستثمر الذكي يقسم أمواله في سلال مختلفة: مشاريع، عقارات، ومدخرات نقدية! 🧺",
          "mascotMood": "explaining",
          "visualEmoji": "🧺",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "If one business has a tough month, your other investments keep paying you steady income! 🛡️",
          "captionAr": "إذا واجه أحد المشاريع شهراً صعباً، تستمر استثماراتك الأخرى في تحقيق دخل ثابت! 🛡️",
          "mascotMood": "thinking",
          "visualEmoji": "🛡️",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 7,
          "caption": "Diversification is your financial shield: safety first, compound growth always! 🚀",
          "captionAr": "التنويع هو درعك المالي الحامي: الأمان أولاً، والنمو التراكمي دائماً! 🚀",
          "mascotMood": "celebrating",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why should you diversify your investments?",
      "questionAr": "لماذا يجب عليك تنويع استثماراتك؟",
      "options": [
        "To reduce risk: if one fails, others protect your wealth",
        "Because banks only allow one investment at a time",
        "So you can spend all your money faster",
        "To make your wallet weigh less"
      ],
      "optionsAr": [
        "لتقليل المخاطر: إذا تعثر استثمار واحد، تحميك بقية الاستثمارات",
        "لأن البنوك لا تسمح إلا بنوع واحد فقط من الحسابات",
        "لكي تنفق كل أموالك بسرعة أكبر",
        "لتخفيف وزن محفظتك في جيبك"
      ],
      "correctIndex": 0,
      "explanation": "Diversification spreads risk across multiple assets so no single failure can wipe you out.",
      "explanationAr": "التنويع يوزع المخاطر عبر عدة أصول بحيث لا يمكن لتعثر واحد أن يدمر ثروتك.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_compound_snowball",
    "title": "The Giant Money Snowball: 8th Wonder of the World",
    "titleAr": "كرة الثلج المالية: سحر الفائدة المركبة",
    "description": "Albert Einstein called compound interest the 8th wonder of the world. See how a small coin turns into a rolling avalanche!",
    "descriptionAr": "وصف أينشتاين الفائدة المركبة بأنها أعجوبة العالم الثامنة. شاهد كيف تتحول العملة الصغيرة إلى كرة ثلج عملاقة!",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_dollar_seeds.jpg",
    "fullPosterUrl": "/images/videos/clip_dollar_seeds.jpg",
    "keyTerm": "Compound Growth",
    "keyTermAr": "النمو المركب",
    "likesCount": 2240,
    "viewsCount": 11200,
    "tags": [
      "wealth",
      "compound",
      "investing"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-yellow-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Roll a tiny snowball down a snowy mountain. What happens as it turns? It grabs more snow! ❄️",
          "captionAr": "دحرج كرة ثلج صغيرة من قمة جبل. ماذا يحدث أثناء تدحرجها؟ تجمع مزيداً من الثلج! ❄️",
          "mascotMood": "explaining",
          "visualEmoji": "❄️",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Compound interest works the exact same way: your money earns interest, then THAT interest earns interest! 🔄",
          "captionAr": "الفائدة المركبة تعمل بنفس الطريقة: أموالك تحقق أرباحاً، ثم تلك الأرباح نفسها تحقق أرباحاً جديدة! 🔄",
          "mascotMood": "thinking",
          "visualEmoji": "🔄",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Starting at age 10 with just $5 a week can turn into over $250,000 by adulthood! 📈",
          "captionAr": "البدء في سن العاشرة بادخار 5 دولارات أسبوعياً يمكن أن ينمو ليتجاوز ربع مليون دولار مستقبلاً! 📈",
          "mascotMood": "celebrating",
          "visualEmoji": "💰",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Time is your greatest superpower. Start early, stay consistent, and watch the snowball grow! 🏔️",
          "captionAr": "الوقت هو أعظم قوة خارقة تملكها. ابدأ مبكراً وكن منتظماً وشاهد كرة الثلج تكبر! 🏔️",
          "mascotMood": "happy",
          "visualEmoji": "🚀",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is compound growth?",
      "questionAr": "ما هو النمو المركب للأموال؟",
      "options": [
        "Earning returns on your initial money AND on past accumulated returns",
        "Buying two items and burying them in the ground",
        "Borrowing money from friends without returning it",
        "Trading real coins for plastic board game tokens"
      ],
      "optionsAr": [
        "جني أرباح على أصل المبلغ المودع بالإضافة إلى الأرباح السابقة المتراكمة",
        "شراء قطعتين ودفنهما في التراب",
        "اقتراض المال من الأصدقاء دون إرجاعه",
        "استبدال العملات الحقيقية بألعاب بلاستيكية"
      ],
      "correctIndex": 0,
      "explanation": "Compounding accelerates growth exponentially over time as earnings generate their own earnings.",
      "explanationAr": "التراكم يضاعف النمو بشكل أسي بمرور الوقت حيث تقوم الأرباح بتوليد أرباح إضافية بنفسها.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_gdp_explained",
    "title": "How Rich is a Country? Understanding GDP",
    "titleAr": "كيف تقاس ثروة الدول؟ مفهوم الناتج المحلي GDP",
    "description": "What does it mean when the news says a nation had strong GDP growth? Discover how entire economies add up their score.",
    "descriptionAr": "ماذا يعني عندما تذكر الأخبار أن دولة حققت نمواً في الناتج المحلي؟ اكتشف كيف تحسب الاقتصادات نقاط نجاحها.",
    "category": "OllieExplains",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "GDP (Gross Domestic Product)",
    "keyTermAr": "الناتج المحلي الإجمالي",
    "likesCount": 1310,
    "viewsCount": 6900,
    "tags": [
      "macroeconomics",
      "gdp",
      "countries"
    ],
    "animationConfig": {
      "themeColor": "from-blue-600 to-indigo-800",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine your classroom made cookies, built model rockets, and tutored each other for tokens! 🏫",
          "captionAr": "تخيل أن فصلك المدرسي صنع كعكاً وصمم صواريخ وقدم دروساً لبعضهم مقابل عملات! 🏫",
          "mascotMood": "explaining",
          "visualEmoji": "🏫",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "If we add up the TOTAL dollar value of everything made and sold, that is the classroom GDP! 📊",
          "captionAr": "إذا جمعنا إجمالي القيمة النقدية لكل ما صُنع وبِيع خلال العام، فهذا هو ناتج الفصل! 📊",
          "mascotMood": "thinking",
          "visualEmoji": "📊",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Countries do the same! Cars, computers, doctor visits, and video games: all count toward national GDP! 🚗💻",
          "captionAr": "الدول تفعل الشيء نفسه! السيارات والبرمجيات والمستشفيات والألعاب: كلها تشكل الناتج المحلي! 🚗💻",
          "mascotMood": "explaining",
          "visualEmoji": "🌍",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "When GDP rises steadily, companies hire more workers and communities prosper! 🌟",
          "captionAr": "عندما ينمو الناتج المحلي بثبات، تتوفر وظائف أكثر وتزدهر المجتمعات والمدارس! 🌟",
          "mascotMood": "celebrating",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What does GDP (Gross Domestic Product) measure?",
      "questionAr": "ما الذي يقيسه الناتج المحلي الإجمالي (GDP)؟",
      "options": [
        "The total monetary value of all goods and services produced in a country",
        "The number of video game consoles sold each Christmas",
        "How many banks exist in a capital city",
        "The total amount of coins lost in street puddles"
      ],
      "optionsAr": [
        "القيمة النقدية الإجمالية لجميع السلع والخدمات المنتجة داخل الدولة",
        "عدد أجهزة ألعاب الفيديو المباعة في موسم الأعياد",
        "عدد البنوك المتواجدة في العاصمة فقط",
        "إجمالي العملات المفقودة في الشوارع"
      ],
      "correctIndex": 0,
      "explanation": "GDP is the primary scoreboard measuring how much economic value a country creates.",
      "explanationAr": "الناتج المحلي هو المقياس الأساسي لحجم القيمة الاقتصادية التي تنتجها دولة ما.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_taxes_roads",
    "title": "Where Does Tax Money Go? Roads, Parks & Safety",
    "titleAr": "أين تذهب الضرائب؟ بناء الجسور وحماية المجتمع",
    "description": "Ever wondered who paid for the public swings, the fire trucks, and the clean streetlamps? Discover the purpose of taxes.",
    "descriptionAr": "هل تساءلت يوماً من دفع ثمن ألعاب الحديقة العامة، وسيارات الإطفاء، وإنارة الشوارع؟ اكتشف دور الضرائب.",
    "category": "OllieExplains",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_allowance_system.jpg",
    "fullPosterUrl": "/images/videos/clip_allowance_system.jpg",
    "keyTerm": "Public Goods & Taxes",
    "keyTermAr": "الخدمات العامة والضرائب",
    "likesCount": 1190,
    "viewsCount": 5700,
    "tags": [
      "civics",
      "taxes",
      "society"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-green-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-green-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When you buy a toy for $10, the cashier might ask for $10.80. Where did the 80 cents go? 🧾",
          "captionAr": "عندما تشتري لعبة بـ 10 دولارات، قد يطلب الكاشير 10.80 دولار. أين ذهبت الـ 80 سنتاً؟ 🧾",
          "mascotMood": "explaining",
          "visualEmoji": "🧾",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "That small extra slice is TAX! Everyone chips in a tiny portion of their earnings to a shared community pool! 🏊‍♂️",
          "captionAr": "هذا الجزء الصغير هو الضريبة! الجميع يساهم بنسبة صغيرة لدعم صندوق المجتمع المشترك! 🏊‍♂️",
          "mascotMood": "thinking",
          "visualEmoji": "🏛️",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "That shared pool builds safe paved roads, funds heroic firefighters, and creates lush public parks! 🚒🌳",
          "captionAr": "هذا الصندوق يبني الطرق والجسور، ويمول رجال الإطفاء الشجعان، وينشئ الحدائق العامة! 🚒🌳",
          "mascotMood": "celebrating",
          "visualEmoji": "🚒",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Responsible entrepreneurs are proud to contribute fair taxes to keep our world flourishing! 🤝",
          "captionAr": "رواد الأعمال المسؤولون يفخرون بالمساهمة في بناء مجتمعاتهم وحماية مستقبلها! 🤝",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What are taxes primarily used for?",
      "questionAr": "ما هو الهدف الأساسي من جمع الضرائب في المجتمعات؟",
      "options": [
        "Funding public services like roads, schools, parks, and emergency rescue",
        "Buying candy for city hall employees only",
        "Hiding coins in a dragon cave",
        "Printing colorful stickers for the mayor"
      ],
      "optionsAr": [
        "تمويل الخدمات العامة مثل الطرق، والمدارس، والحدائق، وفرق الطوارئ",
        "شراء الحلويات لموظفي البلدية فقط",
        "إخفاء الذهب في كهوف سرية",
        "طباعة ملصقات تذكارية لرئيس البلدية"
      ],
      "correctIndex": 0,
      "explanation": "Taxes pool resources so communities can afford large-scale infrastructure that benefits everyone.",
      "explanationAr": "تجمع الضرائب الموارد لتتمكن المدن من تشييد بنية تحتية وخدمات ينتفع منها جميع أفراد المجتمع.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_monopoly_anti",
    "title": "What is a Monopoly? Why Fair Competition Wins",
    "titleAr": "ما هو الاحتكار؟ ولماذا تفوز المنافسة العادلة؟",
    "description": "If there is only ONE pizza shop in the entire galaxy, they can charge $100 for a slice. Learn why competition protects customers.",
    "descriptionAr": "إذا كان هناك متجر بيتزا واحد فقط في المجرة بأكملها، فيمكنه طلب 100 دولار للقطعة! اكتشف كيف تحمي المنافسة المستهلكين.",
    "category": "OllieExplains",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Monopoly & Competition",
    "keyTermAr": "الاحتكار والمنافسة",
    "likesCount": 1420,
    "viewsCount": 7100,
    "tags": [
      "market",
      "competition",
      "law"
    ],
    "animationConfig": {
      "themeColor": "from-orange-500 to-amber-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine one bakery owned every single oven in town. No one else was allowed to bake! 🥖",
          "captionAr": "تخيل مخبزاً واحداً يمتلك كل الأفران في المدينة، ولا يسمح لأي شخص آخر بالخبز! 🥖",
          "mascotMood": "explaining",
          "visualEmoji": "🥖",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "They could make cold, stale bread and charge 50 coins, because you have NO other choice! That is a MONOPOLY! 🚫",
          "captionAr": "يمكنهم بيع خبز قديم بـ 50 عملة، لأنه لا يوجد لديك أي خيار بديل! هذا هو الاحتكار! 🚫",
          "mascotMood": "thinking",
          "visualEmoji": "🚫",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "When 5 rival bakeries open, they compete! Bread gets warmer, toppings get tastier, and prices get fairer! 🍕",
          "captionAr": "عندما تفتح 5 مخابز منافسة، تتسابق لجذبك! يصبح الخبز أشهى والأسعار أفضل والخدمة أسرع! 🍕",
          "mascotMood": "celebrating",
          "visualEmoji": "🍕",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Competition is the customer’s best friend. It forces businesses to innovate and treat you like royalty! 👑",
          "captionAr": "المنافسة هي الصديق الأول للعميل؛ فهي تجبر المشاريع على الابتكار ومعاملتك كملك! 👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What happens when healthy competition exists in a market?",
      "questionAr": "ماذا يحدث عادة عند وجود منافسة قوية وعادلة في السوق؟",
      "options": [
        "Quality improves, prices stay fair, and customers get better choices",
        "All shops close down simultaneously",
        "Prices rise to infinity immediately",
        "Customers are banned from buying anything"
      ],
      "optionsAr": [
        "تتحسن جودة المنتجات، وتبقى الأسعار عادلة، ويحصل العملاء على خيارات أفضل",
        "تغلق جميع المتاجر أبوابها في نفس اللحظة",
        "ترتفع الأسعار إلى مستويات مستحيلة فوراً",
        "يُمنع الزبائن من الشراء"
      ],
      "correctIndex": 0,
      "explanation": "Competition forces rivals to provide higher quality, friendlier service, and competitive pricing.",
      "explanationAr": "المنافسة تحفز الشركات على تقديم أفضل جودة وخدمة ممتازة وأسعار تنافسية.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_pricing_decoy",
    "title": "The Popcorn Trick: The Power of Decoy Pricing",
    "titleAr": "خدعة الفشار: استراتيجية التسعير الذكي",
    "description": "Small popcorn is $3. Large is $7. But Medium is $6.50! Why does the cinema price it this way? Master the Decoy Effect!",
    "descriptionAr": "الفشار الصغير بـ 3$، والكبير بـ 7$، لكن المتوسط بـ 6.50$! لماذا تفعل السينما ذلك؟ اكتشف تأثير الفخ الذكي (Decoy Effect).",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Decoy Effect",
    "keyTermAr": "تأثير الخيار الوهمي (Decoy)",
    "likesCount": 2310,
    "viewsCount": 12400,
    "tags": [
      "pricing",
      "psychology",
      "sales"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "At the movie theater: Small popcorn is $3, and Large is $7. Most people choose the Small $3! 🍿",
          "captionAr": "في السينما: الفشار الصغير بـ 3 دولارات والكبير بـ 7 دولارات. معظم الناس يختار الصغير! 🍿",
          "mascotMood": "explaining",
          "visualEmoji": "🍿",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Now add a Medium for $6.50! Suddenly, the Large $7 looks like an INCREDIBLE deal for just 50 cents more! 🤯",
          "captionAr": "الآن أضف حجماً متوسطاً بـ 6.50 دولار! فجأة يبدو الحجم الكبير صفقة رابحة للغاية بزيادة 50 سنتاً فقط! 🤯",
          "mascotMood": "excited",
          "visualEmoji": "🤯",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That Medium is called the DECOY! Its job is not to sell, but to make the expensive option look irresistible! 🎯",
          "captionAr": "هذا الحجم المتوسط يسمى \"الخيار الوهمي\"! هدفه ليس البيع، بل جعل الخيار الكبير يبدو جذاباً ومربحاً! 🎯",
          "mascotMood": "celebrating",
          "visualEmoji": "🎯",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Understanding pricing psychology helps you design better packages for your own startup products! 🚀",
          "captionAr": "فهم سيكولوجية التسعير يمنحك مهارة تصميم باقات مبيعات ذكية في مشروعك الخاص! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the purpose of a \"Decoy\" option in pricing?",
      "questionAr": "ما هو الهدف من وضع خيار تسعير وهمي (Decoy)؟",
      "options": [
        "To make the target higher-priced option look like a much better bargain",
        "To sell out of the decoy item immediately",
        "To trick the cash register into printing faster",
        "To confuse customers so they leave without buying"
      ],
      "optionsAr": [
        "لجعل الخيار المستهدف الأعلى سعراً يبدو وكأنه صفقة ممتازة ورابحة",
        "لبيع كل كميات الخيار الوهمي فوراً",
        "لتسريع طباعة الإيصالات الورقية",
        "لإرباك الزبائن ودفعهم للخروج دون شراء"
      ],
      "correctIndex": 0,
      "explanation": "The decoy anchors perceived value, nudging customers toward the more profitable target tier.",
      "explanationAr": "الخيار الوهمي يعيد توجيه إدراك العميل للقيمة، مما يشجعه على اختيار الباقة الأكثر ربحية للمشروع.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_unique_value_prop",
    "title": "Why Pick Us? Finding Your Unique Superpower",
    "titleAr": "لماذا يختارك العميل؟ سر ميزتك التنافسية الفريدة",
    "description": "If three kids sell lemonade on the same street, what makes customers walk straight to yours? Discover your Unique Value Proposition.",
    "descriptionAr": "إذا باع ثلاثة أطفال عصير الليمون في نفس الشارع، فما الذي يجعل الزبائن يفضلون كشكك أنت؟ اكتشف ميزتك التنافسية الفريدة.",
    "category": "Strategy",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Unique Value Proposition",
    "keyTermAr": "الميزة التنافسية الفريدة (UVP)",
    "likesCount": 1980,
    "viewsCount": 10300,
    "tags": [
      "strategy",
      "branding",
      "sales"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-pink-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-pink-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Never be just \"another shop\". Be the ONLY one that offers something special! ⭐",
          "captionAr": "إياك أن تكون مجرد \"متجر آخر\". كن المتجر الوحيد الذي يقدم تجربة استثنائية! ⭐",
          "mascotMood": "explaining",
          "visualEmoji": "⭐",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Maybe your lemonade includes free cold cucumber slices, or an origami cup holder, or instant delivery on roller skates! 🛼",
          "captionAr": "ربما يتضمن عصيرك شريحة خيار منعشة مجاناً، أو حاملاً ورقياً مبتكراً، أو توصيلاً فورياً بالباتيناج! 🛼",
          "mascotMood": "excited",
          "visualEmoji": "🛼",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "That special magic is your UNIQUE VALUE PROPOSITION: the clear reason people choose YOU! 🎯",
          "captionAr": "هذا التميز هو \"ميزتك التنافسية الفريدة\": السبب الصريح والواضح لاختيار الناس لخدمتك! 🎯",
          "mascotMood": "celebrating",
          "visualEmoji": "🎯",
          "visualType": "trophy",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "When your superpower is clear, you never have to compete on cheap prices alone! 👑",
          "captionAr": "عندما تكون ميزتك واضحة، فلن تضطر أبداً لخوض حرب خفض الأسعار المؤلمة! 👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Unique Value Proposition\" (UVP)?",
      "questionAr": "ما هي \"الميزة التنافسية الفريدة\" (UVP)؟",
      "options": [
        "The distinct benefit that makes your product better or different from competitors",
        "A discount coupon that expired last month",
        "A secret password shared between cashiers",
        "The total cost of printing paper receipts"
      ],
      "optionsAr": [
        "الفائدة والتميز الواضح الذي يجعل منتجك مختلفاً وأفضل من المنافسين",
        "قسيمة خصم منتهية الصلاحية منذ شهر",
        "كلمة مرور سرية يتبادلها المحاسبون",
        "التكلفة الإجمالية لطباعة الفواتير الورقية"
      ],
      "correctIndex": 0,
      "explanation": "A UVP answers the customer’s number one question: \"Why should I buy from you instead of someone else?\"",
      "explanationAr": "الميزة التنافسية تجيب على السؤال الأول في ذهن العميل: \"لماذا أشتري منك تحديداً بدلاً من غيرك؟\"",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_customer_avatar",
    "title": "Who is Your Dream Customer? Target Audience",
    "titleAr": "من هو عميلك المثالي؟ تحديد الجمهور المستهدف",
    "description": "If you try to sell to everybody, you end up selling to nobody! Learn how to define your perfect customer profile.",
    "descriptionAr": "إذا حاولت البيع لكل شخص في العالم، فلن تبيع لأحد! تعلم كيف تحدد بروفايل عميلك المثالي بدقة.",
    "category": "Strategy",
    "duration": "0:35",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Target Audience",
    "keyTermAr": "الجمهور المستهدف",
    "likesCount": 1640,
    "viewsCount": 8900,
    "tags": [
      "marketing",
      "avatar",
      "customers"
    ],
    "animationConfig": {
      "themeColor": "from-purple-500 to-pink-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "A skateboard shop does not advertise to quiet book clubs, right? 🛹📚",
          "captionAr": "متجر ألواح التزلج لا يوجه إعلاناته لنوادي القراءة الهادئة، أليس كذلك؟ 🛹📚",
          "mascotMood": "explaining",
          "visualEmoji": "🛹",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Great businesses know EXACTLY who loves their stuff: their age, their hobbies, and their biggest challenges! 🔍",
          "captionAr": "المشاريع الناجحة تعرف بدقة من يعشق منتجاتها: أعمارهم، هواياتهم، وأكبر مشاكلهم اليومية! 🔍",
          "mascotMood": "thinking",
          "visualEmoji": "🔍",
          "visualType": "trophy"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "That persona is your CUSTOMER AVATAR: when you speak directly to them, sales feel natural and easy! 💬",
          "captionAr": "هذا يسمى \"بروفايل العميل المثالي\": عندما تخاطبهم باهتمام، تصبح المبيعات سهلة وتلقائية! 💬",
          "mascotMood": "celebrating",
          "visualEmoji": "💬",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 7,
          "caption": "Solve one specific problem for one passionate group, and watch your business thrive! 🚀",
          "captionAr": "حل مشكلة محددة لفئة متحمسة، وستشاهد مشروعك ينمو كالصاروخ! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why is defining a target audience crucial for a startup?",
      "questionAr": "لماذا يعتبر تحديد الجمهور المستهدف أمراً حيوياً للمشروع الناشئ؟",
      "options": [
        "It focuses your marketing and product features on people most likely to buy",
        "It allows you to ignore all safety rules",
        "It guarantees you never have to pay taxes",
        "It makes all your competitors immediately close down"
      ],
      "optionsAr": [
        "لأنه يركز جهودك التسويقية ومزايا منتجك على الفئة الأكثر استعداداً للشراء",
        "لأنه يتيح لك تجاهل معايير الجودة والأمان",
        "لأنه يضمن لك عدم دفع أي فواتير",
        "لأنه يجبر جميع المنافسين على إغلاق متاجرهم فوراً"
      ],
      "correctIndex": 0,
      "explanation": "Focusing on a specific target audience creates higher conversion rates and brand loyalty.",
      "explanationAr": "التركيز على جمهور محدد يرفع نسبة المبيعات ويخلق ولاءً حقيقياً لعلامتك التجارية.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_upsell_fries",
    "title": "Would You Like Fries With That? The Art of Upselling",
    "titleAr": "تريد بطاطس مع الوجبة؟ فن المبيعات التكميلية",
    "description": "The three most profitable words in restaurant history! Learn how upselling and bundle packages multiply your profits effortlessly.",
    "descriptionAr": "أكثر الجمل ربحية في تاريخ المطاعم! تعلم كيف تضاعف عروض المبيعات الإضافية أرباحك دون جهد إضافي.",
    "category": "Strategy",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Upselling & Cross-selling",
    "keyTermAr": "البيع الإضافي وحزم المنتجات",
    "likesCount": 2050,
    "viewsCount": 11800,
    "tags": [
      "sales",
      "upsell",
      "bundles"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When someone decides to buy a burger, their wallet is ALREADY OPEN! 🍔💳",
          "captionAr": "عندما يقرر شخص شراء شطيرة برجر، فإن محفظته تكون مفتوحة ومستعدة للشراء بالفعل! 🍔💳",
          "mascotMood": "explaining",
          "visualEmoji": "🍔",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Saying: \"Would you like a hot fresh cookie for just $1 extra?\" adds pure profit with zero new customer acquisition cost! 🍪",
          "captionAr": "قولك: \"هل تود إضافة كعكة شوكولاتة طازجة بدولار إضافي؟\" يمنحك أرباحاً نقية دون تكلفة جذب زبون جديد! 🍪",
          "mascotMood": "excited",
          "visualEmoji": "🍪",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "This is UPSELLING and BUNDLING: helping customers get more value while boosting your average order revenue! 📈",
          "captionAr": "هذا هو البيع التكميلي والحزم الذكية: تقديم قيمة إضافية للعميل مع زيادة متوسط قيمة الفاتورة! 📈",
          "mascotMood": "celebrating",
          "visualEmoji": "📈",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Always create win-win combos that make your buyers smile! 🤝✨",
          "captionAr": "ابتكر دائماً عروضاً رابحة للطرفين تسعد زبائنك وتزيد مبيعاتك! 🤝✨",
          "mascotMood": "happy",
          "visualEmoji": "✨",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is upselling in business?",
      "questionAr": "ما هو مفهوم البيع الإضافي (Upselling) في التجارة؟",
      "options": [
        "Offering an upgrade, add-on, or combo to a customer who is already purchasing",
        "Selling items at a complete loss to go bankrupt",
        "Refusing to sell to people who wear blue shoes",
        "Closing the store early every Friday"
      ],
      "optionsAr": [
        "عرض ترقية أو إضافة مكملة أو حزمة توفير لعميل قرر الشراء بالفعل",
        "بيع المنتجات بخسارة كاملة حتى الإفلاس",
        "رفض بيع المنتجات لمن يرتدي أحذية زرقاء",
        "إغلاق المتجر مبكراً في كل عطلة أسبوعية"
      ],
      "correctIndex": 0,
      "explanation": "Upselling increases average order value by offering complementary products at the moment of purchase.",
      "explanationAr": "البيع الإضافي يرفع متوسط قيمة طلبات الشراء عبر اقتراح منتجات ملائمة لحظة إتمام الصفقة.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_word_of_mouth",
    "title": "The Viral Secret: Word-of-Mouth Marketing",
    "titleAr": "التسويق الشفهي: كيف تصنع منتجاً يتحدث عنه الجميع؟",
    "description": "You can spend millions on ads, or you can build something so awesome your friends tell EVERYONE for free. Learn the word-of-mouth engine.",
    "descriptionAr": "يمكنك إنفاق الملايين على الإعلانات، أو ابتكار تجربة رائعة تجعل الجميع يتحدث عنها مجاناً! اكتشف قوة التسويق الشفهي.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Word-of-Mouth",
    "keyTermAr": "التسويق الشفهي التلقائي",
    "likesCount": 1870,
    "viewsCount": 9600,
    "tags": [
      "marketing",
      "viral",
      "growth"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-purple-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When you play an unbelievable video game, what is the first thing you do at school? Tell your best friends! 🎮🗣️",
          "captionAr": "عندما تلعب لعبة فيديو ممتعة للغاية، ما أول شيء تفعله في المدرسة؟ تخبر أعز أصدقائك بحماس! 🎮🗣️",
          "mascotMood": "excited",
          "visualEmoji": "🎮",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "That is WORD-OF-MOUTH: the most trustworthy, powerful marketing on earth! It costs ZERO dollars! 📣",
          "captionAr": "هذا هو \"التسويق الشفهي\": أقوى وأصدق نوع تسويق في العالم، وتكلفته صفر دولار! 📣",
          "mascotMood": "explaining",
          "visualEmoji": "📣",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "How to trigger it? Over-deliver! Add a surprise sticker, give a handwritten thank you, or make the taste unforgettable! 🎁",
          "captionAr": "كيف تطلقه؟ أبهر عميلك! أضف ملصقاً مفاجئاً، أو بطاقة شكر لطيفة، أو طعماً لا ينسى! 🎁",
          "mascotMood": "celebrating",
          "visualEmoji": "🎁",
          "visualType": "trophy",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Delighted customers become your greatest ambassadors. Quality is the best marketing! 🌟",
          "captionAr": "العملاء السعداء يصبحون أفضل سفراء لعلامتك التجارية. الجودة هي أفضل إعلان! 🌟",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why is word-of-mouth marketing so effective?",
      "questionAr": "لماذا يعتبر التسويق الشفهي (Word of Mouth) الأكثر تأثيراً؟",
      "options": [
        "People trust recommendations from real friends and peers far more than paid ads",
        "It is illegal to put signs on windows",
        "Because TV commercials only broadcast in black and white",
        "Because billboards make the sky too dark"
      ],
      "optionsAr": [
        "لأن الناس يثقون في ترشيحات أصدقائهم ومعارفهم أكثر بكثير من الإعلانات المدفوعة",
        "لأن وضع اللافتات التجارية ممنوع قانوناً",
        "لأن إعلانات التلفاز تبث بالأبيض والأسود فقط",
        "لأن لوحات الطرق تحجب ضوء الشمس"
      ],
      "correctIndex": 0,
      "explanation": "Trust is the foundation of commerce: peer recommendations create the highest conversion and loyalty.",
      "explanationAr": "الثقة هي جوهر التجارة؛ ترشيحات الأقران تولد أعلى درجات الاطمئنان والرغبة في التجربة.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_location_scout",
    "title": "The Golden Spot: Location, Location, Location!",
    "titleAr": "الموقع الذهبي: كيف تختار أفضل مكان لمشروعك؟",
    "description": "A gourmet burger stand in an empty desert makes zero sales. The same stand next to a soccer tournament sells out in an hour! Master foot traffic.",
    "descriptionAr": "كشك برجر فاخر في صحراء خالية لن يبيع شيئاً. الكشك نفسه بجوار بطولة كرة قدم يبيع كل مخزونه في ساعة! تعلم أسرار الموقع.",
    "category": "Strategy",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Foot Traffic & Location",
    "keyTermAr": "كثافة المارة واختيار الموقع",
    "likesCount": 1720,
    "viewsCount": 8800,
    "tags": [
      "retail",
      "location",
      "strategy"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Real estate bosses always chant: \"Location, Location, Location!\" Why is that? 📍",
          "captionAr": "خبراء الأعمال يرددون دائماً: \"الموقع، ثم الموقع، ثم الموقع!\" ما هو السبب؟ 📍",
          "mascotMood": "explaining",
          "visualEmoji": "📍",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "If your store is hidden where nobody walks, you have to spend fortunes shouting just to be noticed! 🏃‍♂️💨",
          "captionAr": "إذا كان متجرك مخفياً في مكان لا يمر به أحد، فستنفق ثروات في المناداة فقط ليلاحظك أحد! 🏃‍♂️💨",
          "mascotMood": "thinking",
          "visualEmoji": "🏃‍♂️",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "Set up where thirsty, hungry crowds ALREADY gather: stadium exits, park gates, and busy corners! 🏟️",
          "captionAr": "أنشئ مشروعك حيث يتجمع الزبائن بالفعل: بوابات الملاعب، مدخل الحدائق، والتقاطعات الحيوية! 🏟️",
          "mascotMood": "celebrating",
          "visualEmoji": "🏟️",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "High foot traffic turns everyday pedestrians into instant, paying fans! 🚀",
          "captionAr": "كثافة المارة تحول العابرين إلى زبائن سعداء ومشترين فوريين لمشروعك! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why is foot traffic important when choosing a physical store location?",
      "questionAr": "لماذا تعتبر كثافة المارة (Foot Traffic) عاملاً حاسماً في اختيار موقع المتجر؟",
      "options": [
        "More people walking past means natural visibility and higher sales opportunities",
        "It makes the store floors cleaner automatically",
        "Because shoes produce free electricity",
        "It allows the cash register to charge more tax"
      ],
      "optionsAr": [
        "لأن مرور عدد أكبر من الناس يمنحك ظهوراً طبيعياً وفرصاً متزايدة للمبيعات",
        "لأنه ينظف أرضيات المتجر تلقائياً",
        "لأن حركة الأحذية تولد طاقة كهربائية مجانية",
        "لأنه يسمح للمحل باحتساب ضرائب إضافية"
      ],
      "correctIndex": 0,
      "explanation": "Foot traffic provides an organic stream of potential customers without needing heavy ad spend.",
      "explanationAr": "كثافة المارة تمنحك تدفقاً مستمراً من العملاء المحتملين دون الحاجة لإنفاق ميزانيات ضخمة على الدعاية.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_negotiation_winwin",
    "title": "The Win-Win Deal: Master Negotiation Secrets",
    "titleAr": "الصفقة الرابحة للطرفين: أسرار التفاوض الذكي",
    "description": "A great negotiation is NOT about crushing the other person. It is finding a creative solution where BOTH sides walk away grinning!",
    "descriptionAr": "التفاوض الناجح ليس معركة لهزيمة الطرف الآخر، بل هو ابتكار حل ذكي يجعل كلا الطرفين يغادران بابتسامة ورضا!",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_goat_barter.jpg",
    "fullPosterUrl": "/images/videos/clip_goat_barter.jpg",
    "keyTerm": "Win-Win Negotiation",
    "keyTermAr": "التفاوض الرابح (Win-Win)",
    "likesCount": 2190,
    "viewsCount": 11500,
    "tags": [
      "negotiation",
      "communication",
      "deals"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-teal-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Bad negotiators act like pirates: \"Give me everything or walk away!\" That destroys friendships! 🏴‍☠️",
          "captionAr": "المفاوض السيئ يتصرف كالقراصنة: \"أعطني كل شيء وإلا سأرحل!\" هذا يدمر العلاقات! 🏴‍☠️",
          "mascotMood": "explaining",
          "visualEmoji": "🏴‍☠️",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Master negotiators listen first: \"What do YOU care about most? Price, timing, or extra perks?\" 🤝",
          "captionAr": "المفاوض البارع يستمع أولاً: \"ما هو الأهم بالنسبة لك؟ السعر، وقت التسليم، أم مميزات إضافية؟\" 🤝",
          "mascotMood": "thinking",
          "visualEmoji": "🤝",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "If they cannot lower the price, ask for free delivery or extra tokens! Both sides get what they value most! 💡",
          "captionAr": "إذا لم يتمكن من خفض السعر، اطلب توصيلاً مجانياً أو نقاط مكافأة! هكذا ينال الجميع ما يقدرونه! 💡",
          "mascotMood": "celebrating",
          "visualEmoji": "💡",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "When both sides win, they want to do business with you again and again for years! 🏆",
          "captionAr": "عندما يربح الطرفان، يرغبان في إبرام صفقات جديدة معك مراراً وتكراراً لسنوات طويلة! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the goal of a \"Win-Win\" negotiation?",
      "questionAr": "ما هو الهدف الحقيقي من التفاوض الرابح للطرفين (Win-Win)؟",
      "options": [
        "Finding an agreement where both parties feel satisfied and respected",
        "Trick the other person into giving away all their belongings",
        "Argue as loudly as possible until the other person gives up",
        "Flip a coin and ignore what everyone actually needs"
      ],
      "optionsAr": [
        "الوصول إلى اتفاق يشعر فيه كلا الطرفين بالرضا والتقدير والاحترام",
        "خداع الطرف الآخر للتنازل عن حقوقه",
        "الصراخ بصوت أعلى حتى يستسلم الطرف الآخر",
        "رمي قطعة نقود وتجاهل احتياجات الطرفين الحقيقية"
      ],
      "correctIndex": 0,
      "explanation": "Win-win negotiations build long-term partnerships and unlock creative value for everyone.",
      "explanationAr": "التفاوض الرابح يبني شراكات طويلة الأمد ويخلق قيماً مشتركة تدوم.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_brand_loyalty",
    "title": "The Stamp Card Magic: Building Brand Loyalty",
    "titleAr": "سحر بطاقة الأختام: كيف تبني ولاء العملاء؟",
    "description": "Why do coffee shops give you a card with 9 stamps for a free 10th cup? Learn how loyalty systems turn one-time shoppers into lifelong fans.",
    "descriptionAr": "لماذا تمنحك المقاهي بطاقة أختام لتحصل على الكوب العاشر مجاناً؟ تعلم كيف تحول أنظمة الولاء الزبون العابر إلى صديق وفي.",
    "category": "Strategy",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Customer Retention & Loyalty",
    "keyTermAr": "ولاء العملاء واستبقاؤهم",
    "likesCount": 1840,
    "viewsCount": 9100,
    "tags": [
      "loyalty",
      "gamification",
      "retention"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Getting a BRAND NEW customer costs 5 times more than keeping an existing one happy! 🏷️",
          "captionAr": "جذب عميل جديد تماماً يكلف 5 أضعاف تكلفة الحفاظ على عميلك الحالي سعيداً! 🏷️",
          "mascotMood": "explaining",
          "visualEmoji": "🏷️",
          "visualType": "chart",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Give your regulars a fun Stamp Card: \"Buy 5 juices, get the 6th with special rainbow sprinkles free!\" 🧃✨",
          "captionAr": "امنح زبائنك بطاقة مكافآت مرحة: \"اشترِ 5 عصائر واحصل على السادس بخلطة الفواكه الخاصة مجاناً!\" 🧃✨",
          "mascotMood": "excited",
          "visualEmoji": "🧃",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "People love making progress toward goals! It gamifies their routine and keeps them coming back to YOU! 🎯",
          "captionAr": "الناس يعشقون التقدم نحو هدف محدد! هذا يحول تجربة الشراء إلى لعبة ممتعة تعيدهم إليك! 🎯",
          "mascotMood": "celebrating",
          "visualEmoji": "🎯",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Treat your loyal fans like family, and they will support your brand through thick and thin! 💖",
          "captionAr": "عامل جمهورك الوفي كعائلتك، وسيقفون مع مشروعك ويدعمون نموه دائماً! 💖",
          "mascotMood": "happy",
          "visualEmoji": "💖",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why is retaining existing customers often better than constantly finding new ones?",
      "questionAr": "لماذا يعتبر الاحتفاظ بالعملاء الحاليين أكثر ربحية من البحث المستمر عن عملاء جدد؟",
      "options": [
        "It is much cheaper, and loyal customers buy more frequently and recommend your brand",
        "Because new customers never have any money",
        "Because keeping records of more than 5 people is impossible",
        "Loyalty cards print free money automatically"
      ],
      "optionsAr": [
        "لأنه أقل تكلفة بكثير، والعملاء الأوفياء يشترون بتكرار أعلى ويرشحونك لأصدقائهم",
        "لأن العملاء الجدد لا يملكون أي نقود على الإطلاق",
        "لأنه يستحيل تسجيل بيانات أكثر من خمسة أشخاص",
        "لأن بطاقات الأختام تطبع أوراقاً نقدية حقيقية"
      ],
      "correctIndex": 0,
      "explanation": "Customer retention drives sustainable profitability and high lifetime value for businesses.",
      "explanationAr": "استبقاء العملاء يرفع القيمة الدائمة للزبون (Lifetime Value) ويحقق ربحية مستمرة للمشروع.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_wholesale_bulk",
    "title": "Buy in Bulk, Save in Gold: Wholesale vs Retail",
    "titleAr": "سعر الجملة مقابل التجزئة: سر خفض التكاليف",
    "description": "If you buy 1 apple at the corner market it is $1. But a crate of 50 apples at the farm is only $20 ($0.40 each)! Master the wholesale advantage.",
    "descriptionAr": "إذا اشتريت تفاحة واحدة من البقالة فستدفع دولاراً. لكن صندوقاً من 50 تفاحة من المزرعة يكلف 20 دولاراً فقط (40 سنتاً للواحدة)! اكتشف سر الجملة.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Wholesale vs Retail",
    "keyTermAr": "البيع بالجملة والتجزئة",
    "likesCount": 1690,
    "viewsCount": 8400,
    "tags": [
      "procurement",
      "wholesale",
      "margins"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-green-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-green-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Buying 1 lemon at the grocery store costs $1.00. That is RETAIL pricing! 🍋",
          "captionAr": "شراء ليمونة واحدة من السوبرماركت يكلف دولاراً كاملاً. هذا هو سعر \"التجزئة\"! 🍋",
          "mascotMood": "explaining",
          "visualEmoji": "🍋",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Go to the wholesale fruit market and buy a crate of 100 lemons for $25. That is only 25 cents each! 📦",
          "captionAr": "اذهب لسوق الجملة واشترِ صندوقاً به 100 ليمونة بـ 25 دولاراً. تكلفتك أصبحت 25 سنتاً فقط للواحدة! 📦",
          "mascotMood": "excited",
          "visualEmoji": "📦",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Now, selling lemonade for $2 gives you massive, fat profit margins on every single cup! 💰",
          "captionAr": "الآن، بيع كوب العصير بدولارين يمنحك هامش ربح ضخم وصافي في كل كوب تبيعه! 💰",
          "mascotMood": "celebrating",
          "visualEmoji": "💰",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Smart CEOs always source wholesale: lower costs today, bigger profits tomorrow! 🏆",
          "captionAr": "القادة الأذكياء يشترون بالجملة دائماً: تكلفة أقل اليوم، وأرباح أضخم غداً! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the main advantage of buying supplies wholesale?",
      "questionAr": "ما هي الفائدة الكبرى لشراء مستلزمات مشروعك بسعر الجملة؟",
      "options": [
        "You pay a significantly lower price per unit by buying in larger quantities",
        "Wholesale items come wrapped in pure gold foil",
        "Wholesale sellers do not accept cash",
        "You only have to pay once every ten years"
      ],
      "optionsAr": [
        "الحصول على سعر أقل بكثير للقطعة الواحدة مقابل شراء كميات أكبر",
        "تأتي البضائع مغلفة بأوراق الذهب الخالص",
        "تجار الجملة لا يقبلون الدفع النقدي إطلاقاً",
        "يتم دفع الفاتورة مرة واحدة كل عشر سنوات فقط"
      ],
      "correctIndex": 0,
      "explanation": "Wholesale purchasing lowers cost of goods sold (COGS), dramatically increasing profit margins.",
      "explanationAr": "شراء الجملة يخفض تكلفة البضاعة المباعة (COGS) مما يرفع هوامش أرباحك الصافية بشكل ملحوظ.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_budget_jars",
    "title": "The 50/30/20 Rule: Split Your Allowance Like a Pro",
    "titleAr": "قاعدة 50/30/20: إدارة المصروف باحتراف",
    "description": "Do you spend all your allowance in 2 days? Discover the famous 50/30/20 formula to effortlessly afford everything you need AND want.",
    "descriptionAr": "هل تنفق مصروفك بالكامل في يومين؟ اكتشف معادلة 50/30/20 الشهيرة لتغطي كل احتياجاتك ورغباتك وتدخر بثقة.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "50/30/20 Budgeting",
    "keyTermAr": "قاعدة الميزانية 50/30/20",
    "likesCount": 2450,
    "viewsCount": 13200,
    "tags": [
      "budget",
      "money",
      "habits"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When you receive 10 PP Tokens, do NOT spend them all on candy! Use the 50/30/20 rule! 🪙",
          "captionAr": "عندما تحصل على 10 عملات، لا تنفقها كلها فوراً على الحلوى! استخدم قاعدة 50/30/20! 🪙",
          "mascotMood": "explaining",
          "visualEmoji": "🪙",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Put 50% into NEEDS (school pencils, lunch), 30% into WANTS (fun games, stickers)! ✏️🎮",
          "captionAr": "خصص 50% للاحتياجات (أقلام المدرسة، وجبة الغداء)، و30% للرغبات (ألعاب مسلية، ملصقات)! ✏️🎮",
          "mascotMood": "thinking",
          "visualEmoji": "🎮",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "And stash 20% into SAVINGS & INVESTING! That 20% is what buys your future financial freedom! 🏦",
          "captionAr": "وضع 20% في حصالة الادخار والاستثمار! هذه الـ 20% هي التي تبني مستقبلك واستقلالك المالي! 🏦",
          "mascotMood": "celebrating",
          "visualEmoji": "🏦",
          "visualType": "piggybank",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Follow this every month, and you will NEVER stress about running out of cash! 🚀",
          "captionAr": "اتبع هذا النظام كل شهر، ولن تشعر أبداً بضغط نفاد أموالك في منتصف الشهر! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "In the 50/30/20 budgeting rule, what is the 20% reserved for?",
      "questionAr": "في قاعدة الميزانية 50/30/20، لأي غرض تخصص نسبة الـ 20%؟",
      "options": [
        "Savings, emergency funds, and future investing",
        "Buying junk food exclusively",
        "Tossing coins into garden wishing fountains",
        "Paying someone to do your homework"
      ],
      "optionsAr": [
        "الادخار، وصناديق الطوارئ، والاستثمار للمستقبل",
        "شراء الأطعمة السريعة والحلويات فقط",
        "رمي العملات في نوافير الأمنيات",
        "دفع المال لشخص ليحل واجباتك المدرسية"
      ],
      "correctIndex": 0,
      "explanation": "The 20% category protects your future by steadily compounding your savings reserves.",
      "explanationAr": "نسبة الـ 20% تبني أمانك المالي المستقبلي من خلال التراكم المستمر للمدخرات والاستثمارات.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_credit_vs_debit",
    "title": "Plastic Magic: Credit vs Debit Cards Explained",
    "titleAr": "بطاقات البلاستيك: الفرق بين بطاقة الخصم والائتمان",
    "description": "Swiping a card at checkout looks identical, but behind the scenes one spends your own money while the other borrows from the bank! Learn the difference.",
    "descriptionAr": "تمرير البطاقة عند الدفع يبدو متطابقاً، لكن في الكواليس إحداهما تخصم من مالك الحقيقي والأخرى تقترض من البنك! اكتشف الفرق.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Credit vs Debit",
    "keyTermAr": "الخصم المباشر مقابل الائتمان",
    "likesCount": 1780,
    "viewsCount": 9400,
    "tags": [
      "banking",
      "cards",
      "debt"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-blue-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When adults tap a plastic card, they are using one of TWO very different tools! 💳",
          "captionAr": "عندما يمرر الكبار بطاقة بلاستيكية في المتجر، فهم يستخدمون إحدى أداتين مختلفتين تماماً! 💳",
          "mascotMood": "explaining",
          "visualEmoji": "💳",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "A DEBIT card takes cash straight from YOUR bank account instantly. When your account is empty, it stops! 🛑",
          "captionAr": "بطاقة الخصم (Debit) تسحب فوراً من رصيدك الحقيقي في البنك. وإذا نفد رصيدك، تتوقف! 🛑",
          "mascotMood": "thinking",
          "visualEmoji": "🛑",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "A CREDIT card BORROWS the bank’s money! If you do not pay it back by the end of the month, they charge heavy extra fees! ⚠️",
          "captionAr": "بطاقة الائتمان (Credit) تقترض من أموال البنك! وإذا لم تسدد في نهاية الشهر، يفرضون فوائد إضافية! ⚠️",
          "mascotMood": "explaining",
          "visualEmoji": "⚠️",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Always spend within your means and treat borrowed money with supreme discipline! 🛡️",
          "captionAr": "أنفق دائماً في حدود إمكانياتك الحقيقية، وعامل القروض بحذر وانضباط شديد! 🛡️",
          "mascotMood": "celebrating",
          "visualEmoji": "🛡️",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Where does the money come from when you tap a Debit Card?",
      "questionAr": "من أين تأتي الأموال عند الدفع بواسطة بطاقة الخصم المباشر (Debit Card)؟",
      "options": [
        "Directly from your own personal bank account balance",
        "From a friendly bank loan that you pay later",
        "From the store owner’s personal pocket",
        "From a secret satellite in space"
      ],
      "optionsAr": [
        "مباشرة من رصيدك وأموالك المودعة في حسابك البنكي الشخصي",
        "من قرض يمنحه لك البنك لتقوم بتسديده لاحقاً",
        "من جيب صاحب المتجر نفسه",
        "من قمر صناعي سري في الفضاء"
      ],
      "correctIndex": 0,
      "explanation": "Debit cards deduct existing funds directly from your checking account without borrowing.",
      "explanationAr": "بطاقات الخصم تسحب مباشرة من أموالك الحقيقية الموجودة في حسابك دون إنشاء أي ديون.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_emergency_fund",
    "title": "The Rainy Day Shield: Why You Need an Emergency Stash",
    "titleAr": "صندوق الطوارئ: الدرع المالي للأيام الصعبة",
    "description": "Bicycle tire popped? Laptop charger smoked? An Emergency Fund turns sudden catastrophes into minor, stress-free inconveniences.",
    "descriptionAr": "انثقب إطار دراجتك؟ تعطل شاحن حاسوبك فجأة؟ صندوق الطوارئ يحول الكوارث المفاجئة إلى مواقف بسيطة تمر دون أي توتر.",
    "category": "Finance",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "Emergency Fund",
    "keyTermAr": "صندوق الطوارئ",
    "likesCount": 1620,
    "viewsCount": 8100,
    "tags": [
      "savings",
      "emergency",
      "security"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-blue-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Life is full of unexpected surprises: a broken phone screen or a sudden vet visit! 📱🐾",
          "captionAr": "الحياة مليئة بالمفاجآت غير المتوقعة: انكسار شاشة الهاتف أو زيارة طارئة للعيادة البيطرية! 📱🐾",
          "mascotMood": "explaining",
          "visualEmoji": "📱",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Without savings, you might panic or borrow at high interest rates just to fix the problem! 😰",
          "captionAr": "بدون مدخرات طوارئ، قد تصاب بالذعر أو تضطر لاقتراض المال بفوائد مرتفعة لحل المشكلة! 😰",
          "mascotMood": "thinking",
          "visualEmoji": "😰",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "An EMERGENCY FUND is a sealed jar holding 3 to 6 months of expenses, waiting ONLY for real emergencies! 🛡️",
          "captionAr": "صندوق الطوارئ هو حصالة مغلقة تحتفظ بمصروف 3 إلى 6 أشهر، مخصصة فقط للأزمات الحقيقية! 🛡️",
          "mascotMood": "celebrating",
          "visualEmoji": "🛡️",
          "visualType": "piggybank",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "With an emergency shield in place, you sleep peacefully like a fearless CEO! 🌟",
          "captionAr": "مع وجود درع الطوارئ المالي، ستنام براحة واطمئنان كقائد أعمال محترف! 🌟",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "When should you spend money from your Emergency Fund?",
      "questionAr": "متى يحق لك سحب أموال من صندوق الطوارئ الخاص بك؟",
      "options": [
        "Only for genuine unexpected emergencies, like medical care or urgent repairs",
        "Whenever you see a brand new video game you really want",
        "To buy candy on the way home from school",
        "Every single weekend just for fun"
      ],
      "optionsAr": [
        "فقط عند حدوث طوارئ مفاجئة حقيقية، كالعلاج الطبي أو تصليح أجهزة ضرورية معطلة",
        "كلما رأيت لعبة فيديو جديدة أعجبتك",
        "لشراء حلوى إضافية في طريق عودتك للمنزل",
        "في نهاية كل أسبوع للتنزه مع الأصدقاء"
      ],
      "correctIndex": 0,
      "explanation": "Emergency funds exist strictly for unforeseen necessities, preserving your peace of mind.",
      "explanationAr": "أموال الطوارئ مخصصة حصرياً للحالات غير المتوقعة الضرورية، لتمنحك الأمان المالي وراحة البال.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_digital_wallets",
    "title": "Invisible Money: How Apple Pay & NFC Work",
    "titleAr": "المال غير المرئي: كيف تعمل المحافظ الرقمية؟",
    "description": "You wave a smartphone next to a card reader and BEEP! The bill is paid. How does digital money travel through invisible radio waves?",
    "descriptionAr": "تقرب هاتفك الذكي من جهاز الدفع ويصدر صوتاً: بيب! تم دفع الفاتورة. كيف تنتقل الأموال الرقمية عبر الموجات اللاسلكية؟",
    "category": "Finance",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Digital Wallets & NFC",
    "keyTermAr": "المحافظ الرقمية وتقنية NFC",
    "likesCount": 1540,
    "viewsCount": 7900,
    "tags": [
      "tech",
      "fintech",
      "nfc"
    ],
    "animationConfig": {
      "themeColor": "from-cyan-500 to-blue-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-cyan-950 to-blue-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Holding metal coins is fun, but today most money travels as encrypted digital signals! 📡",
          "captionAr": "حمل العملات المعدنية ممتع، لكن معظم أموال اليوم تنتقل كإشارات رقمية مشفرة وفائقة الأمان! 📡",
          "mascotMood": "explaining",
          "visualEmoji": "📡",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Near Field Communication (NFC) creates a tiny safe radio link between phone and payment terminal! 📲",
          "captionAr": "تقنية NFC تنشئ اتصالاً لاسلكياً سريعاً ومشفراً على مسافة سنتيمترات بين الهاتف وجهاز الدفع! 📲",
          "mascotMood": "thinking",
          "visualEmoji": "📲",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "Your real card number is NEVER revealed! It sends a temporary one-time security token instead! 🔒",
          "captionAr": "رقم بطاقتك الحقيقي لا يظهر أبداً! يرسل الهاتف رمز أمان مؤقت لمرة واحدة فقط (Token)! 🔒",
          "mascotMood": "celebrating",
          "visualEmoji": "🔒",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Fintech keeps money moving at the speed of light so young innovators can launch global businesses! 🚀",
          "captionAr": "التكنولوجيا المالية تجعل التجارة سريعة وآمنة ليتمكن رواد المستقبل من إطلاق مشاريع عالمية! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why are digital wallets considered secure?",
      "questionAr": "لماذا تعتبر المحافظ الرقمية مثل Apple Pay و Google Wallet آمنة جداً؟",
      "options": [
        "They replace real card numbers with encrypted one-time security tokens",
        "Because thieves cannot see radio waves",
        "Because banks delete all digital transactions every night",
        "Because smartphones only work during daylight"
      ],
      "optionsAr": [
        "لأنها تستبدل رقم بطاقتك برمز أمان مشفر مؤقت لمرة واحدة فقط (Token)",
        "لأن اللصوص لا يستطيعون رؤية موجات الراديو بالعين",
        "لأن البنوك تحذف سجل العمليات في كل ليلة",
        "لأن الهواتف تعمل في ضوء النهار فقط"
      ],
      "correctIndex": 0,
      "explanation": "Tokenization ensures merchants never store or see your actual debit or credit account digits.",
      "explanationAr": "تقنية الترميز (Tokenization) تضمن عدم معرفة التاجر لرقم حسابك الحقيقي إطلاقاً.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_stocks_ownership",
    "title": "Owning a Slice of Apple: What is a Stock?",
    "titleAr": "شريحة من أكبر الشركات: ما هي الأسهم؟",
    "description": "You love Roblox, Apple, or Disney? Did you know you can own actual shares in these companies and grow alongside them? Discover stocks.",
    "descriptionAr": "هل تحب ألعاب روبلوكس أو منتجات أبل أو ديزني؟ هل تعلم أنه يمكنك امتلاك حصة حقيقية فيها والنمو معها؟ اكتشف عالم الأسهم.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Stocks & Equities",
    "keyTermAr": "الأسهم وحصص الملكية",
    "likesCount": 2650,
    "viewsCount": 14100,
    "tags": [
      "stocks",
      "investing",
      "ownership"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine a gigantic pizza cut into 1 million microscopic slices! 🍕",
          "captionAr": "تخيل بيتزا عملاقة مقطعة إلى مليون قطعة متساوية تماماً! 🍕",
          "mascotMood": "explaining",
          "visualEmoji": "🍕",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "A public company does the exact same thing: it cuts ownership into millions of shares called STOCKS! 📈",
          "captionAr": "الشركات المساهمة تفعل نفس الشيء: تقسم ملكيتها إلى ملايين الحصص تسمى \"الأسهم\"! 📈",
          "mascotMood": "thinking",
          "visualEmoji": "📈",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "When you buy 1 stock of a company, you are a PART-OWNER! When they make billions in profits, your share value climbs! 💰",
          "captionAr": "عندما تشتري سهماً واحداً، تصبح شريكاً في الملكية! وعندما تحقق الشركة أرباحاً، ترتفع قيمة سهمك! 💰",
          "mascotMood": "celebrating",
          "visualEmoji": "💰",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Instead of just being a consumer who buys products, be an owner who earns from their success! 🚀",
          "captionAr": "بدلاً من أن تكون مجرد مستهلك يشتري المنتجات، كن مستثمراً يربح من نجاح الشركات الكبرى! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What does buying a share of stock represent?",
      "questionAr": "ماذا يعني امتلاكك لسهم واحد في شركة ما؟",
      "options": [
        "You own a fractional portion of that business and share in its value",
        "You are hired as the chief executive officer immediately",
        "You get all products of the company for free forever",
        "You are legally required to work in their factories on weekends"
      ],
      "optionsAr": [
        "امتلاك حصة جزئية حقيقية من تلك الشركة والمشاركة في قيمتها وأرباحها",
        "تعيينك رئيساً تنفيذياً للشركة فوراً",
        "الحصول على جميع منتجات الشركة مجاناً مدى الحياة",
        "إلزامك بالعمل في مصانع الشركة في عطلة نهاية الأسبوع"
      ],
      "correctIndex": 0,
      "explanation": "A stock is a unit of equity ownership in a corporation, giving you a stake in its future.",
      "explanationAr": "السهم هو وثيقة ملكية جزئية في الشركة، تمنحك نصيباً من نجاحها ونموها المستقبلي.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_passive_income",
    "title": "Making Money While You Sleep: Passive Income Secrets",
    "titleAr": "كسب المال أثناء نومك: أسرار الدخل السلبي",
    "description": "Active income stops when you stop working. Passive income keeps paying you month after month! Discover the 3 best passive income streams.",
    "descriptionAr": "الدخل النشط يتوقف عندما تتوقف عن العمل، بينما الدخل السلبي يستمر في التدفق شهراً بعد شهر! اكتشف أهم مصادر الدخل السلبي.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Passive Income",
    "keyTermAr": "الدخل السلبي المستمر",
    "likesCount": 2890,
    "viewsCount": 15600,
    "tags": [
      "wealth",
      "passive",
      "financialfreedom"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Mowing lawns is ACTIVE INCOME: if you stop pushing the mower, the money stops flowing! 🚜",
          "captionAr": "جز العشب هو \"دخل نشط\": إذا توقفت عن العمل وتعبت يداك، يتوقف تدفق المال فوراً! 🚜",
          "mascotMood": "explaining",
          "visualEmoji": "🚜",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Writing an ebook, renting an apartment, or owning dividend stocks is PASSIVE INCOME! 📚🏠",
          "captionAr": "بينما تأليف كتاب إلكتروني، أو تأجير عقار، أو امتلاك أسهم تدر أرباحاً هو \"دخل سلبي\"! 📚🏠",
          "mascotMood": "thinking",
          "visualEmoji": "📚",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "You build or invest in the asset once, and it pays you dividends while you sleep, study, or travel! 🛌💸",
          "captionAr": "تبني أو تستثمر في الأصل مرة واحدة، ويستمر في دفع الأرباح لك وأنت نائم أو تدرس أو تسافر! 🛌💸",
          "mascotMood": "celebrating",
          "visualEmoji": "💸",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "True financial freedom happens when your passive income exceeds your living expenses! 🌟",
          "captionAr": "الحرية المالية الحقيقية تتحقق عندما يتجاوز دخلك السلبي الشهري إجمالي مصاريفك المعيشية! 🌟",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the main difference between active and passive income?",
      "questionAr": "ما هو الفرق الرئيسي بين الدخل النشط والدخل السلبي؟",
      "options": [
        "Active income requires your direct ongoing time and labor; passive income generates returns from assets",
        "Passive income is illegal in most countries",
        "Active income can only be earned in winter",
        "There is no difference between them"
      ],
      "optionsAr": [
        "الدخل النشط يتطلب وقتك وجهدك المباشر المستمر، بينما الدخل السلبي يتولد من الأصول تلقائياً",
        "الدخل السلبي غير قانوني في معظم الدول",
        "الدخل النشط يُكسب في فصل الشتاء فقط",
        "لا يوجد أي فرق بينهما على الإطلاق"
      ],
      "correctIndex": 0,
      "explanation": "Assets produce income decoupled from the number of hours you trade in a given day.",
      "explanationAr": "الأصول المالية تدر دخلاً مستقلاً عن عدد الساعات التي تقضيها في العمل المباشر كل يوم.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_crypto_blockchain",
    "title": "The Digital Ledger: What is Blockchain?",
    "titleAr": "سجل المعاملات المشفر: ما هي تقنية البلوكشين؟",
    "description": "Imagine a notebook duplicated on 10,000 computers around the globe that no single hacker can erase. Discover the science of blockchain.",
    "descriptionAr": "تخيل دفتراً حسابياً منسوخاً على 10,000 حاسوب حول العالم ولا يستطيع أي مخترق تزويره. اكتشف أسرار تقنية البلوكشين.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Blockchain Ledger",
    "keyTermAr": "سجل البلوكشين الموزع",
    "likesCount": 1950,
    "viewsCount": 10400,
    "tags": [
      "blockchain",
      "crypto",
      "technology"
    ],
    "animationConfig": {
      "themeColor": "from-indigo-500 to-purple-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Traditional banks keep records on a central private server. If that server fails, trouble! 🏢💻",
          "captionAr": "البنوك التقليدية تحتفظ بسجلات الحسابات على خادم مركزي خاص. إذا تعطل الخادم، تحدث مشكلة! 🏢💻",
          "mascotMood": "explaining",
          "visualEmoji": "🏢",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "A BLOCKCHAIN is a shared digital ledger spread across thousands of independent computers worldwide! 🌐",
          "captionAr": "تقنية \"البلوكشين\" هي سجل حسابات رقمي موزع عبر آلاف الحواسيب المستقلة حول العالم! 🌐",
          "mascotMood": "thinking",
          "visualEmoji": "🌐",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Transactions are bundled into blocks and locked with unbreakable cryptographic mathematics! ⛓️🔒",
          "captionAr": "تُجمع المعاملات في كتل متسلسلة وتُغلق بمعادلات رياضية تشفيرية يستحيل التلاعب بها! ⛓️🔒",
          "mascotMood": "celebrating",
          "visualEmoji": "🔒",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Blockchain powers digital currencies, smart contracts, and the future of decentralized trust! 🚀",
          "captionAr": "البلوكشين يشغل العملات الرقمية والعقود الذكية ومستقبل الثقة الرقمية في العالم! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What makes a blockchain ledger so resistant to fraud and tampering?",
      "questionAr": "ما الذي يجعل سجل البلوكشين مقاوماً للتزوير والتلاعب؟",
      "options": [
        "It is distributed across thousands of computers, verified cryptographically by consensus",
        "It is stored on a floppy disk in a bank vault",
        "Only governments are allowed to see it",
        "It disappears every 24 hours"
      ],
      "optionsAr": [
        "لأنه موزع عبر آلاف الحواسيب ويتم التحقق منه تشفيرياً بإجماع الشبكة",
        "لأنه مخزن على قرص مرن في خزانة البنك",
        "لأنه مقتصر على الحكومات فقط دون غيرها",
        "لأنه يختفي ويُمسح تلقائياً كل 24 ساعة"
      ],
      "correctIndex": 0,
      "explanation": "Decentralization and cryptographic hashing ensure no single entity can alter historical records.",
      "explanationAr": "اللامركزية والتشفير يضمنان عدم قدرة أي جهة منفردة على تعديل السجلات السابقة.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_debt_trap",
    "title": "The Borrowing Trap: Good Debt vs Bad Debt",
    "titleAr": "فخ الديون: الفرق بين الدين النافع والدين الضار",
    "description": "Debt can be a golden lever or a heavy anchor! Learn which loans help you build wealth and which ones drain your pocket.",
    "descriptionAr": "قد يكون الدين رافعة ذهبية لثروتك أو مرساة ثقيلة تغرقك! تعلم كيف تميز بين القرض النافع والدين المستنزف.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "Good Debt vs Bad Debt",
    "keyTermAr": "الدين النافع والدين الضار",
    "likesCount": 1820,
    "viewsCount": 9100,
    "tags": [
      "debt",
      "leverage",
      "finance"
    ],
    "animationConfig": {
      "themeColor": "from-red-500 to-amber-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-red-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Borrowing money is like handling fire: used properly it cooks a feast; used carelessly it burns the house! 🔥",
          "captionAr": "اقتراض المال يشبه النار: إن أحسنت استخدامه جهز لك وليمة، وإن أهملته حرق المنزل! 🔥",
          "mascotMood": "explaining",
          "visualEmoji": "🔥",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "BAD DEBT is borrowing to buy things that lose value instantly, like luxury shoes or video game skins! 👟🚫",
          "captionAr": "الدين الضار هو الاقتراض لشراء أشياء تفقد قيمتها فوراً، مثل أحذية فاخرة أو مظاهر ألعاب فيديو! 👟🚫",
          "mascotMood": "thinking",
          "visualEmoji": "🚫",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "GOOD DEBT is low-interest borrowing to buy income-producing assets, like commercial tools or business equipment! 🚜📈",
          "captionAr": "الدين النافع هو اقتراض منخفض الفائدة لشراء أصول تدر دخلاً، كشراء معدات إنتاجية لمشروعك! 🚜📈",
          "mascotMood": "celebrating",
          "visualEmoji": "📈",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Pay off bad debt aggressively, and only leverage good debt when the returns far outpace the interest! 🛡️",
          "captionAr": "سدد الديون الاستهلاكية فوراً، ولا تقترض إلا عندما تكون أرباحك أعلى بكثير من فوائد القرض! 🛡️",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Which of the following is considered \"Good Debt\"?",
      "questionAr": "أي من الخيارات التالية يُعتبر من \"الديون النافعة\" (Good Debt)؟",
      "options": [
        "A loan to buy professional equipment that increases your business revenue",
        "Borrowing money to buy fancy clothes for a weekend party",
        "Using a credit card to purchase expensive video game cosmetics",
        "Taking a payday loan to eat at a 5-star restaurant"
      ],
      "optionsAr": [
        "قرض لشراء معدات إنتاجية متطورة تزيد من أرباح مشروعك التجاري",
        "اقتراض المال لشراء ملابس باهظة لحضور حفلة عطلة نهاية الأسبوع",
        "استخدام بطاقة ائتمان لشراء مظاهر وشخصيات داخل لعبة فيديو",
        "الاقتراض بفوائد مرتفعة لتناول العشاء في مطعم خمس نجوم"
      ],
      "correctIndex": 0,
      "explanation": "Good debt generates more future cash flow than the cost of the financing itself.",
      "explanationAr": "الدين النافع يولد تدفقات نقدية مستقبلية تفوق بكثير تكلفة خدمة الدين نفسه.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_ai_copilot",
    "title": "Working With Robots: AI in Modern Business",
    "titleAr": "الذكاء الاصطناعي: مساعدك الخارق في ريادة الأعمال",
    "description": "Artificial intelligence is not here to replace young CEOs; it is here to be your 24/7 research assistant, graphic designer, and coder!",
    "descriptionAr": "الذكاء الاصطناعي لم يأتِ ليستبدل رواد الأعمال الصغار، بل ليكون مساعدك الذكي في البحث والتصميم والبرمجة على مدار الساعة!",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Kami",
    "speakerAvatar": "/images/characters_clean/kami_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "AI & Automation",
    "keyTermAr": "الذكاء الاصطناعي والأتمتة",
    "likesCount": 2780,
    "viewsCount": 14800,
    "tags": [
      "ai",
      "tech",
      "future"
    ],
    "animationConfig": {
      "themeColor": "from-purple-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Building a startup used to require hiring 20 specialists for every small task! 🧑‍💼👩‍💻",
          "captionAr": "إطلاق مشروع ناشئ في الماضي كان يتطلب توظيف عشرات المتخصصين لكل خطوة صغيرة! 🧑‍💼👩‍💻",
          "mascotMood": "explaining",
          "visualEmoji": "👩‍💻",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Today, AI tools help one kid brainstorm business names, draft logos, and code an app in a single weekend! 🤖⚡",
          "captionAr": "اليوم، تساعد أدوات الذكاء الاصطناعي طفلاً واحداً على ابتكار الاسم، وتصميم الشعار، وبرمجة تطبيق في عطلة واحدة! 🤖⚡",
          "mascotMood": "excited",
          "visualEmoji": "🤖",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "AI is your tireless co-pilot! But YOUR creative vision, ethics, and empathy remain the real captain! 🧭",
          "captionAr": "الذكاء الاصطناعي مساعدك المخلص! لكن رؤيتك الإبداعية وأخلاقك وتعاطفك هي القبطان الحقيقي للسفينة! 🧭",
          "mascotMood": "celebrating",
          "visualEmoji": "🧭",
          "visualType": "trophy",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Master AI prompting today to lead tomorrow’s most innovative global companies! 🚀",
          "captionAr": "أتقن هندسة الأوامر والتعامل مع الذكاء الاصطناعي اليوم لتقود أكثر شركات الغد ابتكاراً! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How should smart entrepreneurs utilize Artificial Intelligence?",
      "questionAr": "كيف يستفيد رواد الأعمال الأذكياء من أدوات الذكاء الاصطناعي؟",
      "options": [
        "As an accelerator for research, content drafting, and repetitive automation while providing human creative vision",
        "Letting AI make all moral and safety decisions blindly",
        "Copying AI output without checking if it is true or helpful",
        "By never learning how to read or write"
      ],
      "optionsAr": [
        "كمسرّع للبحث، وصياغة الأفكار، وأتمتة المهام الروتينية مع الحفاظ على الرؤية الإبداعية البشرية",
        "ترك الذكاء الاصطناعي يتخذ كل القرارات الأخلاقية والمالية دون تدقيق",
        "نسخ نصوص الذكاء الاصطناعي دون التأكد من صحتها وفائدتها",
        "بالتوقف عن تعلم القراءة والكتابة"
      ],
      "correctIndex": 0,
      "explanation": "AI acts as a force multiplier for human ingenuity, executing operational tasks rapidly.",
      "explanationAr": "الذكاء الاصطناعي يعمل كمضاعف للقدرات البشرية، حيث ينفذ المهام التحليلية والتصميمية بسرعة فائقة.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_prototype_mvp",
    "title": "Build Fast, Learn Faster: What is an MVP?",
    "titleAr": "النموذج الأولي MVP: كيف تختبر فكرتك بأقل تكلفة؟",
    "description": "Do not spend 2 years and thousands of dollars building a product before finding out if people want it! Master the Minimum Viable Product.",
    "descriptionAr": "لا تنفق عامين وآلاف الدولارات في صنع منتج قبل أن تتأكد أن أحداً يريده! تعلم بناء النموذج الأولي الأصغر (MVP).",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Kami",
    "speakerAvatar": "/images/characters_clean/kami_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Minimum Viable Product (MVP)",
    "keyTermAr": "النموذج الأولي الأبسط (MVP)",
    "likesCount": 1910,
    "viewsCount": 9700,
    "tags": [
      "mvp",
      "prototyping",
      "lean"
    ],
    "animationConfig": {
      "themeColor": "from-purple-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If you want to build a flying electric skateboard, do NOT start by manufacturing a spaceship! 🛸🚫",
          "captionAr": "إذا أردت ابتكار لوح تزلج كهربائي، فلا تبدأ ببناء سفينة فضاء معقدة! 🛸🚫",
          "mascotMood": "explaining",
          "visualEmoji": "🛸",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Build a MINIMUM VIABLE PRODUCT (MVP): the simplest, quickest prototype that solves the main problem! 🛹✏️",
          "captionAr": "اصنع \"النموذج الأولي الأبسط\" (MVP): أبسط نسخة تجريبية تحل المشكلة الأساسية وتوضح الفكرة! 🛹✏️",
          "mascotMood": "thinking",
          "visualEmoji": "🛹",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Show it to 10 friends, get their honest feedback, fix the flaws, and improve it step-by-step! 🗣️🔧",
          "captionAr": "اعرضه على 10 من أصدقائك، واستمع لملاحظاتهم الصادقة، ثم طور منتجك خطوة بخطوة! 🗣️🔧",
          "mascotMood": "celebrating",
          "visualEmoji": "🔧",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Test fast, learn fast, and build products customers genuinely crave! 🚀",
          "captionAr": "اختبر فكرتك بسرعة، وتعلم من الأخطاء مبكراً، لتصنع ما يحتاجه الناس حقاً! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a Minimum Viable Product (MVP)?",
      "questionAr": "ما هو النموذج الأولي الأبسط (MVP)؟",
      "options": [
        "The simplest functional version of a product created to test assumptions and gather user feedback",
        "A golden statue presented to the winner of a golf match",
        "The most expensive product in a luxury department store",
        "A broken computer part that no longer turns on"
      ],
      "optionsAr": [
        "أبسط نسخة قابلة للاستخدام من المنتج صُممت لاختبار الفكرة وجمع آراء المستخدمين مبكراً",
        "تمثال ذهبي يُقدم للفائز في مسابقة جولف",
        "أغلى منتج معروض في متجر أزياء فاخر",
        "قطعة حاسوب معطلة لا يمكن تشغيلها"
      ],
      "correctIndex": 0,
      "explanation": "An MVP helps entrepreneurs validate real customer demand before investing heavy capital and time.",
      "explanationAr": "النموذج الأولي يتيح لرواد الأعمال التحقق من رغبة الزبائن الحقيقية قبل استثمار مبالغ طائلة.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_creator_economy",
    "title": "From Gamer to Creator: Building a Digital Media Brand",
    "titleAr": "من لاعب إلى صانع محتوى: بناء علامة رقمية",
    "description": "Do not just consume content all day! Discover how top young creators build audiences, design merchandise, and run media companies.",
    "descriptionAr": "لا تكتفِ باستهلاك المحتوى طوال اليوم! اكتشف كيف يبني صانعو المحتوى الناجحون مجتمعاتهم ويطلقون منتجاتهم الخاصة.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Kami",
    "speakerAvatar": "/images/characters_clean/kami_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Creator Economy",
    "keyTermAr": "اقتصاد صانعي المحتوى",
    "likesCount": 2410,
    "viewsCount": 12900,
    "tags": [
      "creator",
      "media",
      "youtube"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Billions of people scroll social media every single day. Most are consumers; a few are CREATORS! 📱",
          "captionAr": "المليارات يتصفحون الشاشات يومياً. معظمهم مستهلكون، لكن القلة الذكية هم \"صُنّاع المحتوى\"! 📱",
          "mascotMood": "explaining",
          "visualEmoji": "📱",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "When you share educational tips, comedy skits, or art tutorials, you build an AUDIENCE! 🎨🎥",
          "captionAr": "عندما تشارك نصائح تعليمية، أو مواقف ممتعة، أو دروساً في الرسم، فأنت تبني جمهوراً حقيقياً! 🎨🎥",
          "mascotMood": "thinking",
          "visualEmoji": "🎥",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Audience trust turns into custom merch, brand sponsorships, and paid digital masterclasses! 👕💵",
          "captionAr": "ثقة الجمهور تتحول إلى مبيعات منتجات تحمل علامتك، وشراكات رعاية، ودورات تدريبية نافعة! 👕💵",
          "mascotMood": "celebrating",
          "visualEmoji": "💵",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Focus on providing immense genuine value, and the creator economy will reward you abundantly! 🌟",
          "captionAr": "ركز على تقديم قيمة حقيقية ومفيدة لجمهورك، وسيكافئك اقتصاد صناعة المحتوى بسخاء! 🌟",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the foundation of long-term success in the creator economy?",
      "questionAr": "ما هو الأساس الجوهري للنجاح المستمر في اقتصاد صناعة المحتوى؟",
      "options": [
        "Consistently providing genuine value, entertainment, or education that builds authentic trust",
        "Using annoying clickbait titles that disappoint viewers every time",
        "Copying other creators word-for-word without permission",
        "Buying fake robotic comments online"
      ],
      "optionsAr": [
        "تقديم قيمة حقيقية، أو محتوى تعليمي وممتع يبني ثقة صادقة مع المتابعين باستمرار",
        "استخدام عناوين مخادعة (Clickbait) تخيب أمل المشاهدين في كل مرة",
        "نسخ محتوى الآخرين كلمة بكلمة دون إذن أو إبداع",
        "شراء تعليقات وهمية وروبوتات مزيفة"
      ],
      "correctIndex": 0,
      "explanation": "Authentic audience trust is the currency of the digital media ecosystem.",
      "explanationAr": "الثقة الحقيقية والاحترام المتبادل مع الجمهور هما العملة الأثمن في الإعلام الرقمي.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_green_business",
    "title": "Eco-Profits: Building a Sustainable Green Business",
    "titleAr": "المشاريع الخضراء: كسب الأرباح وحماية كوكب الأرض",
    "description": "Doing good and doing well can go hand-in-hand! Discover how modern eco-friendly startups turn recycled materials and solar power into gold.",
    "descriptionAr": "فعل الخير وجني الأرباح يجتمعان معاً! اكتشف كيف تحول المشاريع الخضراء الصديقة للبيئة البلاستيك المعاد تدويره إلى أرباح حقيقية.",
    "category": "Strategy",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Kami",
    "speakerAvatar": "/images/characters_clean/kami_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Sustainable Business",
    "keyTermAr": "الاستدامة والمشاريع الخضراء",
    "likesCount": 1680,
    "viewsCount": 8200,
    "tags": [
      "green",
      "eco",
      "sustainability"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-400 to-green-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-green-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Old companies dumped waste into rivers without caring. Today’s smart CEOs think differently! 🌍🌱",
          "captionAr": "كانت الشركات القديمة تهدر الموارد وتلوث البيئة. اليوم، يفكر القادة الأذكياء بأسلوب مختلف كلياً! 🌍🌱",
          "mascotMood": "explaining",
          "visualEmoji": "🌱",
          "visualType": "stocks",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Customers LOVE supporting businesses that protect the earth: bamboo straws, solar power, and recycled packaging! ☀️🥤",
          "captionAr": "الزبائن يعشقون دعم المشاريع التي تحمي الكوكب: شفاطات الخيزران، والطاقة الشمسية، والتغليف المعاد تدويره! ☀️🥤",
          "mascotMood": "thinking",
          "visualEmoji": "☀️",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "Eco-efficiency saves money on electricity and raw materials while winning loyal, passionate customers! ♻️💰",
          "captionAr": "كفاءة الطاقة وإعادة التدوير توفران تكاليف التشغيل وتجذبان زبائن مخلصين يحبون رسالتك! ♻️💰",
          "mascotMood": "celebrating",
          "visualEmoji": "♻️",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Lead the green revolution: build a company that leaves our planet healthier than you found it! 🏆",
          "captionAr": "قد الثورة الخضراء: ابنِ مشروعاً يترك كوكبنا أنقى وأجمل مما وجدته! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a sustainable business model?",
      "questionAr": "ما هو نموذج الأعمال المستدام والصديق للبيئة؟",
      "options": [
        "A company that generates healthy profits while preserving the environment and supporting communities",
        "A business that never recycles anything to save 2 seconds",
        "Throwing all plastic waste into nearby rivers",
        "Running diesel generators 24 hours a day for fun"
      ],
      "optionsAr": [
        "مشروع يحقق أرباحاً ممتازة مع الحفاظ على البيئة الطبيعية وخدمة المجتمع بمسؤولية",
        "مشروع يرفض إعادة التدوير تماماً لتوفير ثانيتين من وقته",
        "إلقاء كل النفايات البلاستيكية في الأنهار المجاورة",
        "تشغيل مولدات الديزل الملوثة طوال الليل للتسلية"
      ],
      "correctIndex": 0,
      "explanation": "Sustainable businesses create long-term shared value for investors, customers, and our planet.",
      "explanationAr": "المشاريع المستدامة تخلق قيمة مشتركة طويلة الأجل للمستثمرين، والعملاء، وكوكب الأرض معاً.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_failure_stepping_stone",
    "title": "Edison's 1,000 Lightbulbs: Failure is Just Data",
    "titleAr": "ألف محاولة للمصباح: الفشل مجرد بيانات للتعلم",
    "description": "Thomas Edison failed thousands of times before his lightbulb worked. He said: \"I did not fail; I found 10,000 ways that will not work!\"",
    "descriptionAr": "فشل توماس أديسون آلاف المرات قبل أن يضيء مصباحه. وقال: \"أنا لم أفشل، بل اكتشفت 10,000 طريقة لا تعمل!\" تعلم عقلية المثابرة.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Rex",
    "speakerAvatar": "/images/characters_clean/rex_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Resilience & Growth Mindset",
    "keyTermAr": "عقلية النمو والمثابرة",
    "likesCount": 2950,
    "viewsCount": 16200,
    "tags": [
      "mindset",
      "grit",
      "resilience"
    ],
    "animationConfig": {
      "themeColor": "from-red-500 to-amber-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-red-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When your first lemonade stand makes zero sales, do you quit forever? NEVER! 🛑",
          "captionAr": "عندما لا يحقق كشكك الأول أي مبيعات في أول يوم، هل تستسلم وتنسحب للأبد؟ أبداً! 🛑",
          "mascotMood": "explaining",
          "visualEmoji": "🛑",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Amateurs view mistakes as defeat; CHAMPIONS treat mistakes as free data! 💡📊",
          "captionAr": "المبتدئ يعتبر الخطأ هزيمة، بينما الأبطال يعتبرون الخطأ معلومات وبيانات مجانية للتطوير! 💡📊",
          "mascotMood": "thinking",
          "visualEmoji": "💡",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Ask: Was the sign too small? Was the drink too sour? Was the corner too quiet? Tweak and relaunch! 🔧🚀",
          "captionAr": "اسأل نفسك: هل كانت اللافتة صغيرة؟ هل العصير حامض؟ هل الشارع هادئ؟ عدل وانطلق مجدداً! 🔧🚀",
          "mascotMood": "celebrating",
          "visualEmoji": "🔧",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Every master was once a disaster. The only true failure is quitting! 🏆",
          "captionAr": "كل خبير في العالم كان في بداياته يرتكب الأخطاء. الفشل الحقيقي الوحيد هو أن تستسلم! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How do top entrepreneurs react when a project fails to meet expectations?",
      "questionAr": "كيف يتعامل رواد الأعمال الناجحون عندما لا يحقق مشروعهم النتائج المرجوة في البداية؟",
      "options": [
        "They analyze what went wrong, adapt their strategy, and iterate with newfound knowledge",
        "They blame everyone else and swear never to try anything again",
        "They lock themselves in their bedroom and cry for 3 years",
        "They erase all records and pretend nothing happened"
      ],
      "optionsAr": [
        "يحللون أسباب الخلل، ويعدلون استراتيجيتهم، ويعاودون المحاولة بخبرة ومعرفة أفضل",
        "يلومون الآخرين ويقسمون على عدم المحاولة مرة أخرى أبداً",
        "يحبسون أنفسهم في الغرفة لسنوات حزناً على المحاولة",
        "يمسحون السجلات ويدعون أن شيئاً لم يحدث"
      ],
      "correctIndex": 0,
      "explanation": "Resilience and iterative learning turn setbacks into the ultimate competitive advantage.",
      "explanationAr": "المثابرة والتعلم من الأخطاء يحولان العثرات إلى أعظم ميزة تنافسية تصنع النجاح المستقبلي.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_delayed_marshmallow",
    "title": "The Marshmallow Test: Delayed Gratification is Wealth",
    "titleAr": "اختبار المارشميلو: الصبر وتأجيل الرغبات أساس الثروة",
    "description": "Eat 1 marshmallow now, or wait 15 minutes and get TWO marshmallows! Discover the single greatest predictor of future financial success.",
    "descriptionAr": "تناول قطعة مارشميلو الآن، أو انتظر 15 دقيقة واحصل على قطعتين! اكتشف المؤشر الأول للنجاح المالي المستقبلي.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "Delayed Gratification",
    "keyTermAr": "تأجيل الرغبات اللحظية",
    "likesCount": 2510,
    "viewsCount": 13800,
    "tags": [
      "psychology",
      "patience",
      "habits"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Stanford scientists put a soft, sugary marshmallow in front of young kids in a quiet room... 🍬",
          "captionAr": "وضع علماء جامعة ستانفورد قطعة مارشميلو سكرية أمام أطفال صغار في غرفة هادئة... 🍬",
          "mascotMood": "explaining",
          "visualEmoji": "🍬",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "\"You can eat it now, OR wait 15 minutes and earn a SECOND marshmallow!\" Some ate it instantly; others waited! ⏳",
          "captionAr": "\"يمكنك أكلها الآن، أو الانتظار 15 دقيقة والحصول على قطعة ثانية مجاناً!\" بعضهم أكلها فوراً، والبعض صبر! ⏳",
          "mascotMood": "thinking",
          "visualEmoji": "⏳",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Decades later, the kids who waited had higher grades, healthier habits, and significantly more wealth! 📈🎓",
          "captionAr": "بعد سنوات طويلة، وجدوا أن الأطفال الذين صبروا حققوا درجات أعلى وصحة أفضل وثروات أضخم بكثير! 📈🎓",
          "mascotMood": "celebrating",
          "visualEmoji": "🎓",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Delayed gratification is the CEO superpower: resist cheap treats today for empires tomorrow! 👑",
          "captionAr": "تأجيل الرغبات هو القوة الخارقة للقادة: قاوم الإغراءات السريعة اليوم لتبني إمبراطوريات الغد! 👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What did the famous Stanford Marshmallow Test prove?",
      "questionAr": "ما الذي أثبتته دراسة المارشميلو الشهيرة في جامعة ستانفورد؟",
      "options": [
        "The ability to delay gratification is a powerful predictor of future health and wealth",
        "Marshmallows taste better when dropped on the carpet",
        "Scientists really dislike sugary sweets",
        "Waiting 15 minutes makes clocks tick backward"
      ],
      "optionsAr": [
        "أن القدرة على تأجيل الرغبات والصبر تعتبر مؤشراً قوياً على النجاح والصحة والثراء المستقبلي",
        "أن المارشميلو يصبح ألذ إذا سقط على الأرض",
        "أن العلماء يكرهون الحلوى السكرية",
        "أن الانتظار لمدة 15 دقيقة يجعل عقارب الساعة تدور بالعكس"
      ],
      "correctIndex": 0,
      "explanation": "Discipline and self-control over short-term impulses compound into exceptional lifelong advantages.",
      "explanationAr": "الانضباط والتحكم في الرغبات اللحظية يمهدان لتحقيق إنجازات استثنائية على المدى الطويل.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_teamwork_superpower",
    "title": "Solo Genius vs Dream Team: The Power of Delegation",
    "titleAr": "العبقري الفردي وفريق الأحلام: قوة تفويض المهام",
    "description": "You can be the best chef, marketer, and accountant in the room, but you still only have 24 hours. Learn how dream teams scale empires.",
    "descriptionAr": "حتى لو كنت أمهر طاهٍ ومسوق ومحاسب معاً، فلن تملك سوى 24 ساعة في اليوم. تعلم كيف تبني فرق الأحلام وتفوض المهام.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Teamwork & Delegation",
    "keyTermAr": "العمل الجماعي وتفويض المهام",
    "likesCount": 2120,
    "viewsCount": 11000,
    "tags": [
      "leadership",
      "teamwork",
      "delegation"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If you try to bake the bread, clean the tables, manage the cash register, and deliver orders alone... you collapse! 😵‍💫",
          "captionAr": "إذا حاولت خبز الكعك، وتنظيف الطاولات، وإدارة الحسابات، وتوصيل الطلبات بمفردك... ستنهار من الإرهاق! 😵‍💫",
          "mascotMood": "explaining",
          "visualEmoji": "😵‍💫",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Great CEOs do not do everything themselves; they assemble a DREAM TEAM with complementary strengths! 🤝✨",
          "captionAr": "القادة العظماء لا يفعلون كل شيء بأنفسهم؛ بل يبنون فريق أحلام تتكامل فيه المهارات والمواهب! 🤝✨",
          "mascotMood": "thinking",
          "visualEmoji": "🤝",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Let the creative artist design the posters, while the math genius calculates profit margins! 🎨🔢",
          "captionAr": "دع الفنان يصمم الإعلانات المبهجة، بينما العبقري الرياضي يدقق الحسابات والأرباح! 🎨🔢",
          "mascotMood": "celebrating",
          "visualEmoji": "🎨",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Alone you can go fast, but TOGETHER you can build an empire that reaches the stars! 🚀",
          "captionAr": "بمفردك يمكنك الركض سريعاً، لكن مع فريق متكامل يمكنك بناء إمبراطورية تعانق النجوم! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the main benefit of delegating tasks to a team in business?",
      "questionAr": "ما هي الفائدة الأساسية لتفويض المهام وتوزيعها على أعضاء الفريق؟",
      "options": [
        "It allows each person to focus on their unique strengths, multiplying overall productivity and scale",
        "So the founder can play video games all afternoon and do zero work",
        "Because working alone is strictly forbidden by law",
        "To make the office louder and more chaotic"
      ],
      "optionsAr": [
        "يتيح لكل شخص التركيز على نقاط قوته الفريدة، مما يضاعف الإنتاجية والقدرة على التوسع",
        "ليتمكن صاحب المشروع من لعب ألعاب الفيديو طوال اليوم دون أي عمل",
        "لأن العمل الفردي ممنوع قانوناً في كل دول العالم",
        "لزيادة الضوضاء والفوضى داخل مساحة العمل"
      ],
      "correctIndex": 0,
      "explanation": "Delegation leverages collective intelligence and energy, allowing a venture to scale far beyond individual limits.",
      "explanationAr": "التفويض يستثمر طاقات الفريق المتنوعة، مما يسمح للمشروع بالنمو إلى آفاق تفوق طاقة الفرد الواحد.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_grit_determination",
    "title": "The 10,000 Hour Rule: Developing Unstoppable Grit",
    "titleAr": "قاعدة 10,000 ساعة: كيف تبني إصراراً لا يُقهر؟",
    "description": "Natural talent is nice, but GRIT is what builds championships. Discover the deliberate practice formula that turns beginners into legends.",
    "descriptionAr": "الموهبة وحدها لا تكفي؛ الإصرار والمثابرة هما ما يصنعان الأبطال الحقيقيين. اكتشف معادلة التدريب الواعي لتحقيق الإتقان.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Grit & Deliberate Practice",
    "keyTermAr": "الإصرار والممارسة الواعية",
    "likesCount": 2280,
    "viewsCount": 11900,
    "tags": [
      "grit",
      "mastery",
      "growth"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-orange-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When you watch a grandmaster chess player or Olympic skater, it looks effortless and magical! ⛸️♟️",
          "captionAr": "عندما تشاهد بطلاً في الشطرنج أو متزلجاً أولمبياً، يبدو أداؤه سهلاً وبسيطاً كالسحر! ⛸️♟️",
          "mascotMood": "explaining",
          "visualEmoji": "♟️",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "What you did NOT see was the 10,000 hours of gritty practice, cold mornings, and hundreds of falls! 🌧️💪",
          "captionAr": "لكنك لم تشهد 10,000 ساعة من التدريب الشاق، والصباحات الباردة، ومئات السقطات المؤلمة! 🌧️💪",
          "mascotMood": "thinking",
          "visualEmoji": "💪",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "GRIT is passion plus perseverance over years. Talent without effort is just unused potential! 💎",
          "captionAr": "الإصرار (Grit) هو الشغف مقترناً بالمثابرة لسنوات. الموهبة دون جهد هي مجرد طاقة مهدرة! 💎",
          "mascotMood": "celebrating",
          "visualEmoji": "💎",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Show up every single day, practice with focus, and your skills will compound like gold! 🏆",
          "captionAr": "تدرب بتركيز كل يوم، وستشاهد مهاراتك تتضاعف وتلمع كالذهب الخالص! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What matters more than raw talent according to performance psychologists?",
      "questionAr": "ما هو العامل الأكثر حسماً وتفوقاً على الموهبة الفطرية في علم النفس الإنجازي؟",
      "options": [
        "Grit: consistent deliberate practice and resilience through challenges over time",
        "Having expensive shoes and a lucky charm",
        "Never trying hard to avoid sweating",
        "Relying entirely on good luck"
      ],
      "optionsAr": [
        "المثابرة والإصرار (Grit): الممارسة اليومية المنتظمة وتجاوز التحديات بثبات",
        "امتلاك حذاء رياضي باهظ الثمن وتميمة حظ",
        "تجنب بذل الجهد حتى لا تشعر بالتعب",
        "الاعتماد الكلي على الحظ والمصادفة"
      ],
      "correctIndex": 0,
      "explanation": "Grit and deliberate practice consistently outperform natural talent in achieving mastery.",
      "explanationAr": "المثابرة والتمرين الواعي المستمر يتفوقان دائماً على الموهبة المجردة في بلوغ أعلى درجات الإتقان.",
      "xpReward": 20,
      "tokenReward": 15
    }
  },
  {
    "id": "vid_challenge_bake_sale",
    "title": "The 5-Dollar Cookie Challenge: Recipe to Revenue",
    "titleAr": "تحدي البسكويت: كيف تبدأ مشروعاً بـ 5 دولارات؟",
    "description": "Can you turn $5 worth of flour, butter, and chocolate chips into $25 of delicious homemade sales? Take the real-world cookie challenge!",
    "descriptionAr": "هل يمكنك تحويل 5 دولارات من الدقيق والزبدة ورقائق الشوكولاتة إلى 25 دولاراً من المبيعات المنزلية؟ شارك في التحدي العملي!",
    "category": "Challenge",
    "duration": "0:42",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Hands-on Business",
    "keyTermAr": "مشروع تطبيقي واقعي",
    "likesCount": 3100,
    "viewsCount": 15200,
    "tags": [
      "challenge",
      "baking",
      "realworld"
    ],
    "challenge": {
      "id": "ch_cookie_challenge",
      "title": "Run a Mini Cookie Stand",
      "titleAr": "إطلاق كشك البسكويت المنزلي",
      "description": "Bake a batch of fresh cookies with family assistance, calculate your ingredient costs, package them with cute labels, and make your first sales!",
      "descriptionAr": "اخبز دفعة من البسكويت المنزلي بمساعدة أسرتك، واحسب تكلفة المكونات، وضع ملصقاً أنيقاً، وحقق أول مبيعاتك الحقيقية!",
      "instructions": [
        "List your ingredient costs (flour, sugar, butter) - goal under $5 total",
        "Bake 12 to 18 cookies with adult supervision",
        "Design a small colorful menu card with pricing ($1.50 each or 3 for $4)",
        "Sell to willing family members, neighbors, or friends",
        "Upload a picture of your baked treats and earnings tally to claim your badge!"
      ],
      "instructionsAr": [
        "سجل تكلفة المكونات (الدقيق، السكر، الزبدة) - الهدف أقل من 5 دولارات",
        "اخبز من 12 إلى 18 قطعة بسكويت بإشراف وتوجيه أحد الوالدين",
        "صمم بطاقة أسعار مرحة (مثلاً قطعة بـ 1.50$ أو 3 قطع بـ 4$ كعرض توفير)",
        "اعرضها على أفراد العائلة أو الأصدقاء أو الجيران وحقق أول مبيعاتك",
        "التقط صورة لمنتجاتك اللذيذة مع ورقة الحسابات وارفعها لتحصل على وسام القائد!"
      ],
      "rewardXp": 100,
      "rewardTokens": 50,
      "proofType": "photo"
    },
    "animationConfig": {
      "themeColor": "from-amber-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 8,
          "caption": "Ready to graduate from simulator games to REAL WORLD CASH? Welcome to the Cookie Challenge! 🍪",
          "captionAr": "هل أنت مستعد للانتقال من شاشات الألعاب إلى الأرباح الواقعية الحقيقية؟ مرحباً بك في تحدي البسكويت! 🍪",
          "mascotMood": "excited",
          "visualEmoji": "🍪",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Step 1: Budget! $2 flour, $2 butter, $1 chocolate chips = $5 total cost for 15 cookies! 🧈🍫",
          "captionAr": "الخطوة 1: الميزانية! دولارين دقيق، ودولارين زبدة، ودولار شوكولاتة = 5 دولارات تكلفة 15 قطعة! 🧈🍫",
          "mascotMood": "thinking",
          "visualEmoji": "🍫",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Step 2: Price for profit! Sell each cookie for $1.50 or offer a 3-pack combo for $4.00! 🏷️💰",
          "captionAr": "الخطوة 2: التسعير المربح! بع القطعة بـ 1.50 دولار أو اعرض باقة 3 قطع بـ 4 دولارات! 🏷️💰",
          "mascotMood": "celebrating",
          "visualEmoji": "🏷️",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 9,
          "caption": "Sell all 15 and collect $20! Pay back your $5 loan and keep $15 pure profit! You are an official CEO! 🏆",
          "captionAr": "بع الـ 15 قطعة واجمع 20 دولاراً! أعد الـ 5 دولارات لأهلك واحتفظ بـ 15 دولاراً كربح صافٍ! أنت قائد رسمي! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "If ingredients cost $5 and you generate $20 in sales, what is your net profit?",
      "questionAr": "إذا كانت تكلفة المكونات 5 دولارات وحققت 20 دولاراً في المبيعات، فما هو صافي ربحك؟",
      "options": [
        "$15 pure profit ($20 revenue minus $5 cost)",
        "$25 profit",
        "$0 profit because you ate all the cookies",
        "$100 profit"
      ],
      "optionsAr": [
        "15 دولاراً صافي ربح (20 دولاراً إيرادات مطروحاً منها 5 دولارات تكاليف)",
        "25 دولاراً أرباح",
        "صفر دولار لأنك أكلت كل البسكويت بمفردك",
        "100 دولار أرباح"
      ],
      "correctIndex": 0,
      "explanation": "Net Profit = Total Revenue ($20) minus Total Expenses ($5) = $15.",
      "explanationAr": "صافي الربح = إجمالي الإيرادات (20$) مطروحاً منه إجمالي التكاليف (5$) = 15$.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_challenge_car_wash",
    "title": "Neighborhood Shine: Your First Service Business",
    "titleAr": "تحدي غسيل السيارات: مشروعك الخدمي الأول",
    "description": "You do not need factory machines to start a business. A bucket, sponge, and energetic teamwork can turn dirty cars into gleaming cash!",
    "descriptionAr": "لا تحتاج إلى مصانع ضخمة لتبدأ مشروعك! دلو وإسفنجة وعمل جماعي نشط يمكنهم تحويل السيارات المتسخة إلى أرباح حقيقية ممتازة.",
    "category": "Challenge",
    "duration": "0:41",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_allowance_system.jpg",
    "fullPosterUrl": "/images/videos/clip_allowance_system.jpg",
    "keyTerm": "Service Business Quest",
    "keyTermAr": "مشروع قطاع الخدمات",
    "likesCount": 2840,
    "viewsCount": 14600,
    "tags": [
      "service",
      "challenge",
      "teamwork"
    ],
    "challenge": {
      "id": "ch_car_wash",
      "title": "Wash 2 Family Cars",
      "titleAr": "تحدي غسيل سيارتين للعائلة",
      "description": "Prepare cleaning supplies, offer a wash & shine service to parents or relatives, provide top-tier care, and earn your first service revenue!",
      "descriptionAr": "جهز أدوات التنظيف اللطيفة، واعرض خدمة غسيل وتلميع لسيارة والديك أو أقاربك، وقدم خدمة ممتازة واكسب دخلك الخدمي الأول!",
      "instructions": [
        "Gather a bucket, mild car soap, microfiber towels, and garden hose",
        "Agree on a fair price with family (e.g. $8 to $12 per car)",
        "Clean wheels, windows, and exterior with thorough care",
        "Dry with microfiber cloth to prevent water spots",
        "Upload a before/after photo to unlock your Service Master trophy!"
      ],
      "instructionsAr": [
        "جهز دلواً، صابوناً مخصصاً، مناشف مايكروفايبر، وخرطوم مياه",
        "اتفق على سعر عادل مع والديك أو أقاربك (مثلاً من 8 إلى 12 دولاراً للسيارة)",
        "اغسل الإطارات والنوافذ والهيكل بعناية ودقة وأمان",
        "جفف السطح جيداً بقطعة قماش ناعمة لمنع بقع الماء",
        "ارفع صورة للسيارة قبل وبعد الغسيل لتفتح وسام خبير الخدمات!"
      ],
      "rewardXp": 100,
      "rewardTokens": 50,
      "proofType": "photo"
    },
    "animationConfig": {
      "themeColor": "from-blue-500 to-cyan-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-cyan-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 8,
          "caption": "Selling physical items requires buying materials. But SERVICE businesses sell your SKILLS and WORK! 🚗✨",
          "captionAr": "بيع المنتجات يتطلب شراء بضائع، بينما \"المشاريع الخدمية\" تبيع مهاراتك ووقتك واجتهادك المباشر! 🚗✨",
          "mascotMood": "explaining",
          "visualEmoji": "🚗",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Grab a bucket, soapy sponge, and dry microfiber cloths. Every neighbor has a car that needs love! 🧽🫧",
          "captionAr": "أحضر دلواً وإسفنجة رغوية ومناشف تجفيف. كل سيارة في الحي تحتاج إلى عناية ولمعان! 🧽🫧",
          "mascotMood": "excited",
          "visualEmoji": "🧽",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Offer extra sparkle: shine the hubcaps or clean the floor mats for an extra $2 tip! 🛞💎",
          "captionAr": "قدم لمسة إضافية مميزة: لمع الإطارات أو نظف الدواسات الداخلية لتحصل على إكرامية إضافية! 🛞💎",
          "mascotMood": "celebrating",
          "visualEmoji": "💎",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Two clean cars = $20 in your pocket! High pride, zero debt, 100% honest hustle! 🏆",
          "captionAr": "سيارتان لامعتان = 20 دولاراً في جيبك! فخر عظيم، وصفر ديون، وعمل شريف ومثمر! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a major financial benefit of starting a service business like car washing?",
      "questionAr": "ما هي الميزة المالية الكبرى للمشاريع الخدمية مثل غسيل السيارات؟",
      "options": [
        "Extremely low startup costs since you primarily leverage your own labor and basic household supplies",
        "You never need to use water or soap",
        "Cars automatically wash themselves when you stare at them",
        "The government pays you $1000 per washed tire"
      ],
      "optionsAr": [
        "تكاليف بدء تشغيل منخفضة للغاية لأنك تعتمد بشكل أساسي على مجهودك وأدوات منزلية بسيطة",
        "أنك لا تحتاج لاستخدام الماء أو الصابون إطلاقاً",
        "أن السيارات تغسل نفسها بمجرد النظر إليها",
        "أن البلدية تمنحك 1000 دولار عن كل إطار نظيف"
      ],
      "correctIndex": 0,
      "explanation": "Service businesses boast high margins and minimal upfront capital risk compared to manufacturing.",
      "explanationAr": "المشاريع الخدمية تمتاز بهوامش ربح مرتفعة ومخاطر رأس مال منخفضة جداً مقارنة بصناعة المنتجات.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_challenge_budget_audit",
    "title": "The Household Expense Detective: Family Audit Quest",
    "titleAr": "مهمة محقق المصروفات: أين تتسرب أموال العائلة؟",
    "description": "Put on your detective hat! Interview your parents, inspect monthly receipts, find 2 unused subscriptions or energy leaks, and save your family real cash!",
    "descriptionAr": "ارتدِ قبعة المحقق الذكي! ساعد عائلتك في فحص فواتير واشتراكات الشهر، واكتشف خدمتين مهملتين أو هدر طاقة لتوفير مئات الدولارات سنوياً!",
    "category": "Challenge",
    "duration": "0:43",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_allowance_system.jpg",
    "fullPosterUrl": "/images/videos/clip_allowance_system.jpg",
    "keyTerm": "Family Expense Audit",
    "keyTermAr": "تدقيق المصروفات العائلية",
    "likesCount": 3450,
    "viewsCount": 16800,
    "tags": [
      "family",
      "audit",
      "savings"
    ],
    "challenge": {
      "id": "ch_family_audit",
      "title": "Conduct a Family Expense Audit",
      "titleAr": "إجراء تدقيق مالي لمصروفات الأسرة",
      "description": "Sit down with your parents, review 3 utility bills or app subscriptions, identify 1 area of savings, and propose a smart conservation plan!",
      "descriptionAr": "اجلس مع والديك وراجع معهما 3 فواتير أو اشتراكات شهرية، وحدد بنداً يمكن ترشيده، واقترح خطة توفير ذكية للأسرة!",
      "instructions": [
        "Ask parents politely to review the electric bill, grocery receipts, or streaming subscriptions",
        "Search for subscriptions that nobody watches or lights left on in empty rooms",
        "Calculate how much money canceling one $10/mo unused app saves in a full year ($120!)",
        "Present your findings to your family council with a friendly smile",
        "Record your savings victory and submit your report to earn your Master Financial Auditor certificate!"
      ],
      "instructionsAr": [
        "اطلب من والديك بلطف مراجعة فاتورة الكهرباء أو إيصالات المشتريات أو الاشتراكات الترفيهية",
        "ابحث عن تطبيق لا يستخدمه أحد أو أنوار تُترك مضاءة في الغرف الفارغة",
        "احسب كم توفر العائلة إذا ألغت اشتراكاً بقيمة 10$ شهرياً خلال عام كامل (120 دولاراً!)",
        "اعرض اكتشافاتك الذكية على مجلس العائلة بابتسامة وفخر",
        "سجل تقريرك التوفيري في المنصة لتحصل على شهادة \"المدقق المالي المعتمد\"!"
      ],
      "rewardXp": 120,
      "rewardTokens": 60,
      "proofType": "photo"
    },
    "animationConfig": {
      "themeColor": "from-amber-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 8,
          "caption": "Money flows into households every month, but silent leaks drain it away like a dripping faucet! 🚰💸",
          "captionAr": "المال يدخل كل شهر، لكن التسريبات الصامتة تستنزفه كصنبور ماء يسرب قطراته دون انتباه! 🚰💸",
          "mascotMood": "explaining",
          "visualEmoji": "🚰",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Unused streaming apps, forgotten gym memberships, and blasting air conditioning with windows open! 📺❄️",
          "captionAr": "اشتراكات برامج منسية لا يتابعها أحد، وأجهزة تكييف تعمل والنوافذ مفتوحة! 📺❄️",
          "mascotMood": "thinking",
          "visualEmoji": "📺",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Put on your detective magnifying glass! Audit the receipts with your parents and plug the leaks! 🔍🧾",
          "captionAr": "ارتدِ نظارة المحقق المالي! دقق الإيصالات مع والديك وسد منافذ الهدر فوراً! 🔍🧾",
          "mascotMood": "celebrating",
          "visualEmoji": "🔍",
          "visualType": "store",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 9,
          "caption": "Saving $100 a month puts $1,200 extra into your family holiday or college fund! You are a family hero! 🏆🌟",
          "captionAr": "توفير 100 دولار شهرياً يضيف 1,200 دولار إضافية لصندوق إجازة العائلة أو دراستك! أنت بطل الأسرة! 🏆🌟",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How much money does canceling a single unused $15 monthly subscription save over 2 full years?",
      "questionAr": "كم من المال توفره إذا ألغيت اشتراكاً شهرياً غير مستخدم بقيمة 15 دولاراً على مدار عامين كاملين؟",
      "options": [
        "$360 ($15 × 24 months)",
        "$15 total",
        "$30 total",
        "$1,000,000 total"
      ],
      "optionsAr": [
        "360 دولاراً (15 دولاراً × 24 شهراً)",
        "15 دولاراً فقط",
        "30 دولاراً فقط",
        "مليون دولار بالتمام"
      ],
      "correctIndex": 0,
      "explanation": "Recurring monthly subscriptions accumulate silently: $15/mo is $180/year and $360 every two years!",
      "explanationAr": "الاشتراكات الشهرية تتراكم بصمت: 15$ شهرياً تعني 180$ سنوياً و360$ خلال عامين كاملين!",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_cash_flow_oxygen",
    "title": "Cash Flow vs Profit: The Oxygen of Every Business",
    "titleAr": "التدفق النقدي مقابل الأرباح: أكسجين بقاء أي مشروع",
    "description": "You can be profitable on paper and still go bankrupt tomorrow! Discover why cash flow is the true oxygen of business.",
    "descriptionAr": "قد تكون شركتك رابحة على الورق ومع ذلك تفلس غداً! اكتشف لماذا يعتبر التدفق النقدي هو الأكسجين الحقيقي للمشروع.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "Cash Flow",
    "keyTermAr": "التدفق النقدي (Cash Flow)",
    "likesCount": 2450,
    "viewsCount": 13200,
    "tags": [
      "finance",
      "cashflow",
      "accounting"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine selling $1,000 worth of toys today, but the customer promises to pay you NEXT YEAR! 📅",
          "captionAr": "تخيل أنك بعت ألعاباً بقيمة 1,000 دولار اليوم، لكن الزبون وعدك بالدفع في العام القادم! 📅",
          "mascotMood": "explaining",
          "visualEmoji": "📅",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "On paper, you have $1,000 in revenue! But how will you pay your workers this Friday? You have NO CASH! 😱",
          "captionAr": "على الورق، حققت 1,000 دولار مبيعات! ولكن كيف ستدفع لعمالك يوم الجمعة؟ خزينتك خالية من الكاش! 😱",
          "mascotMood": "thinking",
          "visualEmoji": "💸",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "PROFIT is what is left after costs. CASH FLOW is actual money moving into and out of your bank right now! 🌊",
          "captionAr": "الربح هو ما يتبقى بعد حساب التكاليف، بينما التدفق النقدي هو حركة السيولة الفعلية داخل وخارج حسابك! 🌊",
          "mascotMood": "celebrating",
          "visualEmoji": "🌊",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Keep positive cash flow, never run dry, and your business can survive any economic winter! 🏆",
          "captionAr": "حافظ على تدفق نقدي إيجابي دائماً، ولن يتعطل مشروعك حتى في أصعب الأزمات الاقتصادية! 🏆",
          "mascotMood": "happy",
          "visualEmoji": "🛡️",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why can a business go bankrupt even if it made sales on paper?",
      "questionAr": "لماذا قد تتعرض شركة للإفلاس حتى لو كانت تسجل مبيعات على الورق؟",
      "options": [
        "Because customers haven’t paid yet and the company ran out of cash to pay daily expenses",
        "Because the bank lost all account numbers",
        "Because employees prefer receiving candy instead of money",
        "Because the store painted its walls purple"
      ],
      "optionsAr": [
        "لأن العملاء لم يدفعوا بعد ونفدت السيولة النقدية اللازمة لدفع المصاريف اليومية",
        "لأن البنك أضاع أرقام الحسابات البنكية",
        "لأن الموظفين طلبوا مكافآت من الحلوى بدل النقود",
        "لأن المتجر طلى جدرانه باللون البنفسجي"
      ],
      "correctIndex": 0,
      "explanation": "Cash flow measures timing: if money goes out faster than cash comes in, operations halt.",
      "explanationAr": "التدفق النقدي يرتبط بالتوقيت: إذا خرجت الأموال قبل دخول السيولة النقدية تتوقف أعمال الشركة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_cac_explained",
    "title": "Customer Acquisition Cost: How Much Does a Fan Cost?",
    "titleAr": "تكلفة اكتساب العميل (CAC): كم يكلفك الزبون الجديد؟",
    "description": "If you spend $50 on posters to attract 10 paying customers, your CAC is $5. Learn why keeping this low makes fortunes.",
    "descriptionAr": "إذا أنفقت 50 دولاراً على الإعلانات لتجذب 10 زبائن، فإن تكلفة العميل هي 5 دولارات. تعلم سر قياس ومضاعفة هذا المقياس.",
    "category": "Strategy",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "CAC (Acquisition Cost)",
    "keyTermAr": "تكلفة اكتساب العميل (CAC)",
    "likesCount": 1980,
    "viewsCount": 9400,
    "tags": [
      "marketing",
      "strategy",
      "metrics"
    ],
    "animationConfig": {
      "themeColor": "from-purple-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You spend $20 printing shiny flyers for your new robot tutoring club! 🖨️📄",
          "captionAr": "أنفقت 20 دولاراً لطباعة منشورات ملونة تعلن عن ناديك الجديد لتعليم الروبوت! 🖨️📄",
          "mascotMood": "explaining",
          "visualEmoji": "📄",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "From those flyers, exactly 4 new students sign up and pay their dues! 🎓",
          "captionAr": "بفضل تلك المنشورات، اشترك معك 4 طلاب جدد ودفعوا رسوم الانضمام! 🎓",
          "mascotMood": "excited",
          "visualEmoji": "🎓",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "Divide $20 by 4 students = $5 per customer! That is your CUSTOMER ACQUISITION COST (CAC)! 🧮",
          "captionAr": "اقسم 20 دولاراً على 4 طلاب = 5 دولارات للعميل! هذه هي تكلفة اكتساب العميل (CAC)! 🧮",
          "mascotMood": "thinking",
          "visualEmoji": "🧮",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "If each student pays you $20, you make big profits! If they only pay $3, your marketing is losing money! 🚀",
          "captionAr": "إذا دفع كل طالب 20 دولاراً، فأنت تحقق أرباحاً ممتازة! أما لو دفع 3 دولارات فقط فإعلاناتك تخسر! 🚀",
          "mascotMood": "celebrating",
          "visualEmoji": "💡",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How do you calculate Customer Acquisition Cost (CAC)?",
      "questionAr": "كيف تحسب تكلفة اكتساب العميل (CAC) بدقة؟",
      "options": [
        "Total marketing costs divided by the number of new customers acquired",
        "Total money inside your savings piggy bank",
        "Number of likes on your social media photo",
        "Price of the highest item in your inventory"
      ],
      "optionsAr": [
        "إجمالي تكاليف التسويق مقسوماً على عدد العملاء الجدد المكتسبين",
        "إجمالي النقود المتوفرة في حصالتك المنزلية",
        "عدد الإعجابات على منشورك في وسائل التواصل",
        "سعر أغلى منتج معروض في متجرك"
      ],
      "correctIndex": 0,
      "explanation": "CAC divides all acquisition expenditures by acquired clients to evaluate marketing health.",
      "explanationAr": "تكلفة الاكتساب تقسم كل مصروفات الإعلانات والتسويق على عدد المشتركين الجدد لتقييم كفاءة الخطة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_ltv_concept",
    "title": "Customer Lifetime Value (LTV): The Golden Customer",
    "titleAr": "القيمة الدائمة للعميل (LTV): الكنز المستمر",
    "description": "A customer buying a $2 ice cream every week for 3 years spends $312 with you! Master the magical formula of LTV > 3x CAC.",
    "descriptionAr": "زبون يشتري مثلجات بدولارين كل أسبوع لمدة 3 سنوات ينفق معك 312 دولاراً! اكتشف المعادلة الذهبية لنمو الشركات.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Lifetime Value (LTV)",
    "keyTermAr": "القيمة الدائمة للعميل (LTV)",
    "likesCount": 2110,
    "viewsCount": 10500,
    "tags": [
      "strategy",
      "growth",
      "customers"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-yellow-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-yellow-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Never look at a customer as just a single $5 transaction. Look at the LIFETIME relationship! 🤝",
          "captionAr": "إياك أن تنظر إلى الزبون على أنه مجرد صفقة واحدة بـ 5 دولارات! بل انظر إلى العلاقة طوال سنوات تعامله معك! 🤝",
          "mascotMood": "explaining",
          "visualEmoji": "🤝",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "If a loyal friend visits your bakery twice a month for 2 years, they spend over $240 with you! 🥐",
          "captionAr": "إذا زار صديق مخلص مخبزك مرتين شهرياً لمدة عامين، فسينفق معك أكثر من 240 دولاراً! 🥐",
          "mascotMood": "excited",
          "visualEmoji": "🥐",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That total expected revenue across their entire journey is called LIFETIME VALUE (LTV)! 📈",
          "captionAr": "إجمالي العائد المتوقع من العميل طوال فترة ولائه يسمى \"القيمة الدائمة للعميل\" (LTV)! 📈",
          "mascotMood": "celebrating",
          "visualEmoji": "📈",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Rule of great startups: Your customer LTV should be at least 3 times higher than your CAC! 🚀",
          "captionAr": "قاعدة الشركات العالمية الكبرى: يجب أن تكون قيمة العميل (LTV) أكبر بثلاث مرات على الأقل من تكلفة جذبه (CAC)! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is Customer Lifetime Value (LTV)?",
      "questionAr": "ما هي القيمة الدائمة للعميل (Customer Lifetime Value)؟",
      "options": [
        "The total estimated money a customer spends with your business over their whole relationship",
        "The age of the customer in years",
        "The amount of hours the store is open each day",
        "How many receipts are stored in the register"
      ],
      "optionsAr": [
        "إجمالي المبالغ التقديرية التي ينفقها العميل في مشروعك طوال فترة تعامله معك",
        "عمر العميل مقاساً بالسنوات",
        "عدد الساعات التي يفتح فيها المتجر يومياً",
        "عدد الإيصالات الورقية المخزنة في صندوق الكاشير"
      ],
      "correctIndex": 0,
      "explanation": "LTV calculates the cumulative gross revenue an average customer brings during their patronage.",
      "explanationAr": "القيمة الدائمة تحسب إجمالي الإيرادات المتراكمة التي يحققها العميل المعتاد طوال فترة استخدامه لخدماتك.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_break_even_point",
    "title": "The Break-Even Point: When Losses Turn into Profits",
    "titleAr": "نقطة التعادل: اللحظة التي تبدأ فيها الأرباح الحقيقية",
    "description": "You built a lemonade stand that cost $30 in wood. Each cup costs $1 to make and sells for $2. When do you break even?",
    "descriptionAr": "أنفقت 30 دولاراً لصنع كشك خشبي، وكوب العصير يكلف دولاراً ويباع بدولارين. متى تصل إلى نقطة التعادل وتبدأ جني الأرباح؟",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Break-Even Point",
    "keyTermAr": "نقطة التعادل (Break-Even)",
    "likesCount": 1820,
    "viewsCount": 8900,
    "tags": [
      "finance",
      "breakeven",
      "math"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Before selling a single item, you had fixed setup costs: tools, table, and signs! 🔨🪧",
          "captionAr": "قبل أن تبيع أي كوب، تحملت تكاليف تأسيس ثابتة: الخشب، الطاولة، واللوحة الإعلانية! 🔨🪧",
          "mascotMood": "explaining",
          "visualEmoji": "🔨",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Each item sold pays off a small slice of that initial debt until you reach ZERO loss! ⚖️",
          "captionAr": "كل قطعة تبيعها تسدد جزءاً صغيراً من تلك التكاليف حتى تصل إلى مرحلة انعدام الخسارة تماماً! ⚖️",
          "mascotMood": "thinking",
          "visualEmoji": "⚖️",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "The exact moment total revenue EQUALS total expenses is the BREAK-EVEN POINT! 🎯",
          "captionAr": "اللحظة الدقيقة التي تتساوى فيها إيراداتك الإجمالية مع كافة تكاليفك تسمى \"نقطة التعادل\"! 🎯",
          "mascotMood": "celebrating",
          "visualEmoji": "🎯",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Every single sale past that magical line is PURE NET PROFIT in your company treasury! 🚀🏆",
          "captionAr": "كل عملية بيع بعد هذا الخط الذهبي تصبح ربحاً صافياً يدخل خزينتك مباشرة! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the \"Break-Even Point\" in business?",
      "questionAr": "ما هي \"نقطة التعادل\" في عالم المال والأعمال؟",
      "options": [
        "The point where total revenue equals total costs, meaning zero profit and zero loss",
        "When a store decides to break its cash register",
        "The moment all inventory expires and is thrown away",
        "When you double the price of every item in one day"
      ],
      "optionsAr": [
        "النقطة التي تتساوى عندها الإيرادات مع المصاريف تماماً دون ربح أو خسارة",
        "اللحظة التي تقرر فيها كسر حصالتك النقدية",
        "وقت انتهاء صلاحية كل المنتجات في المستودع",
        "عند مضاعفة أسعار المنتجات في يوم واحد"
      ],
      "correctIndex": 0,
      "explanation": "At break-even, all accumulated expenses are covered; further sales generate true profits.",
      "explanationAr": "عند نقطة التعادل، تكون كل التكاليف قد سُددت، وتبدأ المبيعات اللاحقة بتحقيق الأرباح الصافية.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_freemium_strategy",
    "title": "The Freemium Secret: Why Games Give Free Passes",
    "titleAr": "سر نموذج الفريميوم: لماذا تمنحك الألعاب وصولاً مجانياً؟",
    "description": "Roblox, Fortnite, and Duolingo are free to start. So how do they make billions? Learn the art of the Freemium business model.",
    "descriptionAr": "روبلوكس وفورتنايت وتطبيقات اللغات مجانية تماماً في البداية. كيف تحقق مليارات؟ اكتشف قوة نموذج الفريميوم.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Freemium Model",
    "keyTermAr": "نموذج الفريميوم (Freemium)",
    "likesCount": 2680,
    "viewsCount": 14200,
    "tags": [
      "apps",
      "gaming",
      "businessmodel"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Why do popular apps let millions of people play or study for zero dollars? Are they charities? 🎮",
          "captionAr": "لماذا تسمح التطبيقات الشهيرة لملايين المستخدمين باللعب أو التعلم مجاناً؟ هل هي جمعيات خيرية؟ 🎮",
          "mascotMood": "thinking",
          "visualEmoji": "🎮",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Not at all! FREE + PREMIUM = FREEMIUM! The free tier attracts millions of loyal fans! 🌐",
          "captionAr": "كلا على الإطلاق! مجاني + مميز = فريميوم! الخدمة المجانية تجذب ملايين المعجبين بسرعة البرق! 🌐",
          "mascotMood": "explaining",
          "visualEmoji": "🌐",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Around 5% of those users gladly pay for cool skins, premium features, and ad-free superpowers! 💎✨",
          "captionAr": "حوالي 5% من هؤلاء يسعدون بشراء أزياء حصرية، أو مزايا إضافية، أو إلغاء الإعلانات! 💎✨",
          "mascotMood": "celebrating",
          "visualEmoji": "💎",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "That small percentage of passionate buyers pays for the entire network and yields massive profits! 🚀",
          "captionAr": "تلك النسبة الصغيرة من المشتركين المتحمسين تكفي لتغطية تكاليف الشبكة وتحقيق أرباح خيالية! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How do \"Freemium\" apps make substantial profits?",
      "questionAr": "كيف تحقق تطبيقات \"الفريميوم\" أرباحاً هائلة؟",
      "options": [
        "By offering core services free to build a huge audience, while charging a subset for premium upgrades",
        "By demanding credit cards before allowing anyone to download",
        "By secretly selling the office desks",
        "By shutting down after 30 days of operation"
      ],
      "optionsAr": [
        "بتقديم الخدمة الأساسية مجاناً لجذب جمهور ضخم، وتحصيل رسوم من الراغبين في مزايا احترافية",
        "بطلب بطاقات بنكية إلزامية قبل السماح بتحميل التطبيق",
        "ببيع مكاتب الشركة سراً",
        "بإغلاق التطبيق نهائياً بعد 30 يوماً من إطلاقه"
      ],
      "correctIndex": 0,
      "explanation": "Freemium lowers friction to build viral reach, monetizing power users who want advanced value.",
      "explanationAr": "نموذج الفريميوم يزيل حواجز الدخول لبناء قاعدة جماهيرية واسعة، ثم يستثمر في المستخدمين المميزين.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_subscription_power",
    "title": "The Subscription Engine: Recurring Revenue Magic",
    "titleAr": "محرك الاشتراكات: سحر الإيرادات المتكررة",
    "description": "Why do Netflix and Spotify charge $10 every month instead of $120 all at once? Master the steady engine of predictable income.",
    "descriptionAr": "لماذا تتقاضى نتفليكس وسبوتيفاي 10 دولارات شهرياً بدل 120 دولاراً دفعة واحدة؟ اكتشف قوة الدخل المتكرر التراكمي.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Recurring Revenue (ARR)",
    "keyTermAr": "الإيرادات المتكررة (Recurring Revenue)",
    "likesCount": 2340,
    "viewsCount": 11900,
    "tags": [
      "subscription",
      "saas",
      "cashflow"
    ],
    "animationConfig": {
      "themeColor": "from-cyan-500 to-blue-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-cyan-950 to-blue-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Selling a bicycle brings you money ONCE. If you want more, you must find another customer! 🚲",
          "captionAr": "بيع دراجة هوائية يمنحك مالاً لمرة واحدة فقط! إذا أردت المزيد، يجب أن تبحث عن مشترٍ جديد! 🚲",
          "mascotMood": "explaining",
          "visualEmoji": "🚲",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "With a subscription, customers agree to pay you a small fee EVERY SINGLE MONTH automatically! 🔄",
          "captionAr": "في نموذج الاشتراك، يوافق العميل على دفع مبلغ بسيط كل شهر تلقائياً مقابل خدمات متواصلة! 🔄",
          "mascotMood": "thinking",
          "visualEmoji": "🔄",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "100 subscribers at $5 each = $500 entering your bank reliably month after month! 📅💰",
          "captionAr": "100 مشترك يدفع كل منهم 5 دولارات = 500 دولار تدخل حسابك بانتظام موثوق شهراً بعد شهر! 📅💰",
          "mascotMood": "celebrating",
          "visualEmoji": "💰",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Predictable income lets you plan budgets, hire the best talent, and build long-term greatness! 🚀",
          "captionAr": "الدخل المضمون والمتكرر يتيح لك التخطيط الدقيق وتوظيف المبدعين وبناء مستقبل مزدهر! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why do companies love subscription business models?",
      "questionAr": "لماذا تفضل الشركات الناشئة نموذج الاشتراكات الشهرية؟",
      "options": [
        "Because it provides predictable, recurring revenue every month",
        "Because customers forget their passwords immediately",
        "Because it is illegal to sell physical products anymore",
        "Because it eliminates the need to provide any customer service"
      ],
      "optionsAr": [
        "لأنه يوفر تدفقات نقدية متوقعة ومتكررة ومستقرة كل شهر",
        "لأن العملاء ينسون كلمات السر الخاصة بحساباتهم",
        "لأنه أصبح ممنوعاً بيع البضائع الملموسة",
        "لأنه يلغي الحاجة لتقديم أي خدمة عملاء"
      ],
      "correctIndex": 0,
      "explanation": "Subscriptions create recurring predictable revenue streams (MRR/ARR) that stabilize businesses.",
      "explanationAr": "الاشتراكات تصنع إيرادات شهرية متكررة وموثوقة تمنح المشروع أماناً مالياً وقدرة على التوسع.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_angels_vs_vc",
    "title": "Angel Investors vs VC: Who Fuels the Startup Rocket?",
    "titleAr": "المستثمر الملاك ضد رأس المال الجريء: من يمول صاروخ شركتك؟",
    "description": "Need $20,000 to build your first prototype or $10 Million to conquer the planet? Learn who writes the big startup checks.",
    "descriptionAr": "هل تحتاج 20 ألف دولار لبناء النموذج الأولي أم 10 ملايين لغزو العالم؟ تعرف على المستثمرين وكيف يختارون المشاريع.",
    "category": "Finance",
    "duration": "0:39",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Angel Investor & Venture Capital",
    "keyTermAr": "المستثمر الملاك ورأس المال الجريء",
    "likesCount": 2090,
    "viewsCount": 10800,
    "tags": [
      "investing",
      "venturecapital",
      "startups"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You have a world-changing app idea, but your bank account has only $15. How do you build it? 💡",
          "captionAr": "لديك فكرة تطبيق ستغير العالم، لكن رصيدك المالي 15 دولاراً فقط! كيف تبنيه؟ 💡",
          "mascotMood": "explaining",
          "visualEmoji": "💡",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "An ANGEL INVESTOR is a wealthy person who uses their OWN money to back early-stage founders! 😇💵",
          "captionAr": "المستثمر الملاك (Angel) هو شخص ثري وذكي يستثمر من أمواله الخاصة لمساعدة أصحاب الأفكار المبتكرة! 😇💵",
          "mascotMood": "excited",
          "visualEmoji": "😇",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "VENTURE CAPITAL (VC) is a big professional fund that invests MILLIONS of other people’s dollars! 🏦🚀",
          "captionAr": "أما شركات رأس المال الجريء (VC) فهي صناديق عملاقة تضخ ملايين الدولارات لتوسيع المشاريع الناجحة عالمياً! 🏦🚀",
          "mascotMood": "thinking",
          "visualEmoji": "🏦",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "In exchange, both receive ownership shares (equity). When your company goes big, everyone wins! 🤝🌟",
          "captionAr": "في المقابل، يحصل المستثمر على حصة ملكية (أسهم). وعندما تنجح الشركة وتكبر، يربح الجميع معاً! 🤝🌟",
          "mascotMood": "celebrating",
          "visualEmoji": "🌟",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the primary difference between an Angel Investor and a Venture Capital (VC) fund?",
      "questionAr": "ما هو الفرق الأساسي بين المستثمر الملاك وصندوق رأس المال الجريء (VC)؟",
      "options": [
        "Angels invest their own personal wealth into early ideas, while VCs manage pooled institutional funds for big scaling",
        "Angels wear real wings to boardroom meetings",
        "VCs only invest in video game arcades",
        "Angels keep 100% of your company and fire you immediately"
      ],
      "optionsAr": [
        "الملاك يستثمر من ماله الشخصي في المراحل الأولى، بينما صناديق الـ VC تدير أموال مستثمرين بمبالغ ضخمة للتوسع الكبير",
        "المستثمر الملاك يرتدي أجنحة في اجتماعات العمل",
        "صناديق الـ VC تستثمر في صالات ألعاب الفيديو فقط",
        "المستثمر الملاك يستولي على الشركة بالكامل ويطرد المؤسسين"
      ],
      "correctIndex": 0,
      "explanation": "Angels write smaller initial checks from personal funds, whereas VCs write large institutional checks.",
      "explanationAr": "المستثمرون الملائكيون يقدمون تمويلاً مبكراً من ثرواتهم، بينما صناديق الاستثمار الجريء تضخ مبالغ كبرى للتوسع السريع.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_bootstrapping_grit",
    "title": "Bootstrapping: Zero Debt, 100% Freedom",
    "titleAr": "التمويل الذاتي (بوتسترابينج): حرية كاملة وصفر ديون",
    "description": "Don’t want outside investors telling you what to do? Build step-by-step using your own sales profits! That is Bootstrapping.",
    "descriptionAr": "ألا تريد مستثمرين يفرضون شروطهم عليك؟ ابنِ مشروعك خطوة بخطوة من أرباح مبيعاتك فقط! هذا هو التمويل الذاتي.",
    "category": "Mindset",
    "duration": "0:36",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Bootstrapping",
    "keyTermAr": "التمويل الذاتي للمشروع (Bootstrapping)",
    "likesCount": 1950,
    "viewsCount": 9800,
    "tags": [
      "bootstrapping",
      "independence",
      "mindset"
    ],
    "animationConfig": {
      "themeColor": "from-orange-500 to-amber-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Borrowing big money gives you speed, but you also owe interest and answer to bosses! ⛓️",
          "captionAr": "اقتراض مبالغ ضخمة قد يمنحك سرعة، ولكنه يثقلك بالفوائد ويجعلك خاضعاً لتوجيهات الممولين! ⛓️",
          "mascotMood": "thinking",
          "visualEmoji": "⛓️",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "BOOTSTRAPPING means starting small with whatever you have, then reinvesting your first earnings! 🌱",
          "captionAr": "التمويل الذاتي (Bootstrapping) يعني أن تبدأ بإمكانياتك البسيطة، ثم تعيد استثمار كل قرش تربحه! 🌱",
          "mascotMood": "explaining",
          "visualEmoji": "🌱",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 7,
          "caption": "You bake 10 cookies, sell them for $15, buy ingredients for 20 cookies, and repeat! 🍪📈",
          "captionAr": "تخبز 10 قطع بسكويت، تبيعها بـ 15 دولاراً، تشتري مكونات لـ 20 قطعة، وتضاعف العملية باستمرار! 🍪📈",
          "mascotMood": "celebrating",
          "visualEmoji": "🍪",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "You own 100% of your business! Complete independence, zero debt, maximum pride! 🏆👑",
          "captionAr": "أنت تملك 100% من شركتك! استقلالية كاملة، وصفر ديون، وفخر لا حدود له بالنجاح العصامي! 🏆👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What does \"Bootstrapping\" a business mean?",
      "questionAr": "ماذا يعني مصطلح التمويل الذاتي (Bootstrapping) للمشاريع؟",
      "options": [
        "Growing a business organically using its own revenue without external venture capital",
        "Wearing tall leather boots while working in an office",
        "Borrowing a million dollars from 10 different banks",
        "Buying fancy computers before having any customers"
      ],
      "optionsAr": [
        "تنمية المشروع تدريجياً بالاعتماد على إيراداته وأرباحه الذاتية دون تمويل خارجي",
        "ارتداء أحذية جلدية أثناء العمل في المكتب",
        "اقتراض مليون دولار من عشرة بنوك مختلفة",
        "شراء حواسيب باهظة قبل الحصول على أي زبون"
      ],
      "correctIndex": 0,
      "explanation": "Bootstrapping relies strictly on self-generated customer cash flow to fund business operations and growth.",
      "explanationAr": "التمويل الذاتي يعتمد حصراً على التدفق النقدي الداخلي وأرباح المبيعات لتوسيع العمل وحفظ الملكية كاملة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_pivot_power",
    "title": "The Great Pivot: When Failing Ideas Turn into Gold",
    "titleAr": "التحول الاستراتيجي (Pivot): كيف تحول العثرات إلى ذهب؟",
    "description": "Instagram started as a complicated whiskey app. YouTube was a video dating site! Learn how smart founders pivot to triumph.",
    "descriptionAr": "بدأ إنستغرام كتطبيق معقد لتسجيل الأماكن، وكان يوتيوب موقعاً للتعارف! اكتشف كيف ينقذ التحول الذكي المشاريع المتعثرة.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Strategic Pivot",
    "keyTermAr": "التحول الاستراتيجي (Pivot)",
    "likesCount": 2210,
    "viewsCount": 11400,
    "tags": [
      "pivot",
      "strategy",
      "innovation"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-purple-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You built a fancy website to sell hand-carved wooden pens, but nobody is buying any pens! 🪵✒️",
          "captionAr": "صممت موقعاً فاخراً لبيع أقلام خشبية مصنوعة يدوياً، لكن لا أحد يشتري الأقلام على الإطلاق! 🪵✒️",
          "mascotMood": "thinking",
          "visualEmoji": "✒️",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Instead of quitting in tears, you notice people keep messaging you asking for woodcraft lessons! 💡",
          "captionAr": "بدلاً من البكاء والانسحاب، لاحظت أن الزوار يسألونك باستمرار: \"هل يمكنك تعليمنا النحت على الخشب؟\"! 💡",
          "mascotMood": "explaining",
          "visualEmoji": "💡",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "You shift: Stop selling pens, start offering live video workshops! Boom! Classes sell out in 1 hour! 🎓💥",
          "captionAr": "قمت بالتحول الذكي: توقفت عن بيع الأقلام، وأطلقت ورش عمل تفاعلية! وفجأة نفدت المقاعد في ساعة واحدة! 🎓💥",
          "mascotMood": "celebrating",
          "visualEmoji": "🎓",
          "visualType": "trophy",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "That sharp tactical shift is called a PIVOT! Listen to customer data, adapt quickly, and win! 🚀",
          "captionAr": "هذا التغيير التكتيكي الذكي يسمى \"البيفوت\" (Pivot)! أنصت لبيانات عملائك، وتكيف بمرونة لتنتصر! 🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Pivot\" in startup terminology?",
      "questionAr": "ماذا يعني مصطلح \"التحول الاستراتيجي\" (Pivot) في الشركات الناشئة؟",
      "options": [
        "Changing direction or business model based on market feedback while keeping the core vision",
        "Spinning around in your office chair until dizzy",
        "Giving away all company money to a stranger",
        "Selling your business name to a competitor for $1"
      ],
      "optionsAr": [
        "تغيير مسار أو نموذج عمل المشروع بناءً على استجابة السوق مع الحفاظ على الرؤية العامة",
        "الدوران بالكرسي المكتبي حتى الشعور بالدوار",
        "التبرع بكل أموال الشركة لشخص مجهول",
        "بيع اسم شركتك للمنافسين مقابل دولار واحد"
      ],
      "correctIndex": 0,
      "explanation": "A pivot happens when market signals indicate a better product-market fit by altering strategy.",
      "explanationAr": "يحدث التحول الاستراتيجي عندما تكشف مؤشرات السوق عن فرصة أفضل وأكثر طلباً لتلبية احتياجات العملاء.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_roi_calculator",
    "title": "Return on Investment (ROI): Measuring Every Coin You Put In",
    "titleAr": "العائد على الاستثمار (ROI): كيف تقيس قيمة كل قرش تدفعه؟",
    "description": "If you invest $10 in a new bicycle basket and earn $40 doing paper deliveries, your ROI is 300%! Master the investor score.",
    "descriptionAr": "إذا استثمرت 10 دولارات في سلة دراجة جديدة وحققت 40 دولاراً من توصيل الطلبات، فعائدك 300%! تعلم لغة الأرقام الرابحة.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_dollar_seeds.jpg",
    "fullPosterUrl": "/images/videos/clip_dollar_seeds.jpg",
    "keyTerm": "Return on Investment (ROI)",
    "keyTermAr": "العائد على الاستثمار (ROI)",
    "likesCount": 2410,
    "viewsCount": 12100,
    "tags": [
      "investing",
      "roi",
      "finance"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-green-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-green-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Whenever an entrepreneur spends money on equipment, they ask: \"What will this bring back to me?\" 🔍",
          "captionAr": "عندما ينفق رائد الأعمال مالاً على أدوات أو معدات، يسأل نفسه: \"كم سيعيد هذا الاستثمار إلي؟\" 🔍",
          "mascotMood": "explaining",
          "visualEmoji": "🔍",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Spend $10 buying an electric lemon squeezer. It allows you to make twice as much lemonade per hour! 🍋⚡",
          "captionAr": "أنفقت 10 دولارات لشراء عصارة ليمون كهربائية، فأصبحت تصنع ضعف كمية العصير في نصف الوقت! 🍋⚡",
          "mascotMood": "excited",
          "visualEmoji": "🍋",
          "visualType": "lemonade"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "You earn $50 extra that weekend! Subtract your $10 cost = $40 net gain. That is a 400% ROI! 📈",
          "captionAr": "حققت 50 دولاراً إضافية في عطلة الأسبوع! اطرح تكلفة العصارة (10$) = 40 دولاراً ربح صافٍ. عائد 400%! 📈",
          "mascotMood": "celebrating",
          "visualEmoji": "📈",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Always put your money where the RETURN is highest. That is how fortunes compound! 🚀🏆",
          "captionAr": "وجه أموالك دائماً نحو المشاريع ذات العائد الأعلى والمخاطر المحسوبة، وهكذا تصنع الثروات الحقيقية! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How is Return on Investment (ROI) calculated?",
      "questionAr": "كيف يتم حساب العائد على الاستثمار (ROI)؟",
      "options": [
        "(Net Profit from Investment divided by the Initial Cost) multiplied by 100%",
        "Subtracting your age from the price of the product",
        "Counting how many days you worked without lunch",
        "Multiplying the bank balance by zero"
      ],
      "optionsAr": [
        "(صافي الأرباح المحققة مقسوماً على التكلفة الاستثمارية الأصلية) × 100%",
        "طرح عمرك من سعر السلعة المباعة",
        "حساب عدد الأيام التي عملت فيها بدون وجبة غداء",
        "ضرب رصيدك البنكي في صفر"
      ],
      "correctIndex": 0,
      "explanation": "ROI evaluates investment efficiency by dividing gains minus costs by the capital invested.",
      "explanationAr": "يقيس العائد على الاستثمار كفاءة توظيف المال عبر قسمة صافي الربح على رأس المال المستثمر.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_supply_chain_cocoa",
    "title": "The Great Chocolate Journey: What is a Supply Chain?",
    "titleAr": "رحلة الشوكولاتة العجيبة: ما هي سلاسل الإمداد؟",
    "description": "A cocoa pod in Ghana travels through ships, factories, and trucks before landing in your hand as a candy bar. Discover supply chains!",
    "descriptionAr": "حبة كاكاو في غرب إفريقيا تعبر المحيطات والمصانع والشاحنات لتصل إلى يدك كقطعة شوكولاتة لذيذة! اكتشف أسرار سلاسل الإمداد.",
    "category": "OllieExplains",
    "duration": "0:39",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_goat_barter.jpg",
    "fullPosterUrl": "/images/videos/clip_goat_barter.jpg",
    "keyTerm": "Supply Chain",
    "keyTermAr": "سلاسل الإمداد والتوريد (Supply Chain)",
    "likesCount": 1890,
    "viewsCount": 9600,
    "tags": [
      "logistics",
      "global",
      "operations"
    ],
    "animationConfig": {
      "themeColor": "from-amber-600 to-orange-800",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When you unwrap a chocolate bar, you are holding the work of thousands of people across the globe! 🍫🌍",
          "captionAr": "عندما تفتح لوح شوكولاتة، فأنت تحمل بين يديك ثمرة عمل آلاف الأشخاص حول كوكب الأرض! 🍫🌍",
          "mascotMood": "explaining",
          "visualEmoji": "🍫",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Farmers harvest cocoa beans, massive cargo ships cross oceans, and high-tech factories refine the cocoa! 🚢⚙️",
          "captionAr": "مزارعون يجنون حبوب الكاكاو، سفن شحن عملاقة تعبر المحيطات، ومصانع متطورة تطحن المكونات وتغلفها! 🚢⚙️",
          "mascotMood": "thinking",
          "visualEmoji": "🚢",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Refrigerated trucks deliver the finished bars to your local grocer’s shelves just in time! 🚚📦",
          "captionAr": "شاحنات مبردة تنقل الألواح الطازجة إلى رفوف البقالة بجوار منزلك في الموعد المثالي! 🚚📦",
          "mascotMood": "celebrating",
          "visualEmoji": "🚚",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "That connected web of suppliers, ships, and shops is the SUPPLY CHAIN: the hidden engine of global trade! 🌐",
          "captionAr": "هذه الشبكة المتصلة من المزارع والسفن والمتاجر تسمى \"سلاسل الإمداد\": المحرك الخفي للتجارة العالمية! 🌐",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Supply Chain\"?",
      "questionAr": "ما هي \"سلسلة الإمداد والتوريد\" (Supply Chain)؟",
      "options": [
        "The complete network of people, activities, and transport that moves a product from raw material to final buyer",
        "A heavy metal chain used to lock shop doors at night",
        "A line of shopping carts in a grocery store parking lot",
        "A computer cable plugged into a power socket"
      ],
      "optionsAr": [
        "شبكة متكاملة من الأشخاص والأنشطة ووسائل النقل تنقل المنتج من مرحلة المادة الخام حتى وصوله للزبون النهائي",
        "سلسلة حديدية ثقيلة لقفل أبواب المتاجر ليلاً",
        "طابور من عربات التسوق في موقف سيارات السوبرماركت",
        "سلك كهربائي موصول في مقبس الحائط"
      ],
      "correctIndex": 0,
      "explanation": "Supply chains connect raw material sourcing, processing, manufacturing, warehousing, and retail delivery.",
      "explanationAr": "تربط سلاسل الإمداد استخراج المواد الخام، والتصنيع، والتخزين، والشحن والتوزيع إلى يد المستهلك النهائي.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_ip_patents",
    "title": "Intellectual Property: Protecting Your Billion-Dollar Idea",
    "titleAr": "الملكية الفكرية وبراءات الاختراع: كيف تحمي أفكارك المليارية؟",
    "description": "If you invent a flying skateboard, what stops a copycat from stealing your blueprints? Learn how Patents and Copyright guard genius.",
    "descriptionAr": "إذا اخترعت لوح تزلج طائر، ما الذي يمنع الشركات الأخرى من سرقة تصميمك؟ اكتشف كيف تحمي براءات الاختراع حقوق المبدعين.",
    "category": "OllieExplains",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Intellectual Property & Patents",
    "keyTermAr": "الملكية الفكرية وبراءات الاختراع",
    "likesCount": 2150,
    "viewsCount": 10400,
    "tags": [
      "law",
      "patents",
      "innovation"
    ],
    "animationConfig": {
      "themeColor": "from-indigo-500 to-purple-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You spent two years coding an incredible video game with unique lovable characters! 🎮👾",
          "captionAr": "قضيت عامين كاملين في برمجة لعبة فيديو رائعة وشخصيات كرتونية مبتكرة وفريدة! 🎮👾",
          "mascotMood": "excited",
          "visualEmoji": "👾",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Suddenly, a rival company copies your code and sells it under their name! Is that allowed? NO! 🛑",
          "captionAr": "وفجأة، قامت شركة منافسة بنسخ لعبتك بالكامل وبيعها باسمها! هل هذا مسموح؟ بالطبع لا! 🛑",
          "mascotMood": "thinking",
          "visualEmoji": "🛑",
          "visualType": "umbrella"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "INTELLECTUAL PROPERTY (IP) and PATENTS give inventors the legal right to exclusive ownership! 📜⚖️",
          "captionAr": "الملكية الفكرية (IP) وبراءات الاختراع تمنح المبدعين حماية قانونية حصرية لابتكاراتهم وأسرارهم التجارية! 📜⚖️",
          "mascotMood": "celebrating",
          "visualEmoji": "📜",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Protect your unique formulas, brand names, and inventions so you reap the rewards of your hard work! 🛡️🏆",
          "captionAr": "احمِ علامتك التجارية ووصفاتك الفريدة واختراعاتك، لتجني ثمار اجتهادك وإبداعك بأمان واطمئنان! 🛡️🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the purpose of a Patent?",
      "questionAr": "ما هي الفائدة القانونية لبراءة الاختراع (Patent)؟",
      "options": [
        "To grant the inventor exclusive legal rights to make, use, or sell their invention for a set period",
        "To give every person on earth free permission to copy the product",
        "To erase all drawings of the product from notebooks",
        "To force the inventor to change their name"
      ],
      "optionsAr": [
        "منح المخترع حقاً قانونياً حصرياً في تصنيع واستثمار وبيع اختراعه لفترة زمنية محددة",
        "السماح لأي شخص بنسخ وتقليد المنتج مجاناً وبدون إذن",
        "محو جميع الرسومات والمخططات من دفاتر المخترع",
        "إجبار المخترع على تغيير اسمه وهويته"
      ],
      "correctIndex": 0,
      "explanation": "Patents legally prevent others from making, using, or selling an inventor’s proprietary innovation without license.",
      "explanationAr": "تمنح براءة الاختراع حماية رسمية تمنع الآخرين من استغلال الابتكار تجارياً دون موافقة صاحبه الشرعي.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_market_surveys",
    "title": "Market Research: Asking Questions Before Spending Millions",
    "titleAr": "أبحاث السوق: اسأل زبائنك قبل أن تنفق أموالك",
    "description": "Don’t build a spinach-flavored bubble gum before checking if anyone wants it! Learn how customer surveys save startups from disaster.",
    "descriptionAr": "لا تصنع علكة بطعم السبانخ قبل أن تتأكد هل يحبها أحد أصلاً! تعلم كيف تنقذ استطلاعات الرأي المشاريع من الفشل الذريع.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_needs_wants.jpg",
    "fullPosterUrl": "/images/videos/clip_needs_wants.jpg",
    "keyTerm": "Market Research",
    "keyTermAr": "أبحاث السوق (Market Research)",
    "likesCount": 1940,
    "viewsCount": 9700,
    "tags": [
      "research",
      "strategy",
      "surveys"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-cyan-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-cyan-950 to-blue-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "An excited inventor spends $5,000 making 1,000 jars of garlic-flavored soda! 🧄🥤",
          "captionAr": "متحمس مغامر أنفق 5,000 دولار لتصنيع 1,000 زجاجة مياه غازية بنكهة الثوم الحار! 🧄🥤",
          "mascotMood": "explaining",
          "visualEmoji": "🧄",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Launch day arrives... and not a SINGLE person wants to buy one! What went wrong? 😬",
          "captionAr": "جاء يوم الافتتاح... ولم يوافق شخص واحد في الحي على تذوقها أو شرائها! ما الخطأ الذي ارتكبه؟ 😬",
          "mascotMood": "thinking",
          "visualEmoji": "😬",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "He skipped MARKET RESEARCH! If he asked 20 kids first, they would have told him: \"Yuck, NO!\" 📋🗣️",
          "captionAr": "لقد تجاهل \"أبحاث السوق\"! لو استطلع آراء 20 طفلاً قبل البدء لقالوا له بصوت واحد: \"مستحيل!\" 📋🗣️",
          "mascotMood": "celebrating",
          "visualEmoji": "📋",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Interview real customers, test tiny samples, and only build what people truly crave and value! 🎯🚀",
          "captionAr": "حاور جمهورك الحقيقي، واختبر عينات مصغرة، وابنِ فقط ما يحتاجه الناس ومستعدون للدفع لأجله! 🎯🚀",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why should you always conduct Market Research before launching a product?",
      "questionAr": "لماذا يجب عليك إجراء بحث سوقي واستطلاع آراء قبل إطلاق منتجك؟",
      "options": [
        "To verify whether real customers actually want the product and are willing to pay for it",
        "To find out what time the post office opens",
        "To paint the delivery truck a different color",
        "Because research guarantees you will never have to work again"
      ],
      "optionsAr": [
        "للتأكد من وجود رغبة وطلب حقيقي لدى العملاء واستعدادهم لدفع المال مقابل المنتج",
        "لمعرفة موعد فتح مكتب البريد في الصباح",
        "لتغيير لون شاحنة التوصيل",
        "لأن البحث يضمن عدم حاجتك للعمل مستقبلاً"
      ],
      "correctIndex": 0,
      "explanation": "Market research de-risks new ventures by identifying true customer demand and willingness to pay.",
      "explanationAr": "تقلل أبحاث السوق المخاطر عبر كشف احتياجات ورغبات المستهلكين الحقيقية بدقة قبل ضخ الأموال.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_loss_leader_costco",
    "title": "The Loss Leader Trick: The Famous $1.50 Hot Dog Secret",
    "titleAr": "استراتيجية المنتج الجاذب (Loss Leader): سر الوجبة الرخيصة",
    "description": "Why do giant stores sell roasted chicken or hot dogs below cost? Discover the secret magnet that gets shoppers inside to spend hundreds!",
    "descriptionAr": "لماذا تبيع كبرى المتاجر وجبات سريعة بسعر أقل من تكلفتها؟ اكتشف المغناطيس الخفي الذي يدفع الزبائن لإنفاق المئات بالداخل!",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Loss Leader Strategy",
    "keyTermAr": "استراتيجية المنتج الجاذب (Loss Leader)",
    "likesCount": 2590,
    "viewsCount": 13800,
    "tags": [
      "retail",
      "pricing",
      "psychology"
    ],
    "animationConfig": {
      "themeColor": "from-red-500 to-amber-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-red-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Costco has sold a giant hot dog and drink for $1.50 since 1985! They actually lose money on each bun! 🌭",
          "captionAr": "تبيع بعض المتاجر الكبرى وجبات طازجة بدولار ونصف منذ عقود! وقد تخسر قليلاً في كل وجبة تباع! 🌭",
          "mascotMood": "explaining",
          "visualEmoji": "🌭",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Why would a multi-billion dollar store willingly lose money on food? Are they crazy? 🤯",
          "captionAr": "لماذا ترضى شركة عملاقة بالخسارة في منتج غذائي؟ هل هم مجانين؟ بالتأكيد لا! 🤯",
          "mascotMood": "thinking",
          "visualEmoji": "🤯",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That cheap delicious hot dog is a LOSS LEADER! It pulls hungry families through the entrance doors! 🧲🚪",
          "captionAr": "هذا الطعام الرخيص هو \"المنتج الجاذب\" (Loss Leader)! مغناطيس يسحب آلاف العائلات إلى داخل المتجر! 🧲🚪",
          "mascotMood": "celebrating",
          "visualEmoji": "🧲",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Once inside, shoppers fill their huge carts with $250 worth of clothes, electronics, and groceries! 🛒💰",
          "captionAr": "وبمجرد دخولهم، يملأ المتسوقون عرباتهم ببضائع وإلكترونيات وملابس بقيمة مئات الدولارات! 🛒💰",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Loss Leader\" pricing strategy?",
      "questionAr": "ما هي استراتيجية \"المنتج الجاذب\" (Loss Leader) في المبيعات؟",
      "options": [
        "Selling a popular item at a loss or break-even price to attract customers who buy profitable products",
        "Hiding items so customers lose their way inside the aisles",
        "Paying customers cash to leave the store quietly",
        "Giving away all store inventory until you shut down"
      ],
      "optionsAr": [
        "بيع منتج شهير بسعر التكلفة أو بخسارة بسيطة لجذب الزبائن لشراء منتجات أخرى ذات هوامش ربح عالية",
        "إخفاء المنتجات لجعل المتسوقين يتوهون في الممرات",
        "دفع نقود للمتسوقين لكي يغادروا المتجر بهدوء",
        "توزيع كل بضاعة المتجر مجاناً حتى الإفلاس"
      ],
      "correctIndex": 0,
      "explanation": "A loss leader sacrifices margin on one staple item to drive lucrative foot traffic and basket volume.",
      "explanationAr": "تضحي استراتيجية المنتج الجاذب بهامش ربح سلعة واحدة لجلب حشود من المشترين يقتنون سلعاً مربحة أخرى.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_network_effects",
    "title": "The Power of Network Effects: Why Giants Rule",
    "titleAr": "أثر الشبكة (Network Effects): سر نمو المنصات العملاقة",
    "description": "A telephone with only 1 user is useless. With 1 Billion users, it rules the world! Discover why platforms become unstoppable.",
    "descriptionAr": "هاتف يمتلكه شخص واحد في العالم لا فائدة منه. ولكن عندما يمتلكه مليار شخص، يغير العالم! اكتشف قوة أثر الشبكة.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Network Effects",
    "keyTermAr": "أثر الشبكة (Network Effects)",
    "likesCount": 2280,
    "viewsCount": 11800,
    "tags": [
      "tech",
      "networkeffects",
      "platforms"
    ],
    "animationConfig": {
      "themeColor": "from-blue-600 to-indigo-800",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If you are the ONLY kid with a walkie-talkie, who can you talk to? Nobody! Its value is zero! 📻",
          "captionAr": "لو كنت الطفل الوحيد في المدينة الذي يملك جهاز لاسلكي، مع من ستتحدث؟ لا أحد! قيمته صفر! 📻",
          "mascotMood": "thinking",
          "visualEmoji": "📻",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "When your 5 best friends get walkie-talkies, suddenly it becomes the coolest toy in school! 🗣️✨",
          "captionAr": "وعندما يحصل 5 من أصدقائك المقربين على أجهزة مماثلة، يصبح فجأة أروع جهاز في المدرسة كلها! 🗣️✨",
          "mascotMood": "excited",
          "visualEmoji": "✨",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "When EVERY new user makes the service MORE VALUABLE for everyone else, that is a NETWORK EFFECT! 🌐🚀",
          "captionAr": "عندما يؤدي كل مستخدم جديد ينضم إلى زيادة قيمة الخدمة لجميع المستخدمين السابقين، فهذا هو \"أثر الشبكة\"! 🌐🚀",
          "mascotMood": "celebrating",
          "visualEmoji": "🌐",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "This is why WhatsApp, YouTube, and Roblox are nearly impossible for small competitors to beat! 🏰👑",
          "captionAr": "لهذا السبب يصعب جداً على المنافسين التغلب على منصات مثل واتساب ويوتيوب وروبلوكس! 🏰👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Network Effect\"?",
      "questionAr": "ما هو تعريف \"أثر الشبكة\" (Network Effect)؟",
      "options": [
        "A phenomenon where a product becomes more valuable as more people use it",
        "When your home Wi-Fi cable accidentally disconnects",
        "Fishing with a giant net in the deep ocean",
        "A company hiring only computer technicians"
      ],
      "optionsAr": [
        "ظاهرة تصبح فيها المنصة أو الخدمة أكثر قيمة ومنفعة كلما زاد عدد مستخدميها النشطين",
        "انقطاع سلك الإنترنت المنزلي بالخطأ",
        "صيد الأسماك بشبكة واسعة في أعماق البحار",
        "قيام شركة بتوظيف مهندسي حواسيب فقط"
      ],
      "correctIndex": 0,
      "explanation": "Network effects create exponential user utility as participants scale, erecting massive moats.",
      "explanationAr": "يخلق أثر الشبكة نمواً متسارعاً في الفائدة للجميع مع زيادة عدد المشتركين، مما يبني حصناً تنافسياً منيعاً.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_ab_testing_data",
    "title": "A/B Testing: Letting Data Make the Hard Decisions",
    "titleAr": "اختبار أ/ب (A/B Testing): دع الأرقام تختار التصميم الرابح",
    "description": "Should your signup button be green or bright orange? Don’t guess or argue! Discover how A/B testing reveals the truth.",
    "descriptionAr": "هل يجب أن يكون زر الشراء أخضر أم برتقالياً فاقعاً؟ لا تخمن ولا تجادل! تعلم كيف يكشف اختبار أ/ب الحقيقة بالأرقام.",
    "category": "Tutorial",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "A/B Testing (Split Testing)",
    "keyTermAr": "اختبار أ/ب (A/B Testing)",
    "likesCount": 1760,
    "viewsCount": 8800,
    "tags": [
      "data",
      "testing",
      "cro"
    ],
    "animationConfig": {
      "themeColor": "from-cyan-500 to-teal-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-cyan-950 to-teal-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Two business partners are arguing: \"Our lemonade sign must be green!\" \"No, hot pink sells better!\" 🎨",
          "captionAr": "شريكان يتجادلان طوال الصباح: \"لوحة العصير يجب أن تكون خضراء!\" \"كلا، الوردي اللامع يبيع أكثر!\" 🎨",
          "mascotMood": "explaining",
          "visualEmoji": "🎨",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Instead of fighting, smart CEOs use A/B TESTING! Show Version A to 100 people and Version B to 100 people! 🧪📊",
          "captionAr": "بدل الخلاف، القادة الأذكياء يعتمدون اختبار أ/ب! اعرض التصميم (أ) على 100 شخص والتصميم (ب) على 100 آخرين! 🧪📊",
          "mascotMood": "thinking",
          "visualEmoji": "🧪",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "The pink sign gets 45 sales, while green gets only 12! The data has spoken with 100% scientific proof! 📈✨",
          "captionAr": "اللوحة الوردية حققت 45 عملية شراء، بينما الخضراء جلبت 12 فقط! لقد حسمت البيانات الجدل بدليل قاطع! 📈✨",
          "mascotMood": "celebrating",
          "visualEmoji": "✨",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Never rely on personal guesses when you can run a clean test and let your customers decide! 🚀🏆",
          "captionAr": "لا تعتمد على التخمين والآراء الفردية ما دمت قادراً على إجراء اختبار علمي وترك الخيار للزبائن! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the core principle of A/B Testing?",
      "questionAr": "ما هو المبدأ الجوهري لاختبار أ/ب (A/B Testing)؟",
      "options": [
        "Comparing two variants (A and B) with split traffic to determine which version produces better conversion results",
        "Testing whether the letter A is prettier than the letter B in handwriting",
        "Asking your grandma which website color she prefers",
        "Shutting down your website every two hours"
      ],
      "optionsAr": [
        "مقارنة نسختين مختلفتين (أ وب) عبر تقسيم الزوار بالتساوي لتحديد أي التصميمين يحقق مبيعات ونتائج أعلى",
        "مقارنة جمال كتابة حرف الألف بحرف الباء بخط اليد",
        "سؤال جدتك عن اللون الذي تفضله للموقع",
        "إغلاق الموقع الإلكتروني كل ساعتين"
      ],
      "correctIndex": 0,
      "explanation": "A/B testing uses randomized controlled experiments to optimize user experience based on objective behavior.",
      "explanationAr": "يعتمد اختبار أ/ب على تجارب عشوائية منضبطة لتحسين الأداء والمبيعات بناءً على أفعال وسلوكيات الزوار الفعلية.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_price_elasticity",
    "title": "Price Elasticity: When Customers Flee vs When They Stay",
    "titleAr": "المرونة السعرية: متى يهرب الزبائن ومتى يبقون أوفياء؟",
    "description": "If you raise prices by $1, will your sales drop to zero or double your profits? Discover the economic rubber band of Price Elasticity.",
    "descriptionAr": "إذا رفعت السعر دولاراً واحداً، هل سيهرب كل الزبائن أم تتضاعف أرباحك؟ اكتشف سر الشريط المطاطي للمرونة السعرية.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_supply_demand.jpg",
    "fullPosterUrl": "/images/videos/clip_supply_demand.jpg",
    "keyTerm": "Price Elasticity",
    "keyTermAr": "المرونة السعرية للطلب (Price Elasticity)",
    "likesCount": 2020,
    "viewsCount": 10100,
    "tags": [
      "economics",
      "pricing",
      "elasticity"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If the bakery doubles the price of ordinary cookies from $1 to $2, kids will just buy ice cream instead! 🍪",
          "captionAr": "إذا ضاعف المخبز سعر البسكويت العادي من دولار إلى دولارين، سيتركه الأطفال ويشترون الآيس كريم بدلاً منه! 🍪",
          "mascotMood": "explaining",
          "visualEmoji": "🍪",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "That product is ELASTIC: customers are sensitive to price changes because plenty of substitutes exist! 🪢",
          "captionAr": "هذا الطلب \"مرن\" جداً: الزبائن حساسون لأي تغير في السعر لوجود بدائل كثيرة متاحة أمامهم! 🪢",
          "mascotMood": "thinking",
          "visualEmoji": "🪢",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Now imagine life-saving medicine. Even if the price rises, patients MUST buy it! That is INELASTIC! 💊",
          "captionAr": "الآن تخيل دواءً منقذاً للحياة؛ حتى لو ارتفع سعره، فالمرضى مضطرون لشرائه! هذا طلب \"غير مرن\"! 💊",
          "mascotMood": "celebrating",
          "visualEmoji": "💊",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Build unique, indispensable products that people adore, and your pricing power becomes invincible! 🚀👑",
          "captionAr": "اصنع منتجات استثنائية وفريدة لا غنى عنها للناس، وستمتلك قوة تسعيرية لا تُهزم في السوق! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What makes a product \"Price Elastic\"?",
      "questionAr": "متى يكون الطلب على سلعة ما \"مرناً سعرياً\" (Elastic)؟",
      "options": [
        "When a small increase in price causes a large drop in the quantity demanded by customers",
        "When the physical product can be stretched like rubber",
        "When the product is delivered in a bouncy truck",
        "When the government buys all available supplies"
      ],
      "optionsAr": [
        "عندما تؤدي أي زيادة طفيفة في السعر إلى انخفاض كبير في كمية الشراء وهروب الزبائن لبدائل أخرى",
        "عندما تكون السلعة مصنوعة من المطاط القابل للمط",
        "عندما يتم توصيل المنتج في شاحنة تقفز على الطريق",
        "عندما تشتري الحكومة كامل المخزون المتوفر"
      ],
      "correctIndex": 0,
      "explanation": "Elastic demand occurs when consumers are price-sensitive and easily switch to substitutes upon price increases.",
      "explanationAr": "يحدث الطلب المرن عندما يتأثر المشترون بالأسعار بشدة ويسهل عليهم التحول لبدائل منافسة عند رفع السعر.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_asset_allocation",
    "title": "Asset Allocation: The Balanced Recipe for Wealth",
    "titleAr": "توزيع الأصول (Asset Allocation): الوصفة المتوازنة لبناء الثروة",
    "description": "You wouldn’t bake a cake using 100% salt! Learn how wise investors balance stocks, cash, and real estate for smooth steady growth.",
    "descriptionAr": "لا يمكن صنع كعكة لذيذة باستخدام الملح فقط! تعلم كيف يوزع المستثمرون أموالهم بين الأسهم والنقد والأصول لنمو آمن.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Asset Allocation",
    "keyTermAr": "توزيع الأصول (Asset Allocation)",
    "likesCount": 2180,
    "viewsCount": 10900,
    "tags": [
      "investing",
      "allocation",
      "portfolio"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine a sports team made of ONLY goalkeepers. They won’t concede goals, but they will NEVER score! ⚽🥅",
          "captionAr": "تخيل فريق كرة قدم مكوناً من 11 حارس مرمى فقط! لن تتلقى أهدافاً ولكنك لن تسجل أي هدف أيضاً! ⚽🥅",
          "mascotMood": "explaining",
          "visualEmoji": "⚽",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "A winning team needs defenders, midfielders, and rapid strikers working in harmony! 🏃‍♂️⚡",
          "captionAr": "الفريق البطل يحتاج إلى حراس ومدافعين ومهاجمين سريعين يعملون بانسجام وتكامل! 🏃‍♂️⚡",
          "mascotMood": "thinking",
          "visualEmoji": "🏃‍♂️",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Your money portfolio is the same: Cash protects you, bonds stabilize you, and stocks score big growth! 🛡️📈",
          "captionAr": "محفظتك المالية تعمل بنفس الطريقة: السيولة النقدية تحميك، والسندات تثبتك، والأسهم تسجل لك أرباحاً كبرى! 🛡️📈",
          "mascotMood": "celebrating",
          "visualEmoji": "📈",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Smart ASSET ALLOCATION ensures you grow during booms and sleep peacefully during crashes! 🌟🏆",
          "captionAr": "التوزيع الذكي للأصول يضمن لك النمو في فترات الانتعاش والنوم الهادئ في أوقات تقلبات الأسواق! 🌟🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is \"Asset Allocation\"?",
      "questionAr": "ما هو المقصود بـ \"توزيع الأصول\" (Asset Allocation) في الاستثمار؟",
      "options": [
        "Dividing an investment portfolio among different asset categories like stocks, cash, and real estate to balance risk and reward",
        "Buying only one single stock with every penny you possess",
        "Burying half of your money in the backyard garden",
        "Spending your entire paycheck on lottery tickets"
      ],
      "optionsAr": [
        "تقسيم المحفظة الاستثمارية بين فئات أصول متنوعة كالأسهم والسيولة والعقارات لموازنة العوائد مع المخاطر",
        "شراء سهم شركة واحدة فقط بكل مدخراتك دون تنويع",
        "دفن نصف أموالك في حديقة المنزل الخلفية",
        "إنفاق راتبك بالكامل على بطاقات الحظ"
      ],
      "correctIndex": 0,
      "explanation": "Asset allocation balances portfolio volatility and returns according to an investor’s goals, horizon, and risk tolerance.",
      "explanationAr": "يوازن توزيع الأصول بين المخاطر والأرباح المتوقعة وفقاً لأهداف المستثمر والمدة الزمنية المتاحة أمامه.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_crowdfunding_kickstarter",
    "title": "Crowdfunding: Raising Millions from Everyday Believers",
    "titleAr": "التمويل الجماعي: كيف تجمع ملايين الدولارات من عشاق فكرتك؟",
    "description": "Before making the world’s best watch or board game, ask 10,000 fans to preorder it! Discover how Kickstarter powers dreamers.",
    "descriptionAr": "قبل أن تصنع ساعتك المبتكرة أو لعبتك الجديدة، اطلب من آلاف المعجبين تمويلها مقدماً! اكتشف سحر التمويل الجماعي.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_dollar_seeds.jpg",
    "fullPosterUrl": "/images/videos/clip_dollar_seeds.jpg",
    "keyTerm": "Crowdfunding",
    "keyTermAr": "التمويل الجماعي (Crowdfunding)",
    "likesCount": 2310,
    "viewsCount": 11600,
    "tags": [
      "crowdfunding",
      "kickstarter",
      "startups"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-400 to-green-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-green-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You designed an epic futuristic board game, but you need $20,000 to print 2,000 luxury boxes! 🎲📦",
          "captionAr": "صممت لعبة طاولة مستقبلية ممتعة جداً، ولكنك تحتاج 20,000 دولار لطباعة وتصنيع الصناديق الفاخرة! 🎲📦",
          "mascotMood": "explaining",
          "visualEmoji": "🎲",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Banks won’t lend money to an unproven game. So where do you get $20,000? From THE CROWD! 👥🌍",
          "captionAr": "البنوك ترفض إقراضك لأن اللعبة جديدة ولم تباع بعد. من أين تحصل على المال؟ من \"الجمهور المتحمس\"! 👥🌍",
          "mascotMood": "excited",
          "visualEmoji": "👥",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "You film a fun demo video on Kickstarter. 1,000 gamers eagerly pre-order for $25 each! You raised $25,000! 🎥💰",
          "captionAr": "نشرت مقطع فيديو يشرح فكرة اللعبة. فقام 1,000 لاعب بطلبها مقدماً بـ 25$ للنسخة! جمعت 25,000 دولار! 🎥💰",
          "mascotMood": "celebrating",
          "visualEmoji": "💰",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Zero bank loans, instant proof of customer demand, and 1,000 thrilled fans on day one! 🚀🏆",
          "captionAr": "صفر قروض بنكية، وإثبات حقيقي لرغبة السوق، و1,000 معجب وفي ينتظرون استلام ابتكارك! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How does Crowdfunding help new creators?",
      "questionAr": "كيف يساعد التمويل الجماعي (Crowdfunding) المبتكرين الجدد؟",
      "options": [
        "By raising small amounts of money from a large public audience to fund a project before mass production begins",
        "By forcing everyone in your town to give you $5 by law",
        "By trading old shoes for gold bars at the mall",
        "By printing counterfeit dollar bills at home"
      ],
      "optionsAr": [
        "بجمع مبالغ صغيرة مسبقة من أعداد كبيرة من الجمهور لتمويل إنتاج وتصنيع الفكرة قبل طرحها بالأسواق",
        "بإجبار أهل المدينة بالقانون على منحك 5 دولارات",
        "بمقايضة الأحذية القديمة بسبائك الذهب في المركز التجاري",
        "بطباعة نقود ورقية في المنزل"
      ],
      "correctIndex": 0,
      "explanation": "Crowdfunding validates demand and finances upfront inventory costs through collective pre-orders.",
      "explanationAr": "يتحقق التمويل الجماعي من رغبة الزبائن الحقيقية ويمول تكاليف التصنيع الأولى عبر الطلبات المسبقة الموثوقة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_rfid_barcodes",
    "title": "Barcodes & RFID: The Lightning Speed of Supermarkets",
    "titleAr": "الباركود ورقاقات RFID: السر وراء سرعة السوبرماركت الخارقة",
    "description": "How does a cashier scan 50 grocery items in 60 seconds without typing prices? Meet the black-and-white stripes that changed retail.",
    "descriptionAr": "كيف يمسح الكاشير 50 سلعة في دقيقة واحدة دون كتابة الأسعار يدوياً؟ تعرف على الخطوط البيضاء والسوداء التي طورت التجارة.",
    "category": "Tutorial",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Barcodes & Inventory Tech",
    "keyTermAr": "تقنيات التتبع والباركود (Barcodes & RFID)",
    "likesCount": 1670,
    "viewsCount": 8400,
    "tags": [
      "tech",
      "retail",
      "inventory"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "50 years ago, cashiers had to type prices manually on noisy cash registers. Lines were endless! ⌛🧾",
          "captionAr": "قبل 50 عاماً، كان موظف الحسابات يكتب أسعار كل علبة يدوياً بأزرار بطيئة، وكانت الطوابير تمتد لساعات! ⌛🧾",
          "mascotMood": "explaining",
          "visualEmoji": "🧾",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Then came the BARCODE: A pattern of black bars that red lasers read in 1 millisecond! BEEP! 🔴⚡",
          "captionAr": "ثم جاء الباركود: خطوط سوداء وبيضاء يقرأها شعاع الليزر الأحمر في جزء من الثانية! بيب! 🔴⚡",
          "mascotMood": "excited",
          "visualEmoji": "⚡",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Today, smart RFID chips let carts scan EVERYTHING automatically without even taking items out of the basket! 🛒📡",
          "captionAr": "واليوم، رقاقات الـ RFID الذكية تمسح كل محتويات العربة لاسلكياً دون الحاجة لإخراج المنتجات من السلة! 🛒📡",
          "mascotMood": "celebrating",
          "visualEmoji": "📡",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Great technology eliminates friction, speeds up transactions, and makes customers smile! 🚀🌟",
          "captionAr": "التقنية المبتكرة تلغي الهدر الزمني وتضاعف سرعة البيع وتمنح العملاء تجربة تسوق مبهجة! 🚀🌟",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What major business problem did Barcodes solve for retail stores?",
      "questionAr": "ما هي المشكلة التجارية الكبرى التي حلها نظام الباركود في المتاجر؟",
      "options": [
        "Drastically speeding up checkout times and automatically tracking accurate warehouse inventory",
        "Making cereal taste sweeter",
        "Preventing grocery bags from tearing",
        "Turning off store lights at night automatically"
      ],
      "optionsAr": [
        "تسريع عملية الدفع عند الكاشير بشكل مذهل وتحديث ومراقبة المخزون تلقائياً وبدقة فائقة",
        "جعل حبوب الإفطار أكثر حلاوة",
        "حماية أكياس التسوق من التمزق",
        "إطفاء أنوار المتجر تلقائياً في المساء"
      ],
      "correctIndex": 0,
      "explanation": "Barcodes transformed commerce by accelerating point-of-sale throughput and digitizing stock replenishment.",
      "explanationAr": "أحدث الباركود ثورة في حركة التجارة عبر تسريع إنهاء المعاملات ورقمنة مراقبة المخزون اللحظية بدقة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_viral_marketing",
    "title": "Word of Mouth & Viral Loops: Marketing for $0",
    "titleAr": "التسويق الشفهي والانتشار الفيروسي: كيف تشتهر بتكلفة صفر؟",
    "description": "When a friend tells you about an awesome new mobile game, you download it immediately! Learn how viral loops explode growth.",
    "descriptionAr": "عندما يخبرك صديق بحماس عن لعبة جديدة، فإنك تقوم بتحميلها فوراً! اكتشف كيف تصنع حلقات انتشار مجانية تجتاح العالم.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Viral Marketing & Word of Mouth",
    "keyTermAr": "التسويق الفيروسي والشفهي (Word of Mouth)",
    "likesCount": 2470,
    "viewsCount": 12600,
    "tags": [
      "viral",
      "marketing",
      "growth"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Billboards cost $10,000, but people look at their phones and ignore them completely! 📱🛣️",
          "captionAr": "اللوحات الإعلانية الضخمة في الشوارع تكلف آلافاً مؤلفة، ومعظم السائقين ينظرون لهواتفهم ويتجاهلونها! 📱🛣️",
          "mascotMood": "explaining",
          "visualEmoji": "📱",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "But when your best friend says: \"You HAVE to try this smoothie!\", you run and buy it instantly! 🥤🤝",
          "captionAr": "ولكن عندما يخبرك صديقك المقرب: \"عليك تذوق هذا العصير الرائع الآن!\"، فإنك تسارع لشرائه دون تردد! 🥤🤝",
          "mascotMood": "excited",
          "visualEmoji": "🤝",
          "visualType": "lemonade"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That is WORD OF MOUTH: the most trusted, effective, and cheapest advertising channel on earth! 🗣️✨",
          "captionAr": "هذا هو \"التسويق الشفهي\": أقوى وأصدق وأوفر أشكال الدعاية في تاريخ البشرية! 🗣️✨",
          "mascotMood": "celebrating",
          "visualEmoji": "✨",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Deliver an unforgettable, mind-blowing customer experience, and your fans will sell your product FOR YOU! 🚀👑",
          "captionAr": "قدم تجربة استثنائية تفوق توقعات زبائنك، وسيقوم المعجبون بالتسويق لمنتجك بحماس نيابة عنك! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why is Word of Mouth marketing considered the most powerful channel?",
      "questionAr": "لماذا يعتبر التسويق الشفهي (Word of Mouth) أقوى أدوات النمو التجاري؟",
      "options": [
        "Because people inherently trust recommendations from genuine friends more than paid corporate ads",
        "Because megaphones are very loud in school hallways",
        "Because it requires hiring 1,000 actors to whisper in supermarkets",
        "Because newspapers have ceased publication completely"
      ],
      "optionsAr": [
        "لأن الناس يثقون في توصيات أصدقائهم ومعارفهم الصادقة أكثر بكثير من الإعلانات التجارية الممولة",
        "لأن مكبرات الصوت عالية جداً في أروقة المدارس",
        "لأنه يتطلب توظيف ألف ممثل للهمس في أذن المتسوقين",
        "لأن الصحف الورقية توقفت عن الصدور تماماً"
      ],
      "correctIndex": 0,
      "explanation": "Peer recommendations carry high trust credibility and zero advertising spend per impression.",
      "explanationAr": "توصيات الأصدقاء والزملاء تحمل مصداقية عالية للغاية وتكلفة إعلانية شبه منعدمة للوصول إلى زبائن جدد.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_brand_equity_nike",
    "title": "Brand Equity: Why a Swoosh is Worth Billions",
    "titleAr": "قيمة العلامة التجارية (Brand Equity): سر الشعار الملياري",
    "description": "A plain white T-shirt costs $5. Put a famous sports logo on it, and it sells for $45! Discover the intangible fortune of Brand Equity.",
    "descriptionAr": "قميص أبيض سادة يباع بـ 5 دولارات، ولكن عندما تضع عليه علامة رياضية شهيرة يباع بـ 45 دولاراً! اكتشف قيمة العلامة التجارية.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Brand Equity",
    "keyTermAr": "قيمة العلامة التجارية (Brand Equity)",
    "likesCount": 2380,
    "viewsCount": 12200,
    "tags": [
      "branding",
      "equity",
      "marketing"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-orange-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Two cotton shirts made in the exact same textile factory side by side using identical stitching! 👕🧵",
          "captionAr": "قميصان قطنيان صُنعا في نفس المصنع جنباً إلى جنب وبنفس خيوط الحياكة والقطن بالضبط! 👕🧵",
          "mascotMood": "explaining",
          "visualEmoji": "👕",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "One has no tag and sells for $5. The other has a famous athlete logo and sells for $50! Why? 🤯",
          "captionAr": "الأول بدون علامة ويباع بـ 5 دولارات، والآخر يحمل شعار بطل رياضي عالمي ويباع بـ 50 دولاراً! لماذا؟ 🤯",
          "mascotMood": "thinking",
          "visualEmoji": "🤯",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That premium value is BRAND EQUITY: Years of trust, inspiring stories, and emotional connection! 💖🌟",
          "captionAr": "هذا الفارق الهائل في السعر يسمى \"قيمة العلامة التجارية\": سنوات من الثقة، والقصص الملهمة، والارتباط العاطفي! 💖🌟",
          "mascotMood": "celebrating",
          "visualEmoji": "💖",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "A product can be copied, but an iconic, trusted brand is impossible to duplicate! 🏰👑",
          "captionAr": "أي منتج يمكن تقليده في المصانع، لكن العلامة التجارية العريقة الموثوقة يستحيل نسخها أو تكرارها! 🏰👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is \"Brand Equity\"?",
      "questionAr": "ما هو تعريف \"قيمة العلامة التجارية\" (Brand Equity)؟",
      "options": [
        "The commercial value derived from consumer perception and trust in the brand name, rather than the product alone",
        "The cost of printing business cards on thick paper",
        "How many letters are in the company legal name",
        "The amount of paint used to paint the warehouse exterior"
      ],
      "optionsAr": [
        "القيمة التجارية الإضافية الناتجة عن ثقة وانطباع وإعجاب المستهلكين بالاسم والشعار وليس المنتج وحده",
        "تكلفة طباعة بطاقات العمل على ورق سميك فاخر",
        "عدد الأحرف الإنجليزية في الاسم القانوني للشركة",
        "كمية الطلاء المستخدمة في دهان جدران المستودع"
      ],
      "correctIndex": 0,
      "explanation": "Brand equity represents intangible consumer goodwill allowing premium pricing and high market resilience.",
      "explanationAr": "تمثل قيمة العلامة رصيد الثقة والسمعة في أذهان الزبائن، مما يتيح للشركة البيع بأسعار أعلى وثبات أكبر أمام المنافسين.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_franchise_mcdonalds",
    "title": "The Franchise Blueprint: How to Multiply 40,000 Shops",
    "titleAr": "نموذج الامتياز التجاري (الفرنشايز): كيف تفتح 40 ألف فرع حول العالم؟",
    "description": "McDonalds didn’t build 40,000 burger joints by themselves. Local entrepreneurs paid them to run their own branch! Learn franchising.",
    "descriptionAr": "لم تبنِ ماكدونالدز 40 ألف مطعم بمفردها! بل دفع رواد أعمال محليون أموالاً لتشغيل فروعهم وفق المعايير. اكتشف الامتياز التجاري.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Franchise Model",
    "keyTermAr": "الامتياز التجاري (الفرنشايز - Franchise)",
    "likesCount": 2190,
    "viewsCount": 11000,
    "tags": [
      "franchise",
      "scale",
      "operations"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-red-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-red-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You created the world’s tastiest crispy waffle recipe and your shop has lines out the door! 🧇🚪",
          "captionAr": "ابتكرت أشهى وصفة وافل مقرمش في العالم، وأصبح أمام متجرك طابور طويل يمتد خارج الباب! 🧇🚪",
          "mascotMood": "excited",
          "visualEmoji": "🧇",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "People in Tokyo and London want your waffles, but you can only be in one kitchen at a time! ✈️🗺️",
          "captionAr": "يريد الزبائن في طوكيو ولندن تذوق منتجك، ولكنك لا تستطيع التواجد إلا في مطبخ واحد في نفس الوقت! ✈️🗺️",
          "mascotMood": "thinking",
          "visualEmoji": "🗺️",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Enter FRANCHISING! Local operators pay YOU a fee to open branches using your exact blueprint and recipes! 📜🤝",
          "captionAr": "الحل هو \"الامتياز التجاري\"! مستثمرون محليون يدفعون لك رسوماً لافتتاح فروع مطابقة لمعاييرك ووصفاتك! 📜🤝",
          "mascotMood": "celebrating",
          "visualEmoji": "📜",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "They take on the local construction costs, and you earn steady royalties from thousands of locations worldwide! 🌍👑",
          "captionAr": "هم يتحملون تكاليف البناء والتشغيل، وأنت تحصل على نسبة أرباح متواصلة من آلاف الفروع حول العالم! 🌍👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How does a Franchise business model work?",
      "questionAr": "كيف يعمل نموذج \"الامتياز التجاري\" (Franchising) في الأعمال؟",
      "options": [
        "A company licenses its proven business model, recipes, and brand name to independent operators in exchange for fees and royalties",
        "A single founder travels to 10,000 cities every week to flip burgers alone",
        "Selling free burgers to anyone who enters the store with an umbrella",
        "Closing every restaurant branch after 1 week of business"
      ],
      "optionsAr": [
        "تمنح الشركة الناجحة ترخيصاً لرواد أعمال مستقلين لاستخدام نموذج عملها وعلامتها التجارية مقابل رسوم ونسبة أرباح",
        "يسافر المؤسس شخصياً بين 10 آلاف مدينة كل أسبوع لطهي البرجر بنفسه",
        "توزيع شطائر مجانية على من يحمل مظلة مطر داخل المتجر",
        "إغلاق كل فرع بعد أسبوع واحد فقط من افتتاحه"
      ],
      "correctIndex": 0,
      "explanation": "Franchising scales rapidly by partnering with local entrepreneurs who fund local capital expenditures.",
      "explanationAr": "يتيح الامتياز التجاري التوسع العالمي الفائق عبر مشاركة رواد أعمال محليين يمولون التأسيس مع التزامهم التام بالمعايير.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_inflation_hedges",
    "title": "Inflation Hedges: Why the Rich Buy Real Estate & Gold",
    "titleAr": "التحوط من التضخم: لماذا يشتري الأثرياء العقارات والذهب؟",
    "description": "When paper money loses value, what keeps its purchasing power? Discover how physical real estate and scarce assets act as shields.",
    "descriptionAr": "عندما تفقد العملات الورقية قيمتها، ما الذي يحفظ القوة الشرائية؟ اكتشف كيف تشكل العقارات والذهب دروعاً واقية لثروتك.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Inflation Hedge",
    "keyTermAr": "التحوط ضد التضخم (Inflation Hedge)",
    "likesCount": 2260,
    "viewsCount": 11500,
    "tags": [
      "investing",
      "realestate",
      "wealth"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-yellow-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-yellow-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If prices rise 10% every year, a $100 bill in your wallet buys fewer groceries with every passing month! 💸📉",
          "captionAr": "لو ارتفعت الأسعار بنسبة 10% سنوياً، فإن ورقة الـ 100 دولار في جيبك ستشتري بضائع أقل مع كل شهر يمر! 💸📉",
          "mascotMood": "explaining",
          "visualEmoji": "💸",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "So what do smart investors do? They exchange paper cash for REAL physical assets! 🏠🧱",
          "captionAr": "ماذا يفعل المستثمر الحصيف لحماية شقائه؟ يحول جزءاً من السيولة النقدية إلى أصول حقيقية وملموسة! 🏠🧱",
          "mascotMood": "thinking",
          "visualEmoji": "🏠",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Apartments, fertile land, and gold cannot be printed out of thin air by a printing press! They are scarce! 🥇🌍",
          "captionAr": "العقارات السكنية، والأراضي الزراعية، والذهب النقي لا يمكن طباعتها بضغطة زر في المطابع؛ إنها أصول نادرة ومحدودة! 🥇🌍",
          "mascotMood": "celebrating",
          "visualEmoji": "🥇",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "As inflation pushes living costs up, property values and rents rise with it! Your purchasing power is defended! 🛡️🏰",
          "captionAr": "ومع ارتفاع تكاليف المعيشة، ترتفع أسعار العقارات وإيجاراتها معاً! فتظل قوتك الشرائية محمية ومصانة! 🛡️🏰",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is an \"Inflation Hedge\"?",
      "questionAr": "ما هو تعريف \"التحوط ضد التضخم\" (Inflation Hedge)؟",
      "options": [
        "An asset expected to maintain or increase its real purchasing power when general price levels rise",
        "A tall bush planted around a bank building to prevent robberies",
        "Keeping all savings in pennies underneath the bed",
        "Refusing to look at grocery receipts"
      ],
      "optionsAr": [
        "أصل مالي أو عقاري يُتوقع أن يحافظ على قيمته الحقيقية أو ينمو عند ارتفاع مستويات الأسعار العامة في الاقتصاد",
        "سياج شجري يتم زراعته حول البنك لمنع السرقات",
        "تخزين كل العملات المعدنية تحت السرير المنزلي",
        "الامتناع عن النظر إلى فواتير المشتريات"
      ],
      "correctIndex": 0,
      "explanation": "Inflation hedges like real estate and commodities historically retain intrinsic value during currency devaluation.",
      "explanationAr": "تحافظ الأصول مثل العقارات والمعادن الثمينة تاريخياً على قيمتها الجوهرية وتزيد مع تراجع القوة الشرائية للعملات.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_liquidity_cash",
    "title": "Liquidity: Why $1M in Houses Isn’t Like $1M in Cash",
    "titleAr": "السيولة المالية: لماذا لا يعادل بيت بمليون دولار مليوناً كاش؟",
    "description": "You own a mansion worth $1 Million, but you need $20 to buy dinner right now! Learn why liquidity is essential for survival.",
    "descriptionAr": "أنت تملك قصراً فاخراً قيمته مليون دولار، ولكنك تحتاج 20 دولاراً لتناول طعام العشاء الليلة! اكتشف أهمية السيولة المالية السريعة.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "Asset Liquidity",
    "keyTermAr": "السيولة المالية (Asset Liquidity)",
    "likesCount": 1980,
    "viewsCount": 9900,
    "tags": [
      "liquidity",
      "finance",
      "cash"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-cyan-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-cyan-950 to-blue-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine having a massive treasure chest of gold bricks locked inside a mountain cave! ⛰️🔒",
          "captionAr": "تخيل أنك تمتلك صندوق كنز مليئاً بسبائك الذهب الخالص في كهف بعيد داخل الجبال! ⛰️🔒",
          "mascotMood": "explaining",
          "visualEmoji": "🔒",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "You are wealthy! But when you walk into the grocery store for an apple, the cashier can not take a gold brick! 🍎🙅‍♀️",
          "captionAr": "أنت ثري جداً! ولكن عندما تدخل لشراء تفاحة، لا يستطيع البائع قبول سبيكة ذهب ضخمة بدلاً من النقود! 🍎🙅‍♀️",
          "mascotMood": "thinking",
          "visualEmoji": "🍎",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "LIQUIDITY is how quickly and easily an asset can be turned into spendable CASH without losing value! 💧💵",
          "captionAr": "السيولة (Liquidity) هي مدى سهولة وسرعة تحويل أصل تملكه إلى نقد جاهز للصرف دون خسارة قيمته! 💧💵",
          "mascotMood": "celebrating",
          "visualEmoji": "💧",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Cash is 100% liquid. Houses take months to sell. Always keep emergency liquid cash on hand! 🚀🛡️",
          "captionAr": "الكاش سائل بنسبة 100%، بينما بيع العقار يتطلب أشهراً! احرص دائماً على وجود سيولة طوارئ بجانبك! 🚀🛡️",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Which of the following assets is the MOST liquid?",
      "questionAr": "أي من الأصول التالية يعتبر الأعلى سيولة وسرعة في التعامل؟",
      "options": [
        "Cash in a checking bank account",
        "A commercial office skyscraper in downtown",
        "A rare antique painting hanging in an art museum",
        "A collection of vintage cars stored in a garage"
      ],
      "optionsAr": [
        "النقود الجاهزة في الحساب البنكي الجاري",
        "ناطحة سحاب تجارية في وسط المدينة",
        "لوحة فنية أثرية نادرة معلقة في متحف فني",
        "مجموعة سيارات كلاسيكية نادرة في مرآب مغلق"
      ],
      "correctIndex": 0,
      "explanation": "Cash is immediately spendable without conversion delay or market discount, making it the most liquid asset.",
      "explanationAr": "النقود الجاهزة قابلة للصرف الفوري دون أي تأخير أو خصم من قيمتها، مما يجعلها الأصل الأكثر سيولة على الإطلاق.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_ethical_business",
    "title": "Ethical Business: Why Honesty Makes the Biggest Fortunes",
    "titleAr": "أخلاقيات الأعمال: لماذا يصنع الصدق والأمانة أكبر الثروات؟",
    "description": "Cheating a customer might make you $10 today, but ruins you forever. Discover why integrity is the ultimate competitive advantage.",
    "descriptionAr": "خداع العميل قد يجلب لك 10 دولارات سريعة اليوم، لكنه يدمر سمعتك للأبد! اكتشف لماذا تعد النزاهة أعظم ميزة تنافسية.",
    "category": "Mindset",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Business Ethics & Trust",
    "keyTermAr": "أخلاقيات الأعمال وبناء الثقة",
    "likesCount": 2650,
    "viewsCount": 13900,
    "tags": [
      "ethics",
      "trust",
      "leadership"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "A dishonest vendor waters down his juice stand to save $2 on lemons. He feels clever! 🍋💧",
          "captionAr": "بائع غير أمين قام بتخفيف العصير بالماء المفرط ليوفر دولارين في ثمن الليمون، وظن نفسه ذكياً! 🍋💧",
          "mascotMood": "explaining",
          "visualEmoji": "💧",
          "visualType": "lemonade",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Customers taste the bland water once... and NEVER return. They warn all their friends online! 🚫📉",
          "captionAr": "تذوق الزبائن المشروب الرديء لمرة واحدة... ولم يعودوا مجدداً أبداً، وحذروا الجميع من التعامل معه! 🚫📉",
          "mascotMood": "thinking",
          "visualEmoji": "📉",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "His greedy $2 shortcut cost him $10,000 in lost future sales! Cheating is the fastest route to bankruptcy! 💥",
          "captionAr": "طمع ذلك البائع وفقدانه للأمانة كلفه خسارة 10 آلاف دولار من المبيعات المستقبلية! الغش أسرع طريق للإفلاس! 💥",
          "mascotMood": "celebrating",
          "visualEmoji": "💥",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "True legendary CEOs treat customers with radical honesty. TRUST is the currency of the future! 🌟🤝👑",
          "captionAr": "القادة العظماء يتعاملون مع زبائنهم بأعلى درجات الصدق والأمانة؛ فالثقة هي أثمن عملة في المستقبل! 🌟🤝👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why is ethical conduct essential for long-term business success?",
      "questionAr": "لماذا تعتبر النزاهة والأخلاق ركيزة أساسية لنجاح المشاريع على المدى الطويل؟",
      "options": [
        "Because customer trust drives repeat business, stellar reputation, and lifelong loyalty",
        "Because bad juice tastes better in cold weather",
        "Because honest people are given free trophies by banks",
        "Because cheating is mandatory in business school"
      ],
      "optionsAr": [
        "لأن ثقة العملاء واحترامهم تصنع مبيعات متكررة، وسمعة طيبة، وولاءً يستمر طوال الحياة",
        "لأن العصير الرديء يصبح ألذ في الشتاء",
        "لأن البنوك توزع جوائز مجانية لمن يقول الصدق",
        "لأن الغش مادة إجبارية في كليات التجارة"
      ],
      "correctIndex": 0,
      "explanation": "Integrity builds brand trust, which maximizes Customer Lifetime Value and protects against reputational ruin.",
      "explanationAr": "تبني الأمانة والنزاهة سمعة راسخة، وتضاعف ولاء العملاء وأرباحهم المستمرة، وتحمي المشروع من الانهيار.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_economies_of_scale",
    "title": "Economies of Scale: Why Giant Factories Build Cheaper",
    "titleAr": "وفورات الحجم (Economies of Scale): سر انخفاض تكلفة المصانع الكبرى",
    "description": "Baking 1 cookie in an oven takes 20 minutes and electricity. Baking 50 cookies takes the exact same energy! Master scale.",
    "descriptionAr": "خبز قطعة كعك واحدة في الفرن يستهلك 20 دقيقة وكهرباء. وخبز 50 قطعة يستهلك نفس الطاقة تماماً! تعلم سر الإنتاج الضخم.",
    "category": "OllieExplains",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Economies of Scale",
    "keyTermAr": "وفورات الحجم والإنتاج الكبير (Economies of Scale)",
    "likesCount": 2040,
    "viewsCount": 10300,
    "tags": [
      "operations",
      "scale",
      "efficiency"
    ],
    "animationConfig": {
      "themeColor": "from-orange-500 to-amber-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If you fire up a giant commercial bakery oven to bake just ONE single muffin, that muffin costs $10! 🧁🔥",
          "captionAr": "إذا قمت بتشغيل فرن تجاري ضخم لخبز قطعة كعك واحدة فقط، فإن تكلفة تلك القطعة ستصل إلى 10 دولارات! 🧁🔥",
          "mascotMood": "explaining",
          "visualEmoji": "🧁",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Now put 500 muffins into that same oven! The gas and chef cost the same, but now each muffin costs 10 cents! 🧑‍🍳✨",
          "captionAr": "الآن ضع 500 قطعة كعك في نفس الفرن! تكلفة الغاز والمخبز واحدة، ولكن تكلفة كل قطعة أصبحت 10 سنتات فقط! 🧑‍🍳✨",
          "mascotMood": "excited",
          "visualEmoji": "✨",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "When fixed costs are spread over millions of units, cost per unit plummets! That is ECONOMIES OF SCALE! 📉🏭",
          "captionAr": "عندما تتوزع التكاليف الثابتة على ملايين المنتجات، تنخفض تكلفة القطعة الواحدة بشكل مذهل! هذه هي وفورات الحجم! 📉🏭",
          "mascotMood": "celebrating",
          "visualEmoji": "🏭",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "This allows giants like Amazon and Toyota to offer lower prices while still pocketing huge profits! 🚀🏆",
          "captionAr": "هذا ما يمكن الشركات الكبرى مثل أمازون وتويوتا من خفض الأسعار للمستهلكين ومضاعفة أرباحها في آن واحد! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What happens to the cost per unit when a factory achieves Economies of Scale?",
      "questionAr": "ماذا يحدث لتكلفة إنتاج القطعة الواحدة عندما يحقق المصنع وفورات الحجم (Economies of Scale)؟",
      "options": [
        "The cost to produce each individual unit decreases as the total volume of production increases",
        "The cost to produce each unit skyrockets to a million dollars",
        "The factory machines stop working forever",
        "The products turn invisible automatically"
      ],
      "optionsAr": [
        "تنخفض تكلفة تصنيع الوحدة الفردية كلما زادت كمية وحجم الإنتاج الإجمالي",
        "ترتفع تكلفة إنتاج كل قطعة إلى ملايين الدولارات",
        "تتوقف آلات المصنع عن العمل نهائياً",
        "تصبح المنتجات غير مرئية للمشترين تلقائياً"
      ],
      "correctIndex": 0,
      "explanation": "Economies of scale lower per-unit production cost by distributing fixed overhead over larger output volumes.",
      "explanationAr": "تخفض وفورات الحجم نصيب القطعة من التكاليف الثابتة والإدارية عبر توزيعها على ملايين الوحدات المنتجة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_problem_hunting",
    "title": "Problem Hunting: How Billion-Dollar Ideas are Born",
    "titleAr": "صيد المشكلات: كيف تولد الأفكار المليارية العظيمة؟",
    "description": "Uber was born when two friends couldn’t find a taxi in the snow. Great businesses don’t sell products; they cure headaches!",
    "descriptionAr": "ولدت أوبر عندما عجز صديقان عن إيجاد سيارة أجرة في عاصفة ثلجية! المشاريع العظيمة لا تبيع سلعاً، بل تعالج متاعب الناس.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_needs_wants.jpg",
    "fullPosterUrl": "/images/videos/clip_needs_wants.jpg",
    "keyTerm": "Problem-Solving Mindset",
    "keyTermAr": "عقلية حل المشكلات والفرص",
    "likesCount": 2310,
    "viewsCount": 11700,
    "tags": [
      "creativity",
      "startups",
      "mindset"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Most people complain when something is slow, broken, or annoying: \"I hate waiting in line!\" 😤🛑",
          "captionAr": "معظم الناس يشتكون عندما يواجهون خدمة بطيئة أو سيئة: \"أنا أكره الوقوف في طوابير الانتظار الطويلة!\" 😤🛑",
          "mascotMood": "explaining",
          "visualEmoji": "😤",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Entrepreneurs hear that complaint and their eyes LIGHT UP with gold: \"There is an opportunity here!\" 💡✨",
          "captionAr": "أما رائد الأعمال فيسمع تلك الشكوى وتلمع عيناه بفرصة ذهبية: \"هنا توجد مشكلة تحتاج إلى حل ذكي!\" 💡✨",
          "mascotMood": "excited",
          "visualEmoji": "💡",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Airbnb cured expensive hotel shortages. DoorDash cured cooking when exhausted. Find the pain point! 🔍🩹",
          "captionAr": "إير بي إن بي حلت غلاء الفنادق، وتطبيقات التوصيل حلت عناء الطهي بعد التعب. ابحث دائماً عن نقطة الألم لدى الناس! 🔍🩹",
          "mascotMood": "celebrating",
          "visualEmoji": "🩹",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Whenever people say \"I wish someone would fix this!\", that is your cue to build the solution and lead! 🚀👑",
          "captionAr": "عندما تسمع من حولك يقولون: \"أتمنى لو يجد أحدهم حلاً لهذه المعضلة!\"، فهذه إشارتك لتبادر بالحل وتبني مشروعك! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the best starting point for a successful new business venture?",
      "questionAr": "ما هي أفضل نقطة انطلاق لتأسيس مشروع ريادي ناجح؟",
      "options": [
        "Finding a painful, recurring problem that real people face and creating a superior, convenient solution for it",
        "Copying whatever is at the front of a shop without thinking",
        "Buying the most expensive desk in the furniture store",
        "Waiting for lightning to strike your front door"
      ],
      "optionsAr": [
        "اكتشاف مشكلة حقيقية مزعجة ومتكررة يعاني منها الناس وتقديم حل مبتكر ومريح ينهي معاناتهم",
        "تقليد أول سلعة تراها في واجهة المحلات دون تفكير أو تميز",
        "شراء أغلى مكتب في متجر الأثاث",
        "انتظار نزول صاعقة أمام باب بيتك"
      ],
      "correctIndex": 0,
      "explanation": "Products succeed when they offer clear relief to validated consumer pain points better than alternatives.",
      "explanationAr": "تنجح المشاريع حين تقدم حلولاً عملية واضحة وسريعة لنقاط ألم حقيقية يواجهها الناس يومياً.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_elevator_pitch",
    "title": "The Elevator Pitch: Hooking an Investor in 30 Seconds",
    "titleAr": "عرض المصعد (Elevator Pitch): كيف تبهر المستثمر في 30 ثانية؟",
    "description": "You step into an elevator with Elon Musk or an angel investor. You have 3 floors to explain your startup! Can you do it?",
    "descriptionAr": "دخلت المصعد ووجدت أمامك مستثمراً شهيراً! لديك 30 ثانية فقط قبل أن يفتح الباب ليشرح فكرتك. هل تستطيع إقناعه؟",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "The Elevator Pitch",
    "keyTermAr": "عرض المصعد السريع (Elevator Pitch)",
    "likesCount": 2520,
    "viewsCount": 13100,
    "tags": [
      "pitching",
      "communication",
      "leadership"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Ding! The elevator door opens. A top investor steps in next to you! You have 30 SECONDS! 🛗⏱️",
          "captionAr": "دينغ! فُتح باب المصعد ودخل مستثمر كبير بجانبك! لديك 30 ثانية فقط قبل أن يغادر الطابق! 🛗⏱️",
          "mascotMood": "excited",
          "visualEmoji": "⏱️",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Do not babble about tiny technical details! Hit the 3 magic pillars: Problem, Solution, and Market! 🏛️🎯",
          "captionAr": "إياك أن تتشتت بالتفاصيل المعقدة! ركز فوراً على الأركان الثلاثة: المشكلة، الحل، وحجم السوق! 🏛️🎯",
          "mascotMood": "explaining",
          "visualEmoji": "🎯",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "\"500,000 kids lose lunch money daily. Our digital lunch ring pays in 1 tap, and 50 schools signed up!\" 💍🥪",
          "captionAr": "\"نصف مليون طالب يضيعون نقود الغداء يومياً. خاتمنا الذكي يدفع بلمسة واحدة، واشتركت معنا 50 مدرسة حتى الآن!\" 💍🥪",
          "mascotMood": "celebrating",
          "visualEmoji": "💍",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "The investor hands you their card with a grin: \"Call my office Monday!\" Master your 30 seconds! 🏆🤝",
          "captionAr": "يبتسم المستثمر ويسلمك بطاقة عمله بفخر: \"اتصل بمكتبي صباح الاثنين!\" درب لسانك على بلاغة الـ 30 ثانية! 🏆🤝",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What are the 3 essential components of a winning 30-second Elevator Pitch?",
      "questionAr": "ما هي المكونات الثلاثة الأساسية لعرض المصعد (Elevator Pitch) الناجح؟",
      "options": [
        "The urgent Problem, your unique Solution, and clear evidence of Market Traction or size",
        "Your shoe size, your favorite cereal, and the weather report",
        "Reading your entire 80-page business plan word for word as fast as possible",
        "Asking the investor for a free lunch"
      ],
      "optionsAr": [
        "المشكلة الحقيقية، حلك الاستثنائي، ودليل ملموس على إقبال السوق وتجاوب العملاء",
        "مقاس حذائك، ونوع طعامك المفضل، وتوقعات حالة الطقس",
        "قراءة خطة عملك المكونة من 80 صفحة بأسرع نبرة صوت ممكنة",
        "مطالبة المستثمر بوجبة طعام مجانية"
      ],
      "correctIndex": 0,
      "explanation": "A great elevator pitch delivers brevity, clarity, and intrigue by framing problem, solution, and proof.",
      "explanationAr": "يتميز عرض المصعد بالاختصار والوضوح والإثارة عبر ربط المشكلة بالحل وإثبات حجم الفرصة التجارية.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_sunk_cost_fallacy",
    "title": "The Sunk Cost Fallacy: Why You Shouldn’t Finish Bad Movies",
    "titleAr": "مغالطة التكلفة الغارقة (Sunk Cost): لا تضيع وقتك في متابعة فيلم سيئ",
    "description": "You paid $15 for a boring, painful movie. Staying for 2 more hours doesn’t bring your $15 back! Learn to cut your losses like a boss.",
    "descriptionAr": "دفعت 15 دولاراً لفيلم ممل ومحبط. البقاء لساعتين إضافيتين لن يعيد أموالك! تعلم متى تتوقف وتنقذ وقتك وأموالك المتبقية.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_allowance_system.jpg",
    "fullPosterUrl": "/images/videos/clip_allowance_system.jpg",
    "keyTerm": "Sunk Cost Fallacy",
    "keyTermAr": "مغالطة التكلفة الغارقة (Sunk Cost Fallacy)",
    "likesCount": 2410,
    "viewsCount": 12400,
    "tags": [
      "psychology",
      "decisions",
      "economics"
    ],
    "animationConfig": {
      "themeColor": "from-purple-500 to-indigo-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You paid $15 to watch a movie in the cinema, but after 20 minutes it is unwatchably awful and headache-inducing! 🍿😫",
          "captionAr": "دفعت 15 دولاراً لتذكرة سينما، ولكن بعد 20 دقيقة اتضح أن الفيلم ممل وصداع لا يطاق! 🍿😫",
          "mascotMood": "explaining",
          "visualEmoji": "🍿",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "You tell yourself: \"I must sit here for 2 painful hours because I already paid $15!\" That is a TRAP! 🪤",
          "captionAr": "تقول لنفسك بندم: \"يجب أن أبقى لساعتين إضافيتين لأنني دفعت 15 دولاراً بالفعل!\" هذا فخ عقلي خطير! 🪤",
          "mascotMood": "thinking",
          "visualEmoji": "🪤",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That $15 is GONE forever whether you stay or leave. Staying only wastes your precious TIME as well! ⏳💸",
          "captionAr": "الـ 15 دولاراً ضاعت وانتهت سواء جلست أم غادرت. البقاء يسرق منك وقتك الثمين أيضاً بلا أي فائدة! ⏳💸",
          "mascotMood": "celebrating",
          "visualEmoji": "⏳",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "In business, know when to pull the plug on failing experiments. Focus all energy on what can win TODAY! 🚀🏆",
          "captionAr": "في ريادة الأعمال، تعلم متى توقف التجارب الخاسرة بلا ندم، ووجه كل مواردك وطاقتك للمشاريع الواعدة اليوم! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the \"Sunk Cost Fallacy\"?",
      "questionAr": "ما هي \"مغالطة التكلفة الغارقة\" (Sunk Cost Fallacy) في اتخاذ القرار؟",
      "options": [
        "Continuing an unprofitable or unhappy endeavor simply because you have already invested unrecoverable time or money into it",
        "Dropping your coins accidentally into the bottom of the swimming pool",
        "Buying a submarine that cannot float",
        "Investing only in nautical exploration companies"
      ],
      "optionsAr": [
        "الاستمرار في مشروع فاشل أو خاسر لمجرد أنك أنفقت فيه وقتاً أو مالاً مضى ولا يمكن استرداده أبداً",
        "إسقاط العملات المعدنية مصادفة في قاع حوض السباحة",
        "شراء غواصة بحرية غير قادرة على الطفو",
        "الاستثمار في شركات استكشاف المحيطات فقط"
      ],
      "correctIndex": 0,
      "explanation": "Sunk costs are past expenses that cannot be recovered and should not influence rational future decisions.",
      "explanationAr": "التكاليف الغارقة هي أموال أو أوقات مضت ولا يمكن استرجاعها، ويجب ألا تشوش على القرارات المستقبلية الرشيدة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_insurance_protection",
    "title": "Insurance: Buying an Invisible Umbrella for Emergencies",
    "titleAr": "التأمين: شراء مظلة أمان غير مرئية لأوقات الطوارئ",
    "description": "If lightning hits your lemonade booth, who pays to rebuild it? Discover how insurance protects families and founders from ruin.",
    "descriptionAr": "إذا ضربت صاعقة كشكك التجاري، من يدفع تكاليف إعادة بنائه؟ اكتشف كيف يحمي التأمين العائلات والشركات من الكوارث المالية.",
    "category": "Finance",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_supply_demand.jpg",
    "fullPosterUrl": "/images/videos/clip_supply_demand.jpg",
    "keyTerm": "Insurance & Risk Transfer",
    "keyTermAr": "التأمين وإدارة المخاطر (Insurance)",
    "likesCount": 1890,
    "viewsCount": 9500,
    "tags": [
      "insurance",
      "risk",
      "safety"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You saved for an entire year to buy a $600 delivery scooter for your bakery errands! 🛵✨",
          "captionAr": "ادخرت طوال عام كامل لتشتري دراجة توصيل بـ 600 دولار لتسليم طلبات المخبز الطازجة! 🛵✨",
          "mascotMood": "excited",
          "visualEmoji": "🛵",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Suddenly, a huge fallen branch crushes the scooter during a storm! Replacing it would wipe out your bank! ⛈️🌲",
          "captionAr": "وفجأة، سقط غصن شجرة ضخم في عاصفة وحطم الدراجة! وشراء غيرها سيبتلع كل مدخراتك المتبقية! ⛈️🌲",
          "mascotMood": "thinking",
          "visualEmoji": "⛈️",
          "visualType": "umbrella"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "With INSURANCE, you paid a small $5 monthly fee. The insurance company pays the full $600 to replace it! 🛡️💵",
          "captionAr": "مع التأمين، كنت تدفع اشتراكاً بسيطاً قدره 5 دولارات شهرياً. فقامت شركة التأمين بدفع الـ 600 دولار كاملة لشراء بديلة! 🛡️💵",
          "mascotMood": "celebrating",
          "visualEmoji": "🛡️",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Insurance transfers catastrophic risk away from you, so unexpected accidents never derail your dreams! 🌟🏆",
          "captionAr": "التأمين ينقل المخاطر الكارثية عن كاهلك، لكي لا تعطل الحوادث غير المتوقعة مسيرة نجاحك وطموحك! 🌟🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the fundamental purpose of Insurance in personal and business finance?",
      "questionAr": "ما هو الهدف الأساسي لخدمات التأمين في الإدارة المالية السليمة؟",
      "options": [
        "To transfer the risk of catastrophic financial losses to an insurer in exchange for regular small premium payments",
        "To guarantee that accidents will never happen again in the world",
        "To force cars to drive at half speed during daylight",
        "To receive free birthday cakes from the post office"
      ],
      "optionsAr": [
        "نقل عبء المخاطر والخسائر المالية الفادحة إلى شركة التأمين مقابل سداد أقساط شهرية بسيطة ومحددة",
        "ضمان عدم وقوع أي حوادث في العالم نهائياً",
        "إجبار السيارات على السير بنصف سرعتها نهاراً",
        "الحصول على كعكات عيد ميلاد مجانية من مكتب البريد"
      ],
      "correctIndex": 0,
      "explanation": "Insurance provides pooled risk management, turning unpredictable severe losses into predictable small fees.",
      "explanationAr": "يقوم التأمين على مبدأ توزيع المخاطر، محولاً الخسائر الكبرى غير المتوقعة إلى تكاليف دورية صغيرة يمكن التنبؤ بها.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_credit_score_trust",
    "title": "Your Credit Score: The Invisible Financial Reputation Score",
    "titleAr": "درجة الائتمان (Credit Score): بطاقة سمعتك المالية السرية",
    "description": "When you want to borrow money for a car, house, or company, banks look at a single number between 300 and 850. Meet your Credit Score.",
    "descriptionAr": "عندما ترغب في اقتراض مال لشراء منزل أو توسيع شركتك، تنظر البنوك إلى رقم واحد بين 300 و850. تعرف على درجتك الائتمانية.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Credit Score & Trust",
    "keyTermAr": "درجة الائتمان والجدارة المالية (Credit Score)",
    "likesCount": 2240,
    "viewsCount": 11200,
    "tags": [
      "credit",
      "banking",
      "trust"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "If a friend borrows your favorite video game and returns it the very next day in pristine condition, you trust them! 🎮⭐",
          "captionAr": "لو استعار صديق لعبتك المفضلة وأعادها في اليوم التالي نظيفة وسليمة تماماً، ستثق به وتكرر إعارته مستقبلاً! 🎮⭐",
          "mascotMood": "explaining",
          "visualEmoji": "🎮",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "If another friend borrows a comic book, loses it, and makes excuses, you will NEVER lend them anything again! 🙅‍♂️📕",
          "captionAr": "أما إذا استعار آخر قصة مصورة وأضاعها وأخذ يماطل في الاعتذار، فلن تقرضه أي شيء بعدها أبداً! 🙅‍♂️📕",
          "mascotMood": "thinking",
          "visualEmoji": "📕",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Banks do the exact same thing! They track your payment history with a CREDIT SCORE between 300 and 850! 📈🧮",
          "captionAr": "البنوك تفعل الشيء نفسه تماماً! تسجل التزامك بسداد الفواتير والديون برقم يسمى \"الدرجة الائتمانية\" من 300 إلى 850! 📈🧮",
          "mascotMood": "celebrating",
          "visualEmoji": "📈",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "A stellar score unlocks lower interest rates on loans, saving you tens of thousands of dollars on your future home! 🏰🏆",
          "captionAr": "الدرجة الائتمانية المرتفعة تمنحك شروطاً ممتازة ونسب فوائد منخفضة، مما يوفر عليك عشرات الآلاف في مستقبلك! 🏰🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What does a high Credit Score indicate to lenders and banks?",
      "questionAr": "على ماذا تدل الدرجة الائتمانية المرتفعة (Credit Score) للبنوك والمقرضين؟",
      "options": [
        "That the borrower has a reliable, proven track record of repaying debts and bills fully on time",
        "That the borrower has the loudest voice in the town hall",
        "That the borrower owns 50 golden smartphones",
        "That the borrower has never had a bank account"
      ],
      "optionsAr": [
        "أن المقترض شخص موثوق ومسؤول ولديه تاريخ مثبت في سداد التزاماته وفواتيره بدقة وفي مواعيدها",
        "أن المقترض يتمتع بأعلى نبرة صوت في المدينة",
        "أن المقترض يمتلك 50 هاتفاً ذكياً من الذهب",
        "أن المقترض لم يسبق له التعامل مع أي بنك من قبل"
      ],
      "correctIndex": 0,
      "explanation": "A high credit score demonstrates disciplined creditworthiness, qualifying borrowers for favorable financing rates.",
      "explanationAr": "تثبت الدرجة الائتمانية العالية الانضباط المالي والالتزام، مما يفتح الأبواب لأفضل عروض التمويل بأقل كلفة ممكنة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_sharing_economy",
    "title": "The Sharing Economy: Monetizing Empty Seats & Spare Rooms",
    "titleAr": "الاقتصاد التشاركي (Sharing Economy): كيف تربح من المقاعد الفارغة؟",
    "description": "Cars sit parked 95% of the day. Spare bedrooms sit empty. Discover how apps like Uber and Airbnb turn idle assets into cash.",
    "descriptionAr": "السيارات تقف مركونة 95% من ساعات اليوم! والغرف الإضافية تبقى شاغرة. اكتشف كيف تحول التطبيقات الأصول الخاملة إلى أرباح.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "The Sharing Economy",
    "keyTermAr": "الاقتصاد التشاركي (The Sharing Economy)",
    "likesCount": 2110,
    "viewsCount": 10600,
    "tags": [
      "sharing",
      "airbnb",
      "innovation"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-purple-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Most family cars sit in the driveway collecting dust for 23 hours every single day! 🚗💤",
          "captionAr": "معظم السيارات العائلية تقف مركونة في المرآب بلا حركة تجمع الغبار لمدة 23 ساعة في اليوم الواحد! 🚗💤",
          "mascotMood": "explaining",
          "visualEmoji": "🚗",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Instead of buying more cars, what if drivers used spare seats to give rides to neighbors who need a lift? 👥📍",
          "captionAr": "بدلاً من شراء سيارات جديدة، ماذا لو استغل السائق المقاعد الشاغرة لتوصيل ركاب يحتاجون مشواراً؟ 👥📍",
          "mascotMood": "thinking",
          "visualEmoji": "📍",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That is the SHARING ECONOMY! Uber owns zero taxis, Airbnb owns zero hotels, yet they connect millions through code! 💻✨",
          "captionAr": "هذا هو \"الاقتصاد التشاركي\"! أوبر لا تملك سيارات أجرة، وإير بي إن بي لا تملك فنادق، لكنهما يربطان الملايين بالبرمجيات! 💻✨",
          "mascotMood": "celebrating",
          "visualEmoji": "✨",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Look around your home or neighborhood. What idle assets or tools could be shared for mutual profit? 🚀🏆",
          "captionAr": "انظر حولك في المنزل والحي؛ ما هي الأدوات أو المساحات المهملة التي يمكن مشاركتها لتحقيق نفع وأرباح مشتركة؟ 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the core premise of the \"Sharing Economy\"?",
      "questionAr": "ما هو المبدأ الجوهري لـ \"الاقتصاد التشاركي\" (Sharing Economy)؟",
      "options": [
        "Unlocking economic value by granting peer-to-peer access to underutilized assets and skills via digital platforms",
        "Giving away your personal belongings to anyone who knocks on your door",
        "Banning all hotels and taxi companies by international law",
        "Sharing your computer passwords with strangers online"
      ],
      "optionsAr": [
        "توليد قيمة اقتصادية عبر إتاحة الوصول المتبادل للأصول غير المستغلة والمهارات الفردية عبر منصات رقمية آمنة",
        "التخلي عن مقتنياتك الشخصية لكل من يطرق بابك",
        "حظر جميع الفنادق وسيارات الأجرة بالقانون الدولي",
        "مشاركة كلمات المرور الخاصة بحساباتك مع الغرباء"
      ],
      "correctIndex": 0,
      "explanation": "The sharing economy monetizes surplus capacity (empty rooms, idle vehicles) through peer platforms.",
      "explanationAr": "يستثمر الاقتصاد التشاركي الطاقات الفائضة كالغرف الشاغرة والسيارات المركونة لتبادل المنفعة وتحقيق دخل إضافي.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_ecommerce_dropshipping",
    "title": "Dropshipping vs Warehousing: How Online Stores Ship Toys",
    "titleAr": "الدروب شيبينغ مقابل المستودعات: كيف تشحن المتاجر الإلكترونية بضاعتها؟",
    "description": "You can sell 1,000 gaming headsets online without touching a single box! Compare dropshipping ease with warehouse margins.",
    "descriptionAr": "يمكنك بيع ألف سماعة ألعاب عبر الإنترنت دون أن تلمس صندوقاً واحداً! قارن بين سهولة الدروب شيبينغ وأرباح التخزين.",
    "category": "Tutorial",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Dropshipping vs Inventory",
    "keyTermAr": "الدروب شيبينغ وإدارة المخزون (Dropshipping)",
    "likesCount": 2030,
    "viewsCount": 10400,
    "tags": [
      "ecommerce",
      "dropshipping",
      "retail"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-orange-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-orange-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Traditional shops buy 500 backpacks in advance and stack them up to the ceiling in their garage! 🎒📦",
          "captionAr": "المتاجر التقليدية تشتري 500 حقيبة مدرسية مقدماً وتخزنها حتى سقف الغرفة في المنزل أو المستودع! 🎒📦",
          "mascotMood": "explaining",
          "visualEmoji": "📦",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "If the backpacks don’t sell, you are stuck with empty pockets and a room full of unsold nylon! 😱",
          "captionAr": "وإذا لم تُبَع تلك الحقائب، فستعلق بجيوب فارغة وغرفة مليئة بأقمشة متراكمة بلا مشترين! 😱",
          "mascotMood": "thinking",
          "visualEmoji": "💸",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "With DROPSHIPPING, the customer orders on your site, and the factory ships it straight to their door! 🏭🚚",
          "captionAr": "مع \"الدروب شيبينغ\"، يطلب الزبون من متجرك، فيقوم المصنع بشحن الحقيبة مباشرة إلى باب منزله! 🏭🚚",
          "mascotMood": "celebrating",
          "visualEmoji": "🚚",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Zero storage hassle, zero upfront stock risk! You focus on marketing, branding, and great service! 🚀🏆",
          "captionAr": "صفر تكاليف تخزين، وصفر مخاطر شراء بضائع مقدماً! تركز كامل جهدك على التسويق وخدمة العملاء! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the main advantage of the Dropshipping business model?",
      "questionAr": "ما هي الميزة الكبرى لنموذج عمل الدروب شيبينغ (Dropshipping) للمبتدئين؟",
      "options": [
        "The retailer does not need to purchase or store physical inventory upfront before making a sale",
        "Products are always delivered via carrier pigeons",
        "Customers are not allowed to return damaged goods",
        "Everything sold is 100% free of charge"
      ],
      "optionsAr": [
        "عدم حاجة التاجر لشراء أو تخزين بضائع مسبقة في مستودعاته قبل أن يقوم العميل بالشراء والدفع فعلياً",
        "توصيل البضائع دائماً عبر الحمام الزاجل",
        "منع الزبائن من استرجاع أي بضاعة معطوبة",
        "أن كل المنتجات المعروضة مجانية بالكامل"
      ],
      "correctIndex": 0,
      "explanation": "Dropshipping removes balance sheet inventory risk by routing fulfillments directly from supplier to consumer.",
      "explanationAr": "يلغي الدروب شيبينغ مخاطر تجميد رأس المال في المخزون، عبر تحويل الشحنات مباشرة من المورد إلى المشتري النهائي.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_margin_of_safety",
    "title": "Margin of Safety: Warren Buffett’s Golden Rule",
    "titleAr": "هامش الأمان (Margin of Safety): القاعدة الذهبية لوارن بافيت",
    "description": "If you build a bridge that must hold 10,000 lbs, you engineer it to hold 30,000 lbs! Learn why smart investors demand safety buffers.",
    "descriptionAr": "إذا كنت تبني جسراً لعبور شاحنة وزنها 10 آلاف رطل، صممه ليتحمل 30 ألفاً! اكتشف سر صمام الأمان الاستثماري.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_apple_investing.jpg",
    "fullPosterUrl": "/images/videos/clip_apple_investing.jpg",
    "keyTerm": "Margin of Safety",
    "keyTermAr": "هامش الأمان في الاستثمار (Margin of Safety)",
    "likesCount": 2390,
    "viewsCount": 12100,
    "tags": [
      "buffett",
      "investing",
      "risk"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-yellow-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-yellow-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When structural engineers design a bridge for 10-ton trucks, do they design it to hold exactly 10 tons? 🌉🚛",
          "captionAr": "عندما يصمم المهندسون جسراً لعبور شاحنات تزن 10 أطنان، هل يصممونه ليتحمل 10 أطنان فقط على الحافة؟ 🌉🚛",
          "mascotMood": "explaining",
          "visualEmoji": "🌉",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Never! They build it to hold 30 TONS! That extra strength cushion is called a MARGIN OF SAFETY! 🛡️🏗️",
          "captionAr": "أبداً! بل يصممونه ليتحمل 30 طناً! هذه القوة الإضافية الاحتياطية تسمى \"هامش الأمان\"! 🛡️🏗️",
          "mascotMood": "excited",
          "visualEmoji": "🛡️",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Billionaire investor Warren Buffett uses the exact same rule: Only buy assets for much LESS than they are truly worth! 💵📉",
          "captionAr": "المستثمر الأسطوري وارن بافيت يطبق نفس القاعدة: اشترِ الأصول بأسعار أقل بكثير من قيمتها الحقيقية العادلة! 💵📉",
          "mascotMood": "celebrating",
          "visualEmoji": "💵",
          "visualType": "stocks",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "If your calculations are slightly wrong, your safety buffer absorbs the hit and shields your fortune! 🚀🏰",
          "captionAr": "حتى لو أخطأت حساباتك قليلاً، فإن هامش الأمان يمتص الصدمة ويحمي ثروتك من الانهيار! 🚀🏰",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Margin of Safety\" in value investing?",
      "questionAr": "ما هو \"هامش الأمان\" (Margin of Safety) في الاستثمار القيمي؟",
      "options": [
        "Buying a security at a significant discount to its estimated intrinsic value to minimize downside risk",
        "Wearing a yellow construction helmet while trading stocks on a laptop",
        "Keeping all your bank cards locked in a safe deposit box forever",
        "Only buying stocks on Tuesdays"
      ],
      "optionsAr": [
        "شراء السهم أو الأصل بخصم سعري ملحوظ عن قيمته الحقيقية التقديرية لتقليل مخاطر الخسارة المحتملة",
        "ارتداء خوذة عمال البناء الصفراء أثناء تداول الأسهم على الحاسوب",
        "حفظ كل بطاقاتك البنكية في خزنة حديدية مغلقة إلى الأبد",
        "شراء الأسهم يوم الثلاثاء فقط"
      ],
      "correctIndex": 0,
      "explanation": "The margin of safety provides a protective cushion against analytical errors or economic downturns.",
      "explanationAr": "يوفر هامش الأمان وسادة حماية مريحة تمتص أخطاء التقدير والتقلبات الاقتصادية المعاكسة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_retention_vs_churn",
    "title": "Retention vs Churn: Don’t Fill a Leaky Bucket",
    "titleAr": "الاحتفاظ بالعملاء مقابل التسرب (Churn): لا تسكب الماء في دلو مثقوب",
    "description": "If you gain 10 new customers every week but lose 9 through bad service, you will never grow! Learn why keeping fans is 5x cheaper.",
    "descriptionAr": "إذا اكتسبت 10 زبائن جدد أسبوعياً وفقدت 9 بسبب سوء المعاملة، فلن تكبر أبداً! اكتشف لماذا الاحتفاظ بالعميل أوفر بـ 5 مرات.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Retention Rate vs Churn",
    "keyTermAr": "معدل الاحتفاظ بالعملاء ونسبة التسرب (Retention vs Churn)",
    "likesCount": 2170,
    "viewsCount": 11100,
    "tags": [
      "retention",
      "churn",
      "customers"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Imagine pouring cool water into a wooden bucket with 3 big holes drilled in the bottom! 🪣🚰",
          "captionAr": "تخيل أنك تسكب ماءً عذباً في دلو خشبي توجد في أسفله 3 ثقوب واسعة تسرب المياه! 🪣🚰",
          "mascotMood": "explaining",
          "visualEmoji": "🪣",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "No matter how fast you pump new water in, the bucket never fills up! That is CUSTOMER CHURN! 💧🏃‍♂️",
          "captionAr": "مهما سكبت وضخخت مياهاً جديدة بسرعة، فلن يمتلئ الدلو أبداً! هذا هو تسرب العملاء (Churn)! 💧🏃‍♂️",
          "mascotMood": "thinking",
          "visualEmoji": "💧",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Plugging the leaks by fixing bad service and showing love to existing buyers is CUSTOMER RETENTION! 💖🛡️",
          "captionAr": "سد تلك الثقوب عبر تحسين الجودة ومعاملة الزبائن الحاليين بكرم وتقدير يسمى \"الاحتفاظ بالعملاء\"! 💖🛡️",
          "mascotMood": "celebrating",
          "visualEmoji": "💖",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Keeping an existing customer happy is 5 TIMES cheaper than convincing a total stranger to buy! 🚀🏆",
          "captionAr": "إسعاد العميل الحالي أرخص بـ 5 مرات من تكلفة إقناع شخص غريب تماماً بالشراء لأول مرة! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is \"Customer Churn\"?",
      "questionAr": "ما هو تعريف \"تسرب العملاء\" (Customer Churn Rate)؟",
      "options": [
        "The percentage of customers who stop doing business or cancel their subscriptions over a given time period",
        "The speed at which milk turns into butter in a churn machine",
        "The total number of chairs inside a store",
        "How many coupons are printed in Sunday circulars"
      ],
      "optionsAr": [
        "النسبة المئوية للعملاء الذين يتوقفون عن التعامل مع مشروعك أو يلغون اشتراكاتهم خلال فترة زمنية معينة",
        "السرعة التي يتحول بها الحليب إلى زبدة في آلة الخفق",
        "إجمالي عدد المقاعد المخصصة للجلوس داخل المتجر",
        "عدد القسائم الورقية المطبوعة في إعلانات نهاية الأسبوع"
      ],
      "correctIndex": 0,
      "explanation": "Churn rate tracks customer attrition, highlighting where the product experience fails to retain loyalty.",
      "explanationAr": "يقيس معدل التسرب نسبة فقدان العملاء ويكشف بدقة جوانب القصور في التجربة والخدمة لمعالجتها فوراً.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_gamification_hooks",
    "title": "Gamification: How Apps Turn Chores into Addictive Quests",
    "titleAr": "التلعيب (Gamification): كيف تحول التطبيقات المهام إلى ألعاب ممتعة؟",
    "description": "Why do language apps give you streak flames, XP points, and level-up badges? Discover the science of gamification hooks.",
    "descriptionAr": "لماذا تمنحك تطبيقات التعلم شعلات الأيام المتتالية ونقاط XP وأوسمة الإنجاز؟ اكتشف سيكولوجية التلعيب في الأعمال.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Gamification Mechanics",
    "keyTermAr": "آليات التلعيب في التطبيقات (Gamification)",
    "likesCount": 2280,
    "viewsCount": 11900,
    "tags": [
      "gamification",
      "ux",
      "psychology"
    ],
    "animationConfig": {
      "themeColor": "from-purple-500 to-indigo-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Memorizing vocabulary or doing household chores usually feels boring and tiring... 🥱📚",
          "captionAr": "حفظ المفردات الجديدة أو ترتيب الأغراض المنزلية غالباً ما يبدو عملاً روتينياً مملاً ومجهداً... 🥱📚",
          "mascotMood": "explaining",
          "visualEmoji": "🥱",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Now add a streak counter, shiny level-up sound effects, and collectible badges! LEVEL UP! 🎮✨",
          "captionAr": "الآن أضف عداد أيام متتالية، وأصوات فوز مبهجة، وأوسمة رقمية عند كل تقدم! ترقية المستوى! 🎮✨",
          "mascotMood": "excited",
          "visualEmoji": "✨",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "That is GAMIFICATION: Using game mechanics like points and leaderboards in non-game environments! 🏆📊",
          "captionAr": "هذا هو \"التلعيب\" (Gamification): استخدام عناصر الألعاب كالنقاط والتحديات ولوحات الشرف في التطبيقات! 🏆📊",
          "mascotMood": "celebrating",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Smart businesses make habit-building rewarding and joyful, turning users into lifelong enthusiastic fans! 🚀👑",
          "captionAr": "المشاريع الذكية تجعل بناء العادات تجربة مشوقة ومبهجة، فتحول المستخدمين إلى أبطال متحمسين دائماً! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is \"Gamification\" in product design?",
      "questionAr": "ما هو مفهوم \"التلعيب\" (Gamification) في تصميم المنتجات والخدمات؟",
      "options": [
        "Applying game elements (like points, streaks, badges, and challenges) to non-game contexts to boost engagement",
        "Turning every office computer into a Nintendo console",
        "Forcing customers to play chess before buying bread",
        "Paying users in chocolate coins instead of real currency"
      ],
      "optionsAr": [
        "تطبيق عناصر الألعاب (كالنقاط، والأوسمة، والتحديات، والتنافس) في سياقات غير ترفيهية لرفع تفاعل المستخدمين",
        "تحويل جميع حواسيب الشركة إلى أجهزة ألعاب إلكترونية",
        "إجبار الزبائن على لعب الشطرنج قبل شراء الخبز",
        "دفع أرباح العملاء بعملات شوكولاتة بدلاً من النقود"
      ],
      "correctIndex": 0,
      "explanation": "Gamification taps intrinsic psychological rewards (progress, mastery, status) to make engagement habitual.",
      "explanationAr": "يستثمر التلعيب الدوافع النفسية الإيجابية كالشعور بالإنجاز والتقدم والتميز لتحويل الاستخدام إلى عادة محببة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_pareto_80_20",
    "title": "The 80/20 Pareto Rule: Why 20% Creates 80% of Wealth",
    "titleAr": "قاعدة باريتو 80/20: لماذا يصنع 20% من الجهد 80% من النتائج؟",
    "description": "In almost every company, 20% of your products bring in 80% of your profits! Learn how to focus laser energy on what counts.",
    "descriptionAr": "في كل شركة تقريباً، 20% فقط من المنتجات تحقق 80% من إجمالي الأرباح! تعلم كيف توجه طاقتك نحو الأنشطة الذهبية.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "The Pareto Principle (80/20)",
    "keyTermAr": "مبدأ باريتو (قاعدة 80/20)",
    "likesCount": 2360,
    "viewsCount": 12000,
    "tags": [
      "pareto",
      "productivity",
      "efficiency"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-yellow-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-yellow-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "An Italian economist named Vilfredo Pareto noticed 20% of peapods in his garden produced 80% of the healthy peas! 🌱🫛",
          "captionAr": "لاحظ عالم اقتصاد إيطالي أن 20% من شتلات البازلاء في حديقته تنتج 80% من حبات البازلاء الممتازة! 🌱🫛",
          "mascotMood": "explaining",
          "visualEmoji": "🌱",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "In business, the exact same law holds true: 80% of your revenue comes from just 20% of your loyal clients! 📊👥",
          "captionAr": "في عالم الأعمال، نفس القانون يتكرر: 80% من أرباحك تأتي من 20% فقط من زبائنك الأكثر ولاءً! 📊👥",
          "mascotMood": "thinking",
          "visualEmoji": "📊",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "And 80% of your customer support headaches are caused by 20% of chronic complainers! 😤📞",
          "captionAr": "وكذلك 80% من وقت الدعم الفني والمتاعب يتسبب بها 20% فقط من الزبائن المتذمرين دائماً! 😤📞",
          "mascotMood": "celebrating",
          "visualEmoji": "📞",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Identify your Vital 20%. Double down on your best products and best clients, and watch success soar! 🚀👑",
          "captionAr": "حدد \"الـ 20% الذهبية\" في مشروعك ويومك، وضاعف تركيزك عليها، وشاهد نجاحك يحلق عالياً! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "How can a young entrepreneur apply the 80/20 Pareto Rule to their business?",
      "questionAr": "كيف يطبق رائد الأعمال الصاعد قاعدة باريتو 80/20 في مشروعه بذكاء؟",
      "options": [
        "By identifying the top 20% of products or clients that generate 80% of profits, and prioritizing them above all else",
        "By eating 80 cookies in 20 minutes",
        "By sleeping 80 hours every weekend",
        "By pricing all inventory at exactly $80.20"
      ],
      "optionsAr": [
        "بتحديد أفضل 20% من المنتجات أو العملاء الذين يولدون 80% من الأرباح وتركيز الجهد والوقت عليهم أولاً",
        "بتناول 80 قطعة بسكويت في 20 دقيقة",
        "بالنوم لمدة 80 ساعة في عطلة نهاية الأسبوع",
        "بتسعير كل المنتجات في المتجر بمبلغ 80.20 دولار بالضبط"
      ],
      "correctIndex": 0,
      "explanation": "The Pareto Principle guides efficient prioritization: focus maximum resources on the high-yield 20% drivers.",
      "explanationAr": "يرشد مبدأ باريتو لتحديد الأولويات بكفاءة: تكثيف الموارد على الأنشطة والعملاء الأكثر جلباً للنتائج والأرباح.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_unit_economics",
    "title": "Unit Economics: Does Making ONE Cup Actually Make Money?",
    "titleAr": "اقتصاديات الوحدة (Unit Economics): هل تربح في الكوب الواحد؟",
    "description": "Never say \"We lose money on every sale, but we will make it up in volume!\" Discover why one single unit must be profitable.",
    "descriptionAr": "إياك أن تقول \"نحن نخسر في كل كوب نبيعه ولكننا سنعوض ذلك مع كثرة المبيعات!\" تعلم كيف تجعل كل وحدة رابحة بذاتها.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "Unit Economics & Margins",
    "keyTermAr": "اقتصاديات الوحدة وهامش المساهمة (Unit Economics)",
    "likesCount": 2210,
    "viewsCount": 11300,
    "tags": [
      "uniteconomics",
      "finance",
      "margins"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "An entrepreneur sells cups of fresh lemonade for $1.50 each. Sounds like a good deal, right? 🍋🥤",
          "captionAr": "رائد أعمال يبيع كوب عصير الليمون المنعش بـ 1.50 دولار. تبدو صفقة ممتازة، أليس كذلك؟ 🍋🥤",
          "mascotMood": "explaining",
          "visualEmoji": "🍋",
          "visualType": "lemonade",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Let us check the cost of ONE CUP: Lemon 80¢ + Sugar 30¢ + Cup & Straw 40¢ + Ice 10¢ = $1.60! 😱💸",
          "captionAr": "دعنا نحسب تكلفة \"الكوب الواحد\": الليمون 80 سنتاً + سكر 30 سنتاً + كوب ومصاصة 40 سنتاً + ثلج 10 سنتات = 1.60 دولار! 😱💸",
          "mascotMood": "thinking",
          "visualEmoji": "💸",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "He loses 10 cents on EVERY SINGLE CUP! Selling 1,000 cups doesn’t make him rich—it loses him $100 faster! 💥📉",
          "captionAr": "إنه يخسر 10 سنتات في كل كوب يبيعه! بيع 1,000 كوب لن يجعله غنياً، بل سيسرع خسارته لـ 100 دولار إضافية! 💥📉",
          "mascotMood": "celebrating",
          "visualEmoji": "📉",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Master your UNIT ECONOMICS first! Ensure every single transaction is fundamentally sound and profitable! 🚀🏆",
          "captionAr": "اضبط \"اقتصاديات الوحدة\" أولاً! تأكد من أن كل عملية بيع فردية رابحة ومجدية قبل أن تفكر في التوسع والانتشار! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the purpose of analyzing \"Unit Economics\"?",
      "questionAr": "ما هو الهدف الجوهري لتحليل \"اقتصاديات الوحدة\" (Unit Economics)؟",
      "options": [
        "To determine direct revenues and costs associated with a single unit of production to verify underlying profitability",
        "To count how many units of air are inside the office",
        "To calculate the weight of one employee in kilograms",
        "To verify that the cash register can display the number 1"
      ],
      "optionsAr": [
        "تحديد الإيرادات والتكاليف المباشرة المرتبطة بإنتاج وبيع وحدة واحدة للتأكد من ربحية النموذج التجاري الأساسي",
        "حساب كمية الهواء المتوفرة داخل مبنى الشركة",
        "قياس وزن الموظف الفردي بالكيلوغرام",
        "التأكد من قدرة آلة الحساب على إظهار الرقم 1"
      ],
      "correctIndex": 0,
      "explanation": "Unit economics evaluates whether an individual product transaction is fundamentally viable before scaling.",
      "explanationAr": "تقيم اقتصاديات الوحدة مدى جدوى وربحية الصفقة الواحدة في ذاتها لضمان أن التوسع سيجلب أرباحاً لا خسائر متراكمة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_social_proof_reviews",
    "title": "Social Proof: Why 5-Star Reviews Make You Rich",
    "titleAr": "الدليل الاجتماعي (Social Proof): لماذا تجعلك تقييمات الـ 5 نجوم ثرياً؟",
    "description": "Walking past two pizza shops: One is packed with laughing people, the other is completely empty. Where do you eat? Learn Social Proof.",
    "descriptionAr": "مررت بمطعمي بيتزا متجاورين: أحدهما يعج بالزبائن الضاحكين، والآخر مهجور تماماً. أين ستتناول طعامك؟ اكتشف الدليل الاجتماعي.",
    "category": "Strategy",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_strategy.jpg",
    "keyTerm": "Social Proof & Reputation",
    "keyTermAr": "الدليل الاجتماعي والسمعة (Social Proof)",
    "likesCount": 2310,
    "viewsCount": 11800,
    "tags": [
      "socialproof",
      "reviews",
      "psychology"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-yellow-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-yellow-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You arrive in a new city looking for dinner. You see two noodle shops right across the street! 🍜🏙️",
          "captionAr": "وصلت إلى مدينة جديدة وتبحث عن وجبة عشاء شهية. رأيت مطعمين يقدمان النودلز في نفس الشارع! 🍜🏙️",
          "mascotMood": "explaining",
          "visualEmoji": "🍜",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Shop A has a line of 20 smiling people outside. Shop B has zero customers and the waiter is asleep! 😴🚪",
          "captionAr": "المطعم (أ) أمامه طابور من 20 شخصاً يبتسمون بحماس، والمطعم (ب) خالٍ تماماً ونادل المطعم نائم! 😴🚪",
          "mascotMood": "thinking",
          "visualEmoji": "😴",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Your brain instantly chooses Shop A! That is SOCIAL PROOF: When uncertain, humans look to others for validation! 👥⭐",
          "captionAr": "عقلك يختار فوراً المطعم (أ)! هذا هو \"الدليل الاجتماعي\": عندما نتردد، نسترشد بتصرفات وخيارات الآخرين! 👥⭐",
          "mascotMood": "celebrating",
          "visualEmoji": "⭐",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Gather glowing 5-star reviews, showcase happy buyers, and let your reputation do the selling! 🚀🏆",
          "captionAr": "اجمع تقييمات 5 نجوم صادقة، واعرض شهادات زبائنك السعداء، ودع سمعتك المضيئة تجلب لك المبيعات! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is \"Social Proof\" in marketing and consumer behavior?",
      "questionAr": "ما هو تعريف \"الدليل الاجتماعي\" (Social Proof) في علم التسويق وسلوك المستهلك؟",
      "options": [
        "The psychological phenomenon where people mirror the actions of others to reflect correct behavior in a given situation",
        "A scientific test proving that everyone has 10 fingers",
        "Showing your passport to a bus driver",
        "Posting an apology letter in a local newspaper"
      ],
      "optionsAr": [
        "ظاهرة نفسية يقلد فيها الناس أفعال وخيارات الآخرين لاعتقادهم بأن إقبال الحشود دليل على جودة وصحة الخيار",
        "اختبار علمي يثبت أن كل إنسان يمتلك 10 أصابع",
        "إظهار جواز سفرك لسائق الحافلة",
        "نشر خطاب اعتذار في الجريدة المحلية"
      ],
      "correctIndex": 0,
      "explanation": "Social proof leverages testimonials, reviews, and crowded adoption to reassure prospective buyers.",
      "explanationAr": "يستغل الدليل الاجتماعي التقييمات الإيجابية وازدحام المشترين لطمأنة الزبائن الجدد وتحفيزهم على الشراء بثقة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_foreign_exchange",
    "title": "Foreign Exchange Rates: Why Money Shifts When You Travel",
    "titleAr": "أسعار الصرف والعملات الأجنبية: لماذا تتغير قيمة المال عند السفر؟",
    "description": "You land in Tokyo with $100 and receive 15,000 Yen! Are you rich now? Discover how global currency markets set exchange values.",
    "descriptionAr": "هبطت طائرتك في طوكيو ومعك 100 دولار فحصلت على 15,000 ين ياباني! هل أصبحت ثرياً؟ اكتشف كيف تحدد الأسواق أسعار الصرف.",
    "category": "Finance",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_money_evolution.jpg",
    "fullPosterUrl": "/images/videos/clip_money_evolution.jpg",
    "keyTerm": "Foreign Exchange (Forex)",
    "keyTermAr": "سعر الصرف والعملات الأجنبية (Forex)",
    "likesCount": 2190,
    "viewsCount": 11000,
    "tags": [
      "forex",
      "currency",
      "travel"
    ],
    "animationConfig": {
      "themeColor": "from-blue-600 to-indigo-800",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "You step off the plane in Japan. At the airport booth, you trade one $100 bill for 15,000 Yen! ✈️💴",
          "captionAr": "نزلت من الطائرة في مطار اليابان، واستبدلت ورقة واحدة بـ 100 دولار فحصلت على 15,000 ين ياباني! ✈️💴",
          "mascotMood": "excited",
          "visualEmoji": "💴",
          "visualType": "coins",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Suddenly you feel like a billionaire! But then you see a bowl of ramen costs 1,200 Yen! What is going on? 🍜😅",
          "captionAr": "شعرت وكأنك أصبحت مليارديراً فجأة! ولكنك لاحظت أن طبق النودلز الواحد يكلف 1,200 ين! ما القصة؟ 🍜😅",
          "mascotMood": "thinking",
          "visualEmoji": "🍜",
          "visualType": "store"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Currencies have different denominations and fluctuating EXCHANGE RATES based on country trade and demand! 🌍📈",
          "captionAr": "العملات تختلف في قيمتها وأسمائها، وتتحدد أسعار صرفها في الأسواق العالمية بناءً على قوة التجارة والطلب! 🌍📈",
          "mascotMood": "celebrating",
          "visualEmoji": "🌍",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "When a country’s economy produces world-class exports, demand for their currency rises, making it stronger! 🚀👑",
          "captionAr": "عندما تنتج الدولة صادرات صناعية وتقنية فائقة، يرتفع الطلب العالمي على عملتها وتزداد قوتها الشرائية! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What determines the exchange rate between two different national currencies?",
      "questionAr": "ما الذي يحدد سعر الصرف بين عملتين وطنيتين مختلفتين في الأسواق العالمية؟",
      "options": [
        "Global supply and demand for each currency, influenced by trade, interest rates, and economic stability",
        "The size and thickness of the paper banknotes",
        "Which country has taller mountains",
        "A coin toss conducted by airline pilots"
      ],
      "optionsAr": [
        "قوى العرض والطلب العالمية على كل عملة، متأثرة بحجم التجارة الدولية وأسعار الفائدة وقوة الاقتصاد",
        "حجم وسماكة الورق المستخدم في طباعة العملة",
        "أي البلدين يمتلك جبالاً أكثر ارتفاعاً",
        "قرعة يرميها طيارو الخطوط الجوية بالعملة المعدنية"
      ],
      "correctIndex": 0,
      "explanation": "Forex exchange rates float based on trade balance, inflation, interest rate differentials, and global demand.",
      "explanationAr": "تتغير أسعار صرف العملات وفقاً للميزان التجاري ومعدلات التضخم والفوائد البنكية وحجم الطلب الاستثماري الدولي.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_creator_flywheel",
    "title": "The Creator Flywheel: How YouTubers Build Toy Empires",
    "titleAr": "عجلة صناع المحتوى (Creator Flywheel): كيف يبني اليوتيوبرز إمبراطوريات تجارية؟",
    "description": "MrBeast doesn’t just make funny videos; he sells Feastables chocolate bars across 50,000 supermarkets! Discover the creator flywheel.",
    "descriptionAr": "مستر بيست لا يصنع مقاطع ترفيهية فقط، بل يبيع ملايين ألواح الشوكولاتة في 50 ألف متجر! اكتشف عجلة نفوذ صناع المحتوى.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "The Creator Economy Flywheel",
    "keyTermAr": "عجلة اقتصاد صناع المحتوى (Creator Flywheel)",
    "likesCount": 2640,
    "viewsCount": 13900,
    "tags": [
      "creators",
      "media",
      "branding"
    ],
    "animationConfig": {
      "themeColor": "from-pink-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-pink-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Traditional companies spend billions buying 30-second TV commercials that viewers skip in a heartbeat! 📺💸",
          "captionAr": "الشركات التقليدية تنفق مليارات على إعلانات تلفزيونية قصيرة يتجاوزها المشاهدون في لمح البصر! 📺💸",
          "mascotMood": "explaining",
          "visualEmoji": "📺",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Creators do the opposite: They entertain and educate fans for FREE, building years of authentic trust! 🎬💖",
          "captionAr": "صناع المحتوى المبدعون يفعلون العكس: يقدمون الفائدة والمرح مجاناً لسنوات ويبنون علاقة ثقة وصداقة عميقة! 🎬💖",
          "mascotMood": "excited",
          "visualEmoji": "💖",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "When that creator launches a delicious snack, clothing brand, or software, fans buy out every store in minutes! 🍫👕",
          "captionAr": "وعندما يطلق صانع المحتوى وجبة خفيفة أو خط أزياء أو تطبيقاً، يتسابق الجمهور لشرائها وتنفد الكميات في دقائق! 🍫👕",
          "mascotMood": "celebrating",
          "visualEmoji": "🍫",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Audience + Authentic Trust + Great Physical Products = An unstoppable modern business empire! 🚀👑",
          "captionAr": "جمهور وفي + ثقة حقيقية + منتج ممتاز ذو جودة عالية = إمبراطورية تجارية عصرية خارقة للعادة! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the secret advantage of the \"Creator Flywheel\" in modern business?",
      "questionAr": "ما هي الميزة السرية الخارقة لـ \"عجلة صناع المحتوى\" (Creator Flywheel) في التجارة الحديثة؟",
      "options": [
        "They possess zero-cost direct distribution and genuine organic trust with millions of devoted fans",
        "They are exempt from paying any shipping fees by international treaties",
        "Video cameras create gold coins when recorded in 4K resolution",
        "They never have to pay factory costs"
      ],
      "optionsAr": [
        "امتلاك قنوات توزيع مباشرة بتكلفة إعلانية صفرية وثقة متبادلة مع ملايين المعجبين المخلصين لعلامتهم",
        "إعفاؤهم من أي رسوم شحن بموجب معاهدات دولية",
        "أن كاميرات الفيديو تصنع نقوداً ذهبية عند التصوير بدقة عالية",
        "أن المصانع تقدم لهم كل شيء مجاناً"
      ],
      "correctIndex": 0,
      "explanation": "Creators possess built-in distribution, slashing Customer Acquisition Cost (CAC) close to zero.",
      "explanationAr": "يمتلك صناع المحتوى قاعدة جماهيرية جاهزة ومتحمسة، مما يهبط بتكلفة اكتساب العميل (CAC) إلى ما يقارب الصفر.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_positive_sum_wealth",
    "title": "Positive-Sum Wealth: Baking a Bigger Pie for Everyone",
    "titleAr": "لعبة المكسب المشترك (Positive-Sum): كيف نصنع كعكة تكفي الجميع؟",
    "description": "In poker, for you to win $10, someone must lose $10. In business, both buyer and seller win! Discover positive-sum wealth creation.",
    "descriptionAr": "في ألعاب الرهان، لكي تربح 10 دولارات يجب أن يخسرها غيرك. أما في ريادة الأعمال، فالجميع يربح! اكتشف سحر التبادل المثمر.",
    "category": "Mindset",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_dollar_seeds.jpg",
    "fullPosterUrl": "/images/videos/clip_dollar_seeds.jpg",
    "keyTerm": "Positive-Sum Economics",
    "keyTermAr": "الاقتصاد غير الصفري والمكسب المشترك (Positive-Sum)",
    "likesCount": 2410,
    "viewsCount": 12300,
    "tags": [
      "wealth",
      "economics",
      "mindset"
    ],
    "animationConfig": {
      "themeColor": "from-amber-400 to-emerald-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-emerald-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "In musical chairs, if one kid gets a seat, another kid gets left out in the cold! That is a ZERO-SUM game! 🪑❌",
          "captionAr": "في لعبة الكراسي الموسيقية، إذا جلس طفل على كرسي، يُطرد طفل آخر ويبقى واقفاً! هذه لعبة صفرية خاسرة! 🪑❌",
          "mascotMood": "explaining",
          "visualEmoji": "🪑",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Many people mistakenly think business works like that: \"For me to get rich, someone else must become poor!\" WRONG! 🙅‍♂️",
          "captionAr": "يظن البعض خطأً أن التجارة تعمل هكذا: \"لكي أصبح غنياً، يجب أن يفتقر شخص آخر!\" هذا فهم خاطئ تماماً! 🙅‍♂️",
          "mascotMood": "thinking",
          "visualEmoji": "🙅‍♂️",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "When you buy a smartphone for $500, you value the phone MORE than your $500! Both sides walk away WINNERS! 📱🤝",
          "captionAr": "عندما تشتري هاتفاً ذكياً بـ 500 دولار، فأنت ترى قيمة الجهاز أكبر من الـ 500 دولار! كلا الطرفين يغادر رابحاً وسعيداً! 📱🤝",
          "mascotMood": "celebrating",
          "visualEmoji": "📱",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Innovation bakes a BIGGER PIE for society! True entrepreneurship creates abundance for all humanity! 🥧🌟👑",
          "captionAr": "الابتكار يصنع كعكة ثروة أكبر للمجتمع بأسره! ريادة الأعمال الحقيقية تخلق الوفرة والرخاء للجميع! 🥧🌟👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a \"Positive-Sum\" economic relationship?",
      "questionAr": "ما هو المقصود بالعلاقة الاقتصادية \"ذات المكسب المشترك\" (Positive-Sum)؟",
      "options": [
        "A voluntary trade where all participating parties end up better off and wealthier than they were before",
        "A card game where the loser pays for everyone’s dinner",
        "A contest where only one winner receives all the gold",
        "Adding two positive numbers on a math exam"
      ],
      "optionsAr": [
        "تبادل تجاري طوعي ومثمر يخرج منه كل الأطراف المشاركة بمكاسب ومنفعة أعلى مما كانوا يملكونه قبل الصفقة",
        "لعبة بطاقات يدفع فيها الخاسر ثمن عشاء الجميع",
        "مسابقة يحصل فيها فائز وحيد على كل الذهب ويحرم الباقون",
        "جمع رقمين موجبين في امتحان الرياضيات"
      ],
      "correctIndex": 0,
      "explanation": "Voluntary market exchange is positive-sum because both parties trade items they value less for items they value more.",
      "explanationAr": "التجارة الطوعية علاقة مكسب متبادل لأن كل طرف يتنازل عن شيء يملك منه فائضاً ليحصل على قيمة ومنفعة يحتاجها بشدة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_eisenhower_matrix",
    "title": "The Eisenhower Matrix: Urgent vs Important for CEOs",
    "titleAr": "مصفوفة أيزنهاور: كيف يميز القادة بين العاجل والمهم؟",
    "description": "A ringing phone screams for attention, but studying for your dream company builds your future! Master the 4 quadrants of time.",
    "descriptionAr": "رنين الهاتف يصرخ طالباً اهتمامك فوراً، لكن التخطيط لشركتك المستقبلية يبني ثروتك! تعلم مصفوفة إدارة الوقت الأسطورية.",
    "category": "Mindset",
    "duration": "0:37",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "The Eisenhower Matrix",
    "keyTermAr": "مصفوفة أيزنهاور لإدارة الوقت (Eisenhower Matrix)",
    "likesCount": 2190,
    "viewsCount": 10900,
    "tags": [
      "timemanagement",
      "productivity",
      "leadership"
    ],
    "animationConfig": {
      "themeColor": "from-blue-500 to-indigo-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "We all have the exact same 24 hours every day. So why do some people build rockets while others never start? ⏰🚀",
          "captionAr": "كلنا نملك نفس الـ 24 ساعة يومياً بالتساوي. لماذا يصنع البعض صواريخ للفضاء بينما يقف آخرون مكانهم؟ ⏰🚀",
          "mascotMood": "explaining",
          "visualEmoji": "⏰",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Most people spend all day putting out \"URGENT\" fires: answering notifications and random noise! 🔔🔥",
          "captionAr": "معظم الناس يقضون يومهم في إطفاء حرائق \"عاجلة\": الرد على تنبيهات عشوائية ومشتتات لا قيمة حقيقية لها! 🔔🔥",
          "mascotMood": "thinking",
          "visualEmoji": "🔔",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "President Eisenhower taught: What is urgent is rarely important, and what is important is rarely urgent! 🧭🏛️",
          "captionAr": "علمنا الرئيس أيزنهاور: \"الأمور العاجلة نادراً ما تكون مهمة، والأمور بالغة الأهمية نادراً ما تكون عاجلة!\" 🧭🏛️",
          "mascotMood": "celebrating",
          "visualEmoji": "🧭",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Block dedicated hours every morning for what is IMPORTANT: Reading, planning, coding, and creating! 🌟🏆",
          "captionAr": "خصص ساعات الصباح الأولى لما هو \"مهم واستراتيجي\": القراءة، التخطيط، البرمجة، والابتكار بلا انقطاع! 🌟🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "According to the Eisenhower Matrix, which quadrant should ambitious leaders focus on to build true long-term success?",
      "questionAr": "وفقاً لمصفوفة أيزنهاور، في أي مربع يجب أن يركز القادة الطموحون معظم طاقتهم لتحقيق أعظم نجاح؟",
      "options": [
        "Quadrant 2: Tasks that are NOT URGENT right now, but deeply IMPORTANT for long-term growth (learning, strategy, health)",
        "Quadrant 4: Mindlessly scrolling video feeds for 6 hours",
        "Answering every phone call on the first ring regardless of what you are doing",
        "Staring at the office ceiling"
      ],
      "optionsAr": [
        "المربع الثاني: المهام غير العاجلة لحظياً ولكنها بالغة الأهمية للنمو المستقبلي (كالتعلم والتخطيط وبناء العلاقات)",
        "المربع الرابع: التصفح العشوائي غير الهادف لمواقع التواصل لمدة 6 ساعات",
        "الرد الفوري على أي مكالمة هاتفية أياً كانت أهمية ما تفعله",
        "التحديق في سقف الغرفة دون عمل"
      ],
      "correctIndex": 0,
      "explanation": "Quadrant 2 activities (strategic planning, skill development, relationship building) drive highest lifetime compounding.",
      "explanationAr": "أنشطة المربع الثاني (التخطيط وتطوير المهارات وبناء الشراكات) تصنع أضخم أثر تراكمي في بناء الثروة والنجاح المستدام.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_quality_control",
    "title": "Quality Control: Why Apple Rejects Imperfect Glass",
    "titleAr": "مراقبة الجودة (Quality Control): سر تفوق المنتجات العالمية",
    "description": "A tiny microscopic scratch on a smartphone screen causes Apple to discard it. Discover why uncompromising standards build empires.",
    "descriptionAr": "خدش مجهري واحد في شاشة الهاتف يدفع كبرى الشركات لاستبعادها فوراً! اكتشف كيف تصنع معايير الجودة الصارمة المجد والريادة.",
    "category": "OllieExplains",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_business_moat.jpg",
    "fullPosterUrl": "/images/videos/clip_business_moat.jpg",
    "keyTerm": "Quality Assurance & Standards",
    "keyTermAr": "توكيد ومراقبة الجودة (Quality Control)",
    "likesCount": 2270,
    "viewsCount": 11400,
    "tags": [
      "quality",
      "manufacturing",
      "standards"
    ],
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "A bakery bakes 100 chocolate cupcakes. Five of them came out slightly burnt around the edges... 🧁🔥",
          "captionAr": "مخبز صنع 100 كعكة شوكولاتة لذيذة، ولكن 5 منها احترقت حوافها قليلاً أثناء الخبز... 🧁🔥",
          "mascotMood": "explaining",
          "visualEmoji": "🧁",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "A lazy manager says: \"Nobody will notice, put them in the box!\" What happens when a customer bites it? 😬🤢",
          "captionAr": "قال عامل متكاسل: \"لن ينتبه أحد، ضعها في الصندوق!\" ماذا يحدث عندما يتذوقها الزبون المحترم؟ 😬🤢",
          "mascotMood": "thinking",
          "visualEmoji": "😬",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "The customer feels cheated and leaves a scathing review! A world-class CEO demands QUALITY CONTROL! 🔍🛡️",
          "captionAr": "يشعر العميل بالاستياء ويترك تقييماً سلبياً يحذر الجميع! القائد المحترف يفرض نظاماً صارماً لمراقبة الجودة! 🔍🛡️",
          "mascotMood": "celebrating",
          "visualEmoji": "🔍",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "Only ship perfection. When customers know your quality NEVER slips, they remain loyal for life! 🚀👑",
          "captionAr": "لا تقدم لزبائنك إلا أعلى معايير الإتقان! وعندما يتيقن المشترون من ثبات جودتك، يدينون لك بالولاء التام! 🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the primary role of Quality Control (QC) in business operations?",
      "questionAr": "ما هو الدور الأساسي لإدارة مراقبة الجودة (Quality Control) في المشاريع الناجحة؟",
      "options": [
        "To inspect and ensure that products meet rigorous consistency and excellence standards before reaching customers",
        "To make sure all employees wear purple socks",
        "To clean the office windows twice every hour",
        "To throw away all products regardless of condition"
      ],
      "optionsAr": [
        "فحص المنتجات والتأكد من مطابقتها لأعلى معايير الإتقان والسلامة والموثوقية قبل تسليمها للعميل النهائي",
        "التأكد من ارتداء جميع الموظفين جوارب بلون موحد",
        "تنظيف نوافذ المكاتب مرتين كل ساعة",
        "التخلص من كل المنتجات في سلة المهملات دون فحص"
      ],
      "correctIndex": 0,
      "explanation": "Quality control maintains brand integrity, reduces warranty returns, and preserves high customer trust.",
      "explanationAr": "تحمي مراقبة الجودة مكانة العلامة التجارية وتحد من شكاوى ومرتجعات العملاء وتبني الثقة الراسخة في السوق.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_b2b_vs_b2c",
    "title": "B2B vs B2C: Selling to Kids vs Selling to Entire School Districts",
    "titleAr": "البيع للأفراد (B2C) مقابل الشركات (B2B): ما الفرق بينهما؟",
    "description": "Selling 1 pencil to a classmate for $1 is B2C. Selling 50,000 pencils to the city education department is B2B! Master the game.",
    "descriptionAr": "بيع قلم واحد لزميلك بدولار هو تجارة أفراد (B2C). أما بيع 50 ألف قلم لوزارة التعليم فهو تجارة شركات (B2B)! اكتشف الفارق.",
    "category": "Strategy",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_lemonade_stand.jpg",
    "fullPosterUrl": "/images/videos/clip_lemonade_stand.jpg",
    "keyTerm": "B2B vs B2C Business Models",
    "keyTermAr": "التجارة للأفراد والشركات (B2B vs B2C)",
    "likesCount": 2190,
    "viewsCount": 10800,
    "tags": [
      "b2b",
      "b2c",
      "businessmodels"
    ],
    "animationConfig": {
      "themeColor": "from-blue-600 to-indigo-800",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "When you set up a lemonade stand on a sidewalk, ordinary thirsty neighbors buy one cup for $2. That is B2C! 🍋👥",
          "captionAr": "عندما تقيم كشك عصير على الرصيف، يمر الجيران ويشتري كل منهم كوباً بدولارين. هذه تجارة أفراد ومستهلكين (B2C)! 🍋👥",
          "mascotMood": "explaining",
          "visualEmoji": "🍋",
          "visualType": "lemonade",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "B2C means Business-to-Consumer: Lots of individual buyers, smaller sales, emotion and branding driven! 🛍️✨",
          "captionAr": "B2C تعني من المشروع إلى المستهلك الفردي: أعداد كبيرة من المشترين، صفقات صغيرة، وقرارات عاطفية وسريعة! 🛍️✨",
          "mascotMood": "thinking",
          "visualEmoji": "🛍️",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Now imagine selling 500 gallons of lemonade to a giant summer festival or hospital cafeteria! That is B2B! 🎪📑",
          "captionAr": "الآن تخيل أنك تبيع 500 لتر من العصير لمهرجان صيفي ضخم أو مطعم شركة كبرى! هذه تجارة الأعمال للشركات (B2B)! 🎪📑",
          "mascotMood": "celebrating",
          "visualEmoji": "📑",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "B2B means Business-to-Business: Fewer clients, massive contract sizes, and logical ROI decisions! Both are huge! 🚀🏆",
          "captionAr": "B2B تعني من شركة إلى شركة: عقود سنوية ضخمة، قرارات تعتمد على الجدوى والأرقام! كلاهما يصنع ثروات طائلة! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is a hallmark feature of a B2B (Business-to-Business) enterprise?",
      "questionAr": "ما هي السمة البارزة لمشاريع وتجارة الـ B2B (من الشركات إلى الشركات)؟",
      "options": [
        "Transactions usually involve larger contract values, longer sales cycles, and multiple organizational stakeholders",
        "All products must be sold exclusively on street sidewalks",
        "Sales are made only using candy wrappers as payment",
        "The buyers are always pets and animals"
      ],
      "optionsAr": [
        "الصفقات عادة ما تكون ذات مبالغ مالية ضخمة، وتتطلب دورات تفاوض أطول ودراسة جدوى دقيقة بين الإدارات",
        "وجوب بيع المنتجات على أرصفة الشوارع حصراً",
        "إتمام المبيعات باستخدام أوراق الحلوى كعملة",
        "أن يكون المشترون حيوانات أليفة فقط"
      ],
      "correctIndex": 0,
      "explanation": "B2B involves enterprise agreements with higher average contract values and rational procurement processes.",
      "explanationAr": "ترتكز تجارة الـ B2B على إبرام عقود كبرى مع المؤسسات والشركات وفق معايير الجدوى والعائد الاستثماري الواضح.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_lateral_thinking",
    "title": "Lateral Thinking: The Marshmallow & Spaghetti Challenge",
    "titleAr": "التفكير الجانبي (Lateral Thinking): تحدي المارشملو والسباغيتي",
    "description": "Kindergarteners consistently beat business school graduates in building the tallest spaghetti tower! Discover creative problem solving.",
    "descriptionAr": "أطفال الروضة يتفوقون دائماً على خريجي كليات إدارة الأعمال في بناء برج السباغيتي! اكتشف قوة التجربة والتفكير المبتكر.",
    "category": "Mindset",
    "duration": "0:38",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Lateral Thinking & Prototyping",
    "keyTermAr": "التفكير الجانبي والتجربة السريعة (Lateral Thinking)",
    "likesCount": 2480,
    "viewsCount": 12500,
    "tags": [
      "creativity",
      "innovation",
      "mindset"
    ],
    "animationConfig": {
      "themeColor": "from-amber-500 to-rose-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-rose-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 7,
          "caption": "Teams are given 20 sticks of dry spaghetti, tape, and 1 marshmallow to build the tallest tower! 🍝🗼",
          "captionAr": "أُعطيت فرق المنافسة 20 عود سباغيتي جاف، وشريط لاصق، وقطعة مارشملو واحدة لبناء أعلى برج ثابت! 🍝🗼",
          "mascotMood": "explaining",
          "visualEmoji": "🗼",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 7,
          "caption": "Business school graduates plan and debate for 18 minutes, put the marshmallow on top at second 59... and CRASH! 💥😱",
          "captionAr": "ظل خريجو الجامعات يخططون ويتجادلون 18 دقيقة، ووضعوا المارشملو في الثانية الأخيرة... فانهار البرج في الحال! 💥😱",
          "mascotMood": "thinking",
          "visualEmoji": "💥",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Kindergarten kids do the opposite! They start building and testing the marshmallow on top IMMEDIATELY, fixing as they go! 👶🏗️",
          "captionAr": "أما أطفال الروضة ففعلوا العكس تماماً! بدأوا بالبناء ووضع المارشملو فوراً وتعديل الأعواد خطوة بخطوة أثناء التجربة! 👶🏗️",
          "mascotMood": "celebrating",
          "visualEmoji": "🏗️",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "The kids WIN! Don’t just theorize—build prototypes, test real feedback quickly, and iterate to greatness! 🚀🏆",
          "captionAr": "فاز الأطفال بجدارة! لا تكتفِ بالتنظير والجدال النظري؛ بل ابدأ بصنع نماذج أولية سريعة وطورها باستمرار لتنتصر! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "Why do young children frequently outperform adult MBA students in the Marshmallow Tower Challenge?",
      "questionAr": "لماذا يتفوق الأطفال الصغار غالباً على خريجي الجامعات الكبار في تحدي برج المارشملو؟",
      "options": [
        "Because they immediately build rapid prototypes and iterate constantly, rather than spending all time theorizing",
        "Because spaghetti tastes better to children",
        "Because adults are prohibited from using sticky tape",
        "Because marshmallows are naturally lighter for kids"
      ],
      "optionsAr": [
        "لأنهم يبدأون فوراً بصنع نماذج أولية واختبارها وتعديلها بالتدريج، بدلاً من إضاعة كل الوقت في التخطيط والجدال النظري",
        "لأن المعكرونة ألذ في طعمها بالنسبة للأطفال",
        "لأن الكبار ممنوعون من استخدام الشريط اللاصق",
        "لأن حلوى المارشملو أخف وزناً في أيدي الصغار"
      ],
      "correctIndex": 0,
      "explanation": "Rapid iteration and prototyping beat rigid theoretical planning when dealing with complex, uncertain physical conditions.",
      "explanationAr": "التجربة السريعة وصنع النماذج الأولية تتفوق على التخطيط النظري الجامد في التعامل مع التحديات والبيئات المتغيرة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_challenge_zerowaste_piggy",
    "title": "The 7-Day Zero-Waste Piggy Quest: Master Daily Savings",
    "titleAr": "تحدي الحصالة الذكية لمدة 7 أيام: أوقف هدر المصروف",
    "description": "Take on the 7-day savings sprint! Audit your pocket money, identify one unnecessary daily impulse spend, and save $10 this week!",
    "descriptionAr": "انضم إلى تحدي التوفير الذكي لمدة 7 أيام! راجع مصروفك اليومي، وتخلّ عن شراء رغبة واحدة غير ضرورية، ووفر 10 دولارات هذا الأسبوع!",
    "category": "Challenge",
    "duration": "0:42",
    "aspectRatio": "9:16",
    "speaker": "Reema",
    "speakerAvatar": "/images/characters_clean/reema_idle.png",
    "thumbnailUrl": "/images/videos/clip_piggy_bank.jpg",
    "fullPosterUrl": "/images/videos/clip_piggy_bank.jpg",
    "keyTerm": "7-Day Savings Challenge",
    "keyTermAr": "تحدي الادخار السريع لمدة 7 أيام",
    "likesCount": 3200,
    "viewsCount": 16100,
    "tags": [
      "challenge",
      "saving",
      "habits"
    ],
    "challenge": {
      "id": "ch_zerowaste_piggy",
      "title": "7-Day Zero Impulse Spending Sprint",
      "titleAr": "تحدي الأيام السبعة لوقف الإنفاق الاندفاعي",
      "description": "Track every coin spent for 7 consecutive days, say NO to at least 2 impulsive snack purchases, and deposit the saved cash directly into your savings account or piggy bank!",
      "descriptionAr": "سجل كل قرش تنفقه لمدة 7 أيام متتالية، وقل \"لا\" لمرتين على الأقل عند الرغبة في شراء حلويات غير ضرورية، وضع المال الموفر في حصالتك فوراً!",
      "instructions": [
        "Grab a small pocket notebook or notes app and write Day 1 to Day 7",
        "Record every single purchase (even a 50¢ piece of gum)",
        "Identify 2 moments this week where you felt an urge to buy an impulse item, and choose to save the cash instead",
        "Deposit the saved cash (target $5 to $15) into your piggy bank or savings jar",
        "Submit a photo of your 7-day log and savings jar to claim your Thrift Master badge!"
      ],
      "instructionsAr": [
        "أحضر دفتراً صغيراً أو افتح تطبيق الملاحظات وسجل الأيام من 1 إلى 7",
        "اكتب كل مبلغ تنفقه بدقة يومياً مهما كان صغيراً",
        "حدد لحظتين هذا الأسبوع شعرت فيهما برغبة في شراء كماليات، وقرر بوعي توفير المبلغ",
        "أودع المبلغ الموفر (الهدف من 5 إلى 15 دولاراً) في حصالتك الاستثمارية",
        "التقط صورة لجدولك وحصالتك وارفعها لتنال وسام سيد الادخار الذكي!"
      ],
      "rewardXp": 120,
      "rewardTokens": 60,
      "proofType": "photo"
    },
    "animationConfig": {
      "themeColor": "from-emerald-500 to-teal-700",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-teal-950 to-emerald-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 8,
          "caption": "Ready for a real-world mission? Welcome to the 7-Day Zero-Waste Piggy Challenge! 🎯🐷",
          "captionAr": "هل أنت مستعد لمهمة ريادية حقيقية على أرض الواقع؟ مرحباً بك في تحدي الحصالة الذكية لمدة 7 أيام! 🎯🐷",
          "mascotMood": "excited",
          "visualEmoji": "🐷",
          "visualType": "piggybank",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Small impulsive snacks drain your pockets like tiny leaks in a giant water dam! 💧🍪",
          "captionAr": "المشتريات الصغيرة الاندفاعية تستنزف مصروفك اليومي تماماً مثل التسريبات الصغيرة في سد مائي عملاق! 💧🍪",
          "mascotMood": "thinking",
          "visualEmoji": "🍪",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Say NO to just two impulsive purchases this week and feed that cash straight to your piggy bank! 🪙🐖",
          "captionAr": "قل \"لا\" بوعي وقوة لرغبتين غير ضروريتين هذا الأسبوع، وأطعم تلك النقود مباشرة لحصالتك الذهبية! 🪙🐖",
          "mascotMood": "celebrating",
          "visualEmoji": "🪙",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 9,
          "caption": "In 7 days you will save over $10! You’ve built iron financial discipline: the foundation of all future wealth! 🏆🌟",
          "captionAr": "خلال 7 أيام ستوفر أكثر من 10 دولارات وتكتسب انضباطاً مالياً حديدياً هو حجر الأساس لكل ثروة مستقبلية! 🏆🌟",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the most effective psychological tactic to avoid impulsive purchases during this challenge?",
      "questionAr": "ما هو الأسلوب النفسي الأكثر فاعلية لتجنب الشراء الاندفاعي غير المحسوب أثناء هذا التحدي؟",
      "options": [
        "Applying the 24-hour waiting rule: Pause and wait one full day before buying any non-essential item",
        "Closing your eyes and running through store aisles as fast as possible",
        "Giving all your money to a neighbor you don’t know",
        "Buying two of every item so you never run out"
      ],
      "optionsAr": [
        "تطبيق قاعدة الانتظار لمدة 24 ساعة: التمهل والتفكير ليوم كامل قبل شراء أي سلعة غير أساسية",
        "إغلاق عينيك والركض بأقصى سرعة داخل ممرات المتجر",
        "إعطاء كل أموالك لشخص غريب في الشارع",
        "شراء قطعتين من كل سلعة حتى لا تنفد"
      ],
      "correctIndex": 0,
      "explanation": "The 24-hour delay rule breaks emotional impulse loops, giving your rational brain time to evaluate true value.",
      "explanationAr": "تكسر مهلة الـ 24 ساعة فخ الإثارة العاطفية اللحظية، وتمنح عقلك فرصة لتقييم الاحتياج الحقيقي للسلعة بحكمة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_challenge_book_flip",
    "title": "The $10 Book Flipping Quest: Buy Low, Sell High",
    "titleAr": "تحدي تدوير الكتب والقصص: اشترِ بسعر بسيط وبِع بأرباح",
    "description": "Find 3 gently used books in your room, clean them up, take bright photos, and resell them to buy your next business supplies!",
    "descriptionAr": "ابحث عن 3 كتب أو قصص قديمة بحالة جيدة في غرفتك، نظفها والتقط لها صوراً ممتازة، وأعد بيعها لتحقيق أول أرباح تجارية!",
    "category": "Challenge",
    "duration": "0:41",
    "aspectRatio": "9:16",
    "speaker": "Filo",
    "speakerAvatar": "/images/characters_clean/filo_idle.png",
    "thumbnailUrl": "/images/videos/clip_goat_barter.jpg",
    "fullPosterUrl": "/images/videos/clip_goat_barter.jpg",
    "keyTerm": "Reselling & Flipping Quest",
    "keyTermAr": "تحدي إعادة البيع وتدوير الأصول (Flipping)",
    "likesCount": 2980,
    "viewsCount": 15300,
    "tags": [
      "challenge",
      "flipping",
      "sales"
    ],
    "challenge": {
      "id": "ch_book_flip",
      "title": "Resell 2 Pre-Loved Books or Toys",
      "titleAr": "تحدي إعادة بيع كتابين أو لعبتين قديمتين",
      "description": "Select 2 books or games you no longer use, clean them thoroughly, write an attractive description with parents, sell them to friends or neighbors, and record your net profit!",
      "descriptionAr": "اختر كتابين أو لعبتين لم تعد تستخدمهما، ونظفهما جيداً، واكتب وصفاً جذاباً بمساعدة والديك، وبعهما لأصدقاء أو جيران، وسجل ربحك الصافي!",
      "instructions": [
        "Find 2 pre-loved books, comics, or board games in good shape",
        "Wipe the covers clean and ensure all pages or pieces are complete",
        "Determine an attractive fair price ($2 to $5 each)",
        "Offer them to family members, friends, or neighbors who would love to read them",
        "Upload a photo of your sold items with your cash earnings to unlock your Resale Merchant medal!"
      ],
      "instructionsAr": [
        "ابحث عن كتابين أو قصص أو ألعاب لوحية بحالة جيدة لم تعد تقرأها",
        "نظف الأغلفة جيداً وتأكد من اكتمال كل الصفحات والقطع",
        "حدد سعراً عادلاً وجذاباً للشراء (من 2 إلى 5 دولارات للقطعة)",
        "اعرضها بلباقة على الأصدقاء أو الأقارب أو الجيران المهتمين بقراءتها",
        "التقط صورة للكتب المباعة مع الأرباح المحققة وارفعها لتنال وسام تاجر التدوير المعتمد!"
      ],
      "rewardXp": 130,
      "rewardTokens": 65,
      "proofType": "photo"
    },
    "animationConfig": {
      "themeColor": "from-amber-500 to-orange-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-orange-950 to-amber-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 8,
          "caption": "Great fortunes start with the oldest merchant secret in human history: BUY LOW, SELL HIGH! 📚🪙",
          "captionAr": "أعظم الثروات في تاريخ البشرية انطلقت من أقدم أسرار التجارة: اشترِ بسعر بسيط، وبِع بسعر أعلى! 📚🪙",
          "mascotMood": "explaining",
          "visualEmoji": "📚",
          "visualType": "store",
          "soundEffect": "click"
        },
        {
          "sceneId": 2,
          "durationSeconds": 8,
          "caption": "Your bedroom is filled with books and games you’ve already completed that others would love to read! 🧸📖",
          "captionAr": "غرفتك مليئة بكتب وقصص أنهيت قراءتها بالفعل، وتوجد في الحي أطفال يتمنون قراءتها والاستمتاع بها! 🧸📖",
          "mascotMood": "thinking",
          "visualEmoji": "📖",
          "visualType": "coins"
        },
        {
          "sceneId": 3,
          "durationSeconds": 8,
          "caption": "Clean them up, write a compelling summary, and price them fairly to make a quick clean sale! ✨🤝",
          "captionAr": "نظف الأغلفة، واكتب ملخصاً مشوقاً للأحداث، وحدد سعراً مغرياً لتحقق صفقة بيع سريعة ومبهجة! ✨🤝",
          "mascotMood": "celebrating",
          "visualEmoji": "✨",
          "visualType": "chart",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 8,
          "caption": "You recycled pre-loved knowledge, made a friend happy, and earned $10 pure startup capital! 🚀🏆",
          "captionAr": "لقد أعدت تدوير المعرفة المفيدة، وأسعدت قارئاً جديداً، وربحت 10 دولارات كأول رأس مال حر لمشروعك! 🚀🏆",
          "mascotMood": "happy",
          "visualEmoji": "🏆",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the primary entrepreneurial lesson behind reselling pre-owned items?",
      "questionAr": "ما هو الدرس الريادي الأهم المستفاد من تجربة إعادة بيع المقتنيات المستعملة؟",
      "options": [
        "Value is subjective: what is sitting idle to you can be highly desirable and valuable to someone else",
        "Books should never be read more than once",
        "Old toys automatically lose their color when sold",
        "You should charge your best friend $100 for a broken pencil"
      ],
      "optionsAr": [
        "أن القيمة نسبية: فالأشياء التي انتهت حاجتك إليها قد تمثل كنزاً مفيداً ومرغوباً بشدة لشخص آخر",
        "أنه لا يجوز قراءة الكتاب أكثر من مرة واحدة في الحياة",
        "أن الألعاب القديمة تفقد ألوانها تلقائياً عند بيعها",
        "أنه يجب عليك بيع قلم مكسور لصديقك بمائة دولار"
      ],
      "correctIndex": 0,
      "explanation": "Arbitrage and reselling illustrate how moving goods to where demand is highest unlocks trapped economic utility.",
      "explanationAr": "توضح تجربة إعادة البيع كيف يؤدي نقل البضائع للأشخاص الأكثر رغبة فيها إلى تحرير قيمتها الاقتصادية الكامنة.",
      "xpReward": 25,
      "tokenReward": 20
    }
  },
  {
    "id": "vid_challenge_pitch_contest",
    "title": "The Kid CEO Pitch Grand Finale: Pitch Your Dream Startup",
    "titleAr": "تحدي العرض الختامي للرؤساء التنفيذيين الصغار: اعرض مشروع أحلامك",
    "description": "You’ve watched 99 videos of elite financial wisdom. Now take the center stage! Record your 60-second CEO pitch and win the Crown!",
    "descriptionAr": "شاهدت وتعلمت 99 درساً من خلاصة الحكمة المالية وريادة الأعمال. حان وقت الصعود للمنصة! سجّل عرضك في 60 ثانية واظفر بالتاج!",
    "category": "Challenge",
    "duration": "0:45",
    "aspectRatio": "9:16",
    "speaker": "Ollie",
    "speakerAvatar": "/images/characters_clean/ollie_idle.png",
    "thumbnailUrl": "/images/videos/clip_ceo_mindset.jpg",
    "fullPosterUrl": "/images/videos/clip_ceo_mindset.jpg",
    "keyTerm": "Grand Finale CEO Pitch",
    "keyTermAr": "تحدي التخرج والعرض الاستثماري للرؤساء التنفيذيين",
    "likesCount": 5120,
    "viewsCount": 24800,
    "tags": [
      "challenge",
      "pitch",
      "ceo",
      "finale"
    ],
    "challenge": {
      "id": "ch_grand_ceo_pitch",
      "title": "Record Your 60-Second CEO Dream Pitch",
      "titleAr": "سجّل عرض مشروع أحلامك في 60 ثانية فقط",
      "description": "Prepare a 1-minute video or audio recording introducing yourself as CEO, explaining your startup’s name, the problem you solve, your product, and how you will make profits!",
      "descriptionAr": "جهّز تسجيلاً مرئياً أو صوتياً مدته دقيقة واحدة تقدم فيه نفسك كقائد، وتشرح اسم شركتك، والمشكلة التي تحلها، وكيف ستحقق أرباحك وتفيد العالم!",
      "instructions": [
        "State your name, age, and company name with full CEO confidence",
        "Clearly state the REAL PROBLEM your startup is solving in your community",
        "Explain your PRODUCT or SERVICE and why customers will love it over competitors",
        "State your pricing model and expected profit margin",
        "Submit your pitch recording or text script to earn the ultimate \"Certified Future CEO\" Golden Crown badge!"
      ],
      "instructionsAr": [
        "اذكر اسمك وسنك واسم شركتك الناشئة بكل ثقة واعتزاز قيادي",
        "وضح المشكلة الحقيقية المزعجة التي يسعى مشروعك لحلها في مجتمعك",
        "اشرح منتجك أو خدمتك وسبب تميزها وتفضيل الزبائن لها على المنافسين",
        "بين خطتك للتسعير وهامش الربح المتوقع لكل عملية بيع",
        "ارفع تسجيل العرض أو النص المكتوب لتنال وسام التاج الذهبي: \"الرئيس التنفيذي المعتمد لمستقبل الأعمال\"!"
      ],
      "rewardXp": 250,
      "rewardTokens": 150,
      "badgeReward": "badge_future_ceo_grand_master",
      "proofType": "text"
    },
    "animationConfig": {
      "themeColor": "from-amber-400 via-yellow-500 to-amber-600",
      "bgGradient": "bg-gradient-to-b from-slate-950 via-amber-950 to-indigo-950",
      "scenes": [
        {
          "sceneId": 1,
          "durationSeconds": 9,
          "caption": "Congratulations Future CEO! You have mastered 100 lessons in wealth, strategy, economics, and leadership! 🎓🏆",
          "captionAr": "مبارك يا بطل وقائد المستقبل! لقد أتممت ببراعة 100 درس استثنائي في الثروة والاستراتيجية والاقتصاد والقيادة! 🎓🏆",
          "mascotMood": "celebrating",
          "visualEmoji": "🎓",
          "visualType": "trophy",
          "soundEffect": "success"
        },
        {
          "sceneId": 2,
          "durationSeconds": 9,
          "caption": "Knowledge in your head is great, but taking BOLD ACTION in the real world is what builds true empires! 🌍⚡",
          "captionAr": "المعرفة في العقل كنز، ولكن المبادرة الشجاعة والتنفيذ على أرض الواقع هو ما يبني الإمبراطوريات الحقيقية! 🌍⚡",
          "mascotMood": "excited",
          "visualEmoji": "⚡",
          "visualType": "chart"
        },
        {
          "sceneId": 3,
          "durationSeconds": 9,
          "caption": "This is your Grand Finale Challenge: Stand tall, smile, and pitch your startup idea in 60 seconds flat! 🎤👑",
          "captionAr": "هذا هو تحديك الأكبر والتخرج الرسمي: قف بشموخ، وابتسم، واعرض فكرة مشروعك المستقبلي في 60 ثانية! 🎤👑",
          "mascotMood": "explaining",
          "visualEmoji": "🎤",
          "visualType": "coins",
          "soundEffect": "coin"
        },
        {
          "sceneId": 4,
          "durationSeconds": 9,
          "caption": "Profits Patrol believes in you. The world is waiting for your brilliant ideas. Go change the world! 🌟🚀👑",
          "captionAr": "فريق باترول فخور بك ويؤمن بقدراتك. العالم ينتظر ابتكاراتك الرائعة. انطلق واصنع الفارق في العالم! 🌟🚀👑",
          "mascotMood": "happy",
          "visualEmoji": "👑",
          "visualType": "trophy",
          "soundEffect": "success"
        }
      ]
    },
    "quiz": {
      "question": "What is the most important trait of a truly great leader and entrepreneur?",
      "questionAr": "ما هي أعظم صفة قيادية تميز رائد الأعمال الاستثنائي الحقيقي؟",
      "options": [
        "Persistent curiosity, high ethical integrity, resilience in the face of setbacks, and creating genuine value for others",
        "Bragging loudly about being the boss",
        "Never listening to customer suggestions",
        "Keeping all good ideas secret forever"
      ],
      "optionsAr": [
        "الشغف الدائم بالتعلم، والنزاهة والأمانة، والإصرار عند مواجهة العقبات، وخلق قيمة ونفع حقيقي للناس",
        "التفاخر بصوت عالٍ بأنك المدير والمسؤول",
        "تجاهل مقترحات وآراء العملاء بالكامل",
        "إخفاء الأفكار الإيجابية في سرية إلى الأبد دون تنفيذ"
      ],
      "correctIndex": 0,
      "explanation": "True leadership pairs ethical resilience with a relentless commitment to solving human problems and empowering others.",
      "explanationAr": "تجمع القيادة الريادية الأصيلة بين الصدق والنزاهة والإصرار على خدمة الناس وحل مشكلاتهم وصنع مستقبل أفضل للجميع.",
      "xpReward": 50,
      "tokenReward": 50
    }
  },
];
