import type { LucideIcon } from 'lucide-react';
import {
    Coins,
    Rocket,
    TrendingUp,
    Megaphone,
    Star,
    Globe,
    Cpu,
    HeartHandshake,
    Plane,
    Brain,
    Bitcoin,
    Leaf,
    Building2,
    BarChart2,
    Sparkles,
    DollarSign,
    Briefcase,
} from "lucide-react";

export interface ModuleDefinition {
    /** Display name — must match lesson.topic_tag exactly */
    tag: string;
    /** snake_case key used for subscription license checks */
    licenseKey: string;
    /** Short code passed to ProjectSubmitter as lessonId */
    projectCode: string;
    /** Tailwind color name (without prefix) used for node theming */
    color: string;
    /** Lucide icon component rendered on the map node */
    Icon: LucideIcon;
    /** Which season this module belongs to (1–4) */
    season: 1 | 2 | 3 | 4;
}

export const MODULE_DEFINITIONS: readonly ModuleDefinition[] = [
    // ── Season 1: Foundation ──────────────────────────────────────────────────
    { tag: 'Money Basics',           licenseKey: 'money_basics',          projectCode: 'MOD_MB',     color: 'yellow',  Icon: Coins,          season: 1 },
    { tag: 'Entrepreneurship',       licenseKey: 'entrepreneurship',       projectCode: 'MOD_ENT',    color: 'orange',  Icon: Rocket,         season: 1 },
    { tag: 'Investing & Wealth',     licenseKey: 'investing_wealth',       projectCode: 'MOD_INV',    color: 'emerald', Icon: TrendingUp,     season: 1 },
    { tag: 'Marketing',              licenseKey: 'marketing',              projectCode: 'MOD_MKT',    color: 'rose',    Icon: Megaphone,      season: 1 },
    { tag: 'Leadership',             licenseKey: 'leadership',             projectCode: 'MOD_LDR',    color: 'purple',  Icon: Star,           season: 1 },
    { tag: 'Economics',              licenseKey: 'economics',              projectCode: 'MOD_ECO',    color: 'cyan',    Icon: Globe,          season: 1 },
    { tag: 'Technology',             licenseKey: 'technology',             projectCode: 'MOD_TECH',   color: 'indigo',  Icon: Cpu,            season: 1 },
    { tag: 'Social Responsibility',  licenseKey: 'social_responsibility',  projectCode: 'MOD_SOC',    color: 'lime',    Icon: HeartHandshake, season: 1 },
    { tag: 'Global Business',        licenseKey: 'global_business',        projectCode: 'MOD_GLO',    color: 'sky',     Icon: Plane,          season: 1 },
    { tag: 'Financial Smarts',       licenseKey: 'financial_smarts',       projectCode: 'MOD_FIN',    color: 'teal',    Icon: Brain,          season: 1 },

    // ── Season 2: Advanced Track ──────────────────────────────────────────────
    { tag: 'Crypto & Blockchain',    licenseKey: 'crypto_blockchain',      projectCode: 'MOD_CRYPTO', color: 'amber',   Icon: Bitcoin,        season: 2 },
    { tag: 'AI & Future Jobs',       licenseKey: 'ai_future_jobs',         projectCode: 'MOD_AIJOB',  color: 'blue',    Icon: Cpu,            season: 2 },
    { tag: 'Sustainability Business',licenseKey: 'sustainability_business', projectCode: 'MOD_SUST',   color: 'green',   Icon: Leaf,           season: 2 },

    // ── Season 3: CEO Track ───────────────────────────────────────────────────
    { tag: 'Venture Capital',        licenseKey: 'venture_capital',        projectCode: 'MOD_VC',     color: 'yellow',  Icon: TrendingUp,     season: 3 },
    { tag: 'Corporate Strategy',     licenseKey: 'corporate_strategy',     projectCode: 'MOD_CORP',   color: 'violet',  Icon: Building2,      season: 3 },
    { tag: 'Global Trade',           licenseKey: 'global_trade',           projectCode: 'MOD_GLOB',   color: 'teal',    Icon: Globe,          season: 3 },

    // ── Season 4: Mastery Track ───────────────────────────────────────────────
    { tag: 'Financial Modeling',     licenseKey: 'financial_modeling',     projectCode: 'MOD_FMD',    color: 'fuchsia', Icon: BarChart2,      season: 4 },
    { tag: 'Brand Building',         licenseKey: 'brand_building',         projectCode: 'MOD_BRAND',  color: 'pink',    Icon: Sparkles,       season: 4 },
    { tag: 'Future of Money',        licenseKey: 'future_of_money',        projectCode: 'MOD_FUTURE', color: 'indigo',  Icon: DollarSign,     season: 4 },
    { tag: 'Negotiation & Persuasion',licenseKey: 'negotiation_persuasion', projectCode: 'MOD_NEG',    color: 'orange',  Icon: Briefcase,      season: 4 },
] as const;

/** O(1) lookup map — tag → ModuleDefinition */
export const MODULE_MAP = new Map<string, ModuleDefinition>(
    MODULE_DEFINITIONS.map(m => [m.tag, m])
);

export interface DistrictDefinition {
    id: string;
    name: string;
    arabicName: string;
    themeColor: string;
    bgGradient: string;
    landmarkEmoji: string;
    levelReq: number;
    moduleTags: string[];
    reward: {
        ppTokens: number;
        xp: number;
        title?: string;
        titleAr?: string;
        hqItem?: string; // Links to FurnitureItem.id
        hqItemAr?: string;
        skillCard?: string; // Links to Skill.id
        skillCardAr?: string;
    };
    bossScenarioId: string;
    bossName: string;
    bossNameAr: string;
}

