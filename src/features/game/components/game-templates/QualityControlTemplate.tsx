import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Trash2, PackageCheck } from 'lucide-react';

// GAME CONFIG
const GAME_DURATION = 60; // seconds
const SPAWN_RATE_INITIAL = 2000; // ms
const SPEED_INITIAL = 2; // px per frame

// ITEM TYPES
const ITEM_TYPES = [
    { id: 'robot', icon: '🤖', defects: ['missing_arm', 'rusty'] },
    { id: 'bear', icon: '🧸', defects: ['missing_eye', 'ripped'] },
    { id: 'console', icon: '🎮', defects: ['cracked_screen', 'no_buttons'] },
    { id: 'car', icon: '🚗', defects: ['missing_wheel', 'dented'] },
];

interface Item {
    id: string;
    typeId: string;
    isDefective: boolean;
    x: number;
    y: number; // For multi-lane support in future, currently just 1 lane
    speed: number;
}

interface QualityControlTemplateProps {
    onComplete: (score: number, data: any) => void;
}

const QualityControlTemplate: React.FC<QualityControlTemplateProps> = ({ onComplete }) => {
    const { t } = useTranslation();

    // STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0); // False positives (rejected good) or False negatives (missed bad)
    const [items, setItems] = useState<Item[]>([]);

    // REFS for Game Loop
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();
    const spawnTimerRef = useRef<number>(0);
    const itemsRef = useRef<Item[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const speedRef = useRef(SPEED_INITIAL);

    // Initial setup
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setMistakes(0);
        setTimeLeft(GAME_DURATION);
        setItems([]);
        itemsRef.current = [];
        speedRef.current = SPEED_INITIAL;
        lastTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(animate);
    };

    const endGame = () => {
        setIsPlaying(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        // Calculate XP/Rewards
        const finalScore = Math.max(0, score - (mistakes * 50));

        setTimeout(() => {
            onComplete(finalScore, {
                mistakes,
                itemsProcessed: score / 10 // approx
            });
        }, 1500);
    };

    const spawnItem = () => {
        const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        const isDefective = Math.random() < 0.3; // 30% chance of defect

        const containerWidth = containerRef.current?.clientWidth || 800;

        const newItem: Item = {
            id: Math.random().toString(36).substr(2, 9),
            typeId: type.id,
            isDefective,
            x: containerWidth + 50, // Start off-screen right
            y: 50, // Center of lane
            speed: speedRef.current
        };

        itemsRef.current.push(newItem);
    };

    const animate = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // TIMER
        if (Math.floor(time / 1000) !== Math.floor((time - deltaTime) / 1000)) {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
            // Increase speed slightly every second
            speedRef.current += 0.05;
        }

        // SPAWNER
        spawnTimerRef.current += deltaTime;
        const currentSpawnRate = Math.max(500, SPAWN_RATE_INITIAL - (SPEED_INITIAL * 100)); // Cap spawn rate
        if (spawnTimerRef.current > currentSpawnRate) {
            spawnItem();
            spawnTimerRef.current = 0;
        }

        // MOVEMENT & CLEANUP
        const remainingItems: Item[] = [];
        let missedDefects = 0;
        let successfulPasses = 0;

        itemsRef.current.forEach(item => {
            item.x -= item.speed;

            // Check boundaries
            if (item.x < -100) {
                // Item left the screen
                if (item.isDefective) {
                    // Missed a bad item!
                    missedDefects++;
                } else {
                    // Good item shipped!
                    successfulPasses++;
                }
            } else {
                remainingItems.push(item);
            }
        });

        if (missedDefects > 0) {
            handleMistake(missedDefects, 'missed');
        }
        if (successfulPasses > 0) {
            setScore(prev => prev + (successfulPasses * 10));
        }

        itemsRef.current = remainingItems;
        setItems([...itemsRef.current]); // Trigger render

        if (timeLeft > 0) {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const handleMistake = (count: number, type: 'missed' | 'false_positive') => {
        setMistakes(prev => prev + count);
        // Visual feedback could be triggered here
    };

    const handleItemClick = (id: string, isDefective: boolean) => {
        if (!isPlaying) return;

        // Remove item from ref immediately
        const idx = itemsRef.current.findIndex(i => i.id === id);
        if (idx > -1) {
            itemsRef.current.splice(idx, 1);
            setItems([...itemsRef.current]);

            if (isDefective) {
                // Correctly caught a defect!
                setScore(prev => prev + 50);
            } else {
                // Oops, rejected a good item!
                handleMistake(1, 'false_positive');
                setScore(prev => Math.max(0, prev - 20));
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative select-none">

            {/* HUD */}
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-2 rounded-xl text-blue-300">
                        <PackageCheck size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('games.quality.ui.score')}</div>
                        <div className="text-2xl font-black font-mono">{score}</div>
                    </div>
                </div>

                <div className={`text-4xl font-black ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>

                <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('games.quality.ui.mistakes')}</div>
                    <div className="text-xl font-bold font-mono text-red-400">{mistakes}</div>
                </div>
            </div>

            {/* CONVEYOR BELT AREA */}
            <div
                ref={containerRef}
                className="flex-1 relative flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] bg-slate-200 dark:bg-slate-800"
            >
                {/* TRACK VISUAL */}
                <div className="absolute w-full h-32 bg-slate-300 dark:bg-slate-700 border-y-4 border-slate-400 flex items-center">
                    {/* Moving track pattern simulation */}
                    <div className="w-full h-full opacity-10 animate-[slide_1s_linear_infinite] bg-[linear-gradient(90deg,transparent_50%,#000_50%)] bg-[length:50px_100%]" />
                </div>

                {/* START SCREEN */}
                {!isPlaying && (
                    <div className="absolute z-50 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl text-center max-w-sm shadow-2xl">
                            <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-white">{t('games.quality.title')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('games.quality.desc')}</p>
                            <button
                                onClick={startGame}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-1 active:shadow-none transition-all"
                            >
                                {t('games.quality.ui.start')}
                            </button>
                        </div>
                    </div>
                )}

                {/* ITEMS */}
                <AnimatePresence>
                    {items.map(item => (
                        <div
                            key={item.id}
                            style={{
                                left: item.x,
                                top: '50%',
                                marginTop: -40
                            }}
                            className="absolute cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
                            onMouseDown={() => handleItemClick(item.id, item.isDefective)}
                        >
                            <div className={`
                                w-24 h-24 rounded-full shadow-lg flex items-center justify-center text-5xl bg-white border-4
                                ${item.isDefective ? 'border-red-100' : 'border-green-100'} 
                            `}>
                                <span className={item.isDefective ? 'grayscale opacity-80 rotate-12' : ''}>
                                    {ITEM_TYPES.find(t => t.id === item.typeId)?.icon}
                                </span>
                                {item.isDefective && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full animate-bounce">
                                        <AlertTriangle size={16} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {/* ZONES OVERLAY (Visual only) */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-green-500/20 to-transparent pointer-events-none flex items-center justify-center">
                    <span className="text-green-600 font-bold -rotate-90 opacity-50">SHIPPING</span>
                </div>
            </div>

            {/* INSTRUCTIONS / CONTROLS */}
            <div className="h-1/4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center gap-8">
                <div className="text-center opacity-60">
                    <CheckCircle className="mx-auto mb-2 text-green-500" />
                    <span className="text-xs font-bold">{t('games.quality.ui.pass_good')}</span>
                </div>
                <div className="flex-1 max-w-md text-center text-sm text-slate-500">
                    {t('games.quality.ui.instruction')}
                </div>
                <div className="text-center opacity-60">
                    <XCircle className="mx-auto mb-2 text-red-500" />
                    <span className="text-xs font-bold">{t('games.quality.ui.reject_bad')}</span>
                </div>
            </div>
        </div>
    );
};

export default QualityControlTemplate;
