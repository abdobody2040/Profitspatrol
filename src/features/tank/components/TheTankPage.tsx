import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TheTankMode from './TheTankMode';
import CoopPitchMode from './CoopPitchMode';
import { useTranslation } from 'react-i18next';

// ─── TheTankPage ──────────────────────────────────────────────────────────────
// Wrapper that adds a Solo / Co-op tab switcher above the Tank experience.
// The active mode is rendered below the tab bar.

type TankMode = 'SOLO' | 'COOP';

const TheTankPage: React.FC = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<TankMode>('SOLO');

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0f172a',
            overflow: 'hidden',
        }}>
            {/* ── Mode Toggle Bar ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 20px 0',
                gap: 0,
                flexShrink: 0,
                zIndex: 10,
            }}>
                <div style={{
                    display: 'inline-flex',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 50,
                    padding: 4,
                    gap: 4,
                }}>
                    {/* Solo Mode Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMode('SOLO')}
                        style={{
                            padding: '10px 28px',
                            borderRadius: 50,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: 14,
                            transition: 'all 0.2s',
                            background: mode === 'SOLO'
                                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                                : 'transparent',
                            color: mode === 'SOLO' ? '#fff' : 'rgba(255,255,255,0.4)',
                            boxShadow: mode === 'SOLO' ? '0 4px 16px rgba(59,130,246,0.4)' : 'none',
                        }}
                    >
                        🎤 {t('coop_pitch.solo_pitch', 'Solo Pitch')}
                    </motion.button>

                    {/* Co-op Mode Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMode('COOP')}
                        style={{
                            padding: '10px 28px',
                            borderRadius: 50,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: 14,
                            transition: 'all 0.2s',
                            background: mode === 'COOP'
                                ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                                : 'transparent',
                            color: mode === 'COOP' ? '#fff' : 'rgba(255,255,255,0.4)',
                            boxShadow: mode === 'COOP' ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                        }}
                    >
                        🤝 {t('coop_pitch.coop_pitch', 'Co-op Pitch')}
                        {/* NEW badge */}
                        <span style={{
                            fontSize: 9,
                            background: '#f59e0b',
                            color: '#000',
                            fontWeight: 900,
                            padding: '1px 6px',
                            borderRadius: 6,
                            letterSpacing: '0.4px',
                        }}>
                            {t('coop_pitch.badge_new', 'NEW')}
                        </span>
                    </motion.button>
                </div>
            </div>

            {/* ── Mode Content ── */}
            <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {mode === 'SOLO' ? <TheTankMode /> : <CoopPitchMode />}
            </div>
        </div>
    );
};

export default TheTankPage;
