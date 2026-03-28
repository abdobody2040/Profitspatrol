import React from 'react';
import { useAppStore } from '../../../store';
import { useTranslation } from 'react-i18next';

export const DailyMissions: React.FC = () => {
    const { dailyMissions, claimMissionReward, refreshDailyMissions } = useAppStore();
    const { t } = useTranslation();

    React.useEffect(() => {
        refreshDailyMissions();
    }, [refreshDailyMissions]);

    const { missions, completions } = dailyMissions;

    const allComplete = completions.every(c => c.completed && c.claimedReward);
    const totalXp = missions.reduce((sum, m) => sum + m.xpReward, 0);
    const earnedXp = missions.reduce((sum, m) => {
        const c = completions.find(c => c.missionId === m.id);
        return sum + (c?.claimedReward ? m.xpReward : 0);
    }, 0);

    return (
        <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460] rounded-2xl p-5 border border-gray-200 dark:border-indigo-900/40 shadow-md dark:shadow-black/30">
            {/* Decorative glow (dark mode only) */}
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)]
                dark:bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)]
                -translate-y-4 translate-x-4" />

            {/* Header */}
            <div className="flex justify-between items-center mb-4 relative">
                <div>
                    <h3 className="text-base font-extrabold text-gray-800 dark:text-white m-0 tracking-tight">
                        ⚡ {t('dailyMissions.title')}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {t('dailyMissions.subtitle')}
                    </p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-bold border ${allComplete
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700/40 text-indigo-600 dark:text-violet-300'
                    }`}>
                    {earnedXp} / {totalXp} XP
                </div>
            </div>

            {/* Mission Items */}
            <div className="flex flex-col gap-3">
                {missions.map((mission) => {
                    const completion = completions.find(c => c.missionId === mission.id);
                    const progress = completion?.progress ?? 0;
                    const completed = completion?.completed ?? false;
                    const claimed = completion?.claimedReward ?? false;
                    const pct = Math.min(100, Math.round((progress / mission.targetCount) * 100));

                    return (
                        <div
                            key={mission.id}
                            className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 border transition-all ${claimed
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30'
                                : completed
                                    ? 'bg-indigo-50 dark:bg-indigo-900/15 border-indigo-200 dark:border-indigo-700/30'
                                    : 'bg-gray-50 dark:bg-white/4 border-gray-100 dark:border-white/8'
                                }`}
                        >
                            {/* Icon */}
                            <span className="text-3xl leading-none flex-shrink-0" style={{ filter: claimed ? 'grayscale(0.3)' : 'none' }}>
                                {claimed ? '✅' : completed ? '🎉' : mission.icon}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <p className={`text-sm font-bold m-0 ${claimed
                                        ? 'line-through text-gray-400 dark:text-gray-600'
                                        : 'text-gray-800 dark:text-gray-100'
                                        }`}>
                                        {t(`dailyMissions.${mission.id}` as any, mission.title)}
                                    </p>
                                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                                        +{mission.xpReward} XP {mission.coinReward > 0 ? `· +${mission.coinReward} 🪙` : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-2">
                                    {t(`dailyMissions.${mission.id}Desc` as any, mission.description)}
                                </p>

                                {/* Progress bar */}
                                <div className="h-1.5 bg-gray-200 dark:bg-white/8 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-400"
                                        style={{
                                            width: `${pct}%`,
                                            background: claimed
                                                ? 'rgba(52,211,153,0.6)'
                                                : completed
                                                    ? 'linear-gradient(90deg,#6366f1,#8b5cf6)'
                                                    : 'linear-gradient(90deg,#3b82f6,#6366f1)',
                                        }}
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1">
                                    {progress} / {mission.targetCount}
                                    {mission.actionType === 'EARN_COINS' ? ' coins' : ''}
                                </p>
                            </div>

                            {/* Claim Button */}
                            {completed && !claimed && (
                                <button
                                    onClick={() => claimMissionReward(mission.id)}
                                    className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg px-3.5 py-2 text-xs font-extrabold shadow-md shadow-indigo-300/40 dark:shadow-indigo-900/40 transition-all hover:scale-105 active:scale-95 tracking-wide"
                                >
                                    {t('dailyMissions.missionComplete', 'Claim!')}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* All Done Banner */}
            {allComplete && (
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/30 rounded-xl px-4 py-3 text-center">
                    <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm m-0">
                        🏆 {t('dailyMissions.allMissionsComplete', 'All missions complete! Come back tomorrow for new challenges.')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DailyMissions;
