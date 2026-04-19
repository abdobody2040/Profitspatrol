import { SubscriptionTier, ShopItem, HQLevel, Skill, LeaderboardEntry } from '../types';
// Re-exported ShopItem type so HashMap consumers stay type-safe without
// importing from two places.
export type { ShopItem };

// Use strict readonly tuples for critical game logic constants to prevent mutation
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000] as const;
export const MAX_LOCAL_USERS = 50;

// Security Note: SHA-256 hash of "123". Used ONLY for verifying legacy/mock users in dev mode.
// Production users MUST have their passwords hashed dynamically.
export const HASH_MOCK_123 = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";

// SECURITY WARNING:
// The 'price' field here is for DISPLAY PURPOSES ONLY.
// Actual charging must reference 'stripePriceId' via a secure backend to prevent client-side price tampering.

// DEPRECATED: These MOCKS are for local development / testing only. 
// Production authentication uses Supabase Auth.
import { MOCK_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN } from './mocks'; 
export const SUBSCRIPTION_PLANS = [
    {
        id: 'intern',
        name: 'Intern',
        price: 0,
        stripePriceId: 'price_free_tier_stub',
        interval: 'mo',
        description: 'User Acquisition & Hook',
        features: ['1 Business Slot', 'Standard Energy', 'Core Lessons'],
        color: 'bg-white border-gray-200',
        buttonColor: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        tier: 'intern' as SubscriptionTier
    },
    {
        id: 'founder',
        name: 'Founder',
        price: 9.99,
        stripePriceId: 'price_founder_monthly_stub',
        interval: 'mo',
        description: 'Monthly Recurring Revenue',
        features: ['Unlimited Energy', '3 Business Slots', 'Custom HQ', 'Offline Mode'],
        color: 'bg-blue-50 border-blue-200',
        buttonColor: 'bg-blue-600 text-white hover:bg-blue-700',
        tier: 'founder' as SubscriptionTier
    },
    {
        id: 'board',
        name: 'Board Member',
        price: 14.99,
        stripePriceId: 'price_board_monthly_stub',
        interval: 'mo',
        description: 'High Value for Parents',
        features: ['3 Child Accounts', 'Parent Dashboard Pro', 'All Founder Perks'],
        color: 'bg-purple-50 border-purple-200 ring-4 ring-purple-400/20',
        buttonColor: 'bg-purple-600 text-white hover:bg-purple-700',
        tier: 'board' as SubscriptionTier,
        recommended: true
    },
    {
        id: 'tycoon',
        name: 'Tycoon',
        price: 89.99,
        stripePriceId: 'price_tycoon_yearly_stub',
        interval: 'yr',
        description: 'Premium AI Experience',
        features: ['Hire Ollie AI', 'Gold Skin', 'Advanced Modules'],
        color: 'bg-yellow-50 border-yellow-400',
        buttonColor: 'bg-kid-primary text-yellow-900 hover:bg-yellow-400',
        tier: 'tycoon' as SubscriptionTier
    },
    {
        id: 'teacher_solo',
        name: 'Teacher Solo',
        price: 0,
        stripePriceId: 'price_teacher_free_stub',
        interval: 'mo',
        description: 'The Viral Plan',
        features: ['feat_class_mgmt', 'feat_curriculum_mode', 'feat_basic_gradebook', 'feat_school_hours'],
        color: 'bg-green-50 border-green-200',
        buttonColor: 'bg-green-600 text-white hover:bg-green-700',
        tier: 'teacher_solo' as SubscriptionTier
    },
    {
        id: 'teacher_pro',
        name: 'Teacher Pro',
        price: 49,
        stripePriceId: 'price_teacher_pro_yearly',
        interval: 'yr',
        description: 'Empowered Educators',
        features: ['feat_unlimited_classrooms', 'feat_advanced_gradebook', 'feat_data_export', 'feat_priority_support'],
        color: 'bg-teal-50 border-teal-200 ring-2 ring-teal-400/20',
        buttonColor: 'bg-teal-600 text-white hover:bg-teal-700',
        tier: 'teacher_pro' as SubscriptionTier
    },
    {
        id: 'school_small',
        name: 'Small School',
        price: 299,
        stripePriceId: 'price_school_small_yearly',
        interval: 'yr',
        description: 'Up to 100 Students',
        features: ['feat_lms_sync', 'feat_school_leaderboard', 'feat_admin_dash_school', 'feat_unlocked_content'],
        color: 'bg-indigo-50 border-indigo-200',
        buttonColor: 'bg-indigo-600 text-white hover:bg-indigo-700',
        tier: 'school_small' as SubscriptionTier
    },
    {
        id: 'school_medium',
        name: 'Medium School',
        price: 899,
        stripePriceId: 'price_school_medium_yearly',
        interval: 'yr',
        description: 'Up to 500 Students',
        features: ['feat_lms_sync', 'feat_school_leaderboard', 'feat_admin_dash_school', 'feat_unlocked_content', 'feat_priority_support'],
        color: 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-400/20',
        buttonColor: 'bg-indigo-600 text-white hover:bg-indigo-700',
        tier: 'school_medium' as SubscriptionTier,
        recommended: true
    },
    {
        id: 'school_large',
        name: 'Large/District',
        price: 1499,
        stripePriceId: 'price_school_large_yearly',
        interval: 'yr',
        description: 'Unlimited Students',
        features: ['feat_lms_sync', 'feat_school_leaderboard', 'feat_admin_dash_school', 'feat_unlocked_content', 'feat_dedicated_manager'],
        color: 'bg-indigo-100 border-indigo-300 ring-4 ring-indigo-400/30',
        buttonColor: 'bg-indigo-700 text-white hover:bg-indigo-800',
        tier: 'school_large' as SubscriptionTier
    }
] as const;

