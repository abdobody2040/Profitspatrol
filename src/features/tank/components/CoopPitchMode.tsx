import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, ArrowRight, Mic, ThumbsUp, XCircle, RotateCcw, Handshake, Check, Zap, Crown } from 'lucide-react';
import { useAppStore } from '../../../store';
import { TheTankEngine } from '../../tank/logic/TheTankEngine';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';

// ─── Types ────────────────────────────────────────────────────────────────────

type CoopStage =
    | 'LOBBY'         // Host creates code, partner joins
    | 'TEAM_PREP'     // Both see team names, press ready
    | 'TURN_1'        // Player 1's turn to speak/write ~30s
    | 'TURN_2'        // Player 2's turn to add to pitch
    | 'THINKING'      // Combined pitch being analyzed
    | 'OFFERS'        // Show joint offers
    | 'NEGOTIATION'   // Joint negotiation
    | 'DEAL'          // Celebration
    | 'REJECTED';     // Joint defeat

interface Partner {
    name: string;
    emoji: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateLobbyCode(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const PARTNER_EMOJIS = ['🧑‍💼', '👩‍💼', '🧑‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🧑‍🚀', '👩‍🚀'];
function randomEmoji(seed: string) {
    const idx = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % PARTNER_EMOJIS.length;
    return PARTNER_EMOJIS[idx];
}

// ─── Component ────────────────────────────────────────────────────────────────

const CoopPitchMode: React.FC = () => {
    const { user } = useAppStore();
    const { t } = useTranslation();

    const [stage, setStage] = useState<CoopStage>('LOBBY');
    const [lobbyCode] = useState(generateLobbyCode);
    const [joinCode, setJoinCode] = useState('');
    const [isHost, setIsHost] = useState(true);
    const [partner, setPartner] = useState<Partner | null>(null);
    const [partnerJoined, setPartnerJoined] = useState(false);

    // Pitch state
    const [pitch1, setPitch1] = useState('');   // Player 1 contribution
    const [pitch2, setPitch2] = useState('');   // Player 2 addition
    const [thinkingStep, setThinkingStep] = useState(0);

    // Results
    const [offers, setOffers] = useState<ReturnType<typeof TheTankEngine.generateOffers>>([]);
    const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
    const [dealVal, setDealVal] = useState(0);
    const [dealEq, setDealEq] = useState(0);

    const myName = user?.name ?? 'You';
    const myEmoji = randomEmoji(myName);

    // ─── Handlers ──────────────────────────────────────────────────────────────

    const handleCreateLobby = () => {
        setIsHost(true);
        setPartner(null);
        setPartnerJoined(false);
        // Simulate partner joining after 2s (in production, this would use Supabase Realtime)
        setTimeout(() => {
            const mockPartnerName = 'Partner 👥';
            setPartner({ name: mockPartnerName, emoji: randomEmoji(mockPartnerName) });
            setPartnerJoined(true);
        }, 2000);
    };

    const handleJoinLobby = () => {
        if (joinCode.trim().length !== 6) return;
        setIsHost(false);
        setPartner({ name: 'Host 🏠', emoji: '🧑‍💼' });
        setPartnerJoined(true);
        setStage('TEAM_PREP');
    };

    const handleStartPitch = () => {
        setStage('TURN_1');
    };

    const handleFinishTurn1 = () => {
        if (pitch1.trim().length < 10) return;
        setStage('TURN_2');
    };

    const handleFinishTurn2 = () => {
        if (pitch2.trim().length < 5) return;
        setStage('THINKING');

        const THINKING_MESSAGES = [
            '🤝 Combining your pitches...',
            '📊 The judges are conferring...',
            '💡 Analyzing your joint strategy...',
            '🏆 Making a decision...',
        ];

        let step = 0;
        const interval = setInterval(() => {
            setThinkingStep(step % THINKING_MESSAGES.length);
            step++;
        }, 1200);

        const fullPitch = `${pitch1} ${pitch2}`;
        const analysis = TheTankEngine.analyzePitch(fullPitch, false);
        // Co-op bonus: combined pitch gets +15 score boost
        const boostedScore = Math.min(100, analysis.score + 15);

        setTimeout(() => {
            clearInterval(interval);
            const newOffers = TheTankEngine.generateOffers(boostedScore);
            setOffers(newOffers);
            if (newOffers.length === 0) {
                setStage('REJECTED');
            } else {
                setStage('OFFERS');
            }
        }, 4800);
    };

    const handleSelectOffer = (offer: typeof offers[0]) => {
        setSelectedOffer(offer);
        setDealVal(offer.valuation);
        setDealEq(offer.equity);
        setStage('NEGOTIATION');
    };

    const handleAcceptDeal = () => {
        if (!selectedOffer) return;
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.55 },
            colors: ['#22c55e', '#eab308', '#3b82f6'],
        });
        setStage('DEAL');
    };

    const handleRestart = () => {
        setPitch1('');
        setPitch2('');
        setOffers([]);
        setSelectedOffer(null);
        setStage('TEAM_PREP');
    };

    const copyCode = useCallback(() => {
        navigator.clipboard.writeText(lobbyCode).catch(() => { });
    }, [lobbyCode]);

    const THINKING_MESSAGES = [
        t('coop_pitch.thinking_1', '🤝 Combining your pitches...'),
        t('coop_pitch.thinking_2', '📊 The judges are conferring...'),
        t('coop_pitch.thinking_3', '💡 Analyzing your joint strategy...'),
        t('coop_pitch.thinking_4', '🏆 Making a decision...'),
    ];

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={{
            width: '100%',
            minHeight: '100%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px 20px',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>
            <AnimatePresence mode="wait">

                {/* ─── LOBBY ─────────────────────────────────────────────────────────── */}
                {stage === 'LOBBY' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}
                    >
                        {/* Hero */}
                        <div style={{
                            width: 88, height: 88,
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 0 40px rgba(99,102,241,0.5)',
                        }}>
                            <Users size={44} />
                        </div>
                        <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 8 }}>{t('coop_pitch.title', 'Co-op Pitch Mode')}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 36 }}>
                            {t('coop_pitch.subtitle_1', 'Team up with a friend and pitch together to The Tank!')}<br />
                            <strong style={{ color: '#a78bfa' }}>{t('coop_pitch.subtitle_2', 'Combined pitches get a +15 score bonus')}</strong> 🤝
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Create Lobby */}
                            <div style={{
                                background: 'rgba(99,102,241,0.1)',
                                border: '1.5px solid rgba(99,102,241,0.3)',
                                borderRadius: 20, padding: '24px 28px',
                            }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{t('coop_pitch.create_lobby', '🏠 Create a Lobby')}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 16 }}>
                                    {t('coop_pitch.create_lobby_desc', 'Share the code with your co-founder')}
                                </p>
                                <div style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: 14, padding: '14px 20px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    marginBottom: 16,
                                }}>
                                    <span style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 900, letterSpacing: '0.3em', color: '#a78bfa' }}>
                                        {lobbyCode}
                                    </span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={copyCode}
                                        style={{
                                            padding: '8px 14px', borderRadius: 10,
                                            background: 'rgba(99,102,241,0.3)',
                                            border: '1px solid rgba(99,102,241,0.4)',
                                            color: '#c4b5fd', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}
                                    >
                                        <Copy size={14} /> {t('coop_pitch.btn_copy', 'Copy')}
                                    </motion.button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleCreateLobby}
                                    style={{
                                        width: '100%', padding: '14px',
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                        border: 'none', borderRadius: 14, color: '#fff',
                                        fontSize: 16, fontWeight: 800, cursor: 'pointer',
                                    }}
                                >
                                    {t('coop_pitch.btn_create_wait', 'Create Lobby & Wait')}
                                </motion.button>

                                {/* Partner waiting indicator */}
                                {partnerJoined && isHost && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            marginTop: 12,
                                            padding: '10px 14px',
                                            background: 'rgba(34,197,94,0.15)',
                                            borderRadius: 12,
                                            border: '1px solid rgba(34,197,94,0.3)',
                                            display: 'flex', alignItems: 'center', gap: 10,
                                        }}
                                    >
                                        <span style={{ fontSize: 20 }}>{partner?.emoji}</span>
                                        <span style={{ fontSize: 14, color: '#86efac', fontWeight: 700 }}>
                                            {t('coop_pitch.partner_joined', { name: partner?.name } as any)}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setStage('TEAM_PREP')}
                                            style={{
                                                marginLeft: 'auto', padding: '6px 14px',
                                                background: 'rgba(34,197,94,0.3)',
                                                border: '1px solid rgba(34,197,94,0.4)',
                                                borderRadius: 10, color: '#86efac', cursor: 'pointer',
                                                fontSize: 13, fontWeight: 700,
                                            }}
                                        >
                                            {t('coop_pitch.btn_start', 'Start →')}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>

                            {/* OR divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 600 }}>{t('coop_pitch.or', 'OR')}</span>
                                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                            </div>

                            {/* Join Lobby */}
                            <div style={{
                                background: 'rgba(236,72,153,0.08)',
                                border: '1.5px solid rgba(236,72,153,0.25)',
                                borderRadius: 20, padding: '24px 28px',
                            }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{t('coop_pitch.join_lobby', '🤝 Join a Lobby')}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 16 }}>
                                    {t('coop_pitch.join_lobby_desc', 'Enter your partner\'s code to join')}
                                </p>
                                <input
                                    type="text"
                                    placeholder={t('coop_pitch.placeholder_code', 'ENTER CODE')}
                                    maxLength={6}
                                    value={joinCode}
                                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                    style={{
                                        width: '100%', padding: '14px 20px',
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 12, color: '#fff',
                                        fontFamily: 'monospace', fontSize: 22, fontWeight: 900,
                                        letterSpacing: '0.3em', textAlign: 'center',
                                        marginBottom: 12, boxSizing: 'border-box',
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleJoinLobby}
                                    disabled={joinCode.trim().length !== 6}
                                    style={{
                                        width: '100%', padding: '14px',
                                        background: joinCode.length === 6
                                            ? 'linear-gradient(135deg, #ec4899, #9333ea)'
                                            : 'rgba(255,255,255,0.08)',
                                        border: 'none', borderRadius: 14, color: '#fff',
                                        fontSize: 16, fontWeight: 800, cursor: joinCode.length === 6 ? 'pointer' : 'not-allowed',
                                        opacity: joinCode.length === 6 ? 1 : 0.5,
                                    }}
                                >
                                    {t('coop_pitch.btn_join', 'Join Lobby')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── TEAM PREP ──────────────────────────────────────────────────────── */}
                {stage === 'TEAM_PREP' && (
                    <motion.div
                        key="team_prep"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}
                    >
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🤝</div>
                        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>{t('coop_pitch.team_title', 'Your Dream Team')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>
                            {t('coop_pitch.team_desc', "You'll take turns pitching. Player 1 opens, Player 2 closes. Judges love teamwork!")}
                        </p>

                        {/* Team display */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 20, padding: '20px 28px',
                            marginBottom: 24,
                            border: '1.5px solid rgba(255,255,255,0.08)',
                        }}>
                            {/* Player 1 */}
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 42, marginBottom: 6 }}>{myEmoji}</div>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{myName}</div>
                                <div style={{
                                    fontSize: 11, color: '#a78bfa', marginTop: 4,
                                    background: 'rgba(99,102,241,0.15)', padding: '2px 10px',
                                    borderRadius: 20, display: 'inline-block', fontWeight: 700,
                                }}>
                                    {isHost ? t('coop_pitch.host_role', '🏠 Host · Pitches 1st') : t('coop_pitch.partner_role', '🤝 Partner · Pitches 2nd')}
                                </div>
                            </div>

                            {/* VS */}
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18, fontWeight: 900, flexShrink: 0,
                            }}>
                                +
                            </div>

                            {/* Player 2 */}
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 42, marginBottom: 6 }}>{partner?.emoji ?? '👥'}</div>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{partner?.name ?? 'Partner'}</div>
                                <div style={{
                                    fontSize: 11, color: '#f9a8d4', marginTop: 4,
                                    background: 'rgba(236,72,153,0.15)', padding: '2px 10px',
                                    borderRadius: 20, display: 'inline-block', fontWeight: 700,
                                }}>
                                    {isHost ? t('coop_pitch.partner_role', '🤝 Partner · Pitches 2nd') : t('coop_pitch.host_role', '🏠 Host · Pitches 1st')}
                                </div>
                            </div>
                        </div>

                        {/* Co-op bonus badge */}
                        <div style={{
                            background: 'rgba(251,191,36,0.1)',
                            border: '1px solid rgba(251,191,36,0.3)',
                            borderRadius: 14, padding: '12px 20px',
                            marginBottom: 28,
                            display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                            <span style={{ fontSize: 22 }}>⚡</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>{t('coop_pitch.bonus_active', 'Co-op Bonus Active')}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                    {t('coop_pitch.bonus_desc', 'Combined pitches score +15 — judges love teamwork!')}
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleStartPitch}
                            style={{
                                padding: '16px 48px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                border: 'none', borderRadius: 16, color: '#fff',
                                fontSize: 18, fontWeight: 900, cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                            }}
                        >
                            {t('coop_pitch.btn_lets_pitch', "Let's Pitch!")} <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </motion.button>
                    </motion.div>
                )}

                {/* ─── TURN 1 (Player 1 pitches) ──────────────────────────────────────── */}
                {stage === 'TURN_1' && (
                    <motion.div
                        key="turn1"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        style={{ width: '100%', maxWidth: 560 }}
                    >
                        {/* Turn badge */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            marginBottom: 20,
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                borderRadius: 14, padding: '8px 18px',
                                fontSize: 13, fontWeight: 800, color: '#fff',
                            }}>
                                {t('coop_pitch.turn_1_badge', '🎙️ TURN 1 OF 2')}
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                                {myEmoji} {t('coop_pitch.turn_1_desc', { name: isHost ? myName : partner?.name ?? 'Player 1' } as any)}
                            </div>
                        </div>

                        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>{t('coop_pitch.turn_1_title', 'Open Your Pitch')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 20 }}>
                            {t('coop_pitch.turn_1_subtitle', 'Start strong! Introduce your business: What is it? Who needs it? What\'s the revenue?')}
                        </p>

                        <textarea
                            value={pitch1}
                            onChange={e => setPitch1(e.target.value)}
                            placeholder={t('coop_pitch.placeholder_pitch1', 'Hi judges! We have a business idea called... Our target customers are... We make money by...')}
                            rows={7}
                            style={{
                                width: '100%', padding: '18px 20px',
                                background: 'rgba(0,0,0,0.35)',
                                border: '2px solid rgba(99,102,241,0.3)',
                                borderRadius: 16, color: '#fff', fontSize: 15, resize: 'vertical',
                                fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
                                marginBottom: 16,
                            }}
                        />

                        {/* Character count */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                                {t('coop_pitch.char_count', { count: pitch1.length } as any)}
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {[50, 100, 150].map(n => (
                                    <div key={n} style={{
                                        width: 32, height: 4, borderRadius: 2,
                                        background: pitch1.length >= n ? '#4f46e5' : 'rgba(255,255,255,0.1)',
                                    }} />
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleFinishTurn1}
                            disabled={pitch1.trim().length < 10}
                            style={{
                                width: '100%', padding: '16px',
                                background: pitch1.trim().length >= 10
                                    ? 'linear-gradient(135deg, #059669, #10b981)'
                                    : 'rgba(255,255,255,0.08)',
                                border: 'none', borderRadius: 14, color: '#fff',
                                fontSize: 16, fontWeight: 800,
                                cursor: pitch1.trim().length >= 10 ? 'pointer' : 'not-allowed',
                                opacity: pitch1.trim().length >= 10 ? 1 : 0.5,
                            }}
                        >
                            {t('coop_pitch.btn_done_turn1', { name: isHost ? partner?.name ?? 'Partner' : myName } as any)}
                        </motion.button>
                    </motion.div>
                )}

                {/* ─── TURN 2 (Player 2 adds to pitch) ───────────────────────────────── */}
                {stage === 'TURN_2' && (
                    <motion.div
                        key="turn2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        style={{ width: '100%', maxWidth: 560 }}
                    >
                        {/* Partner's turn badge */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #db2777, #9333ea)',
                                borderRadius: 14, padding: '8px 18px',
                                fontSize: 13, fontWeight: 800, color: '#fff',
                            }}>
                                {t('coop_pitch.turn_2_badge', '🎙️ TURN 2 OF 2')}
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                                {partner?.emoji ?? '👥'} {t('coop_pitch.turn_2_desc', { name: isHost ? partner?.name ?? 'Partner' : myName } as any)}
                            </div>
                        </div>

                        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>{t('coop_pitch.turn_2_title', 'Close It Strong!')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 16 }}>
                            {t('coop_pitch.turn_2_subtitle', 'Build on what was said. Add the financials (revenue, growth, ask) and make it irresistible.')}
                        </p>

                        {/* Show what Player 1 said */}
                        <div style={{
                            background: 'rgba(99,102,241,0.08)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: 14, padding: '14px 18px', marginBottom: 16,
                        }}>
                            <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, marginBottom: 6, letterSpacing: '0.5px' }}>
                                {t('coop_pitch.what_said', { name: isHost ? myName.toUpperCase() : (partner?.name ?? 'PARTNER').toUpperCase() } as any)}
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                                "{pitch1.length > 200 ? pitch1.substring(0, 200) + '...' : pitch1}"
                            </p>
                        </div>

                        <textarea
                            value={pitch2}
                            onChange={e => setPitch2(e.target.value)}
                            placeholder={t('coop_pitch.placeholder_pitch2', "To add to what my partner said... Our revenue last month was... We're asking for $X for Y% equity...")}
                            rows={6}
                            style={{
                                width: '100%', padding: '18px 20px',
                                background: 'rgba(0,0,0,0.35)',
                                border: '2px solid rgba(219,39,119,0.3)',
                                borderRadius: 16, color: '#fff', fontSize: 15, resize: 'vertical',
                                fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
                                marginBottom: 20,
                            }}
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleFinishTurn2}
                            disabled={pitch2.trim().length < 5}
                            style={{
                                width: '100%', padding: '16px',
                                background: pitch2.trim().length >= 5
                                    ? 'linear-gradient(135deg, #dc2626, #f59e0b)'
                                    : 'rgba(255,255,255,0.08)',
                                border: 'none', borderRadius: 14, color: '#fff',
                                fontSize: 16, fontWeight: 800,
                                cursor: pitch2.trim().length >= 5 ? 'pointer' : 'not-allowed',
                                opacity: pitch2.trim().length >= 5 ? 1 : 0.5,
                            }}
                        >
                            {t('coop_pitch.btn_submit_tank', 'Submit to The Tank! 🦈')}
                        </motion.button>
                    </motion.div>
                )}

                {/* ─── THINKING ───────────────────────────────────────────────────────── */}
                {stage === 'THINKING' && (
                    <motion.div
                        key="thinking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '60px 20px' }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{
                                width: 100, height: 100,
                                border: '4px solid transparent',
                                borderTopColor: '#4f46e5',
                                borderRightColor: '#7c3aed',
                                borderRadius: '50%',
                                margin: '0 auto 32px',
                            }}
                        />
                        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
                            {THINKING_MESSAGES[thinkingStep]}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                            {t('coop_pitch.thinking_desc', 'Combined pitch being reviewed by the judges...')}
                        </p>
                    </motion.div>
                )}

                {/* ─── OFFERS ─────────────────────────────────────────────────────────── */}
                {stage === 'OFFERS' && (
                    <motion.div
                        key="offers"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ width: '100%', maxWidth: 640, textAlign: 'center' }}
                    >
                        <div style={{ fontSize: 44, marginBottom: 12 }}>🏆</div>
                        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>
                            {t('coop_pitch.offers_title', { count: offers.length } as any)}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>
                            {t('coop_pitch.offers_subtitle', 'The judges loved your teamwork! Pick an offer to negotiate.')}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {offers.map((offer, i) => (
                                <motion.div
                                    key={offer.judge.id}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelectOffer(offer)}
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1.5px solid rgba(255,255,255,0.1)',
                                        borderRadius: 18, padding: '18px 22px',
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        cursor: 'pointer', textAlign: 'left',
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 22, flexShrink: 0,
                                    }}>👨‍💼</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 800 }}>{t('coop_pitch.judge', { num: i + 1 } as any)}</div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                                            "{offer.comment}"
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 22, fontWeight: 900, color: '#86efac' }}>
                                            ${offer.valuation.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                            {t('coop_pitch.for_equity', { equity: offer.equity } as any)}
                                        </div>
                                    </div>
                                    <ArrowRight size={18} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ─── NEGOTIATION ─────────────────────────────────────────────────────── */}
                {stage === 'NEGOTIATION' && selectedOffer && (
                    <motion.div
                        key="negotiation"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            width: '100%', maxWidth: 460,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1.5px solid rgba(255,255,255,0.1)',
                            borderRadius: 24, padding: '32px 28px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>{t('coop_pitch.negotiation_title', 'Joint Offer')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>
                            "{selectedOffer.comment}"
                        </p>

                        <div style={{
                            background: 'rgba(34,197,94,0.1)',
                            border: '2px solid rgba(34,197,94,0.3)',
                            borderRadius: 18, padding: '20px', marginBottom: 24,
                        }}>
                            <div style={{ fontSize: 38, fontWeight: 900, color: '#86efac' }}>
                                ${dealVal.toLocaleString()}
                            </div>
                            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                                {t('coop_pitch.for_equity', { equity: dealEq } as any)}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAcceptDeal}
                                style={{
                                    padding: '16px', width: '100%',
                                    background: 'linear-gradient(135deg, #059669, #10b981)',
                                    border: 'none', borderRadius: 14, color: '#fff',
                                    fontSize: 16, fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                            >
                                <Handshake size={20} /> {t('coop_pitch.btn_accept_deal', 'Accept Deal Together!')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setStage('OFFERS')}
                                style={{
                                    padding: '12px', width: '100%',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 14, color: 'rgba(255,255,255,0.6)',
                                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                }}
                            >
                                {t('coop_pitch.btn_back_offers', '← Back to Offers')}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* ─── DEAL ────────────────────────────────────────────────────────────── */}
                {stage === 'DEAL' && (
                    <motion.div
                        key="deal"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 500 }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ fontSize: 80, marginBottom: 20 }}
                        >
                            🤝
                        </motion.div>
                        <h1 style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, color: '#86efac' }}>
                            {t('coop_pitch.deal_title', 'Co-founders Win!')}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 12 }}>
                            {t('coop_pitch.deal_subtitle', { val: dealVal.toLocaleString(), eq: dealEq } as any)}
                        </p>

                        {/* Team celebration */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center',
                            background: 'rgba(34,197,94,0.1)', borderRadius: 20,
                            padding: '20px', margin: '24px 0',
                            border: '1.5px solid rgba(34,197,94,0.25)',
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 40 }}>{myEmoji}</div>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{myName}</div>
                                <div style={{ fontSize: 11, color: '#86efac', marginTop: 4 }}>+250 🪙</div>
                            </div>
                            <div style={{
                                fontSize: 28, width: 44, height: 44, borderRadius: '50%',
                                background: 'rgba(34,197,94,0.2)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>+</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 40 }}>{partner?.emoji ?? '👥'}</div>
                                <div style={{ fontSize: 14, fontWeight: 800 }}>{partner?.name ?? 'Partner'}</div>
                                <div style={{ fontSize: 11, color: '#86efac', marginTop: 4 }}>+250 🪙</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleRestart}
                                style={{
                                    padding: '14px 28px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1.5px solid rgba(255,255,255,0.2)',
                                    borderRadius: 14, color: '#fff',
                                    fontSize: 15, fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}
                            >
                                <RotateCcw size={16} /> {t('coop_pitch.pitch_again', 'Pitch Again')}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* ─── REJECTED ────────────────────────────────────────────────────────── */}
                {stage === 'REJECTED' && (
                    <motion.div
                        key="rejected"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 460 }}
                    >
                        <div style={{ fontSize: 80, marginBottom: 20 }}>😤</div>
                        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, color: '#f87171' }}>
                            {t('coop_pitch.pitch_rejected', 'Pitch Rejected')}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 28 }}>
                            {t('coop_pitch.pitch_rejected_desc', 'Even the best co-founders get rejected. Refine your pitch and try again!')}
                        </p>
                        <div style={{
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 16, padding: '16px 20px', marginBottom: 24, textAlign: 'left',
                        }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                                {t('coop_pitch.tip_financials', '💡 **Tip:** Include specific numbers (revenue, users, ask amount). Judges need to see the financials!')}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleRestart}
                            style={{
                                padding: '16px 40px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                border: 'none', borderRadius: 14, color: '#fff',
                                fontSize: 16, fontWeight: 800, cursor: 'pointer',
                            }}
                        >
                            {t('coop_pitch.try_again_together', 'Try Again Together')}
                        </motion.button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default CoopPitchMode;
