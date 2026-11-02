import React, { useState, useEffect, useRef } from 'react';
import { motion, TargetAndTransition } from 'framer-motion';
import manifestData from '../../../../data/sprites/manifest.json';

export type CharacterKey = 'ollie' | 'reema' | 'filo' | 'kami' | 'rex';
export type CharacterPose = 'idle' | 'celebrate' | 'point' | 'think';
export type ThemedPropType = 'bush' | 'sign' | 'crate' | 'lamp' | 'flower' | 'none';

export interface SpriteActorProps {
  character: CharacterKey;
  pose?: CharacterPose;
  size?: number; // default 72
  facing?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  isAnimated?: boolean;
  showShadow?: boolean;
  propType?: ThemedPropType;
  onClick?: () => void;
  alt?: string;
  dataTestId?: string;
}

const CHARACTER_COLORS: Record<CharacterKey, string> = {
  ollie: '#F97316',
  reema: '#EC4899',
  filo: '#3B82F6',
  kami: '#10B981',
  rex: '#C8553D',
};

// Global active animation counter to enforce max 4 simultaneous animations
let activeAnimationCount = 0;
const MAX_SIMULTANEOUS_ANIMATIONS = 4;

export const SpriteActor: React.FC<SpriteActorProps> = ({
  character,
  pose = 'idle',
  size = 72,
  facing = 'right',
  className = '',
  style,
  isAnimated = true,
  showShadow = true,
  propType = 'none',
  onClick,
  alt,
  dataTestId,
}) => {
  const [imgError, setImgError] = useState(false);
  const [inView, setInView] = useState(false);
  const [hasBudget, setHasBudget] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // IntersectionObserver to pause offscreen animations and manage budget
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting;
        setInView(isVisible);

        if (isVisible) {
          if (activeAnimationCount < MAX_SIMULTANEOUS_ANIMATIONS) {
            activeAnimationCount++;
            setHasBudget(true);
          } else {
            setHasBudget(false);
          }
        } else {
          setHasBudget((prev) => {
            if (prev) {
              activeAnimationCount = Math.max(0, activeAnimationCount - 1);
            }
            return false;
          });
        }
      },
      { threshold: 0.1, rootMargin: '80px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      setHasBudget((prev) => {
        if (prev) {
          activeAnimationCount = Math.max(0, activeAnimationCount - 1);
        }
        return false;
      });
    };
  }, []);

  // Extract sprite frame from manifest (v4 updated coords)
  const manifest = (manifestData as any)[character];
  const clip = manifest?.clips?.[pose] || manifest?.clips?.['idle'] || { x: 0, y: 0, w: 100, h: 100 };
  const imageW = manifest?.image_w || 1000;
  const imageH = manifest?.image_h || 800;
  const src = manifest?.src || `/images/chracters/${character}.jpg`;
  const cleanSrc = manifest?.clean_src?.[pose] || manifest?.clean_src?.['idle'];

  // Compute exact scale and offsets to display ONLY the selected sub-rectangle
  // Padding inside box: 4px
  const innerPad = 4;
  const availableH = size - innerPad * 2;
  const scale = availableH / clip.h;
  const scaledImgW = imageW * scale;
  const scaledImgH = imageH * scale;
  const offsetLeft = -clip.x * scale + (size - clip.w * scale) / 2;
  const offsetTop = -clip.y * scale + (size - clip.h * scale) / 2;

  // Determine if animation is active
  const canAnimate = isAnimated && inView && hasBudget && !prefersReducedMotion;

  // Distinct micro-animations per character
  const getAnimationVariants = (): { animate: TargetAndTransition } => {
    switch (character) {
      case 'ollie':
        // Gentle owl breathing and slight wing pulse
        return {
          animate: canAnimate
            ? {
                y: [0, -3.5, 0],
                rotate: [0, 1.2, -1.2, 0],
                transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : { y: 0, rotate: 0 },
        };
      case 'reema':
        // Sleek fox subtle sway and confident lean
        return {
          animate: canAnimate
            ? {
                rotate: [-2, 2.5, -2],
                x: [0, 1.5, 0],
                transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : { rotate: 0, x: 0 },
        };
      case 'filo':
        // Gentle elephant bob
        return {
          animate: canAnimate
            ? {
                y: [0, 2, 0],
                scaleY: [1, 0.98, 1],
                transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : { y: 0, scaleY: 1 },
        };
      case 'kami':
        // Playful chameleon subtle hop / bounce
        return {
          animate: canAnimate
            ? {
                y: [0, -4, 0],
                scale: [1, 1.02, 1],
                transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : { y: 0, scale: 1 },
        };
      case 'rex':
        // Rival raccoon head tilt / mischievous twitch
        return {
          animate: canAnimate
            ? {
                rotate: [-3, 3.5, -3],
                x: [-1, 1, -1],
                transition: { duration: 3.0, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : { rotate: 0, x: 0 },
        };
      default:
        return {
          animate: canAnimate
            ? {
                y: [0, -2, 0],
                transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : { y: 0 },
        };
    }
  };

  const anim = getAnimationVariants();

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={style}
      data-testid={dataTestId || `sprite-actor-${character}`}
    >
      {/* Sprite Frame with mirror facing support */}
      <motion.div
        animate={anim.animate}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={onClick}
        className="relative cursor-pointer flex items-center justify-center"
        style={{
          width: size,
          height: size,
          transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        {!imgError ? (
          <div
            className="w-full h-full relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 border-2 border-white/90 dark:border-slate-700/90 shadow-md backdrop-blur-xs flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            {cleanSrc || (clip.x === 0 && clip.y === 0) ? (
              <img
                src={cleanSrc || src}
                alt={alt || character}
                onError={() => setImgError(true)}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-contain p-1 pointer-events-none select-none"
              />
            ) : (
              <img
                src={src}
                alt={alt || character}
                onError={() => setImgError(true)}
                loading="lazy"
                draggable={false}
                className="absolute pointer-events-none max-w-none select-none"
                style={{
                  width: `${scaledImgW}px`,
                  height: `${scaledImgH}px`,
                  left: `${offsetLeft}px`,
                  top: `${offsetTop}px`,
                }}
              />
            )}
          </div>
        ) : (
          /* High quality fallback badge if sprite file fails */
          <div
            className="w-full h-full rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-white uppercase"
            style={{ backgroundColor: CHARACTER_COLORS[character] || '#64748B' }}
          >
            {character.charAt(0)}
          </div>
        )}
      </motion.div>

      {/* Ground Shadow */}
      {showShadow && (
        <div
          className="mt-1 h-2 rounded-full bg-slate-900/15 dark:bg-black/35 blur-[1px] pointer-events-none transition-all"
          style={{ width: size * 0.65 }}
        />
      )}

      {/* Themed Prop next to Actor */}
      {propType !== 'none' && (
        <div
          className={`absolute bottom-0 text-base pointer-events-none ${
            facing === 'left' ? '-right-2' : '-left-2'
          }`}
          aria-hidden="true"
        >
          {propType === 'bush' && '🌿'}
          {propType === 'sign' && '🪧'}
          {propType === 'crate' && '📦'}
          {propType === 'lamp' && '🏮'}
          {propType === 'flower' && '🌸'}
        </div>
      )}
    </div>
  );
};
