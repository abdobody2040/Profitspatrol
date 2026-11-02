import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Star, Heart } from 'lucide-react';
import { BusinessSimulation } from '../../../../types';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface RhythmTemplateProps {
  config?: BusinessSimulation;
  onComplete: (score: number, data: any) => void;
}

const GAME_DURATION = 45; // seconds
const NOTE_FALL_TIME = 2000; // ms to reach hit zone
const HIT_WINDOW = 250; // ms tolerance
const LANE_COUNT = 4;

// Procedurally generate notes from BPM pattern
function generateNotes(bpm: number = 120, duration: number = GAME_DURATION): Array<{ time: number; lane: number }> {
  const notes: Array<{ time: number; lane: number }> = [];
  const beatInterval = 60 / bpm;
  let time = 1.5; // start after 1.5s intro

  // Generate a rhythm pattern
  const patterns = [
    [0, 2], // left, middle-right
    [1, 3], // middle-left, right
    [0, 1, 2, 3], // all lanes
    [0, 2, 1, 3], // alternating
    [0, 0, 1, 2], // doubled
  ];

  let patternIndex = 0;
  while (time < duration - 3) {
    const pattern = patterns[patternIndex % patterns.length];
    for (const lane of pattern) {
      notes.push({ time: Math.round(time * 100) / 100, lane });
      time += beatInterval * 0.5;
    }
    // Add some half-beat rests occasionally
    if (Math.random() < 0.3) time += beatInterval;
    patternIndex++;
  }
  return notes;
}

