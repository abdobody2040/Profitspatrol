import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, AlertCircle } from "lucide-react";
import { BusinessSimulation, RepairConfig } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface RepairTemplateProps {
  config?: BusinessSimulation;
  onComplete: (score: number, data: any) => void;
}

interface RepairPart {
  id: string;
  name: string;
  icon: string;
  initial_pos: { x: number; y: number };
  target_pos: { x: number; y: number };
  isDecoy?: boolean;
  wrongMessage?: string;
}

const DEFAULT_CONFIG: RepairConfig = {
  parts: [
    { id: 'p1', name: 'Battery', icon: '🔋', initial_pos: { x: 15, y: 75 }, target_pos: { x: 45, y: 45 } },
    { id: 'p2', name: 'Screen', icon: '📲', initial_pos: { x: 75, y: 75 }, target_pos: { x: 55, y: 45 } },
  ],
  bg_color: '#1f2937',
};

const DECOY_ITEMS = [
  { id: 'decoy_1', name: 'Old Nokia Charger', icon: '🔌', wrongMessage: "😬 That's a charger for a 2007 Nokia. Nice try!" },
  { id: 'decoy_2', name: 'Paperclip', icon: '📎', wrongMessage: '😂 A paperclip? This is a tech repair, not arts & crafts!' },
  { id: 'decoy_3', name: 'Banana', icon: '🍌', wrongMessage: "🍌 A BANANA?! That's... not a part. Are you ok?" },
  { id: 'decoy_4', name: 'Hammer', icon: '🔨', wrongMessage: "🔨 If you use a hammer on that phone, I quit." },
];

const FUNNY_ERRORS = [
  "That doesn't snap in. You're basically folding laundry here.",
  "Wrong! Even my grandma knows that doesn't fit.",
  "Nice try! The phone battery goes in the phone, not the coffee mug.",
];

const TIME_PER_LEVEL = [70, 55, 40]; // seconds per level

