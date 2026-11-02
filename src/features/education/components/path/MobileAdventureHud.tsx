import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Gift,
  Compass,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  ChevronDown,
  X,
  Play,
  Trophy,
} from 'lucide-react';
import { SoundService } from '../../../../lib/sound';

export interface MobileAdventureHudProps {
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
  bossName: string;
  bossStatus: 'locked' | 'unlocked' | 'beaten';
  isRexMatch?: boolean;
  streak: number;
  ppTokens: number;
  isArabic: boolean;
  onOpenBossModal: () => void;
  onOpenFullMap: () => void;
  onStartCurrentLesson?: () => void;
}

export const MobileAdventureHud: React.FC<MobileAdventureHudProps> = ({
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
  bossName,
  bossStatus,
  isRexMatch = false,
  streak,
  ppTokens,
  isArabic,
  onOpenBossModal,
  onOpenFullMap,
  onStartCurrentLesson,
}) => {
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showTreasuresModal, setShowTreasuresModal] = useState(false);

  const isBossBeaten = bossStatus === 'beaten';
  const isBossUnlocked = bossStatus === 'unlocked';
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  const getCompanionAdvice = () => {
    switch (hostId) {
      case 'ollie':
        return isArabic
          ? 'المفتاح هو الاستمرارية! ادخر كل يوم ولو مبلغاً بسيطاً وسترى النتائج تنمو.'
          : 'Consistency is key! Save a little every day and watch your empire compound.';
      case 'reema':
        return isArabic
          ? 'ركز على احتياجات الزبائن وسيكون تسويقك دائماً في الصدارة!'
          : 'Focus on what customers truly need, and your marketing will always win.';
      case 'filo':
        return isArabic
          ? 'الأرقام لا تكذب! احسب التكلفة قبل البدء في أي استثمار جديد.'
          : 'Numbers never lie! Calculate your unit economics before any new venture.';
      case 'kami':
        return isArabic
          ? 'التكنولوجيا والذكاء الاصطناعي هما محركا الثروة القادمة. تعلم بذكاء!'
          : 'AI and smart technology power the future of wealth. Learn wisely!';
      default:
        return isArabic
          ? 'خطوة واحدة كل يوم تقربك من أن تصبح رجل أعمال حقيقي!'
          : 'One smart lesson a day builds the mindset of a true founder!';
    }
  };

  return (
    <div className="xl:hidden w-full px-2 pt-1 pb-2 relative z-20 select-none">
      {/* ── Horizontal Scrollable Quick-Access Game Strip ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
        {/* 1. Companion Advisor Pill */}
        <button
          onClick={() => {
            SoundService.playClick();
            setShowAdvisorModal(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90 shadow-sm shrink-0 cursor-pointer active:scale-95 transition-transform"
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center p-0.5 border"
            style={{ backgroundColor: `${themeColor}20`, borderColor: `${themeColor}60` }}
          >
            <img
              src={`/images/characters_clean/${hostId}_idle.png`}
              alt={hostName}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/characters_clean/ollie_idle.png';
              }}
            />
          </div>
          <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">
            {hostName}
          </span>
          <span className="text-[10px] text-amber-500 animate-pulse">💬</span>
        </button>

        {/* 2. District Boss Quick Challenge Pill */}
        <button
          onClick={() => {
            SoundService.playClick();
            onOpenBossModal();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border shadow-sm shrink-0 cursor-pointer active:scale-95 transition-transform ${
            isBossBeaten
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200'
              : isBossUnlocked
              ? 'bg-red-500 text-white border-red-400 shadow-red-500/30 animate-pulse'
              : 'bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-700/90 text-slate-700 dark:text-slate-200'
          }`}
        >
          <span className="text-xs">
            {isBossBeaten ? '👑' : isRexMatch ? '🦖' : '⚔️'}
          </span>
          <span className="text-[11px] font-black truncate max-w-[110px]">
            {bossName}
          </span>
          <span
            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
              isBossBeaten
                ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-white'
                : isBossUnlocked
                ? 'bg-white text-red-600 font-extrabold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {isBossBeaten ? '✓' : isBossUnlocked ? (isArabic ? 'جاهز!' : 'Fight!') : (isArabic ? 'مغلق' : 'Lock')}
          </span>
        </button>

        {/* 3. Path Treasures Milestone Pill */}
        <button
          onClick={() => {
            SoundService.playClick();
            setShowTreasuresModal(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90 shadow-sm shrink-0 cursor-pointer active:scale-95 transition-transform"
        >
          <span className="text-xs">🎁</span>
          <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">
            {isArabic ? 'الجوائز' : 'Rewards'}
          </span>
          <span className="text-[10px] font-bold text-slate-400">+150 PP</span>
        </button>

        {/* 4. All 20 Districts Quick Browse Pill */}
        <button
          onClick={() => {
            SoundService.playClick();
            onOpenFullMap();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm shrink-0 cursor-pointer active:scale-95 transition-transform"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span className="text-[11px] font-black whitespace-nowrap">
            {isArabic ? 'الأحياء الـ 20' : '20 Districts'}
          </span>
        </button>

        {/* 5. Streak & PP Coin Stats Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90 shadow-sm shrink-0">
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-[11px] font-black text-amber-600">{streak}</span>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-1">
            <img src="/icons/3d/coin.png" alt="coin" className="w-3.5 h-3.5 object-contain" />
            <span className="text-[11px] font-black text-emerald-600">{ppTokens}</span>
          </div>
        </div>
      </div>

      {/* ── Advisor Speech Modal on Mobile ── */}
      <AnimatePresence>
        {showAdvisorModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowAdvisorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border-2 border-slate-200 dark:border-slate-800 relative"
            >
              <button
                onClick={() => setShowAdvisorModal(false)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center p-1 border-2"
                  style={{ backgroundColor: `${themeColor}20`, borderColor: `${themeColor}60` }}
                >
                  <img
                    src={`/images/characters_clean/${hostId}_idle.png`}
                    alt={hostName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-500 uppercase tracking-wider block">
                    {isArabic ? 'نصيحة المرشد المالي' : 'Advisor Tip'}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white capitalize">
                    {hostName}
                  </h3>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                "{getCompanionAdvice()}"
              </div>

              <button
                onClick={() => {
                  setShowAdvisorModal(false);
                  onStartCurrentLesson?.();
                }}
                className="mt-4 w-full py-2.5 rounded-xl text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isArabic ? 'متابعة الدرس الحالي' : 'Continue Current Lesson'}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Path Treasures Modal on Mobile ── */}
      <AnimatePresence>
        {showTreasuresModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowTreasuresModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border-2 border-slate-200 dark:border-slate-800 relative"
            >
              <button
                onClick={() => setShowTreasuresModal(false)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
                <Gift className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'صناديق مكافآت المسار' : 'Path Reward Chests'}
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <div className="font-black text-slate-800 dark:text-white">
                        {isArabic ? 'صندوق منتصف الفصل' : 'Midway Chest (Lesson 4)'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isArabic ? 'يفتح بعد إتمام الدرس الرابع' : 'Unlocks after node 4'}
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-amber-600 dark:text-amber-400">+50 PP</span>
                </div>

                <div className="p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👑</span>
                    <div>
                      <div className="font-black text-slate-800 dark:text-white">
                        {isArabic ? 'صندوق الإتقان الكبير' : 'Mastery Chest (Lesson 8)'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isArabic ? 'يفتح بعد إتمام الدرس الثامن' : 'Unlocks after node 8'}
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-amber-600 dark:text-amber-400">+100 PP</span>
                </div>
              </div>

              <button
                onClick={() => setShowTreasuresModal(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer"
              >
                {isArabic ? 'حسناً، فهمت!' : 'Got it!'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
