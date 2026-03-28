import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../../store';
import { formatCompactNumber } from '../../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Building2, TrendingUp, TrendingDown, DollarSign, Lock, ArrowUp,
    Home, Star, Shield, Zap, Trophy, RefreshCw, Paintbrush, BadgeDollarSign,
    ChevronRight, ChevronLeft, Target, CheckCircle2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Property, UserRole } from '../../../types';
import { calculatePropertyIncome } from '../../../store/slices/realEstateSlice';
import confetti from 'canvas-confetti';
import { useEconomyStore } from "../../../store/economyStore";

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Deterministic weekly market multiplier (0.90–1.10) seeded by prop id + week number */
function getMarketMultiplier(propId: string): number {
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const seed = propId + String(weekNum);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (Math.imul(hash, 31) + seed.charCodeAt(i)) | 0;
    }
    // Unsigned shift avoids negative modulus issues
    return 0.90 + ((hash >>> 0) % 21) / 100;
}

function getPropImage(prop: Property, renovLevel = 0): string {
    const skins = prop.renovationSkins;
    if (!skins || skins.length === 0) return prop.image;
    return skins[Math.min(renovLevel, skins.length - 1)];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
    CITY: 'bg-blue-100   text-blue-700   dark:bg-blue-900   dark:text-blue-300',
    METRO: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    GLOBAL: 'bg-amber-100  text-amber-700  dark:bg-amber-900  dark:text-amber-300',
};
const TIER_ICONS: Record<string, string> = { CITY: '🏙️', METRO: '🌆', GLOBAL: '🌍' };

// Static mock landlords (outside component to avoid recreation on every render)
const STATIC_LANDLORDS = [
    { id: 'l1', name: 'CEO Emma', income: 95000, avatar: '👑' },
    { id: 'l2', name: 'TycoonKid', income: 72000, avatar: '🦁' },
    { id: 'l3', name: 'RealtyRex', income: 61000, avatar: '🦊' },
    { id: 'l4', name: 'PropertyPro', income: 45000, avatar: '🐯' },
];

