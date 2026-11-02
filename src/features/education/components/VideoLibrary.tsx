import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Share2,
  Sparkles,
  Trophy,
  HelpCircle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Award,
  Flame,
  Search,
  RefreshCw,
  Camera,
  Compass,
  ListTodo,
  Film,
  Zap,
  Brain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEducationStore } from '../../../store/educationStore';
import { useAppStore } from '../../../store';
import { Video, VideoCategory } from '../../../types';
import { INITIAL_VIDEOS } from '../data/videos';
import { SoundService } from '../../../lib/sound';

export interface CharacterInfo {
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  image: string;
  glowColor: string;
  borderColor: string;
  badgeBg: string;
}

export const CHARACTER_ASSETS: Record<string, CharacterInfo> = {
  Ollie: {
    name: 'Ollie',
    nameAr: 'أولي',
    title: 'The Wise Investor',
    titleAr: 'المستثمر الحكيم',
    image: '/images/characters_clean/ollie_idle.png',
    glowColor: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/40',
    badgeBg: 'bg-amber-500 text-slate-950',
  },
  Reema: {
    name: 'Reema',
    nameAr: 'ريما',
    title: 'The Hustle Master',
    titleAr: 'رائدة الأعمال والمبيعات',
    image: '/images/characters_clean/reema_idle.png',
    glowColor: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/40',
    badgeBg: 'bg-pink-500 text-white',
  },
  Filo: {
    name: 'Filo',
    nameAr: 'فيلو',
    title: 'The Tech & Risk Guru',
    titleAr: 'خبير الحماية والمخاطر',
    image: '/images/characters_clean/filo_idle.png',
    glowColor: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500 text-white',
  },
  Kami: {
    name: 'Kami',
    nameAr: 'كامي',
    title: 'The Creative Innovator',
    titleAr: 'المبتكر التقني',
    image: '/images/characters_clean/kami_idle.png',
    glowColor: 'from-purple-500/20 to-indigo-500/20',
    borderColor: 'border-purple-500/40',
    badgeBg: 'bg-purple-500 text-white',
  },
  Rex: {
    name: 'Rex',
    nameAr: 'ريكس',
    title: 'The Empire Rival',
    titleAr: 'المنافس الطموح',
    image: '/images/characters_clean/rex_idle.png',
    glowColor: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/40',
    badgeBg: 'bg-red-500 text-white',
  },
};

export const getCharacterAsset = (speaker?: string): CharacterInfo => {
  if (!speaker) return CHARACTER_ASSETS.Ollie;
  const key = Object.keys(CHARACTER_ASSETS).find(
    (k) => k.toLowerCase() === speaker.toLowerCase()
  );
  return key ? CHARACTER_ASSETS[key] : CHARACTER_ASSETS.Ollie;
};

type LibraryTab = 'forYou' | 'explore' | 'quests' | 'aiStudio';

