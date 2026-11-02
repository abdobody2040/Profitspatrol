import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Trash2, Clock, AlertTriangle, EyeOff } from 'lucide-react';
import { BusinessSimulation, CookingIngredient, CookingRecipe } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

const DEFAULT_INGREDIENTS: CookingIngredient[] = [
    { id: 'bun_bottom', labelKey: 'Bottom Bun', icon: '🥯', type: 'bun' },
    { id: 'patty', labelKey: 'Meat Patty', icon: '🥩', type: 'meat' },
    { id: 'cheese', labelKey: 'Cheese', icon: '🧀', type: 'cheese' },
    { id: 'lettuce', labelKey: 'Lettuce', icon: '🥬', type: 'veg' },
    { id: 'tomato', labelKey: 'Tomato', icon: '🍅', type: 'veg' },
    { id: 'bun_top', labelKey: 'Top Bun', icon: '🥯', type: 'bun' },
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

interface ActiveOrder extends CookingRecipe {
    uid: string;
    patience: number;
    maxPatience: number;
    hidden: boolean;
}

const OperationsTemplate: React.FC<OperationsTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

    const ingredients = config?.cooking_config?.ingredients || DEFAULT_INGREDIENTS;
    const recipes = config?.cooking_config?.recipes || DEFAULT_RECIPES;

    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [wasteCost, setWasteCost] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const [currentOrder, setCurrentOrder] = useState<ActiveOrder | null>(null);
    const [assemblyLine, setAssemblyLine] = useState<string[]>([]);
    const [lastFeedback, setLastFeedback] = useState<'success' | 'mistake' | 'expired' | null>(null);

    const timerRef = useRef<NodeJS.Timeout>();
    const patienceTimerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => stopGameLoop();
    }, []);

    const stopGameLoop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (patienceTimerRef.current) clearInterval(patienceTimerRef.current);
    };

    const startGame = () => {
        setIsPlaying(true);
        setTimeLeft(60);
        setScore(0);
        setMistakes(0);
        setWasteCost(0);
        setAssemblyLine([]);
        setShowResult(false);
        trigger('game_start');
        generateNewOrder();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        patienceTimerRef.current = setInterval(() => {
            setCurrentOrder(prev => {
                if (!prev) return prev;
                const newPatience = prev.patience - 1;
                
                // Hide recipe when patience hits 70%
                let hidden = prev.hidden;
                if ((newPatience / prev.maxPatience) < 0.7) {
                    hidden = true;
                }

                if (newPatience <= 0) {
                    handleExpired();
                    return null;
                }
                
                return { ...prev, patience: newPatience, hidden };
            });
        }, 1000); // Ticks patience down every second
    };

    const endGame = () => {
        stopGameLoop();
        setIsPlaying(false);
        setShowResult(true);
        
        const finalScore = Math.max(0, score - wasteCost);
        
        if (finalScore > 200) trigger('big_profit');
        else trigger('game_over_win');

        setTimeout(() => {
            onComplete(finalScore, {
                burgersMade: Math.floor(score / 50),
                mistakes,
                wasteCost
            });
        }, 1500);
    };

    const generateNewOrder = () => {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        const isComplex = randomRecipe.items.length >= 5;
        const maxPatience = isComplex ? 20 : 15; // 20s or 15s to complete

        setCurrentOrder({
            ...randomRecipe,
            uid: Math.random().toString(),
            patience: maxPatience,
            maxPatience,
            hidden: false
        });
        setAssemblyLine([]);
    };

    const handleIngredientClick = (ingId: string) => {
        if (!isPlaying || !currentOrder) return;

        const newAssembly = [...assemblyLine, ingId];
        setAssemblyLine(newAssembly);

        const currentIndex = newAssembly.length - 1;
        const expected = currentOrder.items[currentIndex];

        if (ingId !== expected) {
            handleMistake();
        } else if (newAssembly.length === currentOrder.items.length) {
            handleSuccess();
        }
    };

    const handleMistake = () => {
        setLastFeedback('mistake');
        setMistakes(prev => prev + 1);
        setWasteCost(prev => prev + 5); 
        setAssemblyLine([]);
        
        trigger('bad_decision');
        setTimeout(() => setLastFeedback(null), 500);
    };

    const handleExpired = () => {
        setLastFeedback('expired');
        setMistakes(prev => prev + 1);
        setAssemblyLine([]);
        
        trigger('going_broke'); // Customer left angry
        setTimeout(() => {
            setLastFeedback(null);
            generateNewOrder();
        }, 1000);
    };

    const handleSuccess = () => {
        setLastFeedback('success');
        
        // Base reward + speed bonus + memory bonus
        const baseReward = currentOrder!.items.length * 10;
        const speedBonus = Math.floor(currentOrder!.patience / 2);
        const reward = baseReward + speedBonus;
        
        setScore(prev => prev + reward);

        setTimeout(() => {
            setLastFeedback(null);
            generateNewOrder();
        }, 500);
    };

    const handleTrash = () => {
        if (assemblyLine.length > 0) {
            setWasteCost(prev => prev + (assemblyLine.length * 2)); 
            setAssemblyLine([]);
            trigger('bad_decision'); // Wasting food
        }
    };

    const getIcon = (id: string) => ingredients.find(i => i.id === id)?.icon || '❓';
    
    const themeColors = config?.visual_config?.colors || {
        primary: '#EA580C',
        secondary: '#C2410C',
        accent: '#FB923C',
        background: '#FFF7ED'
    };

    return (
        <div className="flex flex-col h-full rounded-xl md:rounded-3xl overflow-hidden relative select-none border-2 font-sans"
            style={{ backgroundColor: themeColors.background, borderColor: themeColors.primary + '40' }}>
            
            <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

            {/* HUD */}
            <div className="text-white p-3 flex justify-between items-center shadow-md z-10 shrink-0" style={{ backgroundColor: themeColors.primary }}>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl"><ChefHat size={24} /></div>
                    <div>
                        <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Revenue</div>
                        <div className="text-xl md:text-2xl font-black">${score}</div>
                    </div>
                </div>

                <div className={`text-2xl md:text-3xl font-black ${timeLeft < 10 ? 'animate-pulse text-red-200' : 'text-white'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>

                <div className="text-end">
                    <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Waste Cost</div>
                    <div className="text-lg font-bold text-red-200">-${wasteCost}</div>
                </div>
            </div>

            {/* GAME AREA */}
            <div className="flex-1 flex flex-col relative overflow-hidden">

                {/* ORDER TICKET AREA */}
                <div className="h-1/3 min-h-[120px] bg-slate-800 p-3 border-b-4 border-slate-700 flex flex-col items-center justify-center relative shrink-0 shadow-inner">
                    <AnimatePresence mode='wait'>
                        {currentOrder && (
                            <motion.div key={currentOrder.uid} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                                className="bg-white p-3 rounded-xl shadow-lg border-s-8 w-full max-w-sm relative"
                                style={{ borderColor: themeColors.secondary }}>
                                
                                {/* Patience Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 rounded-t-xl overflow-hidden">
                                    <motion.div className={`h-full ${currentOrder.patience / currentOrder.maxPatience > 0.5 ? 'bg-green-500' : currentOrder.patience / currentOrder.maxPatience > 0.25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        animate={{ width: `${(currentOrder.patience / currentOrder.maxPatience) * 100}%` }} transition={{ duration: 1, ease: 'linear' }} />
                                </div>

                                <div className="flex justify-between items-center mb-2 mt-1">
                                    <h3 className="font-black text-gray-800 uppercase">{currentOrder.id}</h3>
                                    <Clock size={16} className={currentOrder.patience < 5 ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
                                </div>

                                {/* Recipe Display */}
                                <div className="relative h-12 flex items-center justify-center">
                                    {currentOrder.hidden ? (
                                        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase animate-pulse">
                                            <EyeOff size={16} /> Memory Mode!
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide w-full justify-center">
                                            {currentOrder.items.map((item, idx) => {
                                                const done = idx < assemblyLine.length;
                                                const isCurrent = idx === assemblyLine.length;
                                                return (
                                                    <div key={idx} className={`flex flex-col items-center min-w-[30px] transition-all ${done ? 'opacity-30 grayscale' : 'opacity-100'} ${isCurrent ? 'scale-125' : ''}`}>
                                                        <span className="text-2xl drop-shadow-sm">{getIcon(item)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {!isPlaying && !showResult && (
                            <div className="text-center text-slate-400">
                                <h2 className="text-xl font-black mb-1">Kitchen Closed</h2>
                                <p className="text-xs">Press start to open.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* WORKBENCH & ASSEMBLY TRAY */}
                <div className="flex-1 flex flex-col justify-end p-3 relative">
                    
                    {/* FEEDBACK OVERLAYS */}
                    <AnimatePresence>
                        {lastFeedback === 'success' && (
                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><span className="text-8xl drop-shadow-xl">💰</span></motion.div>
                        )}
                        {lastFeedback === 'mistake' && (
                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><span className="text-8xl drop-shadow-xl">❌</span></motion.div>
                        )}
                        {lastFeedback === 'expired' && (
                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><span className="text-8xl drop-shadow-xl">😡</span></motion.div>
                        )}
                    </AnimatePresence>

                    {/* PLATE / CURRENT BURGER */}
                    <div className="absolute left-1/2 bottom-32 transform -translate-x-1/2 w-32 h-4 bg-slate-300 rounded-full shadow-lg border-b-4 border-slate-400 flex flex-col-reverse items-center">
                        <AnimatePresence>
                            {assemblyLine.map((ingId, idx) => (
                                <motion.div key={`${idx}-${ingId}`} initial={{ y: -50, opacity: 0 }} animate={{ y: idx * -5, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                    className="text-4xl absolute drop-shadow-md z-10" style={{ bottom: `${idx * 15}px` }}>
                                    {getIcon(ingId)}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <button 
                        type="button"
                        onClick={handleTrash} 
                        onPointerDown={(e) => { e.preventDefault(); handleTrash(); }}
                        disabled={!isPlaying || assemblyLine.length === 0}
                        className="absolute bottom-32 right-4 bg-red-100 text-red-500 p-4 rounded-2xl border-b-4 border-red-200 hover:bg-red-200 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-0 disabled:pointer-events-none z-20 min-w-[56px] min-h-[56px] flex items-center justify-center" 
                        title="Trash Item"
                    >
                        <Trash2 size={24} />
                    </button>

                    {/* INGREDIENT BUTTONS WITH HIGH-TACTILE TOUCH TARGETS */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 mt-auto pb-2 relative z-30">
                        {ingredients.map(ing => (
                            <button 
                                key={ing.id} 
                                type="button"
                                disabled={!isPlaying} 
                                onClick={() => handleIngredientClick(ing.id)}
                                onPointerDown={(e) => { e.preventDefault(); handleIngredientClick(ing.id); }}
                                className="bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 min-h-[68px] p-2.5 rounded-2xl shadow-sm flex flex-col items-center justify-center hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group select-none touch-none"
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform mb-1">{ing.icon}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase text-center leading-tight truncate w-full">
                                    {ing.labelKey}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* OVERLAYS */}
            {!isPlaying && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {showResult ? (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl border-4" style={{ borderColor: themeColors.primary }}>
                            <div className="text-5xl mb-3">{score - wasteCost > 150 ? '🌟' : score - wasteCost > 50 ? '👍' : '📉'}</div>
                            <h2 className="text-2xl font-black text-slate-800 mb-1">Shift Over!</h2>
                            <div className="text-4xl font-black text-green-500 mb-6">${Math.max(0, score - wasteCost)}</div>
                            
                            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-slate-100">
                                <div className="flex justify-between text-sm font-bold"><span className="text-slate-500">Gross Revenue:</span><span className="text-green-500">${score}</span></div>
                                <div className="flex justify-between text-sm font-bold"><span className="text-slate-500">Waste Costs:</span><span className="text-red-500">-${wasteCost}</span></div>
                                <div className="flex justify-between text-sm font-bold"><span className="text-slate-500">Mistakes/Walkouts:</span><span className="text-slate-800">{mistakes}</span></div>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
                                <p className="font-bold text-orange-600 mb-1 text-sm flex items-center gap-2"><AlertTriangle size={16}/> Operations Lesson</p>
                                <p className="text-xs text-orange-800">
                                    Efficiency is profit! Wasting materials or taking too long costs money. Standard Operating Procedures (SOPs) help employees memorize tasks and reduce costly errors.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={startGame} className="flex-1 py-4 text-white rounded-xl font-black shadow-lg" style={{ backgroundColor: themeColors.accent }}>Play Again</button>
                                <button onClick={() => onComplete(0, {})} className="flex-1 py-4 bg-slate-200 text-slate-600 rounded-xl font-black">Exit</button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl border-4" style={{ borderColor: themeColors.primary }}>
                            <div className="text-6xl mb-4 mx-auto">{config?.visual_config?.icon || '🍔'}</div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">{config?.name || 'Operations Sim'}</h2>
                            <p className="text-slate-500 mb-6 text-sm">{config?.description || 'Memorize orders and build them fast.'}</p>
                            
                            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-xs text-left text-slate-600 space-y-2 border border-slate-100">
                                <p>🧠 <strong>Memory Mode:</strong> Orders disappear after a few seconds. Memorize them!</p>
                                <p>⏱️ <strong>Speed Matters:</strong> Faster assembly = bigger tips.</p>
                                <p>🗑️ <strong>Avoid Waste:</strong> Trashing mistakes costs you money directly from your profits.</p>
                            </div>

                            <button onClick={startGame} className="w-full py-4 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all" style={{ backgroundColor: themeColors.primary }}>
                                Start Shift
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OperationsTemplate;
