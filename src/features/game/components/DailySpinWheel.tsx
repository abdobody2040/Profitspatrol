import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Gift, Clock, Zap, Star, Coins, Shield } from 'lucide-react';
import { useAppStore } from '../../../store';
import { getToday } from '../../../utils/gameUtils';

// --- Prize Definitions ---
export interface SpinPrize {
    id: string;
    label: string;
    type: 'coins' | 'xp' | 'item' | 'jackpot' | 'shield';
    value: number;
    color: string;
    bgColor: string;
    emoji: string;
    weight: number; // Higher = more likely
}

const PRIZES: SpinPrize[] = [
    { id: 'coins_50', label: '50 🪙', type: 'coins', value: 50, color: '#FFDE00', bgColor: '#FFF7C0', emoji: '🪙', weight: 25 },
    { id: 'xp_50', label: '50 ⚡', type: 'xp', value: 50, color: '#58CC02', bgColor: '#D7F5BE', emoji: '⚡', weight: 25 },
    { id: 'coins_100', label: '100 🪙', type: 'coins', value: 100, color: '#FF9500', bgColor: '#FFE8C0', emoji: '🪙', weight: 18 },
    { id: 'xp_100', label: '100 ⚡', type: 'xp', value: 100, color: '#1CB0F6', bgColor: '#C3EEFF', emoji: '⚡', weight: 18 },
    { id: 'coins_200', label: '200 🪙', type: 'coins', value: 200, color: '#CE82FF', bgColor: '#F0D9FF', emoji: '🪙', weight: 8 },
    { id: 'shield', label: 'Shield 🛡️', type: 'shield', value: 1, color: '#FF4B4B', bgColor: '#FFD6D6', emoji: '🛡️', weight: 4 },
    { id: 'coins_500', label: '500 🪙', type: 'coins', value: 500, color: '#FF6B35', bgColor: '#FFE4D9', emoji: '💰', weight: 1 }, // Jackpot
    { id: 'xp_200', label: '200 ⚡', type: 'xp', value: 200, color: '#843FA1', bgColor: '#E8D5F5', emoji: '⚡', weight: 1 },
];

const TOTAL_WEIGHT = PRIZES.reduce((acc, p) => acc + p.weight, 0);

function pickPrize(): SpinPrize {
    let rand = Math.random() * TOTAL_WEIGHT;
    for (const prize of PRIZES) {
        rand -= prize.weight;
        if (rand <= 0) return prize;
    }
    return PRIZES[0];
}

// Map prize type to a Lucide icon for the legend
function PrizeIcon({ prize, size = 20 }: { prize: SpinPrize; size?: number }) {
    const style = { color: prize.color };
    if (prize.type === 'shield') return <Shield size={size} style={style} />;
    if (prize.type === 'xp') return <Zap size={size} style={style} />;
    if (prize.type === 'jackpot') return <Gift size={size} style={style} />;
    if (prize.id === 'coins_500') return <Gift size={size} style={style} />;  // jackpot
    // default: coins
    return <Coins size={size} style={style} />;
}

