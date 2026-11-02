import React, { useMemo, useState } from 'react';
import { useAppStore, HQ_LEVELS } from '../../../store';
import {
    Lock, CheckCircle, ArrowUpCircle, Palette, ShoppingBag, X, Sparkles,
    TrendingUp, Zap, Trophy, Crown, Target, ChevronRight,
    Building2, BarChart3, Medal, Gift, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEducationStore } from '../../../store/educationStore';
import Dollhouse2D from './Dollhouse2D';
import IsometricGrid from './IsometricGrid';
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
import CoinIcon from '../../../components/ui/CoinIcon';
import { SHOP_ITEMS, SKILLS_DB } from '../../../data/constants';
import { calculatePropertyIncome } from '../../../store/slices/realEstateSlice';
import { INITIAL_PROPERTIES } from '../../venture/data/properties';
import { SkillTreeView } from '../../skills/components/SkillTreeView';
import { KamiExperimentLab } from '../../innovation/components/KamiExperimentLab';
import { FlaskConical } from 'lucide-react';

type HQTab = 'empire' | 'builder' | 'skills' | 'lab' | 'missions';

const TABS: { id: HQTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'empire',   label: 'My Empire',  icon: <Crown size={16} />,        color: 'from-amber-500 to-yellow-400' },
    { id: 'builder',  label: 'HQ Builder', icon: <Building2 size={16} />,    color: 'from-indigo-500 to-blue-500' },
    { id: 'skills',   label: 'Skill Tree', icon: <Zap size={16} />,          color: 'from-violet-500 to-purple-500' },
    { id: 'lab',      label: "Kami's Lab", icon: <FlaskConical size={16} />, color: 'from-emerald-500 to-teal-500' },
    { id: 'missions', label: 'Missions',   icon: <Target size={16} />,       color: 'from-amber-500 to-rose-500' },
];

const THEMES: Record<string, string> = {
    'hq_garage':  'from-slate-800 via-gray-800 to-zinc-900',
    'hq_office':  'from-blue-600 via-cyan-500 to-teal-500',
    'hq_highrise':'from-indigo-700 via-purple-600 to-pink-600',
    'hq_island':  'from-teal-500 via-emerald-500 to-green-600',
};
const CUSTOM_THEMES: Record<string, string> = {
    blue:   'from-blue-700 via-indigo-700 to-purple-800',
    gold:   'from-yellow-600 via-amber-600 to-orange-700',
    modern: 'from-slate-800 via-zinc-800 to-gray-900',
};

const getRankTitle = (level: number, t: any) => {
    if (level < 3)  return { title: t('hq.ranks.intern', { defaultValue: 'Intern' }),         emoji: '🌱' };
    if (level < 6)  return { title: t('hq.ranks.entrepreneur', { defaultValue: 'Entrepreneur' }),   emoji: '💡' };
    if (level < 10) return { title: t('hq.ranks.hustler', { defaultValue: 'Hustler' }),        emoji: '🔥' };
    if (level < 15) return { title: t('hq.ranks.founder', { defaultValue: 'Founder' }),        emoji: '🚀' };
    if (level < 25) return { title: t('hq.ranks.tycoon', { defaultValue: 'Tycoon' }),         emoji: '💎' };
    if (level < 40) return { title: t('hq.ranks.mogul', { defaultValue: 'Mogul' }),          emoji: '👑' };
    return               { title: t('hq.ranks.legend', { defaultValue: 'Legend' }),           emoji: '🏆' };
};

