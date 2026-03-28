import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Circle, Zap, Coins, X, ChevronRight, Clock } from 'lucide-react';
import { useAppStore } from '../../../store';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WeeklyChallenge {
    id: string;
    emoji: string;
    title: string;
    desc: string;
    reward: { type: 'coins' | 'xp'; value: number };
    action: 'play_game' | 'complete_lesson' | 'do_gig' | 'visit_store' | 'check_leaderboard' | 'spin_wheel';
}

// ─── Challenge Pool — 30 challenges rotated weekly ───────────────────────────
const CHALLENGE_POOL: WeeklyChallenge[] = [
    { id: 'c1', emoji: '🎮', title: 'Arcade Hustle', desc: 'Play any arcade game this week', reward: { type: 'coins', value: 150 }, action: 'play_game' },
    { id: 'c2', emoji: '📚', title: 'Knowledge Drop', desc: 'Complete a lesson on the Learning Map', reward: { type: 'xp', value: 200 }, action: 'complete_lesson' },
    { id: 'c3', emoji: '💼', title: 'Side Hustle Boss', desc: 'Finish a Gig Central job', reward: { type: 'coins', value: 200 }, action: 'do_gig' },
    { id: 'c4', emoji: '🎰', title: 'Daily Spinner', desc: 'Use the Daily Spin Wheel', reward: { type: 'coins', value: 100 }, action: 'spin_wheel' },
    { id: 'c5', emoji: '🏆', title: 'Leaderboard Check', desc: 'Visit the Leaderboard page', reward: { type: 'xp', value: 100 }, action: 'check_leaderboard' },
    { id: 'c6', emoji: '🛒', title: 'Shopping Spree', desc: 'Visit the Biz Store', reward: { type: 'coins', value: 100 }, action: 'visit_store' },
    { id: 'c7', emoji: '🚀', title: 'Launch Ready', desc: 'Play a business simulation game', reward: { type: 'coins', value: 175 }, action: 'play_game' },
    { id: 'c8', emoji: '🧠', title: 'Brain Power', desc: 'Complete 2 lessons on the map', reward: { type: 'xp', value: 300 }, action: 'complete_lesson' },
    { id: 'c9', emoji: '💰', title: 'Coin Collector', desc: 'Earn coins from a Gig', reward: { type: 'coins', value: 250 }, action: 'do_gig' },
    { id: 'c10', emoji: '⚡', title: 'XP Booster', desc: 'Earn XP from any activity', reward: { type: 'xp', value: 150 }, action: 'complete_lesson' },
    { id: 'c11', emoji: '🎯', title: 'Pitch Master', desc: 'Play any arcade game', reward: { type: 'coins', value: 200 }, action: 'play_game' },
    { id: 'c12', emoji: '📈', title: 'Growth Mindset', desc: 'Complete a business lesson', reward: { type: 'xp', value: 250 }, action: 'complete_lesson' },
    { id: 'c13', emoji: '🏗️', title: 'Empire Builder', desc: 'Visit the Biz Store', reward: { type: 'coins', value: 125 }, action: 'visit_store' },
    { id: 'c14', emoji: '🌟', title: 'Star Player', desc: 'Crack the Leaderboard', reward: { type: 'xp', value: 200 }, action: 'check_leaderboard' },
    { id: 'c15', emoji: '🔥', title: 'On Fire', desc: 'Spin the Daily Wheel', reward: { type: 'coins', value: 125 }, action: 'spin_wheel' },
    { id: 'c16', emoji: '🎓', title: 'Scholar', desc: 'Complete a lesson module', reward: { type: 'xp', value: 300 }, action: 'complete_lesson' },
    { id: 'c17', emoji: '💡', title: 'Big Idea', desc: 'Play any game in the Arcade', reward: { type: 'coins', value: 150 }, action: 'play_game' },
    { id: 'c18', emoji: '🏅', title: 'Gig Hero', desc: 'Complete a Gig Central mission', reward: { type: 'xp', value: 175 }, action: 'do_gig' },
    { id: 'c19', emoji: '🛍️', title: 'Savvy Shopper', desc: 'Browse the Biz Store', reward: { type: 'coins', value: 100 }, action: 'visit_store' },
    { id: 'c20', emoji: '📊', title: 'Data Driven', desc: 'Check your rank on the Leaderboard', reward: { type: 'xp', value: 125 }, action: 'check_leaderboard' },
    { id: 'c21', emoji: '🎲', title: 'Lucky Spin', desc: 'Try your luck on the Daily Wheel', reward: { type: 'coins', value: 150 }, action: 'spin_wheel' },
    { id: 'c22', emoji: '🏋️', title: 'Hustle Hard', desc: 'Complete any 2 gig jobs this week', reward: { type: 'coins', value: 300 }, action: 'do_gig' },
    { id: 'c23', emoji: '🌍', title: 'World Beater', desc: 'Beat a score in any arcade game', reward: { type: 'xp', value: 200 }, action: 'play_game' },
    { id: 'c24', emoji: '💎', title: 'Diamond Mind', desc: 'Complete an advanced lesson', reward: { type: 'xp', value: 350 }, action: 'complete_lesson' },
    { id: 'c25', emoji: '🚂', title: 'Full Steam', desc: 'Play any game this week', reward: { type: 'coins', value: 200 }, action: 'play_game' },
    { id: 'c26', emoji: '🎪', title: 'Show Time', desc: 'Visit the Biz Store once', reward: { type: 'xp', value: 100 }, action: 'visit_store' },
    { id: 'c27', emoji: '🦁', title: 'Top Dog', desc: 'Check the global Leaderboard', reward: { type: 'coins', value: 150 }, action: 'check_leaderboard' },
    { id: 'c28', emoji: '🎁', title: 'Gift Day', desc: 'Use the Daily Spin Wheel', reward: { type: 'xp', value: 150 }, action: 'spin_wheel' },
    { id: 'c29', emoji: '🏦', title: 'Banker Mode', desc: 'Earn BizCoins from a Gig', reward: { type: 'coins', value: 275 }, action: 'do_gig' },
    { id: 'c30', emoji: '📡', title: 'Signal Boost', desc: 'Complete a lesson on the Learning Map', reward: { type: 'xp', value: 275 }, action: 'complete_lesson' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the ISO week number (1-52) for a given date */
function getISOWeek(date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getWeekKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-W${getISOWeek(now)}`;
}

/** Deterministically pick 3 challenges for the current week based on week key */
function getWeeklyChallenges(): WeeklyChallenge[] {
    const weekNum = getISOWeek();
    const offset = (weekNum * 3) % CHALLENGE_POOL.length;
    const result: WeeklyChallenge[] = [];
    for (let i = 0; i < 3; i++) {
        result.push(CHALLENGE_POOL[(offset + i) % CHALLENGE_POOL.length]);
    }
    return result;
}

/** Returns number of days until next Monday */
function daysUntilMonday(): number {
    const day = new Date().getDay(); // 0=Sun, 1=Mon...
    return day === 1 ? 7 : ((8 - day) % 7);
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface WeeklyCEOChallengeProps {
    onClose?: () => void;
    onNavigate?: (path: string) => void;
}

export const WeeklyCEOChallenge: React.FC<WeeklyCEOChallengeProps> = ({ onClose, onNavigate }) => {
    const { t } = useTranslation();
    const { user, claimWeeklyChallenge } = useAppStore();
    const [showBonus, setShowBonus] = useState(false);

    const weekKey = getWeekKey();
    const challenges = useMemo(() => getWeeklyChallenges(), []);
    const completed: string[] = useMemo(() => {
        if (!user?.weeklyChallenges || user.weeklyChallenges.weekKey !== weekKey) return [];
        return user.weeklyChallenges.completed ?? [];
    }, [user?.weeklyChallenges, weekKey]);

    const allDone = completed.length >= 3;

    // Claim a challenge
    const handleClaim = (challenge: WeeklyChallenge) => {
        if (completed.includes(challenge.id)) return;
        claimWeeklyChallenge(challenge, weekKey);

        const newCount = completed.length + 1;
        if (newCount >= 3) {
            // All done — mega confetti + show bonus overlay
            confetti({ particleCount: 200, spread: 140, origin: { y: 0.5 } });
            setTimeout(() => confetti({ particleCount: 100, spread: 80, angle: 60, origin: { y: 0.5 } }), 300);
            setTimeout(() => confetti({ particleCount: 100, spread: 80, angle: 120, origin: { y: 0.5 } }), 600);
            setShowBonus(true);
        } else {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
    };

    const handleNavigate = (action: WeeklyChallenge['action']) => {
        if (!onNavigate) return;
        const MAP: Record<string, string> = {
            play_game: '/games',
            complete_lesson: '/map',
            do_gig: '/side-hustle',
            visit_store: '/store',
            check_leaderboard: '/leaderboard',
            spin_wheel: '', // handled inline
        };
        if (MAP[action]) onNavigate(MAP[action]);
        if (onClose) onClose();
    };

    return (
        <div className="flex flex-col gap-5 p-2 max-w-md w-full mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <Trophy className="w-7 h-7 text-yellow-500" />
                        {t('weekly.title')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('weekly.subtitle')}</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <span>{t('weekly.progress', { done: completed.length, total: 3 })}</span>
                    <span className="flex items-center gap-1 text-orange-500">
                        <Clock size={14} />
                        {t('weekly.resets_in', { days: daysUntilMonday() })}
                    </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completed.length / 3) * 100}%` }}
                        transition={{ duration: 0.6, type: 'spring' }}
                    />
                </div>
            </div>

            {/* Challenge Cards */}
            <div className="space-y-3">
                {challenges.map((ch, idx) => {
                    const isDone = completed.includes(ch.id);
                    return (
                        <motion.div
                            key={ch.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isDone
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-400'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:shadow-md'
                                }`}
                        >
                            {/* Emoji Badge */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${isDone ? 'bg-green-100 dark:bg-green-800' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
                                {isDone ? '✅' : ch.emoji}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold truncate ${isDone ? 'text-green-700 dark:text-green-400 line-through opacity-70' : 'text-gray-800 dark:text-white'}`}>
                                    {ch.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{ch.desc}</p>
                                <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${ch.reward.type === 'coins' ? 'text-yellow-600' : 'text-blue-500'}`}>
                                    {ch.reward.type === 'coins'
                                        ? <><Coins size={12} /> +{ch.reward.value} BizCoins</>
                                        : <><Zap size={12} /> +{ch.reward.value} XP</>
                                    }
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isDone ? (
                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => handleClaim(ch)}
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                                    >
                                        {t('weekly.claim')}
                                    </button>
                                    {onNavigate && (
                                        <button
                                            onClick={() => handleNavigate(ch.action)}
                                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                                        >
                                            Go <ChevronRight size={10} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <CheckCircle2 className="text-green-500 shrink-0" size={26} />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Weekly Bonus Section */}
            <div className={`rounded-2xl p-4 text-center transition-all ${allDone
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400'
                }`}>
                {allDone ? (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="space-y-1"
                    >
                        <div className="text-3xl">🏆</div>
                        <p className="font-black text-lg">{t('weekly.all_done_title')}</p>
                        <p className="text-sm font-medium opacity-90">{t('weekly.all_done_desc')}</p>
                    </motion.div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex justify-center">
                            {[...Array(3)].map((_, i) => (
                                i < completed.length
                                    ? <CheckCircle2 key={i} size={20} className="text-indigo-400" />
                                    : <Circle key={i} size={20} className="text-gray-300 dark:text-gray-600" />
                            ))}
                        </div>
                        <p className="text-xs font-semibold">{t('weekly.bonus_hint')}</p>
                    </div>
                )}
            </div>

            {/* All-Complete Overlay */}
            <AnimatePresence>
                {showBonus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowBonus(false)}
                    >
                        <div
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full mx-4 text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-6xl">🏆</div>
                            <h3 className="text-2xl font-black text-yellow-500">{t('weekly.all_done_title')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('weekly.all_done_desc')}</p>
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-6 py-3 text-white font-black text-xl">
                                +500 🪙 Bonus!
                            </div>
                            <button
                                onClick={() => setShowBonus(false)}
                                className="w-full py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('weekly.close')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WeeklyCEOChallenge;
