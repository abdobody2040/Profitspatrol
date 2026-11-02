import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export type CharacterState = 'idle' | 'wave' | 'cheer' | 'think' | 'sad';

export interface CharacterProps {
  name: string; // 'ollie' | 'reema' | 'filo' | 'kami' | 'rex'
  state?: CharacterState; // default 'idle'
  size?: number; // size in px, e.g. 72 on mobile, 96 on desktop
  className?: string;
  onClick?: () => void;
  priority?: boolean; // if true, gets priority in the 3-animated limit (e.g. active Ollie)
  showSpeechBubble?: boolean;
  speechText?: string;
  speechSide?: 'top' | 'left' | 'right' | 'top-left';
  speechOpacity?: number;
  interactive?: boolean;
}

// Global active animated characters tracker (Max 3 on screen at once)
let activeAnimatedCount = 0;
const MAX_ANIMATED = 3;

export const Character: React.FC<CharacterProps> = ({
  name,
  state = 'idle',
  size = 96,
  className = '',
  onClick,
  priority = false,
  showSpeechBubble = false,
  speechText = '',
  speechSide = 'top',
  speechOpacity = 1,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isAllowedAnimation, setIsAllowedAnimation] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSquashing, setIsSquashing] = useState(false);
  const [isStatePopping, setIsStatePopping] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [lottieFailed, setLottieFailed] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Track state changes to trigger .anim-pop
  const prevStateRef = useRef<CharacterState>(state);
  useEffect(() => {
    if (prevStateRef.current !== state) {
      prevStateRef.current = state;
      setIsStatePopping(true);
      const timer = setTimeout(() => setIsStatePopping(false), 400);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Viewport intersection observer (pause/unmount outside viewport)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Manage concurrency limit (max 3 animated characters on screen at once)
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsAllowedAnimation(false);
      return;
    }

    if (isInViewport) {
      if (priority || activeAnimatedCount < MAX_ANIMATED) {
        activeAnimatedCount++;
        setIsAllowedAnimation(true);
        return () => {
          activeAnimatedCount = Math.max(0, activeAnimatedCount - 1);
          setIsAllowedAnimation(false);
        };
      } else {
        setIsAllowedAnimation(false);
      }
    } else {
      setIsAllowedAnimation(false);
    }
  }, [isInViewport, priority, prefersReducedMotion]);

  // Periodic Blink (every 4-6s when in idle state and animation is allowed)
  useEffect(() => {
    if (!isAllowedAnimation || state !== 'idle') {
      setIsBlinking(false);
      return;
    }

    let blinkTimer: ReturnType<typeof setTimeout>;
    let unblinkTimer: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 2000;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        unblinkTimer = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(unblinkTimer);
    };
  }, [isAllowedAnimation, state]);

  // Tap handler: Squash-and-stretch (scale 1.1 then 0.95 then 1 over 300ms)
  const handleTap = useCallback(() => {
    if (!interactive) return;
    setIsSquashing(true);
    setTimeout(() => setIsSquashing(false), 300);
    if (onClick) onClick();
  }, [interactive, onClick]);

  // Compute image source
  const currentPose = isBlinking ? 'blink' : state;
  const imageSrc = useMemo(() => {
    if (imageError) {
      return `/characters/${name}/idle.webp`;
    }
    return `/characters/${name}/${currentPose}.webp`;
  }, [name, currentPose, imageError]);

  // Check animation classes
  const animClass = useMemo(() => {
    if (!isAllowedAnimation || prefersReducedMotion) return '';
    if (isSquashing) return 'anim-squash';
    if (isStatePopping) return 'anim-pop';
    if (state === 'idle' && !isBlinking) return 'anim-float';
    return '';
  }, [isAllowedAnimation, prefersReducedMotion, isSquashing, isStatePopping, state, isBlinking]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{ width: size, minWidth: size }}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div
          className={`absolute z-30 pointer-events-none transition-all duration-300 ${
            speechSide === 'top-left'
              ? 'bottom-[80%] right-[35%] mb-1'
              : speechSide === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : speechSide === 'left'
              ? 'right-full mr-2 top-1/2 -translate-y-1/2'
              : 'left-full ml-2 top-1/2 -translate-y-1/2'
          }`}
          style={{ opacity: speechOpacity }}
        >
          <div className="text-[11px] font-black py-1 px-3 text-center shadow-md bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-[var(--color-border)] rounded-2xl relative whitespace-nowrap">
            <span>{speechText}</span>
            {/* Arrow indicator pointing to character with matching 2px border */}
            {speechSide === 'top-left' ? (
              <>
                <div className="absolute top-full right-4 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[var(--color-border)]" />
                <div className="absolute top-full right-[17px] -mt-[2px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-white dark:border-t-slate-800" />
              </>
            ) : speechSide === 'top' ? (
              <>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[var(--color-border)]" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-white dark:border-t-slate-800" />
              </>
            ) : speechSide === 'left' ? (
              <>
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-s-[6px] border-s-[var(--color-border)]" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ms-[2px] w-0 h-0 border-y-[5px] border-y-transparent border-s-[5px] border-s-white dark:border-s-slate-800" />
              </>
            ) : (
              <>
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-e-[6px] border-e-[var(--color-border)]" />
                <div className="absolute right-full top-1/2 -translate-y-1/2 -me-[2px] w-0 h-0 border-y-[5px] border-y-transparent border-e-[5px] border-e-white dark:border-e-slate-800" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Character Pose Image / Animation */}
      <div
        onClick={handleTap}
        className={`w-full h-full flex items-center justify-center cursor-pointer transition-transform ${animClass}`}
        style={{
          width: size,
          height: size,
          transformOrigin: 'bottom center',
        }}
      >
        <img
          src={imageSrc}
          alt={`${name} (${state})`}
          width={size}
          height={size}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-contain drop-shadow-md select-none pointer-events-auto"
          onError={(e) => {
            if (!imageError) {
              setImageError(true);
            } else {
              // Final fallback to mascot icon
              (e.currentTarget as HTMLImageElement).src = '/icons/3d/fox.png';
            }
          }}
        />
      </div>
    </div>
  );
};

export default Character;
