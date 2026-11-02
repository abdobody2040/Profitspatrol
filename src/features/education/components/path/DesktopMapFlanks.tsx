import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Play,
  Lock,
  Swords,
  Gift,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SoundService } from '../../../../lib/sound';

export interface DesktopLeftFlankProps {
  hostId: string;
  hostName: string;
  themeColor: string;
  districtNumber: number;
  districtName: string;
  moduleTitle: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  currentLessonTitle?: string;
  currentLessonId?: string;
  streak: number;
  ppTokens: number;
  isArabic: boolean;
  onStartCurrentLesson?: (lessonId: string) => void;
}

export const DesktopLeftFlank: React.FC<DesktopLeftFlankProps> = ({
  hostId,
  hostName,
  themeColor,
  districtNumber,
  districtName,
  moduleTitle,
  completedLessonsCount,
  totalLessonsCount,
  currentLessonTitle,
  currentLessonId,
  streak,
  ppTokens,
  isArabic,
  onStartCurrentLesson,
}) => {
  const getCompanionAdvice = () => {
    switch (hostId) {
      case 'ollie':
        return isArabic
          ? 'المفتاح هو الاستمرارية! ادخر كل يوم ولو بسيطاً.'
          : 'Consistency is key! Save a little every day.';
      case 'reema':
        return isArabic
          ? 'ركز على احتياجات الزبائن وسينجح مشروعك!'
          : 'Focus on what customers need, and your venture wins.';
      case 'filo':
        return isArabic
          ? 'الأرقام لا تكذب! احسب التكلفة قبل أي استثمار.'
          : 'Numbers never lie! Calculate costs before investing.';
      case 'kami':
        return isArabic
          ? 'التكنولوجيا تصنع فرصاً لا نهائية للمستقبل.'
          : 'Smart tech creates infinite opportunities for the future.';
      default:
        return isArabic
          ? 'خطوة واحدة يومياً تبني عقلية بطل الأعمال!'
          : 'One smart step a day builds the mindset of a founder!';
    }
  };

  const progressPercentage = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  return (
    <aside
      className="hidden xl:flex flex-col gap-3 w-64 2xl:w-72 shrink-0 sticky top-24 pt-2 select-none"
      aria-label="Desktop Left Flank"
    >
      {/* ── 1. Compact Companion Floating Chip ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/80 dark:border-slate-800 shadow-lg p-3 relative overflow-hidden"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center p-1 shadow-inner shrink-0 border"
            style={{ backgroundColor: `${themeColor}20`, borderColor: `${themeColor}40` }}
          >
            <img
              src={`/images/characters_clean/${hostId}_idle.png`}
              alt={hostName}
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/characters_clean/ollie_idle.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {isArabic ? 'المرشد المالي' : 'Advisor'}
              </span>
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white capitalize">
              {hostName}
            </h3>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="relative rounded-xl bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-2 text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug">
          "{getCompanionAdvice()}"
        </div>
      </motion.div>

      {/* ── 2. Compact District Quest Capsule ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/80 dark:border-slate-800 shadow-lg p-3 flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            {isArabic ? `الحي ${districtNumber}` : `District ${districtNumber}`}
          </span>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
          >
            {completedLessonsCount}/{totalLessonsCount}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
            {moduleTitle}
          </h4>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: themeColor }}
          />
        </div>

        {/* Primary Action Button */}
        {currentLessonTitle && currentLessonId && (
          <button
            onClick={() => {
              SoundService.playClick();
              onStartCurrentLesson?.(currentLessonId);
            }}
            className="w-full py-2 px-3 rounded-xl text-white font-black text-xs shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="truncate">
              {isArabic ? 'متابعة المغامرة' : 'Continue Adventure'}
            </span>
          </button>
        )}
      </motion.div>

      {/* ── 3. Compact Stats Pill ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.14 }}
        className="rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/80 dark:border-slate-800 shadow-md p-2 flex items-center justify-around text-center"
      >
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black text-amber-600 dark:text-amber-400">{streak}</span>
          <span className="text-[10px] font-bold text-slate-400">
            {isArabic ? 'يوم' : 'Days'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="flex items-center gap-1.5">
          <img src="/icons/3d/coin.png" alt="coin" className="w-4 h-4 object-contain" />
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{ppTokens}</span>
          <span className="text-[10px] font-bold text-slate-400">PP</span>
        </div>
      </motion.div>
    </aside>
  );
};

export interface DesktopRightFlankProps {
  bossName: string;
  bossTagline: string;
  bossStatus: 'locked' | 'unlocked' | 'beaten';
  themeColor: string;
  isArabic: boolean;
  onOpenBossModal: () => void;
  onOpenFullMap: () => void;
}

export const DesktopRightFlank: React.FC<DesktopRightFlankProps> = ({
  bossName,
  bossTagline,
  bossStatus,
  themeColor,
  isArabic,
  onOpenBossModal,
  onOpenFullMap,
}) => {
  const isBeaten = bossStatus === 'beaten';
  const isUnlocked = bossStatus === 'unlocked';

  return (
    <aside
      className="hidden xl:flex flex-col gap-3 w-64 2xl:w-72 shrink-0 sticky top-24 pt-2 select-none"
      aria-label="Desktop Right Flank"
    >
      {/* ── 1. Compact Boss Challenge Card ── */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/80 dark:border-slate-800 shadow-lg p-3 flex flex-col gap-2 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-red-500 dark:text-red-400 flex items-center gap-1 tracking-wider">
            <Swords className="w-3 h-3" />
            {isArabic ? 'زعيم الفصل' : 'District Boss'}
          </span>

          <span
            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
              isBeaten
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : isUnlocked
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {isBeaten
              ? isArabic ? 'انتصار ✓' : 'Beaten ✓'
              : isUnlocked
              ? isArabic ? 'جاهز!' : 'Ready!'
              : isArabic ? 'مغلق' : 'Locked'}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
            {bossName}
          </h4>
        </div>

        <button
          onClick={() => {
            SoundService.playClick();
            onOpenBossModal();
          }}
          className={`w-full py-2 px-3 rounded-xl font-black text-xs shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            isBeaten
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : isUnlocked
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 animate-bounce'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isBeaten ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'إعادة المواجهة' : 'Replay'}</span>
            </>
          ) : isUnlocked ? (
            <>
              <Swords className="w-3.5 h-3.5" />
              <span>{isArabic ? 'بدء المواجهة!' : 'Fight Boss!'}</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3" />
              <span>{isArabic ? 'شروط الفتح' : 'Requirements'}</span>
            </>
          )}
        </button>
      </motion.div>

      {/* ── 2. Compact Milestone Treasures ── */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/80 dark:border-slate-800 shadow-md p-2.5 flex items-center justify-between text-xs"
      >
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {isArabic ? 'جوائز المسار' : 'Path Treasures'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-black text-amber-500">
          <span>🎁</span>
          <span>+150 PP</span>
        </div>
      </motion.div>

      {/* ── 3. Compact 20 Districts Quick Jump ── */}
      <motion.button
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.14 }}
        onClick={() => {
          SoundService.playClick();
          onOpenFullMap();
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-md flex items-center justify-between cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 dark:text-amber-600" />
          <span className="text-xs font-black">
            {isArabic ? 'خريطة الأحياء الـ 20' : 'All 20 Districts'}
          </span>
        </div>
        {isArabic ? (
          <ArrowLeft className="w-3.5 h-3.5 opacity-70" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 opacity-70" />
        )}
      </motion.button>
    </aside>
  );
};
