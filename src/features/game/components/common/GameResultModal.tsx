
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Home, Star, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameResultModalProps {
    isOpen: boolean;
    onReplay: () => void;
    onExit: () => void;
    score: number;
    stars: number;
    title: string;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ isOpen, onReplay, onExit, score, stars, title }) => {
    const { t } = useTranslation();

    React.useEffect(() => {
        if (isOpen && stars > 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FCD34D', '#F59E0B', '#D97706', '#FFFFFF']
            });
        }
    }, [isOpen, stars]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-white/10 relative overflow-hidden"
                >
                    {/* Background Shine */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-400/20 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse" />
                                <Trophy size={80} className="text-yellow-400 drop-shadow-lg relative z-10" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2 uppercase tracking-wide">
                            {stars > 0 ? t('common.great_job') : t('common.game_over')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">
                            {title}
                        </p>

                        {/* Stars */}
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3].map((star) => (
                                <motion.div
                                    key={star}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: star * 0.2, type: "spring" }}
                                >
                                    <Star
                                        size={48}
                                        className={`${star <= stars ? 'fill-yellow-400 text-yellow-600' : 'fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600'}`}
                                        strokeWidth={3}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 mb-8">
                            <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                                {t('common.score')}
                            </div>
                            <div className="text-4xl font-black text-gray-800 dark:text-white font-mono">
                                {score.toLocaleString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onReplay}
                                className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 transition-colors"
                            >
                                <RotateCcw size={20} />
                                {t('common.replay')}
                            </button>
                            <button
                                onClick={onExit}
                                className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-kid-primary text-yellow-900 hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
                            >
                                <Home size={20} />
                                {t('common.menu')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GameResultModal;
