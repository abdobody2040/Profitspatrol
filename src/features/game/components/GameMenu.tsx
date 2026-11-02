import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import {
  Gamepad2,
  Palette,
  Truck,
  Briefcase,
  Zap,
  Heart,
  Lock,
  Crown,
  Coins,
  Store,
  TrendingUp,
  Lightbulb,
  Users,
  Target,
  Rocket,
  Star,
} from "lucide-react";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import InvestorPitchModal from './InvestorPitchModal';
import { GAMES_DB } from '../data/games';
import { hasSchoolBypass } from '../../../utils/premiumAccess';
import { CANONICAL_ARCADE_GAMES, DISTRICT_METADATA } from '../../games/registry/canonicalRegistry';
import { GameProgressAdapter } from '../../games/adapters/GameProgressAdapter';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';

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

const DISTRICT_ICONS: Record<string, any> = {
    money: Coins,
    builders: Store,
    risk: TrendingUp,
    operations: Briefcase,
    innovation: Lightbulb,
    leadership: Users,
    strategy: Target,
    launch: Rocket,
};

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
    const { games, user } = useAppStore();
    const [filter, setFilter] = useState<string>('All');
    const [showPaywall, setShowPaywall] = useState(false);
    const { t, i18n } = useTranslation();
    const { isJunior, isExplorer } = useAgeMode();

    const isRTL = i18n.language.startsWith('ar');
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

    // Safety check: ensure games is an array for classic simulations
    const safeGames = Array.isArray(games) ? games : [];
    
    // Combine district categories with simulation categories
    const districtKeys = Object.keys(DISTRICT_METADATA);
    const simCategories = Array.from(new Set(safeGames.map(g => g.category || 'Other'))) as string[];
    
    const categories: string[] = [
      'All',
      'age_junior',
      'age_explorer',
      ...districtKeys,
      ...simCategories
    ];

    const DISTRICT_LABELS_AR: Record<string, string> = {
        money: 'المال والميزانية',
        builders: 'البناة والمشاريع',
        risk: 'إدارة المخاطر',
        operations: 'العمليات والتشغيل',
        innovation: 'الابتكار والتطوير',
        leadership: 'القيادة والفرق',
        strategy: 'التخطيط والاستراتيجية',
        launch: 'الإطلاق والنمو',
    };

    const getCategoryLabel = (cat: string) => {
        if (cat === 'All') return t('arcade.cat_all', isRTL ? 'الكل' : 'All');
        if (cat === 'age_junior') return t('arcade.age_junior', isRTL ? '🐣 ألعاب الصغار (٦–٩)' : '🐣 Junior (6–9)');
        if (cat === 'age_explorer') return t('arcade.age_explorer', isRTL ? '🚀 رواد الأعمال (٩–١٢)' : '🚀 Explorer (9–12)');
        if (DISTRICT_METADATA[cat as keyof typeof DISTRICT_METADATA]) {
            return t(DISTRICT_METADATA[cat as keyof typeof DISTRICT_METADATA].titleKey, DISTRICT_LABELS_AR[cat] || cat);
        }
        if (cat === 'Retail & Food') return t('arcade.cat_retail', isRTL ? 'التجزئة والطعام' : 'Retail & Food');
        if (cat === 'Services & E-Commerce') return t('arcade.cat_service', isRTL ? 'الخدمات' : 'Services');
        if (cat === 'Production & Manufacturing') return t('arcade.cat_production', isRTL ? 'التصنيع' : 'Manufacturing');
        if (cat === 'Creative & Events') return t('arcade.cat_creative', isRTL ? 'الإبداع' : 'Creative');
        if (cat === 'Digital & Tech') return t('arcade.cat_tech', isRTL ? 'التكنولوجيا' : 'Tech');
        if (cat === 'Social Impact') return t('arcade.cat_social', isRTL ? 'الأثر الاجتماعي' : 'Social');
        if (cat === 'Tycoon Exclusive') return t('arcade.cat_tycoon', isRTL ? 'تايكون' : 'Tycoon Exclusive');
        if (cat === 'Marketing') return t('arcade.cat_marketing' as any, isRTL ? 'التسويق' : 'Marketing');
        return cat;
    };

    // Filter stations: if 'All' or matches district
    const isDistrictFilter = districtKeys.includes(filter);
    const isSimFilter = simCategories.includes(filter);

    const showStations = filter === 'All' || filter === 'age_junior' || filter === 'age_explorer' || isDistrictFilter;
    const showSimulations = filter === 'All' || isSimFilter;

    const filteredStations = filter === 'All'
        ? CANONICAL_ARCADE_GAMES
        : filter === 'age_junior'
        ? CANONICAL_ARCADE_GAMES.filter(g => g.ageRange[0] <= 8 || g.district === 'money' || g.district === 'builders')
        : filter === 'age_explorer'
        ? CANONICAL_ARCADE_GAMES.filter(g => g.ageRange[1] >= 10 || ['risk', 'operations', 'innovation', 'leadership', 'strategy', 'launch'].includes(g.district))
        : isDistrictFilter
        ? CANONICAL_ARCADE_GAMES.filter(g => g.district === filter)
        : [];

    const filteredSims = filter === 'All'
        ? safeGames.filter(g => g.business_id !== 'BIZ_01_LEMONADE')
        : isSimFilter
        ? safeGames.filter(g => g.category === filter && g.business_id !== 'BIZ_01_LEMONADE')
        : [];

    const allProgress = GameProgressAdapter.getAllProgress();

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-32">
            <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] font-extrabold text-xs uppercase tracking-widest mb-3">
                    <Gamepad2 size={16} /> Profits Patrol Arcade
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] mb-2 tracking-tight">
                    {t('arcade.title', 'Business Arcade')}
                </h2>
                <p className="text-[var(--color-text-muted)] font-bold max-w-xl mx-auto">
                    {t('arcade.subtitle', '50 neighborhood challenge stations and deep tycoon simulations!')}
                </p>
                {activeSchoolBypass && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-black border border-emerald-300 dark:border-emerald-800/50 shadow-sm">
                        <Crown size={16} /> All Games Unlocked via School License
                    </div>
                )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar justify-start md:justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2 rounded-full font-bold whitespace-nowrap text-sm transition-all cursor-pointer ${
                            filter === cat
                                ? 'btn shadow-sm'
                                : 'btn--ghost'
                        }`}
                    >
                        {getCategoryLabel(cat)}
                    </button>
                ))}
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Neighborhood 50 Stations */}
                {showStations && filteredStations.map(game => {
                    const prog = allProgress[game.id] || { bestScore: 0, stars: 0, completed: false };
                    
                    // Locked logic
                    let isLocked = false;
                    let lockLabel: string = t('arcade.locked', 'Locked');

                    if (game.premium && !isAdmin && !activeSchoolBypass) {
                        if (isIntern) {
                            isLocked = true;
                            lockLabel = 'Founder Required';
                        } else if (game.requiredTier === 'tycoon' && !isTycoon) {
                            isLocked = true;
                            lockLabel = 'Tycoon Required';
                        }
                    }

                    const DistrictIcon = DISTRICT_ICONS[game.district] || Gamepad2;

                    return (
                        <motion.button
                            key={game.id}
                            whileHover={!isLocked ? { y: -4 } : {}}
                            whileTap={!isLocked ? { scale: 0.98 } : {}}
                            onClick={() => {
                                if (isLocked) {
                                    setShowPaywall(true);
                                } else {
                                    onSelectGame(game.id);
                                }
                            }}
                            className={`card w-full p-6 text-start transition-all flex flex-col h-full relative overflow-hidden group cursor-pointer ${
                                isLocked ? 'grayscale opacity-75' : ''
                            }`}
                        >
                            {/* Station Badge */}
                            <div 
                                className="absolute top-0 end-0 text-white font-black text-xs px-4 py-1.5 rounded-es-2xl shadow-sm flex items-center gap-1.5"
                                style={{ backgroundColor: game.accentColor }}
                            >
                                #{game.stationNumber}
                            </div>

                            {/* Lock Badge */}
                            {isLocked && (
                                <div className="absolute top-0 start-0 bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-ee-xl z-20 flex items-center gap-1">
                                    <Lock size={12} /> {lockLabel}
                                </div>
                            )}

                            {/* Game Image Banner if present */}
                            {game.image && (
                                <div className="w-full h-36 mb-3 mt-1 rounded-2xl overflow-hidden shadow-sm relative group-hover:shadow-md transition-shadow">
                                    <img 
                                        src={game.image} 
                                        alt={t(game.titleKey, game.sourceId)} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div 
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 overflow-hidden"
                                    style={{ backgroundColor: game.accentColor }}
                                >
                                    {game.image ? (
                                        <img src={game.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <DistrictIcon size={24} />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1" dir={isRTL ? "rtl" : "ltr"}>
                                        <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                                            {game.estimatedMinutes} {t('common.minutes', isRTL ? 'دقيقة' : 'min')} • {t('common.ages', isRTL ? 'للأعمار' : 'Ages')} {game.ageRange[0]}–{game.ageRange[1]}
                                        </span>
                                        {/* Age Suitability Badge */}
                                        {isJunior && (game.ageRange[0] <= 8 || game.district === 'money' || game.district === 'builders') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black shadow-xs">
                                                <span>🐣</span> {t('arcade.junior_fit', isRTL ? 'مناسب لسنك' : 'Junior Fit')}
                                            </span>
                                        )}
                                        {isExplorer && (game.ageRange[1] >= 10 || ['risk', 'strategy', 'leadership', 'launch'].includes(game.district)) && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-[10px] font-black shadow-xs">
                                                <span>🚀</span> {t('arcade.explorer_pick', isRTL ? 'تحدي المستكشف' : 'Explorer Pick')}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-[var(--color-text)] leading-tight">
                                        {t(game.titleKey, game.sourceId)}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-[var(--color-text-muted)] font-bold text-sm leading-relaxed mb-6">
                                {t(game.objectiveKey, game.shortKey)}
                            </p>

                            {/* Progress & Rating Row */}
                            <div className="mt-auto pt-4 border-t border-[var(--color-border)] w-full flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3].map(s => (
                                        <Star
                                            key={s}
                                            size={16}
                                            className={
                                                s <= prog.stars
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                            }
                                        />
                                    ))}
                                    {prog.bestScore > 0 && (
                                        <span className="text-xs font-black text-[var(--color-text-muted)] ms-1.5">
                                            {prog.bestScore} {isRTL ? 'نقطة' : 'pts'}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    {isLocked ? (
                                        <span className="btn--danger text-xs py-1.5 px-3 uppercase tracking-wider font-black">
                                            {lockLabel || t('arcade.unlock', isRTL ? 'فتح القفل' : 'Unlock')}
                                        </span>
                                    ) : (
                                        <span className="btn text-xs py-1.5 px-4 uppercase tracking-wider font-black">
                                            {prog.completed ? t('arcade.play_again', isRTL ? 'العب مجدداً' : 'Play Again') : t('arcade.play_now', isRTL ? 'العب الآن' : 'Play Now')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}

                {/* 2. Classic Tycoon Simulations */}
                {showSimulations && (
                    <>
                        {/* Classic Lemonade Stand */}
                        {(filter === 'All' || filter === 'Retail & Food' || filter === 'age_junior') && (() => {
                            const meta = SIMULATION_METADATA['lemonade'];
                            const prog = allProgress['lemonade'] || allProgress['BIZ_01_LEMONADE'] || { bestScore: 0, stars: 0, completed: false };
                            return (
                                <GameCard
                                    title={t('lemonade.title', 'Lemonade Tycoon')}
                                    description={t('lemonade.desc', meta.description)}
                                    image="/images/arcade/lemonade.jpg"
                                    icon={<Briefcase size={22} />}
                                    accentColor={meta.accentColor}
                                    badge={meta.badge}
                                    estimatedMinutes={meta.minutes}
                                    ageRange={meta.ages}
                                    stars={prog.stars}
                                    bestScore={prog.bestScore}
                                    onClick={() => onSelectGame('lemonade')}
                                    playText={prog.completed ? t('arcade.play_again', isRTL ? 'العب مجدداً' : 'Play Again') : t('arcade.play_now', isRTL ? 'العب الآن' : 'Play Now')}
                                    isLocked={false}
                                />
                            );
                        })()}

                        {/* Classic Brand Builder */}
                        {(filter === 'All' || filter === 'Creative & Events' || filter === 'age_explorer') && (() => {
                            const meta = SIMULATION_METADATA['brand'];
                            const prog = allProgress['brand'] || allProgress['arcade_19_brandbuilder'] || { bestScore: 0, stars: 0, completed: false };
                            return (
                                <GameCard
                                    title={t('games.brand_builder.title', 'Brand Builder')}
                                    description={t('games.brand_builder.desc', meta.description)}
                                    image="/images/arcade/brand.jpg"
                                    icon={<Palette size={22} />}
                                    accentColor={meta.accentColor}
                                    badge={meta.badge}
                                    estimatedMinutes={meta.minutes}
                                    ageRange={meta.ages}
                                    stars={prog.stars}
                                    bestScore={prog.bestScore}
                                    onClick={() => onSelectGame('brand')}
                                    playText={prog.completed ? t('arcade.play_again', isRTL ? 'العب مجدداً' : 'Play Again') : t('arcade.play_now', isRTL ? 'العب الآن' : 'Play Now')}
                                    isLocked={false}
                                />
                            );
                        })()}

                        {/* Dynamic DB Business Games */}
                        {filteredSims.map((game, idx) => {
                            const meta = SIMULATION_METADATA[game.business_id] || {
                                minutes: '5–8',
                                ages: [8, 14] as [number, number],
                                badge: `#SIM-${(idx + 3).toString().padStart(2, '0')}`,
                                accentColor: game.visual_config?.colors?.secondary || game.visual_config?.colors?.primary || '#6366F1',
                                description: game.description || 'Deep business simulation challenge.'
                            };

                            const Icon = CATEGORY_ICONS[game.category] || Briefcase;
                            const visual = game.visual_config || {
                                theme: 'light',
                                colors: { background: '#FFFFFF', primary: '#E5E7EB', secondary: '#E5E7EB', accent: '#E5E7EB' },
                                icon: undefined
                            };

                            const staticGame = GAMES_DB.find(g => g.business_id === game.business_id);
                            const nameKey = game.nameKey || staticGame?.nameKey || game.name;
                            const descKey = meta.description || game.descriptionKey || staticGame?.descriptionKey || game.description;

                            // Top 3 simulation games are free for Intern: Lemonade Stand (#SIM-01), Brand Builder (#SIM-02), and Pizza Restaurant (#SIM-03)
                            const isFreeSimulation = game.business_id === 'BIZ_02_PIZZA';
                            const isTycoonGame = game.category === 'Tycoon Exclusive' || game.business_id === 'BIZ_NEGOTIATION';
                            let isLocked = false;
                            let lockLabel: string = t('arcade.locked', 'Locked');

                            if (isInternLocked && !isFreeSimulation) {
                                isLocked = true;
                                lockLabel = 'PREMIUM ONLY';
                            } else if (isTycoonGame && !isTycoon && !isAdmin && !activeSchoolBypass) {
                                isLocked = true;
                                lockLabel = 'TYCOON ONLY';
                            }

                            const gameImage = visual.image || staticGame?.visual_config?.image || (
                                game.business_id === 'BIZ_01_LEMONADE' ? '/images/arcade/lemonade.jpg' :
                                game.business_id === 'BIZ_02_PIZZA' ? '/images/arcade/pizza.jpg' :
                                game.business_id === 'BIZ_03_CUPCAKE' ? '/images/arcade/cupcake.jpg' :
                                game.business_id === 'BIZ_04_COFFEE' ? '/images/arcade/coffee.jpg' :
                                game.business_id === 'BIZ_05_TACO' ? '/images/arcade/taco.jpg' :
                                game.business_id === 'BIZ_06_ICECREAM' ? '/images/arcade/icecream.jpg' :
                                game.business_id === 'BIZ_12_CARWASH' ? '/images/arcade/carwash.jpg' :
                                game.business_id === 'BIZ_13_PETSALON' ? '/images/arcade/petsalon.jpg' :
                                game.business_id === 'BIZ_14_LAWN' ? '/images/arcade/lawn.jpg' :
                                game.business_id === 'BIZ_15_DROPSHIP' ? '/images/arcade/dropship.jpg' :
                                game.business_id === 'BIZ_16_IFIX' ? '/images/arcade/repair.jpg' :
                                game.business_id === 'BIZ_17_FACTORY' ? '/images/arcade/factory.jpg' :
                                game.business_id === 'BIZ_18_PRINTSHOP' ? '/images/arcade/printshop.jpg' :
                                game.business_id === 'BIZ_19_PUBLISHING' ? '/images/arcade/publishing.jpg' :
                                game.business_id === 'BIZ_20_BATTERY' ? '/images/arcade/battery.jpg' :
                                game.business_id === 'BIZ_31_OFFICE' ? '/images/arcade/coworking.jpg' :
                                game.business_id === 'BIZ_21_PARTY' ? '/images/arcade/icecream.jpg' :
                                game.business_id === 'BIZ_22_ROCKSTAR' ? '/images/arcade/brand.jpg' :
                                game.business_id === 'BIZ_23_ARTDEALER' ? '/images/arcade/marketwars.jpg' :
                                game.business_id === 'BIZ_24_CRAFT' ? '/images/arcade/printshop.jpg' :
                                game.business_id === 'BIZ_25_APP' ? '/images/arcade/communication.jpg' :
                                game.business_id === 'BIZ_26_CYBER' ? '/images/arcade/cyber.jpg' :
                                game.business_id === 'BIZ_27_YOUTUBE' ? '/images/arcade/marketing.jpg' :
                                game.business_id === 'BIZ_28_SPACE' ? '/images/arcade/space.jpg' :
                                game.business_id === 'BIZ_29_RECYCLE' ? '/images/arcade/recycle.jpg' :
                                game.business_id === 'BIZ_30_FAIRTRADE' ? '/images/arcade/coffee.jpg' :
                                game.business_id === 'BIZ_32_BIKE' ? '/images/arcade/repair.jpg' :
                                game.business_id === 'BIZ_NEGOTIATION' ? '/images/arcade/boardroom.jpg' :
                                game.business_id === 'BIZ_PRICING_GAME' ? '/images/arcade/pricing.jpg' :
                                game.business_id === 'BIZ_AUDIENCE_GAME' ? '/images/arcade/audience.jpg' :
                                game.business_id === 'BIZ_QUALITY_GAME' ? '/images/arcade/bughunter.jpg' :
                                game.business_id === 'BIZ_ETHICS_GAME' ? '/images/arcade/ethics.jpg' :
                                game.business_id === 'BIZ_INVEST_GAME' ? '/images/arcade/stockmarket.jpg' :
                                game.business_id === 'BIZ_OPERATIONS_GAME' ? '/images/arcade/dropship.jpg' :
                                '/images/arcade/startup.jpg'
                            );

                            const prog = allProgress[game.business_id] || { bestScore: 0, stars: 0, completed: false };

                            return (
                                <GameCard
                                    key={game.business_id}
                                    title={nameKey}
                                    description={descKey}
                                    image={gameImage}
                                    icon={<Icon size={22} />}
                                    accentColor={meta.accentColor || visual.colors?.secondary || '#6366F1'}
                                    badge={meta.badge || `#SIM-${(idx + 3).toString().padStart(2, '0')}`}
                                    estimatedMinutes={meta.minutes}
                                    ageRange={meta.ages}
                                    stars={prog.stars}
                                    bestScore={prog.bestScore}
                                    onClick={() => {
                                        if (isLocked) {
                                             setShowPaywall(true);
                                        } else {
                                            onSelectGame(game.business_id);
                                        }
                                    }}
                                    playText={isLocked ? t('arcade.unlock', isRTL ? 'فتح القفل' : 'Unlock') : prog.completed ? t('arcade.play_again', isRTL ? 'العب مجدداً' : 'Play Again') : t('arcade.play_now', isRTL ? 'العب الآن' : 'Play Now')}
                                    isLocked={isLocked}
                                    lockLabel={isLocked ? lockLabel : undefined}
                                />
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

const SIMULATION_METADATA: Record<string, {
    minutes: string;
    ages: [number, number];
    badge: string;
    accentColor: string;
    description: string;
}> = {
    lemonade: {
        minutes: '5–8',
        ages: [7, 14],
        badge: '🍋 #TYCOON',
        accentColor: '#CA8A04',
        description: 'Adjust recipe ratios, stock ice and lemons, and adapt pricing to daily weather forecasts to maximize daily profit.'
    },
    brand: {
        minutes: '6–10',
        ages: [8, 15],
        badge: '🎨 #CREATIVE',
        accentColor: '#EC4899',
        description: 'Design logos, choose company color psychology, and craft memorable visual identity systems for young ventures.'
    },
    BIZ_01_LEMONADE: {
        minutes: '5–8',
        ages: [7, 14],
        badge: '🍋 #TYCOON',
        accentColor: '#CA8A04',
        description: 'Adjust recipe ratios, stock ice and lemons, and adapt pricing to daily weather forecasts to maximize daily profit.'
    },
    BIZ_02_PIZZA: {
        minutes: '4–6',
        ages: [7, 12],
        badge: '🍕 #FOOD',
        accentColor: '#EF4444',
        description: 'Deliver pizzas through the neighborhood grid, dodge traffic obstacles, and fulfill orders before time runs out.'
    },
    BIZ_03_CUPCAKE: {
        minutes: '4–6',
        ages: [7, 12],
        badge: '🧁 #BAKERY',
        accentColor: '#DB2777',
        description: 'Assemble specialty cupcake orders with vanilla bases, colorful frostings, and cherry toppings under rush demand.'
    },
    BIZ_04_COFFEE: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '☕ #CAFE',
        accentColor: '#78350F',
        description: 'Balance bean roasts, steam milk foam, and adjust cup prices to conquer the morning rush and earn loyal customers.'
    },
    BIZ_05_TACO: {
        minutes: '4–7',
        ages: [7, 13],
        badge: '🌮 #TRUCK',
        accentColor: '#F59E0B',
        description: 'Build gourmet street tacos to order with beef, cheese, and salsa to master kitchen throughput and customer smiles.'
    },
    BIZ_06_ICECREAM: {
        minutes: '4–6',
        ages: [7, 12],
        badge: '🍦 #PARLOR',
        accentColor: '#F472B6',
        description: 'Manage the customer service queue, scoop triple-flavor cones, and add sprinkles while keeping customer wait times low.'
    },
    BIZ_12_CARWASH: {
        minutes: '4–6',
        ages: [7, 12],
        badge: '🚗 #SERVICE',
        accentColor: '#2563EB',
        description: 'Scrub, rinse, and wax shiny cartoon cars to the beat while mastering service speed and 5-star customer ratings.'
    },
    BIZ_13_PETSALON: {
        minutes: '4–6',
        ages: [7, 13],
        badge: '🐩 #SPA',
        accentColor: '#8B5CF6',
        description: 'Wash, dry, clip, and bow adorable dogs and cats to keep customer pets calm and maximize customer lifetime value.'
    },
    BIZ_14_LAWN: {
        minutes: '4–6',
        ages: [7, 12],
        badge: '🚜 #YARDS',
        accentColor: '#15803D',
        description: 'Navigate ride-on mowers across suburban lawns, avoid garden obstacles, and trim every square before time expires.'
    },
    BIZ_15_DROPSHIP: {
        minutes: '6–10',
        ages: [9, 16],
        badge: '📦 #ECOMMERCE',
        accentColor: '#4F46E5',
        description: 'Click to process customer orders, upgrade suppliers, and automate fulfillment drones to grow an e-commerce empire.'
    },
    BIZ_16_IFIX: {
        minutes: '6–10',
        ages: [9, 16],
        badge: '📱 #REPAIR',
        accentColor: '#0284C7',
        description: 'Diagnose cracked screens and dead batteries, swap microchips, and charge fair repair rates to build gadget trust.'
    },
    BIZ_17_FACTORY: {
        minutes: '6–10',
        ages: [8, 15],
        badge: '🏭 #FACTORY',
        accentColor: '#D97706',
        description: 'Manage assembly line bottlenecks, inspect wooden cars and robot toys for defects, and meet holiday demand shipments.'
    },
    BIZ_18_PRINTSHOP: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '👕 #MERCH',
        accentColor: '#7C3AED',
        description: 'Screen-print vibrant hoodies and t-shirts, balance screen ink costs, and fulfill school club merchandise orders.'
    },
    BIZ_19_PUBLISHING: {
        minutes: '6–10',
        ages: [8, 15],
        badge: '📚 #PUBLISH',
        accentColor: '#713F12',
        description: 'Contract artists, choose cover illustrations, and balance print run costs against newsstand sales to publish hit comics.'
    },
    BIZ_20_BATTERY: {
        minutes: '5–8',
        ages: [9, 16],
        badge: '🔋 #ENERGY',
        accentColor: '#15803D',
        description: 'Manufacture green clean-energy battery cells, balance electrical charge with heat dissipation, and avoid safety recalls.'
    },
    BIZ_31_OFFICE: {
        minutes: '7–12',
        ages: [10, 17],
        badge: '🏢 #VENTURE',
        accentColor: '#0D9488',
        description: 'Lease eco-friendly office pods, balance utility costs and tenant memberships, and maintain high community occupancy.'
    },
    BIZ_25_APP: {
        minutes: '8–14',
        ages: [10, 17],
        badge: '💻 #STUDIO',
        accentColor: '#6366F1',
        description: 'Design mobile apps, run beta tests, balance feature development and server costs, and iterate with user reviews.'
    },
    BIZ_NEGOTIATION: {
        minutes: '8–15',
        ages: [11, 17],
        badge: '👔 #TYCOON',
        accentColor: '#B45309',
        description: 'Lead high-stakes boardroom negotiations, weigh trade-offs between cash and equity, and forge strategic partnerships.'
    },
    BIZ_PRICING_GAME: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '🏷️ #SIM-30',
        accentColor: '#10B981',
        description: 'Find the perfect price! Balance profit magnitude with sales volume and test customer willingness to pay.'
    },
    BIZ_AUDIENCE_GAME: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '🎯 #SIM-31',
        accentColor: '#6366F1',
        description: 'Match the product to the right customer persona and analyze demographics to maximize marketing return.'
    },
    BIZ_QUALITY_GAME: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '🐞 #SIM-32',
        accentColor: '#DC2626',
        description: 'Spot defects on the line, catch buggy parts before delivery, and ensure top-quality manufacturing.'
    },
    BIZ_ETHICS_GAME: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '⚖️ #SIM-33',
        accentColor: '#4F46E5',
        description: 'Make tough ethical choices, balance profit against fair treatment, and protect company reputation.'
    },
    BIZ_INVEST_GAME: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '📈 #SIM-34',
        accentColor: '#059669',
        description: 'Buy low, sell high, and navigate wild market swings on a financial rollercoaster!'
    },
    BIZ_OPERATIONS_GAME: {
        minutes: '5–8',
        ages: [9, 15],
        badge: '⚙️ #SIM-35',
        accentColor: '#D97706',
        description: 'Optimize supply chains and warehouse operations to prevent bottlenecks and satisfy eager buyers.'
    },
    BIZ_21_PARTY: {
        minutes: '6–10',
        ages: [8, 14],
        badge: '🎉 #CREATIVE',
        accentColor: '#C026D3',
        description: 'Schedule party events in the perfect sequence to max out celebration fun and guest delight.'
    },
    BIZ_22_ROCKSTAR: {
        minutes: '5–8',
        ages: [8, 14],
        badge: '🎸 #MUSIC',
        accentColor: '#EF4444',
        description: 'Hit the rhythm notes, sell out stadium concerts, and balance tour expenses with merchandise sales.'
    },
    BIZ_23_ARTDEALER: {
        minutes: '6–10',
        ages: [9, 15],
        badge: '🎨 #GALLERY',
        accentColor: '#0F172A',
        description: 'Bid low at auction, spot rare artistic masterpieces, and curate high-value private collections.'
    },
    BIZ_24_CRAFT: {
        minutes: '5–8',
        ages: [7, 13],
        badge: '🧵 #CRAFTS',
        accentColor: '#F59E0B',
        description: 'String together handmade jewelry patterns with precision beads, gems, and careful quality craft.'
    },
    BIZ_26_CYBER: {
        minutes: '6–10',
        ages: [9, 16],
        badge: '🛡️ #CYBER',
        accentColor: '#10B981',
        description: 'Shield enterprise networks against incoming malware, phishing, and DDoS packet floods.'
    },
    BIZ_27_YOUTUBE: {
        minutes: '6–10',
        ages: [8, 15],
        badge: '📹 #STREAM',
        accentColor: '#EF4444',
        description: 'Go live, engage chat audiences, read sponsor ads responsibly, and produce viral videos.'
    },
    BIZ_28_SPACE: {
        minutes: '8–14',
        ages: [10, 17],
        badge: '🚀 #SPACE',
        accentColor: '#EA580C',
        description: 'Balance oxygen, water, and food rations to build a self-sustaining frontier space colony.'
    },
    BIZ_29_RECYCLE: {
        minutes: '5–8',
        ages: [7, 13],
        badge: '♻️ #ECO',
        accentColor: '#16A34A',
        description: 'Sort recyclable plastics, paper, and glass bottles into correct bins to protect the planet.'
    },
    BIZ_30_FAIRTRADE: {
        minutes: '6–10',
        ages: [9, 15],
        badge: '🤝 #FAIRTRADE',
        accentColor: '#15803D',
        description: 'Trade ethically sourced organic coffee, cocoa, and cotton to empower local farming communities.'
    },
    BIZ_32_BIKE: {
        minutes: '5–8',
        ages: [7, 13],
        badge: '🚲 #MOBILITY',
        accentColor: '#0D9488',
        description: 'Assemble bike wheels, tighten chains, and align pedals to promote green urban transport.'
    }
};

