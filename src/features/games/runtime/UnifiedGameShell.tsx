import React, { useState, useEffect, Component, type ReactNode } from "react";
import { useTranslation } from "../hooks/useArcadeTranslation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Star,
  Coins,
  Zap,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import type { UnifiedGameDefinition, RawGameResult, NormalizedGameResult } from "../types";
import { GameRewardAdapter } from "../adapters/GameRewardAdapter";
import { GameProgressAdapter } from "../adapters/GameProgressAdapter";
import { DISTRICT_METADATA } from "../registry/canonicalRegistry";
import { SoundService } from "../../../lib/sound";
import { GameRunner } from "../components/GameRunner";

interface UnifiedGameShellProps {
  game: UnifiedGameDefinition;
  onExit: () => void;
}

type ShellPhase = "briefing" | "playing" | "paused" | "results";

// Branded Error Boundary for game components
interface ErrorBoundaryProps {
  children: ReactNode;
  t?: (key: string, defaultValue?: any) => string;
  isRTL?: boolean;
  onRetry: () => void;
  onExit: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GameErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[GameErrorBoundary] Game runtime crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isRTL = this.props.isRTL;
      const t = this.props.t;
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[450px] bg-red-50 dark:bg-gray-800 rounded-3xl border-2 border-red-200">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <AlertCircle size={36} />
          </div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
            {t?.("games.shell.error_title", isRTL ? "تعذر تشغيل محطة اللعبة هذه" : "We couldn't launch this game station")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            {t?.("games.shell.error_desc", isRTL ? "واجه أولي مشكلة غير متوقعة. لا تقلق، عملاتك وتقدمك في أمان!" : "Ollie encountered an unexpected hiccup. Don't worry, your coins and progress are safe!")}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry();
              }}
              className="px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black shadow-lg shadow-yellow-400/30 flex items-center gap-2"
            >
              <RotateCcw size={18} /> {t?.("common.retry", isRTL ? "حاول مجدداً" : "Try Again")}
            </button>
            <button
              onClick={this.props.onExit}
              className="px-6 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-white font-bold"
            >
              {t?.("games.shell.back_to_arcade", isRTL ? "العودة إلى الألعاب" : "Back to Arcade")}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const UnifiedGameShell: React.FC<UnifiedGameShellProps> = ({ game, onExit }) => {
  const { t, i18n } = useTranslation();
  const [phase, setPhase] = useState<ShellPhase>("briefing");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const [normalizedResult, setNormalizedResult] = useState<NormalizedGameResult | null>(null);
  const [progress, setProgress] = useState(() => GameProgressAdapter.getProgress(game.id));

  const district = DISTRICT_METADATA[game.district] || DISTRICT_METADATA.money;
  const isRTL = i18n.language.startsWith("ar");

  useEffect(() => {
    setProgress(GameProgressAdapter.getProgress(game.id));
  }, [game.id]);

  const handleStartGame = () => {
    if (soundEnabled) SoundService.playClick();
    setRunKey(prev => prev + 1);
    setNormalizedResult(null);
    setPhase("playing");
  };

  const handleGameEnd = async (rawResult: RawGameResult) => {
    // Process authoritative rewards via GameRewardAdapter
    const previousBest = progress.bestScore;
    const previousStars = progress.stars;

    const result = await GameRewardAdapter.processCompletion(
      game,
      rawResult,
      previousBest,
      previousStars
    );

    // Persist progress
    const updatedProgress = GameProgressAdapter.saveResult(result);
    setProgress(updatedProgress);
    setNormalizedResult(result);

    if (rawResult.achieved) {
      if (soundEnabled) SoundService.playSuccess();
    } else {
      if (soundEnabled) SoundService.playError();
    }

    setPhase("results");
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-gray-900 text-[#102B4B] dark:text-gray-100 flex flex-col font-sans">
      {/* Branded Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-amber-100 dark:border-gray-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-gray-600 text-amber-950 dark:text-white font-extrabold text-sm transition-all"
          >
            <ArrowLeft size={18} className={isRTL ? "rotate-180" : ""} />
            <span>{t("games.shell.back_to_arcade", t("common.back", isRTL ? "العودة إلى الألعاب" : "Back to Games"))}</span>
          </button>

          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: game.accentColor }}
            >
              {t("games.shell.station", isRTL ? "المحطة" : "Station")} {game.stationNumber}
            </span>
            <span className="font-black text-lg text-gray-800 dark:text-white hidden sm:inline">
              {t(game.titleKey, game.sourceId.toUpperCase())}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="p-2.5 rounded-2xl bg-amber-50 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              title={soundEnabled ? t("common.mute", isRTL ? "كتم الصوت" : "Mute") : t("common.unmute", isRTL ? "تشغيل الصوت" : "Unmute")}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {(phase === "playing" || phase === "paused") && (
              <button
                onClick={() => setPhase(phase === "paused" ? "playing" : "paused")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
              >
                {phase === "paused" ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
                <span>{phase === "paused" ? t("common.resume", isRTL ? "استئناف" : "Resume") : t("common.pause", isRTL ? "إيقاف مؤقت" : "Pause")}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Game Shell Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* 1. Briefing Phase */}
          {phase === "briefing" && (
            <motion.div
              key="briefing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Game Briefing Card */}
              <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 sm:p-10 border-4 border-amber-200/60 dark:border-gray-700 shadow-2xl relative overflow-hidden">
                <div 
                  className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: game.accentColor }}
                />

                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
                    style={{ backgroundColor: game.accentColor }}
                  >
                    #{game.stationNumber}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {isRTL ? `حي ${t(district.titleKey, game.district)}` : `${t(district.titleKey, game.district)} ${t("games.shell.district", "District")}`}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                      {t(game.titleKey, game.sourceId)}
                    </h1>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium mb-8 leading-relaxed">
                  {t(game.objectiveKey, isRTL ? "أتقن هذا المفهوم المالي والريادي واكسب العملات لشركتك!" : "Master this core business concept and earn coins for your enterprise!")}
                </p>

                {/* Reward Preview Pills */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-gray-700/60 border-2 border-amber-100 dark:border-gray-600 text-center">
                    <Zap size={22} className="text-amber-500 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase">{t("games.shell.reward", isRTL ? "المكافأة" : "Reward")}</span>
                    <strong className="text-lg font-black text-gray-800 dark:text-white">+100 XP</strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-gray-700/60 border-2 border-emerald-100 dark:border-gray-600 text-center">
                    <Coins size={22} className="text-emerald-500 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase">{t("common.ppTokens", isRTL ? "عملات P" : "P Tokens")}</span>
                    <strong className="text-lg font-black text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center gap-1.5" dir="ltr">
                      <span>+25</span>
                      <img src="/icons/3d/coin.png" alt="coin" className="w-5 h-5 object-contain inline-block drop-shadow-sm" />
                    </strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-gray-700/60 border-2 border-blue-100 dark:border-gray-600 text-center">
                    <Trophy size={22} className="text-blue-500 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase">{t("games.shell.best", isRTL ? "أفضل نتيجة" : "Best")}</span>
                    <strong className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {progress.bestScore > 0 ? `${progress.bestScore} ${t("games.shell.pts", isRTL ? "نقطة" : "pts")}` : t("games.shell.new", isRTL ? "جديد" : "New")}
                    </strong>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartGame}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-yellow-950 font-black text-xl shadow-xl shadow-amber-400/40 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                >
                  <Play size={24} fill="currentColor" />
                  <span>{t("games.shell.start", isRTL ? "ابدأ اللعبة" : "Start Game")}</span>
                </button>
              </div>

              {/* Right Column: Ollie Mascot & Advice */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-200 p-1.5 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-amber-300/80 dark:border-amber-500/50">
                    <picture className="w-full h-full flex items-center justify-center">
                      <source srcSet="/brand/ollie-logo.webp" type="image/webp" />
                      <source srcSet="/characters/ollie/cheer.webp" type="image/webp" />
                      <img 
                        src="/brand/ollie-logo.png" 
                        alt="Ollie the Owl Mascot" 
                        width={176}
                        height={176}
                        className="w-full h-full object-cover rounded-full filter drop-shadow-md transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('cheer')) {
                            target.src = '/characters/ollie/cheer.webp';
                          } else if (!target.src.includes('ollie_idle')) {
                            target.src = '/images/characters_clean/ollie_idle.png';
                          }
                        }}
                      />
                    </picture>
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-200" />
                    <span>{t("games.shell.mentor_badge", isRTL ? "المرشد أولي" : "Ollie Mentor")}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-amber-200 dark:border-gray-700 shadow-lg relative max-w-sm">
                  <p className="text-gray-700 dark:text-gray-300 font-bold text-sm leading-relaxed">
                    "{t("games.shell.mentor_quote", isRTL ? "أهلاً يا رائد الأعمال الصغير! تذكّر: الدقة والصبر يحوّلان القرارات الذكية إلى أرباح حقيقية لشركتك!" : "Hey Young Founder! Remember: precision and patience turn smart decisions into enterprise profits!")}"
                  </p>
                  <span className="block mt-3 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    {t("games.shell.skill_label", isRTL ? "المهارة" : "Skill")}: {t(game.skillKey, isRTL ? "استراتيجية ذكية" : "Smart Strategy")}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Active Playing Stage */}
          {(phase === "playing" || phase === "paused") && (
            <motion.div
              key={`game-container-${runKey}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full relative min-h-[580px] bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-4 border-amber-200/80 dark:border-gray-700 overflow-hidden"
            >
              <GameErrorBoundary t={t} isRTL={isRTL} onRetry={handleStartGame} onExit={onExit}>
                <div className={phase === "paused" ? "filter blur-sm pointer-events-none" : ""}>
                  <GameRunner
                    gameId={game.sourceId as any}
                    paused={phase === "paused"}
                    onEnd={handleGameEnd}
                  />
                </div>
              </GameErrorBoundary>

              {/* Pause Overlay */}
              {phase === "paused" && (
                <div className="absolute inset-0 z-20 bg-gray-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center mb-6 shadow-2xl">
                    <Pause size={40} fill="currentColor" />
                  </div>
                  <h2 className="text-4xl font-black mb-3">
                    {t("games.shell.paused_title", isRTL ? "تم إيقاف اللعبة مؤقتاً" : "Game Paused")}
                  </h2>
                  <p className="text-gray-300 max-w-sm mb-8 font-medium">
                    {t("games.shell.paused_desc", isRTL ? "خذ نفساً عميقاً! عندما تكون مستعداً لاستئناف مهمتك، اضغط متابعة." : "Take a breath! When you are ready to resume your mission, press continue.")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                    <button
                      onClick={() => setPhase("playing")}
                      className="py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 text-yellow-950 font-black text-lg shadow-lg flex items-center justify-center gap-2"
                    >
                      <Play size={20} fill="currentColor" /> {t("common.resume", isRTL ? "استئناف" : "Resume")}
                    </button>
                    <button
                      onClick={onExit}
                      className="py-4 px-6 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold"
                    >
                      {t("games.shell.exit_to_arcade", isRTL ? "الخروج إلى الألعاب" : "Exit to Arcade")}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. Results Phase */}
          {phase === "results" && normalizedResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 sm:p-12 border-4 border-amber-200 dark:border-gray-700 shadow-2xl text-center"
            >
              {/* Medallion */}
              <div 
                className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl ${
                  normalizedResult.achieved 
                    ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-yellow-950" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {normalizedResult.achieved ? <Trophy size={48} /> : <RotateCcw size={48} />}
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {normalizedResult.achieved 
                  ? t("games.shell.mission_accomplished", isRTL ? "تمت المهمة بنجاح!" : "Mission Accomplished!") 
                  : t("games.shell.keep_practicing", isRTL ? "واصل التدريب!" : "Keep Practicing!")}
              </span>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-3">
                {normalizedResult.achieved 
                  ? t("common.win", isRTL ? "انتصار!" : "Victory!") 
                  : t("common.loss", isRTL ? "محاولة جيدة!" : "Good Try!")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-8">
                {normalizedResult.message || t("games.shell.default_result_message", isRTL ? "ردود أفعالك التجارية تتطور وتنمو مع كل جولة." : "Your business reflexes are expanding every round.")}
              </p>

              {/* Star Rating Display */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map((starNum) => (
                  <Star
                    key={starNum}
                    size={36}
                    className={
                      starNum <= normalizedResult.stars
                        ? "text-yellow-400 fill-yellow-400 filter drop-shadow-md"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>

              {/* Authoritative Rewards Summary */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-gray-700/60 border-2 border-amber-100 dark:border-gray-600">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                    {t("games.shell.final_score", isRTL ? "النتيجة النهائية" : "Final Score")}
                  </span>
                  <strong className="text-2xl font-black text-gray-800 dark:text-white">{normalizedResult.score}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-yellow-50 dark:bg-gray-700/60 border-2 border-yellow-100 dark:border-gray-600">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                    {t("games.shell.earned_xp", isRTL ? "الخبرة المكتسبة" : "Earned XP")}
                  </span>
                  <strong className="text-2xl font-black text-amber-600 dark:text-amber-400">+{normalizedResult.xpAwarded}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-gray-700/60 border-2 border-emerald-100 dark:border-gray-600">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">{t("common.ppTokens", isRTL ? "عملات P" : "P Tokens")}</span>
                  <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center gap-1.5" dir="ltr">
                    <span>+{normalizedResult.coinsAwarded}</span>
                    <img src="/icons/3d/coin.png" alt="coin" className="w-6 h-6 object-contain inline-block drop-shadow-sm" />
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleStartGame}
                  className="py-4 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black text-lg shadow-xl shadow-yellow-400/30 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} /> {t("games.shell.play_again", isRTL ? "العب مجدداً" : "Play Again")}
                </button>
                <button
                  onClick={onExit}
                  className="py-4 px-8 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-lg"
                >
                  {t("games.shell.back_to_arcade", isRTL ? "العودة إلى الألعاب" : "Back to Arcade")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
