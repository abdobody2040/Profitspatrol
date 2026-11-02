import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { Settings, Zap, Hand } from "lucide-react";
import { BusinessSimulation } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface ConveyorTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

interface ConveyorItem {
    id: string;
    type: string;
    icon: string;
    x: number; // Position percentage (0 to 100)
    yOffset: number; // slight random vertical offset
    processed: boolean;
}

// Default generic items if config not provided
const ITEM_TYPES = [
    { type: 'plastic', icon: '🥤', label: 'Plastic', targetBin: 'recycle' },
    { type: 'metal', icon: '🥫', label: 'Metal', targetBin: 'recycle' },
    { type: 'organic', icon: '🍎', label: 'Organic', targetBin: 'compost' },
    { type: 'toy_car', icon: '🚗', label: 'Toy Car', targetBin: 'ship' },
    { type: 'toy_bear', icon: '🧸', label: 'Teddy Bear', targetBin: 'ship' },
    { type: 'defective', icon: '⚙️', label: 'Broken Part', targetBin: 'trash' },
];

const BINS = [
    { id: 'recycle', icon: '♻️', color: 'bg-blue-500', name: 'Recycle' },
    { id: 'compost', icon: '🌱', color: 'bg-green-500', name: 'Compost' },
    { id: 'ship', icon: '📦', color: 'bg-purple-500', name: 'Ship' },
    { id: 'trash', icon: '🗑️', color: 'bg-slate-500', name: 'Trash' },
];