const VideoLibrary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const {
    videos,
    activeVideoIndex,
    watchedVideoIds,
    completedQuizVideoIds,
    likedVideoIds,
    bookmarkedVideoIds,
    submittedChallenges,
    dailyVideoMissions,
    setActiveVideoIndex,
    recordWatchCompletion,
    submitVideoQuiz,
    toggleLikeVideo,
    toggleBookmarkVideo,
    submitChallengeProof,
    claimDailyVideoMissionReward,
    addVideo,
  } = useEducationStore();

  const user = useAppStore((state) => state.user);

  // Navigation and active states
  const [activeTab, setActiveTab] = useState<LibraryTab>('forYou');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Player controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [watchProgressPercent, setWatchProgressPercent] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [showRewardToast, setShowRewardToast] = useState<{ xp: number; tokens: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [youtubeMode, setYoutubeMode] = useState(false);

  // Modals
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; xpReward: number; tokenReward: number } | null>(null);

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeNotes, setChallengeNotes] = useState('');
  const [challengePhotoPreview, setChallengePhotoPreview] = useState<string | null>(null);
  const [challengeSubmittedNotice, setChallengeSubmittedNotice] = useState(false);

  // AI Studio state
  const [studioTopic, setStudioTopic] = useState('');
  const [studioMascot, setStudioMascot] = useState<'Ollie' | 'Reema' | 'Filo' | 'Kami' | 'Rex'>('Ollie');
  const [studioDifficulty, setStudioDifficulty] = useState<'diffBeginner' | 'diffIntermediate' | 'diffAdvanced'>('diffBeginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<Video | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

  // Always enrich persisted videos with latest media assets (full posters, thumbnails)
  const enrichedVideos = React.useMemo(() => {
    return (videos.length > 0 ? videos : INITIAL_VIDEOS).map((v) => {
      const initMatch = INITIAL_VIDEOS.find((iv) => iv.id === v.id);
      return {
        ...initMatch,
        ...v,
        thumbnailUrl: v.thumbnailUrl || initMatch?.thumbnailUrl,
        fullPosterUrl: v.fullPosterUrl || initMatch?.fullPosterUrl,
      };
    });
  }, [videos]);

  const currentVideo = enrichedVideos[activeVideoIndex] || enrichedVideos[0] || (INITIAL_VIDEOS[0] as Video);

  // Helper for localized strings
  const getLocalized = useCallback((enVal?: string, arVal?: string) => {
    if (isRTL && arVal) return arVal;
    return enVal || '';
  }, [isRTL]);

  // Categories list
  const categories: Array<VideoCategory | 'All'> = [
    'All',
    'Shorts',
    'OllieExplains',
    'Challenge',
    'Parent',
    'Finance',
    'Strategy',
    'Mindset',
  ];

  // Filtered videos for Explore tab
  const filteredVideos = enrichedVideos.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const title = (v.title || '').toLowerCase();
    const titleAr = (v.titleAr || '').toLowerCase();
    const desc = (v.description || '').toLowerCase();
    const keyTerm = (v.keyTerm || '').toLowerCase();
    const matchesSearch = !q || title.includes(q) || titleAr.includes(q) || desc.includes(q) || keyTerm.includes(q);
    return matchesCategory && matchesSearch;
  });

  // Handle switching video in feed
  const handleSelectVideo = (index: number) => {
    setActiveVideoIndex(index);
    setActiveSceneIndex(0);
    setWatchProgressPercent(0);
    setIsPlaying(true);
    setQuizFeedback(null);
    setSelectedQuizAnswer(null);
    const targetVid = videos[index];
    setYoutubeMode(Boolean(!targetVid?.animationConfig && targetVid?.youtubeId));
    if (activeTab !== 'forYou') {
      setActiveTab('forYou');
    }
  };

  const handleNextVideo = useCallback(() => {
    if (activeVideoIndex < videos.length - 1) {
      handleSelectVideo(activeVideoIndex + 1);
    } else {
      handleSelectVideo(0); // Loop back to start
    }
  }, [activeVideoIndex, videos.length]);

  const handlePrevVideo = useCallback(() => {
    if (activeVideoIndex > 0) {
      handleSelectVideo(activeVideoIndex - 1);
    }
  }, [activeVideoIndex]);

  // Touch swipe support for vertical shorts feed on mobile & tablets
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchEndY.current === null) return;
    const distance = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped UP -> Next video
      handleNextVideo();
    } else if (distance < -minSwipeDistance) {
      // Swiped DOWN -> Previous video
      handlePrevVideo();
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  // Keyboard navigation for Shorts feed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'forYou' || showQuizModal || showChallengeModal) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleNextVideo, handlePrevVideo, showQuizModal, showChallengeModal]);

  // Scene-based Animation Timer for Shorts
  useEffect(() => {
    if (activeTab !== 'forYou' || !isPlaying || youtubeMode) return;

    const scenes = currentVideo?.animationConfig?.scenes || [];
    if (scenes.length === 0) return;

    const totalDurationSeconds = scenes.reduce((acc, s) => acc + (s.durationSeconds || 7), 0);
    const intervalTimeMs = 100;
    const progressStep = (intervalTimeMs / (totalDurationSeconds * 1000)) * 100;

    const timer = setInterval(() => {
      setWatchProgressPercent((prev) => {
        const next = prev + progressStep;

        // Calculate active scene
        const currentElapsedSeconds = (next / 100) * totalDurationSeconds;
        let cumulative = 0;
        let targetSceneIndex = 0;
        for (let i = 0; i < scenes.length; i++) {
          cumulative += scenes[i].durationSeconds || 7;
          if (currentElapsedSeconds <= cumulative) {
            targetSceneIndex = i;
            break;
          }
        }
        setActiveSceneIndex(targetSceneIndex);

        // Check if sound effect should play for this scene
        const scene = scenes[targetSceneIndex];
        if (scene?.soundEffect && !isMuted && user?.settings?.soundEnabled) {
          if (Math.floor(next) % 20 === 0) {
            if (scene.soundEffect === 'coin') SoundService.playCoin();
            else if (scene.soundEffect === 'success') SoundService.playSuccess();
          }
        }

        // Trigger 90% watch reward
        if (prev < 90 && next >= 90) {
          const reward = recordWatchCompletion(currentVideo.id);
          if (reward && reward.xp > 0) {
            setShowRewardToast(reward);
            setTimeout(() => setShowRewardToast(null), 4000);
          }
        }

        // Finished video
        if (next >= 100) {
          if (autoPlayNext) {
            handleNextVideo();
          } else {
            setIsPlaying(false);
          }
          return 100;
        }

        return next;
      });
    }, intervalTimeMs);

    return () => clearInterval(timer);
  }, [
    activeTab,
    isPlaying,
    youtubeMode,
    currentVideo,
    autoPlayNext,
    handleNextVideo,
    isMuted,
    user?.settings?.soundEnabled,
    recordWatchCompletion,
  ]);

  // Handle Quiz Submission
  const handleCheckQuizAnswer = () => {
    if (selectedQuizAnswer === null || !currentVideo.quiz) return;
    const res = submitVideoQuiz(currentVideo.id, selectedQuizAnswer);
    setQuizFeedback(res);
  };

  // Handle Challenge Proof Submission
  const handleSubmitChallenge = () => {
    if (!currentVideo.challenge) return;
    submitChallengeProof(
      currentVideo.id,
      challengeNotes || 'Completed the real-world action challenge!',
      challengePhotoPreview || undefined
    );
    setChallengeSubmittedNotice(true);
    setTimeout(() => {
      setChallengeSubmittedNotice(false);
      setShowChallengeModal(false);
      setChallengeNotes('');
      setChallengePhotoPreview(null);
    }, 2500);
  };

  // Copy shareable link
  const handleShareVideo = () => {
    SoundService.playClick();
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // AI Studio Generation Mock Pipeline
  const handleGenerateAIShort = () => {
    if (!studioTopic.trim()) return;
    setIsGenerating(true);
    SoundService.playClick();

    setTimeout(() => {
      const topicName = studioTopic.trim();
      const generatedId = `vid_ai_${Date.now()}`;
      const charInfo = getCharacterAsset(studioMascot);
      const newShort: Video = {
        id: generatedId,
        title: `AI Explains: ${topicName}`,
        titleAr: `الذكاء الاصطناعي يشرح: ${topicName}`,
        description: `An AI-generated interactive mini-lesson breaking down "${topicName}" with playful visual analogies.`,
        descriptionAr: `درس مصغر بالذكاء الاصطناعي يفكك موضوع "${topicName}" بأمثلة بصرية مرحة.`,
        category: 'Shorts',
        duration: '0:35',
        aspectRatio: '9:16',
        speaker: studioMascot,
        speakerAvatar: charInfo.image,
        keyTerm: topicName.slice(0, 24),
        keyTermAr: topicName.slice(0, 24),
        likesCount: 1,
        viewsCount: 1,
        tags: ['ai-generated', 'custom', 'shorts'],
        animationConfig: {
          themeColor: charInfo.glowColor,
          bgGradient: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950',
          scenes: [
            {
              sceneId: 1,
              durationSeconds: 7,
              caption: `Welcome! Today ${studioMascot} is revealing the superpower of: ${topicName}! 🌟`,
              captionAr: `مرحباً! اليوم يكشف ${studioMascot} السر وراء: ${topicName}! 🌟`,
              mascotMood: 'excited',
              visualEmoji: '🚀',
              visualType: 'store',
            },
            {
              sceneId: 2,
              durationSeconds: 8,
              caption: 'Every great entrepreneur starts by spotting a problem and turning it into a smart solution! 💡',
              captionAr: 'كل رائد أعمال عظيم يبدأ باكتشاف مشكلة وتحويلها إلى حل ذكي ومربح! 💡',
              mascotMood: 'explaining',
              visualEmoji: '💡',
              visualType: 'chart',
            },
            {
              sceneId: 3,
              durationSeconds: 8,
              caption: 'When you test, learn, and deliver true value, customer loyalty and profits follow! 🪙✨',
              captionAr: 'عندما تقدم قيمة حقيقية، تأتيك ثقة الزبائن وتتضاعف الأرباح! 🪙✨',
              mascotMood: 'celebrating',
              visualEmoji: '💰',
              visualType: 'coins',
              soundEffect: 'coin',
            },
            {
              sceneId: 4,
              durationSeconds: 8,
              caption: 'Now go take action and lead your empire like a true CEO! 🏆',
              captionAr: 'انطلق الآن واقضِ على التردد وقم بقيادة إمبراطوريتك كقائد حقيقي! 🏆',
              mascotMood: 'happy',
              visualEmoji: '👑',
              visualType: 'trophy',
              soundEffect: 'success',
            },
          ],
        },
        quiz: {
          question: `What is the key takeaway about "${topicName}"?`,
          questionAr: `ما هي العبرة الأساسية من درس "${topicName}"؟`,
          options: [
            'Solving real customer problems creates lasting business value',
            'Waiting for miracles without testing ideas',
            'Giving up after the first small obstacle',
            'Hiding profits in an unreachable basement',
          ],
          optionsAr: [
            'حل مشكلات الزبائن الحقيقية يصنع قيمة مستدامة وأرباحاً متنامية',
            'انتظار المعجزات دون اختبار أي فكرة',
            'الاستسلام فور مواجهة أول عقبة صغيرة',
            'إخفاء الأرباح تحت الأرض',
          ],
          correctIndex: 0,
          explanation: 'Value creation and problem solving form the bedrock of sustainable entrepreneurship.',
          explanationAr: 'خلق القيمة وحل المشكلات هما جوهر ريادة الأعمال المستدامة.',
          xpReward: 20,
          tokenReward: 15,
        },
      };

      setGeneratedVideo(newShort);
      setIsGenerating(false);
      SoundService.playSuccess();
    }, 1800);
  };

  const handlePublishGeneratedShort = () => {
    if (!generatedVideo) return;
    addVideo(generatedVideo);
    SoundService.playLevelUp();
    handleSelectVideo(videos.length);
  };

  // Verification state checks
  const isVideoWatched = watchedVideoIds.includes(currentVideo.id);
  const isVideoLiked = likedVideoIds.includes(currentVideo.id);
  const isVideoBookmarked = bookmarkedVideoIds.includes(currentVideo.id);
  const isQuizPassed = completedQuizVideoIds.includes(currentVideo.id);

  // Active scene & Mascot asset
  const scenes = currentVideo?.animationConfig?.scenes || [];
  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const charAsset = getCharacterAsset(currentVideo?.speaker);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-24 md:pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-amber-200/70 dark:border-slate-800 px-4 py-3 transition-colors shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-[0_4px_0_#b45309]">
                <Play className="fill-white ms-0.5" size={20} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  {t('videos.title')}
                  <span className="text-xs uppercase bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-black px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/80 shadow-sm">
                    Live Shorts
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:block">{t('videos.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Mode Tabs (Gamified App DNA Segmented Control) */}
          <nav className="bg-amber-100/70 dark:bg-slate-950/90 p-1.5 rounded-2xl border-2 border-amber-200/90 dark:border-slate-800 shadow-inner flex items-center gap-1.5 overflow-x-auto max-w-full justify-center">
            {[
              { id: 'forYou' as const, label: t('videos.tabs.forYou'), icon: Film },
              { id: 'explore' as const, label: t('videos.tabs.explore'), icon: Compass },
              { id: 'quests' as const, label: t('videos.tabs.quests'), icon: Trophy },
              { id: 'aiStudio' as const, label: t('videos.tabs.aiStudio'), icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    SoundService.playClick();
                  }}
                  className={`btn-juicy flex items-center gap-1.5 md:gap-2 py-2 md:py-2.5 px-3 md:px-4 rounded-xl text-xs md:text-sm font-black whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_4px_0_#b45309] scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-[0_2px_0_transparent]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-amber-100' : 'text-slate-400 dark:text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* TAB 1: FOR YOU (TIKTOK / REELS VERTICAL SHORTS FEED) */}
        {activeTab === 'forYou' && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 min-h-[calc(100vh-170px)]">
            {/* Feed Navigation Chevrons for Desktop */}
            <div className="hidden lg:flex flex-col gap-4">
              <button
                onClick={handlePrevVideo}
                disabled={activeVideoIndex === 0}
                className={`p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all ${
                  activeVideoIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                    : 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110 shadow-lg'
                }`}
                title={t('videos.feed.previous')}
              >
                <ChevronUp size={28} />
              </button>
              <div className="text-center font-mono text-xs text-slate-500 font-bold">
                {activeVideoIndex + 1} / {videos.length}
              </div>
              <button
                onClick={handleNextVideo}
                className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110 transition-all shadow-lg"
                title={t('videos.feed.next')}
              >
                <ChevronDown size={28} />
              </button>
            </div>

            {/* Vertical Video Frame (9:16 Aspect Ratio) - Taller Modern Flagship Container */}
            <div
              ref={feedRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[400px] h-[720px] md:h-[780px] lg:h-[820px] bg-slate-900 rounded-[44px] overflow-hidden shadow-2xl border-[5px] border-slate-300 dark:border-slate-800 flex flex-col justify-between select-none touch-pan-y"
            >
              {/* Segmented Top Progress Indicators */}
              <div className="absolute top-3 inset-x-3 z-30 flex gap-1">
                {scenes.length > 0 ? (
                  scenes.map((s, idx) => (
                    <div
                      key={s.sceneId}
                      className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                    >
                      <div
                        className="h-full bg-white transition-all duration-150 rounded-full"
                        style={{
                          width:
                            idx < activeSceneIndex
                              ? '100%'
                              : idx === activeSceneIndex
                              ? `${((watchProgressPercent % (100 / scenes.length)) / (100 / scenes.length)) * 100}%`
                              : '0%',
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-150"
                      style={{ width: `${watchProgressPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Top Controls Overlay */}
              <div className="absolute top-7 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/50 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  {t(`videos.categories.${currentVideo.category}`, currentVideo.category)}
                </span>

                <div className="flex items-center gap-2">
                  {/* YouTube switch if available */}
                  {currentVideo.youtubeId && (
                    <button
                      onClick={() => setYoutubeMode(!youtubeMode)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                        youtubeMode
                          ? 'bg-red-600 text-white border-red-500 shadow-md'
                          : 'bg-black/50 text-slate-300 border-white/20 hover:text-white'
                      }`}
                    >
                      {youtubeMode ? t('videos.feed.modeAnimated') : t('videos.feed.modeYoutube')}
                    </button>
                  )}

                  {/* Sound Toggle */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      SoundService.playClick();
                    }}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/70 transition-colors"
                    title={t('videos.feed.toggleAudio')}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                </div>
              </div>

              {/* Video Body Content: Animation Canvas vs YouTube Embed */}
              {(youtubeMode || (!currentVideo.animationConfig && currentVideo.youtubeId)) && currentVideo.youtubeId ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className={`w-full h-full flex flex-col justify-between p-6 relative overflow-hidden select-none ${
                    currentVideo.animationConfig?.bgGradient || 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950'
                  }`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {/* Full-bleed Vertical 9:16 Scene Artwork */}
                  {(currentVideo.fullPosterUrl || currentVideo.thumbnailUrl) ? (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                      <img
                        src={currentVideo.fullPosterUrl || currentVideo.thumbnailUrl}
                        alt={currentVideo.title}
                        className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out select-none ${
                          isPlaying ? 'scale-105' : 'scale-100'
                        }`}
                      />
                      {/* High-end cinematic gradient overlays for pristine readability of HUD, controls & captions */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/10 via-35% to-black/90 pointer-events-none" />
                      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                    </div>
                  ) : (
                    <>
                      {/* Ambient background glow elements */}
                      <div className="absolute top-1/4 -start-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-1/3 -end-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    </>
                  )}

                  {/* Center Stage: Play/Pause Indicator and Fallback Avatar */}
                  <div className="my-auto flex flex-col items-center justify-center text-center relative z-10 py-6 w-full pointer-events-none">
                    {/* Fallback Mascot Avatar if no full poster exists */}
                    {!(currentVideo.fullPosterUrl || currentVideo.thumbnailUrl) && (
                      <motion.div
                        animate={{
                          y: isPlaying ? [0, -12, 0] : 0,
                          scale: isPlaying ? [1, 1.04, 1] : 1,
                        }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                        className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-white/10 to-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl relative mb-6 p-2"
                      >
                        <img
                          src={charAsset.image}
                          alt={charAsset.name}
                          className="w-full h-full object-contain filter drop-shadow-xl select-none"
                        />

                        {/* Mascot badge */}
                        <div className={`absolute -bottom-2.5 px-3 py-0.5 rounded-full ${charAsset.badgeBg} text-[11px] font-black uppercase tracking-wider shadow-md border border-white/20 whitespace-nowrap`}>
                          {isRTL ? charAsset.nameAr : charAsset.name}
                        </div>
                      </motion.div>
                    )}

                    {/* Play/Pause indicator icon when paused */}
                    {!isPlaying && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full bg-black/65 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-2xl pointer-events-none z-20"
                      >
                        <Play size={28} className="fill-white ms-1" />
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Right Rails Action Column (TikTok/Reels style) */}
              <div className="absolute end-2.5 bottom-16 z-30 flex flex-col items-center gap-2.5 pointer-events-auto">
                {/* Host profile circle */}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center p-0.5">
                      <img
                        src={charAsset.image}
                        alt={charAsset.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  {isVideoWatched && (
                    <div className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black border-2 border-slate-900 shadow">
                      ✓
                    </div>
                  )}
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLikeVideo(currentVideo.id)}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <motion.div
                    whileTap={{ scale: 1.4 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-md ${
                      isVideoLiked
                        ? 'bg-rose-500/25 border border-rose-500/50 text-rose-500'
                        : 'bg-black/55 border border-white/20 text-white group-hover:bg-black/75'
                    }`}
                  >
                    <Heart
                      size={18}
                      className={isVideoLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}
                    />
                  </motion.div>
                  <span className="text-[10px] font-bold text-white drop-shadow">
                    {(currentVideo.likesCount || 0) + (isVideoLiked ? 1 : 0)}
                  </span>
                </button>

                {/* Quiz Button */}
                {currentVideo.quiz && (
                  <button
                    onClick={() => {
                      SoundService.playClick();
                      setShowQuizModal(true);
                    }}
                    className="flex flex-col items-center gap-0.5 group"
                  >
                    <motion.div
                      whileTap={{ scale: 1.2 }}
                      animate={!isQuizPassed ? { scale: [1, 1.08, 1] } : undefined}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md ${
                        isQuizPassed
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                          : 'bg-indigo-600 text-white border border-indigo-400 shadow-indigo-500/30'
                      }`}
                    >
                      {isQuizPassed ? <CheckCircle size={18} /> : <HelpCircle size={18} />}
                    </motion.div>
                    <span className="text-[9px] font-black text-amber-300 drop-shadow uppercase whitespace-nowrap">
                      {isQuizPassed ? '✓ ' + t('videos.quiz.completedBadge') : t('videos.feed.quizBtn')}
                    </span>
                  </button>
                )}

                {/* Challenge Action Button */}
                {currentVideo.challenge && (
                  <button
                    onClick={() => {
                      SoundService.playClick();
                      setShowChallengeModal(true);
                    }}
                    className="flex flex-col items-center gap-0.5 group"
                  >
                    <motion.div
                      whileTap={{ scale: 1.2 }}
                      animate={{ rotate: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300"
                    >
                      <Trophy size={18} />
                    </motion.div>
                    <span className="text-[9px] font-black text-amber-400 drop-shadow uppercase whitespace-nowrap">
                      {t('videos.feed.challengeBtn')}
                    </span>
                  </button>
                )}

                {/* Bookmark / Save */}
                <button
                  onClick={() => toggleBookmarkVideo(currentVideo.id)}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <motion.div
                    whileTap={{ scale: 1.3 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-md ${
                      isVideoBookmarked
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                        : 'bg-black/55 border border-white/20 text-white group-hover:bg-black/75'
                    }`}
                  >
                    <Bookmark
                      size={18}
                      className={isVideoBookmarked ? 'fill-amber-400 text-amber-400' : 'text-white'}
                    />
                  </motion.div>
                  <span className="text-[9px] font-bold text-white drop-shadow">
                    {isVideoBookmarked ? t('videos.feed.saved') : t('videos.feed.save')}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShareVideo}
                  className="flex flex-col items-center gap-0.5 group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/55 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/75 transition-colors shadow-md">
                    <Share2 size={16} />
                  </div>
                  <span className="text-[9px] font-bold text-white drop-shadow">
                    {copiedLink ? t('videos.feed.copiedLink') : t('videos.feed.share')}
                  </span>
                </button>
              </div>

              {/* Bottom Video Metadata & Scene Subtitles Column (Safe Slim Zone: start-3.5 with max-w-[220px]) */}
              <div className="absolute bottom-4 start-3.5 max-w-[215px] sm:max-w-[230px] z-30 pointer-events-none flex flex-col gap-2">
                {/* Animated Scene Caption Box (Dynamic Subtitles) */}
                <AnimatePresence mode="wait">
                  {currentScene && (
                    <motion.div
                      key={currentScene?.sceneId || activeSceneIndex}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className="bg-black/85 backdrop-blur-xl border border-white/25 p-2.5 rounded-2xl shadow-2xl pointer-events-auto"
                    >
                      <p className="text-[11px] md:text-xs font-black leading-snug text-white tracking-wide drop-shadow-md line-clamp-3">
                        {getLocalized(currentScene?.caption, currentScene?.captionAr)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video Info Details */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                      <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={charAsset.image}
                          alt={charAsset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-amber-300 font-extrabold text-[11px] drop-shadow">
                        {isRTL ? charAsset.nameAr : charAsset.name}
                      </span>
                    </div>
                    {currentVideo.keyTerm && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white border border-white/30">
                        💡 {getLocalized(currentVideo.keyTerm, currentVideo.keyTermAr)}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xs md:text-sm font-black text-white leading-tight drop-shadow-md line-clamp-1">
                    {getLocalized(currentVideo.title, currentVideo.titleAr)}
                  </h2>

                  <p className="text-[10px] text-slate-300 drop-shadow line-clamp-1 leading-snug">
                    {getLocalized(currentVideo.description, currentVideo.descriptionAr)}
                  </p>
                </div>
              </div>

              {/* Rewarded Notification Toast */}
              <AnimatePresence>
                {showRewardToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="absolute top-16 inset-x-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-400"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles size={18} className="text-amber-300" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-emerald-200">
                          {t('videos.feed.rewardClaimed')}
                        </div>
                        <div className="text-sm font-black">
                          +{showRewardToast.xp} XP & +{showRewardToast.tokens} PP Tokens!
                        </div>
                      </div>
                    </div>
                    <CheckCircle size={20} className="text-emerald-200" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Swipe / Next / Prev Bar below player */}
            <div className="flex lg:hidden items-center justify-between gap-4 w-full max-w-[390px]">
              <button
                onClick={handlePrevVideo}
                disabled={activeVideoIndex === 0}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-black flex items-center justify-center gap-1.5 disabled:opacity-30"
              >
                <ChevronUp size={16} />
                <span>{t('videos.feed.previous')}</span>
              </button>

              <div className="text-xs font-mono text-slate-400 font-bold">
                {activeVideoIndex + 1} / {videos.length}
              </div>

              <button
                onClick={handleNextVideo}
                className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-black flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>{t('videos.feed.next')}</span>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Side Card: Current Episode Overview & Quick Actions */}
            <div className="w-full max-w-sm hidden xl:flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                    {t('videos.feed.keyConcept')}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                    ⏱️ {currentVideo.duration}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  {getLocalized(currentVideo.title, currentVideo.titleAr)}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {getLocalized(currentVideo.description, currentVideo.descriptionAr)}
                </p>

                {/* Watch Reward Status */}
                <div
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-black ${
                    isVideoWatched
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award size={18} />
                    <span>{isVideoWatched ? t('videos.feed.rewardClaimed') : t('videos.feed.watchRewardAlert')}</span>
                  </div>
                  <span>{isVideoWatched ? '✓ +10 XP' : '90%'}</span>
                </div>
              </div>

              {/* Up Next Preview list */}
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                    {isRTL ? 'المقاطع القادمة' : 'Up Next'}
                  </h4>
                  <button
                    onClick={() => setAutoPlayNext(!autoPlayNext)}
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      autoPlayNext
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t('videos.feed.autoPlay')}: {autoPlayNext ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pe-1">
                  {enrichedVideos.map((vid, idx) => {
                    const isActive = idx === activeVideoIndex;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => handleSelectVideo(idx)}
                        className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border-2 ${
                          isActive
                            ? 'bg-amber-500/15 border-amber-500/60 text-amber-900 dark:text-amber-200 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <div className="w-10 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-300 dark:border-slate-700/80 relative shadow-sm">
                          {vid.thumbnailUrl ? (
                            <img
                              src={vid.thumbnailUrl}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={getCharacterAsset(vid.speaker).image}
                              alt={vid.speaker || 'Mascot'}
                              className="w-full h-full object-contain p-0.5"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {getLocalized(vid.title, vid.titleAr)}
                          </p>
                          <span className="text-[10px] text-slate-500">{vid.duration}</span>
                        </div>
                        {watchedVideoIds.includes(vid.id) && (
                          <Check size={14} className="text-emerald-500 dark:text-emerald-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPLORE ALL GRID */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* Search and Category Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      SoundService.playClick();
                    }}
                    className={`btn-juicy px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_0_#b45309]'
                        : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-[0_3px_0_#e2e8f0] dark:shadow-[0_3px_0_#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t(`videos.categories.${cat}`, cat)}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute top-3.5 start-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'بحث في الفيديوهات...' : 'Search shorts & lessons...'}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 ps-9 pe-4 text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-sm font-bold"
                />
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((vid, idx) => {
                const isWatched = watchedVideoIds.includes(vid.id);
                const isLiked = likedVideoIds.includes(vid.id);
                const isBookmarked = bookmarkedVideoIds.includes(vid.id);
                const originalIndex = videos.findIndex((v) => v.id === vid.id);

                return (
                  <motion.div
                    key={vid.id}
                    whileHover={{ y: -4 }}
                    className="card-juicy bg-white dark:bg-slate-900 group overflow-hidden !p-0 transition-all duration-200 border-3 border-amber-100 dark:border-slate-800 shadow-[0_6px_0_#f1f5f9] dark:shadow-[0_6px_0_#0f172a] hover:scale-[1.01] flex flex-col justify-between cursor-pointer rounded-3xl"
                    onClick={() => handleSelectVideo(originalIndex >= 0 ? originalIndex : idx)}
                  >
                    <div>
                      {/* Video Thumbnail Banner */}
                      <div className="aspect-video bg-slate-950 relative overflow-hidden">
                        {vid.thumbnailUrl || vid.youtubeId ? (
                          <img
                            src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`w-full h-full ${vid.animationConfig?.bgGradient || 'bg-gradient-to-tr from-indigo-950 to-slate-900'} flex items-center justify-center p-4`}>
                            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20 shadow-xl">
                              <img
                                src={getCharacterAsset(vid.speaker).image}
                                alt={vid.speaker || 'Character'}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
                            <Play className="fill-white ms-0.5" size={20} />
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-3 start-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-white/20">
                            {t(`videos.categories.${vid.category}`, vid.category)}
                          </span>
                        </div>

                        {/* Duration Pill */}
                        <div className="absolute bottom-3 end-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-xs font-mono font-bold">
                          {vid.duration}
                        </div>

                        {/* Watched Mark */}
                        {isWatched && (
                          <div className="absolute top-3 end-3 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black flex items-center gap-1 shadow">
                            <Check size={12} />
                            <span>{isRTL ? 'تمت المشاهدة' : 'Watched'}</span>
                          </div>
                        )}
                      </div>

                      {/* Video Info Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <img
                                src={getCharacterAsset(vid.speaker).image}
                                alt={vid.speaker || 'Host'}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {isRTL ? getCharacterAsset(vid.speaker).nameAr : getCharacterAsset(vid.speaker).name}
                            </span>
                          </div>
                          {vid.keyTerm && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              💡 {getLocalized(vid.keyTerm, vid.keyTermAr)}
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-amber-500 transition-colors line-clamp-2">
                          {getLocalized(vid.title, vid.titleAr)}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {getLocalized(vid.description, vid.descriptionAr)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & Badges */}
                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                          {vid.likesCount || 0}
                        </span>
                        {vid.quiz && (
                          <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-bold">
                            <HelpCircle size={14} />
                            {isRTL ? 'اختبار' : 'Quiz'}
                          </span>
                        )}
                        {vid.challenge && (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                            <Trophy size={14} />
                            {isRTL ? 'تحدي' : 'Challenge'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkVideo(vid.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                        }`}
                      >
                        <Bookmark size={16} className={isBookmarked ? 'fill-amber-500' : ''} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DAILY VIDEO QUESTS & STATS */}
        {activeTab === 'quests' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Daily Chest Card (Profits Patrol Gamified Theme) */}
            <div className="relative overflow-hidden rounded-[32px] p-6 md:p-8 border-4 border-amber-300 dark:border-amber-500/40 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white shadow-[0_10px_0_#b45309] dark:shadow-[0_10px_0_#0f172a] transition-all">
              {/* Ambient radial glows */}
              <div className="absolute -top-16 -end-16 w-64 h-64 bg-yellow-300/25 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -start-16 w-64 h-64 bg-orange-600/25 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-start w-full md:w-auto">
                  {/* 3D Chest Graphic */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-2 border-2 border-white/40 dark:border-white/20 shadow-xl flex items-center justify-center">
                    <img
                      src="/icons/3d/chest.png"
                      alt="Daily Mystery Chest"
                      className="w-full h-full object-contain filter drop-shadow-md animate-bounce"
                      style={{ animationDuration: '3s' }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-yellow-100 dark:text-amber-400 font-black text-xs uppercase tracking-wider mb-1">
                      <Sparkles size={16} />
                      <span>{t('videos.quests.title')}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5 drop-shadow-sm">
                      {t('videos.quests.subtitle')}
                    </h2>
                    <p className="text-amber-50 dark:text-slate-300 text-xs md:text-sm max-w-xl font-bold leading-relaxed">
                      {isRTL
                        ? 'شاهد على الأقل مقطعين تعليميين كاملين وأجب عن اختبار واحد لتحصل على مكافأة الصندوق اليومي (+50 XP و +30 عملة)!'
                        : 'Watch at least 2 full learning shorts and pass 1 video quiz today to unlock the daily mystery chest!'}
                    </p>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => claimDailyVideoMissionReward()}
                  disabled={
                    dailyVideoMissions.watchedCount < 2 ||
                    dailyVideoMissions.quizzesCount < 1 ||
                    dailyVideoMissions.claimedReward
                  }
                  className={`btn-juicy px-6 py-4 rounded-2xl text-sm md:text-base font-black transition-all flex items-center gap-2.5 whitespace-nowrap ${
                    dailyVideoMissions.claimedReward
                      ? 'bg-emerald-500 text-white shadow-[0_5px_0_#047857] cursor-default'
                      : dailyVideoMissions.watchedCount >= 2 && dailyVideoMissions.quizzesCount >= 1
                      ? 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-amber-950 shadow-[0_5px_0_#b45309] hover:scale-105 active:translate-y-1 active:shadow-none animate-pulse'
                      : 'bg-amber-600/40 text-amber-100 border-2 border-amber-300/40 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 shadow-[0_3px_0_rgba(0,0,0,0.15)] cursor-not-allowed'
                  }`}
                >
                  <Trophy size={20} className={dailyVideoMissions.claimedReward ? 'text-white' : 'text-amber-950 dark:text-amber-300'} />
                  <span>
                    {dailyVideoMissions.claimedReward
                      ? t('videos.quests.bonusClaimed')
                      : t('videos.quests.claimBonus')}
                  </span>
                </button>
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20 dark:border-white/10 relative z-10">
                <div className="bg-black/15 dark:bg-black/30 p-3.5 rounded-2xl border border-white/20 dark:border-white/10">
                  <div className="flex justify-between items-center text-xs font-black text-white mb-2">
                    <span className="flex items-center gap-1.5">
                      <Film size={14} className="text-yellow-200" />
                      {t('videos.quests.watchGoal', { current: Math.min(2, dailyVideoMissions.watchedCount) })}
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-mono font-black">
                      {Math.min(100, Math.round((dailyVideoMissions.watchedCount / 2) * 100))}%
                    </span>
                  </div>
                  <div className="h-4 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/25">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-300 shadow-inner"
                      style={{ width: `${Math.min(100, (dailyVideoMissions.watchedCount / 2) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-black/15 dark:bg-black/30 p-3.5 rounded-2xl border border-white/20 dark:border-white/10">
                  <div className="flex justify-between items-center text-xs font-black text-white mb-2">
                    <span className="flex items-center gap-1.5">
                      <Brain size={14} className="text-yellow-200" />
                      {t('videos.quests.quizGoal', { current: Math.min(1, dailyVideoMissions.quizzesCount) })}
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-mono font-black">
                      {Math.min(100, Math.round((dailyVideoMissions.quizzesCount / 1) * 100))}%
                    </span>
                  </div>
                  <div className="h-4 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/25">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full transition-all duration-300 shadow-inner"
                      style={{ width: `${Math.min(100, (dailyVideoMissions.quizzesCount / 1) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lifetime Video Stats Grid (Gamified App DNA 3D Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" dir={isRTL ? "rtl" : "ltr"}>
              {/* Card 1: Watched Shorts */}
              <div className="card-juicy bg-white dark:bg-slate-900 border-3 border-rose-200 dark:border-rose-900/60 p-5 rounded-3xl text-center shadow-[0_6px_0_#fecdd3] dark:shadow-[0_6px_0_#4c0519] flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mb-2 shadow-sm">
                  <Film size={24} />
                </div>
                <div className="text-3xl md:text-4xl font-black text-rose-600 dark:text-rose-400 mb-1" dir="ltr">
                  {watchedVideoIds.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-extrabold" dir={isRTL ? "rtl" : "ltr"}>
                  {t('videos.quests.statsWatched')}
                </div>
              </div>

              {/* Card 2: Quizzes Passed */}
              <div className="card-juicy bg-white dark:bg-slate-900 border-3 border-indigo-200 dark:border-indigo-900/60 p-5 rounded-3xl text-center shadow-[0_6px_0_#c7d2fe] dark:shadow-[0_6px_0_#1e1b4b] flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-500 flex items-center justify-center mb-2 shadow-sm">
                  <Brain size={24} />
                </div>
                <div className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1" dir="ltr">
                  {completedQuizVideoIds.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-extrabold" dir={isRTL ? "rtl" : "ltr"}>
                  {t('videos.quests.statsQuizzes')}
                </div>
              </div>

              {/* Card 3: Likes */}
              <div className="card-juicy bg-white dark:bg-slate-900 border-3 border-pink-200 dark:border-pink-900/60 p-5 rounded-3xl text-center shadow-[0_6px_0_#fbcfe8] dark:shadow-[0_6px_0_#500724] flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/80 border-2 border-pink-200 dark:border-pink-800 text-pink-500 flex items-center justify-center mb-2 shadow-sm">
                  <Heart size={24} className="fill-pink-500" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-pink-600 dark:text-pink-400 mb-1" dir="ltr">
                  {likedVideoIds.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-extrabold" dir={isRTL ? "rtl" : "ltr"}>
                  {t('videos.quests.statsLikes')}
                </div>
              </div>

              {/* Card 4: Bookmarks */}
              <div className="card-juicy bg-white dark:bg-slate-900 border-3 border-amber-200 dark:border-amber-900/60 p-5 rounded-3xl text-center shadow-[0_6px_0_#fde68a] dark:shadow-[0_6px_0_#78350f] flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border-2 border-amber-200 dark:border-amber-800 text-amber-500 flex items-center justify-center mb-2 shadow-sm">
                  <Bookmark size={24} className="fill-amber-500" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-amber-600 dark:text-amber-400 mb-1" dir="ltr">
                  {bookmarkedVideoIds.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-extrabold" dir={isRTL ? "rtl" : "ltr"}>
                  {t('videos.quests.statsBookmarks')}
                </div>
              </div>
            </div>

            {/* Completed Action Challenges Submissions */}
            {Object.keys(submittedChallenges).length > 0 && (
              <div className="card-juicy bg-white dark:bg-slate-900 border-3 border-amber-200 dark:border-slate-800 p-6 rounded-3xl shadow-[0_6px_0_#f1f5f9] dark:shadow-[0_6px_0_#0f172a]">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="text-amber-500" size={20} />
                  <span>{isRTL ? 'إنجازاتك في التحديات الواقعية' : 'Real-World Challenge Proofs'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(submittedChallenges).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex gap-4 items-center shadow-sm"
                    >
                      {sub.proofUrl && (
                        <img
                          src={sub.proofUrl}
                          alt="Proof"
                          className="w-16 h-16 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700 flex-shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-black mb-1">
                          <CheckCircle size={14} />
                          <span>{t('videos.challenge.statusApproved')}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-bold line-clamp-2">{sub.notes}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI VIDEO CREATOR STUDIO (Profits Patrol Gamified Theme) */}
        {activeTab === 'aiStudio' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card-juicy bg-white dark:bg-slate-900 border-3 border-amber-200/90 dark:border-slate-800 p-6 md:p-8 rounded-[32px] shadow-[0_8px_0_#f1f5f9] dark:shadow-[0_8px_0_#0f172a] relative overflow-hidden transition-all">
              {/* Top Title & Badge */}
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_2px_0_#4338ca]">
                  <Sparkles size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {t('videos.aiStudio.title')}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                {t('videos.aiStudio.subtitle')}
              </h2>

              <div className="space-y-6 mt-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {t('videos.aiStudio.topicLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studioTopic}
                      onChange={(e) => setStudioTopic(e.target.value)}
                      placeholder={t('videos.aiStudio.topicPlaceholder')}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-3 border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-500 rounded-2xl p-4 text-sm md:text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none shadow-inner transition-colors"
                    />
                    {studioTopic && (
                      <button
                        onClick={() => setStudioTopic('')}
                        className="absolute top-4 end-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      {
                        en: 'How to invest in stocks as a kid',
                        ar: 'كيف تبدأ مشروعك التجاري الأول؟',
                      },
                      {
                        en: 'Why does inflation make candy expensive?',
                        ar: 'ليه التضخم بيخلي أسعار الحلويات تزيد؟',
                      },
                      {
                        en: '3 rules to negotiate your chores allowance',
                        ar: '3 أسرار للتفاوض على مكافأة المهام والواجبات',
                      },
                      {
                        en: 'The secret difference between Needs and Wants',
                        ar: 'الفرق السري بين الاحتياجات والرغبات',
                      },
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setStudioTopic(isRTL ? example.ar : example.en);
                          SoundService.playClick();
                        }}
                        className="text-xs font-extrabold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800/60 px-3.5 py-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:scale-105 active:scale-95 transition-all shadow-[0_2px_0_#fde68a] dark:shadow-[0_2px_0_#78350f]"
                      >
                        ✨ {isRTL ? example.ar : example.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mascot Picker (3D Character Cards) */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                    {t('videos.aiStudio.mascotLabel')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    {[
                      CHARACTER_ASSETS.Ollie,
                      CHARACTER_ASSETS.Reema,
                      CHARACTER_ASSETS.Filo,
                      CHARACTER_ASSETS.Kami,
                    ].map((m) => {
                      const isSelected = studioMascot === m.name;
                      return (
                        <button
                          key={m.name}
                          onClick={() => {
                            setStudioMascot(m.name as any);
                            SoundService.playClick();
                          }}
                          className={`btn-juicy relative p-3.5 md:p-4 rounded-3xl border-3 text-center transition-all flex flex-col items-center justify-between group ${
                            isSelected
                              ? 'bg-gradient-to-b from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/20 border-amber-500 shadow-[0_6px_0_#d97706] scale-[1.03] ring-2 ring-amber-400/40'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:scale-[1.01]'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-2 -end-2 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                              <Check size={16} strokeWidth={3} />
                            </div>
                          )}
                          <div className="w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700/80 p-1.5 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-inner">
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-full h-full object-contain filter drop-shadow-sm"
                            />
                          </div>
                          <div className="text-sm font-black text-slate-900 dark:text-white">
                            {isRTL ? m.nameAr : m.name}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {isRTL ? m.titleAr : m.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Selector (3D Segmented Control) */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                    {t('videos.aiStudio.difficultyLabel')}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['diffBeginner', 'diffIntermediate', 'diffAdvanced'] as const).map((diff) => {
                      const isSelected = studioDifficulty === diff;
                      return (
                        <button
                          key={diff}
                          onClick={() => {
                            setStudioDifficulty(diff);
                            SoundService.playClick();
                          }}
                          className={`btn-juicy p-3 md:p-3.5 rounded-2xl border-2 text-xs md:text-sm font-black transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 shadow-[0_4px_0_#b45309] scale-[1.02]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#1e293b] hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          {t(`videos.aiStudio.${diff}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Button (3D Hero Action) */}
                <button
                  onClick={handleGenerateAIShort}
                  disabled={!studioTopic.trim() || isGenerating}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2.5 transition-all ${
                    isGenerating
                      ? 'bg-purple-800 text-purple-200 shadow-[0_4px_0_#3b0764] cursor-wait'
                      : studioTopic.trim()
                      ? 'btn-juicy bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-[0_5px_0_#4338ca] hover:scale-[1.01] active:translate-y-1 active:shadow-none cursor-pointer'
                      : 'bg-amber-100/70 dark:bg-slate-800/80 text-amber-800/60 dark:text-slate-400 border-2 border-amber-200/80 dark:border-slate-700 shadow-[0_3px_0_#e2e8f0] dark:shadow-[0_3px_0_#0f172a] cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      <span>{t('videos.aiStudio.generating')}</span>
                    </>
                  ) : (
                    <>
                      <Zap size={20} className={studioTopic.trim() ? 'fill-yellow-300 text-yellow-300' : ''} />
                      <span>{t('videos.aiStudio.generateBtn')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Preview Card */}
            {generatedVideo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-juicy bg-white dark:bg-slate-900 border-3 border-purple-300 dark:border-purple-600/40 p-6 md:p-8 rounded-[32px] shadow-[0_8px_0_#e9d5ff] dark:shadow-[0_8px_0_#1e1b4b] space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase">
                    <CheckCircle size={18} />
                    <span>{t('videos.aiStudio.generatedSuccess')}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">9:16 Shorts Canvas</span>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{generatedVideo.title}</h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 leading-relaxed">{generatedVideo.description}</p>
                </div>

                {/* Scenes Preview */}
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('videos.aiStudio.previewTitle')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedVideo.animationConfig?.scenes.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-start gap-3 shadow-sm"
                      >
                        <span className="text-2xl">{s.visualEmoji}</span>
                        <div>
                          <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-black">
                            Scene {idx + 1} ({s.durationSeconds}s)
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5 leading-snug font-bold">{s.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publish to Feed */}
                <button
                  onClick={handlePublishGeneratedShort}
                  className="btn-juicy w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_5px_0_#047857] hover:scale-[1.01] active:translate-y-1 active:shadow-none transition-all"
                >
                  <Play size={18} className="fill-white" />
                  <span>{t('videos.aiStudio.addToFeedBtn')}</span>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* QUIZ MODAL */}
      <AnimatePresence>
        {showQuizModal && currentVideo?.quiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowQuizModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQuizModal(false)}
                className="absolute top-5 end-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Brain size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('videos.quiz.title')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('videos.quiz.subtitle')}</p>
                </div>
              </div>

              <div className="my-6">
                <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-snug mb-4">
                  {getLocalized(currentVideo.quiz.question, currentVideo.quiz.questionAr)}
                </h4>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {(isRTL && currentVideo.quiz.optionsAr
                    ? currentVideo.quiz.optionsAr
                    : currentVideo.quiz.options
                  ).map((opt, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedQuizAnswer(idx);
                          setQuizFeedback(null);
                          SoundService.playClick();
                        }}
                        className={`w-full p-4 rounded-2xl text-start font-bold text-xs md:text-sm transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-indigo-600/10 dark:bg-indigo-600/20 border-indigo-500 text-indigo-950 dark:text-white shadow-md'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'border-slate-300 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Alert */}
              {quizFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border mb-5 ${
                    quizFeedback.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <div className="font-black text-sm mb-1 flex items-center gap-2">
                    {quizFeedback.isCorrect ? <CheckCircle size={18} /> : <X size={18} />}
                    <span>{quizFeedback.isCorrect ? t('videos.quiz.passedTitle') : t('videos.quiz.failedTitle')}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {getLocalized(currentVideo.quiz.explanation, currentVideo.quiz.explanationAr)}
                  </p>
                  {quizFeedback.isCorrect && quizFeedback.xpReward > 0 && (
                    <div className="mt-2 text-xs font-black text-amber-600 dark:text-amber-400">
                      +{quizFeedback.xpReward} XP & +{quizFeedback.tokenReward} PP Tokens!
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action Button */}
              <button
                onClick={handleCheckQuizAnswer}
                disabled={selectedQuizAnswer === null}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
                  selectedQuizAnswer === null
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.01]'
                }`}
              >
                {t('videos.quiz.submit')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHALLENGE SUBMISSION MODAL */}
      <AnimatePresence>
        {showChallengeModal && currentVideo?.challenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowChallengeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowChallengeModal(false)}
                className="absolute top-5 end-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center">
                  <Trophy size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('videos.challenge.title')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('videos.challenge.rewardSummary', {
                      xp: currentVideo.challenge.rewardXp,
                      tokens: currentVideo.challenge.rewardTokens,
                    })}
                  </p>
                </div>
              </div>

              <div className="my-5 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {getLocalized(currentVideo.challenge.title, currentVideo.challenge.titleAr)}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {getLocalized(currentVideo.challenge.description, currentVideo.challenge.descriptionAr)}
                  </p>
                </div>

                {/* Instructions */}
                <div>
                  <div className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase mb-2">
                    {t('videos.challenge.instructionsTitle')}
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {(isRTL && currentVideo.challenge.instructionsAr
                      ? currentVideo.challenge.instructionsAr
                      : currentVideo.challenge.instructions
                    ).map((ins, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Photo Simulation / Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                    {t('videos.challenge.photoProof')}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setChallengePhotoPreview(
                          'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80'
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <Camera size={16} />
                      <span>{isRTL ? 'إرفاق صورة العمل' : 'Attach Project Photo'}</span>
                    </button>
                    {challengePhotoPreview && (
                      <img
                        src={challengePhotoPreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500"
                      />
                    )}
                  </div>
                </div>

                {/* Notes Input */}
                <div>
                  <textarea
                    rows={2}
                    value={challengeNotes}
                    onChange={(e) => setChallengeNotes(e.target.value)}
                    placeholder={t('videos.challenge.notesPlaceholder')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {challengeSubmittedNotice && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  <span>{t('videos.challenge.statusApproved')}</span>
                </div>
              )}

              <button
                onClick={handleSubmitChallenge}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.01] transition-transform"
              >
                {t('videos.challenge.submitBtn')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoLibrary;
