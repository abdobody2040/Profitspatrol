import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Check, Star, Volume2 } from "lucide-react";
import { useAgeMode } from "../hooks/useAgeMode";
import { useAppStore } from "../../../store";

export type NodeStatus = "locked" | "current" | "completed";

interface LessonNodeProps {
  id: string;
  index: number;
  title: string;
  arabicTitle?: string;
  titleNumber?: string;
  icon?: any;
  emoji?: string;
  status: NodeStatus;
  stars?: number;
  onSelect: (id: string) => void;
  xOffset?: number;
  ollieQuote?: string;
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  id,
  index,
  title,
  arabicTitle,
  titleNumber,
  icon: NodeIcon,
  emoji = "💡",
  status,
  stars = 3,
  onSelect,
  xOffset = 0,
  ollieQuote = "خلونا نفكر!",
}) => {
  const { playTap, isArabic, speakText, isJunior } = useAgeMode();
  const user = useAppStore((state) => state.user);
  const [imgError, setImgError] = useState(false);
  const hasSpokenRef = useRef(false);

  const isLocked = status === "locked";
  const isCurrent = status === "current";
  const isCompleted = status === "completed";
  const isPremiumLocked = isLocked && user?.subscriptionTier !== "founder";

  // Strip any leading number + dot/space from stored title strings
  const stripLeadingNumber = (s: string) =>
    s.replace(/^[\d١-٩٠]+[.\s]+/, "").trim();

  const rawTitle = isArabic && arabicTitle ? arabicTitle : title;
  const displayTitle = stripLeadingNumber(rawTitle);

  useEffect(() => {
    if (
      isCurrent &&
      isJunior &&
      !hasSpokenRef.current &&
      user?.settings?.soundEnabled !== false
    ) {
      hasSpokenRef.current = true;
      const timer = setTimeout(() => speakText(ollieQuote), 700);
      return () => clearTimeout(timer);
    }
  }, [isCurrent, isJunior, ollieQuote, speakText, user?.settings?.soundEnabled]);

  const handleClick = () => {
    playTap();
    if (!isLocked) onSelect(id);
  };

  const handleOllieSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTap();
    speakText(ollieQuote);
  };

  const nodeSize = isJunior
    ? "w-24 h-24 sm:w-28 sm:h-28"
    : "w-20 h-20 sm:w-22 sm:h-22";
  const iconSizeClass = isJunior
    ? "w-10 h-10 sm:w-11 sm:h-11"
    : "w-8 h-8 sm:w-9 sm:h-9";

  // Place Ollie on the side with MORE free space (opposite to the node offset)
  const ollieOnLeft = xOffset > 0;

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      {/* ── Ollie: edge-safe positioning, flipped to side with more space ── */}
      {isCurrent && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-auto ${
            ollieOnLeft ? "right-[calc(100%+14px)]" : "left-[calc(100%+14px)]"
          }`}
        >
          {/* Speech bubble above Ollie — clean horizontal badge */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative mb-2 px-3 py-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-[16px] border-2 border-orange-200 dark:border-slate-700 shadow-[0_6px_20px_rgba(0,0,0,0.10)] flex items-center gap-1.5 whitespace-nowrap"
          >
            {/* Down-pointing tail */}
            <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-white dark:border-t-slate-800" />
            <p
              className={`font-black text-slate-800 dark:text-slate-100 leading-none m-0 text-center whitespace-nowrap ${
                isJunior ? "text-[13px]" : "text-[12px]"
              }`}
              dir="auto"
              style={{ unicodeBidi: "plaintext" as any }}
            >
              {ollieQuote}
            </p>
            <button
              type="button"
              onClick={handleOllieSpeak}
              className={`p-1 rounded-full transition-all shrink-0 flex items-center justify-center ${
                isJunior
                  ? "bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/80 text-orange-600 dark:text-orange-300 ring-2 ring-orange-300/80 animate-pulse"
                  : "text-orange-500 hover:text-orange-600"
              }`}
              title={isArabic ? "استمع للبومة أولي" : "Listen to Ollie"}
            >
              <Volume2 className={isJunior ? "w-3.5 h-3.5" : "w-3 h-3"} />
            </button>
          </motion.div>

          {/* Ollie image */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            onClick={handleOllieSpeak}
            className="cursor-pointer shrink-0"
          >
            {!imgError ? (
              <img
                src="/assets/ollie/ollie.png"
                alt="Ollie"
                onError={() => setImgError(true)}
                className="w-[95px] h-[95px] sm:w-[110px] sm:h-[110px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
              />
            ) : (
              <img
                src="/assets/ollie_wave.png"
                alt="Ollie"
                className="w-[95px] h-[95px] sm:w-[110px] sm:h-[110px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
              />
            )}
          </motion.div>
        </div>
      )}

      {/* ── Circular Node Button (z-10 = above SVG path) ── */}
      <motion.button
        whileHover={isLocked ? {} : { scale: 1.06 }}
        whileTap={
          isLocked ? { x: [-3, 3, -2, 2, 0] } : { y: 4, scale: 0.95 }
        }
        animate={
          isCurrent
            ? {
                boxShadow: [
                  "0 6px 0 #C2410C, 0 0 0 0 rgba(249, 115, 22, 0.45)",
                  "0 6px 0 #C2410C, 0 0 0 16px rgba(249, 115, 22, 0)",
                  "0 6px 0 #C2410C, 0 0 0 0 rgba(249, 115, 22, 0)",
                ],
                transition: { repeat: Infinity, duration: 2.2 },
              }
            : {}
        }
        onClick={handleClick}
        className={`relative z-10 ${nodeSize} rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isLocked
            ? "bg-slate-200 dark:bg-slate-800/90 border-4 border-slate-500 dark:border-slate-500 shadow-[inset_0_4px_8px_rgba(0,0,0,0.25),0_5px_0_#475569]"
            : isCompleted
            ? "bg-gradient-to-b from-[#FDE047] to-[#EAB308] border-2 border-amber-300 dark:border-amber-600 shadow-[0_6px_0_#A16207,0_8px_16px_rgba(234,179,8,0.25)] text-amber-950"
            : "bg-gradient-to-b from-[#FF8A00] to-[#F97316] border-2 border-orange-300 dark:border-orange-500 shadow-[0_6px_0_#C2410C,0_12px_20px_rgba(249,115,22,0.35)] text-white"
        }`}
      >
        {isLocked ? (
          <>
            <Lock
              className={`${iconSizeClass} text-slate-700 dark:text-slate-300 stroke-[2.4]`}
            />
            {isPremiumLocked && <span className="sr-only">Premium Only</span>}
          </>
        ) : isCompleted ? (
          <div className="flex flex-col items-center justify-center">
            <Check
              className={`${iconSizeClass} stroke-[3.5] text-amber-950 drop-shadow-sm`}
            />
          </div>
        ) : NodeIcon ? (
          <div className="flex flex-col items-center justify-center">
            <NodeIcon
              className={`${iconSizeClass} text-white drop-shadow-md stroke-[2.4]`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span
              className={`${
                isJunior ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
              } select-none drop-shadow`}
            >
              {emoji}
            </span>
          </div>
        )}

        {/* Stars badge for completed nodes */}
        {isCompleted && (
          <div className="absolute -bottom-2.5 flex items-center gap-0.5 bg-white/95 dark:bg-slate-900/90 px-2 py-0.5 rounded-full shadow-sm border border-amber-200 dark:border-amber-800">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-3.5 h-3.5 ${
                  starIdx <= stars
                    ? "text-amber-500 fill-amber-400"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* ── Label plate: cream, opaque 90%, rounded-xl, subtle shadow, z-10 ── */}
      <div
        className={`relative z-10 mt-3 ${
          isJunior ? "max-w-[220px]" : "max-w-[200px]"
        } flex flex-col items-center`}
      >
        <div
          className={`flex items-start gap-1.5 px-2.5 py-1.5 rounded-xl shadow-sm border ${
            isLocked
              ? "bg-[#F5F5F0]/95 dark:bg-slate-800/95 border-slate-300/90 dark:border-slate-700/90"
              : isCurrent
              ? "bg-[#FFFCF5]/95 border-orange-200/70"
              : "bg-[#FFFCF5]/90 border-amber-100/70"
          }`}
          style={{ backdropFilter: "blur(4px)" }}
        >
          {/* Number badge — Arabic numeral, visually separate from title text */}
          {titleNumber && (
            <span
              className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-black mt-0.5 ${
                isLocked
                  ? "bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  : isCurrent
                  ? "bg-orange-500 text-white"
                  : "bg-amber-400 text-amber-950"
              }`}
            >
              {titleNumber}
            </span>
          )}
          <div
            dir="auto"
            className={`font-black tracking-tight leading-tight text-start ${
              isJunior ? "text-[15px] sm:text-[16px]" : "text-[13px] sm:text-[14px]"
            } ${
              isLocked
                ? "text-[#475569] dark:text-slate-200"
                : isCurrent
                ? "text-orange-700 dark:text-orange-400"
                : "text-slate-700 dark:text-slate-200"
            }`}
            style={{
              unicodeBidi: "plaintext" as any,
              WebkitLineClamp: 2,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical" as any,
              overflow: "hidden",
            }}
            title={displayTitle}
          >
            {displayTitle}
          </div>
        </div>
      </div>
    </div>
  );
};
