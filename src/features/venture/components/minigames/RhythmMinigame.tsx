import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SideHustle } from '../../../../types';
import { Target, Zap } from 'lucide-react';

interface RhythmMinigameProps {
    gig: SideHustle;
    onScoreUpdate: (score: number) => void;
    timeLeft: number;
}

const RhythmMinigame: React.FC<RhythmMinigameProps> = ({ gig, onScoreUpdate, timeLeft }) => {
    const [score, setScore] = useState(0);
    const [indicatorPosition, setIndicatorPosition] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [feedback, setFeedback] = useState<'perfect' | 'good' | 'miss' | null>(null);
    const [streak, setStreak] = useState(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        // Animate indicator back and forth
        const animate = () => {
            setIndicatorPosition(prev => {
                const newPos = prev + (direction * 2);

                // Bounce at edges
                if (newPos >= 100) {
                    setDirection(-1);
                    return 100;
                } else if (newPos <= 0) {
                    setDirection(1);
                    return 0;
                }

                return newPos;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [direction]);

    const handleHit = () => {
        // Calculate accuracy based on indicator position
        const center = 50;
        const distance = Math.abs(indicatorPosition - center);

        let hitType: 'perfect' | 'good' | 'miss';
        let points = 0;

        if (distance < 5) {
            hitType = 'perfect';
            points = 15;
            setStreak(prev => prev + 1);
        } else if (distance < 15) {
            hitType = 'good';
            points = 10;
            setStreak(prev => prev + 1);
        } else {
            hitType = 'miss';
            points = 0;
            setStreak(0);
        }

        setFeedback(hitType);

        // Add streak bonus
        const bonusPoints = Math.min(streak, 5);
        const totalPoints = points + bonusPoints;

        const newScore = Math.min(100, score + totalPoints);
        setScore(newScore);
        onScoreUpdate(newScore);

        setTimeout(() => setFeedback(null), 500);
    };

    const getGigContent = () => {
        switch (gig.id) {
            case 'hustle_dog_walking':
                return { emoji: '🐕', task: 'Keep a steady walking pace!', color: 'from-amber-500 to-orange-600' };
            case 'hustle_lemonade_stand':
                return { emoji: '🍋', task: 'Serve at the perfect moment!', color: 'from-yellow-400 to-orange-500' };
            case 'hustle_garden':
                return { emoji: '🌱', task: 'Plant in a steady rhythm!', color: 'from-emerald-500 to-green-600' };
            case 'hustle_artist':
                return { emoji: '🎨', task: 'Draw with steady strokes!', color: 'from-fuchsia-500 to-purple-600' };
            case 'hustle_lawn_mower':
                return { emoji: '🌿', task: 'Mow perfectly!', color: 'from-green-500 to-emerald-600' };
            case 'hustle_photographer':
                return { emoji: '📸', task: 'Capture the moment!', color: 'from-purple-500 to-pink-600' };
            case 'hustle_smoothie':
                return { emoji: '🥤', task: 'Blend to the beat!', color: 'from-pink-500 to-rose-600' };
            case 'hustle_drone':
                return { emoji: '🚁', task: 'Fly with precision!', color: 'from-sky-500 to-blue-600' };
            default:
                return { emoji: '🎯', task: 'Hit the target!', color: 'from-blue-500 to-indigo-600' };
        }
    };

    const content = getGigContent();

    return (
        <div data-testid="minigame" data-minigame-type="rhythm" className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-8 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-800 mb-2">{gig.title}</h2>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{timeLeft}s</div>
                <p className="text-gray-600 font-bold">{content.task}</p>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-8 bg-gray-200 rounded-full mb-4 overflow-hidden border-4 border-gray-100 relative">
                <motion.div
                    className={`h-full bg-gradient-to-r ${content.color}`}
                    animate={{ width: `${score}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                    {score}%
                </div>
            </div>

            {/* Streak Counter */}
            <AnimatePresence>
                {streak > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="mb-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-black shadow-lg"
                    >
                        🔥 STREAK x{streak}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rhythm Bar */}
            <div className="w-full max-w-sm mb-6">
                <div className="relative h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl border-4 border-gray-300 overflow-hidden shadow-inner">
                    {/* Perfect Zone */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-12 bg-green-200/50 border-x-4 border-green-400">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Target className="text-green-600" size={32} />
                        </div>
                    </div>

                    {/* Good Zone */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-32 bg-yellow-200/30 border-x-2 border-yellow-400"></div>

                    {/* Moving Indicator */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-purple-600 shadow-lg"
                        style={{ left: `${indicatorPosition}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Zap className="text-yellow-300 fill-current animate-pulse" size={24} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Hit Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleHit}
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${content.color} shadow-2xl flex flex-col items-center justify-center border-8 border-white hover:scale-105 transition-transform text-white`}
            >
                <div className="text-6xl mb-2">{content.emoji}</div>
                <div className="text-2xl font-black">HIT!</div>
            </motion.button>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -20 }}
                        className={`mt-4 px-6 py-3 rounded-full font-black text-xl shadow-lg
                            ${feedback === 'perfect' ? 'bg-green-500 text-white' : ''}
                            ${feedback === 'good' ? 'bg-yellow-500 text-white' : ''}
                            ${feedback === 'miss' ? 'bg-red-500 text-white' : ''}
                        `}
                    >
                        {feedback === 'perfect' && '🎯 PERFECT!'}
                        {feedback === 'good' && '👍 GOOD!'}
                        {feedback === 'miss' && '❌ MISS!'}
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="mt-6 text-sm text-gray-500 font-medium">
                💡 Tip: Hit when the indicator is in the green zone!
            </p>
        </div>
    );
};

export default RhythmMinigame;