// --- Countdown Timer Hook ---
function useCountdown(targetDate: string | null): string {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const update = () => {
            if (!targetDate) { setTimeLeft(''); return; }
            const now = new Date();
            const tomorrow = new Date(targetDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow.getTime() - now.getTime();
            if (diff <= 0) { setTimeLeft(''); return; }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
}

// --- SVG Spinning Wheel ---
const WHEEL_SIZE = 260;
const WHEEL_RADIUS = WHEEL_SIZE / 2;
const NUM_SEGMENTS = PRIZES.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

function WheelSVG({ rotation }: { rotation: number }) {
    return (
        <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} style={{ transform: `rotate(${rotation}deg)`, transition: 'none', display: 'block' }}>
            {PRIZES.map((prize, i) => {
                const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const x1 = WHEEL_RADIUS + WHEEL_RADIUS * Math.cos(startAngle);
                const y1 = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(startAngle);
                const x2 = WHEEL_RADIUS + WHEEL_RADIUS * Math.cos(endAngle);
                const y2 = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(endAngle);
                const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
                const textR = WHEEL_RADIUS * 0.60;
                const tx = WHEEL_RADIUS + textR * Math.cos(midAngle);
                const ty = WHEEL_RADIUS + textR * Math.sin(midAngle);
                return (
                    <g key={prize.id}>
                        <path
                            d={`M ${WHEEL_RADIUS} ${WHEEL_RADIUS} L ${x1} ${y1} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${x2} ${y2} Z`}
                            fill={prize.color}
                            stroke="#fff"
                            strokeWidth={2}
                        />
                        <text
                            x={tx}
                            y={ty}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={22}
                            fontFamily="'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif"
                            fill="white"
                            style={{ userSelect: 'none', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                            transform={`rotate(${(i + 0.5) * SEGMENT_ANGLE}, ${tx}, ${ty})`}
                        >
                            {prize.emoji}
                        </text>
                    </g>
                );
            })}
            {/* Center circle */}
            <circle cx={WHEEL_RADIUS} cy={WHEEL_RADIUS} r={22} fill="#fff" stroke="#E5E7EB" strokeWidth={3} />
            <text x={WHEEL_RADIUS} y={WHEEL_RADIUS} textAnchor="middle" dominantBaseline="middle" fontSize={18}>🎰</text>
        </svg>
    );
}

// --- Main DailySpinWheel Component ---
interface DailySpinWheelProps {
    onClose?: () => void;
}

export const DailySpinWheel: React.FC<DailySpinWheelProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, claimDailySpin } = useAppStore();
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentRotation, setCurrentRotation] = useState(0);
    const [wonPrize, setWonPrize] = useState<SpinPrize | null>(null);
    const [showResult, setShowResult] = useState(false);
    const animFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const today = getToday();
    const lastSpinDate = user?.lastSpinDate ?? null;
    const canSpin = lastSpinDate !== today;
    const countdown = useCountdown(canSpin ? null : lastSpinDate);

    const handleSpin = () => {
        if (!canSpin || isSpinning) return;
        const prize = pickPrize();
        // Compute where to stop the wheel so the prize aligns with the pointer (top center)
        const prizeIndex = PRIZES.findIndex(p => p.id === prize.id);
        const targetSegmentAngle = prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
        // We want the winning segment at 0° (top). Wheel starts with segment 0 at top.
        const offset = (360 - targetSegmentAngle) % 360;
        const totalSpin = 1800 + offset; // 5 full rotations + offset
        const finalRotation = currentRotation + totalSpin;

        setIsSpinning(true);
        setShowResult(false);
        setWonPrize(null);

        const duration = 4000;
        const startRot = currentRotation;
        startTimeRef.current = null;

        const animate = (timestamp: number) => {
            if (startTimeRef.current === null) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrentRotation(startRot + totalSpin * eased);

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                setCurrentRotation(finalRotation);
                setIsSpinning(false);
                setWonPrize(prize);
                setShowResult(true);

                // Claim the prize in the store
                claimDailySpin(prize);

                // Jackpot = full confetti
                if (prize.value >= 500 || prize.type === 'jackpot') {
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                } else {
                    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                }
            }
        };
        animFrameRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    }, []);

    return (
        <div className="flex flex-col items-center gap-6 p-2">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-black text-yellow-500 dark:text-yellow-400 flex items-center gap-2 justify-center">
                    <Gift className="w-7 h-7" />
                    {t('spin.title')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('spin.subtitle')}</p>
            </div>

            {/* Wheel Container */}
            <div className="relative flex items-center justify-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 pointer-events-none">
                    <div className="w-0 h-0" style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '22px solid #EF4444' }} />
                </div>
                {/* Wheel */}
                <motion.div
                    className="rounded-full shadow-2xl overflow-hidden"
                    animate={isSpinning ? { scale: [1, 1.01, 1] } : {}}
                    transition={{ duration: 0.2, repeat: Infinity }}
                >
                    <WheelSVG rotation={currentRotation} />
                </motion.div>
            </div>

            {/* Spin Button or Countdown */}
            {canSpin ? (
                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className={`px-10 py-4 rounded-2xl font-black text-lg text-white shadow-lg transition-all ${isSpinning
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 cursor-pointer'
                        }`}
                >
                    {isSpinning ? `${t('spin.spinning')}...` : `🎰 ${t('spin.spin_btn')}`}
                </motion.button>
            ) : (
                <div className="flex flex-col items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold text-sm">
                        <Clock className="w-4 h-4" />
                        {t('spin.next_spin')}
                    </div>
                    <span className="text-2xl font-black text-indigo-500 dark:text-indigo-400 font-mono">{countdown}</span>
                    <span className="text-xs text-gray-400">{t('spin.come_back')}</span>
                </div>
            )}

            {/* Prize Segments Legend */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
                {PRIZES.map(prize => (
                    <div key={prize.id} className="flex flex-col items-center gap-1 p-2 rounded-xl text-center" style={{ backgroundColor: prize.bgColor }}>
                        <PrizeIcon prize={prize} size={22} />
                        <span className="text-xs font-bold" style={{ color: prize.color }}>{prize.label}</span>
                    </div>
                ))}
            </div>

            {/* Win Result Overlay */}
            <AnimatePresence>
                {showResult && wonPrize && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
                        onClick={() => { setShowResult(false); if (onClose) onClose(); }}
                    >
                        <div
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-6xl">{wonPrize.emoji}</div>
                            <h3 className="text-2xl font-black" style={{ color: wonPrize.color }}>
                                {wonPrize.value >= 500 ? '🎉 JACKPOT! 🎉' : t('spin.you_won')}
                            </h3>
                            <div
                                className="rounded-2xl px-6 py-3 font-black text-2xl text-white"
                                style={{ background: wonPrize.color }}
                            >
                                {wonPrize.label}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">{t('spin.added_to_account')}</p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => { setShowResult(false); if (onClose) onClose(); }}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {t('spin.close')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DailySpinWheel;
