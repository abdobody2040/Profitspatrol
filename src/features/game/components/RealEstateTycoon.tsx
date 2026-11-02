import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store';
import { useEconomyStore } from '../../../store/economyStore';
import { calculatePropertyIncome } from '../../../store/slices/realEstateSlice';
import confetti from 'canvas-confetti';
import CoinIcon from '../../../components/ui/CoinIcon';
import { 
    Home, 
    Building2, 
    Truck, 
    Gamepad2, 
    Building, 
    Factory, 
    Palmtree, 
    ShoppingBag, 
    Rocket,
    TrendingUp,
    Clock,
    Lock,
    Coins,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import { Property, UserProperty } from '../../../types';

// Map images from properties.ts to Lucide icons or emojis
const ICON_MAP: Record<string, React.ReactNode> = {
    '🍋': <Coins className="text-yellow-500" />,
    '🏠': <Home className="text-blue-500" />,
    '🚚': <Truck className="text-orange-500" />,
    '🕹️': <Gamepad2 className="text-purple-500" />,
    '🏢': <Building2 className="text-indigo-500" />,
    '🏭': <Factory className="text-gray-500" />,
    '🏖️': <Palmtree className="text-cyan-500" />,
    '🏬': <ShoppingBag className="text-pink-500" />,
    '💻': <Rocket className="text-violet-500" />,
};

const TIER_COLORS: Record<string, { label: string; color: string; bg: string }> = {
    'CITY': { label: 'Local', color: '#10B981', bg: 'bg-green-50 dark:bg-green-900/20' },
    'METRO': { label: 'Regional', color: '#6366F1', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    'GLOBAL': { label: 'Empire', color: '#EF4444', bg: 'bg-red-50 dark:bg-red-900/20' },
};

function formatTime(ms: number): string {
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
}

function msUntilCollect(lastCollected: string): number {
    const lastMs = new Date(lastCollected).getTime();
    if (isNaN(lastMs)) return 0;
    const COLLECT_INTERVAL_MS = 24 * 60 * 60 * 1000;
    return Math.max(0, COLLECT_INTERVAL_MS - (Date.now() - lastMs));
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({
    property, 
    owned, 
    onBuy, 
    onCollect, 
    onUpgrade,
    userLevel, 
    userCoins,
}: {
    property: Property;
    owned: UserProperty | undefined;
    onBuy: () => void;
    onCollect: () => void;
    onUpgrade: () => void;
    userLevel: number;
    userCoins: number;
}) {
    const [countdown, setCountdown] = useState(owned ? msUntilCollect(owned.lastCollected) : 0);

    useEffect(() => {
        if (!owned) return;
        const t = setInterval(() => setCountdown(msUntilCollect(owned.lastCollected)), 10_000);
        return () => clearInterval(t);
    }, [owned]);

    const isLocked = userLevel < property.reqLevel;
    const canAfford = userCoins >= property.cost;
    const canCollect = owned && countdown === 0;
    const tier = TIER_COLORS[property.tier || 'CITY'];
    
    const income = owned 
        ? calculatePropertyIncome(property, owned.level, owned.renovationLevel)
        : property.initialIncome;

    const upgradeCost = owned ? Math.floor(property.cost * 0.5 * owned.level) : 0;
    const canAffordUpgrade = userCoins >= upgradeCost;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-2xl border-2 p-4 flex flex-col gap-3 relative overflow-hidden transition-all ${
                owned ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                : isLocked ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
        >
            {/* Tier badge */}
            <span className={`absolute top-3 end-3 text-[10px] font-black px-2 py-0.5 rounded-full ${tier.bg}`}
                style={{ color: tier.color }}>
                {tier.label}
            </span>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="text-3xl w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                    {ICON_MAP[property.image] || property.image}
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="font-black text-gray-800 dark:text-white text-sm leading-tight">{property.name}</p>
                        {owned && (
                            <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                LVL {owned.level}
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{property.description}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 border border-green-100 dark:border-green-900/30">
                    <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Income / Day</p>
                    <p className="font-black text-green-700 dark:text-green-300 text-sm flex items-center gap-1">
                        <Coins size={14} /> <CoinIcon size={14} />{income.toLocaleString()}
                    </p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-2 border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">{owned ? 'Collection' : 'Cost'}</p>
                    <p className="font-black text-indigo-700 dark:text-indigo-300 text-sm flex items-center gap-1">
                        {owned ? (
                            countdown > 0 ? <><Clock size={14} /> {formatTime(countdown)}</> : <><CheckCircle2 size={14} className="text-green-500" /> Ready!</>
                        ) : (
                            <span className="flex items-center gap-1"><CoinIcon size={14} />{property.cost.toLocaleString()}</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-1">
                {owned ? (
                    <>
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={onCollect}
                            disabled={!canCollect}
                            className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                                canCollect
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                            }`}
                        >
                            {canCollect ? <><Coins size={14} /> Collect Rent</> : <><Clock size={14} /> {formatTime(countdown)}</>}
                        </motion.button>
                        
                        {owned.level < property.maxLevel && (
                            <button
                                onClick={onUpgrade}
                                disabled={!canAffordUpgrade}
                                className={`w-full py-2 rounded-xl text-[10px] font-bold border-2 transition-all ${
                                    canAffordUpgrade
                                    ? 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                    : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600'
                                }`}
                            >
                                <TrendingUp size={12} className="inline mr-1" />
                                Upgrade to LVL {owned.level + 1} (<CoinIcon size={11} className="mr-0.5" />{upgradeCost.toLocaleString()})
                            </button>
                        )}
                    </>
                ) : isLocked ? (
                    <div className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 text-xs font-bold flex items-center justify-center gap-2">
                        <Lock size={14} /> Unlock at Level {property.reqLevel}
                    </div>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={onBuy}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 ${
                            canAfford
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}
                    >
                        {canAfford ? <><Building size={14} /> Buy Property</> : <><AlertCircle size={14} /> Need <CoinIcon size={14} className="mx-0.5" />{(property.cost - userCoins).toLocaleString()}</>}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

export const RealEstateTycoon: React.FC = () => {
    const { user } = useAppStore();
    const { 
        availableProperties, 
        buyProperty, 
        collectRent, 
        upgradeProperty,
        collectAllRent 
    } = useEconomyStore();
    const [toast, setToast] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'owned' | 'market'>('all');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAction = (result: any, successMsg: string) => {
        if (result.success) {
            showToast(successMsg);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            showToast(`❌ ${result.error}`);
        }
    };

    const ownedCount = user?.properties?.length || 0;
    const totalDailyIncome = (user?.properties || []).reduce((acc, up) => {
        const base = availableProperties.find(p => p.id === up.propertyId);
        if (!base) return acc;
        return acc + calculatePropertyIncome(base, up.level, up.renovationLevel);
    }, 0);

    const filteredProperties = availableProperties.filter(p => {
        const isOwned = user?.properties?.some(up => up.propertyId === p.id);
        if (filter === 'owned') return isOwned;
        if (filter === 'market') return !isOwned;
        return true;
    });

    if (!user) return null;

    return (
        <div className="flex flex-col h-full w-full mx-auto pb-20 md:pb-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-100 dark:border-gray-800 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                            🏙️ Real Estate Tycoon
                        </h2>
                        <p className="text-sm text-gray-400 font-medium">Build your passive income empire</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-2xl border-2 border-green-100 dark:border-green-900/30">
                            <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase">Total Passive Income</p>
                            <p className="text-lg font-black text-green-700 dark:text-green-300 flex items-center gap-1"><CoinIcon size={16} />{totalDailyIncome.toLocaleString()}<span className="text-[10px] ml-1">/day</span></p>
                        </div>
                        
                        {ownedCount > 0 && (
                            <button
                                onClick={() => {
                                    collectAllRent();
                                    showToast("💰 Collected all available rent!");
                                    confetti({ particleCount: 150, spread: 100 });
                                }}
                                className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex flex-col items-center justify-center min-w-[80px]"
                            >
                                <Coins size={20} />
                                <span className="text-[10px] font-black mt-1 uppercase">Collect All</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mt-6">
                    {(['all', 'market', 'owned'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black capitalize transition-all ${
                                filter === f
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {f === 'all' ? 'All Properties' : f === 'market' ? 'Buy New' : `My Portfolio (${ownedCount})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Property Grid */}
            <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProperties.map(p => (
                        <PropertyCard
                            key={p.id}
                            property={p}
                            owned={user.properties?.find(up => up.propertyId === p.id)}
                            userLevel={user.level}
                            userCoins={user.ppTokens}
                            onBuy={() => handleAction(buyProperty(p.id), `🏗️ You bought ${p.name}!`)}
                            onCollect={() => handleAction(collectRent(p.id), `💰 Collected rent from ${p.name}!`)}
                            onUpgrade={() => handleAction(upgradeProperty(p.id), `🚀 Upgraded ${p.name}!`)}
                        />
                    ))}
                    
                    {filteredProperties.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Info className="text-gray-400" size={32} />
                            </div>
                            <h3 className="font-black text-gray-800 dark:text-white">No properties found</h3>
                            <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                {filter === 'owned' 
                                    ? "You don't own any properties yet. Start your empire in the Market!" 
                                    : "Check back later for new investment opportunities!"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm border-2 border-indigo-500">
                            {toast}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RealEstateTycoon;
