import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import confetti from 'canvas-confetti';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Property {
    id: string;
    name: string;
    emoji: string;
    tier: 1 | 2 | 3 | 4;
    dailyIncome: number;    // BizCoins per 24h
    purchaseCost: number;
    unlockLevel: number;
    description: string;
}

interface OwnedProperty {
    propertyId: string;
    lastCollected: number; // unix ms
    maintenanceOk: boolean;
}

// ─── Properties Catalog ───────────────────────────────────────────────────────
const PROPERTIES: Property[] = [
    { id: 'starter_apartment', name: 'Downtown Apartment', emoji: '🏠', tier: 1, dailyIncome: 50, purchaseCost: 500, unlockLevel: 1, description: 'Your first investment property — a cozy downtown flat.' },
    { id: 'corner_store', name: 'Corner Store', emoji: '🏪', tier: 1, dailyIncome: 120, purchaseCost: 1200, unlockLevel: 2, description: 'A busy neighbourhood shop selling snacks & supplies.' },
    { id: 'food_truck', name: 'Taco Food Truck', emoji: '🚚', tier: 1, dailyIncome: 200, purchaseCost: 2000, unlockLevel: 3, description: 'Everyone loves tacos! This truck parks in the city center.' },
    { id: 'office_building', name: 'Office Building', emoji: '🏢', tier: 2, dailyIncome: 400, purchaseCost: 4000, unlockLevel: 5, description: 'A 10-floor office packed with startups paying rent.' },
    { id: 'coffee_chain', name: 'Coffee Chain', emoji: '☕', tier: 2, dailyIncome: 700, purchaseCost: 7000, unlockLevel: 6, description: 'Three BizBrew cafes running simultaneously.' },
    { id: 'shopping_mall', name: 'Shopping Mall', emoji: '🛍️', tier: 3, dailyIncome: 1200, purchaseCost: 12000, unlockLevel: 8, description: 'A 3-floor mall with 50 shops paying you monthly rent.' },
    { id: 'hotel', name: 'Luxury Hotel', emoji: '🏨', tier: 3, dailyIncome: 2500, purchaseCost: 25000, unlockLevel: 9, description: '5-star hotel. Guests fly in from around the world.' },
    { id: 'sky_resort', name: 'Sky Resort & Spa', emoji: '🏔️', tier: 4, dailyIncome: 5000, purchaseCost: 50000, unlockLevel: 10, description: 'The pinnacle of real estate. A mountain resort empire.' },
];

const TIER_LABELS: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: 'Starter', color: '#10B981', bg: '#ECFDF5' },
    2: { label: 'Growing', color: '#6366F1', bg: '#EEF2FF' },
    3: { label: 'Premium', color: '#F59E0B', bg: '#FFFBEB' },
    4: { label: 'Empire', color: '#EF4444', bg: '#FEF2F2' },
};

const COLLECT_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const DECAY_INTERVAL_MS = 48 * 60 * 60 * 1000; // 48 hours until income decays

// ─── Helpers ──────────────────────────────────────────────────────────────────
function msUntilCollect(lastCollected: number): number {
    return Math.max(0, COLLECT_INTERVAL_MS - (Date.now() - lastCollected));
}

