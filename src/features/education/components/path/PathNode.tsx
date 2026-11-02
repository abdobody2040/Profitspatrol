import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Play, Dumbbell, BookOpen, Crown, Lock, Sparkles } from 'lucide-react';
import { TRexIcon } from '../../../../components/icons/TRexIcon';

export type PathNodeType = 'episode' | 'lesson' | 'rex_challenge' | 'practice' | 'review';

export interface PathNodeProps {
  id: string;
  index: number; // 0 to 9 (corresponds to nodes 1 to 10)
  type: PathNodeType;
  title: string;
  topicIcon?: React.ReactNode;
  status: 'done' | 'current' | 'locked' | 'unlocked';
  starsCount?: number; // 0 to 3
  themeColor: string; // Module primary color
  secondaryColor?: string;
  isJuniorMode: boolean;
  xOffset: number; // calculated wave px offset
  isArabic: boolean;
  onClick: () => void;
  onLockedClick: () => void;
}

export const PathNode: React.FC<PathNodeProps> = ({
  id,
  index,
  type,
  title,
  topicIcon,
  status,
  starsCount = 3,
  themeColor,
  secondaryColor = '#059669',
  isJuniorMode,
  xOffset,
  isArabic,
  onClick,
  onLockedClick,
}) => {
  const isDone = status === 'done';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  // Sizing: standard 76px, junior 88px, current node 88px
  const nodeSize = isCurrent || isJuniorMode ? 88 : 76;
  const isRex = type === 'rex_challenge';

  // Render type-specific icon
  const renderIcon = () => {
    if (isDone) {
      return <Check className="w-9 h-9 text-white stroke-[3.5] drop-shadow-md" />;
    }

    if (isLocked) {
      return (
        <div className="flex flex-col items-center justify-center">
          <Lock className="w-6 h-6 text-slate-300 dark:text-slate-400 drop-shadow" />
          <span className="text-[11px] font-black text-slate-300 dark:text-slate-400 mt-0.5 tracking-wider">
            {index + 1}
          </span>
        </div>
      );
    }

    if (type === 'episode') {
      return <Play className="w-8 h-8 text-white fill-current ml-0.5 drop-shadow-md" />;
    }

    if (isRex) {
      return topicIcon || <span className="text-2xl font-black text-white drop-shadow-md">{index + 1}</span>;
    }

    if (type === 'practice') {
      return <Dumbbell className="w-8 h-8 text-white drop-shadow-md" />;
    }

    if (type === 'review') {
      return <Crown className="w-8 h-8 text-white drop-shadow-md" />;
    }

    // Standard lesson node: topic icon or index number
    return topicIcon || <span className="text-2xl font-black text-white drop-shadow-md">{index + 1}</span>;
  };

  // Base platform styling gradients
  const getTopSurfaceStyle = () => {
    if (isLocked) {
      return {
        background: 'linear-gradient(145deg, #64748B 0%, #475569 55%, #334155 100%)',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.4)',
        borderColor: '#475569',
      };
    }
    if (isDone) {
      return {
        background: 'linear-gradient(145deg, #10B981 0%, #059669 60%, #047857 100%)',
        boxShadow: 'inset 0 3px 5px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.3)',
        borderColor: '#34D399',
      };
    }
    if (isRex) {
      return {
        background: 'linear-gradient(145deg, #EF4444 0%, #DC2626 55%, #991B1B 100%)',
        boxShadow: 'inset 0 3px 5px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.35)',
        borderColor: '#F87171',
      };
    }
    // Available / In Progress / Current
    return {
      background: `linear-gradient(145deg, ${themeColor}ee 0%, ${themeColor} 60%, ${secondaryColor} 100%)`,
      boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.25)',
      borderColor: '#FFFFFF',
    };
  };

  const getPlatformBaseColor = () => {
    if (isLocked) return '#1E293B';
    if (isDone) return '#064E3B';
    if (isRex) return '#7F1D1D';
    return '#0F172A';
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center my-3 select-none"
      style={{
        transform: `translateX(${xOffset}px)`,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* ── START Banner above current active node ── */}
      {isCurrent && (
        <motion.div
          initial={{ y: -8, scale: 0.95 }}
          animate={{ y: [0, -8, 0], scale: 1 }}
          transition={{
            y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
            scale: { duration: 0.3 },
          }}
          className="absolute -top-12 z-30 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-white shadow-xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap pointer-events-none drop-shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isArabic ? 'ابدأ هنا!' : 'START!'}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 border-r-2 border-b-2 border-white rotate-45" />
        </motion.div>
      )}

      {/* ── Pulsing ambient aura ring for current node ── */}
      {isCurrent && (
        <div
          className="absolute rounded-full animate-ping pointer-events-none opacity-30"
          style={{
            width: nodeSize + 28,
            height: nodeSize + 28,
            backgroundColor: themeColor,
          }}
        />
      )}

      {/* ── 3D Game Pedestal Structure ── */}
      <div className="relative group">
        {/* 3D Platform Extrusion Base (Creates physical depth / 3D game disc look) */}
        <div
          className="absolute inset-x-0 -bottom-3 rounded-full transition-all"
          style={{
            width: nodeSize,
            height: nodeSize,
            backgroundColor: getPlatformBaseColor(),
            borderRadius: isRex ? '28px' : '9999px',
            boxShadow: isCurrent
              ? `0 14px 28px -4px ${themeColor}70, 0 8px 12px -3px rgba(0,0,0,0.4)`
              : '0 10px 20px -3px rgba(0,0,0,0.35)',
          }}
        />

        {/* Outer Golden/Metallic Bevel Ring */}
        <div
          className="absolute inset-x-0 -bottom-1.5 rounded-full"
          style={{
            width: nodeSize,
            height: nodeSize,
            borderRadius: isRex ? '28px' : '9999px',
            background: isDone
              ? 'linear-gradient(180deg, #FDE047 0%, #D97706 100%)'
              : isCurrent
              ? 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)'
              : isLocked
              ? 'linear-gradient(180deg, #64748B 0%, #334155 100%)'
              : 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%)',
          }}
        />

        {/* Interactive Top Disc Platform with 3D Rendered Game Pedestal */}
        <motion.button
          type="button"
          id={`node-${id}`}
          aria-label={`${title} - ${isDone ? 'Completed' : isCurrent ? 'Current' : 'Locked'}`}
          onClick={isLocked ? onLockedClick : onClick}
          whileHover={!isLocked ? { scale: 1.08, y: -3 } : { scale: 0.98 }}
          whileTap={{ scale: 0.94, y: 1 }}
          className={`relative z-10 flex items-center justify-center cursor-pointer transition-transform focus:outline-none focus:ring-4 focus:ring-emerald-400/40 rounded-full select-none ${
            isRex ? 'rounded-2xl' : 'rounded-full'
          }`}
          style={{
            width: nodeSize,
            height: nodeSize,
          }}
        >
          {/* 3D Pre-rendered Pedestal Texture Image */}
          <img
            src={
              isDone
                ? '/assets/world/node_pedestal_completed.png'
                : isCurrent
                ? '/assets/world/node_pedestal_current.png'
                : '/assets/world/node_pedestal_locked.png'
            }
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
            loading="lazy"
          />

          {/* Render Core Icon over 3D Pedestal */}
          <div className="relative z-20 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {renderIcon()}
          </div>

          {/* Rex Challenge Corner Crest */}
          {isRex && (
            <div
              className={`absolute -top-1.5 ${isArabic ? '-left-1.5' : '-right-1.5'} z-30 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white shadow-md flex items-center justify-center`}
              title="Rex Challenge"
            >
              <TRexIcon className="w-4 h-4 text-amber-950" />
            </div>
          )}

          {/* 3 Gold Stars Arc for Completed Nodes */}
          {isDone && (
            <div className="absolute -bottom-2 z-30 flex items-center gap-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 px-2 py-0.5 rounded-full shadow-md border border-white">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < starsCount ? 'fill-current text-amber-950' : 'text-amber-800/40'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* ── High-Contrast Frosted Game Pill Label (Always Legible!) ── */}
      <div className="mt-3.5 text-center max-w-[150px] px-1 pointer-events-none z-10">
        <div className="inline-block px-2.5 py-1 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90 shadow-md">
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
            <bdi>{title}</bdi>
          </span>
        </div>
      </div>
    </div>
  );
};

