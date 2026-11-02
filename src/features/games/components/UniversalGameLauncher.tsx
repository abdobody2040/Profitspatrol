import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Star, 
  Trophy, 
  Sparkles, 
  Target, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CANONICAL_ARCADE_GAMES } from '../registry/canonicalRegistry';
import { CommonGameResult, RawGameResult, UnifiedGameDefinition } from '../types';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { useAppStore } from '../../../store';
import { getDistrict } from '../../../domain/world/districts';
import { getHero, getHeroDialogue } from '../../characters/data/heroes';
import { getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { 
  AdaptiveDifficulty, 
  calculateAdaptiveDifficulty, 
  calculateCompetencyDelta 
} from '../../../domain/mastery/masteryCalculator';

export interface UniversalGameLauncherProps {
  gameId: string;
  onClose: () => void;
  onGameCompleted?: (result: CommonGameResult) => void;
  initialDifficulty?: AdaptiveDifficulty;
}

export const UniversalGameLauncher: React.FC<UniversalGameLauncherProps> = ({
  gameId,
  onClose,
  onGameCompleted,
  initialDifficulty = 'rookie'
}) => {
  const { t } = useTranslation();
  const { isArabic, isJunior, playTap, playSuccess } = useAgeMode();
  const user = useAppStore((state) => state.user);

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'paused' | 'completed'>('intro');
  const [difficulty, setDifficulty] = useState<AdaptiveDifficulty>(initialDifficulty);
  const [soundMuted, setSoundMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [gameResult, setGameResult] = useState<CommonGameResult | null>(null);

  // Locate game definition
  const gameDef: UnifiedGameDefinition | undefined = useMemo(() => {
    return CANONICAL_ARCADE_GAMES.find(
      (g) => g.id === gameId || g.sourceId === gameId || g.stationNumber === gameId
    ) || CANONICAL_ARCADE_GAMES[0];
  }, [gameId]);

  // District & Guide Hero
  const district = useMemo(() => getDistrict(gameDef.district), [gameDef]);
  const heroGuide = useMemo(() => {
    if (!district || district.heroGuide === 'rex') return getHero('ollie');
    return getHero(district.heroGuide as any);
  }, [district]);

  // Timer during play
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  // Handle Game Completion
  const handleGameEnd = (raw: RawGameResult) => {
    const accuracy = raw.achieved ? Math.min(100, Math.max(60, Math.round((raw.score / 200) * 100))) : 40;
    const mistakes = raw.achieved ? (raw.stars === 3 ? 0 : raw.stars === 2 ? 1 : 2) : 3;
    const stars = raw.stars || (raw.achieved ? 3 : 1);
    const xpAwarded = raw.achieved ? 50 * stars : 15;
    const coinsAwarded = raw.achieved ? 25 * stars : 5;

    const competencyKey = gameDef.skillKey.replace('games.', 'comp_');
    const heroReactionText = stars >= 2
      ? heroGuide.dialogueBank.success[0]?.textEn || 'Great performance!'
      : heroGuide.dialogueBank.mistakeReflect[0]?.textEn || 'Good effort, let us try again!';

    const result: CommonGameResult = {
      gameId: gameDef.id,
      attemptId: `att_${Date.now()}`,
      achieved: raw.achieved,
      score: raw.score,
      maxScore: 200,
      accuracy,
      mistakes,
      stars,
      xpAwarded,
      coinsAwarded,
      durationSeconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
      competencyDeltas: { [competencyKey]: xpAwarded },
      characterReaction: {
        heroId: heroGuide.id,
        emotion: stars >= 2 ? 'celebrating' : 'thinking',
        dialogueText: heroReactionText
      },
      message: raw.message
    };

    setGameResult(result);
    setGameState('completed');
    playSuccess?.();

    // Dispatch rewards to store
    useAppStore.setState((state) => {
      if (!state.user) return state;
      const currentComp = state.user.competencyMastery?.[competencyKey] || { level: 1, score: 0, lastTestedAt: new Date().toISOString() };
      const compUpdate = calculateCompetencyDelta(competencyKey, currentComp.score, xpAwarded);

      return {
        user: {
          ...state.user,
          xp: (state.user.xp || 0) + xpAwarded,
          ppTokens: (state.user.ppTokens || 0) + coinsAwarded,
          competencyMastery: {
            ...(state.user.competencyMastery || {}),
            [competencyKey]: {
              level: compUpdate.newLevel,
              score: compUpdate.newXp,
              lastTestedAt: new Date().toISOString()
            }
          }
        }
      };
    });

    if (onGameCompleted) {
      onGameCompleted(result);
    }
  };

  const handleStartPlay = () => {
    playTap?.();
    setScore(0);
    setElapsedSeconds(0);
    setGameState('playing');
  };

  // Adaptive recommendation on completed screen
  const adaptiveRec = useMemo(() => {
    if (!gameResult) return null;
    return calculateAdaptiveDifficulty(difficulty, {
      accuracy: gameResult.accuracy || 80,
      mistakes: gameResult.mistakes || 0,
      score: gameResult.score,
      maxScore: gameResult.maxScore
    });
  }, [gameResult, difficulty]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span 
              className="text-xs font-black uppercase px-2 py-0.5 rounded-lg text-white"
              style={{ backgroundColor: district?.themeColor || '#10B981' }}
            >
              {isArabic ? `محطة ${gameDef.stationNumber}` : `Station ${gameDef.stationNumber}`}
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {t(gameDef.titleKey, gameDef.sourceId.toUpperCase())}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {gameState === 'playing' && (
              <>
                <button
                  onClick={() => setSoundMuted(!soundMuted)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle Sound"
                >
                  {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setGameState('paused')}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Pause Game"
                >
                  <Pause className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={() => { playTap?.(); onClose(); }}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Exit Game"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Based on State */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* ── INTRO STATE ── */}
          {gameState === 'intro' && (
            <div className="flex flex-col items-center text-center max-w-lg mx-auto py-2">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-md"
                style={{ backgroundColor: `${district?.themeColor || '#10B981'}20`, border: `2px solid ${district?.themeColor || '#10B981'}` }}
              >
                {district?.icon || '🎮'}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                {t(gameDef.titleKey, gameDef.sourceId.toUpperCase())}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {t(gameDef.objectiveKey, 'Learn real-world business skills and earn rewards!')}
              </p>

              {/* Guide Advisor Tip */}
              <div className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6 text-start">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white dark:bg-slate-700 p-0.5 border border-slate-300 dark:border-slate-600">
                  <img
                    src={getCharacterAsset(heroGuide.id, 'talking').path}
                    alt={heroGuide.nameEn}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('ollie-logo')) {
                        target.src = '/brand/ollie-logo.png';
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    {isArabic ? `نصيحة ${heroGuide.nameAr}` : `${heroGuide.nameEn}'s Tip`}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {isArabic ? heroGuide.dialogueBank.tip[0]?.textAr : heroGuide.dialogueBank.tip[0]?.textEn}
                  </p>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="w-full mb-8">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2 text-start">
                  {isArabic ? 'اختر مستوى التحدي' : 'Select Difficulty'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rookie', 'founder', 'tycoon'] as AdaptiveDifficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => { playTap?.(); setDifficulty(d); }}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black capitalize transition-all ${
                        difficulty === d
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch CTA */}
              <button
                onClick={handleStartPlay}
                className="w-full py-4 rounded-2xl text-white text-lg font-black shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[52px]"
                style={{ backgroundColor: district?.themeColor || '#10B981' }}
              >
                <Play className="w-6 h-6 fill-current" />
                <span>{isArabic ? 'ابدأ التحدي الآن' : 'Start Challenge Now'}</span>
              </button>
            </div>
          )}

          {/* ── PLAYING STATE ── */}
          {gameState === 'playing' && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-full flex items-center justify-between mb-4 px-2 text-sm font-bold text-slate-500">
                <span>⏱️ {elapsedSeconds}s</span>
                <span>⭐ {score} pts</span>
                <span className="capitalize">Tier: {difficulty}</span>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 w-full flex flex-col items-center justify-center">
                <Target className="w-16 h-16 text-slate-400 mb-3 animate-pulse" />
                <h3 className="text-lg font-black text-slate-700 dark:text-slate-200 mb-2">
                  {t(gameDef.titleKey, 'Active Mini-Game')}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-6">
                  {t(gameDef.skillKey, 'Complete the station objectives to earn XP and competencies.')}
                </p>

                {/* Simulated Game Action Button for quick play/test */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGameEnd({ achieved: true, score: 180, stars: 3, message: 'Perfect run!' })}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow transition-all active:scale-95"
                  >
                    {isArabic ? 'إنهاء بنجاح (3 نجوم)' : 'Complete 3 Stars'}
                  </button>
                  <button
                    onClick={() => handleGameEnd({ achieved: true, score: 120, stars: 2, message: 'Good job!' })}
                    className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm shadow transition-all active:scale-95"
                  >
                    {isArabic ? 'إنهاء (2 نجوم)' : 'Finish 2 Stars'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── PAUSED STATE ── */}
          {gameState === 'paused' && (
            <div className="flex flex-col items-center text-center py-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                {isArabic ? 'اللعبة متوقفة مؤقتاً' : 'Game Paused'}
              </h3>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={() => { playTap?.(); setGameState('playing'); }}
                  className="py-3 px-6 rounded-2xl bg-emerald-600 text-white font-extrabold shadow hover:bg-emerald-500"
                >
                  {isArabic ? 'استئناف اللعب' : 'Resume'}
                </button>
                <button
                  onClick={() => { playTap?.(); handleStartPlay(); }}
                  className="py-3 px-6 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold hover:bg-slate-300"
                >
                  {isArabic ? 'إعادة البدء' : 'Restart'}
                </button>
                <button
                  onClick={() => { playTap?.(); onClose(); }}
                  className="py-3 px-6 rounded-2xl border border-red-300 text-red-600 font-extrabold hover:bg-red-50"
                >
                  {isArabic ? 'مغادرة المحطة' : 'Quit Station'}
                </button>
              </div>
            </div>
          )}

          {/* ── COMPLETED STATE (PRD SECTION 27) ── */}
          {gameState === 'completed' && gameResult && (
            <div className="flex flex-col items-center text-center max-w-lg mx-auto py-2">
              {/* Stars Burst */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-10 h-10 ${
                      starIdx <= gameResult.stars
                        ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md'
                        : 'text-slate-300 dark:text-slate-700'
                    } transition-all`}
                  />
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                {gameResult.achieved
                  ? (isArabic ? 'أحسنت صنعاً يا بطل!' : 'Challenge Complete!')
                  : (isArabic ? 'محاولة جيدة!' : 'Nice Effort!')}
              </h2>

              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
                {gameResult.message || (isArabic ? 'حققت نتائج ممتازة في هذا التحدي' : 'Great progress on your entrepreneurial journey')}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full mb-6">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold text-slate-400 block">{isArabic ? 'النقاط' : 'Score'}</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white">{gameResult.score}</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold text-slate-400 block">{isArabic ? 'الدقة' : 'Accuracy'}</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{gameResult.accuracy}%</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold text-slate-400 block">{isArabic ? 'المكافأة' : 'Rewards'}</span>
                  <span className="text-sm font-black text-amber-500 flex items-center justify-center gap-1 mt-1">
                    +{gameResult.xpAwarded} XP
                  </span>
                </div>
              </div>

              {/* Hero Reaction Speech */}
              <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-6 text-start">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white dark:bg-slate-800 p-0.5 border border-amber-300">
                  <img
                    src={getCharacterAsset(heroGuide.id, 'celebrating').path}
                    alt={heroGuide.nameEn}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('ollie-logo')) {
                        target.src = '/brand/ollie-logo.png';
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    {isArabic ? heroGuide.nameAr : heroGuide.nameEn}
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {gameResult.characterReaction?.dialogueText}
                  </p>
                </div>
              </div>

              {/* Adaptive Next Step */}
              {adaptiveRec && (
                <div className="w-full p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6 flex items-center justify-between text-start">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">
                        {isArabic ? 'الخطوة التالية الموصى بها' : 'Adaptive Next Step'}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
                        {isArabic ? adaptiveRec.suggestedActionAr : adaptiveRec.suggestedActionEn}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 capitalize">
                    {adaptiveRec.recommendedDifficulty}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={handleStartPlay}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[48px]"
                >
                  {isArabic ? 'العب مرة أخرى' : 'Play Again'}
                </button>
                <button
                  onClick={() => { playTap?.(); onClose(); }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl text-white font-extrabold shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  style={{ backgroundColor: district?.themeColor || '#10B981' }}
                >
                  <span>{isArabic ? 'العودة للخارطة' : 'Back to District Map'}</span>
                  <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
