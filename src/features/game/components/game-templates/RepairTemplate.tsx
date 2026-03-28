import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { Check, User, Wrench } from 'lucide-react';
import { BusinessSimulation, RepairConfig } from '../../../../types';

interface RepairTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const DEFAULT_CONFIG: RepairConfig = {
    parts: [
        { id: 'p1', name: 'Part 1', icon: '⚙️', initial_pos: { x: 10, y: 10 }, target_pos: { x: 50, y: 50 } }
    ],
    bg_color: '#374151'
};

const RepairTemplate: React.FC<RepairTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const repairConfig = config?.repair_config || DEFAULT_CONFIG;
    const { parts, bg_color } = repairConfig;

    // State
    const [completedParts, setCompletedParts] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isPlaying, setIsPlaying] = useState(true);

    // Timer
    useEffect(() => {
        if (!isPlaying) return;
        if (completedParts.length === parts.length) {
            handleWin();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsPlaying(false);
                    onComplete(0, { completed: false }); // Fail
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [completedParts, isPlaying]);

    const handleWin = () => {
        setIsPlaying(false);
        const score = 100 + timeLeft * 10;
        setTimeout(() => {
            onComplete(score, { completed: true, time: 60 - timeLeft });
        }, 1000);
    };

    const handleDragEnd = (partId: string, info: any) => {
        // Calculate position relative to container
        // This is tricky with Framer Motion drag constraints if not careful.
        // Simplified approach: Check if "point" key is close. 
        // Actually, we can just use simple distance check if we track component ref coordinates.
        // For rapid prototype, let's trust visual "snap" area.

        // But we need coordinate logic.
        // Let's assume the container is 100x100 relative units.
        // motion.div doesn't easily give us % coordinates on dragEnd.

        // Alternative: Use click-to-select and click-target? No, drag is requested.

        // Hack for prototype: Random success chance or just click to fix?
        // No, drag is essential.

        // Let's implement visual targets.
        // If the user drops it "near" the target (visually).

        // Since getting exact coordinates from drag info (pixels) vs % is hard without measuring refs:
        // We will make the "Targets" Droppable?
        // We will just simulate it:
        // Users "Click" the part, then "Click" the target?
        // Drag is better.

        // Real implementation: Ref for container.
        // event.clientX/Y to relative %

        // Let's rely on standard pointer events. 
    };

    // Ref container to measure bounds
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col h-full rounded-3xl overflow-hidden border-2 select-none"
            style={{ borderColor: config?.visual_config?.colors?.primary || '#ccc' }}>

            {/* HUD */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-2">
                    <Wrench className="text-yellow-400" />
                    <span className="font-bold">Repairs: {completedParts.length}/{parts.length}</span>
                </div>
                <div className={`font-mono text-xl ${timeLeft < 10 ? 'text-red-400 animate-pulse' : ''}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* RELATIVE BOARD */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden touch-none"
                style={{ backgroundColor: bg_color || '#333' }}
            >
                {/* TARGET SHADOWS */}
                {parts.map(part => (
                    <div
                        key={`target-${part.id}`}
                        className="absolute w-20 h-20 border-4 border-dashed border-white/30 rounded-full flex items-center justify-center text-4xl grayscale opacity-50"
                        style={{
                            left: `${part.target_pos.x}%`,
                            top: `${part.target_pos.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {part.icon}
                    </div>
                ))}

                {/* DRAGGABLE PARTS */}
                {parts.map(part => {
                    const isDone = completedParts.includes(part.id);
                    // Standardize size

                    return (
                        <motion.div
                            key={part.id}
                            drag={!isDone}
                            dragMomentum={false}
                            onDragEnd={(event, info) => {
                                if (isDone || !containerRef.current) return;

                                const bounds = containerRef.current.getBoundingClientRect();
                                const x = info.point.x - bounds.left;
                                const y = info.point.y - bounds.top;

                                const xPct = (x / bounds.width) * 100;
                                const yPct = (y / bounds.height) * 100;

                                // Distance Check (Tolerance 10%)
                                const dist = Math.sqrt(
                                    Math.pow(xPct - part.target_pos.x, 2) +
                                    Math.pow(yPct - part.target_pos.y, 2)
                                );

                                if (dist < 10) {
                                    setCompletedParts(prev => [...prev, part.id]);
                                }
                            }}
                            className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-xl cursor-grab active:cursor-grabbing border-4 border-white/50 backdrop-blur-sm z-20 transition-colors
                                ${isDone ? 'bg-green-500/80 border-green-400 cursor-default' : 'bg-gray-700/80 hover:bg-gray-600/80'}
                            `}
                            // Note: We need to use 'animate' prop to move it when done (snap)
                            // But for dragging, we use drag constraints.
                            // To position initially:
                            initial={{
                                left: `${part.initial_pos.x}%`,
                                top: `${part.initial_pos.y}%`,
                                x: '-50%',
                                y: '-50%'
                            }}
                            animate={isDone ? {
                                left: `${part.target_pos.x}%`,
                                top: `${part.target_pos.y}%`,
                                scale: 1.1,
                                rotate: [0, 10, -10, 0] // wiggle success
                            } : {
                                scale: 1
                            }}
                        >
                            {isDone ? <Check className="text-white w-10 h-10" /> : part.icon}
                        </motion.div>
                    );
                })}

                {/* Wires/Lines could be drawn here with SVG */}
            </div>

            {/* INFO */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t z-10 text-center">
                <p className="text-gray-500 text-sm">Drag parts to their matching outlines to fix the device.</p>
            </div>
        </div>
    );
};

export default RepairTemplate;

