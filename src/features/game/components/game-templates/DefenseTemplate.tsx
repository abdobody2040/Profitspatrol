import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Server } from "lucide-react";
import { BusinessSimulation } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface DefenseTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

interface Enemy {
    id: string;
    type: 'bug' | 'hacker' | 'ddos';
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    speed: number;
    reward: number;
    icon: string;
}

interface Tower {
    id: string;
    type: 'firewall' | 'antivirus' | 'encryptor';
    x: number;
    y: number;
    range: number;
    damage: number;
    cooldown: number; // ms
    lastFired: number;
    icon: string;
}

interface Projectile {
    id: string;
    x: number;
    y: number;
    targetId: string;
    speed: number;
}

export const TOWER_TYPES = [
    { type: 'firewall', name: 'Firewall', cost: 50, range: 25, damage: 20, cooldown: 1000, icon: '🧱', desc: 'Basic slow defense' },
    { type: 'antivirus', name: 'Anti-Virus', cost: 100, range: 40, damage: 10, cooldown: 300, icon: '💉', desc: 'Fast, low damage' },
    { type: 'encryptor', name: 'Encryptor', cost: 200, range: 30, damage: 50, cooldown: 2000, icon: '🔐', desc: 'Heavy burst damage' }
];

export const WAVES = [
    { count: 5, type: 'bug', interval: 2000, hp: 30, speed: 0.5, reward: 10, icon: '🐛' },
    { count: 10, type: 'bug', interval: 1500, hp: 50, speed: 0.6, reward: 15, icon: '🐛' },
    { count: 5, type: 'hacker', interval: 2500, hp: 150, speed: 0.4, reward: 30, icon: '🥷' },
    { count: 15, type: 'ddos', interval: 500, hp: 20, speed: 0.8, reward: 5, icon: '🌊' }, // Swarm
    { count: 1, type: 'hacker', interval: 1000, hp: 1000, speed: 0.3, reward: 200, icon: '👾' }, // Boss
];

export const PATH = [
    { x: 10, y: -10 },
    { x: 10, y: 30 },
    { x: 80, y: 30 },
    { x: 80, y: 70 },
    { x: 50, y: 70 },
    { x: 50, y: 110 }
];

