import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import confetti from 'canvas-confetti';

// ─── Theme per challenge type ─────────────────────────────────────────────────
const THEME_MAP = {
    LESSON_SPRINT: { bg: 'from-blue-600 to-indigo-700', icon: '📚', accent: '#6366F1', lightBg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    GIG_MARATHON: { bg: 'from-amber-500 to-orange-600', icon: '⚡', accent: '#F59E0B', lightBg: 'bg-amber-50 dark:bg-amber-900/20' },
    BOSS_BATTLE: { bg: 'from-red-600 to-rose-700', icon: '⚔️', accent: '#EF4444', lightBg: 'bg-red-50 dark:bg-red-900/20' },
    COIN_GRIND: { bg: 'from-yellow-500 to-amber-600', icon: '💰', accent: '#EAB308', lightBg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    QUIZ_BLITZ: { bg: 'from-emerald-500 to-teal-600', icon: '🧠', accent: '#10B981', lightBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    CEO_CHALLENGE: { bg: 'from-purple-600 to-violet-700', icon: '👑', accent: '#8B5CF6', lightBg: 'bg-purple-50 dark:bg-purple-900/20' },
} as const;

// ─── Days until next Monday ────────────────────────────────────────────────────
function daysUntilReset(): number {
    const now = new Date();
    const day = now.getDay();
    return day === 1 ? 7 : ((8 - day) % 7 || 7);
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface CEOChallengeWidgetProps { onClose?: () => void; }

export const CEOChallengeWidget: React.FC<CEOChallengeWidgetProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const user = useAppStore(s => s.user);
    const weeklyChallenge = useAppStore(s => s.weeklyChallenge);
    const refreshWeeklyChallenge = useAppStore(s => s.refreshWeeklyChallenge);
    const claimWeeklyChallengeReward = useAppStore(s => s.claimWeeklyChallengeReward);

    const [claimed, setClaimed] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => { refreshWeeklyChallenge(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!weeklyChallenge) return null;

    const { challenge, myEntry } = weeklyChallenge;
    const theme = THEME_MAP[challenge.type as keyof typeof THEME_MAP] ?? THEME_MAP.CEO_CHALLENGE;
    const progress = myEntry?.progress ?? 0;
    const target = challenge.targetCount;
    const pct = Math.min(100, Math.round((progress / target) * 100));
    const isComplete = myEntry?.completed ?? false;
    const hasClaimed = myEntry?.claimedReward ?? claimed;
    const daysLeft = daysUntilReset();

    const handleClaim = () => {
        if (!isComplete || hasClaimed) return;
        claimWeeklyChallengeReward();
        setClaimed(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 2000);
        confetti({
            particleCount: 150, spread: 80, origin: { y: 0.6 },
            colors: [theme.accent, '#ffffff', '#ffd700']
        });
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        👑 Weekly CEO Challenge
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Resets in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">✕</button>
                )}
            </div>

            {/* Challenge banner */}
            <div className={`bg-gradient-to-br ${theme.bg} rounded-3xl p-5 text-white relative overflow-hidden`}>
                {/* Decorative blobs */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />

                <div className="relative">
                    {/* Week badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-black mb-3">
                        📅 Week of {weeklyChallenge.weekStart}
                    </div>

                    {/* Icon + title */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                            {theme.icon}
                        </div>
                        <div>
                            <p className="font-black text-xl leading-tight">{challenge.title}</p>
                            <p className="text-sm opacity-80 leading-snug mt-0.5">{challenge.description}</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-xs font-bold opacity-80 mb-1">
                            <span>Progress</span>
                            <span>{progress.toLocaleString()} / {target.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                        <p className="text-right text-xs opacity-70 mt-1">{pct}% complete</p>
                    </div>
                </div>
            </div>

            {/* Rewards row */}
            <div className={`${theme.lightBg} rounded-2xl p-4`}>
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">🎁 Completion Rewards</p>
                <div className="flex items-center gap-4">
                    <div className="text-center flex-1">
                        <p className="font-black text-lg text-indigo-600 dark:text-indigo-400">⚡{challenge.xpReward.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">XP</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                    <div className="text-center flex-1">
                        <p className="font-black text-lg text-amber-600 dark:text-amber-400">🪙{challenge.coinReward.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">BizCoins</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                    <div className="text-center flex-1">
                        <p className="font-black text-lg">🏅</p>
                        <p className="text-xs text-gray-400">Badge</p>
                    </div>
                </div>
            </div>

            {/* Flash message */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 text-center"
                    >
                        <p className="text-2xl mb-1">🎉</p>
                        <p className="font-black text-green-700 dark:text-green-400">Rewards Claimed!</p>
                        <p className="text-sm text-green-600 dark:text-green-400">+{challenge.xpReward} XP &amp; 🪙{challenge.coinReward} BizCoins added</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA button */}
            {hasClaimed ? (
                <div className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-black text-sm text-center flex items-center justify-center gap-2">
                    ✅ Reward Claimed — See you next week!
                </div>
            ) : isComplete ? (
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleClaim}
                    className={`w-full py-3 rounded-2xl font-black text-white text-sm bg-gradient-to-r ${theme.bg} shadow-lg flex items-center justify-center gap-2 animate-pulse`}
                >
                    🎁 Claim Your Rewards!
                </motion.button>
            ) : (
                <div className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-sm text-center">
                    Complete the challenge to unlock your reward
                </div>
            )}

            {/* Leaderboard teaser */}
            <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">📊 Your Stats This Week</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="font-black text-base text-gray-800 dark:text-white">{user?.level ?? 1}</p>
                        <p className="text-[10px] text-gray-400">CEO Level</p>
                    </div>
                    <div>
                        <p className="font-black text-base text-gray-800 dark:text-white">{user?.streak ?? 0}🔥</p>
                        <p className="text-[10px] text-gray-400">Streak</p>
                    </div>
                    <div>
                        <p className="font-black text-base text-indigo-600 dark:text-indigo-400">{pct}%</p>
                        <p className="text-[10px] text-gray-400">Done</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CEOChallengeWidget;