const ConveyorTemplate: React.FC<ConveyorTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();
    
    const mode = config?.business_id === 'BIZ_08_RECYCLE' ? 'recycle' : 'factory';
    const activeItemTypes = mode === 'recycle' 
        ? ITEM_TYPES.filter(i => ['plastic', 'metal', 'organic', 'defective'].includes(i.type))
        : ITEM_TYPES.filter(i => ['toy_car', 'toy_bear', 'defective'].includes(i.type));

    const activeBins = mode === 'recycle'
        ? BINS.filter(b => ['recycle', 'compost', 'trash'].includes(b.id))
        : BINS.filter(b => ['ship', 'trash'].includes(b.id));

    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RESULT'>('START');
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    
    const [items, setItems] = useState<ConveyorItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    const loopRef = useRef<number>();
    const lastTickRef = useRef<number>(0);
    const spawnTimerRef = useRef<number>(0);

    const startGame = () => {
        setGameState('PLAYING');
        setScore(0);
        setCombo(0);
        setMistakes(0);
        setTimeLeft(60);
        setItems([]);
        setSelectedItemId(null);
        setSpeedMultiplier(1);
        trigger('game_start');
        lastTickRef.current = performance.now();
        loopRef.current = requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
        if (loopRef.current) cancelAnimationFrame(loopRef.current);
        setGameState('RESULT');
        if (score > 500) trigger('big_profit');
        else trigger('game_over_win');

        setTimeout(() => {
            onComplete(score, { mistakes, maxCombo: combo });
        }, 4000);
    };

    const gameLoop = useCallback((timestamp: number) => {
        if (gameState !== 'PLAYING') return;

        const dt = timestamp - lastTickRef.current;
        lastTickRef.current = timestamp;

        // Timer
        setTimeLeft(prev => {
            const newTime = prev - (dt / 1000);
            if (newTime <= 0) {
                endGame();
                return 0;
            }
            return newTime;
        });

        // Speed ramp up
        setSpeedMultiplier(1 + (60 - timeLeft) * 0.015);

        // Spawn Items
        spawnTimerRef.current += dt;
        const spawnInterval = Math.max(1200, 2500 - (speedMultiplier * 300));
        
        if (spawnTimerRef.current > spawnInterval) {
            spawnTimerRef.current = 0;
            const randomType = activeItemTypes[Math.floor(Math.random() * activeItemTypes.length)];
            const newItem: ConveyorItem = {
                id: Math.random().toString(),
                type: randomType.type,
                icon: randomType.icon,
                x: 0,
                yOffset: (Math.random() - 0.5) * 20,
                processed: false
            };
            setItems(prev => [...prev, newItem]);
        }

        // Move Items
        setItems(prev => {
            let dropped = false;
            const next = prev.filter(item => {
                if (item.processed) return false;
                item.x += 0.02 * dt * speedMultiplier; // Move right

                // Fall off edge
                if (item.x > 110) {
                    dropped = true;
                    return false;
                }
                return true;
            });

            if (dropped) {
                handleMistake();
            }

            return next;
        });

        if (gameState === 'PLAYING') {
            loopRef.current = requestAnimationFrame(gameLoop);
        }
    }, [gameState, speedMultiplier, activeItemTypes]);

    const handleMistake = () => {
        setMistakes(m => m + 1);
        setCombo(0);
        setSelectedItemId(null);
        setScore(s => Math.max(0, s - 10));
        trigger('bad_decision');
    };

    const handleBinAction = (binId: string) => {
        if (gameState !== 'PLAYING' || items.length === 0) return;

        // Either route the player-tapped item or the lead item on the belt
        let targetItem: ConveyorItem | undefined;
        if (selectedItemId) {
            targetItem = items.find(i => i.id === selectedItemId);
        }
        
        if (!targetItem) {
            // Find the rightmost item
            targetItem = [...items].sort((a, b) => b.x - a.x)[0];
        }
        
        if (!targetItem || targetItem.x < 8) return;

        const typeDef = activeItemTypes.find(t => t.type === targetItem!.type);
        
        if (typeDef?.targetBin === binId) {
            // Correct!
            setCombo(c => c + 1);
            setScore(s => s + 20 + (combo * 2));
            trigger('good_decision');
            setSelectedItemId(null);
            // Remove item
            setItems(prev => prev.filter(i => i.id !== targetItem!.id));
        } else {
            // Wrong bin!
            handleMistake();
        }
    };

    useEffect(() => {
        return () => {
            if (loopRef.current) cancelAnimationFrame(loopRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-900 overflow-hidden relative font-sans text-white touch-none select-none">
            <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

            {/* HUD */}
            <div className="p-4 bg-slate-800 shadow-sm z-20 flex justify-between items-center shrink-0 border-b border-slate-700">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</div>
                        <div className="text-2xl font-black text-white">{score}</div>
                    </div>
                    {combo > 2 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-orange-400 font-black italic">
                            <Zap size={16} /> Combo x{combo}!
                        </motion.div>
                    )}
                </div>

                <div className={`text-3xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
                    0:{Math.ceil(timeLeft).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Mobile Touch Guidance Pill */}
            <div className="bg-slate-800/80 border-b border-slate-700/60 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Hand size={14} className="text-amber-400 animate-bounce" />
                <span>{t('games.conveyor_hint', 'Tap item on belt, then tap matching bin!')}</span>
            </div>

            {/* GAME AREA */}
            <div className="flex-1 relative overflow-hidden bg-slate-800/50 flex flex-col justify-center">
                
                {/* Conveyor Belt Background */}
                <div className="absolute top-1/2 left-0 right-0 h-32 -translate-y-1/2 bg-slate-700 border-y-4 border-slate-600 flex items-center overflow-hidden">
                    <motion.div 
                        className="w-[200%] h-full flex"
                        animate={{ x: gameState === 'PLAYING' ? ["0%", "-50%"] : "0%" }}
                        transition={{ ease: "linear", duration: 2 / speedMultiplier, repeat: Infinity }}
                    >
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="flex-1 border-r-2 border-slate-800/50 h-full" />
                        ))}
                    </motion.div>
                </div>

                {/* Items with Direct Tap Selection */}
                {items.map(item => {
                    const isSelected = selectedItemId === item.id;
                    return (
                        <div 
                            key={item.id} 
                            onPointerDown={() => setSelectedItemId(item.id)}
                            className={`absolute top-1/2 -translate-y-1/2 text-5xl md:text-6xl drop-shadow-xl z-10 cursor-pointer transition-transform ${
                                isSelected ? 'scale-125 ring-4 ring-amber-400 bg-amber-400/20 rounded-2xl p-1' : 'hover:scale-110 active:scale-125'
                            }`}
                            style={{ left: `${item.x}%`, marginTop: `${item.yOffset}px` }}
                        >
                            {item.icon}
                        </div>
                    );
                })}

                {/* Machine Overlay (Ends) */}
                <div className="absolute top-1/2 left-[-20px] h-40 w-24 -translate-y-1/2 bg-slate-800 border-4 border-slate-600 rounded-r-xl z-20 flex items-center justify-center shadow-lg">
                    <Settings className="text-slate-500 animate-spin-slow" size={32} />
                </div>
                <div className="absolute top-1/2 right-[-20px] h-40 w-24 -translate-y-1/2 bg-slate-800 border-4 border-slate-600 rounded-l-xl z-20 flex items-center justify-center shadow-lg">
                    <div className="w-12 h-24 bg-black/50 rounded-l-lg" />
                </div>
            </div>

            {/* CONTROLS (TACTILE TOUCH BINS) */}
            <div className="p-4 bg-slate-900 shrink-0 border-t border-slate-800">
                <div className="flex justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
                    {activeBins.map(bin => (
                        <button 
                            key={bin.id} 
                            onPointerDown={(e) => { e.preventDefault(); handleBinAction(bin.id); }} 
                            disabled={gameState !== 'PLAYING'}
                            className={`flex-1 min-h-[72px] ${bin.color} hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 p-3 rounded-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-[6px] transition-all flex flex-col items-center justify-center border-2 border-white/20`}
                        >
                            <span className="text-3xl md:text-4xl mb-1 drop-shadow-md">{bin.icon}</span>
                            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white drop-shadow-sm">{bin.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* OVERLAYS */}
            {gameState !== 'PLAYING' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {gameState === 'START' ? (
                        <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <Settings size={64} className="mx-auto text-blue-500 mb-4 animate-spin-slow" />
                            <h2 className="text-3xl font-black text-white mb-2">{config?.name || 'Production Line'}</h2>
                            <p className="text-slate-400 mb-6 text-sm">Sort items into matching bins quickly before they fall off the belt! Tap an item directly or tap matching bin.</p>
                            
                            <button 
                                onClick={startGame} 
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-1 active:shadow-none transition-all"
                            >
                                Start Conveyor
                            </button>
                        </div>
                    ) : (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <div className="text-5xl mb-3">{score > 300 ? '🏆' : '👍'}</div>
                            <h2 className="text-2xl font-black text-white mb-1">Shift Complete!</h2>
                            
                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="bg-slate-900 rounded-xl p-3 border border-slate-700">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Score</div>
                                    <div className="text-xl font-black text-blue-400">{score}</div>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-3 border border-slate-700">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Mistakes</div>
                                    <div className="text-xl font-black text-red-400">{mistakes}</div>
                                </div>
                            </div>

                            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6 text-left">
                                <p className="font-bold text-blue-400 mb-1 text-sm flex items-center gap-2">💡 Operations Fact</p>
                                <p className="text-xs text-blue-200">
                                    {mode === 'recycle' 
                                        ? "Contamination in recycling costs facilities millions of dollars a year. Sorting accuracy is crucial!"
                                        : "In manufacturing, 'Quality Control' is catching defective parts before they ship. Shipping a bad part damages reputation!"}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConveyorTemplate;