export const DISTRICT_DEFINITIONS: readonly DistrictDefinition[] = [
    {
        id: 'dist_startup_street',
        name: 'Startup Street',
        arabicName: 'شارع الشركات الناشئة',
        themeColor: 'yellow',
        bgGradient: 'from-yellow-500/10 to-amber-500/10 dark:from-yellow-950/20 dark:to-amber-950/20',
        landmarkEmoji: '🏠',
        levelReq: 1,
        moduleTags: ['Money Basics', 'Financial Smarts'],
        reward: {
            ppTokens: 500,
            xp: 200,
            title: 'Budget Master',
            titleAr: 'خبير الميزانية',
            hqItem: 'light_lamp',
            hqItemAr: 'نبتة مكتبية',
            skillCard: 'skl_fast_learner',
            skillCardAr: 'الاقتصاد الجزئي'
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
        bgGradient: 'from-orange-500/10 to-amber-600/10 dark:from-orange-950/20 dark:to-amber-950/20',
        landmarkEmoji: '🍋',
        levelReq: 2,
        moduleTags: ['Entrepreneurship'],
        reward: {
            ppTokens: 750,
            xp: 300,
            title: 'Lemon Tycoon',
            titleAr: 'تاجر الليمون',
            hqItem: 'decor_neon',
            hqItemAr: 'لافتة نيون',
            skillCard: 'skl_fast_hands',
            skillCardAr: 'دعم المبيعات الأولى'
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
        bgGradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-950/20 dark:to-pink-950/20',
        landmarkEmoji: '🚚',
        levelReq: 3,
        moduleTags: ['Marketing', 'Brand Building'],
        reward: {
            ppTokens: 1000,
            xp: 400,
            title: 'Marketing Guru',
            titleAr: 'معلم التسويق',
            hqItem: 'food_pizza',
            hqItemAr: 'آلة أركيد ريترو',
            skillCard: 'skl_silver_tongue',
            skillCardAr: 'الانتشار الفيروسي'
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
        bgGradient: 'from-cyan-500/10 to-sky-500/10 dark:from-cyan-950/20 dark:to-sky-950/20',
        landmarkEmoji: '🏪',
        levelReq: 5,
        moduleTags: ['Economics'],
        reward: {
            ppTokens: 1200,
            xp: 500,
            title: 'Retail King',
            titleAr: 'ملك التجزئة',
            hqItem: 'food_coffee',
            hqItemAr: 'ركن القهوة',
            skillCard: 'skl_negotiator',
            skillCardAr: 'مرونة الأسعار'
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
        bgGradient: 'from-indigo-500/10 to-blue-600/10 dark:from-indigo-950/20 dark:to-blue-950/20',
        landmarkEmoji: '🚀',
        levelReq: 7,
        moduleTags: ['Technology', 'AI & Future Jobs'],
        reward: {
            ppTokens: 1500,
            xp: 600,
            title: 'Silicon Pioneer',
            titleAr: 'رائد السيليكون',
            hqItem: 'laptop',
            hqItemAr: 'رف كمبيوتر عملاق',
            skillCard: 'skl_multitasker',
            skillCardAr: 'الأتمتة بالذكاء الاصطناعي'
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
        bgGradient: 'from-purple-500/10 to-fuchsia-600/10 dark:from-purple-950/20 dark:to-fuchsia-950/20',
        landmarkEmoji: '🏢',
        levelReq: 9,
        moduleTags: ['Leadership', 'Corporate Strategy'],
        reward: {
            ppTokens: 2000,
            xp: 700,
            title: 'Managing Director',
            titleAr: 'المدير التنفيذي',
            hqItem: 'chair_office',
            hqItemAr: 'كرسي جلدي فخم',
            skillCard: 'skl_famous',
            skillCardAr: 'دعم التآزر'
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
        bgGradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20',
        landmarkEmoji: '🏦',
        levelReq: 11,
        moduleTags: ['Investing & Wealth', 'Future of Money'],
        reward: {
            ppTokens: 2500,
            xp: 800,
            title: 'Wealth Builder',
            titleAr: 'باني الثروة',
            hqItem: 'luxury_gem',
            hqItemAr: 'حصالة ذهبية',
            skillCard: 'skl_tycoon',
            skillCardAr: 'كرة ثلج الفائدة المركبة'
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
        bgGradient: 'from-amber-500/10 to-yellow-600/10 dark:from-amber-950/20 dark:to-yellow-950/20',
        landmarkEmoji: '📈',
        levelReq: 13,
        moduleTags: ['Negotiation & Persuasion', 'Financial Modeling', 'Venture Capital'],
        reward: {
            ppTokens: 3000,
            xp: 1000,
            title: 'Deal Closer',
            titleAr: 'صانع الصفقات',
            hqItem: 'sofa_modern',
            hqItemAr: 'أريكة مكتبية فاخرة',
            skillCard: 'skl_negotiator',
            skillCardAr: 'مقنع القروش'
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
        bgGradient: 'from-lime-500/10 to-emerald-600/10 dark:from-lime-950/20 dark:to-emerald-950/20',
        landmarkEmoji: '🌎',
        levelReq: 15,
        moduleTags: ['Global Business', 'Sustainability Business', 'Crypto & Blockchain', 'Global Trade', 'Social Responsibility'],
        reward: {
            ppTokens: 5000,
            xp: 1500,
            title: 'Global Emperor',
            titleAr: 'الإمبراطور العالمي',
            hqItem: 'decor_globe',
            hqItemAr: 'خريطة هولوغرام للعالم',
            skillCard: 'skl_guru',
            skillCardAr: 'الاحتكار العالمي'
        },
        bossScenarioId: 'global_trade_war',
        bossName: 'Trade War Turmoil 🌍',
        bossNameAr: 'اضطراب الحرب التجارية 🌍'
    }
];
