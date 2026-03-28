import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { X, Star, Clock, Trophy, Zap, Gift } from 'lucide-react';
import { useAppStore } from '../../../store';

// ─── Season Definitions ───────────────────────────────────────────────────────
interface SeasonalChallenge {
    id: string;
    title: string;
    desc: string;
    icon: string;
    reward: { type: 'coins' | 'xp'; value: number };
}

interface SeasonEvent {
    id: string;
    name: string;
    icon: string;
    emoji: string;
    gradient: string;  // CSS gradient
    textColor: string;
    // Month range [start, end] inclusive (1-based)
    months: [number, number];
    tagline: string;
    bonusXPMultiplier: number; // applied during event
    challenges: SeasonalChallenge[];
    exclusiveReward: { name: string; emoji: string };
}

const SEASON_EVENTS: SeasonEvent[] = [
    {
        id: 'halloween',
        name: 'BizPocalypse Halloween',
        icon: '🎃',
        emoji: '🕷️',
        gradient: 'linear-gradient(135deg, #1a0a00, #4a1a00, #7c2d00)',
        textColor: '#FF8C00',
        months: [10, 10],
        tagline: 'Trick or Treat — earn candy coins!',
        bonusXPMultiplier: 1.5,
        challenges: [
            { id: 'hw1', title: 'Haunted Pitch', desc: 'Complete a Pitch Simulator in the dark!', icon: '👻', reward: { type: 'coins', value: 200 } },
            { id: 'hw2', title: 'Monster Market', desc: 'Buy 3 stocks this week', icon: '🧟', reward: { type: 'xp', value: 300 } },
            { id: 'hw3', title: 'Zombie Boss', desc: 'Complete the Weekly CEO Challenge', icon: '🧠', reward: { type: 'coins', value: 500 } },
        ],
        exclusiveReward: { name: 'Witch Hat', emoji: '🧙' },
    },
    {
        id: 'christmas',
        name: 'BizMas Season',
        icon: '🎄',
        emoji: '⛄',
        gradient: 'linear-gradient(135deg, #023c1a, #0a5c2b, #1a8a40)',
        textColor: '#FFD700',
        months: [12, 12],
        tagline: 'Season of giving — and earning!',
        bonusXPMultiplier: 2,
        challenges: [
            { id: 'xm1', title: 'Gift Gig', desc: 'Complete 2 gigs today', icon: '🎁', reward: { type: 'coins', value: 300 } },
            { id: 'xm2', title: 'Snowflake Deal', desc: 'Read 5 BizPulse articles', icon: '❄️', reward: { type: 'xp', value: 400 } },
            { id: 'xm3', title: 'Santa CEO', desc: 'Reach Level 10 or above', icon: '🎅', reward: { type: 'coins', value: 750 } },
        ],
        exclusiveReward: { name: 'Santa Blazer', emoji: '🎅' },
    },
    {
        id: 'eid',
        name: 'Eid BizFest',
        icon: '🌙',
        emoji: '✨',
        gradient: 'linear-gradient(135deg, #0d1b4b, #1a3080, #2651c4)',
        textColor: '#FFD700',
        months: [3, 4], // Approximate – Ramadan/Eid varies
        tagline: 'عيد مبارك — Keep building!',
        bonusXPMultiplier: 1.75,
        challenges: [
            { id: 'eid1', title: 'Crescent Deal', desc: 'Earn 500 BizCoins in one day', icon: '🌙', reward: { type: 'coins', value: 400 } },
            { id: 'eid2', title: 'Lantern Lesson', desc: 'Complete 3 lessons this week', icon: '🪔', reward: { type: 'xp', value: 500 } },
            { id: 'eid3', title: 'Eid CEO', desc: 'Spin the daily wheel 3 days in a row', icon: '🎆', reward: { type: 'coins', value: 600 } },
        ],
        exclusiveReward: { name: 'Golden Kaftan', emoji: '✨' },
    },
    {
        id: 'summer',
        name: 'BizSummer Blitz',
        icon: '☀️',
        emoji: '🌊',
        gradient: 'linear-gradient(135deg, #1a4f7a, #0ea5e9, #38bdf8)',
        textColor: '#FFD700',
        months: [6, 8],
        tagline: 'School\'s out — hustle never stops!',
        bonusXPMultiplier: 1.25,
        challenges: [
            { id: 'su1', title: 'Beach Pitch', desc: 'Complete a Coop Pitch Mode', icon: '🏖️', reward: { type: 'coins', value: 250 } },
            { id: 'su2', title: 'Ice Cream Corp', desc: 'Create or join a Corporation', icon: '🍦', reward: { type: 'xp', value: 350 } },
            { id: 'su3', title: 'Summer CEO', desc: 'Reach top 10 on the leaderboard', icon: '🏆', reward: { type: 'coins', value: 600 } },
        ],
        exclusiveReward: { name: 'Surf Hoodie', emoji: '🏄' },
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCurrentEvent(): SeasonEvent | null {
    const month = new Date().getMonth() + 1; // 1-based
    return SEASON_EVENTS.find(e => month >= e.months[0] && month <= e.months[1]) ?? null;
}

function getMonthName(m: number): string {
    return new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' });
}

// ─── Challenge Card ───────────────────────────────────────────────────────────
function ChallengeCard({
    challenge, done, accent, onClaim
}: { challenge: SeasonalChallenge; done: boolean; accent: string; onClaim: () => void }) {
    return (
        <motion.div whileHover={{ scale: done ? 1 : 1.02 }}
            className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${done ? 'opacity-60 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' : 'border-white/20 bg-white/10'}`}>
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                {done ? '✅' : challenge.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-black text-sm" style={{ color: done ? '#9CA3AF' : 'white' }}>{challenge.title}</p>
                <p className="text-xs opacity-70" style={{ color: done ? '#6B7280' : 'white' }}>{challenge.desc}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: accent }}>
                    +{challenge.reward.value} {challenge.reward.type === 'coins' ? '🪙' : '⚡ XP'}
                </p>
            </div>
            {!done && (
                <button onClick={onClaim}
                    className="text-xs font-black px-3 py-1.5 rounded-xl text-white shrink-0"
                    style={{ background: accent }}>
                    Claim
                </button>
            )}
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface SeasonalEventProps { onClose?: () => void; }

export const SeasonalEvent: React.FC<SeasonalEventProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, claimSeasonalChallenge } = useAppStore();

    const [selectedEvent, setSelectedEvent] = useState<SeasonEvent | null>(() => getCurrentEvent());
    const event = selectedEvent ?? SEASON_EVENTS[0];

    const completedIds: string[] = user?.completedSeasonalChallenges ?? [];

    const allDone = useMemo(() =>
        event.challenges.every(c => completedIds.includes(c.id)),
        [event, completedIds]
    );

    const handleClaim = (challenge: SeasonalChallenge) => {
        if (completedIds.includes(challenge.id)) return;
        claimSeasonalChallenge(challenge.id, challenge.reward);
        confetti({
            particleCount: 60,
            spread: 80,
            colors: ['#FFD700', '#FF8C00', '#ffffff'],
            origin: { y: 0.6 },
        });
    };

    return (
        <div className="flex flex-col gap-0 rounded-2xl overflow-hidden" style={{ minWidth: 300 }}>
            {/* Event Banner */}
            <div className="relative p-5 flex flex-col gap-2" style={{ background: event.gradient }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{event.icon}</span>
                        <div>
                            <p className="font-black text-white text-base leading-tight">{event.name}</p>
                            <p className="text-xs opacity-70 text-white">{event.tagline}</p>
                        </div>
                    </div>
                    {onClose && <button onClick={onClose} className="text-white/60 hover:text-white p-1"><X size={16} /></button>}
                </div>

                {/* Bonus XP pill */}
                <div className="flex gap-2 flex-wrap mt-1">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/20 text-white flex items-center gap-1">
                        <Zap size={10} /> {event.bonusXPMultiplier}× XP during event
                    </span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/20 text-white flex items-center gap-1">
                        <Gift size={10} /> {event.exclusiveReward.emoji} {event.exclusiveReward.name}
                    </span>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Season Challenges</span>
                        <span>{completedIds.filter(id => event.challenges.find(c => c.id === id)).length}/{event.challenges.length}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedIds.filter(id => event.challenges.find(c => c.id === id)).length / event.challenges.length) * 100}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }} />
                    </div>
                </div>
            </div>

            {/* Event Selector tabs */}
            <div className="flex gap-1 p-3 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
                {SEASON_EVENTS.map(ev => {
                    const active = ev.id === event.id;
                    const isCurrent = getCurrentEvent()?.id === ev.id;
                    return (
                        <button key={ev.id} onClick={() => setSelectedEvent(ev)}
                            className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all font-bold text-xs ${active ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            <span className="text-xl">{ev.icon}</span>
                            <span>{getMonthName(ev.months[0]).slice(0, 3)}</span>
                            {isCurrent && <span className="text-[9px] text-green-400 font-black">LIVE</span>}
                        </button>
                    );
                })}
            </div>

            {/* Challenges */}
            <div className="p-4 space-y-3" style={{ background: event.gradient }}>
                {allDone && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-3 rounded-2xl bg-white/20 mb-2">
                        <p className="text-2xl mb-1">🏆</p>
                        <p className="font-black text-white text-sm">Event Mastered!</p>
                        <p className="text-xs text-white/70">Collect your {event.exclusiveReward.emoji} {event.exclusiveReward.name}!</p>
                    </motion.div>
                )}
                {event.challenges.map(ch => (
                    <ChallengeCard key={ch.id} challenge={ch}
                        done={completedIds.includes(ch.id)}
                        accent={event.textColor}
                        onClaim={() => handleClaim(ch)} />
                ))}
            </div>

            <p className="text-center text-xs py-2 bg-gray-50 dark:bg-gray-900 text-gray-400">
                Complete all challenges to unlock {event.exclusiveReward.emoji} {event.exclusiveReward.name}
            </p>
        </div>
    );
};

export default SeasonalEvent;
