import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Sparkles, X, ShoppingBag, Star, CheckCircle2, Lock } from 'lucide-react';
import { useAppStore } from '../../../store';

// ─── Item Catalogue ───────────────────────────────────────────────────────────
export type AvatarCategory = 'hair' | 'outfit' | 'accessory' | 'background';

export interface AvatarItem {
    id: string;
    name: string;
    category: AvatarCategory;
    emoji: string; // visual representation
    cost: number; // BizCoins (0 = free / starter)
    rarity: 'common' | 'rare' | 'epic';
    color?: string; // accent color for card
}

const AVATAR_ITEMS: AvatarItem[] = [
    // HAIR
    { id: 'h0', name: 'Casual Curls', category: 'hair', emoji: '🧑', cost: 0, rarity: 'common', color: '#F59E0B' },
    { id: 'h1', name: 'CEO Cut', category: 'hair', emoji: '💈', cost: 80, rarity: 'common', color: '#6366F1' },
    { id: 'h2', name: 'Braids', category: 'hair', emoji: '🎀', cost: 120, rarity: 'rare', color: '#EC4899' },
    { id: 'h3', name: 'Mohawk', category: 'hair', emoji: '⚡', cost: 200, rarity: 'epic', color: '#EF4444' },
    { id: 'h4', name: 'Afro Crown', category: 'hair', emoji: '👑', cost: 250, rarity: 'epic', color: '#F59E0B' },
    // OUTFIT
    { id: 'o0', name: 'T-Shirt', category: 'outfit', emoji: '👕', cost: 0, rarity: 'common', color: '#6B7280' },
    { id: 'o1', name: 'Business Suit', category: 'outfit', emoji: '🤵', cost: 150, rarity: 'rare', color: '#1E40AF' },
    { id: 'o2', name: 'Lab Coat', category: 'outfit', emoji: '🥼', cost: 180, rarity: 'rare', color: '#10B981' },
    { id: 'o3', name: 'Hoodie', category: 'outfit', emoji: '🧥', cost: 100, rarity: 'common', color: '#7C3AED' },
    { id: 'o4', name: 'CEO Blazer', category: 'outfit', emoji: '🦺', cost: 350, rarity: 'epic', color: '#EF4444' },
    { id: 'o5', name: 'Astronaut', category: 'outfit', emoji: '👨‍🚀', cost: 400, rarity: 'epic', color: '#0EA5E9' },
    // ACCESSORY
    { id: 'a0', name: 'None', category: 'accessory', emoji: '🙂', cost: 0, rarity: 'common', color: '#9CA3AF' },
    { id: 'a1', name: 'Cool Shades', category: 'accessory', emoji: '🕶️', cost: 60, rarity: 'common', color: '#374151' },
    { id: 'a2', name: 'Golden Chain', category: 'accessory', emoji: '📿', cost: 120, rarity: 'rare', color: '#F59E0B' },
    { id: 'a3', name: 'Top Hat', category: 'accessory', emoji: '🎩', cost: 200, rarity: 'epic', color: '#1F2937' },
    { id: 'a4', name: 'Rocket Backpack', category: 'accessory', emoji: '🎒', cost: 280, rarity: 'epic', color: '#EF4444' },
    // BACKGROUND
    { id: 'bg0', name: 'Office', category: 'background', emoji: '🏢', cost: 0, rarity: 'common', color: '#6B7280' },
    { id: 'bg1', name: 'Space Station', category: 'background', emoji: '🚀', cost: 150, rarity: 'rare', color: '#1D4ED8' },
    { id: 'bg2', name: 'Tropical Beach', category: 'background', emoji: '🏖️', cost: 120, rarity: 'common', color: '#0EA5E9' },
    { id: 'bg3', name: 'Neon City', category: 'background', emoji: '🌃', cost: 200, rarity: 'epic', color: '#7C3AED' },
    { id: 'bg4', name: 'Money Rain', category: 'background', emoji: '💸', cost: 300, rarity: 'epic', color: '#10B981' },
];

const CATEGORIES: { key: AvatarCategory; label: string; emoji: string }[] = [
    { key: 'hair', label: 'Hair', emoji: '💇' },
    { key: 'outfit', label: 'Outfit', emoji: '👗' },
    { key: 'accessory', label: 'Accessory', emoji: '✨' },
    { key: 'background', label: 'BG', emoji: '🖼️' },
];

const RARITY_COLORS = { common: '#6B7280', rare: '#6366F1', epic: '#F59E0B' };
const RARITY_BADGE = { common: '●', rare: '★', epic: '👑' };

