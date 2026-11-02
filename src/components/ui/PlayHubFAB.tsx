import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import { useGameStore } from '../../store/gameStore';
import { UserRole } from '../../types';

export interface PlayHubFeature {
    id: string;
    label: string;
    emoji: string;
    gradient: string;
    onClick: () => void;
    badge?: string;
}

interface PlayHubFABProps {
    features?: PlayHubFeature[];
    spinReady?: boolean;
}

export const PlayHubFAB: React.FC<PlayHubFABProps> = ({ features: customFeatures, spinReady: customSpinReady }) => {
    const { user, openModal } = useAppStore();
    const { activeGameId } = useGameStore();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const isArabic = i18n.language?.startsWith('ar');

    // Hide if not logged in, if parent, or during an active game
    if (!user || user.role === UserRole.PARENT || activeGameId) {
        return null;
    }

    const defaultFeatures: PlayHubFeature[] = [
        { id: 'games', label: t('nav.games', isArabic ? 'الألعاب' : 'Arcade'), emoji: '🎮', gradient: 'from-amber-500 to-orange-600', onClick: () => navigate('/games') },
        { id: 'spin', label: t('nav.spin_wheel', isArabic ? 'عجلة الحظ' : 'Lucky Wheel'), emoji: '🎡', gradient: 'from-purple-500 to-indigo-600', onClick: () => openModal('spin'), badge: '!' },
        { id: 'quiz', label: t('nav.weekly_challenge', isArabic ? 'التحدي الأسبوعي' : 'Weekly Challenge'), emoji: '⚡', gradient: 'from-blue-500 to-cyan-600', onClick: () => openModal('weeklyChallenge') },
        { id: 'debate', label: t('nav.debate', isArabic ? 'المناظرة' : 'Debate Dojo'), emoji: '⚔️', gradient: 'from-rose-500 to-pink-600', onClick: () => navigate('/debate') },
        { id: 'videos', label: t('nav.videos', isArabic ? 'الفيديوهات' : 'Videos'), emoji: '🎬', gradient: 'from-emerald-500 to-teal-600', onClick: () => navigate('/videos') },
        { id: 'tank', label: t('nav.the_tank', isArabic ? 'عرين المستثمرين' : 'The Tank'), emoji: '🦈', gradient: 'from-sky-600 to-blue-800', onClick: () => navigate('/the-tank') },
        { id: 'realestate', label: t('nav.real_estate', isArabic ? 'العقارات' : 'Real Estate'), emoji: '🏙️', gradient: 'from-indigo-500 to-violet-600', onClick: () => navigate('/real-estate') },
        { id: 'sidehustle', label: t('nav.side_hustle', isArabic ? 'المشاريع' : 'Ventures'), emoji: '💼', gradient: 'from-lime-500 to-green-600', onClick: () => navigate('/side-hustle') },
        { id: 'cards', label: t('nav.card_academy', isArabic ? 'أكاديمية البطاقات' : 'Card Academy'), emoji: '🃏', gradient: 'from-yellow-500 to-amber-600', onClick: () => navigate('/card-academy') },
    ];

    const features = customFeatures || defaultFeatures;
    const spinReady = customSpinReady ?? true;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.3, y: 24 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 350, damping: 20 } },
    };

    return (
        <>
            {/* ── Backdrop ─────────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[149] bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Feature Grid ─────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                        /* Grid opens directly above FAB on both mobile and desktop */
                        className="fixed z-[150]
                            bottom-[218px] end-4
                            md:bottom-[188px] md:end-6"
                    >
                        {/* Decorative header label */}
                        <div className="text-center mb-2 flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 text-white text-xs font-black bg-black/60 border border-white/20 rounded-full px-3.5 py-1 backdrop-blur-md shadow-lg">
                                <img src="/assets/play_hub_controller.png" alt="" className="w-4 h-4 object-contain inline-block" />
                                <span>{t('nav.play_hub_title', isArabic ? 'مركز الألعاب' : 'Play Hub')}</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/10 dark:bg-black/40 p-2.5 sm:p-3 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
                            {features.map((f) => (
                                <motion.button
                                    key={f.id}
                                    variants={itemVariants}
                                    onClick={() => { setOpen(false); f.onClick(); }}
                                    whileTap={{ scale: 0.88 }}
                                    className={`relative rounded-2xl bg-gradient-to-br ${f.gradient}
                                        flex flex-col items-center justify-center gap-1 shadow-xl
                                        w-[72px] h-[72px] sm:w-20 sm:h-20 hover:scale-105 transition-transform`}
                                    title={f.label}
                                >
                                    {/* Badge */}
                                    {f.badge && (
                                        <span className="absolute -top-1.5 -end-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 leading-none">
                                            {f.badge}
                                        </span>
                                    )}
                                    <span className="text-2xl sm:text-3xl leading-none select-none">{f.emoji}</span>
                                    <span className="text-white text-[9px] sm:text-[10px] font-black leading-tight text-center px-1 drop-shadow">
                                        {f.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main FAB ─────────────────────────────────── */}
            <motion.button
                id="play-hub-fab"
                onClick={() => setOpen(v => !v)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                /* Stacked directly above Ollie on both mobile and desktop with calibrated 16px spacing */
                className={`fixed z-[151]
                    bottom-[152px] end-4
                    md:bottom-[112px] md:end-6
                    w-14 h-14 sm:w-16 sm:h-16
                    rounded-full flex items-center justify-center
                    border-4 border-white dark:border-gray-700
                    shadow-[0_4px_0_0_rgba(0,0,0,0.2)]
                    bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800
                    cursor-pointer select-none group
                    ${spinReady && !open ? 'ring-4 ring-yellow-400 ring-offset-2 animate-pulse' : ''}
                `}
                title={open ? 'إغلاق مركز الألعاب' : 'فتح مركز الألعاب'}
                aria-label={open ? 'Close Play Hub' : 'Open Play Hub'}
            >
                {open ? (
                    <span className="text-white text-2xl font-black select-none">✕</span>
                ) : (
                    <img
                        src="/assets/play_hub_controller.png"
                        alt="Play Hub"
                        className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] select-none pointer-events-none transition-transform duration-200 group-hover:scale-110"
                        draggable={false}
                    />
                )}
                {spinReady && !open && (
                    <span className="absolute -top-1 -end-1 w-4 h-4 bg-yellow-400 text-yellow-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                        !
                    </span>
                )}
            </motion.button>
        </>
    );
};

export default PlayHubFAB;

