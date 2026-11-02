import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, X, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import CoinIcon from '../ui/CoinIcon';
import { useTranslation } from 'react-i18next';

interface PassiveIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    propertyCount: number;
}

export const PassiveIncomeModal: React.FC<PassiveIncomeModalProps> = ({
    isOpen,
    onClose,
    amount,
    propertyCount
}) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const handleClaim = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-indigo-500"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                    <div className="p-8 text-center relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-6 relative inline-block">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30"
                            >
                                <Coins size={48} className="text-white" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-4 -right-4 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white dark:border-gray-900"
                            >
                                <Building2 size={24} />
                            </motion.div>
                        </div>

                        <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2 leading-tight">
                            {t('real_estate.modal.welcome_back', 'Welcome Back, CEO!')}
                        </h2>
                        
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">
                            {t('real_estate.modal.worked_hard', 'Your properties were hard at work while you were away!')}
                        </p>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-6 mb-8 border-2 border-indigo-100 dark:border-indigo-900/30">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={16} />
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                    {t('real_estate.modal.accrued_profit', 'Accrued Profit')}
                                </span>
                            </div>
                            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                                <CoinIcon size={38} className="shrink-0" />
                                <span>{amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-400 font-bold">
                                {t('real_estate.modal.from_active', { count: propertyCount, defaultValue: `from ${propertyCount} active investments` })}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClaim}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black text-xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 group"
                        >
                            <Sparkles className="group-hover:animate-spin" />
                            {t('real_estate.modal.claim', 'Claim My Earnings')}
                        </motion.button>
                        
                        <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-tighter">
                            {t('real_estate.modal.check_daily', 'Check in daily to maximize your passive returns!')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
