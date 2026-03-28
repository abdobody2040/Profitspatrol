import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PlayHubFeature {
    id: string;
    label: string;
    emoji: string;
    gradient: string;
    onClick: () => void;
    badge?: string;
}

interface PlayHubFABProps {
    features: PlayHubFeature[];
    spinReady?: boolean;
}

export const PlayHubFAB: React.FC<PlayHubFABProps> = ({ features, spinReady }) => {
    const [open, setOpen] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.3, y: 24 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 20 } },
    };

    return (
        <>
            {/* ── Backdrop ─────────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[149] bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Feature Grid ─────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                        /* Grid opens above FAB on both mobile and desktop */
                        className="fixed z-[150]
                            bottom-[19rem] right-1
                            md:bottom-[21rem] md:right-4"
                    >
                        {/* Decorative header label */}
                        <div className="text-center mb-2">
                            <span className="text-white text-xs font-black bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
                                🎮 Play Hub
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {features.map((f) => (
                                <motion.button
                                    key={f.id}
                                    variants={itemVariants}
                                    onClick={() => { setOpen(false); f.onClick(); }}
                                    whileTap={{ scale: 0.88 }}
                                    className={`relative rounded-2xl bg-gradient-to-br ${f.gradient}
                                        flex flex-col items-center justify-center gap-1 shadow-xl
                                        w-[72px] h-[72px] sm:w-20 sm:h-20`}
                                    title={f.label}
                                >
                                    {/* Badge */}
                                    {f.badge && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 leading-none">
                                            {f.badge}
                                        </span>
                                    )}
                                    <span className="text-2xl sm:text-3xl leading-none select-none">{f.emoji}</span>
                                    <span className="text-white text-[9px] sm:text-[10px] font-black leading-tight text-center px-1 drop-shadow">
                                        {f.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main FAB ─────────────────────────────────── */}
            <motion.button
                id="play-hub-fab"
                onClick={() => setOpen(v => !v)}
                animate={{ rotate: open ? 45 : 0, scale: open ? 0.9 : 1 }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                /* Stacked above Ollie on both mobile and desktop (Ollie is at bottom-24 on mobile, bottom-6 on md) */
                className={`fixed z-[151]
                    bottom-[10.5rem] right-4
                    md:bottom-44 md:right-4
                    w-14 h-14 sm:w-16 sm:h-16
                    rounded-full flex items-center justify-center shadow-2xl
                    text-2xl sm:text-3xl
                    bg-gradient-to-br from-violet-600 to-indigo-700
                    hover:scale-110 active:scale-95 transition-transform
                    ${spinReady && !open ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse' : ''}
                `}
                title={open ? 'Close Play Hub' : 'Open Play Hub'}
            >
                <span className="select-none">{open ? '✕' : '🎮'}</span>
            </motion.button>
        </>
    );
};

export default PlayHubFAB;
