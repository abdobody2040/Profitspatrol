import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SideHustle } from '../../../../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SwipeMinigameProps {
    gig: SideHustle;
    onScoreUpdate: (score: number) => void;
    timeLeft: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const SwipeMinigame: React.FC<SwipeMinigameProps> = ({ gig, onScoreUpdate, timeLeft }) => {
    const [score, setScore] = useState(0);
    const [currentDirection, setCurrentDirection] = useState<Direction>('up');
    const [swipeCount, setSwipeCount] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

    const directions: Direction[] = ['up', 'down', 'left', 'right'];

    useEffect(() => {
        // Generate random direction
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        setCurrentDirection(randomDir);
    }, [swipeCount]);

    const getDirectionIcon = (dir: Direction) => {
        switch (dir) {
            case 'up': return <ArrowUp size={64} />;
            case 'down': return <ArrowDown size={64} />;
            case 'left': return <ArrowLeft size={64} />;
            case 'right': return <ArrowRight size={64} />;
        }
    };

    const handleSwipe = (detectedDirection: Direction) => {
        if (detectedDirection === currentDirection) {
            // Correct swipe
            setFeedback('correct');
            const newScore = Math.min(100, score + 10);
            setScore(newScore);
            onScoreUpdate(newScore);
            setSwipeCount(prev => prev + 1);
        } else {
            // Wrong swipe
            setFeedback('wrong');
        }

        setTimeout(() => setFeedback(null), 300);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setTouchStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!touchStart) return;

        const deltaX = e.clientX - touchStart.x;
        const deltaY = e.clientY - touchStart.y;
        const threshold = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > threshold) {
                handleSwipe(deltaX > 0 ? 'right' : 'left');
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > threshold) {
                handleSwipe(deltaY > 0 ? 'down' : 'up');
            }
        }

        setTouchStart(null);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        const threshold = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > threshold) {
                handleSwipe(deltaX > 0 ? 'right' : 'left');
            }
        } else {
            if (Math.abs(deltaY) > threshold) {
                handleSwipe(deltaY > 0 ? 'down' : 'up');
            }
        }

        setTouchStart(null);
    };

    const getGigContent = () => {
        switch (gig.id) {
            case 'hustle_grocery_bagger':
                return { emoji: '🛒', task: 'Sort items into the right bags!' };
            case 'hustle_social_media':
                return { emoji: '📱', task: 'Swipe to schedule posts!' };
            case 'hustle_streamer':
                return { emoji: '🎮', task: 'React to viewer requests!' };
            case 'hustle_car_wash':
                return { emoji: '🚗', task: 'Clean the car!' };
            case 'hustle_bike_repair':
                return { emoji: '🚲', task: 'Fix the bike!' };
            case 'hustle_app_tester':
                return { emoji: '📱', task: 'Test the app!' };
            default:
                return { emoji: '✨', task: 'Swipe!' };
        }
    };

    const content = getGigContent();

    return (
        <div data-testid="minigame" data-minigame-type="swipe" className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-8 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-800 mb-2">{gig.title}</h2>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{timeLeft}s</div>
                <p className="text-gray-600 font-bold">{content.task}</p>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-8 bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-gray-100 relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                    animate={{ width: `${score}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                    {score}%
                </div>
            </div>

            {/* Swipe Area */}
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className={`relative w-80 h-80 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border-8 border-white shadow-2xl flex flex-col items-center justify-center cursor-pointer select-none
                    ${feedback === 'correct' ? 'bg-green-200 scale-105' : ''}
                    ${feedback === 'wrong' ? 'bg-red-200 shake' : ''}
                `}
            >
                {/* Gig Emoji */}
                <div className="text-8xl mb-4">{content.emoji}</div>

                {/* Direction Arrow */}
                <motion.div
                    key={swipeCount}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-indigo-600"
                >
                    {getDirectionIcon(currentDirection)}
                </motion.div>

                <p className="mt-4 text-lg font-bold text-gray-700">
                    Swipe {currentDirection.toUpperCase()}!
                </p>

                {/* Feedback */}
                <AnimatePresence>
                    {feedback === 'correct' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <CheckCircle2 className="text-green-500" size={120} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-6 text-sm text-gray-500 font-medium">
                💡 Tip: Swipe in the direction shown!
            </p>
        </div>
    );
};

export default SwipeMinigame;
