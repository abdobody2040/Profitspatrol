import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, XCircle, CheckCircle, ChefHat, Trash2 } from 'lucide-react';
import { BusinessSimulation, CookingIngredient, CookingRecipe } from '../../../../types';

// DEFAULT FALLBACKS (Burgers)
const DEFAULT_INGREDIENTS: CookingIngredient[] = [
    { id: 'bun_bottom', labelKey: 'ingredients.bun_bottom', icon: '🥯', type: 'bun' },
    { id: 'patty', labelKey: 'ingredients.patty', icon: '🥩', type: 'meat' },
    { id: 'cheese', labelKey: 'ingredients.cheese', icon: '🧀', type: 'cheese' },
    { id: 'lettuce', labelKey: 'ingredients.lettuce', icon: '🥬', type: 'veg' },
    { id: 'tomato', labelKey: 'ingredients.tomato', icon: '🍅', type: 'veg' },
    { id: 'bun_top', labelKey: 'ingredients.bun_top', icon: '🥯', type: 'bun' },
];

const DEFAULT_RECIPES: CookingRecipe[] = [
    { id: 'classic', items: ['bun_bottom', 'patty', 'bun_top'] },
    { id: 'cheeseburger', items: ['bun_bottom', 'patty', 'cheese', 'bun_top'] },
    { id: 'deluxe', items: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'] },
    { id: 'double', items: ['bun_bottom', 'patty', 'cheese', 'patty', 'cheese', 'bun_top'] },
    { id: 'veggie', items: ['bun_bottom', 'lettuce', 'tomato', 'cheese', 'bun_top'] },
];

interface OperationsTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const OperationsTemplate: React.FC<OperationsTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();

    // DYNAMIC CONFIG
    const ingredients = config?.cooking_config?.ingredients || DEFAULT_INGREDIENTS;
    const recipes = config?.cooking_config?.recipes || DEFAULT_RECIPES;

    // GAME STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [wasteCost, setWasteCost] = useState(0);

    // ORDER STATE
    const [currentOrder, setCurrentOrder] = useState<CookingRecipe | null>(null);
    const [assemblyLine, setAssemblyLine] = useState<string[]>([]);
    const [lastFeedback, setLastFeedback] = useState<'success' | 'mistake' | null>(null);

    // SOUNDS (Optional placeholder)
    const playSplat = () => { }; // Placeholder
    const playDing = () => { };  // Placeholder

    // TIMER LOGIC
    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        // Reset state if config changes while mounted (rare but safe)
        if (!isPlaying) {
            setAssemblyLine([]);
            setCurrentOrder(null);
        }
    }, [config?.business_id]);

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(45);
        setScore(0);
        setMistakes(0);
        setWasteCost(0);
        setAssemblyLine([]);
        generateNewOrder();
    };

    const endGame = () => {
        setIsPlaying(false);
        // Calculate final rewards
        const finalScore = Math.max(0, score - wasteCost);

        setTimeout(() => {
            onComplete(finalScore, {
                burgersMade: Math.floor(score / 50), // Approx
                mistakes,
                wasteCost
            });
        }, 1500);
    };

    const generateNewOrder = () => {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        setCurrentOrder(randomRecipe);
        setAssemblyLine([]);
    };

    const handleIngredientClick = (ingId: string) => {
        if (!isPlaying || !currentOrder) return;

        const newAssembly = [...assemblyLine, ingId];
        setAssemblyLine(newAssembly);

        // Validate Step-by-Step? 
        // Or just check if they are building valid prefix?
        // Let's check strict order matches.
        const currentIndex = newAssembly.length - 1;
        const expected = currentOrder.items[currentIndex];

        if (ingId !== expected) {
            // IMMEDIATE FAIL ON WRONG INGREDIENT
            handleMistake(t('games.operations.ui.wrong_ingredient'));
        } else {
            // Correct so far
            // Check if complete
            if (newAssembly.length === currentOrder.items.length) {
                handleSuccess();
            }
        }
    };

    const handleMistake = (reason: string) => {
        setLastFeedback('mistake');
        setMistakes(prev => prev + 1);
        setWasteCost(prev => prev + 5); // Wasted ingredients cost money!
        setAssemblyLine([]); // Reset current burger

        // Shake effect trigger?
        setTimeout(() => setLastFeedback(null), 500);
    };

    const handleSuccess = () => {
        setLastFeedback('success');
        const reward = currentOrder!.items.length * 15; // More complex = more money
        setScore(prev => prev + reward);

        setTimeout(() => {
            setLastFeedback(null);
            generateNewOrder();
        }, 400); // Brief pause to celebrate
    };

    const handleTrash = () => {
        if (assemblyLine.length > 0) {
            setWasteCost(prev => prev + (assemblyLine.length * 2)); // Partial waste cost
            setAssemblyLine([]);
        }
    };

    // Helper: Lookup Icon
    const getIcon = (id: string) => ingredients.find(i => i.id === id)?.icon || '❓';
    const getName = (id: string) => {
        const ing = ingredients.find(i => i.id === id);
        // @ts-ignore
        return ing ? t(ing.labelKey as any) : id;
    };

    // Determine Theme Colors from Config
    const themeColors = config?.visual_config?.colors || {
        primary: '#EA580C', // orange-600
        secondary: '#C2410C', // orange-700
        accent: '#FB923C', // orange-400
        background: '#FFF7ED' // orange-50
    };

    return (
        <div
            className="flex flex-col h-full rounded-3xl overflow-hidden relative select-none border-2"
            style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.primary + '40' // 25% opacity
            }}
        >

            {/* HEADER: HUD */}
            <div
                className="text-white p-4 flex justify-between items-center shadow-md z-10"
                style={{ backgroundColor: themeColors.primary }}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <ChefHat size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold opacity-80 uppercase tracking-wider">{t('games.operations.ui.revenue')}</div>
                        <div className="text-2xl font-black font-mono">${score}</div>
                    </div>
                </div>

                <div className={`text-3xl font-black ${timeLeft < 10 ? 'animate-pulse text-red-100' : 'text-white'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>

                <div className="text-right">
                    <div className="text-xs font-bold opacity-80 uppercase tracking-wider">{t('games.operations.ui.waste_cost')}</div>
                    <div className="text-xl font-bold font-mono text-red-200">-${wasteCost}</div>
                </div>
            </div>

            {/* GAME AREA */}
            <div className="flex-1 flex flex-col relative">

                {/* ORDER TICKET */}
                <div className="h-1/3 bg-gray-100 dark:bg-gray-800 p-4 border-b-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative">
                    {!isPlaying ? (
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-gray-400 mb-2">{t('games.operations.ui.ready')}</h2>
                            <button
                                onClick={startGame}
                                style={{ backgroundColor: themeColors.accent }}
                                className="text-white px-8 py-3 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all"
                            >
                                {t('games.operations.ui.start')}
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode='wait'>
                            {currentOrder && (
                                <motion.div
                                    key={currentOrder.id}
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border-l-8 w-full max-w-md"
                                    style={{ borderColor: themeColors.secondary }}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-gray-800 dark:text-white uppercase">{t(`games.operations.recipes.${currentOrder.id}` as any)}</h3>
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold">#{Math.floor(score / 50) + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
                                        {currentOrder.items.map((item, idx) => {
                                            const done = idx < assemblyLine.length;
                                            const isCurrent = idx === assemblyLine.length;
                                            return (
                                                <div key={idx} className={`flex flex-col items-center min-w-[50px] transition-all ${done ? 'opacity-30 grayscale' : 'opacity-100'} ${isCurrent ? 'scale-110' : ''}`}>
                                                    <span className="text-3xl drop-shadow-sm">{getIcon(item)}</span>
                                                    {isCurrent && <div className="w-2 h-2 rounded-full mt-1 animate-bounce" style={{ backgroundColor: themeColors.secondary }} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* WORKBENCH (Assembly Area) */}
                <div
                    className="flex-1 flex flex-col justify-end p-4 relative transition-colors"
                >

                    {/* FEEDBACK OVERLAY */}
                    <AnimatePresence>
                        {lastFeedback === 'success' && (
                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1.5, rotate: 0 }}
                                exit={{ scale: 0 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                            >
                                <span className="text-8xl">💰</span>
                            </motion.div>
                        )}
                        {lastFeedback === 'mistake' && (
                            <motion.div
                                initial={{ scale: 0, rotate: 20 }}
                                animate={{ scale: 1.5, rotate: 0 }}
                                exit={{ scale: 0 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                            >
                                <span className="text-8xl">🔥</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* INGREDIENT CONTROLS */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
                        {ingredients.map(ing => (
                            <button
                                key={ing.id}
                                disabled={!isPlaying}
                                onClick={() => handleIngredientClick(ing.id)}
                                className="bg-white dark:bg-gray-800 border-b-4 border-gray-200 dark:border-gray-950 active:border-b-0 active:translate-y-1 p-2 md:p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <span className="text-3xl md:text-5xl group-hover:scale-110 transition-transform">{ing.icon}</span>
                                {/* Optional: Hide text on small screens if cluttered */}
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase text-center leading-tight">
                                    {t(`games.operations.${ing.labelKey}` as any)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleTrash}
                        disabled={!isPlaying || assemblyLine.length === 0}
                        className="absolute md:static top-4 right-4 bg-red-100 text-red-500 p-3 rounded-full hover:bg-red-200 transition-colors disabled:opacity-0"
                        title="Dump current item"
                    >
                        <Trash2 size={24} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default OperationsTemplate;

