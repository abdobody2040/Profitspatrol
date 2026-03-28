import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Music, Play, Zap, Star } from 'lucide-react';
import { BusinessSimulation, RhythmTrack } from '../../../../types';

interface RhythmTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const DEFAULT_TRACK: RhythmTrack = {
    id: 'default', name: 'Tutorial Beat', bpm: 100, duration: 45, lanes: 4,
    notes: []
};

const RhythmTemplate: React.FC<RhythmTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const track = config?.rhythm_config?.track || DEFAULT_TRACK;
    const themeColors = config?.visual_config?.colors || {
        primary: '#C084FC', secondary: '#7E22CE', accent: '#D8B4FE', background: '#111827'
    };

    // GAME STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [health, setHealth] = useState(100);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // ENGINE
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>(0);
    const noteSpeed = 2000; // ms to fall
    const hitWindow = 150; // ms

    // Render Stats
    const [visibleNotes, setVisibleNotes] = useState<{ id: string, lane: number, progress: number, hit: boolean }[]>([]);

    useEffect(() => {
        if (!isPlaying) return;

        startTimeRef.current = Date.now() - (timeElapsed * 1000); // Resume capability

        const loop = () => {
            const now = Date.now();
            const elapsedSec = (now - startTimeRef.current) / 1000;
            setTimeElapsed(elapsedSec);

            if (elapsedSec >= track.duration) {
                endGame();
                return;
            }

            // Update Notes
            const windowStart = elapsedSec - 0.5;
            const windowEnd = elapsedSec + 2.0;

            const activeNotes = track.notes.filter((n: any) => n.time >= windowStart && n.time <= windowEnd).map((n: any, i: number) => ({
                id: `note_${n.time}_${n.lane}`,
                lane: n.lane,
                // Progress: 0 (top) to 1 (hit line). 
                progress: 1 - ((n.time - elapsedSec) / (noteSpeed / 1000)),
                hit: false // track hit status in ref if redundant
            }));

            setVisibleNotes(activeNotes as any); // Type hacking for speed

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [isPlaying, track]);

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setCombo(0);
        setMultiplier(1);
        setHealth(100);
        setTimeElapsed(0);
    };

    const endGame = () => {
        setIsPlaying(false);
        setTimeout(() => {
            onComplete(score, { notesHit: Math.floor(score / 100), maxCombo: combo });
        }, 1000);
    };

    const handleLaneClick = (laneIndex: number) => {
        if (!isPlaying) return;

        // Check for notes in hit window (Progress ~ 1.0)
        // Hit window +/- 0.15s

        const currentTime = timeElapsed;

        const hitNote = track.notes.find((n: any) =>
            n.lane === laneIndex &&
            Math.abs(n.time - currentTime) < (hitWindow / 1000)
        );

        if (hitNote) {
            triggerHitEffect(laneIndex);

            const accuracy = Math.abs(hitNote.time - currentTime);
            let pScore = 100;
            if (accuracy < 0.05) pScore = 300; // Perfect

            setScore(s => s + (pScore * multiplier));
            setCombo(c => c + 1);
            setMultiplier(m => Math.min(4, 1 + Math.floor((combo + 1) / 10)));
            setHealth(h => Math.min(100, h + 5));
        } else {
            // Miss click?
            setCombo(0);
            setMultiplier(1);
            setHealth(h => Math.max(0, h - 5));
        }
    };

    const [hitEffects, setHitEffects] = useState<number[]>([]);
    const triggerHitEffect = (lane: number) => {
        setHitEffects(prev => [...prev, lane]);
        setTimeout(() => setHitEffects(prev => prev.filter(l => l !== lane)), 200);
    };

    // Lane Keys
    const lanes = Array(track.lanes).fill(0);

    return (
        <div className="flex flex-col h-full rounded-3xl overflow-hidden border-2 select-none relative"
            style={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
        >
            {/* HUD */}
            <div className="flex justify-between items-center p-4 z-10 text-white" style={{ background: `linear-gradient(to bottom, ${themeColors.primary}, transparent)` }}>
                <div className="flex flex-col">
                    <span className="text-3xl font-black font-mono tracking-widest">{score.toLocaleString()}</span>
                    <span className="text-xs uppercase opacity-70 flex items-center gap-1">
                        <Zap size={12} className="text-yellow-400" /> x{multiplier} Multiplier
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                        <motion.div
                            className="h-full bg-green-500"
                            animate={{ width: `${health}%`, backgroundColor: health < 30 ? '#EF4444' : '#22C55E' }}
                        />
                    </div>
                </div>
            </div>

            {/* TRACK AREA */}
            <div className="flex-1 relative flex justify-center perspective-[500px]">
                <div
                    className="w-full max-w-md h-full relative flex transform-style-3d rotate-x-20"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, transparent 0%, ${themeColors.primary}20 100%)`,
                        borderLeft: '2px solid white',
                        borderRight: '2px solid white'
                    }}
                >
                    {/* LANES */}
                    {lanes.map((_, i) => (
                        <div key={i} className="flex-1 border-r border-white/10 h-full relative">
                            {/* HIT ZONE */}
                            <div className="absolute bottom-4 left-2 right-2 h-16 border-4 rounded-xl border-white/50 bg-white/5" />

                            {/* HIT EFFECT */}
                            {hitEffects.includes(i) && (
                                <div className="absolute bottom-4 left-2 right-2 h-16 bg-white/50 animate-ping rounded-xl" />
                            )}
                        </div>
                    ))}
                    <div className="absolute inset-0 border-r border-white/10 pointer-events-none" />{/* Right border adjustment */}

                    {/* NOTES */}
                    {visibleNotes.map((note, i) => {
                        // Don't render if passed
                        if (note.progress > 1.2) return null;

                        return (
                            <div
                                key={note.id}
                                className="absolute h-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center text-white font-bold"
                                style={{
                                    left: `${(note.lane / track.lanes) * 100}%`,
                                    width: `${100 / track.lanes}%`,
                                    top: `${note.progress * 90}%`, // 90% is the hit line usually
                                    opacity: note.progress < 0 ? 0 : 1,
                                    backgroundColor: i % 2 === 0 ? themeColors.accent : themeColors.secondary // Alternating colors
                                }}
                            >
                                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white" />
                            </div>
                        );
                    })}

                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <button onClick={startGame} className="bg-white text-black px-12 py-6 rounded-full font-black text-2xl hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                <Play size={40} fill="black" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CONTROLS (Mobile Tap Zones) */}
            <div className="h-32 grid grid-cols-4 gap-1 p-2 bg-gray-900 border-t border-gray-700">
                {lanes.map((_, i) => (
                    <button
                        key={i}
                        className="bg-gray-800 rounded-xl active:bg-gray-600 transition-colors flex items-center justify-center relative touch-manipulation"
                        onPointerDown={() => handleLaneClick(i)} // Pointer down for faster response
                    >
                        <div className="w-12 h-12 rounded-full border border-gray-600 absolute bottom-4 opacity-50" />
                    </button>
                ))}
            </div>

        </div>
    );
};

export default RhythmTemplate;

