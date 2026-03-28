import React from 'react';
import { useAppStore, HQ_LEVELS } from '../../../store';
import { formatCurrency, formatCompactNumber } from '../../../utils/formatters';
import { Lock, CheckCircle, ArrowUpCircle, Palette, ShoppingBag, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEducationStore } from '../../../store/educationStore';
import { useEconomyStore } from '../../../store/economyStore';
import Dollhouse2D from './Dollhouse2D';
import FurnitureShop from './FurnitureShop';
import PortfolioAnalysis from '../../empire/components/PortfolioAnalysis';
import { FURNITURE_ITEMS } from '../data/furniture';
import { hasSchoolBypass } from '../../../utils/premiumAccess';
import { DailyMissions } from '../../education/components/DailyMissions';
import { StreakBanner } from './StreakBanner';
import { WeeklyChallengeWidget } from './WeeklyChallengeWidget';
import { SeasonalEventBanner } from './SeasonalEventBanner';
import { HQShowcase } from './HQShowcase';
import FranchisePanel from './FranchisePanel';
import BusinessPlanModal from '../../education/components/BusinessPlanModal';

const THEMES: Record<string, string> = {
    'hq_garage': 'from-slate-800 via-gray-800 to-zinc-900',
    'hq_office': 'from-blue-600 via-cyan-500 to-teal-500',
    'hq_highrise': 'from-indigo-700 via-purple-600 to-pink-600',
    'hq_island': 'from-teal-500 via-emerald-500 to-green-600'
};

