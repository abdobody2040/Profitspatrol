import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../../store';
import { BusinessSimulation } from '../../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Zap } from "lucide-react";
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface Props {
  config: BusinessSimulation;
  onExit: () => void;
}

interface FallingItem {
  id: string;
  itemData: any;
  lane: number;
  y: number; // 0-100 percent
  speed: number;
  caught: boolean;
  missed: boolean;
}

const LANES = 3;
const GAME_DURATION = 60; // seconds

const SortingTemplate: React.FC<Props> = ({ config, onExit }) => {
  const { t, i18n } = useTranslation();
  const { completeGame } = useAppStore();
  const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

  const items = Array.isArray(config.entities) ? config.entities.filter(e => e.type === 'item') : [];
  const visual = config.visual_config || { colors: { primary: '#22C55E', secondary: '#15803D', background: '#F0FDF4' } } as any;

  // Game state
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; color: string; x: number; id: string } | null>(null);
  const [contaminated, setContaminated] = useState<number[]>([]); // Bin indices that are contaminated
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const binLabels = items.slice(0, LANES);

  // Fun facts shown after each correct sort
  const funFacts = config.fun_facts || [
    "♻️ Only 9% of the world's plastic has ever been recycled!",
    "🌍 Sorting waste correctly can reduce pollution by up to 90%!",
    "💼 The recycling industry creates 10x more jobs than landfills!",
    "🔋 Recycling 1 aluminum can saves enough energy to run a TV for 3 hours!",
  ];
  const [currentFact, setCurrentFact] = useState<string | null>(null);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setFallingItems([]);
    setContaminated([]);
    setSpeedMultiplier(1);
    setShowResult(false);
    trigger('game_start');
  };

  // Countdown timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        // Speed ramps up every 15 seconds
        const elapsed = GAME_DURATION - prev + 1;
        if (elapsed % 15 === 0) {
          setSpeedMultiplier(m => Math.min(m + 0.3, 2.5));
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Spawn items
  useEffect(() => {
    if (!isPlaying || items.length === 0) return;
    const spawnInterval = Math.max(600, 1200 / speedMultiplier);
    const spawner = setInterval(() => {
      setFallingItems(prev => {
        // Cap active items
        if (prev.filter(i => !i.caught && !i.missed).length > 8) return prev;
        const randomItem = items[Math.floor(Math.random() * items.length)];
        return [...prev, {
          id: `${Date.now()}_${Math.random()}`,
          itemData: randomItem,
          lane: Math.floor(Math.random() * LANES),
          y: -10,
          speed: (1.5 + Math.random()) * speedMultiplier,
          caught: false,
          missed: false,
        }];
      });
    }, spawnInterval);
    return () => clearInterval(spawner);
  }, [isPlaying, items, speedMultiplier]);

  // Animate items falling
  useEffect(() => {
    if (!isPlaying) return;
    const animFrame = setInterval(() => {
      setFallingItems(prev => prev.map(item => {
        if (item.caught || item.missed) return item;
        const newY = item.y + item.speed;
        if (newY > 105) {
          // Missed
          setCombo(0);
          return { ...item, y: newY, missed: true };
        }
        return { ...item, y: newY };
      }).filter(i => !i.missed || i.y < 120));
    }, 50);
    return () => clearInterval(animFrame);
  }, [isPlaying]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setShowResult(true);
    const xp = Math.floor(score * 0.4);
    completeGame(score, xp);
    if (score > 200) trigger('game_over_win');
    else trigger('game_over_lose');
  }, [score, completeGame, trigger]);

  const showFeedback = (text: string, color: string, laneX: number) => {
    const id = Math.random().toString(36);
    setFeedback({ text, color, x: laneX, id });
    setTimeout(() => setFeedback(null), 800);
  };

  const handleBinClick = (binIndex: number) => {
    if (!isPlaying || items.length < LANES) return;
    if (contaminated.includes(binIndex)) {
      showFeedback('🚫 BIN CONTAMINATED!', '#EF4444', (binIndex / LANES) * 100 + 16);
      return;
    }

    // Find the lowest falling item in this lane
    const laneItems = fallingItems.filter(i => i.lane === binIndex && !i.caught && !i.missed && i.y > 0);
    if (laneItems.length === 0) return;
    const target = laneItems.reduce((a, b) => (a.y > b.y ? a : b));

    const correctBinIndex = items.findIndex(i => i.id === target.itemData.id);

    if (correctBinIndex === binIndex) {
      // CORRECT SORT!
      const newCombo = combo + 1;
      const points = 10 + newCombo * 2;
      setScore(s => s + points);
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setFallingItems(prev => prev.map(i => i.id === target.id ? { ...i, caught: true } : i));
      showFeedback(newCombo > 3 ? `COMBO x${newCombo}! +${points}` : `+${points}`, '#22C55E', (binIndex / LANES) * 100 + 16);

      // Show fun fact occasionally
      if (newCombo % 5 === 0) {
        const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
        setCurrentFact(fact);
        setTimeout(() => setCurrentFact(null), 3500);
      }

      if (newCombo === 3) trigger('streak_3');
      if (newCombo === 5) trigger('streak_5');
      if (newCombo >= 7) trigger('streak_7');
      if (score + points >= 100 && score < 100) trigger('milestone');

    } else {
      // WRONG BIN — contaminate it!
      setScore(s => Math.max(0, s - 5));
      setCombo(0);
      setFallingItems(prev => prev.map(i => i.id === target.id ? { ...i, caught: true } : i));
      // Contaminate the bin briefly
      setContaminated(prev => [...prev, binIndex]);
      setTimeout(() => setContaminated(prev => prev.filter(b => b !== binIndex)), 3000);
      showFeedback('💀 CONTAMINATED! -5', '#EF4444', (binIndex / LANES) * 100 + 16);
      trigger('bad_decision');
    }
  };

  if (items.length < LANES) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 font-bold p-10 text-center bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-200">
        <div className="text-4xl mb-4">⚙️</div>
        <p className="text-xl mb-6">{t('games.errors.config_sorting', `Game needs at least ${LANES} item entities.`)}</p>
        <button onClick={onExit} className="bg-gray-800 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-gray-900 transition-all">Exit</button>
      </div>
    );
  }

  const binColors = ['#3B82F6', '#F59E0B', '#22C55E'];

  return (
    <div className="h-full flex flex-col select-none relative overflow-hidden" style={{ backgroundColor: visual.colors.background }}>

      {/* Ollie Commentary */}
      <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

      {/* HUD */}
      <div className="flex justify-between items-center px-4 py-2 text-white shrink-0 z-10" style={{ backgroundColor: visual.colors.primary }}>
        <div className="flex flex-col">
          <span className="text-2xl font-black">{score}</span>
          {combo > 1 && (
            <motion.span
              key={combo}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-xs font-black text-yellow-300"
            >
              🔥 COMBO x{combo}
            </motion.span>
          )}
        </div>

        {/* Speed indicator */}
        <div className="flex items-center gap-1">
          <Zap size={14} className="text-yellow-300" />
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full ${speedMultiplier >= 1 + (i - 1) * 0.3 ? 'bg-yellow-300' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        <div className={`text-2xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-300 animate-pulse' : ''}`}>
          :{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Fun Fact Banner */}
      <AnimatePresence>
        {currentFact && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="bg-yellow-400 text-yellow-900 font-bold text-xs px-4 py-2 text-center z-20 shrink-0 flex items-center justify-center gap-2"
          >
            <span>💡</span> {currentFact}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling Items Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Lane dividers */}
        {[1, 2].map(i => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${(i / LANES) * 100}%` }} />
        ))}

        {/* Falling items */}
        {fallingItems.map(item => (
          !item.caught && !item.missed && (
            <motion.div
              key={item.id}
              className="absolute text-4xl md:text-5xl pointer-events-none"
              style={{
                left: `${(item.lane / LANES) * 100 + 100 / LANES / 2}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {item.itemData.emoji}
            </motion.div>
          )
        ))}

        {/* Score Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -60, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute font-black text-lg pointer-events-none z-20"
              style={{ left: `${feedback.x}%`, top: '50%', color: feedback.color }}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* START overlay */}
        {!isPlaying && !showResult && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center max-w-xs mx-4 shadow-2xl"
            >
              <div className="text-6xl mb-4">{visual.icon || '♻️'}</div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{config.name}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {t('games.sorting.desc', i18n.language.startsWith('ar') ? 'افرز العناصر في الصناديق الصحيحة قبل نفاد الوقت! الصناديق الخاطئة تلوث البيئة!' : 'Sort items into the correct bins before time runs out! Wrong bins cause contamination!')}
              </p>
              <button onClick={startGame} className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_rgba(21,128,61,1)] hover:bg-green-600 active:translate-y-1 active:shadow-none transition-all">
                {i18n.language.startsWith('ar') ? 'ابدأ الفرز!' : 'START SORTING!'}
              </button>
            </motion.div>
          </div>
        )}

        {/* RESULT overlay */}
        {showResult && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center max-w-xs mx-4 shadow-2xl"
            >
              <div className="text-6xl mb-3">{score > 200 ? '🏆' : score > 100 ? '⭐' : '💪'}</div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                {t('games.final_score', 'النتيجة النهائية')}
              </h2>
              <div className="text-5xl font-black text-green-600 mb-2">{score}</div>
              <div className="flex justify-center gap-4 text-sm text-gray-500 mb-6 font-bold">
                <span>🔥 {i18n.language.startsWith('ar') ? 'أفضل تتابع:' : 'Best Combo:'} x{maxCombo}</span>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 mb-4 text-start">
                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300">
                  {i18n.language.startsWith('ar') ? '💡 هل تعلم؟' : '💡 Did you know?'}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">{funFacts[Math.floor(Math.random() * funFacts.length)]}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={startGame} className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black shadow-[0_4px_0_0_rgba(21,128,61,1)] hover:bg-green-600 transition-all">
                  {t('games.play_again', 'العب مجدداً')}
                </button>
                <button onClick={onExit} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-2xl font-black hover:bg-gray-300 transition-all">
                  {t('games.exit', 'خروج')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* BIN BUTTONS */}
      <div className="grid shrink-0 z-10" style={{ gridTemplateColumns: `repeat(${LANES}, 1fr)` }}>
        {binLabels.map((item, index) => {
          const isContaminated = contaminated.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleBinClick(index)}
              disabled={!isPlaying}
              className={`h-28 flex flex-col items-center justify-center transition-all active:scale-95 border-t-4 relative overflow-hidden`}
              style={{
                backgroundColor: isContaminated ? '#FEE2E2' : `${binColors[index]}20`,
                borderColor: isContaminated ? '#EF4444' : binColors[index],
              }}
            >
              {isContaminated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500/20"
                />
              )}
              <span className="text-3xl mb-1">{isContaminated ? '☠️' : item.emoji}</span>
              <span className="font-black uppercase text-xs tracking-tight" style={{ color: isContaminated ? '#EF4444' : binColors[index] }}>
                {isContaminated ? (i18n.language.startsWith('ar') ? 'ملوث!' : 'CONTAMINATED') : t(`games.entities.${item.id}`, item.name)}
              </span>
              {isContaminated && (
                <span className="text-[9px] text-red-500 font-bold">
                  {i18n.language.startsWith('ar') ? 'مهلة 3 ثوانٍ' : '3s cooldown'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortingTemplate;
