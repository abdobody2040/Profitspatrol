import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
    Sparkles, X, CheckCircle2, Lock, ShieldCheck,
    Coins, Crown, Flame, Star, Filter, Search, RotateCcw,
    Save, Shirt, Smile, Eye, Scissors, Footprints, Briefcase
} from 'lucide-react';
import { useAppStore } from '../../../store';
import { useAvatarStore } from '../store/avatarStore';
import { AVATAR_CATALOG, CATEGORY_LABELS } from '../data/avatarCatalog';
import { AvatarItem, AvatarCategory, AvatarRarity } from '../types/avatar';
import ModularAvatarRenderer from './ModularAvatarRenderer';
import CoinIcon from '../../../components/ui/CoinIcon';

interface AvatarWardrobeModalProps {
    onClose?: () => void;
}

export const AvatarWardrobeModal: React.FC<AvatarWardrobeModalProps> = ({ onClose }) => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const { user } = useAppStore();

    const {
        filter,
        setCategoryFilter,
        setRarityFilter,
        setSearchQuery,
        setOnlyUnlockedFilter,
        setOnlyOwnedFilter,
        previewConfig,
        initPreview,
        previewItem,
        resetPreview,
        saveLoadout,
        hasUnsavedChanges,
        isItemUnlocked,
        isItemOwned,
        isItemEquipped,
        isItemPreviewed,
        purchaseItem,
        equipItem,
        selectedItem,
        selectItem,
        resetToDefaultAvatar,
    } = useAvatarStore();

    const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Initialize preview state on mount
    useEffect(() => {
        initPreview();
    }, []);

    const userName = user?.name || (isAr ? 'رائد الأعمال الصغير' : 'Kid CEO');
    const userLevel = user?.level || 1;
    const ppTokens = user?.ppTokens || 0;
    const equippedIds = user?.equippedItems || [];

    // Filter items based on active criteria
    const filteredItems = useMemo(() => {
        return AVATAR_CATALOG.filter((item) => {
            // Category filter
            if (filter.category !== 'all' && item.category !== filter.category) {
                return false;
            }
            // Rarity filter
            if (filter.rarity && filter.rarity !== 'all' && item.rarity !== filter.rarity) {
                return false;
            }
            // Search query
            if (filter.search && filter.search.trim()) {
                const q = filter.search.toLowerCase().trim();
                const matchName = item.name.toLowerCase().includes(q) || item.nameAr.toLowerCase().includes(q);
                const matchTag = item.tags?.some(tag => tag.toLowerCase().includes(q));
                if (!matchName && !matchTag) return false;
            }
            // Only unlocked
            if (filter.onlyUnlocked && !isItemUnlocked(item)) {
                return false;
            }
            // Only owned
            if (filter.onlyOwned && !isItemOwned(item)) {
                return false;
            }
            return true;
        });
    }, [filter, user, equippedIds]);

    // Handle Item Click / Action
    const handleCardClick = (item: AvatarItem) => {
        selectItem(item);
        // Preview item immediately on live character
        previewItem(item);
    };

    const handleEquipOrBuy = (e: React.MouseEvent, item: AvatarItem) => {
        e.stopPropagation();
        selectItem(item);

        if (isItemEquipped(item)) {
            return;
        }

        if (isItemOwned(item)) {
            const res = equipItem(item);
            setAlertMsg({ text: res.message, type: 'success' });
            setTimeout(() => setAlertMsg(null), 2500);
            return;
        }

        if (!isItemUnlocked(item)) {
            const reqText = isAr ? item.unlockRequirement?.descriptionAr : item.unlockRequirement?.description;
            setAlertMsg({ text: reqText || (isAr ? 'العنصر مقفل' : 'Item is locked'), type: 'error' });
            setTimeout(() => setAlertMsg(null), 3000);
            return;
        }

        if (ppTokens < item.cost) {
            setAlertMsg({
                text: isAr ? 'رصيد العملات لا يكفي! أكمل المهمات لكسب المزيد' : 'Not enough P-Tokens! Complete missions to earn more',
                type: 'error',
            });
            setTimeout(() => setAlertMsg(null), 2500);
            return;
        }

        const res = purchaseItem(item);
        if (res.success) {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            setAlertMsg({ text: res.message, type: 'success' });
        } else {
            setAlertMsg({ text: res.message, type: 'error' });
        }
        setTimeout(() => setAlertMsg(null), 3000);
    };

    const handleSaveLook = () => {
        const res = saveLoadout();
        if (res.success) {
            confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
            setAlertMsg({ text: isAr ? 'تم حفظ مظهرك بنجاح! 🎉' : 'Look saved successfully! 🎉', type: 'success' });
        } else {
            setAlertMsg({ text: res.message, type: 'error' });
        }
        setTimeout(() => setAlertMsg(null), 3000);
    };

    const rarityBadgeColors: Record<string, string> = {
        common: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
        rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-400',
        epic: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-400',
        legendary: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-400',
    };

    const unsaved = hasUnsavedChanges();

    return (
        <div
            className={`flex flex-col max-w-6xl w-full mx-auto bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden ${
                isAr ? 'font-cairo' : ''
            }`}
            dir={isAr ? 'rtl' : 'ltr'}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 text-white flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/20">
                        ✨
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                            {isAr ? 'استوديو رواد الأعمال وتصميم الأفاتار' : 'Entrepreneurial Studio & Avatar Wardrobe'}
                            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        </h2>
                        <p className="text-xs md:text-sm text-indigo-100 font-medium">
                            {isAr
                                ? 'خصص شخصيتك، جرّب أحدث أزياء العمل، واكسب ثقة المستثمرين في عروض الأفكار!'
                                : 'Customize your founder avatar, try on new gear, and win investor confidence!'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Wallet Chip */}
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-inner">
                        <Coins className="w-4 h-4 text-yellow-300" />
                        <span className="font-extrabold text-sm text-yellow-300 tracking-wide" dir="ltr">
                            {ppTokens.toLocaleString()}
                        </span>
                        <span className="text-xs text-indigo-200">PP Tokens</span>
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-transform active:scale-95 border border-white/20"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    )}
                </div>
            </div>

            {/* Notification alert */}
            <AnimatePresence>
                {alertMsg && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-sm ${
                            alertMsg.type === 'success'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-rose-500 text-white'
                        }`}
                    >
                        {alertMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span>{alertMsg.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 max-h-[80vh] overflow-y-auto">
                {/* Left Side: Avatar Showcase Stage */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* 3D Stage Card */}
                    <div
                        className="relative rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl border-2 border-indigo-200 dark:border-slate-700 overflow-hidden bg-slate-950 text-white"
                        style={{ minHeight: 390 }}
                    >
                        {/* Dynamic Headquarters / Background Layer */}
                        {(() => {
                            const activeBg = AVATAR_CATALOG.find(i => i.id === previewConfig.backgroundId) ||
                                           AVATAR_CATALOG.find(i => i.id === 'avatar_bg_office_clean_001');
                            return activeBg?.filePath ? (
                                <div
                                    className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700 ease-out"
                                    style={{
                                        backgroundImage: `url("${activeBg.filePath}?v=3")`,
                                        opacity: 0.88,
                                        filter: 'contrast(1.08) brightness(0.98)',
                                    }}
                                />
                            ) : null;
                        })()}

                        {/* Ambient Studio Lighting Ring & Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/40 pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.2),transparent_70%)] pointer-events-none" />

                        {/* Top Stage Badges */}
                        <div className="w-full flex justify-between items-center text-xs font-bold z-10">
                            <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 text-amber-300">
                                <Crown className="w-4 h-4 text-amber-400" />
                                {isAr ? `المستوى ${userLevel}` : `Level ${userLevel}`}
                            </span>
                            <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 text-indigo-200">
                                <Star className="w-4 h-4 text-yellow-300" />
                                {userLevel >= 5
                                    ? isAr ? 'قطب أعمال دوريات الأرباح 🌟' : 'Patrol Tycoon 🌟'
                                    : isAr ? 'مؤسس شركة ناشئة 🚀' : 'Startup Founder 🚀'}
                            </span>
                        </div>

                        {/* Modular Avatar Renderer */}
                        <div className="relative z-10 flex flex-col items-center my-2">
                            <ModularAvatarRenderer
                                config={previewConfig}
                                size="xl"
                                showAura={true}
                                showShadow={true}
                                interactive={true}
                                animation="idle"
                            />
                            
                            <h3 className="mt-1 font-black text-xl text-white drop-shadow-md tracking-wide">
                                {userName}
                            </h3>

                            {/* Active Headquarters Location Badge */}
                            {(() => {
                                const activeBg = AVATAR_CATALOG.find(i => i.id === previewConfig.backgroundId);
                                return activeBg ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/15 text-[11px] font-bold text-indigo-200 mt-1 shadow-sm">
                                        <span>{activeBg.emoji || '🏢'}</span>
                                        <span>{isAr ? activeBg.nameAr : activeBg.name}</span>
                                    </div>
                                ) : null;
                            })()}
                        </div>

                        {/* Live Try-On / Changes Actions Bar */}
                        <div className="w-full z-10 pt-2 border-t border-white/10 flex flex-col gap-2">
                            {unsaved ? (
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <button
                                        onClick={handleSaveLook}
                                        className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{isAr ? 'حفظ المظهر الجديد' : 'Save New Look'}</span>
                                    </button>
                                    <button
                                        onClick={resetPreview}
                                        className="py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
                                        title={isAr ? 'تراجع عن التعديلات' : 'Reset Preview'}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>{isAr ? 'تراجع' : 'Reset'}</span>
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="flex items-center justify-between text-xs text-indigo-200 px-1 font-medium">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        {isAr ? 'المظهر محفوظ ومجهز' : 'Look equipped & saved'}
                                    </span>
                                    <button
                                        onClick={resetToDefaultAvatar}
                                        className="text-[11px] text-slate-400 hover:text-white underline transition-colors"
                                    >
                                        {isAr ? 'إعادة تعيين للمبدئي' : 'Reset to default'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Wardrobe Collection Stats */}
                    <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <span className="block text-slate-400 text-[11px] mb-0.5">
                                {isAr ? 'المقتنيات المجمعة' : 'Gear Collected'}
                            </span>
                            <span className="text-base text-indigo-600 dark:text-indigo-400 font-black">
                                {user?.inventory?.length || 0} / {AVATAR_CATALOG.length}
                            </span>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <span className="block text-slate-400 text-[11px] mb-0.5">
                                {isAr ? 'القطع المجهزة' : 'Equipped Gear'}
                            </span>
                            <span className="text-base text-purple-600 dark:text-purple-400 font-black">
                                {equippedIds.length} {isAr ? 'قطع' : 'Items'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Catalog & Customization Grid */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Search & Rarity Filter Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder={isAr ? 'ابحث عن قميص، تسريحة، بنطال...' : 'Search gear, styles, tags...'}
                                value={filter.search || ''}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm ${
                                    isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                                }`}
                            />
                        </div>

                        {/* Rarity Select Chips */}
                        <div className="flex items-center gap-1">
                            {(['all', 'common', 'rare', 'epic', 'legendary'] as (AvatarRarity | 'all')[]).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRarityFilter(r)}
                                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                        filter.rarity === r
                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                            : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter Pills (Modular & Outfits) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {(Object.keys(CATEGORY_LABELS) as (AvatarCategory | 'all')[]).map((catKey) => {
                            const meta = CATEGORY_LABELS[catKey];
                            const isActive = filter.category === catKey;
                            const count = catKey === 'all'
                                ? AVATAR_CATALOG.length
                                : AVATAR_CATALOG.filter(i => i.category === catKey).length;

                            return (
                                <button
                                    key={catKey}
                                    onClick={() => setCategoryFilter(catKey)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    <span>{isAr ? meta.ar : meta.en}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sub-Filters: Count, Only Owned, Only Unlocked */}
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                        <span className="flex items-center gap-1 text-slate-400">
                            <Filter className="w-3.5 h-3.5" />
                            {filteredItems.length} {isAr ? 'عنصر متاح' : 'Items available'}
                        </span>
                        <div className="flex gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={filter.onlyOwned}
                                    onChange={(e) => setOnlyOwnedFilter(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                />
                                <span>{isAr ? 'المملوكة فقط' : 'Owned Only'}</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={filter.onlyUnlocked}
                                    onChange={(e) => setOnlyUnlockedFilter(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                />
                                <span>{isAr ? 'المفتوحة فقط' : 'Unlocked Only'}</span>
                            </label>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                        {filteredItems.map((item) => {
                            const unlocked = isItemUnlocked(item);
                            const owned = isItemOwned(item);
                            const equipped = isItemEquipped(item);
                            const previewed = isItemPreviewed(item);
                            const canAfford = ppTokens >= item.cost;
                            const rarityClass = rarityBadgeColors[item.rarity] || rarityBadgeColors.common;

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleCardClick(item)}
                                    className={`relative flex flex-col justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                                        equipped
                                            ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-400/40'
                                            : previewed
                                            ? 'border-purple-400 bg-purple-50/60 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-400/30'
                                            : owned
                                            ? 'border-emerald-300 dark:border-emerald-700/60 bg-white dark:bg-slate-800'
                                            : unlocked
                                            ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
                                            : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 opacity-70'
                                    }`}
                                >
                                    {/* Top Rarity & State Badges */}
                                    <div className="flex items-center justify-between gap-1 mb-2">
                                        <span
                                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${rarityClass}`}
                                        >
                                            {item.rarity}
                                        </span>

                                        {equipped ? (
                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded-md">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {isAr ? 'مجهز' : 'Equipped'}
                                            </span>
                                        ) : previewed ? (
                                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-0.5 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded-md animate-pulse">
                                                <Sparkles className="w-3 h-3" />
                                                {isAr ? 'تجربة' : 'Trying'}
                                            </span>
                                        ) : !unlocked ? (
                                            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                                                <Lock className="w-3 h-3" />
                                            </span>
                                        ) : owned ? (
                                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                                <ShieldCheck className="w-3 h-3" />
                                                {isAr ? 'مملوك' : 'Owned'}
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Item Visual Preview */}
                                    <div className="flex justify-center items-center h-20 my-1 relative">
                                        {(() => {
                                            const rawSrc = item.thumbnailPath || item.filePath;
                                            if (!rawSrc) {
                                                return (
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 font-bold text-xs">
                                                        PP
                                                    </div>
                                                );
                                            }
                                            const thumbSrc = `${rawSrc}${rawSrc.includes('?') ? '&' : '?'}v=3`;
                                            if (item.category === 'background') {
                                                return (
                                                    <div className="relative w-full h-20 rounded-xl overflow-hidden shadow-md border border-white/20 dark:border-slate-700/60 group">
                                                        <img
                                                            src={thumbSrc}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                                        <span className="absolute bottom-1 right-2 text-xs drop-shadow">{item.emoji || '🏢'}</span>
                                                    </div>
                                                );
                                            }
                                            if (item.category === 'hair') {
                                                return (
                                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                                        {/* Stylized head mannequin silhouette so hair shape and fit are immediately clear */}
                                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-600/40 opacity-40 pointer-events-none">
                                                            <circle cx="50" cy="48" r="26" fill="currentColor" />
                                                            <path d="M42 70 L42 84 Q42 90 50 90 Q58 90 58 84 L58 70 Z" fill="currentColor" />
                                                        </svg>
                                                        <img
                                                            src={thumbSrc}
                                                            alt={item.name}
                                                            className="relative z-10 max-h-full max-w-full object-contain drop-shadow transition-transform hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                );
                                            }
                                            return (
                                                <img
                                                    src={thumbSrc}
                                                    alt={item.name}
                                                    className="max-h-full max-w-full object-contain drop-shadow transition-transform hover:scale-105"
                                                    loading="lazy"
                                                />
                                            );
                                        })()}
                                    </div>

                                    {/* Title & Description */}
                                    <div className="text-center mb-2.5">
                                        <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">
                                            {isAr ? item.nameAr : item.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                                            {isAr ? item.perkTextAr || item.descriptionAr : item.perkText || item.description}
                                        </p>
                                    </div>

                                    {/* Action Bar / Price Button */}
                                    <div>
                                        {equipped ? (
                                            <div className="w-full py-1 text-center font-black text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                                                {isAr ? '✓ مجهز حالياً' : '✓ Equipped'}
                                            </div>
                                        ) : owned ? (
                                            <button
                                                onClick={(e) => handleEquipOrBuy(e, item)}
                                                className="w-full py-1.5 text-center font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1"
                                            >
                                                <span>{isAr ? 'ارتداء' : 'Equip'}</span>
                                            </button>
                                        ) : !unlocked ? (
                                            <div className="w-full py-1 text-center font-bold text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                <span className="truncate">
                                                    {isAr
                                                        ? item.unlockRequirement?.descriptionAr
                                                        : item.unlockRequirement?.description}
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => handleEquipOrBuy(e, item)}
                                                className={`w-full py-1.5 text-center font-black text-xs rounded-xl flex items-center justify-center gap-1 transition-all ${
                                                    canAfford
                                                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <CoinIcon size={12} />
                                                <span>{item.cost}</span>
                                                <span className="text-[10px] font-normal">
                                                    {isAr ? 'شراء' : 'Buy'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarWardrobeModal;
