import React from 'react';
import { useAppStore } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import Dollhouse2D from './Dollhouse2D';
import { useTranslation } from 'react-i18next';

interface ShowcaseEntry {
    id: string;
    name: string;
    hqName: string;
    level: number;
    furnitureCount: number;
    avatarEmoji: string;
    theme: string;
    featuredItems: string[];
    displayUser: any;
}

const THIS_WEEK_SHOWCASES: ShowcaseEntry[] = [
    {
        id: 'showcase_1',
        name: 'Fatima A.',
        hqName: 'Crescent Tower HQ',
        level: 9,
        furnitureCount: 24,
        avatarEmoji: '👩‍💼',
        theme: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        featuredItems: ['🌙 Mosque Lamp', '🖥️ Gaming Setup', '🛋️ Velvet Sofa'],
        displayUser: {
            hqTheme: 'girls',
            placedItems: [
                { id: '1', itemId: 'sofa_velvet', roomType: 'living' },
                { id: '2', itemId: 'rug_persian', roomType: 'living' },
                { id: '3', itemId: 'plant_palm', roomType: 'living' },
                { id: '4', itemId: 'desk_executive', roomType: 'office' },
                { id: '5', itemId: 'chair_ergonomic', roomType: 'office' },
                { id: '6', itemId: 'setup_gaming', roomType: 'game' },
                { id: '7', itemId: 'bed_double', roomType: 'bedroom' },
                { id: '8', itemId: 'lamp_mosque', roomType: 'bedroom' },
                { id: '9', itemId: 'fridge_smart', roomType: 'kitchen' },
                { id: '10', itemId: 'table_dining', roomType: 'kitchen' },
                { id: '11', itemId: 'bathtub_freestanding', roomType: 'bathroom' }
            ]
        }
    },
    {
        id: 'showcase_2',
        name: 'Amir K.',
        hqName: 'Goldmine Operations',
        level: 10,
        furnitureCount: 31,
        avatarEmoji: '🧑‍💻',
        theme: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
        featuredItems: ['💻 Dual Monitor', '🏆 Trophy Case', '💡 Neon Sign'],
        displayUser: {
            hqTheme: 'boys',
            placedItems: [
                { id: '1', itemId: 'desk_executive', roomType: 'office' },
                { id: '2', itemId: 'setup_gaming', roomType: 'office' },
                { id: '3', itemId: 'trophy_case', roomType: 'game' },
                { id: '4', itemId: 'sign_neon', roomType: 'game' },
                { id: '5', itemId: 'sofa_leather', roomType: 'living' },
                { id: '6', itemId: 'tv_85', roomType: 'living' },
                { id: '7', itemId: 'bed_king', roomType: 'bedroom' },
                { id: '8', itemId: 'bookshelf_tall', roomType: 'bedroom' }
            ]
        }
    },
    {
        id: 'showcase_3',
        name: 'Sofia R.',
        hqName: 'Pink Panther Studio',
        level: 7,
        furnitureCount: 18,
        avatarEmoji: '👩‍🎨',
        theme: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
        featuredItems: ['🌸 Sakura Wallpaper', '🎵 Music Studio', '🪴 Zen Garden'],
        displayUser: {
            hqTheme: 'girls',
            placedItems: [
                { id: '1', itemId: 'sofa_pink', roomType: 'living' },
                { id: '2', itemId: 'plant_zen', roomType: 'living' },
                { id: '3', itemId: 'desk_art', roomType: 'office' },
                { id: '4', itemId: 'easel_painting', roomType: 'office' },
                { id: '5', itemId: 'setup_music', roomType: 'game' },
                { id: '6', itemId: 'bed_single', roomType: 'bedroom' },
                { id: '7', itemId: 'mirror_vanity', roomType: 'bathroom' }
            ]
        }
    },
];

