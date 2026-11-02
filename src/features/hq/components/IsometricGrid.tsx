import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { FURNITURE_ITEMS } from '../data/furniture';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCw, Check, Sparkles } from 'lucide-react';
import { SoundService } from '../../../lib/sound';
import CharacterAvatar from './CharacterAvatar';
import { useTranslation } from 'react-i18next';

const GRID_SIZE = 6;
const TILE_SIZE = 70;


// ✅ SECURITY FIX (WCAG + Child UX): Two-step confirmation button replacing window.confirm().
// window.confirm() is inaccessible, blocks the main thread, can't be styled for children,
// and is suppressed in iframes and some mobile browsers.
const SellButton: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
    const { t } = useTranslation();
    const [armed, setArmed] = React.useState(false);
    React.useEffect(() => {
        if (!armed) return;
        const timeout = setTimeout(() => setArmed(false), 3000); // Auto-disarm after 3s
        return () => clearTimeout(timeout);
    }, [armed]);
    return armed ? (
        <button
            onClick={onConfirm}
            className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:scale-110 font-bold text-xs"
            title={t('hq_builder.confirm_sell', '✓ Sell?')}
        >
            {t('hq_builder.confirm_sell', '✓ Sell?')}
        </button>
    ) : (
        <button
            onClick={() => setArmed(true)}
            className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-lg hover:scale-110"
            title={t('hq_builder.sell_item_tooltip', 'Sell item (click twice to confirm)')}
        >
            <Trash2 size={20} />
        </button>
    );
};

