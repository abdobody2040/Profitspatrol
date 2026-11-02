import { DistrictV2Config } from '../../../types';

export const DISTRICT_V2_DEFINITIONS: DistrictV2Config[] = [
    {
        id: 'dist_startup_street',
        name: 'Startup Street',
        arabicName: 'شارع الشركات الناشئة',
        themeColor: 'yellow',
        bgGradient: 'from-amber-400/20 via-yellow-300/15 to-orange-400/20 dark:from-amber-950/35 dark:via-yellow-950/20 dark:to-orange-950/35',
        landmarkEmoji: '🏫',
        levelReq: 1,
        moduleTags: ['Money Basics', 'Financial Smarts'],
        audioTheme: 'optimistic',
        collectible: {
            id: 'col_founders_notebook',
            name: "Founder's Notebook",
            arabicName: 'دفتر الملاحظات للمؤسس',
            emoji: '📓',
            description: 'Your very first notebook detailing business plans and initial brainstorming notes.',
            descriptionAr: 'دفتر الملاحظات الأول لك الذي يفصل خطط العمل والملاحظات الأولية للعصف الذهني.'
        },
        reward: {
            ppTokens: 500,
            xp: 200,
            title: 'Budget Master',
            titleAr: 'خبير الميزانية',
            hqItem: 'light_lamp',
            skillCard: 'skl_fast_learner'
        },
        bossScenarioId: 'pizza_panic',
        bossName: 'Pizza Panic 🍕',
        bossNameAr: 'ذعر البيتزا 🍕'
    },
    {
        id: 'dist_lemonade_district',
        name: 'Lemonade District',
        arabicName: 'حي الليموناضة',
        themeColor: 'orange',
        bgGradient: 'from-orange-400/20 via-amber-300/15 to-red-400/20 dark:from-orange-950/35 dark:via-amber-950/20 dark:to-red-950/35',
        landmarkEmoji: '🍋',
        levelReq: 2,
        moduleTags: ['Entrepreneurship'],
        audioTheme: 'playful',
        collectible: {
            id: 'col_golden_lemon',
            name: 'Golden Lemon',
            arabicName: 'الليمونة الذهبية',
            emoji: '🍋',
            description: 'A shiny gold-plated lemon commemorating your first real business venture.',
            descriptionAr: 'ليمونة مطلية بالذهب اللامع تخليداً لأول مشروع تجاري حقيقي لك.'
        },
        reward: {
            ppTokens: 750,
            xp: 300,
            title: 'Lemon Tycoon',
            titleAr: 'تاجر الليمون',
            hqItem: 'decor_neon',
            skillCard: 'skl_fast_hands'
        },
        bossScenarioId: 'burger_burnout',
        bossName: 'Burger Burnout 🍔',
        bossNameAr: 'إرهاق البرجر 🍔'
    },
    {
        id: 'dist_food_truck_avenue',
        name: 'Food Truck Avenue',
        arabicName: 'شارع عربات الطعام',
        themeColor: 'rose',
        bgGradient: 'from-red-400/20 via-pink-300/15 to-purple-400/20 dark:from-red-950/35 dark:via-pink-950/20 dark:to-purple-950/35',
        landmarkEmoji: '🚚',
        levelReq: 3,
        moduleTags: ['Marketing', 'Brand Building'],
        audioTheme: 'energetic',
        collectible: {
            id: 'col_golden_food_truck_key',
            name: 'Golden Food Truck Key',
            arabicName: 'مفتاح عربة الطعام الذهبي',
            emoji: '🔑',
            description: 'The key to the very first food truck that put your brand on the local map.',
            descriptionAr: 'مفتاح عربة الطعام الأولى التي وضعت علامتك التجارية على الخارطة المحلية.'
        },
        reward: {
            ppTokens: 1000,
            xp: 400,
            title: 'Marketing Guru',
            titleAr: 'معلم التسويق',
            hqItem: 'food_pizza',
            skillCard: 'skl_silver_tongue'
        },
        bossScenarioId: 'marketing_meltdown',
        bossName: 'Marketing Meltdown 📣',
        bossNameAr: 'انهيار التسويق 📣'
    },
    {
        id: 'dist_retail_town',
        name: 'Retail Town',
        arabicName: 'بلدة التجزئة',
        themeColor: 'cyan',
        bgGradient: 'from-cyan-400/20 via-sky-300/15 to-blue-400/20 dark:from-cyan-950/35 dark:via-sky-950/20 dark:to-sky-950/35',
        landmarkEmoji: '🏪',
        levelReq: 5,
        moduleTags: ['Economics'],
        audioTheme: 'commercial',
        collectible: {
            id: 'col_merchant_badge',
            name: 'Merchant Badge',
            arabicName: 'شعار التاجر',
            emoji: '📛',
            description: 'An official seal proving your understanding of supply, demand, and pricing mechanics.',
            descriptionAr: 'ختم رسمي يثبت فهمك لآليات العرض والطلب والتسعير.'
        },
        reward: {
            ppTokens: 1200,
            xp: 500,
            title: 'Retail King',
            titleAr: 'ملك التجزئة',
            hqItem: 'food_coffee',
            skillCard: 'skl_negotiator'
        },
        bossScenarioId: 'fashion_fiasco',
        bossName: 'Fashion Fiasco 👗',
        bossNameAr: 'فشل الموضة 👗'
    },
    {
        id: 'dist_startup_valley',
        name: 'Startup Valley',
        arabicName: 'وادي الشركات الناشئة',
        themeColor: 'indigo',
        bgGradient: 'from-blue-400/20 via-indigo-300/15 to-violet-400/20 dark:from-blue-950/35 dark:via-indigo-950/20 dark:to-violet-950/35',
        landmarkEmoji: '🚀',
        levelReq: 7,
        moduleTags: ['Technology', 'AI & Future Jobs'],
        audioTheme: 'futuristic',
        collectible: {
            id: 'col_rocket_core',
            name: 'Rocket Core',
            arabicName: 'نواة الصاروخ',
            emoji: '⚛️',
            description: 'A high-tech glowing energy cell symbolizing your leap into artificial intelligence and tech startups.',
            descriptionAr: 'خلية طاقة متوهجة عالية التقنية ترمز إلى قفزتك في الذكاء الاصطناعي والشركات التقنية الناشئة.'
        },
        reward: {
            ppTokens: 1500,
            xp: 600,
            title: 'Silicon Pioneer',
            titleAr: 'رائد السيليكون',
            hqItem: 'laptop',
            skillCard: 'skl_multitasker'
        },
        bossScenarioId: 'tech_trouble',
        bossName: 'Tech Trouble 💻',
        bossNameAr: 'مشاكل التقنية 💻'
    },
    {
        id: 'dist_corporate_city',
        name: 'Corporate City',
        arabicName: 'مدينة الشركات',
        themeColor: 'purple',
        bgGradient: 'from-purple-400/20 via-fuchsia-300/15 to-pink-400/20 dark:from-purple-950/35 dark:via-fuchsia-950/20 dark:to-pink-950/35',
        landmarkEmoji: '🏢',
        levelReq: 9,
        moduleTags: ['Leadership', 'Corporate Strategy'],
        audioTheme: 'executive',
        collectible: {
            id: 'col_executive_seal',
            name: 'Executive Seal',
            arabicName: 'الختم التنفيذي',
            emoji: '💼',
            description: 'A heavy wax seal representational of your authority over scaling organizations and managers.',
            descriptionAr: 'ختم شمعي ثقيل يمثل سلطتك في توسيع نطاق المؤسسات والمديرين.'
        },
        reward: {
            ppTokens: 2000,
            xp: 700,
            title: 'Managing Director',
            titleAr: 'المدير التنفيذي',
            hqItem: 'chair_office',
            skillCard: 'skl_famous'
        },
        bossScenarioId: 'leadership_mutiny',
        bossName: 'Leadership Mutiny! 🚩',
        bossNameAr: 'تمرد القيادة! 🚩'
    },
    {
        id: 'dist_investment_harbor',
        name: 'Investment Harbor',
        arabicName: 'مرفأ الاستثمار',
        themeColor: 'emerald',
        bgGradient: 'from-emerald-400/20 via-teal-300/15 to-cyan-400/20 dark:from-emerald-950/35 dark:via-teal-950/20 dark:to-cyan-950/35',
        landmarkEmoji: '⚓',
        levelReq: 11,
        moduleTags: ['Investing & Wealth', 'Future of Money'],
        audioTheme: 'wealthy',
        collectible: {
            id: 'col_golden_vault_key',
            name: 'Golden Vault Key',
            arabicName: 'مفتاح الخزنة الذهبي',
            emoji: '🔑',
            description: 'A solid gold key unlocking passive investment options and compound interest streams.',
            descriptionAr: 'مفتاح من الذهب الخالص يفتح خيارات الاستثمار غير الفعال وتدفقات الفائدة المركبة.'
        },
        reward: {
            ppTokens: 2500,
            xp: 800,
            title: 'Wealth Builder',
            titleAr: 'باني الثروة',
            hqItem: 'luxury_gem',
            skillCard: 'skl_tycoon'
        },
        bossScenarioId: 'stock_market_storm',
        bossName: 'Stock Market Storm! 📉',
        bossNameAr: 'عاصفة البورصة! 📉'
    },
    {
        id: 'dist_wall_street_heights',
        name: 'Wall Street Heights',
        arabicName: 'مرتفعات وول ستريت',
        themeColor: 'amber',
        bgGradient: 'from-yellow-400/20 via-amber-300/15 to-orange-400/20 dark:from-yellow-950/35 dark:via-amber-950/20 dark:to-orange-950/35',
        landmarkEmoji: '📈',
        levelReq: 13,
        moduleTags: ['Negotiation & Persuasion', 'Financial Modeling', 'Venture Capital'],
        audioTheme: 'intense',
        collectible: {
            id: 'col_golden_bull',
            name: 'Golden Bull',
            arabicName: 'الثور الذهبي',
            emoji: '🐂',
            description: 'A magnificent bronze figurine of a charging bull, symbolizing your dominance in negotiations.',
            descriptionAr: 'تمثال برونزي رائع لثور هائج، يرمز إلى هيمنتك في المفاوضات.'
        },
        reward: {
            ppTokens: 3000,
            xp: 1000,
            title: 'Deal Closer',
            titleAr: 'صانع الصفقات',
            hqItem: 'sofa_modern',
            skillCard: 'skl_negotiator'
        },
        bossScenarioId: 'negotiation_nightmare',
        bossName: 'Negotiation Nightmare! 🤝',
        bossNameAr: 'كابوس المفاوضات! 🤝'
    },
    {
        id: 'dist_global_empire',
        name: 'Global Empire',
        arabicName: 'الإمبراطورية العالمية',
        themeColor: 'lime',
        bgGradient: 'from-lime-400/20 via-emerald-300/15 to-green-400/20 dark:from-lime-950/35 dark:via-emerald-950/20 dark:to-green-950/35',
        landmarkEmoji: '🌎',
        levelReq: 15,
        moduleTags: ['Global Business', 'Sustainability Business', 'Crypto & Blockchain', 'Global Trade', 'Social Responsibility'],
        audioTheme: 'epic',
        collectible: {
            id: 'col_world_founder_trophy',
            name: 'World Founder Trophy',
            arabicName: 'كأس مؤسس العالم',
            emoji: '🏆',
            description: 'The ultimate prize awarded for building a socially responsible global business empire.',
            descriptionAr: 'الجائزة الكبرى الممنوحة لبناء إمبراطورية تجارية عالمية مسؤولة اجتماعياً.'
        },
        reward: {
            ppTokens: 5000,
            xp: 1500,
            title: 'Global Emperor',
            titleAr: 'الإمبراطور العالمي',
            hqItem: 'decor_globe',
            skillCard: 'skl_guru'
        },
        bossScenarioId: 'global_trade_war',
        bossName: 'Trade War Turmoil 🌍',
        bossNameAr: 'اضطراب الحرب التجارية 🌍'
    }
];
