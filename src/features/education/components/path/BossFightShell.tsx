import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Users,
  Megaphone,
  Flame,
  Coins,
  Wallet,
  Star,
  Trophy,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { TurnaroundScenario } from '../../../../types';
import { SoundService } from '../../../../lib/sound';
import { useTranslation } from 'react-i18next';

export interface BossFightShellProps {
  scenario: TurnaroundScenario;
  isRexMatch?: boolean;
  isArabic: boolean;
  bossImage?: string;
  onClose: () => void;
  onWin: (score: { stars: number; coins: number }) => void;
  onLose: () => void;
}

export type BossReaction = 'thinking' | 'impressed' | 'bumped';

// Smart icon resolver matching the app's playful visual language
const getIssueIcon = (desc: string) => {
  const d = desc.toLowerCase();
  if (
    d.includes('oven') ||
    d.includes('fridge') ||
    d.includes('server') ||
    d.includes('roof') ||
    d.includes('hardware') ||
    d.includes('machine') ||
    d.includes('فرن') ||
    d.includes('ثلاجة') ||
    d.includes('سيرفر') ||
    d.includes('جهاز') ||
    d.includes('سطح')
  ) {
    return <Wrench className="w-5 h-5 text-amber-500" />;
  }
  if (
    d.includes('staff') ||
    d.includes('team') ||
    d.includes('cook') ||
    d.includes('order') ||
    d.includes('service') ||
    d.includes('موظف') ||
    d.includes('طاقم') ||
    d.includes('عمال') ||
    d.includes('خدمة')
  ) {
    return <Users className="w-5 h-5 text-blue-500" />;
  }
  if (
    d.includes('market') ||
    d.includes('ad') ||
    d.includes('design') ||
    d.includes('traffic') ||
    d.includes('shipping') ||
    d.includes('تسويق') ||
    d.includes('إعلان') ||
    d.includes('تصميم') ||
    d.includes('شحن')
  ) {
    return <Megaphone className="w-5 h-5 text-purple-500" />;
  }
  return <AlertCircle className="w-5 h-5 text-orange-500" />;
};

