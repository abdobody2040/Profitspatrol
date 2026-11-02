import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export interface ModuleDividerProps {
  fromColor: string;
  toColor: string;
  nextModuleNumber: number;
  nextModuleTitleAr: string;
  nextModuleTitleEn: string;
  districtNameAr: string;
  districtNameEn: string;
  isArabic: boolean;
}

export const ModuleDivider: React.FC<ModuleDividerProps> = ({
  fromColor,
  toColor,
  nextModuleNumber,
  nextModuleTitleAr,
  nextModuleTitleEn,
  districtNameAr,
  districtNameEn,
  isArabic,
}) => {
  return (
    <div
      className="relative w-full h-[160px] my-6 flex flex-col items-center justify-center overflow-hidden rounded-3xl shadow-inner border border-white/20 select-none"
      style={{
        background: `linear-gradient(180deg, ${fromColor}33 0%, ${toColor}33 100%)`,
      }}
    >
      {/* Decorative background lines */}
      <div className="absolute inset-0 opacity-15 flex items-center justify-around pointer-events-none">
        <div className="w-1/3 h-full border-r border-dashed border-slate-500" />
        <div className="w-1/3 h-full border-r border-dashed border-slate-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border border-slate-200/50 dark:border-slate-700/50 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-black tracking-wider text-slate-700 dark:text-slate-200 uppercase">
            {isArabic ? `الفصل التالي (${nextModuleNumber})` : `Next Module (${nextModuleNumber})`}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white drop-shadow-sm leading-tight">
          {isArabic ? nextModuleTitleAr : nextModuleTitleEn}
        </h3>

        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
          {isArabic ? districtNameAr : districtNameEn}
        </p>

        <div className="mt-2 text-slate-400 dark:text-slate-500 animate-bounce">
          <ArrowDown className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
};