const RhythmTemplate: React.FC<RhythmTemplateProps> = ({ config, onComplete }) => {
  const { t } = useTranslation();
  const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

  const rhythmConfig = config?.rhythm_config;
  const themeColors = config?.visual_config?.colors || {
    primary: '#C084FC', secondary: '#7E22CE', accent: '#D8B4FE', background: '#111827',
  };

  // Generate notes if not provided
  const notes = useRef(
    rhythmConfig?.track?.notes?.length
      ? rhythmConfig.track.notes
      : generateNotes(rhythmConfig?.track?.bpm || 110, GAME_DURATION)
  );
  const trackDuration = rhythmConfig?.track?.duration || GAME_DURATION;

  // Lane visuals from rhythm_config or defaults
  const lanes = (rhythmConfig?.tracks || [
    { id: 'a', color: '#10B981', icon: '🟢', label: 'A' },
    { id: 'b', color: '#EF4444', icon: '🔴', label: 'B' },
    { id: 'c', color: '#3B82F6', icon: '🔵', label: 'C' },
    { id: 'd', color: '#FBBF24', icon: '🟡', label: 'D' },
  ]).slice(0, LANE_COUNT);

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [health, setHealth] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hitEffects, setHitEffects] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [notesHit, setNotesHit] = useState(0);
  const [notesMissed, setNotesMissed] = useState(0);
  const [crowdMood, setCrowdMood] = useState(50); // 0-100
  const [crowdReaction, setCrowdReaction] = useState('');
  const [feedbackLabel, setFeedbackLabel] = useState<{ text: string; lane: number } | null>(null);

  // Engine refs
  const startTimeRef = useRef(0);
  const hitNotesRef = useRef(new Set<string>());
  const animRef = useRef<number>();
  const visibleNotesRef = useRef<Array<{ id: string; lane: number; time: number; progress: number }>>([]);
  const [visibleNotes, setVisibleNotes] = useState<typeof visibleNotesRef.current>([]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current!);
    setShowResult(true);
    const finalScore = score + (health > 50 ? 200 : 0); // Bonus for surviving
    setTimeout(() => {
      onComplete(finalScore, { notesHit, notesMissed, maxCombo });
    }, 1000);
    if (health > 50) trigger('game_over_win');
    else trigger('game_over_lose');
  }, [score, health, notesHit, notesMissed, maxCombo, onComplete, trigger]);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setMultiplier(1);
    setHealth(100);
    setTimeElapsed(0);
    setNotesHit(0);
    setNotesMissed(0);
    setCrowdMood(50);
    setShowResult(false);
    hitNotesRef.current = new Set();
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    trigger('game_start');
  };

  // Game loop via RAF
  useEffect(() => {
    if (!isPlaying) return;
    const loop = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      setTimeElapsed(elapsed);

      if (elapsed >= trackDuration) {
        endGame();
        return;
      }

      // Notes visible in a 3-second window ahead
      const windowStart = elapsed - (NOTE_FALL_TIME / 1000) * 0.15;
      const windowEnd = elapsed + (NOTE_FALL_TIME / 1000) * 1.2;

      const active = notes.current
        .filter(n => n.time >= windowStart && n.time <= windowEnd && !hitNotesRef.current.has(`${n.time}_${n.lane}`))
        .map(n => ({
          id: `${n.time}_${n.lane}`,
          lane: n.lane,
          time: n.time,
          // progress: 0 = top, 1 = hit zone
          progress: (elapsed - n.time + NOTE_FALL_TIME / 1000) / (NOTE_FALL_TIME / 1000),
        }));

      // Check for missed notes (progress > 1.2)
      active.filter(n => n.progress > 1.15).forEach(n => {
        if (!hitNotesRef.current.has(n.id)) {
          hitNotesRef.current.add(n.id);
          setHealth(h => Math.max(0, h - 8));
          setCombo(0);
          setMultiplier(1);
          setNotesMissed(m => m + 1);
          setCrowdMood(m => Math.max(0, m - 5));
        }
      });

      setVisibleNotes(active.filter(n => n.progress < 1.15 && n.progress > -0.1));
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current!);
  }, [isPlaying, endGame, trackDuration]);

  const showHitEffect = (laneIndex: number, label: string) => {
    setHitEffects(prev => ({ ...prev, [laneIndex]: label }));
    setFeedbackLabel({ text: label, lane: laneIndex });
    setTimeout(() => {
      setHitEffects(prev => { const n = { ...prev }; delete n[laneIndex]; return n; });
      setFeedbackLabel(null);
    }, 250);
  };

  const handleLanePress = (laneIndex: number) => {
    if (!isPlaying) return;

    const now = timeElapsed;
    const hitNote = notes.current.find(n =>
      n.lane === laneIndex &&
      !hitNotesRef.current.has(`${n.time}_${n.lane}`) &&
      Math.abs(n.time - now) < (HIT_WINDOW / 1000)
    );

    if (hitNote) {
      hitNotesRef.current.add(`${hitNote.time}_${hitNote.lane}`);
      const accuracy = Math.abs(hitNote.time - now);
      const isPerfect = accuracy < 0.08;
      const pts = isPerfect ? 300 : 100;
      const label = isPerfect ? '✨ PERFECT!' : '👍 GOOD';

      setScore(s => s + pts * multiplier);
      setCombo(c => {
        const nc = c + 1;
        setMaxCombo(m => Math.max(m, nc));
        setMultiplier(Math.min(4, 1 + Math.floor(nc / 8)));
        if (nc === 8) trigger('streak_3');
        if (nc === 16) trigger('streak_5');
        if (nc >= 24) { setCrowdReaction('🔥 THE CROWD IS ON FIRE!'); setTimeout(() => setCrowdReaction(''), 2000); trigger('streak_7'); }
        return nc;
      });
      setHealth(h => Math.min(100, h + 3));
      setNotesHit(n => n + 1);
      setCrowdMood(m => Math.min(100, m + 3));
      showHitEffect(laneIndex, label);
    } else {
      // Miss click
      setCombo(0);
      setMultiplier(1);
      setHealth(h => Math.max(0, h - 3));
      setCrowdMood(m => Math.max(0, m - 2));
      showHitEffect(laneIndex, '💨 MISS');
    }
  };

  const timeProgress = Math.min((timeElapsed / trackDuration) * 100, 100);
  const getCrowdEmoji = () => {
    if (crowdMood > 80) return '🤩';
    if (crowdMood > 60) return '🔥';
    if (crowdMood > 40) return '👏';
    if (crowdMood > 20) return '😑';
    return '🥱';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none relative"
      style={{ backgroundColor: themeColors.background, color: 'white' }}
    >
      <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-center" />

      {/* HUD */}
      <div className="shrink-0 px-4 py-2 flex justify-between items-center z-10 border-b border-white/10"
        style={{ background: `linear-gradient(to bottom, ${themeColors.primary}cc, transparent)` }}>
        <div>
          <div className="text-2xl font-black tabular-nums">{score.toLocaleString()}</div>
          <div className="text-xs opacity-60 flex items-center gap-1">
            <Zap size={10} className="text-yellow-400" /> x{multiplier} MULT
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          {/* Progress bar */}
          <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${timeProgress}%` }} />
          </div>
          {/* Crowd mood */}
          <div className="flex items-center gap-1 text-xs">
            <span>{getCrowdEmoji()}</span>
            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" animate={{ width: `${crowdMood}%`, backgroundColor: crowdMood > 60 ? '#22C55E' : crowdMood > 30 ? '#F59E0B' : '#EF4444' }} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {/* Health bar */}
          <div className="flex items-center gap-1">
            <Heart size={12} className="text-red-400" />
            <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${health}%` }} />
            </div>
          </div>
          {combo > 1 && (
            <motion.div key={combo} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-xs font-black text-yellow-300 mt-1">
              🔥 {combo}x COMBO
            </motion.div>
          )}
        </div>
      </div>

      {/* Crowd reaction flash */}
      <AnimatePresence>
        {crowdReaction && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-20 left-0 right-0 flex justify-center z-30 pointer-events-none">
            <span className="bg-yellow-400 text-yellow-900 font-black text-sm px-4 py-1.5 rounded-full shadow-xl">{crowdReaction}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRACK AREA */}
      <div className="flex-1 relative flex" style={{ overflow: 'hidden' }}>
        {lanes.map((lane, i) => (
          <div key={i} className="flex-1 relative border-e border-white/10 last:border-e-0">
            {/* Hit zone */}
            <div className="absolute bottom-4 start-1 end-1 h-14 rounded-xl border-2 border-white/30 bg-white/5" />

            {/* Hit flash effect */}
            {hitEffects[i] && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 start-1 end-1 h-14 rounded-xl"
                style={{ backgroundColor: `${lane.color}60` }}
              />
            )}

            {/* Feedback label */}
            <AnimatePresence>
              {feedbackLabel?.lane === i && (
                <motion.div
                  key={feedbackLabel.text}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-20 left-0 right-0 text-center text-xs font-black pointer-events-none z-10"
                  style={{ color: feedbackLabel.text.includes('MISS') ? '#9CA3AF' : lane.color }}
                >
                  {feedbackLabel.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Falling notes */}
        {visibleNotes.map(note => {
          const lane = lanes[note.lane];
          if (!lane) return null;
          const topPct = Math.min(Math.max(note.progress * 85, -5), 95);
          return (
            <div
              key={note.id}
              className="absolute h-10 rounded-xl border-2 border-white/40 shadow-lg flex items-center justify-center text-lg font-black transition-none"
              style={{
                left: `${(note.lane / LANE_COUNT) * 100}%`,
                width: `${100 / LANE_COUNT}%`,
                top: `${topPct}%`,
                backgroundColor: lane.color,
                boxShadow: `0 0 12px ${lane.color}80`,
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              {lane.icon}
            </div>
          );
        })}
      </div>

      {/* TAP BUTTONS */}
      <div className="shrink-0 h-28 grid border-t border-white/10"
        style={{ gridTemplateColumns: `repeat(${LANE_COUNT}, 1fr)` }}>
        {lanes.map((lane, i) => (
          <button
            key={i}
            className="relative flex flex-col items-center justify-center active:opacity-70 transition-opacity touch-manipulation border-e border-white/10 last:border-e-0"
            style={{ backgroundColor: `${lane.color}15` }}
            onPointerDown={() => handleLanePress(i)}
          >
            <span className="text-2xl">{lane.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-1">{lane.label}</span>
            {hitEffects[i] && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: lane.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* START / RESULT OVERLAY */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {showResult ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center">
              <div className="text-5xl mb-3">{health > 50 ? '🏆' : '😅'}</div>
              <h2 className="text-2xl font-black mb-1">{health > 50 ? 'Great Show!' : 'The crowd left early...'}</h2>
              <div className="text-4xl font-black text-white mb-3">{score.toLocaleString()}</div>
              <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                <div className="bg-white/10 rounded-xl p-2"><div className="font-black text-green-400">{notesHit}</div><div className="text-xs opacity-50">Hit</div></div>
                <div className="bg-white/10 rounded-xl p-2"><div className="font-black text-red-400">{notesMissed}</div><div className="text-xs opacity-50">Missed</div></div>
                <div className="bg-white/10 rounded-xl p-2"><div className="font-black text-yellow-400">x{maxCombo}</div><div className="text-xs opacity-50">Best Combo</div></div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 mb-4 text-xs text-left">
                <p className="font-bold">💡 Business Lesson:</p>
                <p className="opacity-70 mt-1">Musicians make money from 3 streams: Touring 🎤, Merch 👕, and Streaming 🎵. Diversify revenue just like a smart investor!</p>
              </div>
              <div className="flex gap-3">
                <button onClick={startGame} className="flex-1 py-3 bg-white text-black rounded-2xl font-black hover:opacity-90">Again!</button>
                <button onClick={() => onComplete(score, {})} className="flex-1 py-3 bg-white/10 text-white rounded-2xl font-black hover:bg-white/20">Exit</button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center">
              <div className="text-5xl mb-4">{config?.visual_config?.icon || '🎸'}</div>
              <h2 className="text-2xl font-black text-white mb-2">{config?.name || 'Rhythm Challenge'}</h2>
              <p className="text-gray-400 text-sm mb-4">{config?.description}</p>
              <div className="bg-white/5 rounded-xl p-3 mb-6 text-sm">
                <p className="text-gray-300">Tap the lane buttons when notes reach the hit zone!</p>
                <p className="text-xs text-gray-500 mt-1">Perfect timing = 3x points ✨</p>
              </div>
              <div className="flex gap-2 justify-center mb-6">
                {lanes.map((l, i) => (
                  <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border-2" style={{ backgroundColor: `${l.color}30`, borderColor: l.color }}>
                    {l.icon}
                  </div>
                ))}
              </div>
              <button onClick={startGame} className="w-full py-4 text-xl font-black rounded-2xl text-white flex items-center justify-center gap-2 shadow-[0_6px_0_0_rgba(0,0,0,0.4)] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all" style={{ backgroundColor: themeColors.primary }}>
                <Play size={24} fill="white" /> Start Performance!
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default RhythmTemplate;