const RepairTemplate: React.FC<RepairTemplateProps> = ({ config, onComplete }) => {
  const { t } = useTranslation();
  const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();
  const repairConfig = config?.repair_config || DEFAULT_CONFIG;
  const themeColor = config?.visual_config?.colors?.primary || '#3B82F6';
  const bgColor = repairConfig.bg_color || '#1f2937';

  const [level, setLevel] = useState(1);
  const [completedParts, setCompletedParts] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_LEVEL[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customerReaction, setCustomerReaction] = useState('😐');
  const [allPartsWithDecoys, setAllPartsWithDecoys] = useState<RepairPart[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Build parts for current level (add decoys at higher levels)
  const buildPartsForLevel = useCallback((lvl: number) => {
    const realParts = repairConfig.parts.map(p => ({ ...p, isDecoy: false }));
    const decoyCount = lvl - 1; // Level 1: 0 decoys, Level 2: 1, Level 3: 2
    const shuffledDecoys = [...DECOY_ITEMS].sort(() => Math.random() - 0.5).slice(0, decoyCount);

    const decoys: RepairPart[] = shuffledDecoys.map((d, i) => ({
      id: d.id,
      name: d.name,
      icon: d.icon,
      initial_pos: { x: 20 + i * 30 + Math.random() * 15, y: 60 + Math.random() * 15 },
      target_pos: { x: 50, y: 50 },
      isDecoy: true,
      wrongMessage: d.wrongMessage,
    }));

    // Randomize real part positions at higher levels
    const repositioned = realParts.map(p => ({
      ...p,
      initial_pos: lvl > 1
        ? { x: 10 + Math.random() * 70, y: 55 + Math.random() * 25 }
        : p.initial_pos,
    }));

    return [...repositioned, ...decoys].sort(() => Math.random() - 0.5);
  }, [repairConfig.parts]);

  const startGame = (lvl = 1) => {
    setLevel(lvl);
    setCompletedParts([]);
    setTimeLeft(TIME_PER_LEVEL[lvl - 1] || 40);
    setIsPlaying(true);
    setShowResult(false);
    setErrorMessage(null);
    setCustomerReaction('😐');
    setAllPartsWithDecoys(buildPartsForLevel(lvl));
    trigger('game_start');
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 2000);
    setCustomerReaction('😤');
    setTimeout(() => setCustomerReaction('😐'), 2500);
  };

  const handleWin = useCallback(() => {
    setIsPlaying(false);
    const levelScore = 100 + timeLeft * 10;
    setTotalScore(prev => prev + levelScore);
    setCustomerReaction('🤩');

    if (level < 3) {
      // Next level!
      trigger('good_decision');
      setTimeout(() => startGame(level + 1), 1500);
    } else {
      // Game complete
      const finalScore = totalScore + levelScore;
      setShowResult(true);
      trigger('game_over_win');
      setTimeout(() => onComplete(finalScore, { completed: true, levels: level }), 1000);
    }
  }, [level, timeLeft, totalScore, onComplete, trigger]);

  // Check win condition
  useEffect(() => {
    const realParts = repairConfig.parts.map(p => p.id);
    if (isPlaying && realParts.every(id => completedParts.includes(id))) {
      handleWin();
    }
  }, [completedParts, isPlaying, handleWin, repairConfig.parts]);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setShowResult(true);
          setCustomerReaction('😡');
          onComplete(totalScore, { completed: false });
          trigger('game_over_lose');
          return 0;
        }
        if (prev <= 10) setCustomerReaction('😰');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, totalScore, onComplete, trigger]);

  const handleDragEnd = (partId: string, info: any) => {
    if (!containerRef.current) return;
    const part = allPartsWithDecoys.find(p => p.id === partId);
    if (!part) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const x = ((info.point.x - bounds.left) / bounds.width) * 100;
    const y = ((info.point.y - bounds.top) / bounds.height) * 100;

    if (part.isDecoy) {
      showError(part.wrongMessage || FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)]);
      trigger('bad_decision');
      return;
    }

    const dist = Math.sqrt(Math.pow(x - part.target_pos.x, 2) + Math.pow(y - part.target_pos.y, 2));
    if (dist < 12) {
      setCompletedParts(prev => [...prev, partId]);
      setCustomerReaction('😊');
    }
  };

  const realParts = repairConfig.parts;
  const completedCount = realParts.filter(p => completedParts.includes(p.id)).length;

  return (
    <div className="flex flex-col h-full rounded-xl md:rounded-3xl overflow-hidden border-2 select-none relative"
      style={{ borderColor: themeColor }}>
      <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

      {/* HUD */}
      <div className="text-white p-3 flex justify-between items-center shadow-2xl shrink-0" style={{ backgroundColor: themeColor }}>
        <div className="flex items-center gap-3">
          {/* Customer avatar */}
          <motion.div animate={{ rotate: customerReaction === '😤' ? [-5, 5, -5, 0] : 0 }} className="text-3xl">{customerReaction}</motion.div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest opacity-70">Repairs</div>
            <div className="font-black text-xl">{completedCount}/{realParts.length}</div>
          </div>
        </div>

        {/* Level indicator */}
        <div className="flex gap-1">
          {[1, 2, 3].map(l => (
            <div key={l} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 ${l <= level ? 'bg-white text-gray-800 border-white' : 'border-white/30 text-white/30'}`}>{l}</div>
          ))}
        </div>

        <div className={`font-black text-2xl tabular-nums ${timeLeft < 10 ? 'text-red-300 animate-pulse' : ''}`}>
          {timeLeft}s
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="bg-red-500 text-white text-xs font-bold px-4 py-2 text-center shrink-0 flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag board */}
      <div ref={containerRef} className="flex-1 relative touch-none" style={{ backgroundColor: bgColor }}>
        {/* Target zones */}
        {realParts.map(part => (
          <div key={`target-${part.id}`}
            className="absolute flex items-center justify-center"
            style={{ left: `${part.target_pos.x}%`, top: `${part.target_pos.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-20 h-20 rounded-full border-4 border-dashed flex items-center justify-center text-3xl transition-all ${completedParts.includes(part.id) ? 'border-green-400 bg-green-500/20' : 'border-white/30 opacity-50'}`}>
              {completedParts.includes(part.id) ? <Check className="text-green-400 w-10 h-10" /> : <span className="grayscale opacity-50">{part.icon}</span>}
            </div>
            <div className="absolute -bottom-6 text-white/50 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{part.name}</div>
          </div>
        ))}

        {/* Draggable parts */}
        {allPartsWithDecoys.map(part => {
          const isDone = completedParts.includes(part.id);
          if (isDone) return null;

          return (
            <motion.div
              key={part.id}
              drag={!isDone}
              dragMomentum={false}
              onDragEnd={(_, info) => handleDragEnd(part.id, info)}
              initial={{ left: `${part.initial_pos.x}%`, top: `${part.initial_pos.y}%`, x: '-50%', y: '-50%' }}
              className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-xl cursor-grab active:cursor-grabbing border-4 z-20 ${part.isDecoy ? 'bg-gray-600/80 border-gray-500 opacity-70' : 'bg-gray-700/80 border-white/50 hover:border-yellow-400'} transition-colors`}
              whileDrag={{ scale: 1.2, zIndex: 50 }}
              whileHover={{ scale: 1.05 }}
            >
              {part.icon}
              {part.isDecoy && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-black">?</div>}
            </motion.div>
          );
        })}

        {/* Instruction */}
        {isPlaying && (
          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Drag real parts to their targets • Avoid decoys!</p>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 text-center shrink-0">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Score: {totalScore} | Level {level}/3</p>
      </div>

      {/* Start overlay */}
      {!isPlaying && !showResult && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">{config?.visual_config?.icon || '🔧'}</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{config?.name || 'Repair Challenge'}</h2>
            <p className="text-gray-500 text-sm mb-3">Drag the real parts to their matching targets!</p>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-3 mb-5 text-sm text-left">
              <p className="font-bold text-orange-700 dark:text-orange-300">⚠️ Watch out for decoys!</p>
              <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">Higher levels add fake parts to confuse you. Don't drop a banana in the phone slot!</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2 mb-4 text-xs text-blue-700 dark:text-blue-300 font-bold">
              💡 Apple's repair service generates $6B+ per year. After-sales service = goldmine!
            </div>
            <button onClick={() => startGame(1)} className="w-full py-4 text-white font-black text-lg rounded-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all" style={{ backgroundColor: themeColor }}>
              Start Repairing!
            </button>
          </motion.div>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-2">{completedCount === realParts.length && level === 3 ? '🏆' : '💪'}</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
              {completedCount === realParts.length && level === 3 ? 'Master Technician!' : 'Time\'s Up!'}
            </h2>
            <div className="text-4xl font-black text-blue-600 mb-3">{totalScore}</div>
            <button onClick={() => onComplete(totalScore, {})} className="w-full py-3 text-white font-black rounded-2xl" style={{ backgroundColor: themeColor }}>
              Continue →
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RepairTemplate;
