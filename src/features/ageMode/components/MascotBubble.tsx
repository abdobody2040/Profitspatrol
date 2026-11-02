import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useAgeMode } from '../hooks/useAgeMode';

interface MascotBubbleProps {
  message?: string;
  className?: string;
  size?: 'small' | 'normal';
}

export const MascotBubble: React.FC<MascotBubbleProps> = ({
  message = "Tap the glowing path to begin!",
  className = '',
  size = 'normal'
}) => {
  const { isJunior, speakText, playTap, isArabic } = useAgeMode();
  const [isBlinking, setIsBlinking] = useState(false);

  // Enforce maximum 8 words constraint
  const words = message.trim().split(/\s+/);
  const truncatedMessage = words.length > 8 ? words.slice(0, 8).join(' ') + '…' : message;

  // Occasional eye blink effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTap();
    speakText(truncatedMessage);
  };

  return (
    <div className={`inline-flex items-center gap-2.5 max-w-sm select-none ${className}`}>
      {/* Animated Mascot Ollie */}
      <motion.div
        animate={{
          y: [0, -3, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut'
        }}
        className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-tr from-[#FF8A00] to-[#FACC15] p-1 shadow-[0_6px_14px_rgba(249,115,22,0.25)] flex items-center justify-center cursor-pointer"
        onClick={handleSpeak}
      >
        <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="Owl Mascot">
          {isBlinking ? '😌' : '🦉'}
        </span>
        <div className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-orange-500">
          <Volume2 className="w-3 h-3" />
        </div>
      </motion.div>

      {/* Speech Bubble (max 8 words, never covers content) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: isArabic ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className="relative px-3.5 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-[20px] border border-orange-100 dark:border-slate-700 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2"
      >
        {/* Triangle pointer */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent ${
            isArabic
              ? '-end-1.5 border-s-[8px] border-s-white dark:border-s-slate-800'
              : '-start-1.5 border-e-[8px] border-e-white dark:border-e-slate-800'
          }`}
        />

        <p
          className={`font-extrabold text-slate-800 dark:text-slate-100 leading-snug m-0 ${
            isJunior ? 'text-[15px]' : 'text-[13px]'
          }`}
        >
          {truncatedMessage}
        </p>

        <button
          onClick={handleSpeak}
          className="shrink-0 p-1 rounded-full text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
          title={isArabic ? 'استمع' : 'Listen'}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
