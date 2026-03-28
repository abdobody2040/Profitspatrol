import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { Scale } from 'lucide-react';
import { BusinessSimulation } from '../../../../types';

interface PhysicsTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const PhysicsTemplate: React.FC<PhysicsTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const colors = config?.visual_config?.colors || { primary: '#10B981', background: '#ECFDF5' };

    const [blocks, setBlocks] = useState<{ id: number, width: number, offset: number }[]>([]);
    const [currentOffset, setCurrentOffset] = useState(0); // -50 to 50
    const [direction, setDirection] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [balance, setBalance] = useState(0); // Center of mass offset

    const speed = useRef(2);
    const requestRef = useRef<number>();

    useEffect(() => {
        if (isGameOver) return;

        const animate = () => {
            setCurrentOffset(prev => {
                const next = prev + (speed.current * direction);
                if (next > 45 || next < -45) {
                    setDirection(d => d * -1);
                }
                return next;
            });
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(requestRef.current!);
    }, [direction, isGameOver, blocks]); // Speed update?

    const dropBlock = () => {
        if (isGameOver) return;

        // Add block
        const newBlock = { id: Date.now(), width: 30, offset: currentOffset };
        const newBlocks = [...blocks, newBlock];

        // Calculate physics (Simplified Center of Mass)
        // If center of mass is outside the base, topple.
        // Base width = 30%?
        // Let's assume normalized width 100. Base is at 0.
        // If Abs(CenterOfMass) > Threshold, fail.

        // We will assume simpler mechanic: Stacking with overlap.
        // If new block doesn't overlap previous block enough?

        let com = 0;
        newBlocks.forEach(b => com += b.offset);
        com /= newBlocks.length;

        setBalance(com);

        if (Math.abs(currentOffset - (blocks.length > 0 ? blocks[blocks.length - 1].offset : 0)) > 40) {
            // Missed!
            endGame();
        } else if (Math.abs(com) > 25) {
            // Toppled!
            endGame();
        } else {
            // Success
            setBlocks(newBlocks);
            setScore(s => s + 1);
            speed.current += 0.2;
            setDirection(Math.random() > 0.5 ? 1 : -1);
        }
    };

    const endGame = () => {
        setIsGameOver(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setTimeout(() => {
            onComplete(score * 10, { height: score });
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden border-2 select-none relative"
            style={{ backgroundColor: colors.background, borderColor: colors.primary }}
        >
            {/* HUD */}
            <div className="absolute top-4 left-4 z-10 font-black text-2xl" style={{ color: colors.primary }}>
                Height: {score}m
            </div>

            {/* CENTER LINE */}
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 border-dashed border-l border-gray-400" />

            {/* BALANCE INDICATOR */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{
                        width: '10px',
                        transform: `translateX(${balance * 2}px)`, // Scale for visibility
                        marginLeft: '50%'
                    }}
                />
            </div>

            {/* GAME AREA */}
            <div className="flex-1 relative flex flex-col-reverse items-center pb-10 perspective-[500px]">

                {/* BASE */}
                <div className="w-32 h-4 bg-gray-800 rounded mb-1" />

                {/* STACK */}
                {blocks.map((block, i) => (
                    <motion.div
                        key={block.id}
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="h-12 w-32 rounded-lg shadow-lg border-2 border-white/20 flex items-center justify-center font-bold text-white mb-1"
                        style={{
                            backgroundColor: colors.primary,
                            x: block.offset * 2 // Scale offset
                        }}
                    >
                        {i + 1}
                    </motion.div>
                ))}

                {/* CURRENT BLOCK (Hovering) */}
                {!isGameOver && (
                    <div
                        className="absolute top-20 h-12 w-32 rounded-lg shadow-xl border-2 border-white/50 bg-white/50 backdrop-blur-sm"
                        style={{
                            transform: `translateX(${currentOffset * 2}px)`,
                            backgroundColor: colors.primary
                        }}
                    />
                )}

                {isGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                        <h2 className="text-4xl font-black text-white animate-bounce-slow">TOPPLED!</h2>
                    </div>
                )}

            </div>

            {/* CONTROLS */}
            <button
                onPointerDown={dropBlock}
                disabled={isGameOver}
                className="h-24 bg-gray-900 text-white font-black text-2xl active:bg-gray-700 transition-colors z-20"
            >
                DROP
            </button>
        </div>
    );
};

export default PhysicsTemplate;

