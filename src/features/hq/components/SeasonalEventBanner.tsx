import React from 'react';
import { useAppStore } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ─── SeasonalEventBanner ──────────────────────────────────────────────────────
// Full-width event banner placed at the top of HQ. Shows:
//  • Event title, icon, description with themed gradient background
//  • Days remaining ribbon
//  • Join / Your rank / Claim reward button states
//  • Opens a mini-leaderboard panel on click

export const SeasonalEventBanner: React.FC = () => {
    const {
        seasonalEvent,
        joinSeasonalEvent,
        claimSeasonalEventReward,
        refreshSeasonalEvent,
    } = useAppStore();

    const [showLeaderboard, setShowLeaderboard] = React.useState(false);
    const { t } = useTranslation();

    React.useEffect(() => {
        refreshSeasonalEvent();
    }, [refreshSeasonalEvent]);

    const { activeEvent, myScore, myRank, leaderboard, joined, rewardClaimed } = seasonalEvent;
    if (!activeEvent) return null;

    const endDate = new Date(activeEvent.endDate);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const rankEmoji = myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : `#${myRank}`;

    return (
        <div style={{ marginBottom: 16 }}>
            {/* Main Banner */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: activeEvent.theme,
                    borderRadius: 20,
                    padding: '18px 20px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                }}
                onClick={() => setShowLeaderboard(v => !v)}
            >
                {/* Animated background pulse */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Days left ribbon */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    background: daysLeft <= 1 ? 'rgba(220,38,38,0.85)' : 'rgba(0,0,0,0.35)',
                    color: '#fff', fontSize: 10, fontWeight: 800,
                    padding: '4px 14px', borderBottomLeftRadius: 12,
                    letterSpacing: '0.5px',
                }}>
                    {t('seasonalEvent.daysLeft', { days: daysLeft, defaultValue: daysLeft === 0 ? 'FINAL DAY!' : `${daysLeft}d LEFT` })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Event icon */}
                    <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ fontSize: 42, lineHeight: 1, flexShrink: 0 }}
                    >
                        {activeEvent.icon}
                    </motion.span>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.7)',
                            letterSpacing: '0.8px', marginBottom: 4,
                        }}>
                            🎭 {t('seasonalEvent.title', 'SEASONAL EVENT')}
                        </div>
                        <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 900, margin: 0 }}>
                            {t(`seasonalEvent.events.${activeEvent.id}.name` as any, activeEvent.title)}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: '4px 0 0', lineHeight: 1.4 }}>
                            {t(`seasonalEvent.events.${activeEvent.id}.desc` as any, activeEvent.description)}
                        </p>
                    </div>

                    {/* Right: rank / score / action */}
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        {rewardClaimed ? (
                            <span style={{
                                fontSize: 12, color: '#fff', fontWeight: 800,
                                background: 'rgba(255,255,255,0.2)',
                                padding: '8px 14px', borderRadius: 20,
                            }}>{t('seasonalEvent.done', '✅ Done!')}</span>
                        ) : joined ? (
                            <div>
                                <div style={{ fontSize: 24, lineHeight: 1 }}>{rankEmoji}</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                                    {myScore} {t('seasonalEvent.pts', 'pts')}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => { e.stopPropagation(); claimSeasonalEventReward(); }}
                                    style={{
                                        marginTop: 6, background: 'rgba(255,255,255,0.25)',
                                        border: '1.5px solid rgba(255,255,255,0.5)',
                                        color: '#fff', fontSize: 11, fontWeight: 800,
                                        borderRadius: 14, padding: '5px 12px', cursor: 'pointer',
                                    }}
                                >
                                    {t('seasonalEvent.claim', 'Claim')}
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); joinSeasonalEvent(); }}
                                style={{
                                    background: 'rgba(255,255,255,0.25)',
                                    border: '2px solid rgba(255,255,255,0.6)',
                                    color: '#fff', fontSize: 13, fontWeight: 900,
                                    borderRadius: 16, padding: '10px 18px', cursor: 'pointer',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                ⚡ {t('seasonalEvent.join', 'Join Event')}
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Exclusive rewards row */}
                <div style={{
                    marginTop: 12,
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                    paddingTop: 10,
                }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        {t('seasonalEvent.top10Prizes', 'Top 10 prizes:')}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{
                            fontSize: 11, background: 'rgba(255,255,255,0.15)',
                            padding: '3px 10px', borderRadius: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 700,
                        }}>
                            +{activeEvent.xpReward.toLocaleString()} XP
                        </span>
                        <span style={{
                            fontSize: 11, background: 'rgba(255,255,255,0.15)',
                            padding: '3px 10px', borderRadius: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 700,
                        }}>
                            +{activeEvent.coinReward.toLocaleString()} 🪙
                        </span>
                        {activeEvent.exclusiveItems.map(item => (
                            <span key={item} style={{
                                fontSize: 11, background: 'rgba(251,191,36,0.25)',
                                padding: '3px 10px', borderRadius: 20, color: '#fbbf24', fontWeight: 700,
                                border: '1px solid rgba(251,191,36,0.4)',
                            }}>
                                🏅 {t('seasonalEvent.exclusive', 'Exclusive')}
                            </span>
                        )).slice(0, 2)}
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                        {showLeaderboard ? t('seasonalEvent.hide', '▲ hide') : t('seasonalEvent.leaderboardLabel', '▼ leaderboard')}
                    </span>
                </div>
            </motion.div>

            {/* Expandable Leaderboard */}
            <AnimatePresence>
                {showLeaderboard && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                            border: '1.5px solid rgba(99,102,241,0.25)',
                            borderTop: 'none',
                            borderRadius: '0 0 18px 18px',
                            padding: '16px 20px',
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, margin: '0 0 10px', letterSpacing: '0.5px' }}>
                                🏆 {t('seasonalEvent.leaderboardTitle', 'EVENT LEADERBOARD')}
                            </p>
                            {leaderboard.map((entry) => (
                                <div key={entry.userId} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '8px 10px',
                                    background: entry.userId === 'me' ? 'rgba(99,102,241,0.15)' : 'transparent',
                                    borderRadius: 10,
                                    marginBottom: 4,
                                    border: entry.userId === 'me' ? '1px solid rgba(99,102,241,0.3)' : 'none',
                                }}>
                                    <span style={{ fontSize: 16, width: 28, textAlign: 'center' }}>
                                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                                    </span>
                                    <span style={{ fontSize: 18 }}>{entry.avatarEmoji ?? '🧑'}</span>
                                    <span style={{
                                        flex: 1, fontSize: 13, fontWeight: entry.userId === 'me' ? 800 : 500,
                                        color: entry.userId === 'me' ? '#a78bfa' : 'rgba(255,255,255,0.7)',
                                    }}>
                                        {entry.userId === 'me' ? t('seasonalEvent.you', { name: entry.name, defaultValue: `${entry.name} (You)` }) : entry.name}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>
                                        {entry.score} {t('seasonalEvent.pts', 'pts')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SeasonalEventBanner;
