import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PathNpcProps {
  id: string;
  nameAr: string;
  nameEn: string;
  avatar: string;
  tips: Array<{ en: string; ar: string }>;
  side: 'left' | 'right';
  xOffset?: number;
  isArabic: boolean;
  isActiveBubble?: boolean;
  onBubbleToggle?: (id: string, isOpen: boolean) => void;
}

const formatBubbleText = (text: string) => {
  const words = text.trim().split(/\s+/).slice(0, 8);
  return words.map((word, i) => {
    if (/[a-zA-Z]/.test(word)) {
      return (
        <React.Fragment key={i}>
          <bdi className="font-sans font-black">{word}</bdi>{' '}
        </React.Fragment>
      );
    }
    return word + ' ';
  });
};

export const PathNpc: React.FC<PathNpcProps> = ({
  id,
  nameAr,
  nameEn,
  avatar,
  tips,
  side,
  isArabic,
  isActiveBubble,
  onBubbleToggle,
}) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const isOpen = isActiveBubble !== undefined ? isActiveBubble : localOpen;

  // Auto-dismiss tip after 3 seconds
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (onBubbleToggle) {
        onBubbleToggle(id, false);
      } else {
        setLocalOpen(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, id, onBubbleToggle]);

  const handleTap = () => {
    if (!tips || tips.length === 0) return;
    const randomTipObj = tips[Math.floor(Math.random() * tips.length)];
    const text = isArabic ? randomTipObj.ar : randomTipObj.en;
    setCurrentTip(text);

    const nextState = !isOpen;
    if (onBubbleToggle) {
      onBubbleToggle(id, nextState);
    } else {
      setLocalOpen(nextState);
    }
  };

  const displayName = isArabic ? nameAr : nameEn;

  return (
    <div
      className="relative flex flex-col items-center pointer-events-auto select-none"
      data-testid={`path-npc-${id}`}
    >
      {/* Tip & Name Bubble on Tap: max 160px, max 2 lines, above head, never clipped */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.18 }}
            className={`absolute bottom-[calc(100%+8px)] z-40 w-max max-w-[155px] px-3 py-1.5 rounded-2xl bg-amber-400 text-amber-950 shadow-xl border-2 border-white text-center leading-tight ${
              side === 'left' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'
            }`}
          >
            {/* NPC Name shown prominently when opened */}
            <div className="text-[10px] font-black uppercase text-amber-900 border-b border-amber-500/30 pb-0.5 mb-0.5">
              <bdi>{displayName}</bdi>
            </div>
            <p className="line-clamp-2 text-[11px] font-bold m-0 break-words">
              {formatBubbleText(currentTip || (isArabic ? 'مرحباً بك في حيّنا!' : 'Welcome to our district!'))}
            </p>
            {/* Tail */}
            <div
              className={`absolute -bottom-1.5 w-3 h-3 bg-amber-400 border-b-2 border-r-2 border-white transform rotate-45 ${
                side === 'left' ? 'left-4' : 'right-4'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC Avatar Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1, rotate: [-3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        onClick={handleTap}
        className="w-12 h-12 min-w-[44px] min-h-[44px] rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-500 shadow-md flex items-center justify-center text-2xl cursor-pointer select-none"
        aria-label={`${displayName} tip`}
      >
        <span>{avatar}</span>
      </motion.button>

      {/* Ground Shadow */}
      <div className="mt-1 w-7 h-1.5 rounded-full bg-slate-900/15 dark:bg-black/35 blur-[1px] pointer-events-none" />

      {/* NPC Name is HIDDEN by default; only shown when tapped (inside the speech bubble or below on tap) */}
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5 pointer-events-none"
          >
            <bdi>{displayName}</bdi>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