const DefenseTemplate: React.FC<DefenseTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WAVE_END' | 'GAME_OVER' | 'VICTORY'>('START');
    const [money, setMoney] = useState(150);
    const [serverHp, setServerHp] = useState(100);
    const [wave, setWave] = useState(0);
    const [score, setScore] = useState(0);
    
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [towers, setTowers] = useState<Tower[]>([]);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    
    const [selectedTower, setSelectedTower] = useState<string | null>(null);

    const loopRef = useRef<number>();
    const spawnTimerRef = useRef<NodeJS.Timeout>();
    const enemiesSpawnedRef = useRef(0);
    const lastTickRef = useRef<number>(0);

    useEffect(() => {
        return () => stopGame();
    }, []);

    const stopGame = () => {
        if (loopRef.current) cancelAnimationFrame(loopRef.current);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };

    const startGame = () => {
        setGameState('PLAYING');
        setMoney(150);
        setServerHp(100);
        setWave(0);
        setScore(0);
        setEnemies([]);
        setTowers([]);
        setProjectiles([]);
        setSelectedTower(null);
        trigger('game_start');
        startWave(0);
    };

    const startWave = (waveIndex: number) => {
        setGameState('PLAYING');
        enemiesSpawnedRef.current = 0;
        const currentWave = WAVES[waveIndex];

        spawnTimerRef.current = setInterval(() => {
            if (enemiesSpawnedRef.current >= currentWave.count) {
                clearInterval(spawnTimerRef.current);
                return;
            }

            const newEnemy: Enemy = {
                id: Math.random().toString(),
                type: currentWave.type as any,
                x: PATH[0].x,
                y: PATH[0].y,
                hp: currentWave.hp,
                maxHp: currentWave.hp,
                speed: currentWave.speed,
                reward: currentWave.reward,
                icon: currentWave.icon
            };

            setEnemies(prev => [...prev, newEnemy]);
            enemiesSpawnedRef.current++;
        }, currentWave.interval);

        lastTickRef.current = performance.now();
        loopRef.current = requestAnimationFrame(gameLoop);
    };

    const gameLoop = useCallback((timestamp: number) => {
        if (gameState !== 'PLAYING') return;

        const dt = timestamp - lastTickRef.current;
        lastTickRef.current = timestamp;

        // Move Enemies
        setEnemies(prev => {
            let nextHp = serverHp;
            const nextEnemies = prev.filter(enemy => {
                if (enemy.hp <= 0) return false;

                // Simple pathfinding
                let targetPoint = 1;
                for (let i = 1; i < PATH.length; i++) {
                    if (enemy.y < PATH[i].y && PATH[i].y > PATH[i-1].y) { targetPoint = i; break; }
                    if (enemy.y > PATH[i].y && PATH[i].y < PATH[i-1].y) { targetPoint = i; break; }
                    if (enemy.x < PATH[i].x && PATH[i].x > PATH[i-1].x) { targetPoint = i; break; }
                    if (enemy.x > PATH[i].x && PATH[i].x < PATH[i-1].x) { targetPoint = i; break; }
                }

                if (targetPoint < PATH.length) {
                    const target = PATH[targetPoint];
                    const dx = target.x - enemy.x;
                    const dy = target.y - enemy.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 1) {
                        enemy.x = target.x;
                        enemy.y = target.y;
                    } else {
                        enemy.x += (dx / dist) * enemy.speed;
                        enemy.y += (dy / dist) * enemy.speed;
                    }
                }

                // Hit Server
                if (enemy.y > 100) {
                    nextHp -= 10;
                    return false;
                }
                return true;
            });

            if (nextHp < serverHp) {
                setServerHp(Math.max(0, nextHp));
                if (nextHp <= 0) {
                    setGameState('GAME_OVER');
                    trigger('going_broke');
                }
            }

            return nextEnemies;
        });

        // Towers Fire
        setTowers(prev => prev.map(tower => {
            if (timestamp - tower.lastFired > tower.cooldown) {
                // Find target
                setEnemies(currentEnemies => {
                    const target = currentEnemies.find(e => {
                        const dx = e.x - tower.x;
                        const dy = e.y - tower.y;
                        return Math.sqrt(dx*dx + dy*dy) <= tower.range;
                    });

                    if (target) {
                        // Fire projectile (instant hit for simplicity)
                        target.hp -= tower.damage;
                        tower.lastFired = timestamp;
                        
                        setProjectiles(p => [...p, { id: Math.random().toString(), x: tower.x, y: tower.y, targetId: target.id, speed: 2 }]);
                        
                        if (target.hp <= 0) {
                            setMoney(m => m + target.reward);
                            setScore(s => s + target.reward * 10);
                        }
                    }
                    return [...currentEnemies];
                });
            }
            return tower;
        }));

        // Clean Projectiles
        setProjectiles(prev => prev.filter(p => Math.random() > 0.2)); // Die off quickly

        // Check Wave End
        setEnemies(currentEnemies => {
            if (currentEnemies.length === 0 && enemiesSpawnedRef.current >= WAVES[wave].count && gameState === 'PLAYING') {
                if (wave + 1 >= WAVES.length) {
                    setGameState('VICTORY');
                    trigger('game_over_win');
                } else {
                    setGameState('WAVE_END');
                    trigger('good_decision');
                }
            }
            return currentEnemies;
        });

        if (gameState === 'PLAYING' && serverHp > 0) {
            loopRef.current = requestAnimationFrame(gameLoop);
        }
    }, [gameState, serverHp, wave, trigger]);

    const handleGridClick = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
        if (!selectedTower || gameState !== 'PLAYING') return;

        const bounds = e.currentTarget.getBoundingClientRect();
        const clientX = 'clientX' in e ? e.clientX : 0;
        const clientY = 'clientY' in e ? e.clientY : 0;
        const x = ((clientX - bounds.left) / bounds.width) * 100;
        const y = ((clientY - bounds.top) / bounds.height) * 100;

        const towerType = TOWER_TYPES.find(t => t.type === selectedTower);
        if (!towerType) return;

        if (money >= towerType.cost) {
            setMoney(m => m - towerType.cost);
            setTowers(prev => [...prev, {
                id: Math.random().toString(),
                type: towerType.type as any,
                x, y,
                range: towerType.range,
                damage: towerType.damage,
                cooldown: towerType.cooldown,
                lastFired: 0,
                icon: towerType.icon
            }]);
            setSelectedTower(null);
        }
    };

    const nextWave = () => {
        setWave(w => w + 1);
        startWave(wave + 1);
    };

    const handleComplete = () => {
        stopGame();
        onComplete(score, { wavesCompleted: wave, finalHp: serverHp });
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 overflow-hidden relative font-sans text-white select-none touch-none">
            <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

            {/* HUD */}
            <div className="p-3 bg-slate-800 shadow-sm z-20 flex justify-between items-center shrink-0 border-b border-slate-700">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Budget</div>
                        <div className="text-lg font-black flex items-center gap-1 text-green-400">
                            $<span className="tabular-nums">{money}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Score</div>
                        <div className="text-lg font-black flex items-center gap-1 text-blue-400">
                            <span className="tabular-nums">{score}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Server Integrity</div>
                    <div className="flex items-center gap-2 w-32">
                        <Server size={14} className={serverHp > 50 ? 'text-blue-400' : 'text-red-500'} />
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div className={`h-full ${serverHp > 50 ? 'bg-blue-500' : 'bg-red-500'}`} animate={{ width: `${serverHp}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN GAME AREA */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Build Menu (Sidebar / Touch responsive) */}
                <div className="w-20 md:w-28 bg-slate-800 border-r border-slate-700 flex flex-col p-2 gap-2.5 z-20 shrink-0">
                    <div className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-wider mb-1">Defenders</div>
                    {TOWER_TYPES.map(t => (
                        <button 
                            key={t.type} 
                            type="button"
                            onPointerDown={(e) => { e.preventDefault(); setSelectedTower(selectedTower === t.type ? null : t.type); }} 
                            disabled={money < t.cost}
                            className={`p-2 min-h-[60px] rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative active:scale-95
                            ${money < t.cost ? 'opacity-50 grayscale border-slate-700 bg-slate-800' : 
                              selectedTower === t.type ? 'border-green-400 bg-green-900/40 ring-2 ring-green-400/50 scale-105' : 'border-slate-600 bg-slate-700 hover:border-slate-500'}`}>
                            <div className="text-2xl mb-0.5">{t.icon}</div>
                            <div className="text-[11px] font-black">${t.cost}</div>
                            {selectedTower === t.type && (
                                <div className="absolute top-1/2 left-full ml-2 w-32 bg-slate-800 p-2 rounded-xl border border-slate-600 text-[10px] z-50 pointer-events-none shadow-xl">
                                    <p className="font-bold text-white mb-1">{t.name}</p>
                                    <p className="text-slate-400">{t.desc}</p>
                                    <p className="text-blue-400 mt-1">Range: {t.range}</p>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid / Map with Immediate Pointer Down Placement */}
                <div 
                    className="flex-1 bg-slate-900 relative overflow-hidden touch-none" 
                    onClick={handleGridClick} 
                    onPointerDown={handleGridClick}
                    style={{ cursor: selectedTower ? 'crosshair' : 'default' }}
                >
                    
                    {/* Path Render */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        <polyline points={PATH.map(p => `${p.x}%,${p.y}%`).join(' ')} fill="none" stroke="#475569" strokeWidth="40" strokeLinejoin="round" strokeLinecap="round" />
                        <polyline points={PATH.map(p => `${p.x}%,${p.y}%`).join(' ')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" strokeDasharray="10 10" className="animate-pulse" />
                    </svg>

                    {/* Towers */}
                    {towers.map(tower => (
                        <div key={tower.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-3xl z-10"
                            style={{ left: `${tower.x}%`, top: `${tower.y}%` }}>
                            {tower.icon}
                            {/* Attack Range Preview when selected */}
                            {selectedTower && (
                                <div className="absolute border border-blue-500/30 rounded-full bg-blue-500/5 pointer-events-none"
                                    style={{ width: `${tower.range * 2}%`, height: `${tower.range * 2}%`, paddingBottom: `${tower.range * 2}%` }} />
                            )}
                        </div>
                    ))}

                    {/* Enemies */}
                    {enemies.map(enemy => (
                        <div key={enemy.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-2xl z-20 transition-all duration-75"
                            style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}>
                            <div className="w-8 h-1 bg-slate-700 rounded-full mb-1 overflow-hidden">
                                <div className={`h-full ${enemy.hp / enemy.maxHp > 0.5 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                            </div>
                            {enemy.icon}
                        </div>
                    ))}

                    {/* Projectiles */}
                    {projectiles.map(p => (
                        <div key={p.id} className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)] transform -translate-x-1/2 -translate-y-1/2 z-30"
                            style={{ left: `${p.x}%`, top: `${p.y}%` }} />
                    ))}

                    {/* Server Base (Target) */}
                    <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-40 h-20 bg-blue-900/50 border-t-4 border-blue-500 rounded-t-3xl flex items-center justify-center z-10">
                        <Server size={32} className={`text-blue-400 ${serverHp < 50 ? 'animate-pulse text-red-500' : ''}`} />
                    </div>

                    {/* Cursor preview */}
                    {selectedTower && (
                        <div className="absolute inset-0 pointer-events-none bg-blue-500/5 z-50">
                            <p className="absolute bottom-4 left-4 text-blue-400 font-bold bg-slate-900/80 px-4 py-2 rounded-xl">
                                Click anywhere to place {TOWER_TYPES.find(t=>t.type===selectedTower)?.name}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* OVERLAYS */}
            {gameState !== 'PLAYING' && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                        
                        {gameState === 'START' && (
                            <>
                                <Shield size={64} className="mx-auto text-blue-500 mb-4" />
                                <h2 className="text-3xl font-black text-white mb-2">{config?.name || 'Cyber Defense'}</h2>
                                <p className="text-slate-400 mb-6 text-sm">{config?.description || 'Protect the central server from hackers!'}</p>
                                <button onClick={startGame} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-1 active:shadow-none transition-all">
                                    Initialize Defense
                                </button>
                            </>
                        )}

                        {gameState === 'WAVE_END' && (
                            <>
                                <h2 className="text-3xl font-black text-green-400 mb-2">Wave {wave + 1} Cleared!</h2>
                                <div className="bg-slate-900 rounded-xl p-4 mb-6 text-left text-sm text-slate-300">
                                    <p className="font-bold text-blue-400 mb-1">💡 Cybesecurity Fact:</p>
                                    <p>Hackers often use Botnets (networks of infected computers) to launch massive attacks. Build more defenses before the next wave!</p>
                                </div>
                                <button onClick={nextWave} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-1 active:shadow-none transition-all">
                                    Start Next Wave
                                </button>
                            </>
                        )}

                        {gameState === 'GAME_OVER' && (
                            <>
                                <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
                                <h2 className="text-3xl font-black text-red-500 mb-2">Server Breached!</h2>
                                <p className="text-xl text-white mb-6">Score: {score}</p>
                                <button onClick={handleComplete} className="w-full py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(71,85,105,1)] active:translate-y-1 active:shadow-none transition-all">
                                    View Report
                                </button>
                            </>
                        )}

                        {gameState === 'VICTORY' && (
                            <>
                                <Shield size={64} className="mx-auto text-green-500 mb-4" />
                                <h2 className="text-3xl font-black text-green-500 mb-2">Network Secured!</h2>
                                <p className="text-xl text-white mb-6">Final Score: {score}</p>
                                <button onClick={handleComplete} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(22,163,74,1)] active:translate-y-1 active:shadow-none transition-all">
                                    Complete Mission
                                </button>
                            </>
                        )}

                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DefenseTemplate;
