import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Dumbbell, Crown, Coins, Award, Sparkles, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PathNodeType } from './PathNode';

export interface NodeDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  nodeNumber: number;
  type: PathNodeType;
  title: string;
  themeColor: string;
  xpReward?: number;
  coinsReward?: number;
  isArabic: boolean;
}

export const NodeDetailSheet: React.FC<NodeDetailSheetProps> = ({
  isOpen,
  onClose,
  onStart,
  nodeNumber,
  type,
  title,
  themeColor,
  xpReward = 20,
  coinsReward = 15,
  isArabic,
}) => {
  const { t, i18n } = useTranslation();
  if (!isOpen) return null;

  const lang = (i18n.language || (isArabic ? 'ar' : 'en')).split('-')[0];
  const isRTL = lang === 'ar';

  const getTypeLabel = () => {
    switch (type) {
      case 'episode':
        return {
          ar: 'حلقة تعليمية تفاعلية',
          de: 'Interaktive Story-Episode',
          es: 'Episodio de Historia Interactiva',
          fr: "Épisode d'histoire interactive",
          en: 'Interactive Story Episode',
        }[lang] || 'Interactive Story Episode';
      case 'rex_challenge':
        return {
          ar: 'تحدي ريكس للمنافسة',
          de: 'Rex-Herausforderung',
          es: 'Desafío de Rex',
          fr: 'Défi Face-à-Face Rex',
          en: 'Rex Challenge Showdown',
        }[lang] || 'Rex Challenge Showdown';
      case 'practice':
        return {
          ar: 'تمرين عملي وتطبيق',
          de: 'Praktische Übungseinheit',
          es: 'Práctica y Aplicación',
          fr: 'Exercice Pratique',
          en: 'Hands-on Practice Drill',
        }[lang] || 'Hands-on Practice Drill';
      case 'review':
        return {
          ar: 'مراجعة الفصل وتثبيت المعلومات',
          de: 'Modul-Wiederholung',
          es: 'Repaso del Módulo',
          fr: 'Révision du Module',
          en: 'Module Review Capstone',
        }[lang] || 'Module Review Capstone';
      default:
        return {
          ar: `الدرس ${nodeNumber}`,
          de: `Lektion ${nodeNumber}`,
          es: `Lección ${nodeNumber}`,
          fr: `Leçon ${nodeNumber}`,
          en: `Lesson ${nodeNumber}`,
        }[lang] || `Lesson ${nodeNumber}`;
    }
  };

  const closeLabel = {
    ar: 'إغلاق',
    de: 'Schließen',
    es: 'Cerrar',
    fr: 'Fermer',
    en: 'Close',
  }[lang] || 'Close';

  const coinsLabel = {
    ar: 'عملات',
    de: 'Münzen',
    es: 'Monedas',
    fr: 'Pièces',
    en: 'Coins',
  }[lang] || 'Coins';

  const startLabel = {
    ar: 'ابدأ الدرس الآن',
    de: 'Lektion jetzt starten',
    es: 'Comenzar lección ahora',
    fr: 'Commencer la leçon maintenant',
    en: 'Start Lesson Now',
  }[lang] || 'Start Lesson Now';

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-sheet-title"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer`}
            aria-label={closeLabel}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Node Category & Number */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: type === 'rex_challenge' ? '#C8553D' : themeColor }}
            >
              {getTypeLabel()}
            </span>
          </div>

          {/* Title */}
          <h3
            id="node-sheet-title"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 leading-snug"
          >
            {title}
          </h3>

          {/* Reward Chips */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <img src="/icons/3d/coin.png" alt="coin" className="w-5 h-5 object-contain" />
              <div>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block">
                  {coinsLabel}
                </span>
                <span className="text-sm font-black text-amber-900 dark:text-amber-200">
                  +{coinsReward}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-xl">⚡</span>
              <div>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block">
                  XP
                </span>
                <span className="text-sm font-black text-purple-900 dark:text-purple-200">
                  +{xpReward}
                </span>
              </div>
            </div>
          </div>

          {/* Big Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              onStart();
              onClose();
            }}
            className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundColor: type === 'rex_challenge' ? '#C8553D' : themeColor,
              boxShadow: `0 10px 25px -4px ${type === 'rex_challenge' ? '#C8553D66' : `${themeColor}66`}`,
            }}
          >
            <Play className={`w-5 h-5 fill-current ${isRTL ? 'rotate-180' : ''}`} />
            <span>{startLabel}</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