export const BossFightShell: React.FC<BossFightShellProps> = ({
  scenario,
  isRexMatch = false,
  isArabic,
  bossImage,
  onClose,
  onWin,
  onLose,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isRTL = currentLang.startsWith('ar');
  const [currentCash, setCurrentCash] = useState(scenario.initialCash);
  const [currentBurn, setCurrentBurn] = useState(scenario.initialBurnRate);
  const [remainingTurns, setRemainingTurns] = useState(scenario.turns);
  const totalTurns = scenario.turns;
  const [issues, setIssues] = useState(scenario.issues);
  const [bossReaction, setBossReaction] = useState<BossReaction>('thinking');
  const [wrongResultPanel, setWrongResultPanel] = useState<string | null>(null);
  const [lastFixedImpact, setLastFixedImpact] = useState<number | null>(null);

  const fixedIssuesCount = issues.filter((i) => i.fixed).length;
  const totalIssuesCount = issues.length;
  const progressRatio = Math.min(1, fixedIssuesCount / Math.max(1, totalIssuesCount));

  const handleFixIssue = (issueId: string) => {
    SoundService.playClick();
    const issue = issues.find((i) => i.id === issueId);
    if (!issue || issue.fixed) return;

    if (currentCash < issue.costToFix) {
      SoundService.playError();
      setBossReaction('thinking');
      const notEnoughCashMap: Record<string, string> = {
        ar: 'الكاش لا يكفي لهذا الإصلاح الآن! اختر مشكلة أخرى أقل تكلفة أو وفّر أولاً.',
        de: 'Noch nicht genug Bargeld für diese Reparatur! Wähle zuerst ein günstigeres Problem.',
        es: '¡Aún no hay suficiente efectivo para este arreglo! Elige primero un problema de menor costo.',
        fr: "Pas assez de trésorerie pour cette réparation ! Choisis d'abord un problème moins coûteux.",
        en: 'Not enough cash for this fix yet! Pick a lower-cost issue first.',
      };
      setWrongResultPanel(notEnoughCashMap[currentLang.split('-')[0]] || notEnoughCashMap.en);
      return;
    }

    // Apply fix with cash & success sound feedback
    SoundService.playCoin();
    SoundService.playSuccess();

    const nextCash = currentCash - issue.costToFix;
    const nextBurn = Math.max(0, currentBurn - issue.impactOnBurn);
    const nextIssues = issues.map((i) => (i.id === issueId ? { ...i, fixed: true } : i));
    const nextTurns = remainingTurns - 1;

    setCurrentCash(nextCash);
    setCurrentBurn(nextBurn);
    setIssues(nextIssues);
    setRemainingTurns(nextTurns);
    setWrongResultPanel(null);
    setLastFixedImpact(issue.impactOnBurn);

    // Impressed boss reaction
    setBossReaction('impressed');

    // Check Win/Lose conditions
    const allFixed = nextIssues.every((i) => i.fixed);
    const meetsWinCondition =
      nextCash >= (scenario.winCondition?.minCash ?? 0) &&
      nextBurn <= (scenario.winCondition?.maxBurn ?? 9999);

    if (allFixed || (nextTurns <= 0 && meetsWinCondition)) {
      SoundService.playLevelUp();
      setTimeout(() => {
        onWin({ stars: 3, coins: 150 });
      }, 700);
      return;
    }

    if (nextTurns <= 0 && !meetsWinCondition) {
      SoundService.playError();
      setBossReaction('bumped');
      const turnsOutMap: Record<string, string> = {
        ar: 'انتهت الأيام المتاحة قبل الوصول للمعدل المطلوب. دعنا نحاول مجدداً!',
        de: 'Die Tage sind abgelaufen, bevor sichere Margen erreicht wurden. Lass es uns noch einmal versuchen!',
        es: 'Se acabaron los días antes de alcanzar márgenes seguros. ¡Intentémoslo de nuevo!',
        fr: 'Le temps est écoulé avant d’atteindre les marges de sécurité. Réessayons !',
        en: 'Turns ran out before reaching safe margins. Let us try again!',
      };
      setWrongResultPanel(turnsOutMap[currentLang.split('-')[0]] || turnsOutMap.en);
    }
  };

  const handleRetryRound = () => {
    SoundService.playClick();
    setCurrentCash(scenario.initialCash);
    setCurrentBurn(scenario.initialBurnRate);
    setRemainingTurns(scenario.turns);
    setIssues(scenario.issues.map((i) => ({ ...i, fixed: false })));
    setWrongResultPanel(null);
    setBossReaction('thinking');
    setLastFixedImpact(null);
  };

  const langKey = currentLang.split('-')[0];

  // Dynamic dialogue line from Ollie (Mentor)
  const getOllieLine = () => {
    if (lastFixedImpact) {
      const map: Record<string, string> = {
        ar: `ممتاز! خفّضنا الخسارة اليومية بمقدار $${lastFixedImpact}! 🚀`,
        de: `Ausgezeichnet! Wir haben den täglichen Verlust um $${lastFixedImpact} gesenkt! 🚀`,
        es: `¡Excelente! ¡Redujimos la pérdida diaria en $${lastFixedImpact}! 🚀`,
        fr: `Brillant ! Nous avons réduit les pertes quotidiennes de $${lastFixedImpact} ! 🚀`,
        en: `Brilliant! We reduced burn by $${lastFixedImpact}/day! 🚀`,
      };
      return map[langKey] || map.en;
    }
    if (currentCash < 300) {
      const map: Record<string, string> = {
        ar: 'انتبه! رصيد الكاش أصبح منخفضاً، رتّب أولوياتك بحكمة!',
        de: 'Achtung! Das Geld wird knapp, setze Prioritäten bei den wichtigsten Reparaturen!',
        es: '¡Cuidado! El efectivo se está agotando, ¡prioriza las soluciones de mayor impacto!',
        fr: 'Attention ! La trésorerie baisse, privilégie les réparations à fort impact !',
        en: 'Watch out! Cash is getting low, prioritize high-impact fixes!',
      };
      return map[langKey] || map.en;
    }
    const map: Record<string, string> = {
      ar: 'كل قرار حكيم بيوقف نزيف الكاش ويقربك من الفوز!',
      de: 'Jede kluge Entscheidung stoppt Geldverlust und bringt dich dem Sieg näher!',
      es: '¡Cada decisión sabia detiene la pérdida de dinero y te acerca a la victoria!',
      fr: 'Chaque décision judicieuse stoppe les pertes et te rapproche de la victoire !',
      en: 'Every wise decision stops cash bleeding and wins the day!',
    };
    return map[langKey] || map.en;
  };

  // Dynamic dialogue line from Rex (Rival)
  const getRexLine = () => {
    if (remainingTurns <= 1 && currentBurn > 100) {
      const map: Record<string, string> = {
        ar: 'الأيام خلصت تقريباً والنزيف لسه شغال! ورّينا شطارتك!',
        de: 'Die Tage sind fast vorbei und das Geld rinnt immer noch weg! Zeig mir, was du kannst!',
        es: '¡Los días casi se acaban y la empresa sigue perdiendo! ¡Demuestra de qué eres capaz!',
        fr: 'Le temps presse et l’entreprise perd toujours de l’argent ! Montre ce que tu as dans le ventre !',
        en: 'Almost out of days and the company is still bleeding! Show me your moves!',
      };
      return map[langKey] || map.en;
    }
    if (lastFixedImpact) {
      const map: Record<string, string> = {
        ar: 'حركة ذكية.. بس لسه التحدي مستمر وما خلصتش!',
        de: 'Kluger Schachzug... aber die Krise ist noch nicht vorbei!',
        es: 'Jugada inteligente... ¡pero la crisis aún no termina!',
        fr: 'Joli coup... mais la crise n’est pas encore terminée !',
        en: 'Smart move... but the crisis is not over yet!',
      };
      return map[langKey] || map.en;
    }
    const map: Record<string, string> = {
      ar: 'الشركة بتخسر كاش بسرعة، هتقدر تنقذها قبل ما تفلس؟',
      de: 'Die Firma verbrennt schnell Geld. Kannst du sie retten, bevor sie pleitegeht?',
      es: 'La empresa pierde dinero rápido. ¿Podrás salvarla antes de que quiebre?',
      fr: 'L’entreprise brûle son cash à toute vitesse. Arriveras-tu à la sauver avant la faillite ?',
      en: 'The company is burning cash fast. Can you save it before zero?',
    };
    return map[langKey] || map.en;
  };

  if (typeof document === 'undefined') return null;

  const exitLabel = {
    ar: 'خروج',
    de: 'Beenden',
    es: 'Salir',
    fr: 'Quitter',
    en: 'Exit',
  }[langKey] || 'Exit';

  const daysRemainingText = {
    ar: `الأيام المتبقية: ${remainingTurns}`,
    de: `Verbleibende Tage: ${remainingTurns}`,
    es: `Días Restantes: ${remainingTurns}`,
    fr: `Jours Restants : ${remainingTurns}`,
    en: `Days Remaining: ${remainingTurns}`,
  }[langKey] || `Days Remaining: ${remainingTurns}`;

  return createPortal(
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[9999] flex flex-col overflow-y-auto bg-[#faf8f5] dark:bg-[#070b16] text-slate-800 dark:text-slate-100 transition-colors duration-200"
    >
      {/* ── Top Header: Back Button + Turns Capsule + Rescue Gauge ── */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-sm">
        <div className="max-w-3xl w-full mx-auto flex items-center justify-between gap-3">
          {/* 3D Exit Button */}
          <button
            onClick={() => {
              SoundService.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none hover:border-amber-400 dark:hover:border-amber-400 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer transition-all"
            aria-label={exitLabel}
          >
            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>

          {/* Days Remaining Pill Capsule */}
          <div className="flex flex-col items-center px-4 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-500/60 shadow-[0_3px_0_#fde68a] dark:shadow-[0_3px_0_#78350f]">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>🗓️</span>
              <span>{daysRemainingText}</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1" dir="ltr">
              {Array.from({ length: totalTurns }).map((_, i) => {
                const isActive = i < remainingTurns;
                return (
                  <div
                    key={i}
                    className={`transition-all duration-300 ${
                      isActive ? 'scale-110 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]' : 'opacity-40'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-slate-300 text-slate-400 dark:fill-slate-700 dark:text-slate-600'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rescue Progress Ring */}
          <div className="flex items-center gap-2">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="transparent"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeDasharray={113}
                  strokeDashoffset={113 - 113 * progressRatio}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                />
              </svg>
              <span className="absolute text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                {Math.round(progressRatio * 100)}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Battle Container ── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col items-center">
        {/* ── Arena Stage: Mentor Ollie + Central Boss + Rival Rex ── */}
        <section
          aria-label={{
            ar: 'حلبة المواجهة',
            de: 'Kampfarena',
            es: 'Arena de Batalla',
            fr: 'Arène de Combat',
            en: 'Battle Arena',
          }[langKey] || 'Battle Arena'}
          className="w-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/40 p-4 shadow-xl shadow-amber-500/5 my-2 relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-400/15 dark:bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Ollie Guide Mentor */}
            <div className="flex flex-col items-center text-center max-w-[120px] sm:max-w-[150px]">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-teal-900/50 p-1 border-2 border-emerald-400 shadow-md flex items-center justify-center">
                <img
                  src="/images/characters_clean/ollie_idle.png"
                  alt="Ollie"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span className="mt-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-700">
                {{
                  ar: 'أولي المرشد',
                  de: 'Coach Ollie',
                  es: 'Entrenador Ollie',
                  fr: 'Coach Ollie',
                  en: 'Ollie Coach',
                }[langKey] || 'Ollie Coach'}
              </span>
              <p className="hidden sm:block text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {getOllieLine()}
              </p>
            </div>

            {/* Central Boss Showcase */}
            <motion.div
              animate={
                bossReaction === 'impressed'
                  ? { scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }
                  : bossReaction === 'bumped'
                  ? { y: [0, -6, 0], x: [0, -3, 3, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-500 p-1 shadow-xl shadow-orange-500/20 border-b-4 border-amber-600 dark:border-amber-700">
                <img
                  src={bossImage || '/icons/3d/boss_badge.png'}
                  alt={scenario.companyName}
                  className="w-full h-full object-cover rounded-2xl bg-white dark:bg-slate-800"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/icons/3d/boss_badge.png';
                  }}
                />

                {/* Status Emoji Reactions */}
                {bossReaction === 'impressed' && (
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/40 backdrop-blur-[1px] flex items-center justify-center text-3xl animate-bounce">
                    🤩
                  </div>
                )}
                {bossReaction === 'bumped' && (
                  <div className="absolute inset-0 rounded-2xl bg-red-500/40 backdrop-blur-[1px] flex items-center justify-center text-3xl animate-pulse">
                    😰
                  </div>
                )}

                {/* Mini Badge Overlay */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[9px] uppercase tracking-wider shadow-md border border-white/40">
                  {{
                    ar: 'شركة في أزمة',
                    de: 'KRISE',
                    es: 'CRISIS',
                    fr: 'CRISE',
                    en: 'CRISIS',
                  }[langKey] || 'CRISIS'}
                </div>
              </div>

              {/* Company Title */}
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-3">
                {t(`scenarios.${scenario.id}.company_name`, { defaultValue: scenario.companyName })}
              </h2>

              {/* Dynamic Health / Bleeding Pill */}
              <div className="mt-1">
                {currentBurn > (scenario.winCondition?.maxBurn ?? 100) ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 text-[10px] font-black animate-pulse">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>
                      {{
                        ar: 'تنزف كاش يومياً!',
                        de: 'Verliert täglich Geld!',
                        es: '¡Perdiendo dinero a diario!',
                        fr: 'Perd de l’argent chaque jour !',
                        en: 'Bleeding Cash!',
                      }[langKey] || 'Bleeding Cash!'}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>
                      {{
                        ar: 'في منطقة الأمان!',
                        de: 'In der Sicherheitszone!',
                        es: '¡En la zona segura!',
                        fr: 'Zone de sécurité !',
                        en: 'Safe Zone!',
                      }[langKey] || 'Safe Zone!'}
                    </span>
                  </span>
                )}
              </div>
            </motion.div>

            {/* Rex Rival on opposite side */}
            <div className="flex flex-col items-center text-center max-w-[120px] sm:max-w-[150px]">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-100 to-amber-50 dark:from-red-950 dark:to-slate-900/80 p-1 border-2 border-red-400 shadow-md flex items-center justify-center">
                <img
                  src={isRexMatch ? '/images/characters_clean/rex_idle.png' : '/images/characters_clean/filo_idle.png'}
                  alt="Opponent"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span className="mt-1.5 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[10px] font-black border border-red-300 dark:border-red-700">
                {isRexMatch
                  ? {
                      ar: 'المنافس ريكس',
                      de: 'Rivale Rex',
                      es: 'Rival Rex',
                      fr: 'Rival Rex',
                      en: 'Rival Rex',
                    }[langKey] || 'Rival Rex'
                  : {
                      ar: 'فيلو التقني',
                      de: 'Filo',
                      es: 'Filo',
                      fr: 'Filo',
                      en: 'Filo',
                    }[langKey] || 'Filo'}
              </span>
              <p className="hidden sm:block text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {getRexLine()}
              </p>
            </div>
          </div>
        </section>

        {/* ── Financial Vitals Gauges: Tactile 3D Cards ── */}
        <section
          aria-label={{
            ar: 'المؤشرات المالية',
            de: 'Finanzanzeigen',
            es: 'Indicadores Financieros',
            fr: 'Indicateurs Financiers',
            en: 'Financial Gauges',
          }[langKey] || 'Financial Gauges'}
          className="w-full grid grid-cols-2 gap-3 my-2"
        >
          {/* Cash Remaining Card */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-600/50 shadow-[0_4px_0_#a7f3d0] dark:shadow-[0_4px_0_#065f46] flex flex-col items-center text-center relative overflow-hidden transition-all">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {{
                  ar: 'الرصيد المتبقي',
                  de: 'Verbleibendes Bargeld',
                  es: 'Efectivo Restante',
                  fr: 'Trésorerie Restante',
                  en: 'Cash Remaining',
                }[langKey] || 'Cash Remaining'}
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1" dir="ltr">
              ${currentCash.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
              {{
                ar: `الحد الأدنى: $${scenario.winCondition?.minCash ?? 100}`,
                de: `Min. sicher: $${scenario.winCondition?.minCash ?? 100}`,
                es: `Mínimo seguro: $${scenario.winCondition?.minCash ?? 100}`,
                fr: `Min. sécurité : $${scenario.winCondition?.minCash ?? 100}`,
                en: `Min safe: $${scenario.winCondition?.minCash ?? 100}`,
              }[langKey] || `Min safe: $${scenario.winCondition?.minCash ?? 100}`}
            </span>
          </div>

          {/* Daily Burn Rate Card */}
          <div
            className={`p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 transition-all flex flex-col items-center text-center relative overflow-hidden ${
              currentBurn > (scenario.winCondition?.maxBurn ?? 100)
                ? 'border-orange-300 dark:border-orange-600/50 shadow-[0_4px_0_#fed7aa] dark:shadow-[0_4px_0_#9a3412]'
                : 'border-emerald-300 dark:border-emerald-600/50 shadow-[0_4px_0_#a7f3d0] dark:shadow-[0_4px_0_#065f46]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400">
              <Flame
                className={`w-3.5 h-3.5 ${
                  currentBurn > (scenario.winCondition?.maxBurn ?? 100) ? 'text-orange-500' : 'text-emerald-500'
                }`}
              />
              <span>
                {{
                  ar: 'الخسارة اليومية',
                  de: 'Täglicher Verlust',
                  es: 'Pérdida Diaria',
                  fr: 'Pertes Quotidiennes',
                  en: 'Daily Burn Rate',
                }[langKey] || 'Daily Burn Rate'}
              </span>
            </div>
            <span
              className={`text-2xl sm:text-3xl font-black mt-1 ${
                currentBurn > (scenario.winCondition?.maxBurn ?? 100)
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
              dir="ltr"
            >
              ${currentBurn} / {{
                ar: 'يوم',
                de: 'Tag',
                es: 'día',
                fr: 'jour',
                en: 'day',
              }[langKey] || 'day'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
              {{
                ar: `الهدف: $${scenario.winCondition?.maxBurn ?? 100}/يوم`,
                de: `Ziel: $${scenario.winCondition?.maxBurn ?? 100}/Tag`,
                es: `Objetivo: $${scenario.winCondition?.maxBurn ?? 100}/día`,
                fr: `Objectif : $${scenario.winCondition?.maxBurn ?? 100}/jour`,
                en: `Target: $${scenario.winCondition?.maxBurn ?? 100}/day`,
              }[langKey] || `Target: $${scenario.winCondition?.maxBurn ?? 100}/day`}
            </span>
          </div>
        </section>

        {/* ── Rex / Ollie Hint Panel on Wrong Result ── */}
        <AnimatePresence>
          {wrongResultPanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full my-2 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-500 shadow-[0_4px_0_#fcd34d] dark:shadow-[0_4px_0_#78350f] flex items-start gap-3"
            >
              <img
                src="/images/characters_clean/rex_idle.png"
                alt="Rex"
                className="w-12 h-12 rounded-xl object-contain bg-red-100 dark:bg-red-900/30 p-1 shrink-0 border border-amber-400"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
                  {{
                    ar: 'ريكس: فكّر تاني؟',
                    de: 'Rex: Noch einmal überlegen?',
                    es: 'Rex: ¿Pensarlo de nuevo?',
                    fr: 'Rex : Réfléchis encore ?',
                    en: 'Rex: Think Again?',
                  }[langKey] || 'Rex: Think Again?'}
                </h4>
                <p className="text-xs font-bold text-amber-950 dark:text-amber-100 mt-0.5 leading-relaxed">
                  {wrongResultPanel}
                </p>
                <button
                  onClick={handleRetryRound}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-[0_3px_0_#d97706] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {{
                      ar: 'إعادة المحاولة',
                      de: 'Erneut versuchen',
                      es: 'Reintentar',
                      fr: 'Réessayer',
                      en: 'Try Again',
                    }[langKey] || 'Try Again'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Turnaround Decisions Section (Tactical Game Cards) ── */}
        <section
          aria-label={{
            ar: 'قرارات إنقاذ الشركة',
            de: 'Rettungsentscheidungen',
            es: 'Decisiones de Rescate',
            fr: 'Décisions de Redressement',
            en: 'Turnaround Decisions',
          }[langKey] || 'Turnaround Decisions'}
          className="w-full flex-1 my-2"
        >
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>🛠️</span>
              <span>
                {{
                  ar: 'قرارات إنقاذ الشركة (اختر قرارك)',
                  de: 'Rettungsentscheidungen (Wähle eine Aktion)',
                  es: 'Decisiones de Rescate (Elige para ejecutar)',
                  fr: 'Décisions de Redressement (Choisis une action)',
                  en: 'Turnaround Decisions (Pick to Execute)',
                }[langKey] || 'Turnaround Decisions (Pick to Execute)'}
              </span>
            </h3>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
              {{
                ar: 'أنفق بذكاء',
                de: 'Klug ausgeben',
                es: 'Gasta con prudencia',
                fr: 'Dépense judicieusement',
                en: 'Spend Wisely',
              }[langKey] || 'Spend Wisely'}
            </span>
          </div>

          <div className="space-y-2.5">
            {issues.map((issue) => {
              const canAfford = currentCash >= issue.costToFix;

              return (
                <button
                  key={issue.id}
                  disabled={issue.fixed}
                  onClick={() => handleFixIssue(issue.id)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-start select-none ${
                    issue.fixed
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-400/70 dark:border-emerald-600/50 shadow-[0_4px_0_#a7f3d0] dark:shadow-[0_4px_0_#064e3b] opacity-90 cursor-default'
                      : canAfford
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#1e293b] hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-[0_4px_0_#f59e0b] hover:scale-[1.01] active:translate-y-1 active:shadow-none cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-[0_3px_0_#e2e8f0] dark:shadow-[0_3px_0_#1e293b] opacity-75 cursor-pointer'
                  }`}
                >
                  {/* Left: Thematic Icon & Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                        issue.fixed
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : canAfford
                          ? 'bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600'
                          : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400'
                      }`}
                    >
                      {issue.fixed ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        getIssueIcon(issue.description)
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-black truncate ${
                          issue.fixed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {t(`scenarios.${scenario.id}.issues.${issue.id}`, { defaultValue: issue.description })}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-200 dark:border-emerald-800">
                          <TrendingDown className="w-3 h-3" />
                          <span>
                            {{
                              ar: `تخفيض الخسارة: -$${issue.impactOnBurn}`,
                              de: `Senkt Verlust: -$${issue.impactOnBurn}/Tag`,
                              es: `Reduce pérdida: -$${issue.impactOnBurn}/día`,
                              fr: `Réduit pertes : -$${issue.impactOnBurn}/jour`,
                              en: `Cuts burn: -$${issue.impactOnBurn}/day`,
                            }[langKey] || `Cuts burn: -$${issue.impactOnBurn}/day`}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Chunky 3D Action / Fixed State Button */}
                  <div className="shrink-0 text-end">
                    {issue.fixed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {{
                            ar: 'تم الحل',
                            de: 'Behoben',
                            es: 'Resuelto',
                            fr: 'Résolu',
                            en: 'Fixed',
                          }[langKey] || 'Fixed'}
                        </span>
                      </span>
                    ) : canAfford ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 shadow-[0_3px_0_#d97706] border-b-2 border-amber-600 hover:brightness-105 active:translate-y-1 active:shadow-none transition-all"
                        dir="ltr"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-950" />
                        <span>${issue.costToFix}</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600"
                        dir="ltr"
                      >
                        <span>${issue.costToFix}</span>
                        <span className="text-[9px]">
                          ({{
                            ar: 'كاش ناقص',
                            de: 'Zu wenig Geld',
                            es: 'Poco efectivo',
                            fr: 'Trésorerie basse',
                            en: 'Low Cash',
                          }[langKey] || 'Low Cash'})
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>,
    document.body
  );
};
