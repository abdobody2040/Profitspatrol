import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { BusinessSimulation, GridConfig } from '../../../../types';

interface GridTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const DEFAULT_CONFIG: GridConfig = {
    rows: 8, cols: 8, start_pos: { r: 0, c: 0 }, obstacles: [], visuals: { cell_empty: '#e5e7eb', cell_filled: '#10b981', player_icon: '🚜' }
};

const GridTemplate: React.FC<GridTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const gridConfig = config?.grid_config || DEFAULT_CONFIG;
    const { rows, cols, start_pos, obstacles, visuals } = gridConfig;

    const [playerPos, setPlayerPos] = useState(start_pos);
    const [visited, setVisited] = useState<string[]>([`${start_pos.r},${start_pos.c}`]);
    const [moves, setMoves] = useState(0);
    const [startTime] = useState(Date.now());
    const [isComplete, setIsComplete] = useState(false);

    // KEYBOARD CONTROLS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isComplete) return;
            switch (e.key) {
                case 'ArrowUp': move(-1, 0); break;
                case 'ArrowDown': move(1, 0); break;
                case 'ArrowLeft': move(0, -1); break;
                case 'ArrowRight': move(0, 1); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPos, isComplete]);

    const move = (dr: number, dc: number) => {
        const nr = playerPos.r + dr;
        const nc = playerPos.c + dc;

        // Boundary Check
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;

        // Obstacle Check
        if (obstacles.some(o => o.r === nr && o.c === nc)) return;

        // Move
        const newPos = { r: nr, c: nc };
        setPlayerPos(newPos);
        setMoves(m => m + 1);

        const key = `${nr},${nc}`;
        if (!visited.includes(key)) {
            const newVisited = [...visited, key];
            setVisited(newVisited);

            // Check Win
            const totalCells = rows * cols;
            const obstacleCount = obstacles.length;
            const target = totalCells - obstacleCount;

            if (newVisited.length >= target) {
                handleWin(newVisited.length);
            }
        }
    };

    const handleWin = (finalCount: number) => {
        setIsComplete(true);
        const timeTaken = (Date.now() - startTime) / 1000;
        const baseScore = 1000;
        const score = Math.max(100, Math.floor(baseScore - timeTaken * 5));

        setTimeout(() => {
            onComplete(score, { cells: finalCount, time: timeTaken });
        }, 1500);
    };

    // DIRECT TOUCH SWIPE GESTURES ON THE GRID
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);

    const handleGridTouchStart = (e: React.TouchEvent) => {
        touchStartPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    };

    const handleGridTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartPos.current || isComplete) return;
        const touchEnd = e.changedTouches[0];
        const dx = touchEnd.clientX - touchStartPos.current.x;
        const dy = touchEnd.clientY - touchStartPos.current.y;
        const minSwipe = 25;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > minSwipe) {
                move(0, 1); // Right
            } else if (dx < -minSwipe) {
                move(0, -1); // Left
            }
        } else {
            if (dy > minSwipe) {
                move(1, 0); // Down
            } else if (dy < -minSwipe) {
                move(-1, 0); // Up
            }
        }
        touchStartPos.current = null;
    };

    const isObstacle = (r: number, c: number) => obstacles.some(o => o.r === r && o.c === c);
    const isVisited = (r: number, c: number) => visited.includes(`${r},${c}`);
    const isPlayer = (r: number, c: number) => playerPos.r === r && playerPos.c === c;

    const themeColors = config?.visual_config?.colors || {
        primary: '#10B981', secondary: '#059669', accent: '#F59E0B', background: '#ECFDF5'
    };

    return (
        <div className="flex flex-col h-full rounded-[2.5rem] overflow-hidden border-4 select-none relative"
            style={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
        >
            {/* HUD */}
            <div className="flex justify-between items-center p-6 text-white shadow-xl z-10" style={{ backgroundColor: themeColors.primary }}>
                <div className="font-black text-2xl tracking-tight uppercase">{t(`games.${config?.business_id || 'lawn_master'}.title`, 'Mow the Lawn')}</div>
                <div className="bg-white/20 px-4 py-1 rounded-full font-mono text-2xl font-black">{Math.round((visited.length / (rows * cols - obstacles.length)) * 100)}%</div>
            </div>

            {/* GRID AREA WITH DIRECT TOUCH SWIPE GESTURES */}
            <div 
                className="flex-1 flex items-center justify-center p-4 overflow-hidden touch-none"
                onTouchStart={handleGridTouchStart}
                onTouchEnd={handleGridTouchEnd}
            >
                <div
                    className="grid gap-1 shadow-2xl bg-white/50 p-3 rounded-[2rem] border-4"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        aspectRatio: `${cols}/${rows}`,
                        width: '100%',
                        maxWidth: '500px',
                        borderColor: themeColors.secondary
                    }}
                >
                    {Array.from({ length: rows }).map((_, r) => (
                        Array.from({ length: cols }).map((_, c) => {
                            const obstacle = isObstacle(r, c);
                            const visit = isVisited(r, c);
                            const player = isPlayer(r, c);

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`relative rounded-lg transition-colors duration-300 flex items-center justify-center text-lg md:text-2xl`}
                                    style={{
                                        backgroundColor: obstacle ? '#374151' : (visit ? visuals.cell_filled : visuals.cell_empty),
                                    }}
                                >
                                    {obstacle && '🪨'}
                                    {player && (
                                        <motion.div
                                            layoutId="player"
                                            className="absolute inset-0 flex items-center justify-center z-10 drop-shadow-md"
                                        >
                                            {visuals.player_icon}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            {/* MESSAGE OVERLAY */}
            {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-10 rounded-[2.5rem] text-center shadow-2xl border-4 border-green-500"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-green-600 mb-2 uppercase">{t('games.success_msg', 'CLEAN!')}</h2>
                        <p className="text-gray-500 font-bold text-xl">{t('games.great_job', 'Great Job!')}</p>
                    </motion.div>
                </div>
            )}

            {/* HIGH-PRECISION MOBILE TACTILE VIRTUAL D-PAD */}
            <div className="p-4 flex flex-col items-center justify-center max-w-xs mx-auto mb-3 md:hidden">
                <div className="text-[11px] font-black uppercase text-slate-500 mb-2 tracking-wider">
                    {t('games.controls_hint', 'Swipe on screen or use D-Pad')}
                </div>
                <div className="grid grid-cols-3 gap-2.5 bg-slate-900/10 p-3 rounded-3xl border-2 border-slate-900/10 backdrop-blur-sm">
                    <div />
                    <button 
                        type="button"
                        onPointerDown={(e) => { e.preventDefault(); move(-1, 0); }} 
                        className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-1 flex items-center justify-center text-slate-800 border-2 border-slate-200 transition-transform"
                    >
                        <ArrowUp size={28} />
                    </button>
                    <div />
                    <button 
                        type="button"
                        onPointerDown={(e) => { e.preventDefault(); move(0, -1); }} 
                        className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-1 flex items-center justify-center text-slate-800 border-2 border-slate-200 transition-transform"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div className="w-16 h-16 rounded-2xl bg-slate-200/50 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-slate-400/60" />
                    </div>
                    <button 
                        type="button"
                        onPointerDown={(e) => { e.preventDefault(); move(0, 1); }} 
                        className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-1 flex items-center justify-center text-slate-800 border-2 border-slate-200 transition-transform"
                    >
                        <ArrowRight size={28} />
                    </button>
                    <div />
                    <button 
                        type="button"
                        onPointerDown={(e) => { e.preventDefault(); move(1, 0); }} 
                        className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-1 flex items-center justify-center text-slate-800 border-2 border-slate-200 transition-transform"
                    >
                        <ArrowDown size={28} />
                    </button>
                    <div />
                </div>
            </div>
        </div>
    );
};

export default GridTemplate;
