import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Map, CheckCircle2 } from 'lucide-react';

export interface StickyUnitBannerProps {
  districtNameAr: string;
  districtNameEn: string;
  districtNumber: number;
  moduleTitleAr: string;
  moduleTitleEn: string;
  completedLessonsCount: number;
  totalLessonsCount: number; // 10 counted lessons
  isBossBeaten: boolean;
  themeColor: string; // e.g. #10B981
  secondaryColor?: string;
  isArabic: boolean;
  onOpenFullMap: () => void;
}

export const StickyUnitBanner: React.FC<StickyUnitBannerProps> = ({
  districtNameAr,
  districtNameEn,
  districtNumber,
  moduleTitleAr,
  moduleTitleEn,
  completedLessonsCount,
  totalLessonsCount = 10,
  isBossBeaten,
  themeColor,
  secondaryColor,
  isArabic,
  onOpenFullMap,
}) => {
  // 10 counted lessons + 1 boss segment = 11 segments
  const totalSegments = 11;
  const countedLessons = Math.min(totalLessonsCount, Math.max(0, completedLessonsCount));
  const activeSegments = countedLessons + (isBossBeaten ? 1 : 0);
  const progressPercent = Math.round((activeSegments / totalSegments) * 100);

  return (
    <div
      role="banner"
      className="sticky top-0 z-30 w-full max-h-[72px] px-3 py-2 transition-colors duration-300 shadow-md backdrop-blur-md"
      style={{
        backgroundColor: `${themeColor}F2`,
        borderBottom: `2px solid ${secondaryColor || themeColor}`,
      }}
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3 text-white">
        {/* Left: District tag + Module title (clickable to open full map) */}
        <button
          onClick={onOpenFullMap}
          className="flex-1 flex flex-col text-start min-w-0 group cursor-pointer focus:outline-none"
          title={isArabic ? 'فتح خريطة الفصول الكاملة' : 'Open Full Map'}
          aria-label={isArabic ? 'عرض الخريطة الكاملة' : 'View Full Map'}
        >
          <div className="flex items-center gap-1.5 opacity-90 text-[11px] font-bold">
            <span>
              {isArabic ? `الحي ${districtNumber}: ${districtNameAr}` : `District ${districtNumber}: ${districtNameEn}`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <h2 className="text-sm sm:text-base font-black truncate drop-shadow-sm">
            {isArabic ? moduleTitleAr : moduleTitleEn}
          </h2>
        </button>

        {/* Right: 10+1 segmented progress bar + Quick Open button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1" dir="ltr">
              <span className="text-xs font-black drop-shadow-sm">
                {countedLessons}/10
              </span>
              {isBossBeaten && (
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1 rounded-sm">
                  👑
                </span>
              )}
            </div>

            {/* 10+1 segment mini bar */}
            <div className="flex items-center gap-0.5 bg-black/20 p-0.5 rounded-full" dir="ltr">
              {Array.from({ length: 10 }).map((_, i) => {
                const isFilled = i < countedLessons;
                return (
                  <div
                    key={i}
                    className={`w-1.5 sm:w-2 h-1.5 rounded-full transition-colors ${
                      isFilled ? 'bg-white shadow-[0_0_4px_white]' : 'bg-white/30'
                    }`}
                  />
                );
              })}
              {/* 11th distinct Boss segment */}
              <div
                className={`w-2.5 h-1.5 rounded-full ml-0.5 transition-colors ${
                  isBossBeaten ? 'bg-amber-300 shadow-[0_0_6px_#FCD34D]' : 'bg-amber-300/30'
                }`}
                title={isArabic ? 'مستوى الزعيم' : 'Boss Stage'}
              />
            </div>
          </div>

          <button
            onClick={onOpenFullMap}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white cursor-pointer"
            aria-label={isArabic ? 'فتح الخريطة' : 'Open Map'}
          >
            <Map className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
