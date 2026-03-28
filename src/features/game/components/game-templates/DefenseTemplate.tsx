import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Crosshair } from 'lucide-react';
import { BusinessSimulation, DefenseConfig, DefenseEnemy } from '../../../../types';

interface DefenseTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

interface ActiveEnemy extends DefenseEnemy {
    uid: string;
    x: number; // %
    y: number; // %
}

const DefenseTemplate: React.FC<DefenseTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const defenseConfig = config?.defense_config || { enemies: [], spawn_rate: 2000, win_time: 60 };
    const { enemies, spawn_rate, win_time } = defenseConfig;
    const colors = config?.visual_config?.colors || { primary: '#3B82F6', background: '#0F172A' };

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(win_time);
    const [activeEnemies, setActiveEnemies] = useState<ActiveEnemy[]>([]);
    const [gameOver, setGameOver] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>();
    const lastSpawnRef = useRef(0);

    // Game Loop
    useEffect(() => {
        if (gameOver) return;

        const loop = (time: number) => {
            if (!lastSpawnRef.current) lastSpawnRef.current = time;
            const delta = time - lastSpawnRef.current; // Not strictly delta for spawn, but time ref

            // Spawn Logic
            if (Math.random() < 0.02) { // Random spawn chance per frame ~60fps
                spawnEnemy();
                // We could rely on delta time for consistent spawn rate, but random is fun.
                // Let's use spawn_rate roughly.
            }

            // Move Enemies
            setActiveEnemies(prev => {
                const next: ActiveEnemy[] = [];
                let damage = 0;

                prev.forEach(e => {
                    // Speed is subjective. Let's say speed = 1% per frame * multiplier?
                    // normalize speed: 100 = 0.2% per frame
                    const moveSpeed = e.speed * 0.002;
                    e.y += moveSpeed;

                    if (e.y > 100) {
                        damage++;
                    } else {
                        next.push(e);
                    }
                });

                if (damage > 0) {
                    setLives(l => {
                        const newLives = l - damage;
                        if (newLives <= 0) handleGameOver(false);
                        return Math.max(0, newLives);
                    });
                }

                return next;
            });

            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(frameRef.current!);
    }, [gameOver, lives]); // Careful with deps

    // Timer
    useEffect(() => {
        if (gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    handleGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameOver]);

    const spawnEnemy = () => {
        const type = enemies[Math.floor(Math.random() * enemies.length)];
        const enemy: ActiveEnemy = {
            ...type,
            uid: Math.random().toString(),
            x: Math.random() * 80 + 10, // 10-90%
            y: -10
        };
        setActiveEnemies(prev => [...prev, enemy]);
    };

    const handleTap = (uid: string, scoreVal: number) => {
        if (gameOver) return;
        setScore(s => s + scoreVal);
        setActiveEnemies(prev => prev.filter(e => e.uid !== uid));
    };

    const handleGameOver = (win: boolean) => {
        setGameOver(true);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);

        setTimeout(() => {
            onComplete(score + (win ? 500 : 0), { lives, win });
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden relative touch-none select-none" style={{ backgroundColor: colors.background }}>
            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-black/50 backdrop-blur-sm text-white">
                <div className="flex items-center gap-4">
                    <div className="font-black text-2xl flex items-center gap-2">
                        <Crosshair className="text-red-500" /> {score}
                    </div>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Shield key={i} size={20} className={i < lives ? "text-blue-500 fill-current" : "text-gray-600"} />
                        ))}
                    </div>
                </div>
                <div className={`font-mono font-bold text-2xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Game Area */}
            <div ref={containerRef} className="flex-1 relative overflow-hidden">
                <AnimatePresence>
                    {activeEnemies.map(e => (
                        <motion.button
                            key={e.uid}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, top: `${e.y}%`, left: `${e.x}%` }}
                            exit={{ scale: 1.5, opacity: 0 }} // Explosion effect
                            transition={{ duration: 0 }} // Direct control via state loop
                            className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-4xl hover:scale-110 active:scale-90 transition-transform cursor-pointer z-10"
                            style={{
                                top: `${e.y}%`,
                                left: `${e.x}%`,
                                // We are manually animating top via state loop, so Framer animate prop might fight.
                                // Better to use style directly for loop-driven position.
                            }}
                            onPointerDown={() => handleTap(e.uid, e.score)}
                        >
                            <div className="relative">
                                {e.icon}
                                <div className="absolute inset-0 bg-red-500/0 hover:bg-red-500/20 rounded-full animate-ping" />
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>

                {gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
                        <div className="text-center">
                            <h2 className={`text-6xl font-black mb-4 ${lives > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {lives > 0 ? 'SECURE!' : 'BREACHED!'}
                            </h2>
                            <p className="text-white text-xl">Final Score: {score}</p>
                        </div>
                    </div>
                )}

                {/* Matrix Rain Effect opacity */}
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/dummy/giphy.gif')] opacity-5 pointer-events-none" />
            </div>
        </div>
    );
};

export default DefenseTemplate;

