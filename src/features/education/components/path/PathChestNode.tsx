import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';

export interface PathChestNodeProps {
  id: string;
  status: 'locked' | 'unlocked' | 'opened';
  xOffset: number;
  coinsReward?: number;
  isArabic: boolean;
  onOpen: () => void;
  onLockedClick: () => void;
}

export const PathChestNode: React.FC<PathChestNodeProps> = ({
  id,
  status,
  xOffset,
  coinsReward = 50,
  isArabic,
  onOpen,
  onLockedClick,
}) => {
  const isOpened = status === 'opened';
  const isLocked = status === 'locked';

  return (
    <div
      className="relative flex flex-col items-center justify-center my-3 select-none"
      style={{
        transform: `translateX(${xOffset}px)`,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* ── 3D Stone Plinth / Pedestal ── */}
      <div className="relative flex flex-col items-center">
        {/* Stone Pedestal Top & Shadow */}
        <div className="absolute -bottom-2 w-20 h-7 rounded-[18px] bg-slate-800/40 blur-xs" />
        <div className="absolute -bottom-1.5 w-16 h-4 rounded-xl bg-gradient-to-b from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-900 shadow-md border-b-2 border-slate-600" />

        {/* Golden Radiance Aura for Unlocked Chest */}
        {!isOpened && !isLocked && (
          <div className="absolute -inset-2 rounded-2xl bg-amber-400/25 blur-lg animate-pulse pointer-events-none" />
        )}

        {/* Interactive Chest Button with 3D Rendered Asset */}
        <motion.button
          type="button"
          id={`chest-${id}`}
          aria-label={isArabic ? 'صندوق الكنز' : 'Treasure Chest'}
          onClick={isLocked ? onLockedClick : isOpened ? undefined : onOpen}
          whileHover={!isLocked && !isOpened ? { scale: 1.12, y: -4 } : {}}
          whileTap={!isLocked && !isOpened ? { scale: 0.95 } : {}}
          className={`relative z-10 w-20 h-20 flex items-center justify-center transition-all cursor-pointer select-none ${
            isOpened ? 'opacity-70 grayscale-30 cursor-default' : ''
          }`}
        >
          {/* 3D Glowing Fantasy Chest Image */}
          <img
            src="/assets/world/treasure_chest.png"
            alt={isArabic ? 'صندوق الكنز' : 'Treasure Chest'}
            className={`w-full h-full object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.4)] pointer-events-none transition-all ${
              isLocked ? 'grayscale-[60%] brightness-75' : ''
            }`}
            loading="lazy"
          />

          {/* Locked Badge Overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-500 flex items-center justify-center shadow-lg">
                <span className="text-sm">🔒</span>
              </div>
            </div>
          )}

          {/* Sparkle Badge for Unlocked Claimable Chest */}
          {!isOpened && !isLocked && (
            <div
              className="absolute -top-1 -right-1 bg-gradient-to-tr from-yellow-400 to-amber-300 text-amber-950 rounded-full p-1.5 shadow-md border-2 border-white animate-bounce"
            >
              <Sparkles className="w-4 h-4 fill-current text-amber-900" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Label Pill */}
      <div className="mt-2.5 z-10">
        <span className="px-2 py-0.5 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 text-[11px] font-black shadow-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
          {isOpened ? (
            <span>{isArabic ? 'تم الفتح ✓' : 'Opened ✓'}</span>
          ) : isLocked ? (
            <span>{isArabic ? 'مكافأة مقفلة' : 'Locked Chest'}</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-black">
              {isArabic ? `+${coinsReward} عملة` : `+${coinsReward} PP`}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

