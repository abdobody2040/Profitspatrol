import React from 'react';
import { useGradingStore } from '../store/useGradingStore';
import { motion } from 'framer-motion';
import { Coins, Zap, Star, Award, TrendingUp, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProjectResultCard: React.FC = () => {
    const { gradeResult, reset } = useGradingStore();
    const { t } = useTranslation();

    if (!gradeResult) return null;

    const { score, letterGrade, feedback, bizCoinsAwarded, xpGained } = gradeResult;

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'Tycoon': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Founder': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300';
        }
    };

    const getGradeIcon = (grade: string) => {
        switch (grade) {
            case 'Tycoon': return <Trophy size={48} className="text-yellow-500" />;
            case 'Founder': return <TrendingUp size={48} className="text-blue-500" />;
            default: return <Star size={48} className="text-orange-500" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto border-4 border-yellow-400"
        >
            {/* Header / Grade Badge */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-center text-white relative overflow-hidden">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {getGradeIcon(letterGrade)}
                    </div>
                    <h2 className="text-5xl font-black mb-2">{score}%</h2>
                    <div className={`inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm font-bold uppercase tracking-widest text-sm border border-white/30`}>
                        {letterGrade} Status
                    </div>
                </motion.div>

                {/* Confetti / Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
            </div>

            {/* Rewards */}
            <div className="flex justify-center gap-4 -mt-6 relative z-20">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="bg-white dark:bg-gray-700 px-6 py-3 rounded-2xl shadow-lg border-2 border-green-100 dark:border-green-800 flex items-center gap-2"
                >
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Coins size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase">Earned</div>
                        <div className="font-black text-xl text-gray-800 dark:text-white">+{bizCoinsAwarded}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="bg-white dark:bg-gray-700 px-6 py-3 rounded-2xl shadow-lg border-2 border-blue-100 dark:border-blue-800 flex items-center gap-2"
                >
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <Zap size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase">XP Gained</div>
                        <div className="font-black text-xl text-gray-800 dark:text-white">+{xpGained}</div>
                    </div>
                </motion.div>
            </div>

            {/* Feedback */}
            <div className="p-8 space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-6 rounded-r-xl">
                    <h3 className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase text-xs tracking-wider">
                        <Award size={16} /> Ollie's Feedback
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-lg font-medium leading-relaxed italic">
                        "{feedback}"
                    </p>
                </div>

                <button
                    onClick={reset}
                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-bold py-4 rounded-xl transition-colors"
                >
                    {t('project.close', { defaultValue: 'Close & Continue' })}
                </button>
            </div>
        </motion.div>
    );
};

export default ProjectResultCard;
