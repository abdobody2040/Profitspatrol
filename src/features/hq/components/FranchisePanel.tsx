import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, TrendingUp, Users, Coins, ArrowUp, Lock, Sparkles, Clock } from 'lucide-react';
import { useAppStore } from '../../../store';
import { useTranslation } from 'react-i18next';
import {
    INCOME_PER_HOUR,
    UPGRADE_COST,
    TIER_ORDER,
    FRANCHISE_UNLOCK_LEVEL,
    MAX_PENDING_INCOME,
    FranchiseTier,
} from '../../../store/slices/franchiseSlice';

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<FranchiseTier, {
    label: string;
    emoji: string;
    color: string;
    bg: string;
    description: string;
}> = {
    KIOSK: {
        label: 'Street Kiosk',
        emoji: '🛒',
        color: '#64748b',
        bg: 'rgba(100,116,139,0.12)',
        description: 'A tiny booth that earns while you sleep.',
    },
    SHOP: {
        label: 'Corner Shop',
        emoji: '🏪',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.12)',
        description: 'A proper shop with loyal return customers.',
    },
    STORE: {
        label: 'Flagship Store',
        emoji: '🏬',
        color: '#8b5cf6',
        bg: 'rgba(139,92,246,0.12)',
        description: 'A full-scale store pulling in serious coin.',
    },
    ENTERPRISE: {
        label: 'Global Enterprise',
        emoji: '🏙️',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        description: 'Your brand is everywhere. Max passive income reached.',
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

const FranchisePanel: React.FC = () => {
    const { user, franchise, openFranchise, collectFranchiseIncome, upgradeFranchise, tickFranchise } =
        useAppStore();
    const { t } = useTranslation();

    const [justCollected, setJustCollected] = useState<number | null>(null);
    const [upgradeFlash, setUpgradeFlash] = useState(false);

    // Tick on mount to accrue offline income
    useEffect(() => {
        tickFranchise();
    }, [tickFranchise]);

    const level = user?.level ?? 0;
    const isEligible = level >= FRANCHISE_UNLOCK_LEVEL;
    const tierCfg = TIER_CONFIG[franchise.tier];
    const currentIdx = TIER_ORDER.indexOf(franchise.tier);
    const isMaxTier = currentIdx >= TIER_ORDER.length - 1;
    const nextTier = isMaxTier ? null : TIER_ORDER[currentIdx + 1];
    const upgradeCost = isMaxTier ? 0 : UPGRADE_COST[franchise.tier];
    const canAffordUpgrade = (user?.bizCoins ?? 0) >= upgradeCost;
    const incomeRate = INCOME_PER_HOUR[franchise.tier];
    const fillPercent = Math.min(100, (franchise.pendingIncome / MAX_PENDING_INCOME) * 100);

    const handleCollect = () => {
        const amount = collectFranchiseIncome();
        if (amount > 0) {
            setJustCollected(amount);
            setTimeout(() => setJustCollected(null), 2000);
        }
    };

    const handleUpgrade = () => {
        upgradeFranchise();
        setUpgradeFlash(true);
        setTimeout(() => setUpgradeFlash(false), 800);
    };

    // ─── Locked / Not Yet Unlocked ────────────────────────────────────────────
    if (!isEligible) {
        return (
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '20px 22px',
                display: 'flex', alignItems: 'center', gap: 14,
            }}>
                <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(100,116,139,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, flexShrink: 0,
                }}>🔒</div>
                <div>
                    <div className="text-[14px] font-[800] text-gray-800 dark:text-white/70">
                        {t('enterprise.title')}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-white/35 mt-[3px]">
                        {t('enterprise.reachLevelToOpen', { level: FRANCHISE_UNLOCK_LEVEL } as any)}
                        {' '}({t('enterprise.youAreLevel', { level } as any)})
                    </div>
                </div>
            </div>
        );
    }

    // ─── Not Yet Opened ───────────────────────────────────────────────────────
    if (!franchise.isOpen) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
                    border: '1.5px solid rgba(99,102,241,0.25)',
                    borderRadius: 20, padding: '24px 24px',
                    textAlign: 'center',
                }}
            >
                <div style={{ fontSize: 52, marginBottom: 10 }}>🏪</div>
                <div style={{ fontSize: 52, marginBottom: 10 }}>🏪</div>
                <h3 className="text-[18px] font-[900] text-gray-800 dark:text-white mb-[6px]">
                    {t('enterprise.openTitle', 'Open Your Franchise!')}
                </h3>
                <p className="text-[13px] text-gray-600 dark:text-white/50 mb-[20px] leading-[1.5]">
                    {t('enterprise.openDesc', { level, income: INCOME_PER_HOUR.KIOSK } as any)}
                </p>
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={openFranchise}
                    style={{
                        padding: '14px 36px',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        border: 'none', borderRadius: 14, color: '#fff',
                        fontSize: 15, fontWeight: 800, cursor: 'pointer',
                        boxShadow: '0 6px 24px rgba(99,102,241,0.35)',
                    }}
                >
                    🏪 {t('enterprise.openBtn', 'Open Franchise — Free!')}
                </motion.button>
            </motion.div>
        );
    }

    // ─── Main Panel ────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                background: tierCfg.bg,
                border: `1.5px solid ${tierCfg.color}30`,
                borderRadius: 20,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${tierCfg.color}20`,
                display: 'flex', alignItems: 'center', gap: 12,
            }}>
                <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: `${tierCfg.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, flexShrink: 0,
                }}>
                    {tierCfg.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="text-[15px] font-[900] text-gray-800 dark:text-white">{t(`enterprise.tiers.${franchise.tier}.label` as any, tierCfg.label)}</span>
                        <span style={{
                            fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 8,
                            background: `${tierCfg.color}25`, color: tierCfg.color,
                            letterSpacing: '0.4px',
                        }}>
                            {franchise.tier}
                        </span>
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-white/40 mt-[2px]">
                        {t(`enterprise.tiers.${franchise.tier}.desc` as any, tierCfg.description)}
                    </div>
                </div>

                {/* Income rate badge */}
                <div style={{
                    textAlign: 'right', flexShrink: 0,
                }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#86efac' }}>
                        +{incomeRate} 🪙
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-white/35 font-[600]">
                        {t('enterprise.perHour', 'per hour')}
                    </div>
                </div>
            </div>

            {/* Pending income bar + collect */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${tierCfg.color}15` }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
                }}>
                    <span className="text-[13px] font-[700] text-gray-500 dark:text-white/60">
                        💰 {t('enterprise.pendingIncome', 'Pending Income')}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#fbbf24' }}>
                        {franchise.pendingIncome} 🪙
                    </span>
                </div>

                {/* Fill bar */}
                <div className="h-[8px] rounded-[6px] bg-black/5 dark:bg-white/10 overflow-hidden mb-[12px]">
                    <motion.div
                        animate={{ width: `${fillPercent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{
                            height: '100%', borderRadius: 6,
                            background: `linear-gradient(90deg, ${tierCfg.color}, #fbbf24)`,
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleCollect}
                        disabled={franchise.pendingIncome <= 0}
                        className={`flex-1 p-[12px] border-none rounded-[12px] text-[#fff] font-[800] text-[14px] ${franchise.pendingIncome > 0 ? 'bg-gradient-to-br from-[#059669] to-[#10b981] cursor-pointer opacity-100' : 'bg-black/5 dark:bg-white/10 text-gray-400 dark:text-white/40 cursor-not-allowed opacity-45'}`}
                    >
                        {t('enterprise.collectBtn', 'Collect BizCoins')}
                    </motion.button>

                    {/* Upgrade button */}
                    {!isMaxTier && (
                        <motion.button
                            whileHover={canAffordUpgrade ? { scale: 1.03 } : {}}
                            whileTap={canAffordUpgrade ? { scale: 0.96 } : {}}
                            animate={upgradeFlash ? { scale: [1, 1.1, 1] } : {}}
                            onClick={handleUpgrade}
                            disabled={!canAffordUpgrade}
                            title={`Upgrade to ${nextTier} for ${upgradeCost} 🪙`}
                            className={`p-[12px_16px] border-none rounded-[12px] font-[800] text-[13px] flex items-center gap-[6px] whitespace-nowrap ${canAffordUpgrade ? 'text-white cursor-pointer opacity-100' : 'bg-black/5 dark:bg-white/10 text-gray-400 dark:text-white/40 cursor-not-allowed opacity-40'}`}
                            style={{
                                background: canAffordUpgrade ? `linear-gradient(135deg, ${tierCfg.color}, #7c3aed)` : undefined,
                            }}
                        >
                            <ArrowUp size={14} /> {t('enterprise.upgradeBtn', 'Upgrade')} · {upgradeCost} 🪙
                        </motion.button>
                    )}
                    {isMaxTier && (
                        <div style={{
                            padding: '12px 14px',
                            background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.3)',
                            borderRadius: 12, color: '#fbbf24',
                            fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap',
                        }}>
                            ⭐ {t('enterprise.maxTier', 'Max Tier')}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats row */}
            <div style={{
                display: 'flex',
                borderBottom: `1px solid ${tierCfg.color}15`,
            }}>
                {[
                    { label: t('enterprise.totalEarned', 'Total Earned'), value: `${franchise.totalEarned} 🪙`, icon: '💎' },
                    { label: t('enterprise.visitors', 'Visitors'), value: franchise.totalVisitors.toString(), icon: '👥' },
                    { label: t('enterprise.upgrades', 'Upgrades'), value: franchise.upgradeCount.toString(), icon: '⬆️' },
                ].map((stat, i) => (
                    <div key={i} style={{
                        flex: 1, padding: '12px 14px', textAlign: 'center',
                        borderRight: i < 2 ? `1px solid ${tierCfg.color}15` : 'none',
                    }}>
                        <div style={{ fontSize: 18, marginBottom: 3 }}>{stat.icon}</div>
                        <div className="text-[13px] font-[900] text-gray-800 dark:text-white">{stat.value}</div>
                        <div className="text-[10px] text-gray-400 dark:text-white/35 font-[600] mt-[2px]">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent visitors */}
            {franchise.recentVisits.length > 0 && (
                <div style={{ padding: '12px 20px' }}>
                    <div className="text-[11px] text-gray-400 dark:text-white/35 font-[700] mb-[8px] tracking-[0.5px]">
                        {t('enterprise.recentVisitors', 'RECENT VISITORS')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {franchise.recentVisits.map((v, i) => (
                            <div key={i} className="flex items-center gap-[5px] bg-black/5 dark:bg-white/5 rounded-[10px] p-[4px_10px] text-[12px] text-gray-600 dark:text-white/60">
                                <span>{v.visitorEmoji}</span>
                                <span style={{ fontWeight: 600 }}>{v.visitorName}</span>
                                <span style={{ color: '#86efac', fontWeight: 700 }}>+{v.bizCoinsSpent}🪙</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collect toast */}
            <AnimatePresence>
                {justCollected !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: -40, left: '50%', transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, #059669, #10b981)',
                            color: '#fff', padding: '8px 18px',
                            borderRadius: 12, fontWeight: 900, fontSize: 15,
                            whiteSpace: 'nowrap', pointerEvents: 'none',
                            boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                        }}
                    >
                        +{justCollected} 🪙 Collected!
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FranchisePanel;