export const SHOP_ITEMS = [
    // Apparel
    { id: 'item_sunglasses', name: 'Cool Shades', description: 'Look like a boss.', cost: 50, type: 'AVATAR', icon: '🕶️' },
    { id: 'item_hat', name: 'Top Hat', description: 'Classy business attire.', cost: 80, type: 'AVATAR', icon: '🎩' },
    { id: 'item_suit', name: 'CEO Suit', description: 'Dress for success.', cost: 150, type: 'AVATAR', icon: '👔' },
    { id: 'item_crown', name: 'Royal Crown', description: 'King of the market.', cost: 500, type: 'AVATAR', icon: '👑' },
    { id: 'item_cape', name: 'Hero Cape', description: 'Super CEO!', cost: 300, type: 'AVATAR', icon: '🦸' },
    { id: 'item_monocle', name: 'Fancy Monocle', description: 'Very sophisticated.', cost: 250, type: 'AVATAR', icon: '🧐' },
    { id: 'item_bow', name: 'Bow Tie', description: 'Dapper style.', cost: 120, type: 'AVATAR', icon: '🎀' },
    { id: 'item_astro', name: 'Astro Helmet', description: 'To the moon!', cost: 600, type: 'AVATAR', icon: '👩‍🚀' },
    { id: 'item_chef', name: 'Chef Hat', description: 'Cooking up profits.', cost: 100, type: 'AVATAR', icon: '👨‍🍳' },
    { id: 'item_beret', name: 'Artist Beret', description: 'Creative genius.', cost: 90, type: 'AVATAR', icon: '🎨' },

    // Powerups
    { id: 'item_freeze', name: 'Streak Freeze', description: 'Miss a day without losing your streak!', cost: 200, type: 'POWERUP', icon: '❄️' },

    // Consumables (New)
    { id: 'cons_consultant', name: 'The Consultant', description: 'Removes 2 wrong answers in a quiz.', cost: 30, type: 'CONSUMABLE', icon: '🕵️‍♂️', effectType: 'HINT' },
    { id: 'cons_bailout', name: 'Bailout Potion', description: 'Continue a game after failing.', cost: 50, type: 'CONSUMABLE', icon: '🧪', effectType: 'SECOND_LIFE' },
    { id: 'cons_boom', name: 'Market Boom', description: 'Double income for 15 mins.', cost: 100, type: 'CONSUMABLE', icon: '📈', effectType: 'INCOME_BOOST' },
    { id: 'cons_xp_small', name: 'XP Snack', description: '+50 XP instantly.', cost: 40, type: 'CONSUMABLE', icon: '🍫', effectType: 'INCOME_BOOST' },
    { id: 'cons_xp_large', name: 'XP Feast', description: '+200 XP instantly.', cost: 150, type: 'CONSUMABLE', icon: '🍱', effectType: 'INCOME_BOOST' },
    { id: 'cons_lucky', name: 'Lucky Clover', description: 'Better events for 1 day.', cost: 75, type: 'CONSUMABLE', icon: '🍀', effectType: 'INCOME_BOOST' },
] as const;

