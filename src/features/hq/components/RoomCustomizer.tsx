import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { RoomType, ROOM_NAMES, ROOM_ICONS } from '../data/themes';
import { WallPattern, FloorPattern, WALL_PATTERNS, FLOOR_PATTERNS } from '../data/patterns';

interface RoomCustomizerProps {
    roomType: RoomType;
    wallPattern: WallPattern;
    wallColor1: string;
    wallColor2: string;
    floorPattern: FloorPattern;
    floorColor: string;
    onClose: () => void;
    onUpdate: (updates: {
        wallPattern?: WallPattern;
        wallColor1?: string;
        wallColor2?: string;
        floorPattern?: FloorPattern;
        floorColor?: string;
    }) => void;
}

const RoomCustomizer: React.FC<RoomCustomizerProps> = ({
    roomType,
    wallPattern,
    wallColor1,
    wallColor2,
    floorPattern,
    floorColor,
    onClose,
    onUpdate
}) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{ROOM_ICONS[roomType]}</span>
                            <div>
                                <h2 className="text-2xl font-black">Customize {ROOM_NAMES[roomType]}</h2>
                                <p className="text-sm text-purple-100">Make it your own!</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Wall Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                🧱 Wall Design
                            </h3>

                            {/* Wall Pattern */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Pattern
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(WALL_PATTERNS).map(([key, { name, icon }]) => (
                                        <button
                                            key={key}
                                            onClick={() => onUpdate({ wallPattern: key as WallPattern })}
                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1
                                                ${wallPattern === key
                                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                }`}
                                        >
                                            <span className="text-2xl">{icon}</span>
                                            <span className="text-xs font-medium">{name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Wall Colors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Primary Color
                                    </label>
                                    <input
                                        type="color"
                                        value={wallColor1}
                                        onChange={(e) => onUpdate({ wallColor1: e.target.value })}
                                        className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Secondary Color
                                    </label>
                                    <input
                                        type="color"
                                        value={wallColor2}
                                        onChange={(e) => onUpdate({ wallColor2: e.target.value })}
                                        className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Floor Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                🏠 Floor Design
                            </h3>

                            {/* Floor Pattern */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Pattern
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.entries(FLOOR_PATTERNS).map(([key, { name, icon }]) => (
                                        <button
                                            key={key}
                                            onClick={() => onUpdate({ floorPattern: key as FloorPattern })}
                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1
                                                ${floorPattern === key
                                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                }`}
                                        >
                                            <span className="text-2xl">{icon}</span>
                                            <span className="text-xs font-medium">{name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Floor Color */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Floor Color
                                </label>
                                <input
                                    type="color"
                                    value={floorColor}
                                    onChange={(e) => onUpdate({ floorColor: e.target.value })}
                                    className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Done Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all"
                        >
                            ✨ Done
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RoomCustomizer;
