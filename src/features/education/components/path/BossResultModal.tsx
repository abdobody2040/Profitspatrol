import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, ArrowRight, RotateCcw, ArrowLeft, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { SoundService } from '../../../../lib/sound';

export interface BossResultModalProps {
  isOpen: boolean;
  result: 'win' | 'lose';
  moduleNumber: number;
  bossTitleAr: string;
  bossTitleEn: string;
  earnedCoins?: number;
  isArabic: boolean;
  onContinue: () => void;
  onRetry: () => void;
  onBackToPath: () => void;
}

export const BossResultModal: React.FC<BossResultModalProps> = ({
  isOpen,
  result,
  moduleNumber,
  bossTitleAr,
  bossTitleEn,
  earnedCoins = 150,
  isArabic,
  onContinue,
  onRetry,
  onBackToPath,
}) => {
  const { t, i18n } = useTranslation();
  const [starsVisible, setStarsVisible] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStarsVisible(0);
      return;
    }

    if (result === 'win') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // safe fallback
      }

      // 3 stars animate one by one
      const t1 = setTimeout(() => setStarsVisible(1), 350);
      const t2 = setTimeout(() => setStarsVisible(2), 700);
      const t3 = setTimeout(() => setStarsVisible(3), 1050);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen, result]);

  if (!isOpen || typeof document === 'undefined') return null;

  const lang = (i18n.language || (isArabic ? 'ar' : 'en')).split('-')[0];
  const isRTL = lang === 'ar';
  const isWin = result === 'win';
  const isModule20 = moduleNumber === 20;

  const displayedBossTitle = lang === 'ar' ? bossTitleAr : (bossTitleEn || bossTitleAr);

  const victoryTitle = {
    ar: 'مبروك! هزمت الزعيم!',
    de: 'Sieg! Boss besiegt!',
    es: '¡Victoria! ¡Jefe derrotado!',
    fr: 'Victoire ! Boss vaincu !',
    en: 'Victory! Boss Defeated!',
  }[lang] || 'Victory! Boss Defeated!';

  const coinsLabel = {
    ar: 'مكافأة الكاش',
    de: 'Münzen-Belohnung',
    es: 'Recompensa de Monedas',
    fr: 'Récompense en Pièces',
    en: 'Coins',
  }[lang] || 'Coins';

  const notebookLabel = {
    ar: 'دفتر الملاحظات',
    de: 'Notizbuch',
    es: 'Cuaderno',
    fr: 'Carnet de notes',
    en: 'Notebook',
  }[lang] || 'Notebook';

  const newEntryLabel = {
    ar: 'صفحة جديدة',
    de: 'Neuer Eintrag',
    es: 'Nueva Entrada',
    fr: 'Nouvelle Entrée',
    en: 'New Entry',
  }[lang] || 'New Entry';

  const continueLabel = {
    ar: 'كمّل',
    de: 'Weiter',
    es: 'Continuar',
    fr: 'Continuer',
    en: 'Continue',
  }[lang] || 'Continue';

  const rexHeader = {
    ar: 'ريكس: تجربة ممتازة!',
    de: 'Rex: Tolle Leistung!',
    es: 'Rex: ¡Gran esfuerzo!',
    fr: 'Rex : Beau travail !',
    en: 'Rex: Great Effort!',
  }[lang] || 'Rex: Great Effort!';

  const rexDesc = {
    ar: 'القرارات الصعبة تحتاج أكثر من تجربة. راجع خطتك وحاول مرة ثانية!',
    de: 'Schwierige Geschäftsentscheidungen brauchen Übung. Überprüfe deinen Plan und versuche es erneut!',
    es: 'Las decisiones difíciles requieren práctica. ¡Revisa tu plan y vuelve a intentarlo!',
    fr: 'Les décisions difficiles demandent de la pratique. Révise ta stratégie et réessaie !',
    en: 'Tough business calls take practice. Review your strategy and try again!',
  }[lang] || 'Tough business calls take practice. Review your strategy and try again!';

  const retryLabel = {
    ar: 'حاول مجدداً',
    de: 'Erneut versuchen',
    es: 'Reintentar',
    fr: 'Réessayer',
    en: 'Retry',
  }[lang] || 'Retry';

  const backLabel = {
    ar: 'رجوع',
    de: 'Zurück',
    es: 'Volver',
    fr: 'Retour',
    en: 'Back',
  }[lang] || 'Back';

  return createPortal(
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="boss-result-title"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
        >
          {isWin ? (
            <>
              {/* Trophy drop with spring */}
              <motion.div
                initial={{ y: -80, scale: 0.4 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="relative my-3"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/40 border-4 border-white dark:border-amber-300">
                  <Trophy className="w-14 h-14 text-white fill-current drop-shadow-md" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-300 text-yellow-950 rounded-full p-1 shadow">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
              </motion.div>

              {/* Title & Boss Name */}
              <h2
                id="boss-result-title"
                className="text-2xl font-black text-slate-900 dark:text-white"
              >
                {victoryTitle}
              </h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                {displayedBossTitle}
              </p>

              {/* 3 Stars popped one by one */}
              <div className="flex items-center gap-2 my-4">
                {[1, 2, 3].map((starNum) => (
                  <motion.div
                    key={starNum}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={
                      starsVisible >= starNum
                        ? { scale: [0, 1.3, 1], rotate: 0 }
                        : { scale: 0 }
                    }
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <Star
                      className={`w-9 h-9 ${
                        starsVisible >= starNum
                          ? 'fill-amber-400 text-amber-500 drop-shadow-md'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Rewards: Coins & Notebook Flip */}
              <div className="flex items-center gap-4 my-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 w-full justify-around">
                <div className="flex items-center gap-1.5">
                  <img src="/icons/3d/coin.png" alt="coin" className="w-7 h-7 object-contain" />
                  <div className="text-start">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      {coinsLabel}
                    </span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                      +{earnedCoins}
                    </span>
                  </div>
                </div>

                <div className="h-8 w-px bg-amber-200 dark:border-amber-800" />

                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-start">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      {notebookLabel}
                    </span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {newEntryLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Characters Cheering */}
              <div className="flex items-center justify-center gap-2 my-3">
                {isModule20 ? (
                  ['ollie_idle.png', 'reema_idle.png', 'filo_idle.png', 'kami_idle.png', 'rex_idle.png'].map((img, i) => (
                    <img
                      key={i}
                      src={`/images/characters_clean/${img}`}
                      alt="cheering character"
                      className="w-10 h-10 rounded-2xl object-contain bg-emerald-50 dark:bg-emerald-950/40 p-0.5 border-2 border-emerald-400 shadow-sm animate-bounce"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))
                ) : (
                  ['ollie_idle.png', 'reema_idle.png', 'filo_idle.png'].map((img, i) => (
                    <img
                      key={i}
                      src={`/images/characters_clean/${img}`}
                      alt="cheering character"
                      className="w-10 h-10 rounded-2xl object-contain bg-emerald-50 dark:bg-emerald-950/40 p-0.5 border-2 border-emerald-400 shadow-sm animate-bounce"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))
                )}
              </div>

              {/* Continue button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  SoundService.playClick();
                  onContinue();
                }}
                className="btn-juicy w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-[0_4px_0_#059669] border-b-2 border-emerald-700 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{continueLabel}</span>
                {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </>
          ) : (
            /* Calm card with Rex on lose/exit */
            <>
              <div className="flex items-center gap-3 my-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 w-full text-start">
                <img
                  src="/images/characters_clean/rex_idle.png"
                  alt="Rex"
                  className="w-14 h-14 rounded-2xl object-contain bg-red-100 dark:bg-red-950/50 p-1 shrink-0 border-2 border-amber-400 shadow-sm"
                />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {rexHeader}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {rexDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full mt-2">
                <button
                  onClick={() => {
                    SoundService.playClick();
                    onRetry();
                  }}
                  className="btn-juicy flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-sm shadow-[0_4px_0_#d97706] border-b-2 border-amber-600 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{retryLabel}</span>
                </button>
                <button
                  onClick={() => {
                    SoundService.playClick();
                    onBackToPath();
                  }}
                  className="btn-juicy px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#1e293b] cursor-pointer"
                >
                  <span>{backLabel}</span>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