export const HQ_LEVELS: HQLevel[] = [
    { id: 'hq_garage', name: 'Messy Garage', cost: 0, description: 'Where every great idea starts.', icon: '🏚️' },
    { id: 'hq_office', name: 'Shared Office', cost: 5000, description: 'A proper desk and a coffee machine.', icon: '🏢' },
    { id: 'hq_highrise', name: 'High-Rise Floor', cost: 50000, description: 'Glass windows with a city view.', icon: '🏙️' },
    { id: 'hq_island', name: 'Private Island', cost: 1000000, description: 'The ultimate status symbol.', icon: '🏝️' },
];

export const SKILLS_DB: Skill[] = [
    // Charisma Branch
    { id: 'skl_silver_tongue', name: 'Silver Tongue', category: 'CHARISMA', description: 'Customers pay 5% more.', cost: 200, effect: { type: 'PASSIVE_PRICE', value: 0.05 } },
    { id: 'skl_negotiator', name: 'Negotiator', category: 'CHARISMA', description: 'Supplier costs reduced by 10%.', cost: 500, effect: { type: 'PASSIVE_COST', value: 0.10 } },
    { id: 'skl_famous', name: 'Local Celebrity', category: 'CHARISMA', description: 'Can charge 15% more for everything.', cost: 1500, effect: { type: 'PASSIVE_PRICE', value: 0.15 } },

    // Efficiency Branch
    { id: 'skl_fast_hands', name: 'Fast Hands', category: 'EFFICIENCY', description: 'Click/Swipe actions are 10% faster.', cost: 200, effect: { type: 'ACTIVE_CLICK', value: 0.10 } },
    { id: 'skl_multitasker', name: 'Multitasker', category: 'EFFICIENCY', description: 'Game timers run 15% slower.', cost: 500, effect: { type: 'PASSIVE_SPEED', value: 0.15 } },
    { id: 'skl_robotics', name: 'Robotic Workers', category: 'EFFICIENCY', description: 'Operational costs reduced by 20%.', cost: 1500, effect: { type: 'PASSIVE_COST', value: 0.20 } },

    // Wisdom Branch
    { id: 'skl_fast_learner', name: 'Fast Learner', category: 'WISDOM', description: 'Earn +20% XP from lessons.', cost: 300, effect: { type: 'PASSIVE_XP', value: 0.20 } },
    { id: 'skl_tycoon', name: 'Tycoon Mindset', category: 'WISDOM', description: 'Portfolio earns 10% more income.', cost: 800, effect: { type: 'PASSIVE_PRICE', value: 0.10 } },
    { id: 'skl_guru', name: 'Business Guru', category: 'WISDOM', description: 'Earn +50% XP from everything.', cost: 2000, effect: { type: 'PASSIVE_XP', value: 0.50 } },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: 'u1', name: 'BizWhiz', xp: 5200, avatar: '🦊' },
    { id: 'u2', name: 'RocketCEO', xp: 4800, avatar: '🚀' },
    { id: 'u3', name: 'MoneyMaker', xp: 3500, avatar: '🦁' },
    { id: 'u4', name: 'DiamondHands', xp: 2100, avatar: '💎' },
    { id: 'kid_1', name: 'Leo', xp: 1250, avatar: '🐼', isCurrentUser: true },
];

// ---------------------------------------------------------------------------
// O(1) Lookup Maps
// Built once at module initialisation — never mutated after construction.
// Use these everywhere instead of Array.find() inside render loops.
// ---------------------------------------------------------------------------

/** O(1) shop-item lookup by id. */
export const SHOP_ITEMS_MAP: ReadonlyMap<string, (typeof SHOP_ITEMS)[number]> = Object.freeze(
    new Map(SHOP_ITEMS.map(item => [item.id, item]))
);

/** O(1) skill lookup by id. */
export const SKILLS_MAP: ReadonlyMap<string, Skill> = Object.freeze(
    new Map(SKILLS_DB.map(skill => [skill.id, skill]))
);

/** O(1) skill lookup by id (alias for backward-compat). */
export const LEADERBOARD_MAP: ReadonlyMap<string, LeaderboardEntry> = Object.freeze(
    new Map(MOCK_LEADERBOARD.map(e => [e.id, e]))
);
