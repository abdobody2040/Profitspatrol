import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Heart, TrendingUp, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Scenario {
    id: string;
    image?: string;
    impact: {
        profit: number;
        reputation: number;
    };
}

interface GameState {
    profit: number;
    reputation: number;
    history: string[]; // Track choices made
}

interface EthicalDilemmaTemplateProps {
    onComplete: (score: number, data: any) => void;
}

const EthicalDilemmaTemplate: React.FC<EthicalDilemmaTemplateProps> = ({ onComplete }) => {
    const { t } = useTranslation();

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [gameState, setGameState] = useState<GameState>({
        profit: 50,
        reputation: 50,
        history: []
    });
    const [showResult, setShowResult] = useState(false);
    const [lastImpact, setLastImpact] = useState<{ profit: number; reputation: number } | null>(null);

    // Scenarios are loaded from translations to ensure they are localized
    // We use IDs '1', '2', '3', etc. to look up:
    // games.ethics.scenarios.1.title
    // games.ethics.scenarios.1.desc
    // games.ethics.scenarios.1.options.a (text), .b (text)
    const SCENARIO_COUNT = 3;

    // Hardcoded impacts for the scenarios (could also be moved to data if complex)
    const SCENARIO_IMPACTS: Record<string, { a: { profit: number, reputation: number }, b: { profit: number, reputation: number } }> = {
        '1': {
            // Sourcing: Cheap/Unethical vs Fair/Expensive
            a: { profit: 20, reputation: -15 },
            b: { profit: -10, reputation: 25 }
        },
        '2': {
            // Waste: Dump/Free vs Recycle/Cost
            a: { profit: 15, reputation: -20 },
            b: { profit: -5, reputation: 20 }
        },
        '3': {
            // Marketing: Lie/Hype vs Truth/Boring
            a: { profit: 25, reputation: -25 },
            b: { profit: 5, reputation: 15 }
        }
    };

    const handleChoice = (choice: 'a' | 'b') => {
        const impact = SCENARIO_IMPACTS[String(scenarioIndex + 1)][choice];

        setGameState(prev => ({
            ...prev,
            profit: Math.min(100, Math.max(0, prev.profit + impact.profit)),
            reputation: Math.min(100, Math.max(0, prev.reputation + impact.reputation)),
            history: [...prev.history, choice]
        }));

        setLastImpact(impact);
        setShowResult(true);
    };

    const nextScenario = () => {
        setLastImpact(null);
        setShowResult(false);

        if (scenarioIndex + 1 >= SCENARIO_COUNT) {
            endGame();
        } else {
            setScenarioIndex(prev => prev + 1);
        }
    };

    const endGame = () => {
        // Score calculation
        // We want a balance. High profit with 0 reputation is bad.
        // 50/50 is okay. 80/80 is amazing.
        const average = (gameState.profit + gameState.reputation) / 2;
        // Penalty for extreme imbalance
        const imbalance = Math.abs(gameState.profit - gameState.reputation);
        const finalScore = Math.floor(average - (imbalance * 0.2));

        setTimeout(() => {
            onComplete(finalScore, {
                profit: gameState.profit,
                reputation: gameState.reputation,
                ethics_rating: gameState.reputation > 70 ? 'Saint' : gameState.reputation > 40 ? 'Hustler' : 'Villain'
            });
        }, 500);
    };

    const currentId = String(scenarioIndex + 1);

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative font-sans">

            {/* HEADER STATS */}
            <div className="bg-white dark:bg-slate-800 p-4 shadow-sm flex justify-around items-center z-10">
                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {t('games.ethics.ui.profit')}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                            <TrendingUp size={20} />
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">
                            {gameState.profit}%
                        </div>
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {t('games.ethics.ui.reputation')}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full text-pink-600">
                            <Heart size={20} />
                        </div>
                        <div className="text-2xl font-black text-slate-800 dark:text-white">
                            {gameState.reputation}%
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-center max-w-3xl mx-auto w-full">

                <AnimatePresence mode='wait'>
                    {!showResult ? (
                        <motion.div
                            key="scenario"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border-l-8 border-indigo-500">
                                <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-bold uppercase mb-4">
                                    {t('games.ethics.ui.scenario')} {scenarioIndex + 1} / {SCENARIO_COUNT}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-4">
                                    {t(`games.ethics.scenarios.${currentId}.title` as any)}
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {t(`games.ethics.scenarios.${currentId}.desc` as any)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleChoice('a')}
                                    className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left shadow-sm hover:shadow-md"
                                >
                                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                        <span className="font-black text-4xl opacity-20">A</span>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="block text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase mb-1">
                                            {t('games.ethics.ui.option')} A
                                        </span>
                                        <span className="font-bold text-lg text-slate-800 dark:text-gray-200">
                                            {t(`games.ethics.scenarios.${currentId}.options.a` as any)}
                                        </span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleChoice('b')}
                                    className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-left shadow-sm hover:shadow-md"
                                >
                                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                                        <span className="font-black text-4xl opacity-20">B</span>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="block text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase mb-1">
                                            {t('games.ethics.ui.option')} B
                                        </span>
                                        <span className="font-bold text-lg text-slate-800 dark:text-gray-200">
                                            {t(`games.ethics.scenarios.${currentId}.options.b` as any)}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-full mb-4">
                                <CheckCircle2 size={48} className="text-indigo-600 dark:text-indigo-400" />
                            </div>

                            <h3 className="text-3xl font-black text-slate-800 dark:text-white">
                                {t('games.ethics.ui.decision_made')}
                            </h3>

                            {/* Impact Visualizer */}
                            <div className="flex justify-center gap-8">
                                {lastImpact && (
                                    <>
                                        <div className={`flex items-center gap-2 text-xl font-bold ${lastImpact.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            <TrendingUp size={24} />
                                            {lastImpact.profit > 0 ? '+' : ''}{lastImpact.profit}%
                                        </div>
                                        <div className={`flex items-center gap-2 text-xl font-bold ${lastImpact.reputation >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            <Heart size={24} />
                                            {lastImpact.reputation > 0 ? '+' : ''}{lastImpact.reputation}%
                                        </div>
                                    </>
                                )}
                            </div>

                            <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400">
                                {t(`games.ethics.scenarios.${currentId}.feedback` as any)}
                            </p>

                            <button
                                onClick={nextScenario}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
                            >
                                {scenarioIndex + 1 < SCENARIO_COUNT ? t('games.ethics.ui.next') : t('games.ethics.ui.finish')}
                                <ChevronRight />
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default EthicalDilemmaTemplate;
