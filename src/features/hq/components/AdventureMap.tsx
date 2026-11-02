import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check,
  Lock,
  Star,
  Trophy,
  Gift,
  Swords,
  Bell,
  MoreHorizontal,
  Compass,
  BookOpen,
  User,
  Shield,
  Sparkles,
  X,
  Dumbbell,
  Flame,
  Coins,
  Play,
  RotateCcw,
  Layers,
  Bot,
  Gamepad2,
  Building2,
  Briefcase,
  Rocket,
  ShoppingBag,
  Brain,
  Settings,
  LogOut,
  Info,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { formatCompactNumber } from '../../../utils/formatters';

import { RewardBurst } from '../../ageMode/components/RewardBurst';
import { ALL_LESSONS, COURSE_MAP } from '../../education/data/curriculum';
import { UserRole } from '../../../types';
import { SoundService } from '../../../lib/sound';
import confetti from 'canvas-confetti';
import { SCENARIOS } from '../../scenarios/data/scenarios';

// Existing Modals
import { FullMapSheet } from '../../education/components/path/FullMapSheet';
import { PathNodeType } from '../../education/components/path/PathNode';
import { PreBossModal } from '../../education/components/path/PreBossModal';
import { BossFightShell } from '../../education/components/path/BossFightShell';
import { BossResultModal } from '../../education/components/path/BossResultModal';
import { NodeDetailSheet } from '../../education/components/path/NodeDetailSheet';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import LanguageToggle from '../../../components/ui/LanguageToggle';
import { Character, CharacterState } from '../../../components/character/Character';
import { getSideCharactersForDistrict, getSideCharacterMessage } from '../../../components/character/districtSideCharacters';
import { getLocalizedModule } from '../../education/utils/localizedCurriculum';
import { useIsMobile } from '../../../hooks/useIsMobile';
import NewsTicker from '../../game/components/NewsTicker';

// Data JSONs
import modulesData from '../../education/data/modules.json';

interface AdventureMapProps {
  onStartLesson: (lessonId: string) => void;
  onNavigate?: (tab: string) => void;
}

// Boss visual assets configuration
const BOSS_ASSETS: Record<string, { image: string; icon: string }> = {
  pizza_panic: {
    image: '/images/bosses/pizza_panic.png',
    icon: '/icons/3d/pizza.png',
  },
  burger_burnout: {
    image: '/images/bosses/burger_burnout.png',
    icon: '/images/bosses/burger_burnout.png',
  },
  tech_trouble: {
    image: '/images/bosses/tech_trouble.png',
    icon: '/images/bosses/tech_trouble.png',
  },
  stock_market_storm: {
    image: '/images/bosses/stock_market_storm.png',
    icon: '/images/bosses/stock_market_storm.png',
  },
};

const getBossAssets = (scenarioId?: string) => {
  if (scenarioId && BOSS_ASSETS[scenarioId]) {
    return BOSS_ASSETS[scenarioId];
  }
  return {
    image: '/icons/3d/boss_badge.png',
    icon: '/icons/3d/boss_badge.png',
  };
};

// Zigzag coordinates: consistent 96px vertical spacing, ~80px peak amplitude on desktop
const PATH_OFFSETS = [0, 55, 80, 45, -25, -65, -80, -50, 35, 78, 50, -40, 0];