// ─── Sell Dialog (accessible) ─────────────────────────────────────────────────
const SellDialog: React.FC<{
    prop: Property;
    refund: number;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ prop, refund, onConfirm, onCancel }) => (
    <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-dialog-title"
        onClick={onCancel}
    >
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl max-w-xs w-full"
            onClick={e => e.stopPropagation()}
        >
            <div className="text-5xl text-center mb-3" aria-hidden="true">{prop.image}</div>
            <h3 id="sell-dialog-title" className="text-xl font-black text-center text-gray-900 dark:text-white mb-2">
                Sell Property?
            </h3>
            <p className="text-gray-500 text-sm text-center mb-1">
                You'll receive <span className="font-bold text-green-600">${refund.toLocaleString()}</span> (60% of cost)
            </p>
            <p className="text-gray-400 text-xs text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
                {/* autoFocus cancel so keyboard/screen-reader lands here first */}
                <button
                    autoFocus
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Keep It
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 motion-safe:active:scale-95 transition-all"
                >
                    Sell 💰
                </button>
            </div>
        </motion.div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RealEstateApp: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useAppStore(s => s.user);
    const buyProperty = useEconomyStore(s => s.buyProperty);
    const upgradeProperty = useEconomyStore(s => s.upgradeProperty);
    const collectRent = useEconomyStore(s => s.collectRent);
    const collectAllRent = useEconomyStore(s => s.collectAllRent);
    const sellProperty = useEconomyStore(s => s.sellProperty);
    const renovateProperty = useEconomyStore(s => s.renovateProperty);
    const toggleInsurance = useEconomyStore(s => s.toggleInsurance);
    const applyTenantEvent = useEconomyStore(s => s.applyTenantEvent);
    const availableProperties = useEconomyStore(s => s.availableProperties) ?? [];

    const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'CHALLENGES'>('PORTFOLIO');
    const [sellTarget, setSellTarget] = useState<string | null>(null);
    const [collectCount, setCollectCount] = useState(0);
    const [boughtToday, setBoughtToday] = useState(false);
    const [maxedToday, setMaxedToday] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    if (!user) return null;

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // ── O(n) map — avoids N+1 pattern on portfolio renders ──
    const userPropMap = useMemo(() => {
        const map = new Map<string, typeof user.properties[number]>();
        (user.properties ?? []).forEach(p => map.set(p.propertyId, p));
        return map;
    }, [user.properties]);

    // ── Derived lists (memoized) ──
    const ownedPropertyIds = useMemo(
        () => new Set((user.properties ?? []).map(p => p.propertyId)),
        [user.properties]
    );
    const ownedProperties = useMemo(
        () => availableProperties.filter(p => ownedPropertyIds.has(p.id)),
        [availableProperties, ownedPropertyIds]
    );
    const marketProperties = useMemo(
        () => availableProperties.filter(p => !ownedPropertyIds.has(p.id)),
        [availableProperties, ownedPropertyIds]
    );

    // ── Portfolio summary (memoized) ──
    const { totalDailyIncome, totalPortfolioValue } = useMemo(() => {
        let totalDailyIncome = 0;
        let totalPortfolioValue = 0;
        for (const prop of ownedProperties) {
            const up = userPropMap.get(prop.id);
            if (up) totalDailyIncome += calculatePropertyIncome(prop, up.level, up.renovationLevel);
            totalPortfolioValue += prop.cost;
        }
        return { totalDailyIncome, totalPortfolioValue };
    }, [ownedProperties, userPropMap]);

    // ── Apply tenant events with stable reference ──
    useEffect(() => {
        ownedPropertyIds.forEach(id => applyTenantEvent(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Array.from(ownedPropertyIds).join(',')]);
    // ^ Intentional: stringify the Set to get a stable primitive dep

    // ── Memoized leaderboard (user income changes but static entries don't) ──
    const landlords = useMemo(() => [
        ...STATIC_LANDLORDS,
        { id: 'you', name: user.name || 'You', income: totalDailyIncome, avatar: '⭐', isYou: true },
    ].sort((a, b) => b.income - a.income).slice(0, 5), [totalDailyIncome, user.name]);

    const challenges = useMemo(() => [
        { id: 'collect_3', label: t('real_estate.challenge_collect_3'), done: collectCount >= 3, xp: 50 },
        { id: 'buy_1', label: t('real_estate.challenge_buy_1'), done: boughtToday, xp: 100 },
        { id: 'max_upgrade', label: t('real_estate.challenge_max_upgrade'), done: maxedToday, xp: 150 },
    ], [collectCount, boughtToday, maxedToday, t]);

    // Snapshot today's date string once per render (not per card)
    const todayStr = new Date().toISOString().slice(0, 10);

    // ── Handlers ──
    const handleCollect = (propId: string, pendingAmt: number) => {
        const result = collectRent(propId);
        if (result.success && pendingAmt > 0) {
            setCollectCount(c => c + 1);
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 }, colors: ['#22c55e', '#fbbf24'] });
        } else if (!result.success) {
            showToast(result.error);
        }
    };

    const handleCollectAll = () => {
        const readyCount = ownedProperties.filter(prop => {
            const up = userPropMap.get(prop.id);
            if (!up) return false;
            const diffMin = (Date.now() - new Date(up.lastCollected).getTime()) / 60_000;
            const pending = Math.floor((calculatePropertyIncome(prop, up.level, up.renovationLevel) / (24 * 60)) * Math.min(diffMin, 1440));
            return pending > 0;
        }).length;

        collectAllRent();
        if (readyCount > 0) {
            setCollectCount(c => c + readyCount);
            confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 }, colors: ['#22c55e', '#fbbf24', '#6366f1'] });
        }
    };

    const handleBuy = (id: string) => {
        const result = buyProperty(id);
        if (result.success) {
            setBoughtToday(true);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 }, colors: ['#3b82f6', '#6366f1'] });
        } else {
            showToast(result.error);
        }
    };

    const handleUpgrade = (propId: string) => {
        const result = upgradeProperty(propId);
        if (result.success) {
            // Check if we just hit max level
            const after = userPropMap.get(propId);
            const base = availableProperties.find(p => p.id === propId);
            if (after && base && after.level >= base.maxLevel) setMaxedToday(true);
        } else {
            showToast(result.error);
        }
    };

    const handleSell = () => {
        if (!sellTarget) return;
        const result = sellProperty(sellTarget);
        if (!result.success) showToast(result.error);
        setSellTarget(null);
    };

    const handleRenovate = (id: string) => {
        const result = renovateProperty(id);
        if (result.success) {
            confetti({ particleCount: 30, spread: 40, origin: { y: 0.5 }, colors: ['#ec4899', '#a855f7'] });
        } else {
            showToast(result.error);
        }
    };

    const handleInsurance = (id: string) => {
        const result = toggleInsurance(id);
        if (!result.success) showToast(result.error);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 p-4 md:p-6 overflow-hidden">

            {/* ── Toast Notification (replaces alert()) ── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        role="alert" aria-live="polite"
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold max-w-sm text-center"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="mb-2">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-sm transition-colors w-fit mb-2"
                >
                    <ChevronLeft className="w-5 h-5" /> {t('common.back', 'Back to Dashboard')}
                </button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-blue-500" aria-hidden="true" />
                        {t('real_estate.title', 'Real Estate Tycoon')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t('real_estate.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    {ownedProperties.length > 0 && (
                        <button
                            onClick={handleCollectAll}
                            aria-label={t('real_estate.collect_all', 'Collect all rent')}
                            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl font-bold text-sm shadow-md shadow-green-500/30 motion-safe:active:scale-95 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">{t('real_estate.collect_all')}</span>
                        </button>
                    )}
                    <div
                        className="bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-yellow-200 dark:border-yellow-700"
                        aria-label={`Balance: ${user.bizCoins.toLocaleString()} BizCoins`}
                    >
                        <DollarSign className="w-4 h-4 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                        <span className="font-bold text-yellow-800 dark:text-yellow-200">{formatCompactNumber(user.bizCoins)}</span>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1" role="tablist">
                {(['PORTFOLIO', 'MARKET', 'CHALLENGES'] as const).map(tab => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === tab
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab === 'PORTFOLIO' ? `${t('real_estate.portfolio')} (${ownedProperties.length})`
                            : tab === 'MARKET' ? `${t('real_estate.market')} (${marketProperties.length})`
                                : t('real_estate.challenges')}
                    </button>
                ))}
            </div>

            {/* ── Content Area ── */}
            <div className="flex-1 overflow-y-auto pb-6">
                <AnimatePresence mode="wait">

                    {/* ══════════ PORTFOLIO TAB ══════════ */}
                    {activeTab === 'PORTFOLIO' && (
                        <motion.div key="portfolio" role="tabpanel" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                            {ownedProperties.length > 0 && (
                                <div
                                    className="grid grid-cols-3 gap-3 mb-5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/30"
                                    aria-label="Portfolio summary"
                                >
                                    <div className="text-center">
                                        <p className="text-xs opacity-75 uppercase font-bold">Properties</p>
                                        <p className="text-2xl font-black">{ownedProperties.length}</p>
                                    </div>
                                    <div className="text-center border-x border-white/20">
                                        <p className="text-xs opacity-75 uppercase font-bold">{t('real_estate.total_income')}</p>
                                        <p className="text-2xl font-black">${formatCompactNumber(totalDailyIncome)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs opacity-75 uppercase font-bold">{t('real_estate.total_value')}</p>
                                        <p className="text-2xl font-black">${formatCompactNumber(totalPortfolioValue)}</p>
                                    </div>
                                </div>
                            )}

                            {ownedProperties.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
                                    <p className="text-xl font-bold">No properties yet</p>
                                    <p className="text-sm mt-1">Head to the Market to buy your first one!</p>
                                    <button
                                        onClick={() => setActiveTab('MARKET')}
                                        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 flex items-center gap-2 mx-auto"
                                    >
                                        Browse Market <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {ownedProperties.map(prop => {
                                        // ✅ FIX: O(1) map lookup instead of O(n) find per card
                                        const userProp = userPropMap.get(prop.id);
                                        if (!userProp) return null; // Guard against data inconsistency

                                        const isMaxLevel = userProp.level >= prop.maxLevel;
                                        const renovLevel = userProp.renovationLevel ?? 0;
                                        const maxRenovLevel = Math.max(0, (prop.renovationSkins?.length ?? 1) - 1);
                                        const income = calculatePropertyIncome(prop, userProp.level, renovLevel);
                                        const nextIncome = calculatePropertyIncome(prop, userProp.level + 1, renovLevel);
                                        const upgradeCost = Math.floor(prop.cost * 0.5 * userProp.level);
                                        const renovCost = Math.floor(prop.cost * 0.2);
                                        const insuranceCost = Math.floor(prop.cost * 0.15);
                                        const refundAmount = Math.floor(prop.cost * 0.6);
                                        const propImage = getPropImage(prop, renovLevel);
                                        const canAffordUpgrade = user.bizCoins >= upgradeCost;
                                        const canAffordRenov = user.bizCoins >= renovCost;
                                        const canAffordInsurance = user.bizCoins >= insuranceCost;

                                        // ✅ FIX: use memoized todayStr, not new Date() per card
                                        const diffMinutes = (Date.now() - new Date(userProp.lastCollected).getTime()) / 60_000;
                                        const pendingEarnings = Math.floor((income / (24 * 60)) * Math.min(diffMinutes, 1440));
                                        const isReady = pendingEarnings > 0;

                                        return (
                                            <article
                                                key={prop.id}
                                                aria-label={`Property: ${prop.name}`}
                                                className={`bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border relative flex flex-col gap-3 ${isMaxLevel ? 'border-yellow-300 dark:border-yellow-600' : 'border-gray-100 dark:border-gray-700'}`}
                                            >
                                                {isMaxLevel && (
                                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow" aria-label="Maximum level reached">
                                                        <Star className="w-3 h-3 fill-white" aria-hidden="true" /> MAX
                                                    </div>
                                                )}
                                                {userProp.hasInsurance && (
                                                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow" aria-label="Property insured">
                                                        <Shield className="w-3 h-3 fill-white" aria-hidden="true" /> Insured
                                                    </div>
                                                )}

                                                {/* Tenant Event Banner */}
                                                {userProp.tenantEvent?.date === todayStr && (
                                                    <div
                                                        role="status"
                                                        aria-live="polite"
                                                        className={`rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-bold ${userProp.tenantEvent.type === 'BONUS'
                                                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                            }`}
                                                    >
                                                        <span aria-hidden="true">{userProp.tenantEvent.type === 'BONUS' ? '🎉' : '⚠️'}</span>
                                                        <span>{userProp.tenantEvent.type === 'BONUS' ? 'Bonus: ' : 'Issue: '}{userProp.tenantEvent.description}</span>
                                                        <span className="ml-auto font-black tabular-nums">
                                                            {userProp.tenantEvent.type === 'BONUS' ? '+' : '-'}${userProp.tenantEvent.amount}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Header */}
                                                <div className="flex items-center gap-3">
                                                    <div className="text-4xl bg-gray-50 dark:bg-gray-700 rounded-2xl w-[60px] h-[60px] flex items-center justify-center shrink-0" aria-hidden="true">
                                                        {propImage}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                                            {t(`real_estate.properties.${prop.id}.name` as any)}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-bold">
                                                                Lv{userProp.level}
                                                            </span>
                                                            {prop.tier && (
                                                                <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${TIER_COLORS[prop.tier]}`}>
                                                                    {TIER_ICONS[prop.tier]} {t(`real_estate.tier_${prop.tier.toLowerCase()}` as any)}
                                                                </span>
                                                            )}
                                                            {/* Level progress dots */}
                                                            <div className="flex gap-0.5" aria-label={`Level ${userProp.level} of ${prop.maxLevel}`}>
                                                                {Array.from({ length: Math.min(prop.maxLevel, 10) }).map((_, i) => (
                                                                    <div key={i} className={`w-2 h-2 rounded-full ${i < Math.min(userProp.level, 10) ? (isMaxLevel ? 'bg-yellow-400' : 'bg-blue-500') : 'bg-gray-200 dark:bg-gray-600'}`} />
                                                                ))}
                                                                {prop.maxLevel > 10 && <span className="text-xs text-gray-400">/{prop.maxLevel}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase font-bold">{t('real_estate.daily_income')}</p>
                                                        <p className="font-bold text-green-600 dark:text-green-400 tabular-nums">${income.toLocaleString()}</p>
                                                        {!isMaxLevel && (
                                                            <p className="text-xs text-blue-500">→ ${nextIncome.toLocaleString()} after upgrade</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase font-bold">{t('real_estate.pending')}</p>
                                                        <p className={`font-bold tabular-nums ${isReady ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                                                            ${pendingEarnings.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleCollect(prop.id, pendingEarnings)}
                                                        disabled={!isReady}
                                                        aria-label={isReady ? `Collect $${pendingEarnings} from ${prop.name}` : 'No rent to collect yet'}
                                                        className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${isReady ? 'bg-green-500 hover:bg-green-600 text-white shadow-md motion-safe:active:scale-95' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                                    >
                                                        <DollarSign className="w-4 h-4" aria-hidden="true" /> {t('real_estate.collect')}
                                                    </button>

                                                    {isMaxLevel ? (
                                                        <div className="py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 font-bold">
                                                            <Star className="w-4 h-4 fill-current" aria-hidden="true" /> Maxed!
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpgrade(prop.id)}
                                                            disabled={!canAffordUpgrade}
                                                            aria-label={canAffordUpgrade ? `Upgrade ${prop.name} for $${upgradeCost}` : `Need $${(upgradeCost - user.bizCoins).toLocaleString()} more to upgrade`}
                                                            className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${canAffordUpgrade ? 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 motion-safe:active:scale-95' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-600'}`}
                                                        >
                                                            <ArrowUp className="w-4 h-4" aria-hidden="true" /> ${upgradeCost.toLocaleString()}
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleRenovate(prop.id)}
                                                        disabled={renovLevel >= maxRenovLevel || !canAffordRenov}
                                                        aria-label={renovLevel >= maxRenovLevel ? 'Fully renovated' : `Renovate for $${renovCost}`}
                                                        className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${renovLevel >= maxRenovLevel ? 'bg-pink-50 dark:bg-pink-900/20 border border-pink-200 text-pink-500 cursor-default' : canAffordRenov ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-md motion-safe:active:scale-95' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                                    >
                                                        <Paintbrush className="w-4 h-4" aria-hidden="true" />
                                                        {renovLevel >= maxRenovLevel ? 'Renovated' : `Renovate $${renovCost.toLocaleString()}`}
                                                    </button>

                                                    <button
                                                        onClick={() => handleInsurance(prop.id)}
                                                        disabled={!userProp.hasInsurance && !canAffordInsurance}
                                                        aria-label={userProp.hasInsurance ? 'Cancel insurance' : canAffordInsurance ? `Buy insurance for $${insuranceCost}` : `Need $${(insuranceCost - user.bizCoins).toLocaleString()} more for insurance`}
                                                        className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${userProp.hasInsurance ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md motion-safe:active:scale-95' : canAffordInsurance ? 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 motion-safe:active:scale-95' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                                    >
                                                        <Shield className="w-4 h-4" aria-hidden="true" />
                                                        {userProp.hasInsurance ? 'Insured ✓' : `Insure $${insuranceCost.toLocaleString()}`}
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => setSellTarget(prop.id)}
                                                    aria-label={`Sell ${prop.name} for $${refundAmount.toLocaleString()}`}
                                                    className="w-full py-2 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900 transition-all flex items-center justify-center gap-1.5"
                                                >
                                                    <BadgeDollarSign className="w-4 h-4" aria-hidden="true" /> {t('real_estate.sell')} (${refundAmount.toLocaleString()})
                                                </button>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ══════════ MARKET TAB ══════════ */}
                    {activeTab === 'MARKET' && (
                        <motion.div key="market" role="tabpanel" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {marketProperties.length === 0 && (
                                <div className="col-span-full text-center py-20 text-gray-400">
                                    <Home className="w-16 h-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
                                    <p className="text-xl font-bold">You own everything!</p>
                                    <p className="text-sm mt-1">Check your Portfolio to manage your empire.</p>
                                </div>
                            )}
                            {marketProperties.map(prop => {
                                const isLocked = user.level < prop.reqLevel && user.role !== UserRole.ADMIN;
                                const mult = getMarketMultiplier(prop.id);
                                const isHot = mult >= 1.05;
                                const isCold = mult <= 0.95;
                                const canAfford = user.bizCoins >= prop.cost;

                                return (
                                    <article key={prop.id} aria-label={`${prop.name} listing`}
                                        className={`bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col gap-4 ${isLocked ? 'opacity-70 grayscale' : ''}`}>
                                        {prop.tier && (
                                            <div className={`absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${TIER_COLORS[prop.tier]}`}>
                                                {TIER_ICONS[prop.tier]} {t(`real_estate.tier_${prop.tier.toLowerCase()}` as any)}
                                            </div>
                                        )}
                                        {/* ✅ FIX: text labels always visible for colorblind users, icon is decorative */}
                                        {(isHot || isCold) && (
                                            <div className={`absolute top-10 right-4 flex items-center gap-0.5 text-[10px] font-bold ${isHot ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                                {isHot ? <TrendingUp className="w-3 h-3" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" aria-hidden="true" />}
                                                <span>{isHot ? 'Hot Market' : 'Slow Market'}</span>
                                            </div>
                                        )}

                                        <div className="text-6xl text-center bg-gray-50 dark:bg-gray-700 rounded-2xl py-7" aria-hidden="true">{prop.image}</div>

                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(`real_estate.properties.${prop.id}.name` as any)}</h3>
                                                <span className="text-xs uppercase font-bold text-gray-400">{t(`real_estate.types.${prop.type}` as any)}</span>
                                            </div>
                                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${isHot ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" /> +{Math.floor(prop.initialIncome * mult)}/d
                                            </div>
                                        </div>

                                        <p className="text-gray-500 dark:text-gray-400 text-sm min-h-[36px]">{t(`real_estate.properties.${prop.id}.desc` as any)}</p>

                                        {isLocked ? (
                                            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl py-3 text-center text-gray-500 flex items-center justify-center gap-2 font-bold">
                                                <Lock className="w-4 h-4" aria-hidden="true" /> {t('real_estate.lvl_required', { level: prop.reqLevel })}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                                                    <span className="text-yellow-500 mr-1" aria-hidden="true">$</span>{prop.cost.toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={() => handleBuy(prop.id)}
                                                    disabled={!canAfford}
                                                    aria-label={canAfford ? `Buy ${prop.name} for $${prop.cost.toLocaleString()}` : `Need $${(prop.cost - user.bizCoins).toLocaleString()} more to buy ${prop.name}`}
                                                    className={`px-5 py-2.5 rounded-xl font-bold shadow-lg motion-safe:active:scale-95 transition-all ${canAfford ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    {canAfford ? t('real_estate.buy_now') : 'Need more $'}
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* ══════════ CHALLENGES TAB ══════════ */}
                    {activeTab === 'CHALLENGES' && (
                        <motion.div key="challenges" role="tabpanel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">

                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-orange-500" aria-hidden="true" /> {t('real_estate.challenges_title')}
                                </h2>
                                <ul className="flex flex-col gap-3" role="list">
                                    {challenges.map(ch => (
                                        <li key={ch.id} className={`flex items-center gap-3 p-3 rounded-xl border ${ch.done ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ch.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} aria-hidden="true">
                                                {ch.done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Target className="w-4 h-4 text-gray-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm ${ch.done ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                    {ch.done ? `✓ ${ch.label}` : ch.label}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-bold text-orange-500 shrink-0" aria-label={`Reward: ${ch.xp} XP`}>
                                                <Zap className="w-4 h-4" aria-hidden="true" /> +{ch.xp} XP
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Leaderboard */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Trophy className="w-5 h-5 text-yellow-500" aria-hidden="true" /> {t('real_estate.leaderboard_title')}
                                </h2>
                                <ol className="flex flex-col gap-2" role="list" aria-label="Top landlords by daily income">
                                    {landlords.map((l, i) => (
                                        // ✅ FIX: use stable id as key, not array index
                                        <li key={l.id} className={`flex items-center gap-3 p-3 rounded-xl ${'isYou' in l && l.isYou ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`} aria-label={`Rank ${i + 1}`}>
                                                {i + 1}
                                            </div>
                                            <span className="text-xl" aria-hidden="true">{l.avatar}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                    {l.name}{'isYou' in l && l.isYou ? ' (You)' : ''}
                                                </p>
                                            </div>
                                            <div className="text-green-600 dark:text-green-400 font-bold text-sm tabular-nums" aria-label={`${l.income.toLocaleString()} per day`}>
                                                ${formatCompactNumber(l.income)}/d
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* ── Sell Dialog ── */}
            <AnimatePresence>
                {sellTarget && (() => {
                    const prop = availableProperties.find(p => p.id === sellTarget);
                    return prop
                        ? <SellDialog key={sellTarget} prop={prop} refund={Math.floor(prop.cost * 0.6)} onConfirm={handleSell} onCancel={() => setSellTarget(null)} />
                        : null;
                })()}
            </AnimatePresence>
        </div>
    );
};

export default RealEstateApp;
