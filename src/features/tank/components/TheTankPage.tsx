import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TheTankMode from './TheTankMode';
import CoopPitchMode from './CoopPitchMode';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

// ─── TheTankPage ──────────────────────────────────────────────────────────────
// Wrapper that provides the Solo / Co-op game mode switcher above The Tank experience.

type TankMode = 'SOLO' | 'COOP';

const TheTankPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [mode, setMode] = useState<TankMode>('SOLO');

    return (
        <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-200">
            {/* ── Mode Toggle Bar ── */}
            <div className="flex items-center justify-center pt-3 pb-2 px-4 z-20 shrink-0 bg-white/80 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-900/60 backdrop-blur-md">
                <div className="inline-flex bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-full p-1.5 gap-1.5 shadow-sm dark:shadow-lg">
                    {/* Solo Mode Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMode('SOLO')}
                        className={`px-5 sm:px-6 py-2 rounded-full font-black text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                            mode === 'SOLO'
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <span>🎤</span>
                        <span>{t('coop_pitch.solo_pitch', isAr ? 'عرض فردي' : 'Solo Pitch')}</span>
                    </motion.button>

                    {/* Co-op Mode Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMode('COOP')}
                        className={`px-5 sm:px-6 py-2 rounded-full font-black text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                            mode === 'COOP'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <span>🤝</span>
                        <span>{t('coop_pitch.coop_pitch', isAr ? 'عرض تعاوني' : 'Co-op Pitch')}</span>
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-0.5 shadow-sm">
                            <Sparkles size={10} />
                            {t('coop_pitch.badge_new', 'NEW')}
                        </span>
                    </motion.button>
                </div>
            </div>

            {/* ── Mode Content ── */}
            <div className="flex-1 overflow-auto relative">
                {mode === 'SOLO' ? <TheTankMode /> : <CoopPitchMode />}
            </div>
        </div>
    );
};

export default TheTankPage;