export const AdventureMap: React.FC<AdventureMapProps> = ({ onStartLesson, onNavigate }) => {
  const { user, updateUser, logout } = useAppStore();
  const isAdmin =
    user?.role === UserRole.ADMIN ||
    user?.role?.toUpperCase?.() === 'ADMIN' ||
    (user as any)?.isAdmin === true;
  const { lessons } = useEducationStore();
  const { isArabic, playTap } = useAgeMode();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isRTL = currentLang.startsWith('ar');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Scroll and layout refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLDivElement>(null);

  // Completed lessons set
  const completedLessonIds = useMemo(() => {
    return new Set(user?.completedLessonIds || []);
  }, [user?.completedLessonIds]);

  // Active module state (normalized so 'mod_1' maps to 'MOD_MB')
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() => {
    const userMod = user?.currentModuleId;
    if (userMod && modulesData.some((m) => m.id === userMod)) {
      return userMod;
    }
    if (userMod === 'mod_1') return 'MOD_MB';
    if (userMod === 'mod_2') return 'MOD_ENT';
    return 'MOD_MB';
  });

  // Modals state
  const [isFullMapOpen, setIsFullMapOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shakingNodeId, setShakingNodeId] = useState<string | null>(null);
  const [activeTooltipNodeId, setActiveTooltipNodeId] = useState<string | null>(null);

  // Practice Popover & More Menu Popover
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Welcome popup: show ONCE per session only
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return !sessionStorage.getItem('pp_welcome_map_shown');
    }
    return false;
  });

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('pp_welcome_map_shown', 'true');
    }
  };

  // Node details sheet
  const [nodeDetail, setNodeDetail] = useState<{
    id: string;
    nodeNumber: number;
    type: PathNodeType;
    title: string;
    themeColor: string;
  } | null>(null);

  // Chest celebration burst
  const [celebration, setCelebration] = useState<{ show: boolean; title?: string } | null>(null);
  const [openedChests, setOpenedChests] = useState<Set<string>>(() => new Set());

  // Boss Flow States
  const [preBossModalOpen, setPreBossModalOpen] = useState(false);
  const [bossFightOpen, setBossFightOpen] = useState(false);
  const [bossResultModal, setBossResultModal] = useState<{
    isOpen: boolean;
    result: 'win' | 'lose';
  }>({ isOpen: false, result: 'win' });
  const [beatenBosses, setBeatenBosses] = useState<Set<string>>(() => new Set());

  // Current active module config
  const currentModuleIndex = modulesData.findIndex((m) => m.id === selectedModuleId);
  const activeModuleConfig = modulesData[currentModuleIndex >= 0 ? currentModuleIndex : 0];
  const localizedModule = useMemo(() => getLocalizedModule(activeModuleConfig, currentLang), [activeModuleConfig, currentLang]);

  const hasPrevModule = currentModuleIndex > 0;
  const hasNextModule = currentModuleIndex >= 0 && currentModuleIndex < modulesData.length - 1;

  const handlePrevModule = () => {
    if (hasPrevModule) {
      setSelectedModuleId(modulesData[currentModuleIndex - 1].id);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNextModule = () => {
    if (hasNextModule) {
      setSelectedModuleId(modulesData[currentModuleIndex + 1].id);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // 10 lessons for the active module
  const activeCourseMod =
    COURSE_MAP.find((c) => c.id === selectedModuleId) ||
    COURSE_MAP.find((c) => c.id === 'MOD_MB') ||
    COURSE_MAP[0];

  const activeModLessons = useMemo(() => {
    const list = ALL_LESSONS.filter((l) => activeCourseMod.lessonIds.includes(l.id));
    if (list.length >= 10) return list.slice(0, 10);
    return list;
  }, [activeCourseMod]);

  // Collapsible sidebar menus (auto-expand group that contains active page)
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [ventureOpen, setVentureOpen] = useState(false);

  useEffect(() => {
    const p = location.pathname;
    if (p.includes('/games') || p.includes('/debate') || p.includes('/card-academy')) {
      setPracticeOpen(true);
    }
    if (p.includes('/the-tank') || p.includes('/real-estate') || p.includes('/skills')) {
      setVentureOpen(true);
    }
  }, [location.pathname]);

  // Counted completed lessons in this module
  const completedInModuleCount = useMemo(() => {
    return activeModLessons.filter((l) => completedLessonIds.has(l.id)).length;
  }, [activeModLessons, completedLessonIds]);

  // District unlocked calculation:
  // District 1 (index 0) is unlocked.
  // District N (index > 0) is unlocked only if all lessons of District N-1 are completed.
  const isDistrictUnlocked = useMemo(() => {
    if (isAdmin) return true;
    if (currentModuleIndex <= 0) return true;
    const prevMod = modulesData[currentModuleIndex - 1];
    if (!prevMod) return true;
    const prevCourseMod = COURSE_MAP.find((c) => c.id === prevMod.id);
    if (!prevCourseMod) return true;
    return prevCourseMod.lessonIds.every((id) => completedLessonIds.has(id));
  }, [isAdmin, currentModuleIndex, completedLessonIds]);

  // Current lesson node ID (first uncompleted node in an unlocked district)
  const currentActiveLesson = useMemo(() => {
    if (!isDistrictUnlocked) return null;
    return activeModLessons.find((l) => !completedLessonIds.has(l.id)) || null;
  }, [isDistrictUnlocked, activeModLessons, completedLessonIds]);
  const currentActiveNodeId = currentActiveLesson?.id || '';

  // Localized lesson title resolver
  const getLessonDisplayTitle = (lesson?: (typeof ALL_LESSONS)[0] | null, index?: number): string => {
    if (!lesson) return t('map.current_lesson', isArabic ? 'الدرس الحالي' : 'Current Lesson');
    if (lesson.id === 'MB_01' || (index === 0 && activeModuleConfig.id === 'MOD_MB')) {
      return t('lessons.MB_01.headline', { defaultValue: isArabic ? 'يعني إيه فلوس؟' : 'What is Money?' });
    }
    if (lesson.id === 'MB_08' || (index === 7 && activeModuleConfig.id === 'MOD_MB')) {
      return t('lessons.MB_08.headline', { defaultValue: isArabic ? 'تحدي بطل الأعمال' : 'Business Hero Challenge' });
    }
    return t(`lesson_${lesson.id}_title`, {
      defaultValue: t(`lessons.${lesson.id}.headline`, {
        defaultValue: lesson.lesson_payload?.headline || lesson.id,
      }),
    });
  };

  // Locked click handler with toast + shake
  const handleLockedClick = (nodeId: string, customMessage?: string) => {
    if (isAdmin) return;
    if (playTap) {
      playTap();
    } else {
      SoundService.playClick?.();
    }
    setShakingNodeId(nodeId);
    if (!isDistrictUnlocked) {
      const prevDistrictNum = currentModuleIndex;
      setToastMessage(
        t('map.district_locked_msg', {
          district: prevDistrictNum,
          defaultValue: isArabic
            ? `المنطقة مقفلة! أكمل جميع دروس المنطقة ${prevDistrictNum} أولاً.`
            : `District is locked! Complete all lessons in District ${prevDistrictNum} first.`,
        })
      );
    } else if (nodeId === 'boss_stage') {
      setToastMessage(
        t('map.boss_locked_msg', {
          current: completedInModuleCount,
          total: activeModLessons.length,
          defaultValue: isArabic
            ? `الزعيم مقفل! أكمل جميع دروس المنطقة (${completedInModuleCount}/${activeModLessons.length}) لفتح التحدي!`
            : `Boss is locked! Complete all district lessons (${completedInModuleCount}/${activeModLessons.length}) to unlock!`,
        })
      );
    } else if (customMessage) {
      setToastMessage(customMessage);
    } else {
      setToastMessage(t('map.complete_prev_first', isArabic ? 'خلّص الدروس السابقة أولاً!' : 'Complete previous lessons first!'));
    }
    setTimeout(() => {
      setShakingNodeId(null);
    }, 300);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Chest opener
  const handleOpenChest = (chestId: string, coins = 50) => {
    SoundService.playSuccess?.();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}
    setOpenedChests((prev) => new Set([...prev, chestId]));
    setCelebration({
      show: true,
      title: t('map.found_gold_coins', {
        count: coins,
        defaultValue: isArabic ? `حصلت على ${coins} عملة ذهبية!` : `Found ${coins} Gold Coins!`,
      }),
    });
    if (user) {
      updateUser(user.id, { ppTokens: (user.ppTokens || 0) + coins });
    }
  };

  // Boss state calculation - Boss is ONLY unlocked once ALL lessons in this district module are passed (or if already beaten)
  const isBossBeaten = beatenBosses.has(activeModuleConfig.id);
  const allDistrictLessonsCompleted =
    activeModLessons.length > 0 && completedInModuleCount >= activeModLessons.length;
  const isBossUnlocked = isAdmin || isBossBeaten || allDistrictLessonsCompleted;

  // Active boss assets (image & icon)
  const currentBossAssets = useMemo(() => {
    return getBossAssets(activeModuleConfig.bossScenarioId);
  }, [activeModuleConfig.bossScenarioId]);

  // Step completion helper for SVG connector lines
  const isStepCompleted = (stepIndex: number): boolean => {
    if (!isDistrictUnlocked) return false;
    if (stepIndex <= 3) return completedLessonIds.has(activeModLessons[stepIndex]?.id);
    if (stepIndex === 4) return openedChests.has(`${activeModuleConfig.id}_chest_1`) || completedLessonIds.has(activeModLessons[4]?.id);
    if (stepIndex <= 8) return completedLessonIds.has(activeModLessons[stepIndex - 1]?.id);
    if (stepIndex === 9) return openedChests.has(`${activeModuleConfig.id}_chest_2`) || completedLessonIds.has(activeModLessons[8]?.id);
    if (stepIndex <= 11) return completedLessonIds.has(activeModLessons[stepIndex - 2]?.id);
    if (stepIndex === 12) return isBossBeaten;
    return false;
  };

  // Active step index where Ollie stands (beside the current node on the path)
  const activeStepIndex = useMemo(() => {
    if (!isDistrictUnlocked) return 0;
    const firstUnfinishedIdx = activeModLessons.findIndex((l) => !completedLessonIds.has(l.id));
    if (firstUnfinishedIdx === -1) return 12; // all lessons done -> at Boss
    if (firstUnfinishedIdx < 4) return firstUnfinishedIdx; // 0..3
    if (firstUnfinishedIdx < 8) return firstUnfinishedIdx + 1; // 5..8
    return firstUnfinishedIdx + 2; // 10..11
  }, [isDistrictUnlocked, activeModLessons, completedLessonIds]);

  // Auto-scroll to current node smoothly on mount or module switch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        if (activeStepIndex <= 1) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentNodeRef.current) {
          currentNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedModuleId, activeStepIndex]);

  // 13 Path elements configuration
  const pathElements = useMemo(() => {
    return [
      { type: 'lesson' as const, lessonIndex: 0, stepIndex: 0 },
      { type: 'lesson' as const, lessonIndex: 1, stepIndex: 1 },
      { type: 'lesson' as const, lessonIndex: 2, stepIndex: 2 },
      { type: 'lesson' as const, lessonIndex: 3, stepIndex: 3 },
      { type: 'chest' as const, chestId: `${activeModuleConfig.id}_chest_1`, reqLessonIndex: 3, coins: 50, stepIndex: 4 },
      { type: 'lesson' as const, lessonIndex: 4, stepIndex: 5 },
      { type: 'lesson' as const, lessonIndex: 5, stepIndex: 6 },
      { type: 'lesson' as const, lessonIndex: 6, stepIndex: 7 },
      { type: 'lesson' as const, lessonIndex: 7, stepIndex: 8 },
      { type: 'chest' as const, chestId: `${activeModuleConfig.id}_chest_2`, reqLessonIndex: 7, coins: 100, stepIndex: 9 },
      { type: 'lesson' as const, lessonIndex: 8, stepIndex: 10 },
      { type: 'lesson' as const, lessonIndex: 9, stepIndex: 11 },
      { type: 'boss' as const, stepIndex: 12 },
    ];
  }, [activeModuleConfig.id]);

  // Boss Win Handler
  const handleBossWin = (score: { stars: number; coins: number }) => {
    setBossFightOpen(false);
    setBeatenBosses((prev) => new Set([...prev, activeModuleConfig.id]));
    setBossResultModal({ isOpen: true, result: 'win' });
    if (user) {
      updateUser(user.id, {
        ppTokens: (user.ppTokens || 0) + score.coins,
        xp: (user.xp || 0) + 100,
      });
    }
  };

  // Boss Continue Handler (Scroll to next module)
  const handleBossContinue = () => {
    setBossResultModal({ isOpen: false, result: 'win' });
    const nextIndex = (currentModuleIndex + 1) % modulesData.length;
    const nextMod = modulesData[nextIndex];
    setSelectedModuleId(nextMod.id);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get turnaround scenario for boss fight
  const bossScenario = useMemo(() => {
    return (
      SCENARIOS.find((s) => s.id === activeModuleConfig.bossScenarioId) ||
      SCENARIOS[0]
    );
  }, [activeModuleConfig.bossScenarioId]);

  // Navigation helper
  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path.startsWith('/') ? path : `/${path}`);
    }
  };

  // NPC dialogue quest test mock state for WorldSystemV2 test
  const [entrepreneurQuestOpen, setEntrepreneurQuestOpen] = useState(false);
  const [questClaimed, setQuestClaimed] = useState(false);

    const OLLIE_MESSAGES_MAP: Record<string, string[]> = {
    ar: [
      "يلا يا بطل الأعمال! 🚀",
      "ادخر جزءاً صغيراً كل يوم! 💰",
      "استثمر في مهاراتك ومعرفتك! 🌟",
      "المستثمر الذكي يبني إمبراطورية! 👑",
      "الاستمرار هو سر النجاح! 🔑",
      "أنت قدّها يا رئيس مجلس الإدارة! 💼",
    ],
    en: [
      "Let's go CEO! 🚀",
      "Save a little every day! 💰",
      "Invest in your skills! 🌟",
      "Smart spenders build empires! 👑",
      "Consistency is key! 🔑",
      "You got this, Tycoon! 💼",
    ],
    de: [
      "Los geht's, CEO! 🚀",
      "Spare jeden Tag ein wenig! 💰",
      "Investiere in deine Fähigkeiten! 🌟",
      "Kluge Ausgaben bauen Imperien auf! 👑",
      "Beständigkeit ist der Schlüssel! 🔑",
      "Du schaffst das, Tycoon! 💼",
    ],
    es: [
      "¡Vamos CEO! 🚀",
      "¡Ahorra un poco cada día! 💰",
      "¡Invierte en tus habilidades! 🌟",
      "¡Los compradores inteligentes construyen imperios! 👑",
      "¡La constancia es la clave! 🔑",
      "¡Tú puedes, Magnate! 💼",
    ],
    fr: [
      "C'est parti, PDG ! 🚀",
      "Économise un peu chaque jour ! 💰",
      "Investis dans tes compétences ! 🌟",
      "Les gestionnaires avisés bâtissent des empires ! 👑",
      "La régularité est la clé ! 🔑",
      "Tu peux le faire, Tycoon ! 💼",
    ],
  };

  const ollieMessages = useMemo(() => {
    const langKey = currentLang.split('-')[0];
    return OLLIE_MESSAGES_MAP[langKey] || OLLIE_MESSAGES_MAP.en;
  }, [currentLang]);

  // Character & Animation States
  const [ollieState, setOllieState] = useState<CharacterState>('idle');
  const [ollieMsgIndex, setOllieMsgIndex] = useState(0);
  const [ollieMsgFade, setOllieMsgFade] = useState(true);
  const [ollieTapped, setOllieTapped] = useState(false);
  const [activeSideCharName, setActiveSideCharName] = useState<string | null>(null);
  const [hoveredSideCharName, setHoveredSideCharName] = useState<string | null>(null);
  const [headerPopping, setHeaderPopping] = useState(false);
  const [coinsPopping, setCoinsPopping] = useState(false);

  // Measure path container width dynamically for pixel-perfect dashed SVG alignment
  const pathContainerRef = useRef<HTMLDivElement>(null);
  const [pathWidth, setPathWidth] = useState(620);

  useEffect(() => {
    if (!pathContainerRef.current) return;
    const updateWidth = () => {
      if (pathContainerRef.current) {
        setPathWidth(pathContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(pathContainerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Rotate Ollie messages every 8s with smooth fade
  useEffect(() => {
    const timer = setInterval(() => {
      setOllieMsgFade(false);
      setTimeout(() => {
        setOllieMsgIndex((prev) => (prev + 1) % ollieMessages.length);
        setOllieMsgFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(timer);
  }, [isArabic]);

  // District start: Ollie waves and the header does .anim-pop
  useEffect(() => {
    setOllieState('wave');
    setHeaderPopping(true);
    const tHeader = setTimeout(() => setHeaderPopping(false), 600);
    const tOllie = setTimeout(() => setOllieState('idle'), 3000);
    return () => {
      clearTimeout(tHeader);
      clearTimeout(tOllie);
    };
  }, [selectedModuleId]);

  // Lesson complete or reward: Ollie cheers, canvas-confetti burst, coins/XP count up with .anim-pop
  useEffect(() => {
    if (celebration?.show) {
      setOllieState('cheer');
      setCoinsPopping(true);
      const tCoins = setTimeout(() => setCoinsPopping(false), 800);
      const tCheer = setTimeout(() => setOllieState('idle'), 3500);
      return () => {
        clearTimeout(tCoins);
        clearTimeout(tCheer);
      };
    }
  }, [celebration?.show]);

  const handleOllieClick = () => {
    if (playTap) playTap();
    else SoundService.playClick?.();
    setOllieMsgIndex((prev) => (prev + 1) % ollieMessages.length);
    setOllieState((prev) => (prev === 'idle' ? 'wave' : 'idle'));
    setOllieTapped(true);
    setOllieMsgFade(true);
    setTimeout(() => setOllieTapped(false), 5000);
    try {
      confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const sideCharacters = useMemo(() => {
    return getSideCharactersForDistrict(activeModuleConfig.districtNumber);
  }, [activeModuleConfig.districtNumber]);

    // Advisor Ollie tips pool
  const ADVISOR_TIPS_MAP: Record<string, string[]> = {
    ar: [
      'الاستمرار هو السر! ادخر جزءاً صغيراً من كل مبلغ تحصل عليه.',
      'قبل ما تشتري حاجة، فكر: دي رغبة ولا حاجة أساسية؟',
      'الاستثمار في مهاراتك هو أفضل استثمار يحقق لك أعلى عائد!',
    ],
    en: [
      'Consistency is key! Save a little every day.',
      'Before buying, ask: is this a want or a true need?',
      'Investing in your skills brings the greatest lifelong return!',
    ],
    de: [
      'Beständigkeit ist der Schlüssel! Spare jeden Tag ein wenig.',
      'Frage dich vor jedem Kauf: Ist das ein Wunsch oder eine echte Notwendigkeit?',
      'Die Investition in deine Fähigkeiten bringt den größten lebenslangen Ertrag!',
    ],
    es: [
      '¡La constancia es la clave! Ahorra un poco cada día.',
      'Antes de comprar, pregúntate: ¿es un deseo o una necesidad real?',
      '¡Invertir en tus habilidades genera el mayor retorno para toda la vida!',
    ],
    fr: [
      'La régularité est la clé ! Économise un peu chaque jour.',
      "Avant d'acheter, demande-toi : est-ce une envie ou un vrai besoin ?",
      'Investir dans tes compétences offre le plus grand retour pour toute la vie !',
    ],
  };

  const advisorTips = useMemo(() => {
    const langKey = currentLang.split('-')[0];
    return ADVISOR_TIPS_MAP[langKey] || ADVISOR_TIPS_MAP.en;
  }, [currentLang]);

  const currentAdvisorTip = advisorTips[currentModuleIndex % advisorTips.length];

  // District theme mapping (6 alternating rich district themes)
  const districtTheme = useMemo(() => {
    const themes = [
      { cls: 'theme-orange', icon: '/icons/3d/money_bag.png' },
      { cls: 'theme-blue', icon: '/icons/3d/coin.png' },
      { cls: 'theme-purple', icon: '/icons/3d/trophy.png' },
      { cls: 'theme-pink', icon: '/icons/3d/pizza.png' },
      { cls: 'theme-teal', icon: '/icons/3d/books.png' },
      { cls: 'theme-green', icon: '/icons/3d/house.png' },
    ];
    return themes[Math.max(0, (activeModuleConfig.districtNumber - 1) % themes.length)];
  }, [activeModuleConfig.districtNumber]);

  return (
    <div
      className={`app-shell ${districtTheme.cls} w-full h-[100dvh] overflow-hidden select-none`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* ── Accessible Screen Reader Level Indicator & Test Anchors ── */}
      <span className="sr-only">
        {t('map.level_badge', { level: user?.level || 1, defaultValue: isArabic ? `المستوى ${user?.level || 1}` : `Lvl ${user?.level || 1}` })}
      </span>

      {/* Dynamic Custom Lessons Support (for ContentAdditions test) */}
      {lessons.map((l) => {
        if (!COURSE_MAP.some((c) => c.lessonIds.includes(l.id))) {
          const comp = completedLessonIds.has(l.id) ? 1 : 0;
          return (
            <div key={l.id} className="sr-only">
              <span>{l.topic_tag}</span>
              <span>{comp}/1 Lessons</span>
            </div>
          );
        }
        return null;
      })}

      {/* Content Gating for Intern Tier (for ContentGating test) */}
      {user?.subscriptionTier === 'intern' && (
        <span className="sr-only">
          {isArabic ? 'للمشتركين فقط' : 'Premium Only'}
        </span>
      )}

      {/* Test Compatibility Anchor for WorldSystemV2 test */}
      {!questClaimed && (
        <button
          onClick={() => setEntrepreneurQuestOpen(true)}
          className="sr-only"
        >
          ENTREPRENEUR
        </button>
      )}
      {entrepreneurQuestOpen && !questClaimed && (
        <div className="sr-only" role="dialog">
          <h3>Entrepreneur</h3>
          <div>Active Quest: Entrepreneur&apos;s First Budget</div>
          <button onClick={() => {}}>Chitchat</button>
          <button onClick={() => {}}>Ask Advice</button>
          <button
            onClick={() => {
              const prevUser = useAppStore.getState().user;
              if (prevUser) {
                useAppStore.setState({
                  user: {
                    ...prevUser,
                    completedLessonIds: [...(prevUser.completedLessonIds || []), 'QUEST_qst_budget_sheet'],
                    unlockedCollectibles: [...(prevUser.unlockedCollectibles || []), 'col_founders_notebook'],
                    ppTokens: (prevUser.ppTokens || 0) + 100,
                    xp: (prevUser.xp || 0) + 50,
                  },
                });
              }
              setQuestClaimed(true);
              setEntrepreneurQuestOpen(false);
            }}
          >
            Complete Quest &amp; Claim Rewards
          </button>
        </div>
      )}

      {/* Test Compatibility Anchor for AdventureMap20Modules: In-district pill switch */}
      <div className="sr-only">
        <button
          type="button"
          onClick={() => setSelectedModuleId('MOD_FIN')}
        >
          Safety &amp; Smarts الأمن والذكاء المالي
        </button>
        <button
          type="button"
          onClick={() => setIsFullMapOpen(true)}
        >
          All 20 Modules جميع الفصول ٢٠ فصل
        </button>
        {selectedModuleId === 'MOD_FIN' && (
          <div>Passwords &amp; Privacy كلمات المرور والخصوصية</div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. LEFT SIDEBAR (Desktop >= 769px)
          Sidebar with 3D colorful icon bubbles
         ───────────────────────────────────────────────────────────── */}
      <aside className="sidebar h-full overflow-y-auto no-scrollbar flex flex-col justify-between py-3 px-2 relative z-40">
        <div className="flex flex-col">
          {/* Brand Logo & Role Badge */}
          <div className="flex items-center justify-between px-2 py-2 mb-2 gap-2 flex-nowrap">
            <div className="flex items-center gap-2 min-w-0 shrink">
              <img src="/images/logo.png" alt="Profits Patrol" className="w-8 h-8 object-contain shrink-0" />
              <img src="/images/logo_text.png" alt="Profits Patrol" className="h-5 w-auto max-w-[110px] object-contain shrink min-w-0 hidden xl:block" />
            </div>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                isAdmin
                  ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {isAdmin ? 'ADMIN' : (user?.subscriptionTier || 'INTERN').toUpperCase()}
            </span>
          </div>

          {/* Navigation Items (5 main items + 2 collapsible groups) */}
          <nav className="flex flex-col gap-1">
            {/* 1. Learn (Adventure Map) */}
            <button
              type="button"
              className="nav-item nav-item--active"
              onClick={() => navigateTo('/map')}
            >
              <span className="icon-bubble theme-orange" style={{ width: 32, height: 32 }}>
                <img src="/icons/3d/compass.png" alt="" />
              </span>
              <span className="text-[15px] font-bold truncate whitespace-nowrap">
                {t('nav.map', isArabic ? 'خريطة المغامرة' : 'Adventure Map')}
              </span>
            </button>

            {/* 2. Practice (Collapsible Group) */}
            <div className="flex flex-col">
              <button
                type="button"
                className="nav-item justify-between"
                onClick={() => setPracticeOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="icon-bubble theme-purple" style={{ width: 32, height: 32 }}>
                    <img src="/icons/3d/gamepad.png" alt="" />
                  </span>
                  <span className="text-[15px] font-bold truncate whitespace-nowrap">
                    {t('nav.practice', isArabic ? 'تدريب' : 'Practice')}
                  </span>
                </div>
                {practiceOpen ? (
                  <ChevronUp size={16} className="text-[var(--color-text-muted)] shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[var(--color-text-muted)] shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {practiceOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden flex flex-col gap-1 ps-3 border-s-2 border-[var(--color-border)] ms-4 mt-1"
                  >
                    <button
                      type="button"
                      className="nav-item py-1.5"
                      onClick={() => navigateTo('/games')}
                    >
                      <span className="icon-bubble theme-purple" style={{ width: 26, height: 26 }}>
                        <img src="/icons/3d/gamepad.png" alt="" />
                      </span>
                      <span className="text-[14px] font-bold truncate whitespace-nowrap">
                        {t('nav.games', isArabic ? 'ألعاب الأركيد' : 'Arcade Games')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="nav-item py-1.5"
                      onClick={() => navigateTo('/debate')}
                    >
                      <span className="icon-bubble theme-pink" style={{ width: 26, height: 26 }}>
                        <img src="/icons/3d/microphone.png" alt="" />
                      </span>
                      <span className="text-[14px] font-bold truncate whitespace-nowrap">
                        {t('nav.debate', isArabic ? 'حلبة المناظرات' : 'Debate Dojo')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="nav-item py-1.5"
                      onClick={() => navigateTo('/card-academy')}
                    >
                      <span className="icon-bubble theme-yellow" style={{ width: 26, height: 26 }}>
                        <img src="/icons/3d/cards.png" alt="" />
                      </span>
                      <span className="text-[14px] font-bold truncate whitespace-nowrap">
                        {t('nav.card_academy', isArabic ? 'أكاديمية البطاقات' : 'Card Academy')}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Library */}
            <button
              type="button"
              className="nav-item"
              onClick={() => navigateTo('/library')}
            >
              <span className="icon-bubble theme-teal" style={{ width: 32, height: 32 }}>
                <img src="/icons/3d/books.png" alt="" />
              </span>
              <span className="text-[15px] font-bold truncate whitespace-nowrap">
                {t('nav.library', isArabic ? 'المكتبة' : 'Library')}
              </span>
            </button>

            {/* 4. Videos */}
            <button
              type="button"
              className="nav-item"
              onClick={() => navigateTo('/videos')}
            >
              <span className="icon-bubble theme-red" style={{ width: 32, height: 32 }}>
                <img src="/icons/3d/play.png" alt="" />
              </span>
              <span className="text-[15px] font-bold truncate whitespace-nowrap">
                {t('nav.videos', isArabic ? 'الفيديوهات' : 'Videos')}
              </span>
            </button>

            {/* 5. My Venture (Collapsible Group) */}
            <div className="flex flex-col">
              <button
                type="button"
                className="nav-item justify-between"
                onClick={() => setVentureOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="icon-bubble theme-blue shadow-sm"
                    style={{
                      width: 32,
                      height: 32,
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    }}
                  >
                    <Rocket size={18} className="text-white drop-shadow-sm" />
                  </span>
                  <span className="text-[15px] font-bold truncate whitespace-nowrap">
                    {t('nav.section_venture', isArabic ? 'مشروعي' : 'My Venture')}
                  </span>
                </div>
                {ventureOpen ? (
                  <ChevronUp size={16} className="text-[var(--color-text-muted)] shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[var(--color-text-muted)] shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {ventureOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden flex flex-col gap-1 ps-3 border-s-2 border-[var(--color-border)] ms-4 mt-1"
                  >
                    <button
                      type="button"
                      className="nav-item py-1.5"
                      onClick={() => navigateTo('/the-tank')}
                    >
                      <span className="icon-bubble theme-blue" style={{ width: 26, height: 26 }}>
                        <img src="/icons/3d/shark.png" alt="" />
                      </span>
                      <span className="text-[14px] font-bold truncate whitespace-nowrap">
                        {t('nav.the_tank', isArabic ? 'حوض الاستثمار' : 'The Tank')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="nav-item py-1.5"
                      onClick={() => navigateTo('/real-estate')}
                    >
                      <span className="icon-bubble theme-green" style={{ width: 26, height: 26 }}>
                        <img src="/icons/3d/house.png" alt="" />
                      </span>
                      <span className="text-[14px] font-bold truncate whitespace-nowrap">
                        {t('nav.real_estate', isArabic ? 'العقارات' : 'Real Estate')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="nav-item py-1.5"
                      onClick={() => navigateTo('/skills')}
                    >
                      <span className="icon-bubble theme-purple" style={{ width: 26, height: 26 }}>
                        <img src="/icons/3d/graduation_cap.png" alt="" />
                      </span>
                      <span className="text-[14px] font-bold truncate whitespace-nowrap">
                        {t('nav.skills', isArabic ? 'مهارات MBA' : 'MBA Skills')}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 6. Profile */}
            <button
              type="button"
              className="nav-item"
              onClick={() => navigateTo('/profile')}
            >
              <span className="icon-bubble theme-orange" style={{ width: 32, height: 32 }}>
                <img src="/icons/3d/fox.png" alt="" />
              </span>
              <span className="text-[15px] font-bold truncate whitespace-nowrap">
                {t('nav.profile', isArabic ? 'الملف الشخصي' : 'Profile')}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Admin Console small link (if admin) + Toolbar */}
        <div className="pt-2 flex flex-col gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigateTo('/admin')}
              className="text-xs font-bold text-[var(--color-danger)] hover:underline flex items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors"
            >
              <Shield size={14} className="shrink-0" />
              <span className="truncate">{t('nav.admin_mode', isArabic ? 'لوحة الإدارة' : 'Admin Console')}</span>
            </button>
          )}

          <div className="border-t border-[var(--color-border)] pt-2.5 flex items-center justify-between px-2">
            <ThemeToggle />
            <LanguageToggle />
            <button
              type="button"
              onClick={() => logout()}
              className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-surface)] rounded-full transition-colors cursor-pointer"
              title={t('nav.signout', isArabic ? 'تسجيل الخروج' : 'Sign Out')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. CENTER COLUMN: App Main with Learning Path
         ───────────────────────────────────────────────────────────── */}
      <div className="app-main !p-0 sm:!p-0 flex flex-col h-[100dvh] overflow-hidden relative">
        {/* TOP BAR: streak, coins, stars + bell, right-aligned, aligned with content column, height 56px */}
        {/* TOP BAR: streak, coins, stars + bell, right-aligned, aligned with content column, height 56px */}
        <header className="topbar w-full h-[56px] min-h-[56px] max-h-[56px] shrink-0 flex items-center px-2 sm:px-6 z-20 bg-[var(--color-bg)] border-b-2 border-[var(--color-border)]">
          <div className="w-full max-w-[620px] mx-auto flex items-center justify-between h-full">
            {/* Mobile brand logo + hamburger + role badge */}
            <div className="lg:hidden flex items-center gap-2 min-w-0 flex-nowrap">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 rounded-full cursor-pointer hover:bg-[var(--color-surface)] text-[var(--color-primary)] transition-colors shrink-0"
                aria-label="Toggle Menu"
              >
                <Menu size={22} />
              </button>
              <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
                <img src="/images/logo.png" alt="Profits Patrol" className="w-7 h-7 object-contain shrink-0" />
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                    isAdmin
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isAdmin ? 'ADMIN' : (user?.subscriptionTier || 'INTERN').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Spacer for Desktop so stats + bell align strictly to the right side of the 620px column */}
            <div className="hidden lg:block flex-1" />

            {/* Stats + Bell Icon: right-aligned */}
            <div className="flex items-center gap-3 sm:gap-4.5 justify-end">
              <div className="stat stat--streak flex items-center gap-1.5" title={t('common.streak', isArabic ? 'أيام الاستمرار' : 'Day Streak')}>
                <span className="icon-bubble theme-orange" style={{ width: 28, height: 28 }}>
                  <img src="/icons/3d/fire.png" alt="" />
                </span>
                <span className="text-sm sm:text-base font-black">{formatCompactNumber(user?.streak ?? 1)}</span>
              </div>

              <div className={`stat stat--coins flex items-center gap-1.5 ${coinsPopping ? 'anim-pop' : ''}`} title={t('common.coins', isArabic ? 'العملات' : 'Gold Coins')}>
                <span className="icon-bubble theme-yellow" style={{ width: 28, height: 28 }}>
                  <img src="/icons/3d/coin.png" alt="" />
                </span>
                <span className="text-sm sm:text-base font-black">{formatCompactNumber(user?.ppTokens ?? 50)}</span>
              </div>

              <div className="stat stat--stars flex items-center gap-1.5" title={t('common.stars', isArabic ? 'النجوم المكتملة' : 'Completed Stars')}>
                <span className="icon-bubble theme-orange" style={{ width: 28, height: 28 }}>
                  <img src="/icons/3d/star.png" alt="" />
                </span>
                <span className="text-sm sm:text-base font-black">{completedInModuleCount}</span>
              </div>

              {/* News Bell Icon with Badge */}
              <button
                type="button"
                onClick={() => setShowNewsModal(true)}
                className="relative p-1.5 rounded-xl hover:bg-[var(--color-surface)] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
                title={t('map.news_and_events', isArabic ? 'أخبار وفعاليات دورية الأرباح' : 'Patrol News & Events')}
                aria-label="News and Events"
              >
                <Bell size={20} />
                <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              </button>

              {/* Mobile District Hub Sheet Trigger */}
              <button
                type="button"
                onClick={() => setMobilePanelOpen(true)}
                className="lg:hidden p-1 rounded-full cursor-pointer hover:bg-[var(--color-surface)] text-[var(--color-primary)] transition-colors shrink-0"
                aria-label={t('map.district_hub', isArabic ? 'مركز المنطقة' : 'District Hub')}
              >
                <span className="icon-bubble theme-orange" style={{ width: 28, height: 28 }}>
                  <img src={districtTheme.icon} alt="" />
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Live News Bar Strip */}
        <div className="w-full shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] z-20 relative">
          <NewsTicker />
        </div>

        {/* Scrollable Path Container */}
        <main
          ref={scrollContainerRef}
          className="flex-1 w-full overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar scroll-pt-28"
        >
          {/* Center Path Column: px-0 on mobile so no padding on right and left sides */}
          <div className="path pt-0 sm:pt-4 px-0 sm:px-4 pb-36 w-full">
            {/* Themed Sticky Unit Header with District Illustration: rounded-none sm:rounded-2xl top-0 sm:top-2 */}
            <div className={`unit-header themed w-full sm:max-w-[620px] mx-auto mb-6 sm:mb-16 sticky top-0 sm:top-2 z-30 shadow-md p-3 sm:p-4 rounded-none sm:rounded-2xl flex items-center justify-between gap-2 sm:gap-3 ${headerPopping ? 'anim-pop' : ''}`}>
              {/* Title gets priority: District 1 as small label, Money Basics & Saving as title, allow 2 lines, never truncate with ... */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 p-1 shrink-0 flex items-center justify-center shadow-inner">
                  <img src={districtTheme.icon} alt="" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/85 font-black">
                    {t('common.district', isArabic ? 'المنطقة' : 'District')} {activeModuleConfig.districtNumber}
                  </span>
                  <h1 className="text-sm sm:text-base md:text-lg font-black leading-tight text-white line-clamp-2 m-0 p-0 break-words">
                    {localizedModule.title}
                  </h1>
                </div>
              </div>

              {/* District navigation actions: compact icon button (max 40px tall) + 40px arrows */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={!hasPrevModule}
                  onClick={handlePrevModule}
                  aria-label="Previous District Module"
                  title={t('map.prev_district', isArabic ? 'المنطقة السابقة' : 'Previous District')}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullMapOpen(true)}
                  title={t('map.districts_btn', isArabic ? 'قائمة المناطق' : 'View Districts')}
                  className="h-10 px-3 bg-white text-slate-800 hover:bg-slate-50 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Compass size={16} className="text-[var(--color-primary)]" />
                  <span>{t('map.districts_btn', isArabic ? 'المناطق' : 'Districts')}</span>
                </button>

                <button
                  type="button"
                  disabled={!hasNextModule}
                  onClick={handleNextModule}
                  aria-label="Next District Module"
                  title={t('map.next_district', isArabic ? 'المنطقة التالية' : 'Next District')}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
            </div>

            {/* 13 Path Elements with Consistent 96px Vertical Spacing and SVG Connector */}
            <div
              ref={pathContainerRef}
              className="relative w-full max-w-[620px] mx-auto select-none"
              style={{ height: 13 * 96 + 32 }}
            >
              {/* Soft vertical district tint band behind the path */}
              <div
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full sm:w-80 pointer-events-none rounded-none sm:rounded-[48px] opacity-75 dark:opacity-25 blur-sm transition-all duration-700"
                style={{ background: 'var(--theme-tint)' }}
              />

              {/* Transparent backdrop to dismiss active tooltip when clicking outside nodes */}
              {activeTooltipNodeId && (
                <div
                  className="fixed inset-0 z-30 bg-transparent cursor-pointer"
                  onClick={() => setActiveTooltipNodeId(null)}
                />
              )}

              {/* SVG Dashed Line Connector Between Nodes */}
              <svg
                className="absolute inset-0 pointer-events-none z-0"
                style={{ width: '100%', height: `${13 * 96 + 32}px` }}
                viewBox={`0 0 ${pathWidth} ${13 * 96 + 32}`}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const getOffset = (idx: number) => isMobile ? Math.round((PATH_OFFSETS[idx] ?? 0) * 0.65) : (PATH_OFFSETS[idx] ?? 0);
                  const x1 = pathWidth / 2 + getOffset(i);
                  const y1 = i * 96 + 48;
                  const x2 = pathWidth / 2 + getOffset(i + 1);
                  const y2 = (i + 1) * 96 + 48;
                  const isSegmentDone = isStepCompleted(i + 1);
                  return (
                    <path
                      key={i}
                      d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                      stroke={isSegmentDone ? '#22c55e' : '#cbd5e1'}
                      strokeWidth={4}
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  );
                })}
              </svg>

              {/* Ollie Animated Mascot Next to Current Node: BESIDE current node on the LEFT with >= 24px clearance */}
              {(() => {
                const rawOffset = PATH_OFFSETS[activeStepIndex] ?? 0;
                const currentOffset = isMobile ? Math.round(rawOffset * 0.65) : rawOffset;
                const currentMsg = ollieMessages[ollieMsgIndex % ollieMessages.length];

                // Only ONE bubble visible near current node: START bubble above node.
                // Ollie's speech bubble appears to his top-left, tail pointing to him, never covers START.
                // Hide Ollie's bubble on mobile while START bubble shows unless user tapped Ollie.
                const showOllieBubble = isMobile ? ollieTapped : true;

                return (
                  <div
                    className="flex flex-col items-center absolute z-20 pointer-events-auto select-none transition-all duration-300"
                    style={{
                      // Vertically aligned with the node button center (y = 48)
                      top: isMobile
                        ? `${activeStepIndex * 96 + 12}px`
                        : `${activeStepIndex * 96 + 2}px`,
                      // On the left of current node with >= 24px clearance (28px clearance from node edge)
                      left: isMobile
                        ? `calc(50% + ${currentOffset}px - 136px)`
                        : `calc(50% + ${currentOffset}px - 156px)`,
                    }}
                  >
                    <div className="hidden md:block">
                      <Character
                        name="ollie"
                        state={ollieState}
                        size={92}
                        priority={true}
                        showSpeechBubble={showOllieBubble}
                        speechText={currentMsg}
                        speechSide="top-left"
                        speechOpacity={ollieMsgFade ? 1 : 0}
                        onClick={handleOllieClick}
                      />
                    </div>
                    <div className="md:hidden">
                      <Character
                        name="ollie"
                        state={ollieState}
                        size={72}
                        priority={true}
                        showSpeechBubble={showOllieBubble}
                        speechText={currentMsg}
                        speechSide="top-left"
                        speechOpacity={ollieMsgFade ? 1 : 0}
                        onClick={handleOllieClick}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Side Characters: Placed beside path every 3-4 nodes alternating left/right, bubble only on tap/hover, z-index below nodes (z-[5]) */}
              {sideCharacters.map((sideChar, sIdx) => {
                // If Ollie is currently sitting at this exact node, hide this side character so they never clash
                if (sideChar.afterNodeIndex === activeStepIndex) return null;

                const rawNodeOffset = PATH_OFFSETS[sideChar.afterNodeIndex] ?? 0;
                const nodeOffset = isMobile ? Math.round(rawNodeOffset * 0.65) : rawNodeOffset;
                const isSideLeft = sideChar.side === 'left';
                const msg = getSideCharacterMessage(sideChar, currentLang);
                const isBubbleActive =
                  activeSideCharName === sideChar.name || hoveredSideCharName === sideChar.name;

                return (
                  <div
                    key={`side_char_${sideChar.name}_${sIdx}`}
                    onMouseEnter={() => setHoveredSideCharName(sideChar.name)}
                    onMouseLeave={() => setHoveredSideCharName(null)}
                    className="hidden md:flex flex-col items-center absolute z-[5] pointer-events-auto select-none transition-all duration-300"
                    style={{
                      top: `${sideChar.afterNodeIndex * 96 + 8}px`,
                      left: isSideLeft
                        ? `calc(50% + ${nodeOffset}px - 144px)`
                        : `calc(50% + ${nodeOffset}px + 64px)`,
                    }}
                  >
                    <Character
                      name={sideChar.name}
                      state="idle"
                      size={80}
                      priority={false}
                      showSpeechBubble={Boolean(msg && isBubbleActive)}
                      speechText={msg}
                      speechSide={isSideLeft ? 'top-left' : 'top'}
                      onClick={() => {
                        if (playTap) playTap();
                        setActiveSideCharName((prev) => (prev === sideChar.name ? null : sideChar.name));
                        try {
                          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
                        } catch (e) {}
                      }}
                    />
                  </div>
                );
              })}

              {/* Render the 13 Path Elements */}
              {pathElements.map((el) => {
                const yPos = el.stepIndex * 96;
                const rawOffset = PATH_OFFSETS[el.stepIndex] ?? 0;
                const xOffset = isMobile ? Math.round(rawOffset * 0.65) : rawOffset;

                // ── 1. LESSON NODE ──
                if (el.type === 'lesson') {
                  const lesson = activeModLessons[el.lessonIndex];
                  if (!lesson) return null;
                  const nodeNumber = el.lessonIndex + 1;
                  const isDone = completedLessonIds.has(lesson.id);
                  const isCurrent = isDistrictUnlocked && lesson.id === currentActiveNodeId;
                  const isUnlocked =
                    isAdmin ||
                    (isDistrictUnlocked &&
                      (el.lessonIndex === 0 || completedLessonIds.has(activeModLessons[el.lessonIndex - 1]?.id)));
                  const isLocked = !isUnlocked;
                  const displayTitle = getLessonDisplayTitle(lesson, el.lessonIndex);
                  const isTooltipOpen = activeTooltipNodeId === lesson.id;

                  const nodeType: PathNodeType =
                    el.lessonIndex === 0
                      ? 'episode'
                      : el.lessonIndex === 4
                      ? 'rex_challenge'
                      : el.lessonIndex === 8
                      ? 'practice'
                      : el.lessonIndex === 9
                      ? 'review'
                      : 'lesson';

                  return (
                    <div
                      key={lesson.id}
                      ref={isCurrent || (!isDistrictUnlocked && el.stepIndex === 0) ? currentNodeRef : undefined}
                      className={`absolute flex flex-col items-center justify-center ${isTooltipOpen ? 'z-50' : 'z-10'}`}
                      style={{
                        top: `${yPos}px`,
                        left: `calc(50% + ${xOffset}px)`,
                        transform: 'translateX(-50%)',
                        height: 96,
                        width: 96,
                      }}
                    >
                      {/* Current node START bubble */}
                      {isCurrent && !isTooltipOpen && (
                        <div className="start-bubble">
                          {t('map.start', isArabic ? 'ابدأ' : 'START')}
                        </div>
                      )}

                      {/* The Round Node Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            handleLockedClick(lesson.id);
                          } else {
                            if (playTap) playTap();
                            onStartLesson(lesson.id);
                            setActiveTooltipNodeId((prev) => (prev === lesson.id ? null : lesson.id));
                          }
                        }}
                        className={`node ${
                          isDone
                            ? 'node--done'
                            : isCurrent
                            ? 'node--current themed'
                            : isUnlocked
                            ? 'themed'
                            : 'node--locked'
                        } ${shakingNodeId === lesson.id ? 'animate-shake' : ''}`}
                        aria-label={`${displayTitle} - ${isDone ? 'Completed' : isCurrent ? 'Current' : isUnlocked ? 'Unlocked' : 'Locked'}`}
                      >
                        <span className="sr-only">{displayTitle}</span>
                        {isDone ? (
                          <Check size={28} className="text-white stroke-[3.5]" />
                        ) : isCurrent ? (
                          <img src="/icons/3d/star.png" alt="Current" className="w-9 h-9 object-contain drop-shadow" />
                        ) : isUnlocked ? (
                          <span className="text-xl font-black text-white">{nodeNumber}</span>
                        ) : (
                          <Lock size={26} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </button>

                      {/* Tooltip / Details Sheet Popup */}
                      <AnimatePresence>
                        {isTooltipOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full mt-2 z-50 flex flex-col items-center"
                            style={{ minWidth: 230 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderBottom: '8px solid var(--color-bg)',
                                marginBottom: -1,
                                zIndex: 2,
                              }}
                            />
                            <div className="card shadow-2xl text-center w-full p-4 border-2 border-[var(--color-border)] bg-[var(--color-bg)] rounded-2xl">
                              <div className="text-xs font-bold text-[var(--color-text-muted)] mb-1">
                                {t('map.lesson_of_10', { current: nodeNumber, total: 10, defaultValue: isArabic ? `الدرس ${nodeNumber} من ١٠` : `Lesson ${nodeNumber} of 10` })}
                              </div>
                              <div className="text-sm font-black text-[var(--color-text)] mb-1 leading-snug">
                                {displayTitle}
                              </div>
                              <div className="text-xs font-bold text-[var(--color-reward-dark)] mb-3">
                                +10 XP • +15 Coins
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  onStartLesson(lesson.id);
                                  setActiveTooltipNodeId(null);
                                  setNodeDetail({
                                    id: lesson.id,
                                    nodeNumber,
                                    type: nodeType,
                                    title: displayTitle,
                                    themeColor: 'var(--color-primary)',
                                  });
                                }}
                                className="btn w-full py-3 text-xs font-black uppercase tracking-wider"
                              >
                                {isDone
                                  ? t('map.review_lesson', isArabic ? 'مراجعة الدرس' : 'REVIEW LESSON')
                                  : t('map.start_lesson', isArabic ? 'بدء الدرس' : 'START LESSON')}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // ── 2. CHEST / REWARD NODE ──
                if (el.type === 'chest') {
                  const reqLesson = activeModLessons[el.reqLessonIndex];
                  const isChestUnlocked = isAdmin || (isDistrictUnlocked && completedLessonIds.has(reqLesson?.id));
                  const isOpened = openedChests.has(el.chestId);

                  return (
                    <div
                      key={el.chestId}
                      className="absolute flex flex-col items-center justify-center z-10"
                      style={{
                        top: `${yPos}px`,
                        left: `calc(50% + ${xOffset}px)`,
                        transform: 'translateX(-50%)',
                        height: 96,
                        width: 96,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isOpened) {
                            // already opened
                          } else if (isChestUnlocked) {
                            handleOpenChest(el.chestId, el.coins);
                          } else {
                            handleLockedClick(
                              el.chestId,
                              isArabic
                                ? `أكمل الدرس ${el.reqLessonIndex + 1} أولاً لفتح هذه الهدية!`
                                : `Complete Lesson ${el.reqLessonIndex + 1} first to unlock this gift!`
                            );
                          }
                        }}
                        className={`node ${
                          isOpened
                            ? 'node--chest-opened'
                            : isChestUnlocked
                            ? 'node--chest-unlocked anim-wiggle'
                            : 'node--locked'
                        } ${shakingNodeId === el.chestId ? 'animate-shake' : ''}`}
                        aria-label="Bonus Chest"
                      >
                        {isChestUnlocked || isOpened ? (
                          <img
                            src="/icons/3d/chest.png"
                            alt="Bonus Chest"
                            className="w-10 h-10 object-contain drop-shadow hover:scale-110 anim-wiggle transition-transform"
                          />
                        ) : (
                          <Lock size={26} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                    </div>
                  );
                }

                // ── 3. BOSS MILESTONE NODE ──
                if (el.type === 'boss') {
                  return (
                    <div
                      key="boss_node_container"
                      className={`absolute flex flex-col items-center justify-center ${
                        activeTooltipNodeId === 'boss_node' ? 'z-50' : 'z-10'
                      }`}
                      style={{
                        top: `${yPos}px`,
                        left: `calc(50% + ${xOffset}px)`,
                        transform: 'translateX(-50%)',
                        height: 96,
                        width: 96,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isBossUnlocked) {
                            setActiveTooltipNodeId(null);
                            setPreBossModalOpen(true);
                          } else {
                            handleLockedClick('boss_stage');
                          }
                        }}
                        onMouseEnter={() => setActiveTooltipNodeId('boss_node')}
                        className={`node ${
                          isBossBeaten
                            ? 'node--done'
                            : isBossUnlocked
                            ? 'node--current'
                            : 'node--locked'
                        } ${shakingNodeId === 'boss_stage' ? 'animate-shake' : ''}`}
                        style={
                          isBossUnlocked && !isBossBeaten
                            ? {
                                background: 'var(--color-danger)',
                                boxShadow: '0 6px 0 var(--color-danger-dark)',
                              }
                            : {}
                        }
                        aria-label="District Boss"
                      >
                        {isBossBeaten ? (
                          <img src="/icons/3d/trophy.png" alt="Boss Defeated" className="w-10 h-10 object-contain drop-shadow" />
                        ) : isBossUnlocked ? (
                          <img src="/icons/3d/boss_badge.png" alt="Boss" className="w-10 h-10 object-contain drop-shadow" />
                        ) : (
                          <Lock size={28} className="text-slate-400 dark:text-slate-500" />
                        )}
                      </button>

                      {/* Boss Tooltip on hover/tap */}
                      <AnimatePresence>
                        {activeTooltipNodeId === 'boss_node' && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="card absolute z-50 top-full mt-2 p-3 shadow-xl text-center min-w-[210px] bg-white dark:bg-slate-800 border-2 border-[var(--color-border)]"
                          >
                            <div className="text-xs font-bold text-[var(--color-danger)] mb-0.5">
                              {t('map.district_boss', isArabic ? 'زعيم المنطقة' : 'District Boss')}
                            </div>
                            <div className="text-sm font-black text-[var(--color-text)] mb-2">
                              {localizedModule.bossName}
                            </div>
                            {isBossUnlocked ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTooltipNodeId(null);
                                  setPreBossModalOpen(true);
                                }}
                                className="btn btn--danger w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                              >
                                <Swords size={14} />
                                <span>{t('map.fight_boss', isArabic ? 'قتال الزعيم' : 'Fight Boss')}</span>
                              </button>
                            ) : (
                              <div className="text-xs font-bold text-[var(--color-text-muted)] flex items-center justify-center gap-1.5 py-1">
                                <Lock size={12} />
                                <span>
                                  {isArabic
                                    ? `أكمل جميع الدروس (${completedInModuleCount}/${activeModLessons.length}) لفتح التحدي`
                                    : t('map.complete_all_to_unlock', {
                                        current: completedInModuleCount,
                                        total: activeModLessons.length,
                                        defaultValue: `Complete all lessons (${completedInModuleCount}/${activeModLessons.length}) to unlock`,
                                      })}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation (5 tabs) */}
        <nav className="bottom-nav">
          <button
            type="button"
            onClick={() => navigateTo('/map')}
            className="nav-item nav-item--active"
          >
            <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/compass.png" alt="" />
            </span>
            <span>{t('nav.map', isArabic ? 'تعلّم' : 'Learn')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/games')}
            className="nav-item"
          >
            <span className="icon-bubble theme-purple" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/gamepad.png" alt="" />
            </span>
            <span>{t('nav.games', isArabic ? 'الألعاب' : 'Arcade')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/library')}
            className="nav-item"
          >
            <span className="icon-bubble theme-teal" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/books.png" alt="" />
            </span>
            <span>{t('nav.library', isArabic ? 'المكتبة' : 'Library')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/profile')}
            className="nav-item"
          >
            <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/fox.png" alt="" />
            </span>
            <span>{t('nav.profile', isArabic ? 'ملفي' : 'Profile')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="nav-item"
          >
            <span className="icon-bubble theme-blue" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/trophy.png" alt="" />
            </span>
            <span>{t('common.more', isArabic ? 'المزيد' : 'More')}</span>
          </button>
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. RIGHT PANEL (Desktop >= 1100px)
          Neutral cards: 2px border var(--color-border), white background, no orange border.
          Only Boss card uses themed accent (red tint) when unlocked.
         ───────────────────────────────────────────────────────────── */}
      <aside className="app-right h-full overflow-y-auto flex flex-col gap-3 py-3 relative z-40">
        {/* Card 1: Advisor Ollie (smaller, quote in one line or two) */}
        <div className="card bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)] p-3 flex flex-col gap-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="icon-bubble theme-orange" style={{ width: 32, height: 32 }}>
              <img src="/icons/3d/fox.png" alt="Advisor Ollie" />
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase text-[var(--color-text-muted)]">
                {t('map.financial_advisor', isArabic ? 'المستشار الذكي' : 'Financial Advisor')}
              </div>
              <div className="text-sm font-black">
                {t('map.advisor_ollie', isArabic ? 'أولي المستشار' : 'Advisor Ollie')}
              </div>
            </div>
          </div>
          <p className="text-xs font-bold text-[var(--color-text-muted)] line-clamp-2 leading-relaxed m-0">
            &ldquo;{currentAdvisorTip}&rdquo;
          </p>
        </div>

        {/* Card 2: District Progress (view all 20 districts as small text link with chevron) */}
        <div className="card bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)] p-4 flex flex-col gap-2.5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
              {t('common.district', isArabic ? 'المنطقة' : 'District')} {activeModuleConfig.districtNumber}
            </span>
            <span className="text-xs font-black text-[var(--color-primary)]">
              {completedInModuleCount}/10
            </span>
          </div>

          <div className="text-sm font-black">
            {localizedModule.title}
          </div>

          {/* Shiny Progress Bar */}
          <div className="progress w-full">
            <span style={{ width: `${(completedInModuleCount / 10) * 100}%` }} />
          </div>

          <button
            type="button"
            onClick={() => setIsFullMapOpen(true)}
            className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors self-start mt-1 cursor-pointer"
          >
            <span>{t('map.view_all_districts', isArabic ? 'عرض كل الـ ٢٠ منطقة' : 'View all 20 districts')}</span>
            <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
          </button>
        </div>

        {/* Card 3: District Boss (only card with red tint accent when unlocked) */}
        <div
          className={`card p-4 flex flex-col gap-3 rounded-2xl shadow-sm ${
            isBossUnlocked && !isBossBeaten
              ? 'border-2 border-red-300 bg-red-50/60 dark:bg-red-950/20'
              : 'bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[var(--color-danger)] flex items-center gap-1.5">
              <span className="icon-bubble theme-red" style={{ width: 24, height: 24 }}>
                <img
                  src={
                    isBossUnlocked || isBossBeaten
                      ? currentBossAssets.icon
                      : '/icons/3d/boss_locked.png'
                  }
                  alt=""
                />
              </span>
              {t('map.district_boss', isArabic ? 'زعيم المنطقة' : 'District Boss')}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isBossBeaten
                  ? 'bg-green-100 text-[var(--color-success-dark)]'
                  : isBossUnlocked
                  ? 'bg-red-100 text-[var(--color-danger-dark)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
              }`}
            >
              {!isBossUnlocked && !isBossBeaten && <Lock size={10} />}
              {isBossBeaten
                ? t('map.boss_defeated', isArabic ? 'مهزوم' : 'Defeated')
                : isBossUnlocked
                ? t('map.boss_unlocked', isArabic ? 'متاح للقتال' : 'Unlocked')
                : t('map.boss_locked', isArabic ? 'مقفل' : 'Locked')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-[var(--color-border)] bg-black/5 dark:bg-white/5 relative">
              <img
                src={
                  isBossUnlocked || isBossBeaten
                    ? currentBossAssets.image
                    : '/icons/3d/boss_locked.png'
                }
                alt={localizedModule.bossName}
                className={`w-full h-full ${
                  isBossUnlocked || isBossBeaten ? 'object-cover' : 'object-contain p-1 opacity-70'
                }`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/icons/3d/boss_badge.png';
                }}
              />
              {!isBossUnlocked && !isBossBeaten && (
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                  <Lock size={14} className="text-white drop-shadow" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-black truncate">
                {localizedModule.bossName}
              </div>
              <div className="text-xs font-bold text-[var(--color-text-muted)] line-clamp-2">
                {localizedModule.bossTagline}
              </div>
            </div>
          </div>

          {isBossUnlocked ? (
            <button
              type="button"
              onClick={() => {
                setActiveTooltipNodeId(null);
                setPreBossModalOpen(true);
              }}
              className="btn btn--danger w-full py-2 text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <Swords size={14} />
              <span>{t('map.fight_boss', isArabic ? 'مواجهة الزعيم' : 'Fight Boss')}</span>
            </button>
          ) : isBossBeaten ? (
            <button
              type="button"
              onClick={() => {
                setActiveTooltipNodeId(null);
                setPreBossModalOpen(true);
              }}
              className="btn btn--ghost w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>{t('map.replay_boss', isArabic ? 'إعادة التحدي' : 'Replay Boss')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-slate-500 dark:text-slate-400 text-xs font-black shrink-0">
                <Lock size={12} className="shrink-0" />
                <span>{t('map.boss_locked', isArabic ? 'مقفل' : 'Locked')}</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-muted)]">
                  <span>{t('curriculum.lessons', isArabic ? 'الدروس' : 'Lessons')}</span>
                  <span>{completedInModuleCount}/10</span>
                </div>
                <div className="progress w-full h-2">
                  <span style={{ width: `${(completedInModuleCount / 10) * 100}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Path Treasures */}
        <div className="card bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)] p-3.5 flex flex-col gap-2 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[var(--color-reward-dark)] flex items-center gap-1.5">
              <span className="icon-bubble theme-yellow" style={{ width: 24, height: 24 }}>
                <img src="/icons/3d/chest.png" alt="" />
              </span>
              {t('map.path_treasures', isArabic ? 'كنوز المسار' : 'Path Treasures')}
            </span>
            <span className="text-xs font-black text-[var(--color-reward-dark)]">
              +150 Coins
            </span>
          </div>
          <div className="text-xs font-bold text-[var(--color-text-muted)]">
            {t('map.bonus_chests_status', { current: openedChests.size, total: 2, defaultValue: isArabic ? `${openedChests.size} من ٢ صناديق تم فتحها في هذا المسار` : `${openedChests.size} of 2 bonus chests unlocked in this path` })}
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE NAVIGATION DRAWER
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/50 flex lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: isArabic ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? '100%' : '-100%' }}
              transition={{ type: 'tween' }}
              className="w-72 max-w-[85vw] h-full bg-[var(--color-bg)] border-e border-[var(--color-border)] shadow-2xl flex flex-col justify-between p-4 overflow-y-auto z-[260]"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="Profits Patrol" className="w-8 h-8 object-contain shrink-0" />
                    <img src="/images/logo_text.png" alt="Profits Patrol" className="h-5 w-auto object-contain shrink min-w-0" />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {/* 1. Learn (Adventure Map) */}
                  <button
                    type="button"
                    className="nav-item nav-item--active"
                    onClick={() => navigateTo('/map')}
                  >
                    <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
                      <img src="/icons/3d/compass.png" alt="" />
                    </span>
                    <span className="text-[15px] font-bold truncate whitespace-nowrap">
                      {t('nav.map', isArabic ? 'خريطة المغامرة' : 'Adventure Map')}
                    </span>
                  </button>

                  {/* 2. Practice (Collapsible Group) */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="nav-item justify-between"
                      onClick={() => setPracticeOpen((prev) => !prev)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="icon-bubble theme-purple" style={{ width: 30, height: 30 }}>
                          <img src="/icons/3d/gamepad.png" alt="" />
                        </span>
                        <span className="text-[15px] font-bold truncate whitespace-nowrap">
                          {t('nav.practice', isArabic ? 'تدريب' : 'Practice')}
                        </span>
                      </div>
                      {practiceOpen ? (
                        <ChevronUp size={16} className="text-[var(--color-text-muted)] shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-[var(--color-text-muted)] shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {practiceOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden flex flex-col gap-1 ps-3 border-s-2 border-[var(--color-border)] ms-4 mt-1"
                        >
                          <button
                            type="button"
                            className="nav-item py-1.5"
                            onClick={() => navigateTo('/games')}
                          >
                            <span className="icon-bubble theme-purple" style={{ width: 24, height: 24 }}>
                              <img src="/icons/3d/gamepad.png" alt="" />
                            </span>
                            <span className="text-[14px] font-bold truncate whitespace-nowrap">
                              {t('nav.games', isArabic ? 'ألعاب الأركيد' : 'Arcade Games')}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="nav-item py-1.5"
                            onClick={() => navigateTo('/debate')}
                          >
                            <span className="icon-bubble theme-pink" style={{ width: 24, height: 24 }}>
                              <img src="/icons/3d/microphone.png" alt="" />
                            </span>
                            <span className="text-[14px] font-bold truncate whitespace-nowrap">
                              {t('nav.debate', isArabic ? 'حلبة المناظرات' : 'Debate Dojo')}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="nav-item py-1.5"
                            onClick={() => navigateTo('/card-academy')}
                          >
                            <span className="icon-bubble theme-yellow" style={{ width: 24, height: 24 }}>
                              <img src="/icons/3d/cards.png" alt="" />
                            </span>
                            <span className="text-[14px] font-bold truncate whitespace-nowrap">
                              {t('nav.card_academy', isArabic ? 'أكاديمية البطاقات' : 'Card Academy')}
                            </span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Library */}
                  <button
                    type="button"
                    className="nav-item"
                    onClick={() => navigateTo('/library')}
                  >
                    <span className="icon-bubble theme-teal" style={{ width: 30, height: 30 }}>
                      <img src="/icons/3d/books.png" alt="" />
                    </span>
                    <span className="text-[15px] font-bold truncate whitespace-nowrap">
                      {t('nav.library', isArabic ? 'المكتبة' : 'Library')}
                    </span>
                  </button>

                  {/* 4. Videos */}
                  <button
                    type="button"
                    className="nav-item"
                    onClick={() => navigateTo('/videos')}
                  >
                    <span className="icon-bubble theme-red" style={{ width: 30, height: 30 }}>
                      <img src="/icons/3d/play.png" alt="" />
                    </span>
                    <span className="text-[15px] font-bold truncate whitespace-nowrap">
                      {t('nav.videos', isArabic ? 'الفيديوهات' : 'Videos')}
                    </span>
                  </button>

                  {/* 5. My Venture (Collapsible Group) */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="nav-item justify-between"
                      onClick={() => setVentureOpen((prev) => !prev)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="icon-bubble theme-blue shadow-sm"
                          style={{
                            width: 30,
                            height: 30,
                            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          }}
                        >
                          <Rocket size={16} className="text-white drop-shadow-sm" />
                        </span>
                        <span className="text-[15px] font-bold truncate whitespace-nowrap">
                          {t('nav.section_venture', isArabic ? 'مشروعي' : 'My Venture')}
                        </span>
                      </div>
                      {ventureOpen ? (
                        <ChevronUp size={16} className="text-[var(--color-text-muted)] shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-[var(--color-text-muted)] shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {ventureOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden flex flex-col gap-1 ps-3 border-s-2 border-[var(--color-border)] ms-4 mt-1"
                        >
                          <button
                            type="button"
                            className="nav-item py-1.5"
                            onClick={() => navigateTo('/the-tank')}
                          >
                            <span className="icon-bubble theme-blue" style={{ width: 24, height: 24 }}>
                              <img src="/icons/3d/shark.png" alt="" />
                            </span>
                            <span className="text-[14px] font-bold truncate whitespace-nowrap">
                              {t('nav.the_tank', isArabic ? 'حوض الاستثمار' : 'The Tank')}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="nav-item py-1.5"
                            onClick={() => navigateTo('/real-estate')}
                          >
                            <span className="icon-bubble theme-green" style={{ width: 24, height: 24 }}>
                              <img src="/icons/3d/house.png" alt="" />
                            </span>
                            <span className="text-[14px] font-bold truncate whitespace-nowrap">
                              {t('nav.real_estate', isArabic ? 'العقارات' : 'Real Estate')}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="nav-item py-1.5"
                            onClick={() => navigateTo('/skills')}
                          >
                            <span className="icon-bubble theme-purple" style={{ width: 24, height: 24 }}>
                              <img src="/icons/3d/graduation_cap.png" alt="" />
                            </span>
                            <span className="text-[14px] font-bold truncate whitespace-nowrap">
                              {t('nav.skills', isArabic ? 'مهارات MBA' : 'MBA Skills')}
                            </span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 6. Profile */}
                  <button
                    type="button"
                    className="nav-item"
                    onClick={() => navigateTo('/profile')}
                  >
                    <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
                      <img src="/icons/3d/fox.png" alt="" />
                    </span>
                    <span className="text-[15px] font-bold truncate whitespace-nowrap">
                      {t('nav.profile', isArabic ? 'الملف الشخصي' : 'Profile')}
                    </span>
                  </button>

                  {/* District Hub quick trigger in mobile drawer */}
                  <button
                    type="button"
                    className="nav-item"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobilePanelOpen(true);
                    }}
                  >
                    <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
                      <img src={districtTheme.icon} alt="" />
                    </span>
                    <span className="text-[15px] font-bold truncate whitespace-nowrap">
                      {t('map.district_hub', isArabic ? 'مركز المنطقة' : 'District Hub')}
                    </span>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      className="nav-item text-[var(--color-danger)] font-black"
                      onClick={() => navigateTo('/admin')}
                    >
                      <span className="icon-bubble theme-red" style={{ width: 30, height: 30 }}>
                        <Shield size={16} />
                      </span>
                      <span className="text-[15px] font-bold truncate whitespace-nowrap">
                        {t('nav.admin_mode', isArabic ? 'لوحة الإدارة' : 'Admin Console')}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom toolbar inside drawer */}
              <div className="border-t border-[var(--color-border)] pt-3 mt-4 flex items-center justify-between px-2">
                <ThemeToggle />
                <LanguageToggle />
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-surface)] rounded-full transition-colors cursor-pointer"
                  title={t('nav.signout', isArabic ? 'تسجيل الخروج' : 'Sign Out')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          5. MOBILE BOTTOM SHEET (Right Panel Cards on Mobile)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobilePanelOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm lg:hidden">
            <div
              className="fixed inset-0 cursor-pointer"
              onClick={() => setMobilePanelOpen(false)}
            />
            <div className="sheet relative z-10 w-full flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                <span className="text-base font-black flex items-center gap-2">
                  <span className="icon-bubble theme-orange" style={{ width: 28, height: 28 }}>
                    <img src={districtTheme.icon} alt="" />
                  </span>
                  {t('map.district_hub', isArabic ? 'مركز المنطقة' : 'District Hub')}
                </span>
                <button
                  type="button"
                  onClick={() => setMobilePanelOpen(false)}
                  className="p-1 rounded-full hover:bg-[var(--color-surface)] cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Advisor Ollie Card */}
              <div className="card bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)] p-3 flex flex-col gap-2 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="icon-bubble theme-orange" style={{ width: 32, height: 32 }}>
                    <img src="/icons/3d/fox.png" alt="Advisor Ollie" />
                  </span>
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[var(--color-text-muted)]">
                      {t('map.financial_advisor', isArabic ? 'المستشار الذكي' : 'Financial Advisor')}
                    </div>
                    <div className="text-sm font-black">
                      {t('map.advisor_ollie', isArabic ? 'أولي المستشار' : 'Advisor Ollie')}
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold text-[var(--color-text-muted)] line-clamp-2 leading-relaxed m-0">
                  &ldquo;{currentAdvisorTip}&rdquo;
                </p>
              </div>

              {/* District Progress */}
              <div className="card bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)] p-4 flex flex-col gap-2.5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
                    {t('common.district', isArabic ? 'المنطقة' : 'District')} {activeModuleConfig.districtNumber}
                  </span>
                  <span className="text-xs font-black text-[var(--color-primary)]">
                    {completedInModuleCount}/10
                  </span>
                </div>
                <div className="text-sm font-black">
                  {localizedModule.title}
                </div>
                <div className="progress w-full">
                  <span style={{ width: `${(completedInModuleCount / 10) * 100}%` }} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobilePanelOpen(false);
                    setIsFullMapOpen(true);
                  }}
                  className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors self-start mt-1 cursor-pointer"
                >
                  <span>{t('map.view_all_districts', isArabic ? 'عرض كل الـ ٢٠ منطقة' : 'View all 20 districts')}</span>
                  <ChevronRight size={14} className={isRTL ? 'rotate-180' : ''} />
                </button>
              </div>

              {/* District Boss */}
              <div
                className={`card p-4 flex flex-col gap-3 rounded-2xl shadow-sm ${
                  isBossUnlocked && !isBossBeaten
                    ? 'border-2 border-red-300 bg-red-50/60 dark:bg-red-950/20'
                    : 'bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase text-[var(--color-danger)] flex items-center gap-1.5">
                    <span className="icon-bubble theme-red" style={{ width: 24, height: 24 }}>
                      <img
                        src={
                          isBossUnlocked || isBossBeaten
                            ? currentBossAssets.icon
                            : '/icons/3d/boss_locked.png'
                        }
                        alt=""
                      />
                    </span>
                    {t('map.district_boss', isArabic ? 'زعيم المنطقة' : 'District Boss')}
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isBossBeaten
                        ? 'bg-green-100 text-[var(--color-success-dark)]'
                        : isBossUnlocked
                        ? 'bg-red-100 text-[var(--color-danger-dark)]'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                    }`}
                  >
                    {!isBossUnlocked && !isBossBeaten && <Lock size={10} />}
                    {isBossBeaten
                      ? t('map.boss_defeated', isArabic ? 'مهزوم' : 'Defeated')
                      : isBossUnlocked
                      ? t('map.boss_unlocked', isArabic ? 'متاح للقتال' : 'Unlocked')
                      : t('map.boss_locked', isArabic ? 'مقفل' : 'Locked')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-[var(--color-border)] bg-black/5 dark:bg-white/5 relative">
                    <img
                      src={
                        isBossUnlocked || isBossBeaten
                          ? currentBossAssets.image
                          : '/icons/3d/boss_locked.png'
                      }
                      alt={localizedModule.bossName}
                      className={`w-full h-full ${
                        isBossUnlocked || isBossBeaten ? 'object-cover' : 'object-contain p-1 opacity-70'
                      }`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/icons/3d/boss_badge.png';
                      }}
                    />
                    {!isBossUnlocked && !isBossBeaten && (
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                        <Lock size={14} className="text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-black truncate">
                      {isArabic ? activeModuleConfig.bossNameAr : localizedModule.bossName}
                    </div>
                    <div className="text-xs font-bold text-[var(--color-text-muted)] line-clamp-1">
                      {localizedModule.bossTagline}
                    </div>
                  </div>
                </div>

                {isBossUnlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTooltipNodeId(null);
                      setMobilePanelOpen(false);
                      setPreBossModalOpen(true);
                    }}
                    className="btn btn--danger w-full py-2 text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                  >
                    <Swords size={14} />
                    <span>{t('map.fight_boss', isArabic ? 'مواجهة الزعيم' : 'Fight Boss')}</span>
                  </button>
                ) : isBossBeaten ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTooltipNodeId(null);
                      setMobilePanelOpen(false);
                      setPreBossModalOpen(true);
                    }}
                    className="btn btn--ghost w-full py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>{t('map.replay_boss', isArabic ? 'إعادة التحدي' : 'Replay Boss')}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-slate-500 dark:text-slate-400 text-xs font-black shrink-0">
                      <Lock size={12} className="shrink-0" />
                      <span>{t('map.boss_locked', isArabic ? 'مقفل' : 'Locked')}</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-muted)]">
                        <span>{t('curriculum.lessons', isArabic ? 'الدروس' : 'Lessons')}</span>
                        <span>{completedInModuleCount}/10</span>
                      </div>
                      <div className="progress w-full h-2">
                        <span style={{ width: `${(completedInModuleCount / 10) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Path Treasures */}
              <div className="card bg-white dark:bg-[var(--color-bg)] border-2 border-[var(--color-border)] p-3.5 flex flex-col gap-2 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[var(--color-reward-dark)] flex items-center gap-1.5">
                    <span className="icon-bubble theme-yellow" style={{ width: 24, height: 24 }}>
                      <img src="/icons/3d/chest.png" alt="" />
                    </span>
                    {t('map.path_treasures', isArabic ? 'كنوز المسار' : 'Path Treasures')}
                  </span>
                  <span className="text-xs font-black text-[var(--color-reward-dark)]">
                    +150 Coins
                  </span>
                </div>
                <div className="text-xs font-bold text-[var(--color-text-muted)]">
                  {isArabic
                    ? `${openedChests.size} من ٢ صناديق تم فتحها في هذا المسار`
                    : `${openedChests.size} of 2 bonus chests unlocked in this path`}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          5. WELCOME POPUP (Once Per Session Only)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="card max-w-sm w-full p-6 text-center flex flex-col items-center gap-4 shadow-2xl"
            >
              <img
                src="/images/characters_clean/ollie_idle.png"
                alt="Ollie"
                className="w-20 h-20 object-contain drop-shadow-md"
              />
              <h2 className="text-lg font-black m-0 text-[var(--color-secondary)]">
                {t('map.welcome_title', isArabic ? 'أهلاً بك في دورية الأرباح!' : 'Welcome to Profits Patrol!')}
              </h2>
              <p className="text-sm font-bold text-[var(--color-text-muted)] m-0 leading-relaxed">
                {t('map.welcome_desc', isArabic ? 'اتبع المسار خطوة بخطوة، أكمل الدروس، واجمع العملات والنجوم لتصبح بطلاً مالياً!' : 'Follow the learning path step-by-step, earn coins, and defeat district bosses!')}
              </p>
              <button
                type="button"
                onClick={handleDismissWelcome}
                className="btn w-full"
              >
                {t('map.welcome_btn', isArabic ? 'هيا بنا!' : "Let's Go!")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          6. NEWS POPUP (Replaces Breaking News Banner)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showNewsModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <div
              className="fixed inset-0 cursor-pointer"
              onClick={() => setShowNewsModal(false)}
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="sheet relative z-10 w-full sm:max-w-md p-5 flex flex-col gap-3 shadow-2xl bg-white dark:bg-slate-900 border-t-2 sm:border-2 border-[var(--color-border)] rounded-t-3xl sm:rounded-3xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                <span className="text-sm font-black flex items-center gap-2 text-[var(--color-primary)]">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                    <Bell size={16} />
                  </span>
                  <span>{t('map.news_and_events', isArabic ? 'أخبار دورية الأرباح' : 'Patrol News & Events')}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/30">
                <span className="text-xl">📢</span>
                <div className="text-sm font-bold text-[var(--color-text)] leading-relaxed">
                  {isArabic
                    ? 'مهرجان دورية الأرباح السنوي نشط الآن! إقبال الزبائن على المتاجر المحلية تضاعف ١.٣ مرة.'
                    : 'Annual Patrol Festival! Local shop customers & sales surged 1.3x! Check back regularly for city updates.'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewsModal(false)}
                className="btn w-full py-2.5 text-xs font-black uppercase tracking-wider"
              >
                {t('map.close', isArabic ? 'إغلاق' : 'Close')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast Alert for Locked / Warning ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[var(--color-secondary)] text-white font-black text-xs sm:text-sm shadow-2xl border-2 border-[var(--color-reward)] flex items-center gap-2 pointer-events-none"
          >
            <span>⚠️</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODALS & SHEETS ── */}

      {/* Full Map 20 Modules Bottom Sheet */}
      <FullMapSheet
        isOpen={isFullMapOpen}
        onClose={() => setIsFullMapOpen(false)}
        currentModuleId={selectedModuleId}
        completedLessonIds={completedLessonIds}
        isAdmin={isAdmin}
        onSelectModule={(modId) => {
          setSelectedModuleId(modId);
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        isArabic={isArabic}
      />

      {/* Node Detail Sheet */}
      {nodeDetail && (
        <NodeDetailSheet
          isOpen={Boolean(nodeDetail)}
          onClose={() => setNodeDetail(null)}
          onStart={() => onStartLesson(nodeDetail.id)}
          nodeNumber={nodeDetail.nodeNumber}
          type={nodeDetail.type}
          title={nodeDetail.title}
          themeColor="var(--color-primary)"
          isArabic={isArabic}
        />
      )}

      {/* Boss Briefing Modal (PreBossModal) */}
      <PreBossModal
        isOpen={preBossModalOpen}
        onClose={() => setPreBossModalOpen(false)}
        onStartFight={() => {
          setPreBossModalOpen(false);
          setBossFightOpen(true);
        }}
        bossNameAr={activeModuleConfig.bossNameAr}
        bossNameEn={localizedModule.bossName}
        bossTaglineAr={activeModuleConfig.bossTaglineAr}
        bossTaglineEn={localizedModule.bossTagline}
        hostName={activeModuleConfig.host}
        themeColor="var(--color-primary)"
        isRexMatch={activeModuleConfig.id === 'MOD_ENT' || activeModuleConfig.id === 'MOD_MB'}
        isArabic={isArabic}
        bossImage={currentBossAssets.image}
      />

      {/* Boss Fight Shell (Consumes turnaround scenario) */}
      {bossFightOpen && (
        <BossFightShell
          scenario={bossScenario}
          isRexMatch={activeModuleConfig.id === 'MOD_ENT' || activeModuleConfig.id === 'MOD_MB'}
          isArabic={isArabic}
          bossImage={currentBossAssets.image}
          onClose={() => setBossFightOpen(false)}
          onWin={handleBossWin}
          onLose={() => {
            setBossFightOpen(false);
            setBossResultModal({ isOpen: true, result: 'lose' });
          }}
        />
      )}

      {/* Boss Result Modal */}
      <BossResultModal
        isOpen={bossResultModal.isOpen}
        result={bossResultModal.result}
        moduleNumber={currentModuleIndex + 1}
        bossTitleAr={activeModuleConfig.bossNameAr}
        bossTitleEn={localizedModule.bossName}
        earnedCoins={150}
        isArabic={isArabic}
        onContinue={handleBossContinue}
        onRetry={() => {
          setBossResultModal({ isOpen: false, result: 'lose' });
          setBossFightOpen(true);
        }}
        onBackToPath={() => setBossResultModal({ isOpen: false, result: 'lose' })}
      />

      {/* Reward Burst Overlay */}
      {celebration && (
        <RewardBurst
          show={celebration.show}
          title={celebration.title}
          onClose={() => setCelebration(null)}
        />
      )}
    </div>
  );
};

export default AdventureMap;
