import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpriteActor, CharacterKey, CharacterPose, ThemedPropType } from './SpriteActor';

export type { CharacterKey, CharacterPose };

export interface PathDecorCharacterProps {
  id?: string;
  character: CharacterKey;
  pose?: CharacterPose;
  side: 'left' | 'right';
  xOffset?: number;
  welcomeBubble?: string;
  isArabic: boolean;
  size?: number; // default 64-72px
  propType?: ThemedPropType;
  isActiveBubble?: boolean;
  onBubbleToggle?: (id: string, isOpen: boolean) => void;
  scaleModifier?: number; // e.g. 0.9 to 1.1 for variety
}

/**
 * Formats bubble text to max 8 words and wraps Latin names/words in <bdi>
 */
const formatBubbleText = (text: string) => {
  const words = text.trim().split(/\s+/).slice(0, 8);
  return words.map((word, i) => {
    // If word contains latin characters, wrap in <bdi> for proper RTL isolation
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

export const PathDecorCharacter: React.FC<PathDecorCharacterProps> = ({
  id = 'decor-actor',
  character,
  pose = 'idle',
  side,
  welcomeBubble,
  isArabic,
  size = 68,
  propType = 'bush',
  isActiveBubble,
  onBubbleToggle,
  scaleModifier = 1.0,
}) => {
  // Local state if not controlled externally
  const [localBubbleOpen, setLocalBubbleOpen] = useState(Boolean(welcomeBubble));
  const isBubbleOpen = isActiveBubble !== undefined ? isActiveBubble : localBubbleOpen;

  // Auto-dismiss bubble after 3 seconds
  useEffect(() => {
    if (!isBubbleOpen) return;
    const timer = setTimeout(() => {
      if (onBubbleToggle) {
        onBubbleToggle(id, false);
      } else {
        setLocalBubbleOpen(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isBubbleOpen, id, onBubbleToggle]);

  const handleToggle = () => {
    if (!welcomeBubble) return;
    const nextState = !isBubbleOpen;
    if (onBubbleToggle) {
      onBubbleToggle(id, nextState);
    } else {
      setLocalBubbleOpen(nextState);
    }
  };

  // Road is in center, so left actor faces right, right actor faces left
  const facing = side === 'left' ? 'right' : 'left';
  const effectiveSize = Math.round(size * scaleModifier);

  return (
    <div
      className={`relative flex flex-col items-center pointer-events-auto select-none`}
      data-testid={`path-decor-${character}`}
    >
      {/* Speech Bubble: strictly max 160px, max 2 lines, anchored above head, never clipped */}
      <AnimatePresence>
        {isBubbleOpen && welcomeBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.18 }}
            className={`absolute bottom-[calc(100%+8px)] z-40 w-max max-w-[155px] px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border-2 shadow-xl text-[11px] font-black text-slate-800 dark:text-slate-100 leading-tight ${
              character === 'rex' ? 'border-amber-400' : 'border-emerald-400'
            } ${side === 'left' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'}`}
          >
            <p className="line-clamp-2 text-center break-words m-0">
              {formatBubbleText(welcomeBubble)}
            </p>
            {/* Little speech tail pointing down toward head */}
            <div
              className={`absolute -bottom-1.5 w-3 h-3 bg-white dark:bg-slate-800 border-b-2 border-r-2 ${
                character === 'rex' ? 'border-amber-400' : 'border-emerald-400'
              } transform rotate-45 ${side === 'left' ? 'left-4' : 'right-4'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SpriteActor */}
      <SpriteActor
        character={character}
        pose={pose}
        size={effectiveSize}
        facing={facing}
        propType={propType}
        onClick={handleToggle}
        alt={character}
      />
    </div>
  );
};
