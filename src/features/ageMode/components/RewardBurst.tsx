import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star } from "lucide-react";
import { useAgeMode } from '../hooks/useAgeMode';

interface RewardBurstProps {
  show: boolean;
  onClose?: () => void;
  title?: string;
  coinsEarned?: number;
  starsEarned?: number;
}

export const RewardBurst: React.FC<RewardBurstProps> = ({
  show,
  onClose,
  title,
  coinsEarned = 50,
  starsEarned = 3
}) => {
  const { isJunior, playSuccess, labels, isArabic } = useAgeMode();

  useEffect(() => {
    if (show) {
      playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF8A00', '#FACC15', '#0EA5E9', '#38BDF8', '#4ADE80']
        });
      } catch {
        // Fallback if canvas-confetti is not loaded
      }
    }
  }, [show, playSuccess]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative max-w-sm w-full bg-white dark:bg-slate-900 rounded-[28px] p-6 sm:p-8 text-center shadow-[0_25px_50px_rgba(0,0,0,0.25)] border border-orange-100 dark:border-slate-800 select-none"
        >
          {/* Top Mascot Icon */}
          <div className="w-20 h-20 mx-auto -mt-14 mb-3 rounded-full bg-gradient-to-tr from-[#FF8A00] to-[#FACC15] p-1 shadow-lg flex items-center justify-center">
            <span className="text-4xl">🦉</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
            {title || labels.goodJob}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 font-bold text-base mb-6">
            {isArabic ? 'لقد أكملت المغامرة بنجاح!' : 'You completed this adventure!'}
          </p>

          {/* Reward Badges: Stars & Coins */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Stars */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-950/40 rounded-[20px] shadow-sm">
              <Star className="w-6 h-6 text-amber-500 fill-amber-400 drop-shadow" />
              <span className="text-2xl font-black text-amber-600 dark:text-amber-300">
                +{starsEarned}
              </span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 dark:bg-orange-950/40 rounded-[20px] shadow-sm">
              <img src="/icons/3d/coin.png" alt="coin" className="w-7 h-7 object-contain" />
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                +{coinsEarned}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full h-14 rounded-[20px] bg-gradient-to-b from-[#FF8A00] to-[#F97316] text-white font-black text-lg shadow-[0_5px_0_#C2410C,0_10px_20px_rgba(249,115,22,0.3)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {isArabic ? 'استمر في المغامرة' : 'Continue'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
