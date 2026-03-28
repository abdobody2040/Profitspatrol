import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SideHustle } from '../../../../types';
import { Zap, Star } from 'lucide-react';

interface TapMinigameProps {
    gig: SideHustle;
    onScoreUpdate: (score: number) => void;
    timeLeft: number;
}

const TapMinigame: React.FC<TapMinigameProps> = ({ gig, onScoreUpdate, timeLeft }) => {
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
    const [lastTapTime, setLastTapTime] = useState(0);

    const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTime;

        // Combo system: if tapped within 500ms, increase combo
        if (timeSinceLastTap < 500 && combo < 10) {
            setCombo(prev => prev + 1);
        } else if (timeSinceLastTap > 1000) {
            setCombo(0);
        }

        setLastTapTime(now);

        // Score increases with combo multiplier
        const points = 5 + combo;
        const newScore = Math.min(100, score + points);
        setScore(newScore);
        onScoreUpdate(newScore);

        // Create particle effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const particleId = Date.now();

        setParticles(prev => [...prev, { id: particleId, x, y }]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== particleId));
        }, 1000);
    };

    // Get gig-specific content
    const getGigContent = () => {
        switch (gig.id) {
            case 'hustle_dog_walking':
                return { emoji: '🐕', action: 'Walk!', color: 'from-amber-500 to-orange-600' };
            case 'hustle_grocery_bagger':
                return { emoji: '🛒', action: 'Bag!', color: 'from-green-500 to-emerald-600' };
            case 'hustle_lemonade_stand':
                return { emoji: '🍋', action: 'Serve!', color: 'from-yellow-400 to-yellow-600' };
            case 'hustle_social_media':
                return { emoji: '📱', action: 'Post!', color: 'from-purple-500 to-pink-600' };
            default:
                return { emoji: '⚡', action: 'Tap!', color: 'from-blue-500 to-blue-700' };
        }
    };

    const content = getGigContent();

    return (
        <div data-testid="minigame" data-minigame-type="tap" className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-8 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-800 mb-2">{gig.title}</h2>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{timeLeft}s</div>
                <p className="text-gray-600 font-bold">Tap rapidly to earn more!</p>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-8 bg-gray-200 rounded-full mb-4 overflow-hidden border-4 border-gray-100 relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    animate={{ width: `${score}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                    {score}%
                </div>
            </div>

            {/* Combo Counter */}
            <AnimatePresence>
                {combo > 0 && (
                    <motion.div
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -20 }}
                        className="mb-4 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-black shadow-lg"
                    >
                        <Star className="fill-current" size={20} />
                        <span>COMBO x{combo + 1}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tap Button */}
            <div className="relative">
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleTap}
                    aria-label="Tap to work"
                    className={`w-56 h-56 rounded-full bg-gradient-to-br ${content.color} shadow-2xl flex flex-col items-center justify-center border-8 border-white hover:scale-105 transition-transform relative overflow-hidden`}
                >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>

                    <div className="text-7xl mb-2 relative z-10">{content.emoji}</div>
                    <div className="text-2xl font-black text-white relative z-10">{content.action}</div>

                    {/* Particles */}
                    <AnimatePresence>
                        {particles.map(particle => (
                            <motion.div
                                key={particle.id}
                                initial={{ scale: 1, opacity: 1, x: particle.x, y: particle.y }}
                                animate={{ scale: 0, opacity: 0, y: particle.y - 100 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute pointer-events-none"
                            >
                                <Zap className="text-yellow-300 fill-current" size={24} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.button>
            </div>

            <p className="mt-6 text-sm text-gray-500 font-medium">
                💡 Tip: Tap quickly for combo bonuses!
            </p>
        </div>
    );
};

export default TapMinigame;