const Headquarters: React.FC = () => {
    const { user, upgradeHQ, updateUser } = useAppStore();
    const { t } = useTranslation();

    const [isShopOpen,       setIsShopOpen]       = useState(false);
    const [showBusinessPlan, setShowBusinessPlan] = useState(false);
    const [viewMode,         setViewMode]         = useState<'2D' | 'ISO'>('ISO');
    const [activeTab,        setActiveTab]        = useState<HQTab>('empire');

    // ── Economy stores ──────────────────────────────────────────────────────
    const classrooms  = useEducationStore(state => state.classrooms);
    const users       = useAppStore(state => state.users);

    if (!user) return null;

    // ── HQ level logic ──────────────────────────────────────────────────────
    const hqIndex         = HQ_LEVELS.findIndex(h => h.id === user.hqLevel);
    const currentLevelIndex = hqIndex === -1 ? 0 : hqIndex;
    const currentLevel    = HQ_LEVELS[currentLevelIndex] || HQ_LEVELS[0];
    const nextLevel       = HQ_LEVELS[currentLevelIndex + 1];

    // ── Subscription ────────────────────────────────────────────────────────
    const isIntern        = user.subscriptionTier === 'intern';
    const activeSchoolBypass = hasSchoolBypass(user, classrooms, users);
    const isFounderPlus   = !isIntern || user.role === 'ADMIN' || activeSchoolBypass;
    const isTycoon        = user.subscriptionTier === 'tycoon';

    // ── Background ──────────────────────────────────────────────────────────
    let bgGradient = THEMES[currentLevel?.id] || 'from-gray-700 to-gray-900';
    if (isFounderPlus && user.hqTheme && CUSTOM_THEMES[user.hqTheme]) {
        bgGradient = CUSTOM_THEMES[user.hqTheme];
    }

    const handleCustomize = () => {
        const themes: ('blue' | 'gold' | 'modern')[] = ['blue', 'gold', 'modern'];
        const currentTheme = user.hqTheme || 'blue';
        const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        updateUser(user.id, { hqTheme: themes[nextIndex] });
    };

    // ── Empire Value ────────────────────────────────────────────────────────
    const empireValue = useMemo(() => {
        const cash = user.ppTokens || 0;
        const hqVal = HQ_LEVELS.reduce((acc, level, idx) => {
            if (idx <= currentLevelIndex) return acc + level.cost;
            return acc;
        }, 0) + 1000;
        const inventoryVal = (user.inventory || []).reduce((acc, itemId) => {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            return acc + (item ? item.cost : 0);
        }, 0);
        const skillsVal = (user.unlockedSkills || []).reduce((acc, skillId) => {
            const skill = SKILLS_DB.find(s => s.id === skillId);
            return acc + (skill ? skill.cost : 0);
        }, 0);
        return cash + hqVal + inventoryVal + skillsVal;
    }, [user, currentLevelIndex]);

    // ── Rank ────────────────────────────────────────────────────────────────
    const rank = getRankTitle(user.level || 1, t);

    // ── Passive income (from real-estate properties) ────────────────────────
    const passiveIncome = useMemo(() => {
        if (!user.properties?.length) return 0;
        return user.properties.reduce((acc, p) => {
            const base = INITIAL_PROPERTIES.find(b => b.id === p.propertyId);
            if (!base) return acc;
            const daily = calculatePropertyIncome(base, p.level ?? 1, p.renovationLevel ?? 0);
            return acc + Math.round(daily / 24);
        }, 0);
    }, [user.properties]);

    // ── XP progress ─────────────────────────────────────────────────────────
    const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000];
    const safeLevel = typeof user.level === 'number' ? user.level : 1;
    const safeXP    = typeof user.xp    === 'number' ? user.xp    : 0;
    const basePrev  = LEVEL_THRESHOLDS[safeLevel - 1] || 0;
    const baseNext  = LEVEL_THRESHOLDS[safeLevel]     || safeXP * 1.5;
    const xpPercent = Math.min(100, Math.max(0, ((safeXP - basePrev) / (baseNext - basePrev)) * 100));

    return (
        <div className="pb-28 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

            {/* ══ EMPIRE IDENTITY BANNER ══════════════════════════════════════ */}
            <div className="relative overflow-hidden">
                {/* Dynamic bg gradient matching HQ level */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
                {/* Dot-grid pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

                <div className="relative z-10 px-4 pt-6 pb-0">
                    {/* Top row: Avatar + Identity */}
                    <div className="flex items-center gap-4 mb-5">
                        {/* Avatar ring */}
                        <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-full border-[3px] border-amber-400 bg-amber-900/30 flex items-center justify-center shadow-2xl shadow-amber-500/40">
                                <span className="text-3xl">{user.avatar || '🦉'}</span>
                            </div>
                            {/* Level badge */}
                            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-2 border-slate-900 shadow-sm">
                                LVL {user.level || 1}
                            </div>
                        </div>

                        {/* Name + rank */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-lg">{rank.emoji}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/90">{rank.title}</span>
                            </div>
                            <h1 className="text-xl font-black text-white leading-tight truncate">
                                {user.name || t('hq.fallback_name', { defaultValue: 'Young Entrepreneur' })}
                            </h1>
                            <div className="text-[10px] font-bold text-white/50 mt-0.5 truncate">
                                {user.badges?.slice(-1)[0] || t('hq.fallback_badge', { defaultValue: 'Rising Tycoon' })}
                            </div>
                        </div>

                        {/* Empire Value (dominant) */}
                        <div className="flex-shrink-0 text-right">
                            <div className="text-[8px] font-black uppercase tracking-widest text-amber-400/70 mb-0.5">{t('map.hud_empire_value', { defaultValue: 'Empire Value' }).toUpperCase()}</div>
                            <motion.div
                                key={empireValue}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)] leading-none"
                            >
                                ${empireValue.toLocaleString()}
                            </motion.div>
                        </div>
                    </div>

                    {/* XP Progress bar */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/50">
                                {t('hq.xp_progress', { defaultValue: 'XP Progress — Level' })} {safeLevel}
                            </span>
                            <span className="text-[9px] font-bold text-white/40">{safeXP.toLocaleString()} XP</span>
                        </div>
                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                            />
                        </div>
                    </div>

                    {/* ── STATS ROW ─────────────────────────────────────────── */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                        {/* P Tokens */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/10 flex flex-col justify-between items-center">
                            <CoinIcon size={20} className="mb-0.5" />
                            <div className="text-[10px] font-black text-yellow-300">{(user.ppTokens || 0).toLocaleString()}</div>
                            <div className="text-[7px] font-bold uppercase text-white/40 tracking-wider">{t('hq.stat_tokens', { defaultValue: 'Tokens' }).toUpperCase()}</div>
                        </div>
                        {/* Passive Income */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/10">
                            <div className="text-lg mb-0.5">📈</div>
                            <div className="text-[10px] font-black text-emerald-300">+{passiveIncome}/hr</div>
                            <div className="text-[7px] font-bold uppercase text-white/40 tracking-wider">{t('hq.stat_income', { defaultValue: 'Income' }).toUpperCase()}</div>
                        </div>
                        {/* Daily Streak */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/10">
                            <div className="text-lg mb-0.5">🔥</div>
                            <div className="text-[10px] font-black text-orange-300">{user.streak || 0} {t('stats.days', { defaultValue: 'days' })}</div>
                            <div className="text-[7px] font-bold uppercase text-white/40 tracking-wider">{t('hq.stat_streak', { defaultValue: 'Streak' }).toUpperCase()}</div>
                        </div>
                        {/* Badges */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-white/10">
                            <div className="text-lg mb-0.5">🏅</div>
                            <div className="text-[10px] font-black text-purple-300">{user.badges?.length || 0}</div>
                            <div className="text-[7px] font-bold uppercase text-white/40 tracking-wider">{t('hq.stat_badges', { defaultValue: 'Badges' }).toUpperCase()}</div>
                        </div>
                    </div>

                    {/* ── 4-TAB NAVIGATION ──────────────────────────────────── */}
                    <div className="flex gap-1.5 pb-0">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-t-2xl font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer border-b-0
                                    ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-inner'
                                        : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80'}
                                `}
                            >
                                <span className={activeTab === tab.id ? 'text-amber-400' : 'text-white/40'}>{tab.icon}</span>
                                {t(`hq.tab_${tab.id}` as any, { defaultValue: tab.label })}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ TAB CONTENT ════════════════════════════════════════════════ */}
            <div className="bg-slate-900 min-h-screen">
                <AnimatePresence mode="wait">

                    {/* ━━━━ MY EMPIRE TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {activeTab === 'empire' && (
                        <motion.div
                            key="empire"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className="px-4 pt-5 space-y-4"
                        >
                            {/* Empire Value card */}
                            <div className="bg-gradient-to-br from-amber-900/60 to-yellow-900/40 rounded-3xl p-4 border border-amber-500/30 relative overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-amber-400/70 mb-1">{t('hq.empire_net_worth', { defaultValue: 'Total Empire Net Worth' }).toUpperCase()}</div>
                                    <div className="text-3xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-3">
                                        ${empireValue.toLocaleString()}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-black/30 rounded-xl p-2 text-center">
                                            <div className="text-[8px] text-white/40 uppercase font-bold">{t('hq.empire_cash', { defaultValue: 'Cash' }).toUpperCase()}</div>
                                            <div className="text-[11px] font-black text-yellow-300">${(user.ppTokens || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-2 text-center">
                                            <div className="text-[8px] text-white/40 uppercase font-bold">{t('hq.empire_items', { defaultValue: 'Items' }).toUpperCase()}</div>
                                            <div className="text-[11px] font-black text-purple-300">{user.inventory?.length || 0}</div>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-2 text-center">
                                            <div className="text-[8px] text-white/40 uppercase font-bold">{t('hq.empire_skills_count', { defaultValue: 'Skills' }).toUpperCase()}</div>
                                            <div className="text-[11px] font-black text-blue-300">{user.unlockedSkills?.length || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Franchise / Passive Income Engine */}
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60">
                                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                                        <TrendingUp size={14} className="text-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">{t('hq.passive_income_engine', { defaultValue: 'Passive Income Engine' }).toUpperCase()}</span>
                                </div>
                                <div className="px-4 pb-4">
                                    <FranchisePanel />
                                </div>
                            </div>

                            {/* Portfolio Analysis */}
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60">
                                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                                        <BarChart3 size={14} className="text-blue-400" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">{t('hq.portfolio_analysis', { defaultValue: 'Portfolio Analysis' }).toUpperCase()}</span>
                                </div>
                                <div className="px-4 pb-4">
                                    <PortfolioAnalysis />
                                </div>
                            </div>

                            {/* Collectibles preview */}
                            {(user.unlockedCollectibles?.length || 0) > 0 && (
                                <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Gift size={15} className="text-pink-400" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-pink-400">{t('hq.collectibles_label', { defaultValue: 'Collectibles' })}</span>
                                        <span className="ml-auto text-[10px] font-bold text-white/40">{user.unlockedCollectibles?.length || 0} {t('hq.collectibles_earned', { defaultValue: 'earned' })}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {(user.unlockedCollectibles || []).slice(0, 8).map(id => (
                                            <div key={id} className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-xl">
                                                🎁
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Furniture inventory */}
                            {user.inventory?.length > 0 && (
                                <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Package size={15} className="text-purple-400" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">{t('hq.my_furniture_label', { defaultValue: 'My Furniture' })}</span>
                                        <span className="ml-auto text-[10px] font-bold text-white/40">{user.inventory.length} {t('hq.empire_items', { defaultValue: 'items' })}</span>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {user.inventory
                                            .map((itemId: string) => FURNITURE_ITEMS.find(f => f.id === itemId))
                                            .filter(Boolean)
                                            .slice(0, 10)
                                            .map((item, i) => (
                                                <div
                                                    key={`${item!.id}-${i}`}
                                                    className="flex-shrink-0 bg-purple-500/10 border border-purple-400/20 rounded-xl p-2.5 text-center min-w-[72px]"
                                                    draggable
                                                    onDragStart={e => e.dataTransfer.setData('furniture', JSON.stringify(item))}
                                                >
                                                    <div className="text-2xl mb-1">{item!.icon}</div>
                                                    <div className="text-[8px] font-bold text-white/60 truncate max-w-[60px]">{item!.name}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* HQ Showcase */}
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60 p-4">
                                <HQShowcase />
                            </div>

                            {/* Seasonal Event */}
                            <SeasonalEventBanner />
                        </motion.div>
                    )}

                    {/* ━━━━ HQ BUILDER TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {activeTab === 'builder' && (
                        <motion.div
                            key="builder"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className="px-4 pt-5 space-y-4"
                        >
                            {/* Current HQ info */}
                            <div className={`rounded-3xl p-4 bg-gradient-to-br ${bgGradient} border border-white/20 relative overflow-hidden`}>
                                <div className="absolute -right-6 -bottom-6 text-[80px] opacity-10 pointer-events-none select-none">🏢</div>
                                <div className="relative z-10 flex items-center gap-3 mb-3">
                                    <div className="text-3xl">{currentLevel.icon}</div>
                                    <div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-white/60">{t('hq.current_hq', { defaultValue: 'Current HQ' }).toUpperCase()}</div>
                                        <div className="text-lg font-black text-white leading-tight">
                                            {t(`hq_levels.${currentLevel.id}.name` as any, { defaultValue: currentLevel.name })}
                                        </div>
                                    </div>
                                    {nextLevel && (
                                        <div className="ml-auto text-right">
                                            <div className="text-[8px] font-black text-white/50 uppercase">{t('hq.next_label', { defaultValue: 'Next' }).toUpperCase()}</div>
                                            <div className="text-[10px] font-black text-amber-300">{nextLevel.name}</div>
                                            <div className="text-[9px] font-bold text-yellow-400">${nextLevel.cost.toLocaleString()}</div>
                                        </div>
                                    )}
                                </div>
                                {nextLevel && (
                                    <button
                                        onClick={() => upgradeHQ(nextLevel.id)}
                                        disabled={user.ppTokens < nextLevel.cost}
                                        className={`w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
                                            ${user.ppTokens >= nextLevel.cost
                                                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-lg shadow-amber-500/40 hover:scale-[1.02]'
                                                : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                                    >
                                        {user.ppTokens >= nextLevel.cost
                                            ? <><ArrowUpCircle size={16} /> {t('hq.upgrade_to', { defaultValue: 'Upgrade to' })} {t(`hq_levels.${nextLevel.id}.name` as any, { defaultValue: nextLevel.name })}</>
                                            : <><Lock size={16} /> {t('hq.need_more', { defaultValue: 'Need {{amount}} more', amount: (nextLevel.cost - user.ppTokens).toLocaleString() })}</>
                                        }
                                    </button>
                                )}
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                                <button
                                    onClick={() => setViewMode('ISO')}
                                    className={`flex-1 py-2 rounded-xl font-black text-xs transition-all cursor-pointer
                                        ${viewMode === 'ISO' ? 'bg-indigo-600 text-white shadow-md' : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {t('hq.view_3d', { defaultValue: '🏗️ 3D Builder' })}
                                </button>
                                <button
                                    onClick={() => setViewMode('2D')}
                                    className={`flex-1 py-2 rounded-xl font-black text-xs transition-all cursor-pointer
                                        ${viewMode === '2D' ? 'bg-indigo-600 text-white shadow-md' : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {t('hq.view_2d', { defaultValue: '🏠 2D View' })}
                                </button>
                            </div>

                            {/* Interactive HQ Canvas */}
                            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${bgGradient} border border-white/20 shadow-2xl`}
                                style={{ height: 380 }}>
                                <div className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    {viewMode === '2D' ? <Dollhouse2D /> : <IsometricGrid />}
                                </div>

                                {/* Theme toggle */}
                                <button
                                    onClick={handleCustomize}
                                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md z-20 shadow-lg
                                        ${isFounderPlus ? 'bg-white/20 hover:bg-white/40 text-white cursor-pointer' : 'bg-gray-900/50 text-red-400 cursor-not-allowed'}`}
                                    title={isFounderPlus ? t('hq.change_theme', { defaultValue: 'Change Theme' }) : t('hq.theme_locked', { defaultValue: 'Locked (Founder Only)' })}
                                >
                                    {isFounderPlus ? <Palette size={20} /> : <Lock size={20} />}
                                </button>

                                {/* Shop button */}
                                <button
                                    onClick={() => setIsShopOpen(true)}
                                    className="absolute bottom-4 right-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-xl border-b-4 border-rose-700 hover:border-b-2 hover:translate-y-0.5 transition-all z-20 flex items-center gap-2 cursor-pointer"
                                >
                                    <ShoppingBag size={14} /> {t('hq.open_shop', { defaultValue: 'Furniture Shop' })}
                                </button>

                                {/* Shop overlay */}
                                <AnimatePresence>
                                    {isShopOpen && (
                                        <motion.div
                                            initial={{ y: '100%' }}
                                            animate={{ y: 0 }}
                                            exit={{ y: '100%' }}
                                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                            className="absolute inset-0 z-50"
                                        >
                                            <button
                                                onClick={() => setIsShopOpen(false)}
                                                className="absolute -top-3 -right-3 z-50 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                <X size={18} />
                                            </button>
                                            <FurnitureShop onClose={() => setIsShopOpen(false)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* HQ Upgrade Path */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 size={16} className="text-indigo-400" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400">{t('hq.upgrade_path_title', { defaultValue: 'HQ Upgrade Path' }).toUpperCase()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {HQ_LEVELS.map((level, index) => {
                                        const isOwned = index <= currentLevelIndex;
                                        const isNext  = index === currentLevelIndex + 1;
                                        const canAfford = isNext && user.ppTokens >= level.cost;

                                        return (
                                            <motion.div
                                                key={level.id}
                                                whileHover={isNext ? { scale: 1.02 } : {}}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all relative overflow-hidden
                                                    ${isOwned ? 'bg-emerald-900/30 border-emerald-500/40' : 'bg-slate-800/60 border-white/10'}
                                                    ${isNext ? 'ring-2 ring-amber-400/60 border-amber-500/60 shadow-lg shadow-amber-500/20' : ''}
                                                `}
                                            >
                                                {isNext && (
                                                    <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[8px] font-black px-2 py-0.5 rounded-bl-xl">
                                                        {t('hq.next_label', { defaultValue: 'NEXT' }).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="text-3xl mb-2">{level.icon}</div>
                                                <div className="text-[11px] font-black text-white mb-1">
                                                    {t(`hq_levels.${level.id}.name` as any, { defaultValue: level.name })}
                                                </div>
                                                {isOwned ? (
                                                    <div className="mt-1 flex items-center gap-1 text-emerald-400 text-[10px] font-black">
                                                        <CheckCircle size={12} /> {t('hq.owned', { defaultValue: 'Owned' })}
                                                    </div>
                                                ) : isNext ? (
                                                    <button
                                                        onClick={() => upgradeHQ(level.id)}
                                                        disabled={!canAfford}
                                                        className={`mt-2 w-full py-1.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all
                                                            ${canAfford
                                                                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-md'
                                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                                    >
                                                        {canAfford ? <ArrowUpCircle size={12} /> : <Lock size={12} />}
                                                        ${level.cost.toLocaleString()}
                                                    </button>
                                                ) : (
                                                    <div className="mt-1 flex items-center gap-1 text-white/30 text-[10px] font-bold">
                                                        <Lock size={12} /> ${level.cost.toLocaleString()}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ━━━━ SKILLS TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {activeTab === 'skills' && (
                        <motion.div
                            key="skills"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className="px-2 pt-3 space-y-4"
                        >
                            <SkillTreeView />
                        </motion.div>
                    )}

                    {/* ━━━━ KAMI'S LAB TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {activeTab === 'lab' && (
                        <motion.div
                            key="lab"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className="px-2 pt-3"
                        >
                            <KamiExperimentLab />
                        </motion.div>
                    )}

                    {/* ━━━━ MISSIONS TAB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                    {activeTab === 'missions' && (
                        <motion.div
                            key="missions"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className="px-4 pt-5 space-y-4"
                        >
                            {/* Streak Banner */}
                            <StreakBanner />

                            {/* Daily Missions */}
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60">
                                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                                    <Target size={15} className="text-emerald-400" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">{t('hq.daily_missions_title', { defaultValue: 'Daily Missions' })}</span>
                                </div>
                                <div className="px-4 pb-4">
                                    <DailyMissions />
                                </div>
                            </div>

                            {/* Weekly Challenge */}
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60">
                                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                                    <Trophy size={15} className="text-amber-400" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">{t('hq.weekly_challenge_title', { defaultValue: 'Weekly Challenge' })}</span>
                                </div>
                                <div className="px-4 pb-4">
                                    <WeeklyChallengeWidget />
                                </div>
                            </div>

                            {/* Badges earned */}
                            {(user.badges?.length || 0) > 0 && (
                                <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-800/60 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Medal size={15} className="text-yellow-400" />
                                        <span className="text-[11px] font-black uppercase tracking-wider text-yellow-400">{String(t('hq.badges_titles', { defaultValue: 'Badges & Titles' })).toUpperCase()}</span>
                                        <span className="ml-auto text-[10px] text-white/40">{user.badges?.length} {t('hq.badges_earned', { defaultValue: 'earned' })}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(user.badges || []).map((badge, i) => (
                                            <span key={i}
                                                className="bg-yellow-500/15 border border-yellow-400/30 text-yellow-300 text-[9px] font-black px-2.5 py-1 rounded-full">
                                                🏅 {badge.replace(/_/g, ' ').replace('district completed', '').trim() || badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default Headquarters;
