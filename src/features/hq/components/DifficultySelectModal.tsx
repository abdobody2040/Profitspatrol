import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Briefcase, Zap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface DifficultySelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (difficulty: Difficulty) => void;
    type: 'BOSS' | 'PROJECT';
}

const DifficultySelectModal: React.FC<DifficultySelectModalProps> = ({ isOpen, onClose, onSelect, type }) => {
    const { t, i18n } = useTranslation();

    // Debug Translation


    if (!isOpen) return null;

    const options: { id: Difficulty, label: string, color: string, desc: string, icon: any }[] = [
        {
            id: 'EASY',
            label: t('difficulty_modal.rookie.label', { defaultValue: 'Rookie' }),
            color: 'bg-green-500',
            desc: type === 'BOSS' ? t('difficulty_modal.rookie.desc', { defaultValue: 'More Cash, Slower Burn' }) : 'Simple Feedback, Lenient Grading',
            icon: Star
        },
        {
            id: 'MEDIUM',
            label: t('difficulty_modal.founder.label', { defaultValue: 'Founder' }),
            color: 'bg-blue-500',
            desc: type === 'BOSS' ? t('difficulty_modal.founder.desc', { defaultValue: 'Standard Challenge' }) : 'Standard Expectations',
            icon: Briefcase
        },
        {
            id: 'HARD',
            label: t('difficulty_modal.tycoon.label', { defaultValue: 'Tycoon' }),
            color: 'bg-red-500',
            desc: type === 'BOSS' ? t('difficulty_modal.tycoon.desc', { defaultValue: 'Less Cash, Fast Burn!' }) : 'Strict Grading, CEO Level!',
            icon: Zap
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-gray-100 dark:border-gray-700 relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                            {type === 'BOSS' ? <Shield size={40} /> : <Briefcase size={40} />}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide">
                            {t('difficulty_modal.title', { defaultValue: 'Choose Difficulty' })}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">
                            {t('difficulty_modal.subtitle', { defaultValue: 'How much of a challenge do you want?' })}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => onSelect(opt.id)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all group bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${opt.color} group-hover:scale-110 transition-transform`}>
                                    <opt.icon size={24} fill="currentColor" />
                                </div>
                                <div className="text-start flex-1">
                                    <div className="font-black text-lg text-gray-800 dark:text-white">{opt.label}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{opt.desc}</div>
                                </div>
                                <div className="ml-auto text-gray-300 group-hover:text-gray-500">
                                    ➜
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DifficultySelectModal;