const IsometricGrid: React.FC = () => {
    const { t } = useTranslation();
    const { user, placeFurniture, moveFurniture, rotateFurniture, sellFurniture } = useAppStore();
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
    const [isPlacingNew, setIsPlacingNew] = useState<string | null>(null);
    const [npcs, setNpcs] = useState<{id: number, x: number, y: number}[]>([
        {id: 1, x: 1, y: 2},
        {id: 2, x: 4, y: 1},
        {id: 3, x: 2, y: 4}
    ]);

    // Randomly move NPCs every few seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setNpcs(prev => prev.map(npc => {
                // 30% chance to move
                if (Math.random() > 0.3) {
                    const dx = Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0;
                    const dy = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : 0;
                    const newX = Math.max(0, Math.min(GRID_SIZE - 1, npc.x + dx));
                    const newY = Math.max(0, Math.min(GRID_SIZE - 1, npc.y + dy));
                    return { ...npc, x: newX, y: newY };
                }
                return npc;
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!user) return null;

    const getFurn = (id: string) => FURNITURE_ITEMS.find(f => f.id === id);

    const handleGridClick = (x: number, y: number) => {
        if (isPlacingNew) {
            const furniture = getFurn(isPlacingNew);
            if (furniture) {
                placeFurniture(furniture, x, y);
                setIsPlacingNew(null);
                SoundService.playSuccess();
            }
        } else if (selectedInstanceId) {
            moveFurniture(selectedInstanceId, x, y);
            setSelectedInstanceId(null);
            SoundService.playClick();
        } else {
            const itemAtSpot = user.placedItems?.find(p => p.x === x && p.y === y);
            if (itemAtSpot) {
                setSelectedInstanceId(itemAtSpot.id);
                SoundService.playClick();
            }
        }
    };

    // Render isometric floor tiles
    const tiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const item = user.placedItems?.find(p => p.x === x && p.y === y);
            const furn = item ? getFurn(item.itemId) : null;
            const isSelected = item && item.id === selectedInstanceId;

            const isoX = (x - y) * (TILE_SIZE / 2);
            const isoY = (x + y) * (TILE_SIZE / 4);

            tiles.push(
                <div
                    key={`${x}-${y}`}
                    onClick={() => handleGridClick(x, y)}
                    className={`absolute cursor-pointer transition-all duration-200 group
                        ${isSelected ? 'z-30' : 'z-10'}
                    `}
                    style={{
                        left: `calc(50% + ${isoX}px)`,
                        top: `calc(50% + ${isoY}px)`,
                        width: `${TILE_SIZE}px`,
                        height: `${TILE_SIZE / 2}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Premium Toy Floor tile */}
                    <div className={`absolute inset-0 transition-all duration-300
                        ${isPlacingNew || selectedInstanceId ? 'group-hover:brightness-110 group-hover:-translate-y-2' : ''}
                        ${isSelected ? 'brightness-125 ring-4 ring-yellow-400 animate-pulse z-10 scale-105' : ''}
                    `}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${(x + y) % 2 === 0 ? '#e0f2fe' : '#bae6fd'} 0%, 
                                ${(x + y) % 2 === 0 ? '#bae6fd' : '#7dd3fc'} 100%)`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)',
                            boxShadow: `
                                inset 0 -4px 8px rgba(255,255,255,0.9),
                                inset 0 4px 8px rgba(14, 165, 233, 0.2)
                            `,
                            border: '2px solid rgba(255,255,255,0.6)'
                        }}
                    />

                    {/* Furniture on tile */}
                    {furn && (
                        <motion.div
                            layoutId={item!.id}
                            className="absolute z-20 flex items-end justify-center"
                            style={{
                                left: '50%',
                                bottom: '50%',
                                transform: `translateX(-50%) rotate(${item!.rotation}deg) scale(1.2)`,
                                transformOrigin: 'bottom center',
                                filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.4)) drop-shadow(0 5px 10px rgba(0,0,0,0.2))'
                            }}
                            whileHover={{ scale: 1.3, y: -10 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className="text-5xl translate-y-[10px]">{furn.icon}</div>
                        </motion.div>
                    )}

                    {/* NPC on tile */}
                    {npcs.find(n => n.x === x && n.y === y) && !furn && (
                        <motion.div
                            layout
                            className="absolute z-20 pointer-events-none"
                            style={{
                                left: '50%',
                                bottom: '50%',
                                translateX: '-50%',
                                transformOrigin: 'bottom center',
                                filter: 'drop-shadow(0 15px 10px rgba(0,0,0,0.3))'
                            }}
                            initial={{ scale: 0.6 }}
                            animate={{ scale: [0.6, 0.62, 0.6], y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        >
                            <CharacterAvatar />
                        </motion.div>
                    )}
                </div>
            );
        }
    }

    const selectedItem = user.placedItems?.find(p => p.id === selectedInstanceId);
    const selectedFurn = selectedItem ? getFurn(selectedItem.itemId) : null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-sky-400 via-blue-300 to-purple-200">
            {/* Animated Clouds in background */}
            <motion.div
                animate={{ x: [0, 20, 0], opacity: [0.6, 0.8, 0.6] }}
                transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                className="absolute top-10 start-10 w-40 h-20 bg-white/70 rounded-full blur-2xl"
            ></motion.div>
            <motion.div
                animate={{ x: [0, -15, 0], opacity: [0.5, 0.7, 0.5] }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                className="absolute top-20 end-20 w-48 h-24 bg-white/60 rounded-full blur-2xl"
            ></motion.div>
            <motion.div
                animate={{ x: [0, 10, 0], opacity: [0.4, 0.6, 0.4] }}
                transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
                className="absolute top-32 start-1/3 w-44 h-22 bg-white/50 rounded-full blur-2xl"
            ></motion.div>

            {/* 3D Room Environment (Toy Playset Style) */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* 3D Walls Layer */}
                <div className="absolute z-0" style={{ transform: 'translateY(-20px)' }}>
                    {/* Left Wall */}
                    <div className="absolute bg-gradient-to-br from-indigo-50/95 to-sky-100/95 border-l-[6px] border-t-[6px] border-white shadow-2xl backdrop-blur-md"
                         style={{
                             left: -210,
                             top: -167.5,
                             width: 210,
                             height: 255,
                             clipPath: 'polygon(0 105px, 100% 0, 100% 150px, 0 255px)'
                         }}
                    >
                        {/* Glowing Window Rays */}
                        <div className="absolute w-[150px] h-[200px] bg-yellow-200/20 mix-blend-overlay blur-xl transform skew-y-[26.5deg] -translate-x-10 translate-y-20 pointer-events-none"></div>

                        {/* Window */}
                        <div className="absolute bg-sky-200/40 border-[4px] border-white shadow-[inset_0_10px_20px_rgba(0,0,0,0.1),0_5px_15px_rgba(255,255,255,0.8)]"
                             style={{
                                 left: 40, top: 60, width: 80, height: 100,
                                 clipPath: 'polygon(0 40px, 100% 0, 100% 100px, 0 140px)'
                             }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/60 to-sky-300/40"></div>
                            {/* Window panes */}
                            <div className="absolute w-full h-[4px] bg-white top-1/2 -translate-y-1/2" style={{ transform: 'skewY(-26.565deg)' }}></div>
                            <div className="absolute h-full w-[4px] bg-white left-1/2 -translate-x-1/2"></div>
                        </div>
                    </div>
                    
                    {/* Right Wall */}
                    <div className="absolute bg-gradient-to-bl from-slate-50/95 to-slate-200/95 border-r-[6px] border-t-[6px] border-white shadow-2xl backdrop-blur-md"
                         style={{
                             left: 0,
                             top: -167.5,
                             width: 210,
                             height: 255,
                             clipPath: 'polygon(0 0, 100% 105px, 100% 255px, 0 150px)'
                         }}
                    >
                        {/* Cute Poster */}
                        <div className="absolute bg-pink-100 border-[3px] border-white shadow-md flex items-center justify-center rounded-lg overflow-hidden"
                             style={{
                                 left: 60, top: 40, width: 60, height: 80,
                                 clipPath: 'polygon(0 0, 100% 30px, 100% 110px, 0 80px)'
                             }}
                        >
                            <div className="w-10 h-10 bg-pink-300 rounded-full absolute top-1/4 flex items-center justify-center transform skew-y-[26.5deg]">
                                <span className="text-xl">🚀</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Thick Chunky Floor Base (LEGO Style) */}
                    <div className="absolute bg-gradient-to-b from-sky-400 to-blue-600 border-x-4 border-b-4 border-blue-800/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                         style={{
                             left: -210,
                             top: 87.5,
                             width: 420,
                             height: 125,
                             clipPath: 'polygon(0 0, 50% 105px, 100% 0, 100% 20px, 50% 125px, 0 20px)'
                         }}
                    />
                </div>

                {/* Floor Area with Isometric Grid */}
                <div className="relative z-10" style={{
                    width: `${GRID_SIZE * TILE_SIZE}px`,
                    height: `${GRID_SIZE * TILE_SIZE}px`,
                    transform: 'translateY(-20px)'
                }}>
                    {/* Floor shadow */}
                    <div className="absolute inset-0 bg-black/15 rounded-full blur-2xl scale-105" style={{ top: '20%' }}></div>

                    {tiles}
                </div>
            </div>

            {/* Floating Toolbar when Selected */}
            <AnimatePresence>
                {selectedItem && selectedFurn && (
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.9 }}
                        className="absolute bottom-8 start-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl shadow-2xl flex gap-4 items-center z-50 border-2 border-white/30"
                    >
                        <div className="text-start me-4">
                            <div className="font-black text-white text-lg drop-shadow-md">{t(`furniture.${selectedFurn.id}.name`, selectedFurn.name)}</div>
                            <div className="text-xs text-purple-100 font-medium">✨ {t('hq_builder.selected', 'Selected')}</div>
                        </div>

                        <button
                            onClick={() => rotateFurniture(selectedItem.id)}
                            className="p-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:scale-110"
                            title={t('hq_builder.rotate', 'Rotate')}
                        >
                            <RotateCw size={20} />
                        </button>

                        <button
                            onClick={() => setSelectedInstanceId(null)}
                            className="p-3 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:scale-110"
                            title={t('hq_builder.done', 'Done')}
                        >
                            <Check size={20} />
                        </button>

                        <div className="w-px h-8 bg-white/30 mx-2" />

                        <SellButton
                            onConfirm={() => {
                                sellFurniture(selectedItem.id, selectedFurn.cost);
                                setSelectedInstanceId(null);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Helper Text */}
            {!selectedInstanceId && (
                <div className="absolute top-6 start-0 end-0 flex justify-center z-40">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl border-2 border-white/30 flex items-center gap-2"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        {isPlacingNew
                            ? t('hq_builder.tap_floor', 'Tap a floor tile to place your item!')
                            : t('hq_builder.tap_furniture', 'Tap furniture to edit or select from inventory below')}
                    </motion.div>
                </div>
            )}

            {/* Inventory Bar with premium casual game design */}
            {!selectedInstanceId && (
                <div className="absolute bottom-6 start-0 end-0 px-4 flex justify-center z-40 pointer-events-none">
                    <motion.div
                        data-testid="inventory"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', bounce: 0.6 }}
                        className="bg-white/90 backdrop-blur-2xl p-4 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.2),inset_0_4px_10px_rgba(255,255,255,0.9)] flex gap-3 overflow-x-auto max-w-[90%] border-4 border-white pointer-events-auto"
                    >
                        {user.inventory.filter(id => FURNITURE_ITEMS.some(f => f.id === id)).length === 0 ? (
                            <div className="text-sm font-bold text-gray-500 px-6 py-3 flex items-center gap-2">
                                <span className="text-2xl animate-bounce">🛒</span>
                                <span>{t('hq_builder.inventory_empty', 'Inventory Empty - Buy items from the shop!')}</span>
                            </div>
                        ) : (
                            user.inventory
                                .filter(id => FURNITURE_ITEMS.some(f => f.id === id))
                                .map((itemId, idx) => {
                                    const furn = getFurn(itemId);
                                    if (!furn) return null;
                                    const isSelected = isPlacingNew === itemId;

                                    return (
                                        <motion.button
                                            key={`${itemId}-${idx}`}
                                            data-testid="inventory-item"
                                            onClick={() => {
                                                setIsPlacingNew(isSelected ? null : itemId);
                                                SoundService.playClick();
                                            }}
                                            whileHover={{ scale: 1.15, y: -8, rotate: Math.random() * 10 - 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`relative w-24 h-24 rounded-[24px] flex items-center justify-center text-5xl transition-all flex-shrink-0 border-[3px]
                                                ${isSelected
                                                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-white shadow-[0_10px_20px_rgba(16,185,129,0.5),inset_0_4px_10px_rgba(255,255,255,0.6)] animate-pulse'
                                                    : 'bg-gradient-to-br from-indigo-50 to-purple-100 border-white shadow-[0_8px_15px_rgba(0,0,0,0.1),inset_0_4px_10px_rgba(255,255,255,0.8)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)]'}
                                            `}
                                        >
                                            <span className="drop-shadow-lg">{furn.icon}</span>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: 'spring', bounce: 0.7 }}
                                                    className="absolute -top-3 -end-3 bg-green-500 text-white rounded-full p-2 shadow-lg border-2 border-white"
                                                >
                                                    <Check size={16} className="stroke-[4]" />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default IsometricGrid;
