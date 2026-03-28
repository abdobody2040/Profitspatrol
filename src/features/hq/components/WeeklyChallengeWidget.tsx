import React from 'react';
import { useAppStore } from '../../../store';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const WeeklyChallengeWidget: React.FC = () => {
    const { weeklyChallenge, refreshWeeklyChallenge, claimWeeklyChallengeReward } = useAppStore();
    const { t } = useTranslation();

    React.useEffect(() => {
        refreshWeeklyChallenge();
    }, [refreshWeeklyChallenge]);

    if (!weeklyChallenge || !weeklyChallenge.myEntry) return null;

    const { challenge, myEntry, weekStart } = weeklyChallenge;
    const pct = Math.min(100, Math.round((myEntry.progress / challenge.targetCount) * 100));
    const completed = myEntry.completed;
    const claimed = myEntry.claimedReward;

    const monday = new Date(weekStart);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((sunday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const cardBg = claimed
        ? 'bg-emerald-50 dark:bg-gradient-to-br dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800/40'
        : completed
            ? 'bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-purple-800/40 shadow-indigo-200/50 dark:shadow-purple-900/30'
            : 'bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-slate-800 border-gray-200 dark:border-indigo-900/30';

    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 border shadow-md dark:shadow-black/30 ${cardBg} ${completed && !claimed ? 'shadow-lg' : ''}`}>

            {/* Days-left ribbon */}
            <div className={`absolute top-0 right-0 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wide ${daysLeft <= 1 ? 'bg-red-500/90' : 'bg-indigo-500/80 dark:bg-indigo-600/80'
                }`}>
                {daysLeft === 0 ? 'LAST DAY!' : `${daysLeft}d LEFT`}
            </div>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
                <span className="text-4xl leading-none flex-shrink-0">{challenge.icon}</span>
                <div>
                    <span className="inline-block text-[10px] font-extrabold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-700/40 tracking-widest">
                        ⚔️ {t('weeklyChallenge.title')}
                    </span>
                    <h3 className="text-base font-black text-gray-800 dark:text-white mt-1.5 mb-0.5">
                        {t(`weeklyChallenge.challenges.${challenge.id}.name` as any, challenge.title)}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
                        {t(`weeklyChallenge.challenges.${challenge.id}.desc` as any, challenge.description)}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('weeklyChallenge.progress')}</span>
                    <span className={`text-sm font-extrabold ${completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-violet-300'}`}>
                        {myEntry.progress.toLocaleString()} / {challenge.targetCount.toLocaleString()}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-white/8 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{
                            background: claimed
                                ? 'linear-gradient(90deg, #10b981, #34d399)'
                                : completed
                                    ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                                    : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                            boxShadow: completed ? '0 0 12px rgba(139,92,246,0.5)' : 'none',
                        }}
                    />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1.5">{pct}% complete</p>
            </div>

            {/* Rewards row */}
            <div className={`flex justify-between items-center rounded-xl px-3.5 py-3 mb-3 ${claimed
                ? 'bg-emerald-100/60 dark:bg-white/4'
                : 'bg-gray-50 dark:bg-white/4'
                }`}>
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-base font-black text-amber-500">+{challenge.xpReward.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">XP</div>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-white/8" />
                    <div className="text-center">
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400">+{challenge.coinReward.toLocaleString()} 🪙</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">BizCoins</div>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-white/8" />
                    <div className="text-center">
                        <div className="text-base">🏅</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{t('weeklyChallenge.badge')}</div>
                    </div>
                </div>

                {/* Status */}
                {claimed ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700/40 px-3.5 py-1.5 rounded-full">
                        ✅ Claimed
                    </span>
                ) : !completed ? (
                    <span className="text-xs text-gray-400 dark:text-gray-600 font-semibold">{t('weeklyChallenge.keepGoing')}</span>
                ) : null}
            </div>

            {/* Claim button */}
            {completed && !claimed && (
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={claimWeeklyChallengeReward}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white rounded-xl py-3.5 text-[15px] font-black shadow-lg shadow-purple-300/40 dark:shadow-purple-900/40 tracking-wide transition-all"
                >
                    🏆 Claim Weekly Reward!
                </motion.button>
            )}
        </div>
    );
};

export default WeeklyChallengeWidget;
