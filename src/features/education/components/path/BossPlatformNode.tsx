import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Trophy, Check, Star, Flame } from 'lucide-react';
import { TRexIcon } from '../../../../components/icons/TRexIcon';

export interface BossPlatformNodeProps {
  moduleId: string;
  bossNameAr: string;
  bossNameEn: string;
  bossTaglineAr?: string;
  bossTaglineEn?: string;
  status: 'locked' | 'unlocked' | 'beaten';
  isRexMatch?: boolean;
  themeColor: string;
  isArabic: boolean;
  onOpenPreBoss: () => void;
  onLockedClick: () => void;
}

export const BossPlatformNode: React.FC<BossPlatformNodeProps> = ({
  moduleId,
  bossNameAr,
  bossNameEn,
  bossTaglineAr,
  bossTaglineEn,
  status,
  isRexMatch = false,
  themeColor,
  isArabic,
  onOpenPreBoss,
  onLockedClick,
}) => {
  const isLocked = status === 'locked';
  const isUnlocked = status === 'unlocked';
  const isBeaten = status === 'beaten';

  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* BOSS Arch & 3D Fortress Stage */}
      <div className="relative flex flex-col items-center">
        {/* The Arch */}
        <div
          className="w-48 h-28 rounded-t-full border-4 border-b-0 flex items-center justify-center -mb-10 z-0 transition-colors"
          style={{
            borderColor: isRexMatch
              ? '#C8553D'
              : isLocked
              ? '#94A3B8'
              : themeColor,
            background: isLocked
              ? 'rgba(148, 163, 184, 0.15)'
              : `linear-gradient(180deg, ${isRexMatch ? '#C8553D33' : `${themeColor}33`} 0%, transparent 100%)`,
          }}
        >
          {isRexMatch && (
            <div className="p-1 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 -mt-8">
              <TRexIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Main Boss Stage 3D Fortress Platform */}
        <motion.button
          type="button"
          id={`boss-node-${moduleId}`}
          aria-label={`${isArabic ? bossNameAr : bossNameEn} - Boss stage`}
          onClick={isLocked ? onLockedClick : onOpenPreBoss}
          whileHover={!isLocked ? { scale: 1.06, y: -4 } : { scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 w-[170px] h-[170px] flex flex-col items-center justify-center cursor-pointer select-none"
        >
          {/* Ambient Glowing Aura for Unlocked Boss */}
          {isUnlocked && (
            <div
              className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-500/40 via-red-500/30 to-amber-300/40 blur-xl animate-pulse pointer-events-none"
            />
          )}

          {/* 3D Boss Castle Fortress Image */}
          <img
            src="/assets/world/boss_fortress.png"
            alt=""
            className={`w-full h-full object-contain pointer-events-none drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] transition-all ${
              isLocked ? 'grayscale-[65%] brightness-75' : ''
            }`}
            loading="lazy"
          />

          {/* Overlay Status Details */}
          {isLocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 rounded-3xl p-2">
              <div className="w-12 h-12 rounded-full bg-slate-900/90 border-2 border-slate-500 flex items-center justify-center shadow-2xl mb-1">
                <Lock className="w-6 h-6 text-slate-300" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-black uppercase tracking-wider border border-slate-700">
                {isArabic ? 'زعيم مقفل' : 'LOCKED'}
              </span>
            </div>
          ) : isBeaten ? (
            <div className="absolute -bottom-2 z-20 flex flex-col items-center bg-slate-900/90 border-2 border-amber-400 text-amber-300 px-3 py-1 rounded-2xl shadow-xl">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-5 h-5 fill-current text-amber-400" />
                <span className="text-xs font-black text-white">{isArabic ? 'تم الهزيمة!' : 'Defeated!'}</span>
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              </div>
            </div>
          ) : (
            <div className="absolute -bottom-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border-2 border-white text-white font-black text-xs shadow-xl animate-bounce">
              <Flame className="w-4 h-4 fill-current text-yellow-200" />
              <span>{isArabic ? 'جاهز للتحدي!' : 'BOSS READY!'}</span>
            </div>
          )}
        </motion.button>

        {/* Platform Base */}
        <div
          className="w-48 h-6 rounded-b-2xl shadow-md border-t-2 z-0 -mt-2 transition-colors"
          style={{
            backgroundColor: isRexMatch ? '#9E2A2B' : isLocked ? '#475569' : '#0F172A',
            borderColor: isRexMatch ? '#C8553D' : isLocked ? '#334155' : themeColor,
          }}
        />
      </div>

      {/* Boss Stage Title Label - Frosted Glass Pill */}
      <div className="mt-3.5 text-center max-w-[220px] px-2 pointer-events-none z-10">
        <div className="inline-block px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90 shadow-md">
          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
            {isArabic ? bossNameAr : bossNameEn}
          </h4>
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {isArabic ? 'تحدي إنقاذ الشركة النهائي 🏆' : 'Final Turnaround Arena 🏆'}
          </p>
        </div>
      </div>
    </div>
  );
};
