import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { TurnaroundScenario } from '../../../types';
import { AlertTriangle, CheckCircle2, DollarSign, Flame, ArrowRight, ShieldAlert, X, ChevronRight, Trophy, RotateCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Default theme used when a scenario has no theme data
const DEFAULT_THEME = {
    emoji: '🛡️',
    accentColor: 'red',
    tagline: 'A company is in crisis. Can you turn it around in time?',
    bgClass: 'bg-gray-50 dark:bg-gray-800',
    badgeClass: 'text-red-500 dark:text-red-400',
    btnClass: 'bg-red-600 hover:bg-red-700 shadow-red-200',
    surpriseEvent: undefined as undefined | { headline: string; cashDelta: number; burnDelta: number },
};

const ScenarioEngine = () => {
    const { activeScenario, updateScenarioState, endScenario } = useAppStore();
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [turnLog, setTurnLog] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [gameState, setGameState] = useState<'BRIEFING' | 'PLAYING' | 'WIN' | 'LOSE'>('BRIEFING');
    const [surpriseFired, setSurpriseFired] = useState(false);
    const [surpriseVisible, setSurpriseVisible] = useState<string | null>(null);
    const { t } = useTranslation();

    if (!activeScenario) return null;

    const theme = activeScenario.theme ?? DEFAULT_THEME;

    // Helper to get localized scenario strings
    const getScenarioTitle = () => t(`scenarios.${activeScenario.id}.title`, { defaultValue: activeScenario.title });
    const getCompanyName = () => t(`scenarios.${activeScenario.id}.company_name`, { defaultValue: activeScenario.companyName });
    const getIssueDesc = (issue: any) => t(`scenarios.${activeScenario.id}.issues.${issue.id}`, { defaultValue: issue.description });
    const getValues_Goal = () => t(`scenarios.${activeScenario.id}.goal`, { turns: activeScenario.turns, cash: activeScenario.winCondition.minCash, defaultValue: `Survive ${activeScenario.turns} days.` });


    const handleRestart = () => {
        if (!activeScenario) return;
        updateScenarioState({
            initialCash: activeScenario.initialCash,
            initialBurnRate: activeScenario.initialBurnRate,
            turns: activeScenario.turns,
            issues: activeScenario.issues.map(i => ({ ...i, fixed: false }))
        });
        setTurnLog([]);
        setSelectedIssueId(null);
        setIsAnimating(false);
        setSurpriseFired(false);
        setSurpriseVisible(null);
        setGameState('PLAYING');
    };

    const handleEndDay = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        let newCash = activeScenario.initialCash;
        let newBurn = activeScenario.initialBurnRate;
        const newLog = [...turnLog];

        // Apply fix if selected
        if (selectedIssueId) {
            const issue = activeScenario.issues.find(i => i.id === selectedIssueId);
            if (issue && !issue.fixed) {
                if (newCash >= issue.costToFix) {
                    newCash -= issue.costToFix;
                    newBurn -= issue.impactOnBurn;
                    const updatedIssues = activeScenario.issues.map(i =>
                        i.id === issue.id ? { ...i, fixed: true } : i
                    );
                    updateScenarioState({ issues: updatedIssues });
                    newLog.push(`🛠️ Fixed: ${getIssueDesc(issue)} (-$${issue.costToFix})`);
                } else {
                    newLog.push(`❌ Not enough cash to fix ${getIssueDesc(issue)}`);
                }
            }
        }

        // Apply Burn
        newCash -= newBurn;
        newLog.push(`🔥 Burn Rate consumed $${newBurn}`);

        // ── Surprise Event fires on turn 3 (from the end), once per boss ──
        const turnsElapsed = activeScenario.turns; // will be decremented below
        const surprise = theme.surpriseEvent;
        if (surprise && !surpriseFired && turnsElapsed === 3) {
            newCash += surprise.cashDelta;
            newBurn += surprise.burnDelta;
            const cashStr = surprise.cashDelta > 0 ? `+$${surprise.cashDelta}` : surprise.cashDelta < 0 ? `-$${Math.abs(surprise.cashDelta)}` : '';
            const burnStr = surprise.burnDelta < 0 ? ` Burn -$${Math.abs(surprise.burnDelta)}/day` : surprise.burnDelta > 0 ? ` Burn +$${surprise.burnDelta}/day` : '';
            newLog.push(`⚡ SURPRISE: ${surprise.headline} ${cashStr}${burnStr}`);
            setSurpriseFired(true);
            setSurpriseVisible(surprise.headline);
            setTimeout(() => setSurpriseVisible(null), 4000);
        }

        // Update State
        updateScenarioState({
            initialCash: newCash,
            initialBurnRate: newBurn,
            turns: activeScenario.turns - 1
        });

        setTurnLog(newLog);
        setSelectedIssueId(null);

        setTimeout(() => {
            setIsAnimating(false);
            checkWinCondition(newCash, newBurn, activeScenario.turns - 1);
        }, 1000);
    };

    const checkWinCondition = (cash: number, burn: number, turns: number) => {
        if (cash <= 0) {
            setGameState('LOSE');
        } else if (turns <= 0) {
            if (cash >= activeScenario.winCondition.minCash && burn <= activeScenario.winCondition.maxBurn) {
                setGameState('WIN');
            } else {
                setGameState('LOSE');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

            {/* BRIEFING MODAL */}
            <AnimatePresence>
                {gameState === 'BRIEFING' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white dark:bg-gray-900 max-w-lg w-full rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            {/* Colored accent top bar */}
                            <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl bg-gradient-to-r from-current ${theme.badgeClass}`} />

                            <button
                                onClick={() => endScenario(false)}
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Big emoji boss avatar */}
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl shadow-inner">
                                {theme.emoji}
                            </div>

                            <div className={`text-xs font-black text-center uppercase tracking-widest mb-1 flex items-center justify-center gap-1 ${theme.badgeClass}`}>
                                <ShieldAlert size={14} /> Boss Battle
                            </div>
                            <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-1">{getScenarioTitle()}</h2>
                            <p className="text-center text-sm font-bold text-gray-400 mb-5">{getCompanyName()}</p>

                            {/* Dramatic tagline */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-5 border border-gray-100 dark:border-gray-700 text-center">
                                <p className="text-gray-700 dark:text-gray-300 font-medium italic">"{theme.tagline}"</p>
                            </div>

                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>🎯 Goal:</span>
                                    <span className="font-bold text-gray-700 dark:text-gray-200">{getValues_Goal()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>💰 Starting Cash:</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">${activeScenario.initialCash}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>🔥 Daily Burn:</span>
                                    <span className="font-bold text-red-500">-${activeScenario.initialBurnRate}/day</span>
                                </div>
                                {theme.surpriseEvent && (
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                        <span>⚡ Surprise:</span>
                                        <span className="font-bold text-yellow-500">Hidden on Day 3!</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setGameState('PLAYING')}
                                className={`w-full py-4 text-white font-black rounded-xl text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${theme.btnClass}`}
                            >
                                Start Mission <ChevronRight size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* WIN MODAL */}
                {gameState === 'WIN' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-white dark:bg-gray-800 max-w-lg w-full rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 dark:border-yellow-500 text-center">
                            <div className="text-6xl mb-4">{theme.emoji}</div>
                            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                                <Trophy size={40} fill="currentColor" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase">Mission Complete!</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">You saved {getCompanyName()}! 🎉</p>

                            <div className="flex gap-4 justify-center mb-8">
                                <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <div className="text-xs font-bold text-blue-400 uppercase">Reward</div>
                                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">+1000 Coins</div>
                                </div>
                            </div>

                            <button
                                onClick={() => endScenario(true)}
                                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl text-lg shadow-lg shadow-green-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Continue Journey <ArrowRight size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* LOSE MODAL */}
                {gameState === 'LOSE' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-white dark:bg-gray-800 max-w-lg w-full rounded-3xl p-8 shadow-2xl border-4 border-gray-300 dark:border-gray-600 text-center">
                            <div className="text-6xl mb-4 grayscale opacity-60">{theme.emoji}</div>
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <Flame size={40} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase">Mission Failed</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">The company ran out of money. Try again!</p>

                            <button
                                onClick={handleRestart}
                                className={`w-full py-4 text-white font-black rounded-xl text-lg transition-all flex items-center justify-center gap-2 ${theme.btnClass}`}
                            >
                                Try Again <RotateCcw size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── SURPRISE EVENT TOAST ─────────────────────────────────── */}
            <AnimatePresence>
                {surpriseVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -80, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.9 }}
                        className="absolute top-6 left-1/2 -translate-x-1/2 z-[200] bg-yellow-400 text-yellow-900 font-black text-sm px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap"
                    >
                        <Zap size={18} className="text-yellow-800" />
                        {surpriseVisible}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row h-[90vh] transition-all duration-300 ${gameState !== 'PLAYING' ? 'scale-95 opacity-50 blur-sm pointer-events-none' : 'scale-100 opacity-100'}`}>

                {/* Sidebar: Stats */}
                <div className={`${theme.bgClass} p-8 w-full md:w-80 flex flex-col border-r border-gray-200 dark:border-gray-700`}>
                    <div className="mb-6 relative">
                        <button
                            onClick={() => endScenario(false)}
                            className="absolute -top-2 -left-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            title="Exit Mission"
                        >
                            <X size={20} />
                        </button>
                        <div className="text-center">
                            {/* Boss emoji avatar in sidebar */}
                            <div className="text-4xl mb-2">{theme.emoji}</div>
                            <div className={`text-xs font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1 ${theme.badgeClass}`}>
                                <ShieldAlert size={12} /> Boss Battle
                            </div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{getScenarioTitle()}</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mt-1">{getCompanyName()}</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-white/70 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Cash Available</div>
                            <div className={`text-3xl font-mono font-black ${activeScenario.initialCash < 500 ? 'text-red-500 animate-pulse' : 'text-green-600 dark:text-green-400'}`}>
                                ${activeScenario.initialCash.toLocaleString()}
                            </div>
                        </div>

                        <div className="p-4 bg-white/70 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Daily Burn Rate</div>
                            <div className="text-3xl font-mono font-black text-red-500 dark:text-red-400">
                                -${activeScenario.initialBurnRate}<span className="text-sm text-gray-400 dark:text-gray-600">/day</span>
                            </div>
                        </div>

                        <div className="p-4 bg-white/70 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Days Remaining</div>
                            <div className="flex items-end gap-2">
                                <div className={`text-4xl font-black ${activeScenario.turns <= 2 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                                    {activeScenario.turns}
                                </div>
                                {/* Day pips */}
                                <div className="flex gap-1 pb-1">
                                    {Array.from({ length: Math.max(0, activeScenario.turns) }).map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < activeScenario.turns ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Surprise event teaser */}
                        {theme.surpriseEvent && !surpriseFired && activeScenario.turns > 3 && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
                                <Zap size={14} className="text-yellow-500 flex-shrink-0" />
                                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400">⚡ Surprise event incoming on Day 3!</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleEndDay}
                        disabled={isAnimating || activeScenario.turns <= 0}
                        className={`mt-4 w-full py-4 text-white font-black rounded-xl text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${theme.btnClass}`}
                    >
                        {isAnimating ? 'Processing...' : (<>End Day <ArrowRight size={20} /></>)}
                    </button>
                    {!selectedIssueId && !isAnimating && (
                        <p className="text-center text-xs text-red-500 dark:text-red-400 mt-2 font-bold animate-pulse">⚠️ Warning: No fix selected!</p>
                    )}
                </div>

                {/* Main: Issues Panel */}
                <div className="flex-1 bg-white dark:bg-gray-900 p-8 overflow-y-auto relative">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" /> Operational Issues
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {activeScenario.issues.map(issue => (
                            <motion.button
                                key={issue.id}
                                layout
                                disabled={issue.fixed}
                                onClick={() => setSelectedIssueId(selectedIssueId === issue.id ? null : issue.id)}
                                whileHover={!issue.fixed ? { scale: 1.01 } : {}}
                                whileTap={!issue.fixed ? { scale: 0.98 } : {}}
                                className={`p-6 rounded-2xl text-left border-2 transition-all group relative
                                    ${issue.fixed
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50 opacity-60'
                                        : selectedIssueId === issue.id
                                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 shadow-xl ring-2 ring-blue-200 dark:ring-blue-800'
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider
                                        ${issue.severity === 'CRITICAL'
                                            ? 'bg-red-100 text-red-600 dark:bg-red-500 dark:text-white'
                                            : issue.severity === 'MEDIUM'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-black'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200'
                                        }`}
                                    >
                                        {issue.severity}
                                    </div>
                                    <div className="font-mono font-bold text-green-600 dark:text-green-400 text-sm">
                                        COST: ${issue.costToFix}
                                    </div>
                                </div>
                                <h3 className={`text-lg font-bold mb-1 ${issue.fixed ? 'text-green-600 dark:text-green-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                    {getIssueDesc(issue)}
                                </h3>
                                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-2">
                                    <Flame size={14} className="text-red-500" />
                                    Impact: Reduces burn by ${issue.impactOnBurn}/day
                                </div>

                                {issue.fixed && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-1/2 right-6 -translate-y-1/2"
                                    >
                                        <CheckCircle2 size={32} className="text-green-500" />
                                    </motion.div>
                                )}
                                {selectedIssueId === issue.id && !issue.fixed && (
                                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Event Log */}
                    <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <h3 className="text-gray-400 font-bold uppercase text-xs mb-3 flex items-center gap-2">
                            <DollarSign size={12} /> Event Log
                        </h3>
                        <div className="space-y-1.5 font-mono text-sm max-h-40 overflow-y-auto">
                            {turnLog.length === 0 && (
                                <p className="text-gray-300 dark:text-gray-600 italic text-xs">No events yet. End the first day to start.</p>
                            )}
                            {[...turnLog].reverse().map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`border-l-2 pl-3 py-1 text-xs ${log.includes('⚡') ? 'border-yellow-400 text-yellow-700 dark:text-yellow-400 font-bold bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg' :
                                            log.includes('🛠️') ? 'border-green-400 text-green-600 dark:text-green-400' :
                                                log.includes('❌') ? 'border-red-400 text-red-600 dark:text-red-400' :
                                                    'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}
                                >
                                    {log}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioEngine;
