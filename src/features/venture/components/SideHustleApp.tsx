
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store';
import { SideHustle } from '../../../types';
import { Coins, Zap, Clock, Play, Sparkles, Trophy, Flame, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TapMinigame from './minigames/TapMinigame';
import SwipeMinigame from './minigames/SwipeMinigame';
import RhythmMinigame from './minigames/RhythmMinigame';
import QuizMinigame from './minigames/QuizMinigame';
import { getGigLevel, getGigLevelProgress } from '../../../store/slices/sideHustleSlice';
import { useEconomyStore } from "../../../store/economyStore";

// ─── Category colors ─────────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    Service: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-400' },
    Creative: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', dot: 'bg-pink-400' },
    Tech: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-400' },
    Business: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-400' },
};

const CATEGORY_EMOJIS: Record<string, string> = {
    Service: '🌿',
    Creative: '🎨',
    Tech: '💻',
    Business: '📈',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const GigCard = ({ job, gigXp, onClick }: { job: SideHustle; gigXp: Record<string, number>; onClick: () => void }) => {
    const { t } = useTranslation();
    const level = getGigLevel(job.id, gigXp);
    const progress = getGigLevelProgress(job.id, gigXp);
    const catStyle = CATEGORY_STYLES[job.category || 'Service'];

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={job.id}
            data-testid="gig-card"
            onClick={onClick}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl flex flex-col text-start hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700 group w-full"
        >
            {/* Header row */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-base text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {t(`gig_central.jobs.${job.id}.title` as any, job.title)}
                        </h3>
                        {level >= 5 && level < 10 && <span title="Gig Pro!" className="text-yellow-500 text-sm">⭐</span>}
                        {level >= 10 && <span title="Gig Master!" className="text-yellow-500 text-sm">👑</span>}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t(`gig_central.jobs.${job.id}.desc` as any, job.description)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 p-2.5 rounded-full transition-colors text-gray-300 dark:text-gray-500 group-hover:text-indigo-500 ml-3 flex-shrink-0">
                    <Play size={18} className="fill-current" />
                </div>
            </div>

            {/* Skill tags */}
            {job.skillTags && job.skillTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {job.skillTags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[11px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                            {t(`sideHustlesExtras.tags.${tag}` as any, tag)}
                        </span>
                    ))}
                </div>
            )}

            {/* Reward badges */}
            <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                    <Coins size={12} /> +{job.rewardCoins}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                    <Clock size={12} /> {job.durationSeconds}s
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                    <Zap size={12} /> -{job.energyCost}
                </span>
            </div>

            {/* Gig Level XP bar */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        {t('sideHustlesExtras.gigLevel', { level })}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                        {level >= 10 ? `👑 ${t('sideHustlesExtras.max')}` : `${Math.round(progress * 100)}%`}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${level >= 10 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: level >= 10 ? '100%' : `${progress * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </motion.button>
    );
};

// ─── Job Done Modal ───────────────────────────────────────────────────────────
const JobDoneModal = ({ job, coinsEarned, score, isNewLevel, newLevel, onClose }: {
    job: SideHustle;
    coinsEarned: number;
    score: number;
    isNewLevel: boolean;
    newLevel: number;
    onClose: () => void;
}) => {
    const { t } = useTranslation();
    const grade = score >= 90 ? { label: '🥇 Outstanding!', color: 'text-yellow-500' }
        : score >= 70 ? { label: '🥈 Great Job!', color: 'text-gray-400' }
            : score >= 50 ? { label: '🥉 Good Effort!', color: 'text-amber-600' }
                : { label: '💪 Keep Practicing!', color: 'text-indigo-500' };

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="text-5xl mb-3">
                        {score >= 90 ? '🎉' : score >= 70 ? '👏' : score >= 50 ? '😊' : '💪'}
                    </div>
                    <h2 className="text-2xl font-black mb-1">{t('sideHustlesExtras.jobDone')}</h2>
                    <p className="text-indigo-200 font-bold">{t(`gig_central.jobs.${job.id}.title` as any, job.title)}</p>
                </div>

                {/* Stats */}
                <div className="p-6">
                    <div className="flex gap-3 mb-5">
                        <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 text-center">
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">+{coinsEarned}</div>
                            <div className="text-xs font-bold text-emerald-500 uppercase mt-1">{t('sideHustlesExtras.coinsEarned')}</div>
                        </div>
                        <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 text-center">
                            <div className={`text-2xl font-black ${grade.color}`}>{Math.round(score)}%</div>
                            <div className="text-xs font-bold text-indigo-500 uppercase mt-1">{t('sideHustlesExtras.score')}</div>
                        </div>
                    </div>

                    <div className={`text-center font-black text-lg mb-5 ${grade.color}`}>{grade.label}</div>

                    {isNewLevel && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-2xl flex items-center gap-3 mb-5"
                        >
                            <span className="text-2xl">⭐</span>
                            <div>
                                <div className="font-black text-yellow-700 dark:text-yellow-300">{t('sideHustlesExtras.levelUpTitle')}</div>
                                <div className="text-sm text-yellow-600 dark:text-yellow-400">{t('sideHustlesExtras.levelUpDesc', { level: newLevel, job: t(`gig_central.jobs.${job.id}.title` as any, job.title) })}</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Life Tip */}
                    {job.lifeTip && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl mb-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-indigo-500" />
                                <span className="text-xs font-black text-indigo-500 uppercase tracking-wide">{t('sideHustlesExtras.realWorldInsight')}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{job.lifeTip}</p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg transition-all"
                    >
                        {t('sideHustlesExtras.btnAwesome')}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SideHustleApp = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAppStore();
    const { sideHustles, completeSideHustle, gigXp } = useEconomyStore();
    const [activeJob, setActiveJob] = useState<SideHustle | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);
    const scoreRef = React.useRef(0); // ref to avoid stale closure in timer
    const isFinishingRef = React.useRef(false); // prevent double-call guard
    const [jobResult, setJobResult] = useState<{ job: SideHustle; coinsEarned: number; score: number; isNewLevel: boolean; newLevel: number } | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // ─── Weekly Featured Gig (rotates every Monday, seeded by ISO week number) ───
    const { weeklyGig, daysUntilMonday } = useMemo(() => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const featured = sideHustles[weekNum % sideHustles.length];
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
        const daysLeft = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
        return { weeklyGig: featured, daysUntilMonday: daysLeft };
    }, [sideHustles]);

    // ─── Top 3 gigs by XP ─────────────────────────────────────────────────────
    const topGigs = useMemo(() => {
        return [...sideHustles]
            .filter(h => (gigXp[h.id] || 0) > 0)
            .sort((a, b) => (gigXp[b.id] || 0) - (gigXp[a.id] || 0))
            .slice(0, 3);
    }, [sideHustles, gigXp]);

    React.useEffect(() => {
        if (!activeJob) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [activeJob]);

    // Separate effect: when a job is running and timer hits 0, finish it
    React.useEffect(() => {
        if (activeJob && timeLeft === 0) {
            // Use a short timeout so the final score update from onScoreUpdate can settle first
            const t = setTimeout(() => finishJob(), 50);
            return () => clearTimeout(t);
        }
    }, [timeLeft, activeJob]);

    const startJob = (job: SideHustle) => {
        setActiveJob(job);
        setTimeLeft(job.durationSeconds);
        setScore(0);
        scoreRef.current = 0;
        isFinishingRef.current = false;
    };

    const finishJob = () => {
        if (!activeJob || isFinishingRef.current) return;
        isFinishingRef.current = true;
        const finalScore = scoreRef.current;
        const coinsEarned = Math.floor(activeJob.rewardCoins * (finalScore / 100));
        const levelBefore = getGigLevel(activeJob.id, gigXp);
        completeSideHustle(activeJob.id, finalScore / 100);
        // Peek what level will be after store updates
        const newGigXp = { ...gigXp, [activeJob.id]: (gigXp[activeJob.id] || 0) + 10 };
        const levelAfter = getGigLevel(activeJob.id, newGigXp);
        setJobResult({
            job: activeJob,
            coinsEarned,
            score: finalScore,
            isNewLevel: levelAfter > levelBefore,
            newLevel: levelAfter,
        });
        setActiveJob(null);
    };

    // Grouped by category
    const categories = ['All', 'Service', 'Business', 'Creative', 'Tech'];
    const filteredHustles = useMemo(() => {
        if (activeCategory === 'All') return sideHustles;
        return sideHustles.filter(h => h.category === activeCategory);
    }, [sideHustles, activeCategory]);

    // ─── Rendering the Active Minigame ─────────────────────────────────────────
    if (activeJob) {
        const MinigameComponent = (() => {
            switch (activeJob.minigameType) {
                case 'TAP': return TapMinigame;
                case 'SWIPE': return SwipeMinigame;
                case 'RHYTHM': return RhythmMinigame;
                case 'QUIZ': return QuizMinigame;
                default: return TapMinigame;
            }
        })();

        return (
            <div className="relative h-full flex flex-col">
                <div className="absolute top-4 left-4 z-50">
                    <button
                        onClick={() => {
                            if (window.confirm(t('sideHustlesExtras.quitConfirm'))) {
                                setActiveJob(null);
                            }
                        }}
                        className="bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 transition-all backdrop-blur-sm"
                    >
                        ← Exit
                    </button>
                </div>
                <MinigameComponent
                    gig={activeJob}
                    onScoreUpdate={(newScore) => { setScore(newScore); scoreRef.current = newScore; }}
                    timeLeft={timeLeft}
                />
            </div>
        );
    }

    // ─── Main Gig Board ───────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-fade-in pb-24 px-4 md:px-0 mt-4 md:mt-0">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-sm transition-colors w-fit -mt-2 md:mb-2"
            >
                <ChevronLeft className="w-5 h-5" /> {t('common.back', 'Back to Dashboard')}
            </button>

            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-7 rounded-3xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black mb-1">{t('gig_central.title')}</h1>
                        <p className="opacity-90 font-medium">{t('gig_central.subtitle')}</p>
                    </div>
                    {user && (
                        <div className="bg-white/20 rounded-2xl px-4 py-3 text-center">
                            <div className="text-xl font-black">{user.bizCoins.toLocaleString()}</div>
                            <div className="text-xs opacity-80 font-bold uppercase tracking-wide flex items-center gap-1 justify-center"><Coins size={10} /> Coins</div>
                        </div>
                    )}
                </div>
            </header>

            {/* Weekly Featured Gig */}
            {weeklyGig && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-5 text-white overflow-hidden shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
                >
                    <div className="absolute top-0 right-0 opacity-10 text-9xl select-none">⭐</div>
                    <div className="flex items-center gap-2 mb-2">
                        <Flame size={16} className="fill-white" />
                        <span className="text-xs font-black uppercase tracking-widest">{t('sideHustlesExtras.weeklyFeaturedTitle')}</span>
                        <span className="ml-auto bg-white/30 text-white text-xs font-black px-2 py-0.5 rounded-full">{t('sideHustlesExtras.coinsTarget')}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black mb-0.5">{t(`gig_central.jobs.${weeklyGig.id}.title` as any, weeklyGig.title)}</h3>
                            <p className="text-orange-100 text-sm font-medium">{t(`gig_central.jobs.${weeklyGig.id}.desc` as any, weeklyGig.description)}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                                    <Coins size={11} /> +{weeklyGig.rewardCoins * 3} coins
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                                    <Clock size={11} /> {t('sideHustlesExtras.resetsIn', { days: daysUntilMonday })}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => startJob({ ...weeklyGig, rewardCoins: weeklyGig.rewardCoins * 3 })}
                            className="flex-shrink-0 bg-white text-orange-500 font-black px-5 py-3 rounded-2xl shadow-md hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Play size={16} className="fill-orange-500" /> {t('sideHustlesExtras.play')}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm transition-all ${activeCategory === cat
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        {cat !== 'All' && <span>{CATEGORY_EMOJIS[cat]}</span>}
                        {t(`sideHustlesExtras.categories.${cat}` as any, cat)}
                    </button>
                ))}
            </div>

            {/* Gig Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHustles.map(job => (
                    <GigCard key={job.id} job={job} gigXp={gigXp} onClick={() => startJob(job)} />
                ))}
            </div>

            {/* Top Earner Leaderboard */}
            {topGigs.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy size={18} className="text-yellow-500" />
                        <h2 className="font-black text-gray-800 dark:text-white">{t('sideHustlesExtras.leaderboardTitle')}</h2>
                    </div>
                    <div className="space-y-3">
                        {topGigs.map((gig, i) => {
                            const level = getGigLevel(gig.id, gigXp);
                            const progress = getGigLevelProgress(gig.id, gigXp);
                            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                            return (
                                <div key={gig.id} className="flex items-center gap-3">
                                    <span className="text-xl w-8">{medal}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{t(`gig_central.jobs.${gig.id}.title` as any, gig.title)}</span>
                                            <span className="text-xs font-black text-indigo-500">Lvl {level}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${level >= 10 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'}`}
                                                style={{ width: level >= 10 ? '100%' : `${progress * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Job Done Modal */}
            <AnimatePresence>
                {jobResult && (
                    <JobDoneModal
                        {...jobResult}
                        onClose={() => setJobResult(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default SideHustleApp;
