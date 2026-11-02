import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Volume2, ShieldAlert, ChevronDown, ChevronUp, Sparkles, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VoiceNarrationButton } from '../../../../components/ui/VoiceNarrationButton';
import { SoundService } from '../../../../lib/sound';

export interface PreBossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFight: () => void;
  bossNameAr: string;
  bossNameEn: string;
  bossTaglineAr: string;
  bossTaglineEn: string;
  hostName: string;
  themeColor: string;
  isRexMatch?: boolean;
  isArabic: boolean;
  bossImage?: string;
}

export const PreBossModal: React.FC<PreBossModalProps> = ({
  isOpen,
  onClose,
  onStartFight,
  bossNameAr,
  bossNameEn,
  bossTaglineAr,
  bossTaglineEn,
  hostName,
  themeColor,
  isRexMatch = false,
  isArabic,
  bossImage,
}) => {
  const { t, i18n } = useTranslation();
  const [expandedHero, setExpandedHero] = useState<string | null>(null);

  if (!isOpen || typeof document === 'undefined') return null;

  const lang = (i18n.language || (isArabic ? 'ar' : 'en')).split('-')[0];
  const isRTL = lang === 'ar';

  const displayedBossName = lang === 'ar' ? bossNameAr : (bossNameEn || bossNameAr);
  const displayedBossTagline = lang === 'ar' ? bossTaglineAr : (bossTaglineEn || bossTaglineAr);

  const HEROES_MAP: Record<string, Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    shortLine: string;
    expandedAdvice: string;
  }>> = {
    ar: [
      {
        id: 'ollie',
        name: 'أولي',
        role: 'المستشار الذكي',
        avatar: '/images/characters_clean/ollie_idle.png',
        shortLine: 'راقب رصيد الكاش أولاً!',
        expandedAdvice: 'لا تنفق أموالك كلها في إصلاح واحد، وازن بين التكلفة وتخفيض الخسارة اليومية.',
      },
      {
        id: 'reema',
        name: 'ريما',
        role: 'خبيرة المبيعات',
        avatar: '/images/characters_clean/reema_idle.png',
        shortLine: 'العملاء هم شريان الحياة!',
        expandedAdvice: 'حل مشاكل خدمة العملاء والمنتج لتعود الطلبات بالتدفق بقوة.',
      },
      {
        id: 'filo',
        name: 'فيلو',
        role: 'مهندس العمليات',
        avatar: '/images/characters_clean/filo_idle.png',
        shortLine: 'أوقف الهدر والتسريبات!',
        expandedAdvice: 'الأخطاء البرمجية ومشاكل الأجهزة تزيد معدل الحرق اليومي، أصلحها أولاً.',
      },
      {
        id: 'kami',
        name: 'كامي',
        role: 'سفيرة الموارد',
        avatar: '/images/characters_clean/kami_idle.png',
        shortLine: 'فريق العمل هو السر!',
        expandedAdvice: 'تحفيز الموظفين وإعطاؤهم الأدوات الصحيحة يقلل الأخطاء ويزيد الأرباح.',
      },
    ],
    en: [
      {
        id: 'ollie',
        name: 'Ollie',
        role: 'Smart Strategist',
        avatar: '/images/characters_clean/ollie_idle.png',
        shortLine: 'Watch cash flow first!',
        expandedAdvice: 'Do not spend all cash on one fix. Balance the cost against daily cash burn.',
      },
      {
        id: 'reema',
        name: 'Reema',
        role: 'Sales Specialist',
        avatar: '/images/characters_clean/reema_idle.png',
        shortLine: 'Customers are lifeblood!',
        expandedAdvice: 'Fix product and customer complaints so orders surge back up quickly.',
      },
      {
        id: 'filo',
        name: 'Filo',
        role: 'Tech & Ops Guru',
        avatar: '/images/characters_clean/filo_idle.png',
        shortLine: 'Stop cash leaks!',
        expandedAdvice: 'System bugs and hardware issues bleed cash daily. Fix them early.',
      },
      {
        id: 'kami',
        name: 'Kami',
        role: 'Resource Optimizer',
        avatar: '/images/characters_clean/kami_idle.png',
        shortLine: 'The team makes it work!',
        expandedAdvice: 'Empowering staff and tools cuts down mistakes and multiplies returns.',
      },
    ],
    de: [
      {
        id: 'ollie',
        name: 'Ollie',
        role: 'Strategieberater',
        avatar: '/images/characters_clean/ollie_idle.png',
        shortLine: 'Behalte zuerst den Cashflow im Auge!',
        expandedAdvice: 'Gib nicht dein ganzes Geld für eine Reparatur aus. Wäge die Kosten gegen den täglichen Verlust ab.',
      },
      {
        id: 'reema',
        name: 'Reema',
        role: 'Verkaufsspezialistin',
        avatar: '/images/characters_clean/reema_idle.png',
        shortLine: 'Kunden sind das Lebenselixier!',
        expandedAdvice: 'Behebe Produkt- und Kundenprobleme, damit die Bestellungen schnell wieder ansteigen.',
      },
      {
        id: 'filo',
        name: 'Filo',
        role: 'Technik- & Betriebsguru',
        avatar: '/images/characters_clean/filo_idle.png',
        shortLine: 'Stoppe Geldlecks!',
        expandedAdvice: 'Softwarefehler und Hardwareprobleme verbrennen täglich Geld. Behebe sie frühzeitig.',
      },
      {
        id: 'kami',
        name: 'Kami',
        role: 'Ressourcenmanagerin',
        avatar: '/images/characters_clean/kami_idle.png',
        shortLine: 'Das Team macht den Unterschied!',
        expandedAdvice: 'Mitarbeiter zu motivieren und mit richtigen Werkzeugen auszustatten verringert Fehler und steigert Gewinne.',
      },
    ],
    es: [
      {
        id: 'ollie',
        name: 'Ollie',
        role: 'Estratega Inteligente',
        avatar: '/images/characters_clean/ollie_idle.png',
        shortLine: '¡Vigila primero el flujo de efectivo!',
        expandedAdvice: 'No gastes todo tu dinero en una sola solución. Equilibra el costo frente a la pérdida diaria.',
      },
      {
        id: 'reema',
        name: 'Reema',
        role: 'Especialista en Ventas',
        avatar: '/images/characters_clean/reema_idle.png',
        shortLine: '¡Los clientes son vitales!',
        expandedAdvice: 'Soluciona los problemas de producto y clientes para que los pedidos vuelvan a crecer.',
      },
      {
        id: 'filo',
        name: 'Filo',
        role: 'Gurú de Tecnología y Operaciones',
        avatar: '/images/characters_clean/filo_idle.png',
        shortLine: '¡Detén las fugas de dinero!',
        expandedAdvice: 'Los fallos del sistema y problemas de equipo queman dinero a diario. Corrígelos cuanto antes.',
      },
      {
        id: 'kami',
        name: 'Kami',
        role: 'Optimizadora de Recursos',
        avatar: '/images/characters_clean/kami_idle.png',
        shortLine: '¡El equipo lo hace posible!',
        expandedAdvice: 'Motivar al personal y darles las herramientas adecuadas reduce errores y multiplica ganancias.',
      },
    ],
    fr: [
      {
        id: 'ollie',
        name: 'Ollie',
        role: 'Stratège Avisé',
        avatar: '/images/characters_clean/ollie_idle.png',
        shortLine: "Surveille d'abord la trésorerie !",
        expandedAdvice: 'Ne dépense pas tout ton argent sur une seule réparation. Équilibre le coût et la réduction des pertes quotidiennes.',
      },
      {
        id: 'reema',
        name: 'Reema',
        role: 'Spécialiste des Ventes',
        avatar: '/images/characters_clean/reema_idle.png',
        shortLine: 'Les clients sont le cœur du projet !',
        expandedAdvice: 'Règle les plaintes des clients et les défauts pour que les commandes affluent à nouveau.',
      },
      {
        id: 'filo',
        name: 'Filo',
        role: 'Gourou Technique & Opérations',
        avatar: '/images/characters_clean/filo_idle.png',
        shortLine: 'Stoppe les fuites d’argent !',
        expandedAdvice: 'Les bugs et pannes de matériel brûlent de l’argent chaque jour. Répare-les en premier.',
      },
      {
        id: 'kami',
        name: 'Kami',
        role: 'Optimisatrice des Ressources',
        avatar: '/images/characters_clean/kami_idle.png',
        shortLine: 'L’équipe fait toute la différence !',
        expandedAdvice: 'Motiver le personnel et leur fournir les bons outils réduit les erreurs et multiplie les profits.',
      },
    ],
  };

  const heroes = HEROES_MAP[lang] || HEROES_MAP.en;

  const backLabel = {
    ar: 'رجوع للخريطة',
    de: 'Zurück zur Karte',
    es: 'Volver al mapa',
    fr: 'Retour à la carte',
    en: 'Back to Map',
  }[lang] || 'Back to Map';

  const hostWelcomeText = {
    ar: `${hostName}: وصلت لتحدي الزعيم! فكر بهدوء وخطط قبل كل قرار.`,
    de: `${hostName}: Du hast die Boss-Herausforderung erreicht! Überlege ruhig vor jeder Entscheidung.`,
    es: `${hostName}: ¡Has llegado al desafío del Jefe! Piensa con calma antes de cada decisión.`,
    fr: `${hostName} : Tu as atteint le défi du Boss ! Réfléchis calmement avant chaque décision.`,
    en: `${hostName}: You reached the Boss challenge! Think calmly before every decision.`,
  }[lang] || `${hostName}: You reached the Boss challenge! Think calmly before every decision.`;

  const adviceTitle = {
    ar: 'نصائح أبطال باترول',
    de: 'Ratschläge der Patrol-Helden',
    es: 'Consejos de los Héroes de Patrol',
    fr: 'Conseils des Héros de Patrol',
    en: 'Patrol Heroes Advice',
  }[lang] || 'Patrol Heroes Advice';

  const rexBubbleText = {
    ar: 'أتحداك تنقذ الشركة في الوقت المحدد! ورّينا شطارتك يا بطل!',
    de: 'Ich fordere dich heraus, das Unternehmen rechtzeitig zu retten! Zeig dein Können, Held!',
    es: '¡Te reto a salvar la empresa antes de que se acabe el tiempo! ¿Listo, campeón?',
    fr: 'Je te mets au défi de sauver cette entreprise à temps ! Montre ce que tu vaux, champion !',
    en: 'I dare you to save this company before time runs out! Ready, hero?',
  }[lang] || 'I dare you to save this company before time runs out! Ready, hero?';

  const readyLabel = {
    ar: 'جاهز للتحدي!',
    de: 'Bereit für die Herausforderung!',
    es: '¡Listo para el desafío!',
    fr: 'Prêt pour le défi !',
    en: 'Ready for the Challenge!',
  }[lang] || 'Ready for the Challenge!';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-boss-title"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[9999] flex flex-col overflow-y-auto bg-[#faf8f5] dark:bg-[#070b16] text-slate-800 dark:text-slate-100 transition-colors duration-200"
    >
      {/* Top Bar with Back (no penalty) and Audio Narration */}
      <div className="flex items-center justify-between p-4 sm:p-5 shrink-0 z-10 max-w-4xl w-full mx-auto">
        <button
          onClick={() => {
            SoundService.playClick();
            onClose();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#1e293b] active:translate-y-0.5 active:shadow-none hover:border-amber-400 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{backLabel}</span>
        </button>

        <div className="flex items-center gap-2">
          <VoiceNarrationButton
            characterId="ollie"
            textToSpeak={`${displayedBossName}. ${displayedBossTagline}. ${rexBubbleText}`}
          />
        </div>
      </div>

      {/* Content container */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 pb-8 flex flex-col items-center text-center">
        {/* Upper Half: Boss Art & Host Welcome Bubble */}
        <div className="relative mt-1 mb-3 flex flex-col items-center">
          {/* Host Welcome Bubble */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 border-2 border-amber-300 dark:border-amber-600/60 shadow-[0_3px_0_#fde68a] dark:shadow-[0_3px_0_#78350f] text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200 max-w-md"
          >
            <span>👋 </span>
            <span>{hostWelcomeText}</span>
          </motion.div>

          {/* Boss Art Avatar */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 p-1 shadow-2xl flex items-center justify-center border-b-4 border-amber-600 dark:border-amber-700 overflow-hidden"
          >
            <img
              src={bossImage || '/icons/3d/boss_badge.png'}
              alt={displayedBossName}
              className="w-full h-full object-cover rounded-2xl bg-white dark:bg-slate-800 drop-shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/icons/3d/boss_badge.png';
              }}
            />
            <div className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl border border-white/40">
              BOSS
            </div>
          </motion.div>

          {/* Boss Name & Tagline */}
          <h1
            id="pre-boss-title"
            className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white"
          >
            {displayedBossName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 max-w-lg">
            {displayedBossTagline}
          </p>
        </div>

        {/* Middle: 4 Hero Advice Cards */}
        <div className="w-full my-3 text-start">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 px-1 text-start flex items-center gap-1.5">
            <span>💡</span>
            <span>{adviceTitle}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {heroes.map((hero) => {
              const isExp = expandedHero === hero.id;
              return (
                <button
                  key={hero.id}
                  onClick={() => {
                    SoundService.playClick();
                    setExpandedHero(isExp ? null : hero.id);
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#e2e8f0] dark:shadow-[0_3px_0_#1e293b] hover:border-amber-400 dark:hover:border-amber-400 transition-all text-start cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/80 p-0.5 border border-slate-300 dark:border-slate-600 shrink-0">
                      <img
                        src={hero.avatar}
                        alt={hero.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {hero.name}
                        </span>
                        {isExp ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                        {hero.shortLine}
                      </p>
                    </div>
                  </div>
                  {isExp && (
                    <p className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      {hero.expandedAdvice}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Rex with Question Bubble + Big "جاهز؟" button */}
        <div className="w-full mt-auto pt-3 flex flex-col items-center">
          {/* Rex Question Bubble */}
          <div className="flex items-center gap-3 mb-3.5 w-full max-w-md bg-red-50 dark:bg-red-950/60 border-2 border-red-300 dark:border-red-600/60 shadow-[0_3px_0_#fca5a5] dark:shadow-[0_3px_0_#7f1d1d] p-3 rounded-2xl">
            <img
              src="/images/characters_clean/rex_idle.png"
              alt="Rex"
              className="w-12 h-12 rounded-xl object-contain shrink-0 border border-red-300 dark:border-red-500 bg-red-100 dark:bg-red-900/40 p-0.5"
            />
            <p className="text-xs font-black text-red-900 dark:text-red-200 text-start leading-snug">
              {rexBubbleText}
            </p>
          </div>

          {/* Big Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              SoundService.playClick();
              onStartFight();
            }}
            className="btn-juicy w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg sm:text-xl shadow-[0_5px_0_#059669] active:translate-y-1 active:shadow-none cursor-pointer border-b-2 border-emerald-700 flex items-center justify-center gap-2"
          >
            <span>{readyLabel}</span>
            <span>🔥</span>
          </motion.button>
        </div>
      </div>
    </div>,
    document.body
  );
};
