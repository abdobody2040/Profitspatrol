import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { Gamepad2, Palette, Truck, Briefcase, Zap, Globe, Heart, Lock, Crown, Mic as Microphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import InvestorPitchModal from './InvestorPitchModal';
import { GAMES_DB } from '../data/games';
import { hasSchoolBypass } from '../../../utils/premiumAccess';

interface GameMenuProps {
    onSelectGame: (gameId: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    'Retail & Food': Briefcase,
    'Services & E-Commerce': Truck,
    'Production & Manufacturing': Zap,
    'Creative & Events': Palette,
    'Digital & Tech': Gamepad2,
    'Social Impact': Heart,
    'Tycoon Exclusive': Crown
};

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
    const { games, user } = useAppStore();
    const [filter, setFilter] = useState<string>('All');
    const [showPaywall, setShowPaywall] = useState(false);
    const { t } = useTranslation();

    // Safety check: ensure games is an array
    const safeGames = Array.isArray(games) ? games : [];

    const categories: string[] = ['All', ...Array.from(new Set(safeGames.map(g => g.category || 'Other'))) as string[]];

    // Helper to translate categories
    const getCategoryLabel = (cat: string) => {
        if (cat === 'All') return t('arcade.cat_all');
        if (cat === 'Retail & Food') return t('arcade.cat_retail');
        if (cat === 'Services & E-Commerce') return t('arcade.cat_service');
        if (cat === 'Production & Manufacturing') return t('arcade.cat_production');
        if (cat === 'Creative & Events') return t('arcade.cat_creative');
        if (cat === 'Digital & Tech') return t('arcade.cat_tech');
        if (cat === 'Social Impact') return t('arcade.cat_social');
        if (cat === 'Tycoon Exclusive') return t('arcade.cat_tycoon');
        return cat;
    };

    // Filter out the generic Lemonade Stand since we use the custom one
    const filteredGames = (filter === 'All' ? safeGames : safeGames.filter(g => g.category === filter))
        .filter(g => g.business_id !== 'BIZ_01_LEMONADE');

    const isTycoon = user?.subscriptionTier === 'tycoon';
    const isIntern = user?.subscriptionTier === 'intern';
    const isAdmin = user?.role === 'ADMIN';

    // B2B School License Bypass Check
    const classrooms = useEducationStore(state => state.classrooms);
    const users = useAppStore(state => state.users);
    const activeSchoolBypass = hasSchoolBypass(user, classrooms, users);

    const checkInternLocked = () => {
        if (isAdmin) return false;
        if (activeSchoolBypass) return false; // School pays for it
        return isIntern;
    };

    const isInternLocked = checkInternLocked();

    return (
        <div className="pb-20">
            <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-2">{t('arcade.title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-bold">{t('arcade.subtitle')}</p>
                {activeSchoolBypass && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-200 dark:border-green-800/50">
                        <Crown size={16} />
                        Unlocked via School License
                    </div>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors
                    ${filter === cat
                                ? 'bg-kid-primary text-yellow-900 border-2 border-yellow-500'
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
                    >
                        {getCategoryLabel(cat)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Special Custom Game: Lemonade Tycoon (ALWAYS OPEN) */}
                {(filter === 'All' || filter === 'Retail & Food') && (
                    <GameCard
                        title="lemonade.title"
                        description="lemonade.desc"
                        icon={<Briefcase size={40} className="text-yellow-600" />}
                        backgroundColor="#FEFCE8"
                        borderColor="#FEF08A"
                        onClick={() => onSelectGame('lemonade')}
                        isSpecial
                        badge={t('arcade.badge_classic')}
                        playText={t('arcade.play_now')}
                        isLocked={false}
                    />
                )}

                {/* Special Custom Game: Brand Builder (LOCKED FOR INTERNS) */}
                {(filter === 'All' || filter === 'Creative & Events') && (
                    <GameCard
                        title={t('games.brand_builder.title')}
                        description={t('games.brand_builder.desc')}
                        icon={<Palette size={40} className="text-pink-600" />}
                        backgroundColor="#FDF2F8"
                        borderColor="#FBCFE8"
                        onClick={() => {
                            if (isInternLocked) setShowPaywall(true);
                            else onSelectGame('brand');
                        }}
                        isSpecial
                        badge={t('arcade.badge_creative')}
                        playText={isInternLocked ? t('arcade.upgrade_unlock') : t('arcade.play_now')}
                        isLocked={isInternLocked}
                    />
                )}

                {/* Generated Games (ALL LOCKED FOR INTERNS) */}
                {filteredGames.map(game => {
                    const Icon = CATEGORY_ICONS[game.category] || Briefcase;
                    const visual = game.visual_config || {
                        theme: 'light',
                        colors: { background: '#FFFFFF', primary: '#E5E7EB', secondary: '#E5E7EB', accent: '#E5E7EB' },
                        icon: undefined
                    };

                    // Translation Fallback mechanism
                    const staticGame = GAMES_DB.find(g => g.business_id === game.business_id);
                    const nameKey = game.nameKey || staticGame?.nameKey || game.name;
                    const descKey = game.descriptionKey || staticGame?.descriptionKey || game.description;

                    // --- LOCK LOGIC ---
                    const isTycoonGame = game.category === 'Tycoon Exclusive' || game.business_id === 'BIZ_NEGOTIATION';
                    let isLocked = false;
                    let lockLabel = t('arcade.locked');

                    if (isInternLocked) {
                        isLocked = true;
                        lockLabel = t('arcade.premium_only' as any);
                    } else if (isTycoonGame && !isTycoon && !isAdmin && !activeSchoolBypass) {
                        isLocked = true;
                        lockLabel = t('arcade.tycoon_only' as any);
                    }

                    return (
                        <GameCard
                            key={game.business_id}
                            title={nameKey}
                            description={descKey}
                            icon={<span className="text-4xl">{visual.icon || <Icon size={40} />}</span>}
                            backgroundColor={visual.colors?.background}
                            borderColor={visual.colors?.secondary}
                            onClick={() => {
                                if (isLocked) {
                                    setShowPaywall(true);
                                } else {
                                    onSelectGame(game.business_id);
                                }
                            }}
                            badge={game.category === 'Tycoon Exclusive' ? t('arcade.tycoon_only_badge' as any) : undefined}
                            playText={isLocked ? t('arcade.upgrade_unlock' as any) : t('arcade.play_now' as any)}
                            isLocked={isLocked}
                            lockLabel={isLocked ? lockLabel : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const GameCard = ({ title, description, icon, backgroundColor, borderColor, onClick, isSpecial, badge, playText, isLocked, lockLabel }: any) => {
    const { t } = useTranslation();

    // Check if title/description are keys in our games namespace
    // We assume if it contains dots it's a key, otherwise it's a fallback string
    const displayTitle = (typeof title === 'string' && title.includes('.')) ? t(title as any) : title;
    const displayDesc = (typeof description === 'string' && description.includes('.')) ? t(description as any) : description;

    return (
        <motion.button
            whileHover={!isLocked ? { y: -5 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            onClick={onClick}
            // Use !bg-gray-800 to override inline styles in dark mode
            className={`w-full p-6 rounded-3xl border-4 text-start shadow-sm transition-all flex flex-col h-full relative overflow-hidden group
                dark:!bg-gray-800 dark:!border-gray-700
                ${isLocked ? 'grayscale opacity-80 cursor-pointer' : ''}
            `}
            style={{
                backgroundColor: backgroundColor || '#FFFFFF',
                borderColor: borderColor || '#E5E7EB'
            }}
        >
            {isSpecial && !isLocked && (
                <div className="absolute top-0 end-0 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-es-xl z-10">
                    {badge || t('arcade.badge_pro')}
                </div>
            )}

            {/* Visual Lock Overlay */}
            {isLocked && (
                <div className="absolute top-0 end-0 bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-es-xl z-20 flex items-center gap-1">
                    <Lock size={12} /> {lockLabel || t('arcade.locked')}
                </div>
            )}

            <div className="mb-4 p-4 rounded-2xl bg-white/60 dark:bg-black/20 w-fit backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 group-hover:opacity-80 transition-opacity text-start">
                {displayTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-bold text-sm leading-relaxed mb-6 opacity-80 text-start">
                {displayDesc}
            </p>

            <div className={`mt-auto pt-4 border-t border-black/5 dark:border-white/5 w-full flex justify-between items-center text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest`}>
                <span className={isLocked ? 'text-red-500' : ''}>{playText}</span>
                <div className={`bg-white/50 dark:bg-black/20 p-2 rounded-full transition-all shadow-sm ${isLocked ? 'text-red-500 bg-red-50' : 'group-hover:bg-white text-gray-700'}`}>
                    {isLocked ? <Lock size={16} /> : <Gamepad2 size={16} />}
                </div>
            </div>
        </motion.button>
    );
};

export default GameMenu;