// ─── Avatar Preview ───────────────────────────────────────────────────────────
function AvatarPreview({ equipped, username }: { equipped: Record<AvatarCategory, AvatarItem | null>; username: string }) {
    const bg = equipped.background;
    const hair = equipped.hair;
    const outfit = equipped.outfit;
    const acc = equipped.accessory;

    const bgEmojis: Record<string, string> = {
        bg0: '🏢', bg1: '🌌', bg2: '🌊', bg3: '🌆', bg4: '💰',
    };

    return (
        <div className="relative flex flex-col items-center justify-end rounded-3xl overflow-hidden shadow-xl p-6 text-center"
            style={{
                minHeight: 200,
                background: bg?.id === 'bg1' ? 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' :
                    bg?.id === 'bg3' ? 'linear-gradient(135deg,#0f0035,#3b0068,#6a00b5)' :
                        bg?.id === 'bg4' ? 'linear-gradient(135deg,#134e4a,#065f46)' :
                            bg?.id === 'bg2' ? 'linear-gradient(135deg,#0ea5e9,#38bdf8,#bae6fd)' :
                                'linear-gradient(135deg,#e0e7ff,#c7d2fe)'
            }}>
            {/* Background emoji scatter */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[80px] select-none pointer-events-none">
                {bgEmojis[bg?.id ?? 'bg0'] ?? '🏢'}
            </div>

            {/* Avatar */}
            <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="text-6xl leading-none select-none">
                    {outfit?.emoji ?? '👕'}
                </div>
                <div className="flex gap-1 text-2xl">
                    {hair?.emoji !== '🧑' && <span>{hair?.emoji}</span>}
                    {acc?.id !== 'a0' && <span>{acc?.emoji}</span>}
                </div>
                <p className="mt-2 font-black text-white text-sm drop-shadow-md">{username}</p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface AvatarCustomizerProps { onClose?: () => void; }

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, buyAvatarItem, equipAvatarItem } = useAppStore();

    const [activeCategory, setActiveCategory] = useState<AvatarCategory>('outfit');
    const [feedMsg, setFeedMsg] = useState<string | null>(null);

    const ownedIds: string[] = user?.inventory ?? [];
    const equippedIds: string[] = user?.equippedItems ?? [];
    const bizCoins = user?.bizCoins ?? 0;
    const userName = user?.name ?? 'Kid CEO';

    // Build the "equipped item per category" map
    const equipped = useMemo<Record<AvatarCategory, AvatarItem | null>>(() => {
        const result: Record<AvatarCategory, AvatarItem | null> = { hair: null, outfit: null, accessory: null, background: null };
        CATEGORIES.forEach(({ key }) => {
            const itemsInCat = AVATAR_ITEMS.filter(i => i.category === key);
            result[key] = itemsInCat.find(i => equippedIds.includes(i.id)) ??
                itemsInCat.find(i => i.cost === 0) ?? null;
        });
        return result;
    }, [equippedIds]);

    const catItems = AVATAR_ITEMS.filter(i => i.category === activeCategory);

    const handleBuy = (item: AvatarItem) => {
        if (bizCoins < item.cost) { setFeedMsg('❌ Not enough BizCoins!'); setTimeout(() => setFeedMsg(null), 2000); return; }
        buyAvatarItem(item.id, item.cost);
        equipAvatarItem(item.id, item.category);
        setFeedMsg(`✅ Got "${item.name}"! +Equipped`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.65 } });
        setTimeout(() => setFeedMsg(null), 3000);
    };

    const handleEquip = (item: AvatarItem) => {
        equipAvatarItem(item.id, item.category);
        setFeedMsg(`👗 Equipped "${item.name}"`);
        setTimeout(() => setFeedMsg(null), 2000);
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-pink-500" />
                        {t('avatar.title')}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{t('avatar.subtitle')}</p>
                </div>
                {onClose && <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>}
            </div>

            {/* Avatar Preview */}
            <AvatarPreview equipped={equipped} username={userName} />

            {/* Wallet */}
            <div className="flex items-center justify-between px-1">
                <span className="text-sm font-bold text-yellow-500">🪙 {bizCoins.toLocaleString()} BizCoins</span>
                <span className="text-xs text-gray-400">{ownedIds.filter(id => AVATAR_ITEMS.find(a => a.id === id)).length}/{AVATAR_ITEMS.length} items</span>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                {CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${activeCategory === cat.key ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500'}`}>
                        <span className="text-base">{cat.emoji}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Feed Message */}
            <AnimatePresence>
                {feedMsg && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-gray-800 dark:bg-white text-white dark:text-gray-800 text-sm font-semibold text-center rounded-xl p-2.5">
                        {feedMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Item Grid */}
            <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto">
                {catItems.map(item => {
                    const owned = item.cost === 0 || ownedIds.includes(item.id);
                    const isEquipped = equippedIds.includes(item.id) || (item.cost === 0 && equipped[item.category]?.id === item.id);
                    const canAfford = bizCoins >= item.cost;

                    return (
                        <motion.div key={item.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                if (!owned) handleBuy(item);
                                else if (!isEquipped) handleEquip(item);
                            }}
                            className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl cursor-pointer transition-all border-2 ${isEquipped ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20' : owned ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300' : canAfford ? 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-yellow-400' : 'border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 opacity-70'}`}>

                            {/* Rarity pip */}
                            <span className="absolute top-1.5 right-1.5 text-xs" style={{ color: RARITY_COLORS[item.rarity] }}>
                                {RARITY_BADGE[item.rarity]}
                            </span>

                            <span className="text-3xl leading-none">{item.emoji}</span>
                            <p className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">{item.name}</p>

                            {isEquipped ? (
                                <span className="text-xs font-black text-pink-500 flex items-center gap-0.5"><CheckCircle2 size={10} /> On</span>
                            ) : owned ? (
                                <span className="text-xs text-green-600 font-bold">Equip</span>
                            ) : (
                                <span className={`text-xs font-black flex items-center gap-0.5 ${canAfford ? 'text-yellow-600' : 'text-gray-400'}`}>
                                    {canAfford ? <>🪙{item.cost}</> : <><Lock size={9} />{item.cost}</>}
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-center text-xs text-gray-300 dark:text-gray-600">Earn BizCoins by completing lessons, gigs & daily challenges</p>
        </div>
    );
};

export default AvatarCustomizer;
