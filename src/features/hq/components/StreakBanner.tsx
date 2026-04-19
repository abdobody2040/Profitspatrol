import React from 'react';
import { useAppStore } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MILESTONE = 7;

export const StreakBanner: React.FC = () => {
    const { user } = useAppStore();
    const { t } = useTranslation();
    if (!user) return null;

    const streak = user.streak ?? 0;
    const daysToBonus = MILESTONE - (streak % MILESTONE);
    const isOnMilestone = streak > 0 && streak % MILESTONE === 0;
    const isPremium = user.subscriptionTier !== 'intern';
    const shieldActive = !!user.streakShield;
    const shieldUsedToday = user.streakShieldUsedDate === new Date().toISOString().split('T')[0];

    const flameEmoji = streak >= 30 ? '🔥🔥🔥' : streak >= 14 ? '🔥🔥' : streak >= 7 ? '🔥' : streak >= 3 ? '🌟' : '✨';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`relative overflow-hidden rounded-[18px] flex items-center gap-4 p-4 border-2 ${isOnMilestone
                ? 'bg-gradient-to-br from-amber-400 to-red-500 border-amber-300 shadow-lg shadow-red-300/40 dark:shadow-red-900/40'
                : 'bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border-gray-200 dark:border-white/8 shadow-md dark:shadow-black/20'
                }`}
        >
            {/* Glow bg for milestone */}
            {isOnMilestone && (
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-[18px] bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.25)_0%,transparent_70%)] pointer-events-none"
                />
            )}

            {/* Flame + Count */}
            <div className="flex flex-col items-center min-w-[60px]">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={streak}
                        initial={{ scale: 1.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="text-3xl leading-none"
                    >
                        {flameEmoji}
                    </motion.span>
                </AnimatePresence>
                <span className={`font-black leading-none mt-0.5 drop-shadow ${streak >= 100 ? 'text-2xl' : 'text-3xl'} ${isOnMilestone ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                    {streak}
                </span>
                <span className={`text-[10px] font-semibold tracking-wide mt-0.5 ${isOnMilestone ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                    {t('hqStats.dayStreak', 'DAY STREAK')}
                </span>
            </div>

            {/* Divider */}
            <div className={`w-px h-12 flex-shrink-0 ${isOnMilestone ? 'bg-white/25' : 'bg-gray-200 dark:bg-white/10'}`} />

            {/* Info */}
            <div className="flex-1">
                {isOnMilestone ? (
                    <div>
                        <p className="text-white font-extrabold text-[15px] m-0">{t('hqStats.milestoneUnlocked', '🏆 Milestone Unlocked!')}</p>
                        <p className="text-white/80 text-xs mt-1">
                            {t('hqStats.milestoneDesc', { defaultValue: `${streak}-day streak! You earned <strong>+300 XP</strong> & <strong>+200 🪙</strong>`, streak, xp: 300, coins: 200 })}
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className={`font-bold text-sm m-0 ${isOnMilestone ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                            {daysToBonus === 1 ? t('hqStats.bonusTomorrow', '⚡ Bonus tomorrow!') : t('hqStats.daysToBonus', { defaultValue: `${daysToBonus} days to bonus`, days: daysToBonus })}
                        </p>
                        <div className="mt-2 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((MILESTONE - daysToBonus) / MILESTONE) * 100}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                            />
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1">
                            {MILESTONE - daysToBonus} / {MILESTONE} {t('hqStats.days', 'days')}
                        </p>
                    </div>
                )}
            </div>

            {/* Shield badge */}
            {isPremium && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <motion.div
                        animate={shieldActive && !shieldUsedToday ? { scale: [1, 1.08, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`rounded-xl px-2.5 py-2 text-2xl cursor-default border transition-opacity ${shieldActive && !shieldUsedToday
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600/50 opacity-100'
                            : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-40'
                            }`}
                        title={shieldUsedToday ? 'Streak Shield used today' : shieldActive ? 'Streak Shield ready' : 'Streak Shield (Premium)'}
                    >
                        🛡️
                    </motion.div>
                    <span className={`text-[9px] font-bold tracking-wide ${shieldActive && !shieldUsedToday ? 'text-indigo-500 dark:text-violet-400' : 'text-gray-400 dark:text-gray-600'
                        }`}>
                        {shieldUsedToday ? t('hqStats.shieldUsed', 'USED') : shieldActive ? t('hqStats.shieldActive', 'SHIELD') : t('hqStats.shieldNone', 'NO SHIELD')}
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default StreakBanner;
