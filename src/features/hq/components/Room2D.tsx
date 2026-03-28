import React from 'react';
import { motion } from 'framer-motion';
import { RoomType, ROOM_NAMES, ROOM_ICONS } from '../data/themes';
import { WallPattern, FloorPattern, getWallStyle, getFloorStyle } from '../data/patterns';
import { Settings, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Room2DProps {
    roomType: RoomType;
    wallPattern: WallPattern;
    wallColor1: string;
    characterIcon?: string;
    wallColor2?: string;
    floorPattern: FloorPattern;
    floorColor: string;
    furniture?: Array<{ id: string; icon: string; x: number; y: number }>;
    onCustomize?: () => void;
    onDropFurniture?: (furnitureData: any) => void;
    showCharacter?: boolean;
    isReadOnly?: boolean;
}

const Room2D: React.FC<Room2DProps> = ({
    roomType,
    wallPattern,
    wallColor1,
    wallColor2,
    floorPattern,
    floorColor,
    furniture = [],
    characterIcon = '🧒',
    onCustomize,
    onDropFurniture,
    showCharacter = false,
    isReadOnly = false
}) => {
    const { t } = useTranslation();
    const wallStyle = getWallStyle(wallPattern, wallColor1, wallColor2);
    const floorStyle = getFloorStyle(floorPattern, floorColor);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const furnitureData = e.dataTransfer.getData('furniture');
        const placedFurnitureData = e.dataTransfer.getData('placedFurniture');

        if (furnitureData && onDropFurniture) {
            // Dropping from inventory
            onDropFurniture(JSON.parse(furnitureData));
        } else if (placedFurnitureData && onDropFurniture) {
            // Moving furniture from another room
            onDropFurniture(JSON.parse(placedFurnitureData));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative w-full h-full border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl ${isReadOnly ? '' : 'group'}`}
            onDrop={!isReadOnly ? handleDrop : undefined}
            onDragOver={!isReadOnly ? handleDragOver : undefined}
        >
            {/* Room Name Badge */}
            <div className="absolute top-2 left-2 z-30 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                <span className="text-xl">{ROOM_ICONS[roomType]}</span>
                <span className="font-bold text-sm text-gray-800">{t(`hq.rooms.${roomType}`)}</span>
            </div>

            {/* Customize Button */}
            {!isReadOnly && onCustomize && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCustomize}
                    className="absolute top-2 right-2 z-30 bg-purple-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Customize Room"
                >
                    <Settings size={18} />
                </motion.button>
            )}

            {/* Back Wall */}
            <div
                className="absolute top-0 left-0 right-0 h-1/2 border-b-4 border-gray-700"
                style={wallStyle}
            >
                {/* Window */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-gradient-to-br from-sky-200 to-sky-400 rounded-lg border-4 border-amber-900 shadow-xl">
                    <div className="absolute inset-1 grid grid-cols-2 gap-1">
                        <div className="bg-white/40 rounded"></div>
                        <div className="bg-white/40 rounded"></div>
                    </div>
                </div>

                {/* Decorative element based on room type */}
                {roomType === 'bedroom' && (
                    <div className="absolute top-4 right-4 text-3xl">🖼️</div>
                )}
                {roomType === 'bathroom' && (
                    <div className="absolute top-4 right-4 text-3xl">🪞</div>
                )}
                {roomType === 'kitchen' && (
                    <div className="absolute top-4 left-4 text-2xl">🕐</div>
                )}
            </div>

            {/* Floor */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1/2"
                style={floorStyle}
            >
                {/* Furniture */}
                {furniture.map((item) => (
                    <div
                        key={item.id}
                        className="absolute cursor-move group/item"
                        style={{
                            left: `${item.x}%`,
                            bottom: `${item.y}%`
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="text-4xl"
                            style={{
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                            }}
                            draggable={!isReadOnly}
                            onDragStart={(e) => {
                                if (isReadOnly) return;
                                const dragEvent = e as unknown as React.DragEvent<HTMLDivElement>;
                                dragEvent.dataTransfer.setData('placedFurniture', JSON.stringify({
                                    id: item.id,
                                    fromRoom: roomType
                                }));
                            }}
                        >
                            {item.icon}
                        </motion.div>
                        {/* Remove button - appears on hover */}
                        {!isReadOnly && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDropFurniture) {
                                        onDropFurniture({ action: 'remove', id: item.id });
                                    }
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                title="Remove"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ))}

                {/* Character Avatar */}
                {showCharacter && (
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute left-1/2 bottom-1/4 -translate-x-1/2 text-5xl"
                        style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.4))' }}
                    >
                        {characterIcon}
                    </motion.div>
                )}
            </div>

            {/* Side Walls for depth */}
            <div className="absolute left-0 top-1/2 bottom-0 w-4 bg-gradient-to-r from-black/30 to-transparent"></div>
            <div className="absolute right-0 top-1/2 bottom-0 w-4 bg-gradient-to-l from-black/30 to-transparent"></div>
        </motion.div>
    );
};

export default Room2D;
