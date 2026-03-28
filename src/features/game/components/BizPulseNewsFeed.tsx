import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Zap, ChevronLeft, ChevronRight, X, TrendingUp, Lightbulb, Globe, Star } from 'lucide-react';
import { useAppStore } from '../../../store';
import { getToday } from '../../../utils/gameUtils';

// ─── News Article Database ────────────────────────────────────────────────────
export interface BizNewsArticle {
    id: string;
    emoji: string;
    category: 'trend' | 'tip' | 'story' | 'fact';
    headline: string;
    body: string;
    xpReward: number;
    tag: string;
}

const NEWS_DB: BizNewsArticle[] = [
    {
        id: 'n1', emoji: '☕', category: 'story', headline: 'How Starbucks Started in a Fish Market',
        body: 'Starbucks opened its first store in Pike Place Market, Seattle in 1971. The founders were three university friends who just loved great coffee. Today it has over 35,000 stores worldwide!',
        xpReward: 30, tag: 'Origin Story'
    },
    {
        id: 'n2', emoji: '📱', category: 'fact', headline: 'The First iPhone Had No App Store',
        body: 'When Steve Jobs launched the iPhone in 2007, there was no App Store. It was added a full year later in 2008 — and completely changed how businesses work. Today there are over 1.7 million apps!',
        xpReward: 25, tag: 'Tech History'
    },
    {
        id: 'n3', emoji: '🍕', category: 'tip', headline: 'Why Pizza Boxes Are Square But Pizzas Are Round',
        body: 'Square boxes are cheaper to make and stack easily. This is called "operational efficiency" — saving money on how you package and ship your product. Smart businesses always look for small savings!',
        xpReward: 20, tag: 'Business Tip'
    },
    {
        id: 'n4', emoji: '🎮', category: 'trend', headline: 'Gaming is Now a $200 Billion Industry',
        body: 'Video games now make more money than movies and music COMBINED. Fortnite alone made over $5 billion in one year just from selling skins. Smart businesses go where the players are!',
        xpReward: 35, tag: 'Industry Trend'
    },
    {
        id: 'n5', emoji: '🦁', category: 'story', headline: 'The Kid Who Made $1 Million Before Age 14',
        body: 'Evan of "EvanTubeHD" started reviewing toys on YouTube at age 5. By 14 he had earned over $1 million from ad revenue. Content creation is a real business — and kids are great at it!',
        xpReward: 40, tag: 'Kid CEO'
    },
    {
        id: 'n6', emoji: '🌍', category: 'fact', headline: 'Amazon Delivers 1.6 Million Packages Every Day',
        body: 'Amazon ships 1.6 million packages from thousands of warehouses daily. That\'s 18 packages per SECOND! Their secret: they invested heavily in logistics and robotics to make delivery super fast.',
        xpReward: 30, tag: 'Supply Chain'
    },
    {
        id: 'n7', emoji: '💡', category: 'tip', headline: '3-Second Rule: How Ads Grab Your Attention',
        body: 'Research shows you have just 3 seconds to grab someone\'s attention in an ad. That\'s why the first word, color, or image is the most important in any marketing. Make it count!',
        xpReward: 25, tag: 'Marketing'
    },
    {
        id: 'n8', emoji: '🚀', category: 'trend', headline: 'SpaceX Makes Rockets Reusable — Saving Millions',
        body: 'Old rockets were thrown away after one use, costing $150 million each. SpaceX\'s Falcon 9 lands itself back and can be reused 10+ times. That\'s entrepreneurial thinking — solving waste with innovation!',
        xpReward: 35, tag: 'Innovation'
    },
    {
        id: 'n9', emoji: '🍫', category: 'story', headline: 'How Kit Kat Became Japan\'s Good Luck Charm',
        body: '"Kit Kat" sounds like "Kitto Katsu" in Japanese, meaning "you will surely win". So Japanese students buy Kit Kats before exams for good luck! Nestlé now makes 300+ Japanese-only flavors. That\'s cultural marketing!',
        xpReward: 30, tag: 'Global Business'
    },
    {
        id: 'n10', emoji: '🐦', category: 'fact', headline: 'Twitter Was Almost Called "Status"',
        body: 'Jack Dorsey\'s 2006 brainstorm list for the app included names like "Status", "Twitch", and "Jitter" before settling on "Twitter". Great companies often go through dozens of names before finding the right one.',
        xpReward: 20, tag: 'Startup Story'
    },
    {
        id: 'n11', emoji: '🎯', category: 'tip', headline: 'The Secret of "Loss Aversion" in Pricing',
        body: 'People hate losing $10 more than they enjoy gaining $10. Smart businesses use this! "Don\'t miss out — only 2 left!" works better than "Buy now!" This psychology trick is used by Amazon, Booking.com, and more.',
        xpReward: 30, tag: 'Psychology'
    },
    {
        id: 'n12', emoji: '🥤', category: 'story', headline: 'Coca-Cola Was Originally a Medicine',
        body: 'Dr. John Pemberton invented Coca-Cola in 1886 as a medicine to cure headaches! He sold it for 5 cents a glass at a pharmacy. Now Coke sells 1.9 billion servings every day worldwide.',
        xpReward: 35, tag: 'Origin Story'
    },
    {
        id: 'n13', emoji: '🏠', category: 'trend', headline: 'Kids Are Making Money on Airbnb (Legally!)',
        body: 'Some teenagers help their parents list and manage Airbnb properties. They handle photos, messaging guests, and reviews — and earn a commission. Property management is a real business skill!',
        xpReward: 40, tag: 'Kid CEO'
    },
    {
        id: 'n14', emoji: '⚡', category: 'fact', headline: 'Tesla Makes More from Software Than Cars',
        body: 'Tesla sells cars, but charges extra for "Full Self-Driving" software ($12,000+) that updates over WiFi. Software has near-zero production cost after it\'s built — that\'s why tech companies are so profitable!',
        xpReward: 35, tag: 'Business Model'
    },
    {
        id: 'n15', emoji: '🎪', category: 'tip', headline: 'Why LEGO Became Valuable After Almost Going Bankrupt',
        body: 'In 2003, LEGO nearly went bankrupt trying too many things at once (theme parks, jewelry, video games). They cut everything and focused on just bricks. Their comeback teaches: "Do less, but better."',
        xpReward: 30, tag: 'Strategy'
    },
    {
        id: 'n16', emoji: '🌈', category: 'story', headline: 'How a 10-Year-Old Sold $100K of Slime',
        body: 'Maddie Rae started selling handmade slime on Etsy at age 10. Within 3 years, her "Maddie Rae\'s Slime Glue" was sold in Walmart stores across the US — and she became a millionaire before high school.',
        xpReward: 45, tag: 'Kid CEO'
    },
    {
        id: 'n17', emoji: '🤖', category: 'trend', headline: 'AI is Creating New Jobs, Not Just Deleting Them',
        body: 'While AI replaces some jobs, it creates new ones too — like "Prompt Engineer" (someone who writes perfect instructions for AI) or "AI Trainer". The best skill for kids today: learning how to work WITH AI.',
        xpReward: 40, tag: 'Future of Work'
    },
    {
        id: 'n18', emoji: '🦅', category: 'fact', headline: 'Nike\'s Swoosh Was Bought for $35',
        body: 'Carolyn Davidson designed the famous Nike swoosh logo in 1971 for just $35 (about $250 today). Nike later gave her shares worth over $1 million. Lesson: Always negotiate equity, not just cash!',
        xpReward: 30, tag: 'Branding'
    },
    {
        id: 'n19', emoji: '📦', category: 'tip', headline: 'Why "Free Shipping" Makes You Spend More',
        body: '"Free shipping on orders over $50" sounds like a deal — but it makes customers add extra items they don\'t really need just to qualify. This is called an "anchor" pricing strategy, and it works brilliantly.',
        xpReward: 25, tag: 'E-Commerce'
    },
    {
        id: 'n20', emoji: '🌮', category: 'story', headline: 'Taco Tuesday Was a Trademark — Until It Wasn\'t',
        body: 'A taco chain owned the trademark to "Taco Tuesday" for 40 years, stopping competitors from using it. LeBron James personally campaigned to cancel it in 2023 — and won. Even phrases can be business assets!',
        xpReward: 30, tag: 'Legal Business'
    },
    {
        id: 'n21', emoji: '🏀', category: 'fact', headline: 'Michael Jordan Makes More From Nike Than He Ever Did Playing',
        body: 'Michael Jordan earned ~$90M playing basketball. His Nike deal (started 1984) has now paid him over $1.5 BILLION in royalties from Air Jordan shoes. Brand partnerships can outlast any career!',
        xpReward: 40, tag: 'Licensing'
    },
    {
        id: 'n22', emoji: '🌿', category: 'trend', headline: 'Green Business is Booming — And Kids Are Leading It',
        body: 'Sustainable brands grow 5.6x faster than regular ones. Teen entrepreneurs are creating zero-waste products, eco-packaging, and carbon-offset companies. Customers will PAY MORE to feel good about their purchase.',
        xpReward: 35, tag: 'Sustainability'
    },
    {
        id: 'n23', emoji: '🎵', category: 'story', headline: 'Spotify Pays Artists 0.003¢ Per Stream — Here\'s Why',
        body: 'Streaming math is hard: Spotify needs 250 streams = $1. But smart artists make it work — selling live tickets, merch, and brand deals ON TOP of streams. Diversify your income, always!',
        xpReward: 30, tag: 'Music Business'
    },
    {
        id: 'n24', emoji: '🔐', category: 'tip', headline: 'The Subscription Business Model Explained',
        body: 'Netflix charges $15/month instead of $50 once. Predictable income is more valuable than one-time sales. Subscription = you know exactly how much money comes in every month. That\'s why every app tries it now!',
        xpReward: 35, tag: 'Business Models'
    },
    {
        id: 'n25', emoji: '🐸', category: 'fact', headline: 'How Gucci Makes Money Selling $500 T-Shirts',
        body: 'A plain white Gucci tee costs $10 to make. It sells for $500. The extra $490 is for the "Gucci" name — that\'s called brand equity. Building a brand name is one of the most valuable things a business can do.',
        xpReward: 30, tag: 'Luxury Brands'
    },
    {
        id: 'n26', emoji: '🌐', category: 'trend', headline: 'The Creator Economy is Worth $250 Billion',
        body: 'In 2024, creators — YouTubers, TikTokers, podcasters, bloggers — together make up a $250B economy. You don\'t need a factory or store anymore. Your smartphone + ideas can be a real business.',
        xpReward: 40, tag: 'Creator Economy'
    },
    {
        id: 'n27', emoji: '🧲', category: 'tip', headline: 'Why Apple Stores Don\'t Have a Cash Register at the Door',
        body: 'Apple stores are designed like art galleries — open, bright, minimal. You\'re invited to TOUCH everything. This increases the chance you\'ll buy. Store design is one of the most powerful marketing tools.',
        xpReward: 25, tag: 'Retail Design'
    },
    {
        id: 'n28', emoji: '🦄', category: 'story', headline: 'What is a Unicorn Company?',
        body: 'A "unicorn" is a startup valued at over $1 billion. In 2010, there were only 39. In 2024, there are over 1,200! Airbnb, Uber, and Canva all started as tiny ideas. The next unicorn could be your idea.',
        xpReward: 35, tag: 'Startups'
    },
    {
        id: 'n29', emoji: '🍎', category: 'fact', headline: 'Apple Has More Cash Than Most Countries',
        body: 'Apple holds over $160 billion in cash reserves. That\'s more than the GDP of Hungary, Ukraine, or Ecuador. Having cash reserves means you can survive hard times and invest when others can\'t.',
        xpReward: 30, tag: 'Finance'
    },
    {
        id: 'n30', emoji: '🎓', category: 'tip', headline: 'Warren Buffett\'s #1 Investing Rule',
        body: '"Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1." Buffett started investing at age 11. His secret: buy great businesses at fair prices and hold them forever. Patience is the ultimate superpower.',
        xpReward: 40, tag: 'Investing'
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
    trend: { color: '#6366F1', bg: '#EEF2FF', label: '📈 Trend' },
    tip: { color: '#F59E0B', bg: '#FFFBEB', label: '💡 Tip' },
    story: { color: '#EF4444', bg: '#FEF2F2', label: '📖 Story' },
    fact: { color: '#10B981', bg: '#ECFDF5', label: '⚡ Fact' },
};

function getDailyArticles(): BizNewsArticle[] {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    // Pick 5 articles for today based on day-of-year
    const result: BizNewsArticle[] = [];
    for (let i = 0; i < 5; i++) {
        result.push(NEWS_DB[(dayOfYear * 5 + i) % NEWS_DB.length]);
    }
    return result;
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface BizPulseNewsFeedProps { onClose?: () => void; }

export const BizPulseNewsFeed: React.FC<BizPulseNewsFeedProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, claimBizPulseRead } = useAppStore();

    const today = getToday();
    const readToday: string[] = useMemo(() => {
        if (!user?.bizPulseRead || user.bizPulseRead.date !== today) return [];
        return user.bizPulseRead.articleIds ?? [];
    }, [user?.bizPulseRead, today]);

    const articles = useMemo(() => getDailyArticles(), []);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [showReward, setShowReward] = useState(false);
    const [lastReward, setLastReward] = useState(0);

    const article = articles[current];
    const isRead = readToday.includes(article.id);
    const allRead = articles.every(a => readToday.includes(a.id));
    const catConfig = CATEGORY_CONFIG[article.category];

    const navigate = (dir: number) => {
        setDirection(dir);
        setCurrent(c => (c + dir + articles.length) % articles.length);
    };

    const handleRead = () => {
        if (isRead) return;
        claimBizPulseRead(article.id, article.xpReward, today);
        setLastReward(article.xpReward);
        setShowReward(true);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        setTimeout(() => setShowReward(false), 2000);
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        {t('bizpulse.title')}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{t('bizpulse.subtitle')}</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Article Card */}
            <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={article.id}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -80 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                        style={{ background: catConfig.bg }}
                    >
                        {/* Category Bar */}
                        <div className="flex items-center justify-between px-4 pt-3 pb-1">
                            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: catConfig.color }}>
                                {catConfig.label}
                            </span>
                            <span className="text-xs font-semibold text-gray-500">{article.tag}</span>
                        </div>

                        {/* Emoji + Headline */}
                        <div className="px-4 pt-2 pb-1 flex items-start gap-3">
                            <span className="text-4xl leading-none mt-1">{article.emoji}</span>
                            <h3 className="font-black text-gray-800 dark:text-gray-900 text-base leading-tight">
                                {article.headline}
                            </h3>
                        </div>

                        {/* Body */}
                        <p className="px-4 pb-4 pt-2 text-sm text-gray-600 leading-relaxed">
                            {article.body}
                        </p>

                        {/* Read Button + XP */}
                        <div className="px-4 pb-4">
                            {isRead ? (
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <span>✅</span> {t('bizpulse.already_read')}
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleRead}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
                                    style={{ background: catConfig.color }}
                                >
                                    <Zap size={14} />
                                    {t('bizpulse.mark_read', { xp: article.xpReward })}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* XP Reward Popup */}
                <AnimatePresence>
                    {showReward && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full font-black text-sm shadow-lg pointer-events-none z-20"
                        >
                            +{lastReward} XP ⚡
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Dot Indicators */}
                <div className="flex gap-2">
                    {articles.map((a, i) => (
                        <button key={a.id} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}>
                            <motion.div
                                className="rounded-full transition-all"
                                animate={{
                                    width: i === current ? 20 : 8,
                                    height: 8,
                                    background: readToday.includes(a.id) ? '#10B981' : i === current ? '#6366F1' : '#D1D5DB',
                                }}
                            />
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate(1)}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* All Read Banner */}
            {allRead && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-4 text-white text-center"
                >
                    <div className="text-2xl mb-1">🎉</div>
                    <p className="font-black">{t('bizpulse.all_read_title')}</p>
                    <p className="text-sm opacity-90">{t('bizpulse.all_read_desc')}</p>
                </motion.div>
            )}

            {/* Progress */}
            <div className="text-center text-xs text-gray-400 font-medium">
                {t('bizpulse.read_count', { done: readToday.length, total: articles.length })}
            </div>
        </div>
    );
};

export default BizPulseNewsFeed;