interface UnifiedGameCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
    accentColor?: string;
    badge?: string;
    estimatedMinutes?: string;
    ageRange?: [number, number];
    stars?: number;
    bestScore?: number;
    playText?: string;
    isLocked?: boolean;
    lockLabel?: string;
    onClick: () => void;
}

const GameCard: React.FC<UnifiedGameCardProps> = ({
    title,
    description,
    icon,
    image,
    accentColor = '#6366F1',
    badge,
    estimatedMinutes = '5–8',
    ageRange = [7, 14],
    stars = 0,
    bestScore = 0,
    playText,
    isLocked = false,
    lockLabel,
    onClick
}) => {
    const { t, i18n } = useTranslation();
    const { isJunior, isExplorer } = useAgeMode();
    const isRTL = i18n.language.startsWith('ar');

    const displayTitle = (typeof title === 'string' && title.includes('.')) ? t(title as any) : title;
    const displayDesc = (typeof description === 'string' && description.includes('.')) ? t(description as any) : description;

    return (
        <motion.button
            whileHover={!isLocked ? { y: -4 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={`card w-full p-6 text-start transition-all flex flex-col h-full relative overflow-hidden group cursor-pointer ${
                isLocked ? 'grayscale opacity-75' : ''
            }`}
        >
            {/* Top-Right Badge */}
            {badge && (
                <div 
                    className="absolute top-0 end-0 text-white font-black text-xs px-4 py-1.5 rounded-es-2xl shadow-sm flex items-center gap-1.5 z-10"
                    style={{ backgroundColor: accentColor }}
                >
                    {badge}
                </div>
            )}

            {/* Top-Left Lock Badge */}
            {isLocked && (
                <div className="absolute top-0 start-0 bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-ee-xl z-20 flex items-center gap-1">
                    <Lock size={12} /> {t('arcade.locked', 'Locked')}
                </div>
            )}

            {/* Game Image Banner */}
            {image && (
                <div className="w-full h-36 mb-3 mt-1 rounded-2xl overflow-hidden shadow-sm relative group-hover:shadow-md transition-shadow">
                    <img 
                        src={image} 
                        alt={displayTitle} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                </div>
            )}

            {/* Header Row */}
            <div className="flex items-center gap-3 mb-4 mt-2">
                <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 overflow-hidden"
                    style={{ backgroundColor: accentColor }}
                >
                    {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        icon || <Gamepad2 size={24} />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                            {isRTL
                                ? `${estimatedMinutes} دقيقة • للأعمار ${ageRange[0]}–${ageRange[1]}`
                                : `${estimatedMinutes} min · Ages ${ageRange[0]}–${ageRange[1]}`}
                        </span>
                        {/* Age Suitability Pill Badge */}
                        {isJunior && (ageRange[0] <= 8) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black shadow-xs">
                                <span>🐣</span> {isRTL ? 'مناسب لسنك' : 'Junior Fit'}
                            </span>
                        )}
                        {isExplorer && (ageRange[1] >= 10) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-[10px] font-black shadow-xs">
                                <span>🚀</span> {isRTL ? 'تحدي المستكشف' : 'Explorer Pick'}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-black text-[var(--color-text)] leading-tight">
                        {displayTitle}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-[var(--color-text-muted)] font-bold text-sm leading-relaxed mb-6">
                {displayDesc}
            </p>

            {/* Progress & Rating Row */}
            <div className="mt-auto pt-4 border-t border-[var(--color-border)] w-full flex justify-between items-center">
                <div className="flex items-center gap-1">
                    {[1, 2, 3].map(s => (
                        <Star
                            key={s}
                            size={16}
                            className={
                                s <= stars
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'
                            }
                        />
                    ))}
                    {bestScore > 0 && (
                        <span className="text-xs font-black text-[var(--color-text-muted)] ms-1.5">
                            {bestScore} {isRTL ? 'نقطة' : 'pts'}
                        </span>
                    )}
                </div>

                <div>
                    {isLocked ? (
                        <span className="btn--danger text-xs py-1.5 px-3 uppercase tracking-wider font-black">
                            {lockLabel || t('arcade.unlock', isRTL ? 'فتح القفل' : 'Unlock')}
                        </span>
                    ) : (
                        <span className="btn text-xs py-1.5 px-4 uppercase tracking-wider font-black">
                            {playText || t('arcade.play_now', isRTL ? 'العب الآن' : 'Play Now')}
                        </span>
                    )}
                </div>
            </div>
        </motion.button>
    );
};

export default GameMenu;
