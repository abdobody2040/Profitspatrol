import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
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
        // Score based on efficiency? Or just completion.
        // Let's say base 1000 minus time taken.
        const baseScore = 1000;
        const score = Math.max(100, Math.floor(baseScore - timeTaken * 5));

        setTimeout(() => {
            onComplete(score, { cells: finalCount, time: timeTaken });
        }, 1500);
    };

    // RENDER HELPERS
    const isObstacle = (r: number, c: number) => obstacles.some(o => o.r === r && o.c === c);
    const isVisited = (r: number, c: number) => visited.includes(`${r},${c}`);
    const isPlayer = (r: number, c: number) => playerPos.r === r && playerPos.c === c;

    const themeColors = config?.visual_config?.colors || {
        primary: '#10B981', secondary: '#059669', accent: '#F59E0B', background: '#ECFDF5'
    };

    return (
        <div className="flex flex-col h-full rounded-3xl overflow-hidden border-2 select-none"
            style={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
        >
            {/* HUD */}
            <div className="flex justify-between items-center p-4 text-white shadow-md z-10" style={{ backgroundColor: themeColors.primary }}>
                <div className="font-bold text-lg">Mow the Lawn</div>
                <div className="font-mono text-xl">{Math.round((visited.length / (rows * cols - obstacles.length)) * 100)}%</div>
            </div>

            {/* GRID AREA */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <div
                    className="grid gap-1 shadow-2xl bg-white/50 p-2 rounded-xl border-4"
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
                                    className={`relative rounded-md transition-colors duration-300 flex items-center justify-center text-2xl`}
                                    style={{
                                        backgroundColor: obstacle ? '#374151' : (visit ? visuals.cell_filled : visuals.cell_empty),
                                    }}
                                >
                                    {obstacle && '🪨'}
                                    {player && (
                                        <motion.div
                                            layoutId="player"
                                            className="absolute inset-0 flex items-center justify-center z-10"
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-6 rounded-2xl text-center shadow-xl"
                    >
                        <h2 className="text-3xl font-black text-green-600 mb-2">CLEAN!</h2>
                        <p className="text-gray-500">Great Job!</p>
                    </motion.div>
                </div>
            )}

            {/* MOBILE CONTROLS */}
            <div className="p-4 grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4 md:hidden">
                <div />
                <button onPointerDown={() => move(-1, 0)} className="bg-white p-3 rounded-xl shadow active:bg-gray-100 flex justify-center"><ArrowUp /></button>
                <div />
                <button onPointerDown={() => move(0, -1)} className="bg-white p-3 rounded-xl shadow active:bg-gray-100 flex justify-center"><ArrowLeft /></button>
                <button onPointerDown={() => move(1, 0)} className="bg-white p-3 rounded-xl shadow active:bg-gray-100 flex justify-center"><ArrowDown /></button>
                <button onPointerDown={() => move(0, 1)} className="bg-white p-3 rounded-xl shadow active:bg-gray-100 flex justify-center"><ArrowRight /></button>
            </div>
        </div>
    );
};

export default GridTemplate;

