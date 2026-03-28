import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { FURNITURE_ITEMS } from '../data/furniture';
import { PlacedItem } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCw, Check, Sparkles } from 'lucide-react';
import { SoundService } from '../../../lib/sound';
import CharacterAvatar from './CharacterAvatar';

const GRID_SIZE = 6;
const TILE_SIZE = 70;


// ✅ SECURITY FIX (WCAG + Child UX): Two-step confirmation button replacing window.confirm().
// window.confirm() is inaccessible, blocks the main thread, can't be styled for children,
// and is suppressed in iframes and some mobile browsers.
const SellButton: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
    const [armed, setArmed] = React.useState(false);
    React.useEffect(() => {
        if (!armed) return;
        const t = setTimeout(() => setArmed(false), 3000); // Auto-disarm after 3s
        return () => clearTimeout(t);
    }, [armed]);
    return armed ? (
        <button
            onClick={onConfirm}
            className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:scale-110 font-bold text-xs"
            title="Confirm sell"
        >
            ✓ Sell?
        </button>
    ) : (
        <button
            onClick={() => setArmed(true)}
            className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-lg hover:scale-110"
            title="Sell item (click twice to confirm)"
        >
            <Trash2 size={20} />
        </button>
    );
};

const IsometricGrid: React.FC = () => {
    const { user, placeFurniture, moveFurniture, rotateFurniture, sellFurniture } = useAppStore();
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
    const [isPlacingNew, setIsPlacingNew] = useState<string | null>(null);

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
                    {/* Floor tile with enhanced visuals */}
                    <div className={`absolute inset-0 transition-all duration-300
                        ${isPlacingNew || selectedInstanceId ? 'group-hover:brightness-115 group-hover:scale-110' : ''}
                        ${isSelected ? 'brightness-125 ring-4 ring-yellow-400 animate-pulse' : ''}
                    `}
                        style={{
                            background: `linear-gradient(135deg, 
                                ${(x + y) % 2 === 0 ? '#fef9c3' : '#fef3c7'} 0%, 
                                ${(x + y) % 2 === 0 ? '#fde047' : '#fcd34d'} 50%,
                                ${(x + y) % 2 === 0 ? '#facc15' : '#fbbf24'} 100%)`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 50% 50%, 0% 25%)',
                            boxShadow: `
                                inset 0 -4px 8px rgba(0,0,0,0.2),
                                inset 0 3px 6px rgba(255,255,255,0.4),
                                0 6px 12px rgba(0,0,0,0.15)
                            `
                        }}
                    />

                    {/* Furniture on tile */}
                    {furn && (
                        <motion.div
                            layoutId={item!.id}
                            className="absolute inset-0 flex items-center justify-center text-5xl z-20"
                            style={{
                                transform: `rotate(${item!.rotation}deg) translateY(-25px) scale(1.2)`,
                                filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.4)) drop-shadow(0 5px 10px rgba(0,0,0,0.2))'
                            }}
                            whileHover={{ scale: 1.3, y: -30 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {furn.icon}
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
                className="absolute top-10 left-10 w-40 h-20 bg-white/70 rounded-full blur-2xl"
            ></motion.div>
            <motion.div
                animate={{ x: [0, -15, 0], opacity: [0.5, 0.7, 0.5] }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                className="absolute top-20 right-20 w-48 h-24 bg-white/60 rounded-full blur-2xl"
            ></motion.div>
            <motion.div
                animate={{ x: [0, 10, 0], opacity: [0.4, 0.6, 0.4] }}
                transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
                className="absolute top-32 left-1/3 w-44 h-22 bg-white/50 rounded-full blur-2xl"
            ></motion.div>

            {/* Room Container */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Back Wall with enhanced details */}
                <div className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-rose-200 via-pink-100 to-amber-100 border-b-4 border-amber-400 shadow-2xl">
                    {/* Wallpaper pattern */}
                    <div className="absolute inset-0 opacity-15" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 40px)`
                    }}></div>

                    {/* Window with curtains */}
                    <div className="absolute top-12 left-1/4 -translate-x-1/2">
                        {/* Curtain left */}
                        <div className="absolute -left-8 -top-4 w-12 h-32 bg-gradient-to-r from-red-400 to-red-500 rounded-r-lg shadow-lg opacity-80"></div>
                        {/* Curtain right */}
                        <div className="absolute -right-8 -top-4 w-12 h-32 bg-gradient-to-l from-red-400 to-red-500 rounded-l-lg shadow-lg opacity-80"></div>

                        {/* Window */}
                        <div className="w-36 h-28 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 rounded-lg border-4 border-amber-900 shadow-2xl relative overflow-hidden">
                            {/* Window panes */}
                            <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                                <div className="bg-white/40 rounded backdrop-blur-sm"></div>
                                <div className="bg-white/40 rounded backdrop-blur-sm"></div>
                                <div className="bg-white/40 rounded backdrop-blur-sm"></div>
                                <div className="bg-white/40 rounded backdrop-blur-sm"></div>
                            </div>
                            {/* Sun rays */}
                            <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-300 rounded-full blur-sm opacity-70"></div>
                        </div>
                    </div>

                    {/* Picture frame with better design */}
                    <div className="absolute top-16 right-1/4 translate-x-1/2">
                        <div className="w-28 h-24 bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-800 rounded-lg border-4 border-yellow-900 shadow-2xl p-1">
                            <div className="w-full h-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-500 rounded flex items-center justify-center text-4xl shadow-inner">
                                🏆
                            </div>
                        </div>
                    </div>

                    {/* Clock on wall */}
                    <div className="absolute top-14 left-2/3 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border-4 border-gray-800 shadow-xl flex items-center justify-center">
                        <div className="text-2xl">🕐</div>
                    </div>

                    {/* Plant in corner */}
                    <div className="absolute bottom-4 left-8 text-5xl drop-shadow-lg">🪴</div>
                </div>

                {/* Floor Area with Isometric Grid */}
                <div className="relative" style={{
                    width: `${GRID_SIZE * TILE_SIZE}px`,
                    height: `${GRID_SIZE * TILE_SIZE}px`,
                    marginTop: '120px'
                }}>
                    {/* Floor shadow/base */}
                    <div className="absolute inset-0 bg-black/10 rounded-full blur-3xl scale-110"></div>

                    {tiles}

                    {/* Character Avatar in center */}
                    <div className="absolute z-40" style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        >
                            <CharacterAvatar />
                        </motion.div>
                    </div>
                </div>

                {/* Side Walls with better depth */}
                <div className="absolute bottom-0 left-0 w-32 h-3/5 bg-gradient-to-r from-rose-200 via-pink-100 to-transparent border-r-2 border-amber-200 opacity-50 shadow-inner"></div>
                <div className="absolute bottom-0 right-0 w-32 h-3/5 bg-gradient-to-l from-rose-200 via-pink-100 to-transparent border-l-2 border-amber-200 opacity-50 shadow-inner"></div>
            </div>

            {/* Floating Toolbar when Selected */}
            <AnimatePresence>
                {selectedItem && selectedFurn && (
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.9 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 rounded-2xl shadow-2xl flex gap-4 items-center z-50 border-2 border-white/30"
                    >
                        <div className="text-left mr-4">
                            <div className="font-black text-white text-lg drop-shadow-md">{selectedFurn.name}</div>
                            <div className="text-xs text-purple-100 font-medium">✨ Selected</div>
                        </div>

                        <button
                            onClick={() => rotateFurniture(selectedItem.id)}
                            className="p-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:scale-110"
                        >
                            <RotateCw size={20} />
                        </button>

                        <button
                            onClick={() => setSelectedInstanceId(null)}
                            className="p-3 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:scale-110"
                            title="Done"
                        >
                            <Check size={20} />
                        </button>

                        <div className="w-px h-8 bg-white/30 mx-2" />

                        {/* ✅ SECURITY FIX: Replaced window.confirm() with a two-click confirmation.
                            window.confirm() is inaccessible (fails WCAG 2.1), blocks the JS thread,
                            cannot be styled for a child audience, and is suppressed by some browsers. */}
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
                <div className="absolute top-6 left-0 right-0 flex justify-center z-40">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl border-2 border-white/30 flex items-center gap-2"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        {isPlacingNew
                            ? "Tap a floor tile to place your item!"
                            : "Tap furniture to edit or select from inventory below"}
                    </motion.div>
                </div>
            )}

            {/* Inventory Bar with enhanced design */}
            {!selectedInstanceId && (
                <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-40">
                    <motion.div
                        data-testid="inventory"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex gap-3 overflow-x-auto max-w-full border-4 border-purple-200"
                    >
                        {user.inventory.filter(id => FURNITURE_ITEMS.some(f => f.id === id)).length === 0 ? (
                            <div className="text-sm font-bold text-gray-500 px-6 py-3 flex items-center gap-2">
                                <span className="text-2xl">🛒</span>
                                <span>Inventory Empty - Buy items from the shop!</span>
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
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-all flex-shrink-0
                                                ${isSelected
                                                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-4 ring-green-300 shadow-2xl'
                                                    : 'bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 hover:from-purple-200 hover:via-pink-200 hover:to-rose-200 shadow-lg'}
                                            `}
                                        >
                                            {furn.icon}
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg"
                                                >
                                                    <Check size={12} />
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