export const HQShowcase: React.FC = () => {
    const { user } = useAppStore();
    const [selected, setSelected] = React.useState<string | null>(null);
    const { t } = useTranslation();

    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const weekLabel = `${fmt(monday)} – ${fmt(sunday)}`;

    return (
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-indigo-950 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/40 shadow-lg dark:shadow-black/30">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏠</span>
                <div>
                    <span className="inline-block text-[10px] font-extrabold text-indigo-600 dark:text-violet-300 bg-indigo-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-violet-700/40 tracking-widest">
                        🌟 {t('hqShowcase.title')}
                    </span>
                    <h3 className="text-gray-800 dark:text-white text-base font-black mt-1 mb-0.5">
                        {t('hqShowcase.title')}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 m-0">
                        {weekLabel} · {t('hqShowcase.decorateToFeature')}
                    </p>
                </div>
            </div>

            {/* Showcase rows */}
            <div className="flex flex-col gap-2.5">
                {THIS_WEEK_SHOWCASES.map((entry, i) => (
                    <motion.div
                        key={entry.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelected(selected === entry.id ? null : entry.id)}
                        className={`rounded-xl px-4 py-3 border cursor-pointer transition-all duration-200 ${selected === entry.id
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-950 dark:bg-indigo-900/40 dark:border-indigo-500/50 dark:text-white shadow-md'
                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/8 hover:bg-indigo-50 dark:hover:bg-white/8'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {/* Rank */}
                            <span className="text-xl w-8 text-center flex-shrink-0">
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                            </span>

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-gray-200 dark:border-white/15 flex items-center justify-center text-2xl flex-shrink-0">
                                {entry.avatarEmoji}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-extrabold truncate ${selected === entry.id ? 'text-indigo-950 dark:text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                                    {entry.hqName}
                                </div>
                                <div className={`text-xs mt-0.5 ${selected === entry.id ? 'text-indigo-800 dark:text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {t('hqShowcase.byUser', { name: entry.name })} · {t('hqShowcase.lvl', { level: entry.level })} · {entry.furnitureCount} {t('hqShowcase.items')}
                                </div>
                            </div>

                            {/* Arrow */}
                            <span className={`text-sm transition-transform duration-200 ${selected === entry.id ? 'text-indigo-700/60 dark:text-white/50 rotate-90' : 'text-gray-300 dark:text-white/30'}`}>›</span>
                        </div>

                        {/* Expanded Showcase View */}
                        <AnimatePresence>
                            {selected === entry.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 pt-4 border-t border-white/20 relative rounded-xl bg-black/20 pb-4">

                                        {/* Scale Wrapper for 16:9 Dollhouse inside smaller card */}
                                        <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-xl shadow-inner bg-gradient-to-br from-slate-900 to-indigo-950">
                                            {/* We use a transform scale wrapper to fit the 100% size Dollhouse realistically */}
                                            <div
                                                className="absolute origin-top-left"
                                                style={{
                                                    width: '150%',
                                                    height: '150%',
                                                    transform: 'scale(0.666)',
                                                    pointerEvents: 'none' // Ensures read-only no-interact
                                                }}
                                            >
                                                <Dollhouse2D isReadOnly={true} displayUser={entry.displayUser} />
                                            </div>

                                            {/* Featured Items Overlay */}
                                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[80%] pointer-events-none">
                                                {entry.featuredItems.map(item => (
                                                    <span key={item} className="text-[10px] bg-black/60 backdrop-blur-md border border-white/20 px-2 py-1 rounded-full text-white font-bold shadow-sm whitespace-nowrap">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Your HQ status */}
            {user && (
                <div className="mt-3.5 p-3 bg-gray-50 dark:bg-white/4 rounded-xl border border-gray-100 dark:border-white/7 flex items-center gap-3">
                    <span className="text-xl">🧑</span>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {t('hqShowcase.yourHqNotFeatured')}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                            {t('hqShowcase.decorateToFeature')} 🏗️
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HQShowcase;