const CUSTOM_THEMES: Record<string, string> = {
    blue: 'from-blue-700 via-indigo-700 to-purple-800',
    gold: 'from-yellow-600 via-amber-600 to-orange-700',
    modern: 'from-slate-800 via-zinc-800 to-gray-900'
};
const Headquarters: React.FC = () => {
    const { user, upgradeHQ, updateUser } = useAppStore();
    const { t } = useTranslation();
    const [isShopOpen, setIsShopOpen] = React.useState(false);
    const [showBusinessPlan, setShowBusinessPlan] = React.useState(false);


    if (!user) return null;

    // ... (keep hqIndex logic)
    const hqIndex = HQ_LEVELS.findIndex(h => h.id === user.hqLevel);
    const currentLevelIndex = hqIndex === -1 ? 0 : hqIndex;
    const currentLevel = HQ_LEVELS[currentLevelIndex] || HQ_LEVELS[0];

    // ... (keep isIntern logic)
    const isIntern = user.subscriptionTier === 'intern';
    const classrooms = useEducationStore(state => state.classrooms);
    const users = useAppStore(state => state.users);
    const activeSchoolBypass = hasSchoolBypass(user, classrooms, users);
    const isFounderPlus = !isIntern || user.role === 'ADMIN' || activeSchoolBypass;

    // Dynamic Background logic... (keep or adapt)
    let bgGradient = THEMES[currentLevel?.id] || 'from-gray-700 to-gray-900';
    if (isFounderPlus && user.hqTheme && CUSTOM_THEMES[user.hqTheme]) {
        bgGradient = CUSTOM_THEMES[user.hqTheme];
    }

    const handleCustomize = () => {
        // ... (keep logic)
        const themes: ('blue' | 'gold' | 'modern')[] = ['blue', 'gold', 'modern'];
        const currentTheme = user.hqTheme || 'blue';
        const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        updateUser(user.id, { hqTheme: themes[nextIndex] });
    };

    return (
        <div className="pb-20 space-y-8">
            <div className="text-center mb-10">
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4"
                >
                    {t('hq.title')}
                </motion.h2>
                <div className="flex items-center justify-center gap-4">
                    <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">{t('hq.subtitle')}</p>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsShopOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-purple-300/50 dark:shadow-purple-900/50 hover:shadow-2xl transition-all"
                    >
                        <ShoppingBag size={20} /> {t('hq.buy_furniture')}
                    </motion.button>
                </div>
            </div>

            {/* Modern Stats Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('hq.cash')}</div>
                                <div className="text-xl md:text-2xl font-black text-gray-800 dark:text-white truncate" title={formatCurrency(user.bizCoins)}>{formatCurrency(user.bizCoins)}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('hq.hq_value')}</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">{formatCurrency(user.bizCoins * 2)}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('hq.inventory')}</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">{user.inventory.length} {t('hq.items')}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border-2 border-white/50 dark:border-gray-700/50 shadow-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('hq.skills')}</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">{user.completedLessonIds.length}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 🎭 Seasonal Event Banner (hero card — top of engagement widgets) */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="mb-4"
            >
                <SeasonalEventBanner />
            </motion.div>

            {/* 🔥 Streak Banner */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.42 }}
                className="mb-4"
            >
                <StreakBanner />
            </motion.div>

            {/* ⚡ Daily Missions Widget */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mb-4"
            >
                <DailyMissions />
            </motion.div>

            {/* ⚔️ Weekly Challenge */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.52 }}
                className="mb-4"
            >
                <WeeklyChallengeWidget />
            </motion.div>

            {/* 🏠 HQ Showcase - Top 3 HQs this week */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.58 }}
                className="mb-4"
            >
                <HQShowcase />
            </motion.div>

            {/* 🏪 Franchise Mode - Passive Income Panel */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.63 }}
                className="mb-4"
            >
                <FranchisePanel />
            </motion.div>

            {/* ✨ AI Business Plan Generator */}
            {(() => {
                const isTycoon = user.subscriptionTier === 'tycoon';
                return (
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.68 }}
                        className="mb-4"
                    >
                        <div
                            onClick={() => isTycoon && setShowBusinessPlan(true)}
                            className={`relative overflow-hidden rounded-3xl p-6 flex items-center gap-5 border-2 transition-all
                                ${isTycoon
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-700 border-purple-400/30 cursor-pointer hover:scale-[1.01] shadow-xl shadow-purple-900/30'
                                    : 'bg-gray-800/60 border-gray-600/30 cursor-not-allowed opacity-75'}
                            `}
                        >
                            {/* Background sparkle */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Sparkles size={32} className="text-yellow-300" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-black text-xl ${isTycoon ? 'text-white' : 'text-gray-400'}`}>
                                        {t('aiGenerator.title')}
                                    </h3>
                                    {!isTycoon && (
                                        <span className="bg-yellow-400/20 text-yellow-400 text-xs font-black px-2 py-0.5 rounded-full border border-yellow-400/30">
                                            TYCOON
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm font-medium ${isTycoon ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {isTycoon
                                        ? t('aiGenerator.desc')
                                        : t('aiGenerator.tycoonOnly')}
                                </p>
                            </div>
                            {isTycoon && (
                                <div className="relative z-10 bg-white text-purple-700 px-4 py-2 rounded-xl font-black text-sm shadow-lg flex-shrink-0 hover:scale-105 transition-transform">
                                    {t('aiGenerator.generateBtn')}
                                </div>
                            )}
                        </div>

                        {showBusinessPlan && <BusinessPlanModal onClose={() => setShowBusinessPlan(false)} />}
                    </motion.div>
                );
            })()}

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`relative rounded-[40px] h-[600px] shadow-2xl overflow-hidden bg-gradient-to-br ${bgGradient} transition-colors duration-500 border-4 border-white/20 dark:border-gray-700/20 mb-6`}
            >

                {/* Background Pattern/Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>

                {/* The Interactive Dollhouse */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Dollhouse2D />
                </div>

                {/* Theme Toggle (Top Right) */}
                <button
                    onClick={handleCustomize}
                    className={`absolute top-6 end-6 p-3 rounded-full backdrop-blur-md transition-all z-20 flex items-center gap-2 group shadow-lg
                        ${isFounderPlus ? 'bg-white/20 hover:bg-white/40 cursor-pointer text-white' : 'bg-gray-900/50 cursor-not-allowed text-red-400'}
                    `}
                    title={isFounderPlus ? "Change Theme" : "Locked (Founder Only)"}
                >
                    {isFounderPlus ? <Palette size={24} /> : <Lock size={24} />}
                </button>

                {/* Shop Overlay */}
                {isShopOpen && (
                    <div className="absolute inset-x-4 bottom-4 top-20 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="relative h-full">
                            <button
                                onClick={() => setIsShopOpen(false)}
                                className="absolute -top-3 -right-3 z-50 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <X size={20} />
                            </button>
                            <FurnitureShop onClose={() => setIsShopOpen(false)} />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Furniture Inventory Panel - Outside House */}
            {user.inventory && user.inventory.length > 0 && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📦</span>
                        <h3 className="font-black text-2xl text-gray-800 dark:text-white">{t('hq.my_furniture')}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">{t('hq.drag_items')}</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {user.inventory
                            .map((itemId: string) => FURNITURE_ITEMS.find(f => f.id === itemId))
                            .filter(item => item !== undefined)
                            .map((item, index) => (
                                <div
                                    key={`${item!.id}-${index}`}
                                    className="flex-shrink-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-700 cursor-grab active:cursor-grabbing min-w-[140px] hover:scale-105 hover:-translate-y-2 transition-all"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('furniture', JSON.stringify(item));
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <span className="text-5xl">{item!.icon}</span>
                                        <div className="font-bold text-sm text-gray-800 dark:text-white">{t(`hq.furniture.${item!.id}` as any, item!.name)}</div>
                                    </div>
                                </div>
                            ))}                    </div>
                </motion.div>
            )}

            {/* Upgrade Path */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {HQ_LEVELS.map((level, index) => {
                    const isUnlocked = index <= currentLevelIndex;
                    const isNext = index === currentLevelIndex + 1;
                    const canAfford = isNext && user.bizCoins >= level.cost;

                    return (
                        <motion.div
                            key={level.id}
                            whileHover={isNext ? { scale: 1.05 } : {}}
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all relative overflow-hidden
                        ${isUnlocked ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 opacity-80' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}
                        ${isNext ? 'ring-4 ring-yellow-300 border-yellow-500 shadow-xl z-10 opacity-100' : ''}
                    `}
                        >
                            {isNext && (
                                <div className="absolute top-0 end-0 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-es-lg">
                                    {t('hq.next')}
                                </div>
                            )}

                            <div className="text-4xl mb-3 filter drop-shadow-sm">{level.icon}</div>
                            <div className="font-bold text-gray-800 dark:text-white mb-1">{t(`hq_levels.${level.id}.name` as any)}</div>

                            {isUnlocked ? (
                                <div className="mt-auto pt-4 text-green-600 dark:text-green-400 font-bold flex items-center gap-2">
                                    <CheckCircle size={18} /> {t('hq.owned')}
                                </div>
                            ) : isNext ? (
                                <button
                                    onClick={() => upgradeHQ(level.id)}
                                    disabled={!canAfford}
                                    className={`mt-auto w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${canAfford
                                            ? 'bg-kid-primary text-yellow-900 hover:bg-yellow-400 btn-juicy shadow-md'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}
                            `}
                                >
                                    {canAfford ? <ArrowUpCircle size={18} /> : <Lock size={18} />}
                                    ${level.cost.toLocaleString()}
                                </button>
                            ) : (
                                <div className="mt-auto pt-4 text-gray-400 dark:text-gray-500 font-bold flex items-center gap-2">
                                    <Lock size={18} /> {t('hq.locked')}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Headquarters;