function formatTime(ms: number): string {
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({
    property, owned, onBuy, onCollect, userLevel, userCoins,
}: {
    property: Property;
    owned: OwnedProperty | null;
    onBuy: () => void;
    onCollect: () => void;
    userLevel: number;
    userCoins: number;
}) {
    const [countdown, setCountdown] = useState(owned ? msUntilCollect(owned.lastCollected) : 0);

    useEffect(() => {
        if (!owned) return;
        const t = setInterval(() => setCountdown(msUntilCollect(owned.lastCollected)), 10_000);
        return () => clearInterval(t);
    }, [owned]);

    const isLocked = userLevel < property.unlockLevel;
    const canAfford = userCoins >= property.purchaseCost;
    const canCollect = owned && countdown === 0;
    const isDecaying = owned && (Date.now() - owned.lastCollected) > DECAY_INTERVAL_MS;
    const tier = TIER_LABELS[property.tier];
    const income = isDecaying ? Math.floor(property.dailyIncome * 0.5) : property.dailyIncome;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-2xl border-2 p-4 flex flex-col gap-3 relative overflow-hidden transition-all ${owned ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                : isLocked ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
        >
            {/* Tier badge */}
            <span className="absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: tier.bg, color: tier.color }}>
                {tier.label}
            </span>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="text-3xl">{property.emoji}</div>
                <div>
                    <p className="font-black text-gray-800 dark:text-white text-sm leading-tight">{property.name}</p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{property.description}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 text-center">
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold">Daily Income</p>
                    <p className="font-black text-green-700 dark:text-green-300 text-sm">🪙{income.toLocaleString()}</p>
                    {isDecaying && <p className="text-[10px] text-red-500">⚠️ Decayed 50%</p>}
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-2 text-center">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{owned ? 'Next Collect' : 'Cost'}</p>
                    <p className="font-black text-indigo-700 dark:text-indigo-300 text-sm">
                        {owned ? (countdown > 0 ? formatTime(countdown) : '✅ Ready!') : `🪙${property.purchaseCost.toLocaleString()}`}
                    </p>
                </div>
            </div>

            {/* Action */}
            {owned ? (
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onCollect}
                    disabled={!canCollect}
                    className={`w-full py-2.5 rounded-xl font-black text-sm transition-all ${canCollect
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }`}
                >
                    {canCollect ? `💰 Collect Rent (+🪙${income.toLocaleString()})` : `⏳ ${formatTime(countdown)}`}
                </motion.button>
            ) : isLocked ? (
                <div className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm font-bold text-center">
                    🔒 Unlock at Level {property.unlockLevel}
                </div>
            ) : (
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onBuy}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-black text-sm ${canAfford
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}
                >
                    {canAfford ? `🏗️ Buy for 🪙${property.purchaseCost.toLocaleString()}` : `Need 🪙${(property.purchaseCost - userCoins).toLocaleString()} more`}
                </motion.button>
            )}
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface RealEstateTycoonProps { onClose?: () => void; }

const STORAGE_KEY = 'kidcaphq_real_estate';

export const RealEstateTycoon: React.FC<RealEstateTycoonProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const user = useAppStore(s => s.user);

    const [owned, setOwned] = useState<OwnedProperty[]>(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
    });
    const [toast, setToast] = useState<string | null>(null);
    const [tab, setTab] = useState<'market' | 'portfolio'>('portfolio');

    const coins = user?.bizCoins ?? 0;
    const level = user?.level ?? 1;

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const persist = (next: OwnedProperty[]) => {
        setOwned(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const handleBuy = useCallback((property: Property) => {
        if (coins < property.purchaseCost) return;
        const next: OwnedProperty = { propertyId: property.id, lastCollected: 0, maintenanceOk: true };
        persist([...owned, next]);
        showToast(`🏗️ You bought ${property.name}!`);
    }, [coins, owned]);

    const handleCollect = useCallback((property: Property) => {
        const entry = owned.find(o => o.propertyId === property.id);
        if (!entry) return;
        const isDecaying = (Date.now() - entry.lastCollected) > DECAY_INTERVAL_MS;
        const income = isDecaying ? Math.floor(property.dailyIncome * 0.5) : property.dailyIncome;

        persist(owned.map(o => o.propertyId === property.id ? { ...o, lastCollected: Date.now() } : o));
        showToast(`💰 Collected 🪙${income.toLocaleString()} from ${property.name}!`);
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    }, [owned]);

    const ownedList = PROPERTIES.filter(p => owned.some(o => o.propertyId === p.id));
    const marketList = PROPERTIES.filter(p => !owned.some(o => o.propertyId === p.id));
    const totalDailyIncome = ownedList.reduce((sum, p) => sum + p.dailyIncome, 0);
    const readyToCollect = owned.filter(o => msUntilCollect(o.lastCollected) === 0).length;

    return (
        <div className="flex flex-col h-full max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        🏙️ Real Estate Tycoon
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Build your property empire</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">✕</button>
                )}
            </div>

            {/* Stats strip */}
            <div className="mx-5 mb-3 grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-3 text-center text-white">
                    <p className="text-xs font-bold opacity-70">Properties</p>
                    <p className="font-black text-xl">{ownedList.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 text-center text-white">
                    <p className="text-xs font-bold opacity-70">Daily Income</p>
                    <p className="font-black text-base">🪙{totalDailyIncome.toLocaleString()}</p>
                </div>
                <div className={`rounded-2xl p-3 text-center text-white ${readyToCollect > 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500 animate-pulse' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                    <p className="text-xs font-bold opacity-70">Ready</p>
                    <p className="font-black text-xl">{readyToCollect}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mx-5 mb-3 flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
                {(['portfolio', 'market'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${tab === t ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow' : 'text-gray-500'
                            }`}
                    >
                        {t === 'portfolio' ? '🏠 My Portfolio' : '🏗️ Buy Property'}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-3">
                <AnimatePresence mode="wait">
                    {tab === 'portfolio' ? (
                        ownedList.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-12 text-gray-400">
                                <p className="text-4xl mb-3">🏚️</p>
                                <p className="font-bold">No properties yet!</p>
                                <p className="text-sm">Switch to Buy Property to get started.</p>
                            </motion.div>
                        ) : ownedList.map(property => (
                            <motion.div key={property.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <PropertyCard
                                    property={property}
                                    owned={owned.find(o => o.propertyId === property.id) ?? null}
                                    onBuy={() => handleBuy(property)}
                                    onCollect={() => handleCollect(property)}
                                    userLevel={level}
                                    userCoins={coins}
                                />
                            </motion.div>
                        ))
                    ) : (
                        marketList.map(property => (
                            <motion.div key={property.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <PropertyCard
                                    property={property}
                                    owned={null}
                                    onBuy={() => handleBuy(property)}
                                    onCollect={() => { }}
                                    userLevel={level}
                                    userCoins={coins}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-2xl z-[300] whitespace-nowrap"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RealEstateTycoon;
