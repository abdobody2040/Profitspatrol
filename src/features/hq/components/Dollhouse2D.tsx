import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { motion } from 'framer-motion';
import { RoomType, THEMES, ROOM_NAMES } from '../data/themes';
import { WallPattern, FloorPattern } from '../data/patterns';
import { FURNITURE_ITEMS } from '../data/furniture';
import { useTranslation } from 'react-i18next';
import Room2D from './Room2D';
import ThemeSelector from './ThemeSelector';
import RoomCustomizer from './RoomCustomizer';

interface RoomCustomization {
    wallPattern: WallPattern;
    wallColor1: string;
    wallColor2: string;
    floorPattern: FloorPattern;
    floorColor: string;
}

const DEFAULT_CUSTOMIZATIONS: Record<RoomType, RoomCustomization> = {
    bedroom: { wallPattern: 'solid', wallColor1: '#FFB6C1', wallColor2: '#DDA0DD', floorPattern: 'hardwood', floorColor: '#8B4513' },
    bathroom: { wallPattern: 'solid', wallColor1: '#E6E6FA', wallColor2: '#98FF98', floorPattern: 'tile', floorColor: '#E0E0E0' },
    kitchen: { wallPattern: 'solid', wallColor1: '#FFDAB9', wallColor2: '#FF7F50', floorPattern: 'tile', floorColor: '#FFFACD' },
    living: { wallPattern: 'solid', wallColor1: '#FFC0CB', wallColor2: '#FFFACD', floorPattern: 'carpet', floorColor: '#D2B48C' },
    office: { wallPattern: 'solid', wallColor1: '#C8A2C8', wallColor2: '#FFFFFF', floorPattern: 'hardwood', floorColor: '#A0522D' },
    game: { wallPattern: 'solid', wallColor1: '#FF69B4', wallColor2: '#FFB6C1', floorPattern: 'carpet', floorColor: '#9370DB' }
};

interface Dollhouse2DProps {
    displayUser?: any;
    isReadOnly?: boolean;
}

const Dollhouse2D: React.FC<Dollhouse2DProps> = ({ displayUser, isReadOnly = false }) => {
    const { user: currentUser } = useAppStore();
    const user = displayUser || currentUser;
    const { t } = useTranslation();
    const [currentTheme, setCurrentTheme] = useState<string>(user?.hqTheme === 'boys' ? 'boys' : 'girls');
    const [customizations, setCustomizations] = useState<Record<RoomType, RoomCustomization>>(DEFAULT_CUSTOMIZATIONS);
    const [customizingRoom, setCustomizingRoom] = useState<RoomType | null>(null);

    if (!user) return null;

    const rooms: RoomType[] = ['bedroom', 'bathroom', 'kitchen', 'living', 'office', 'game'];

    // Get character icon based on theme
    const characterIcon = currentTheme === 'girls' ? '👧' : '👦';

    const handleThemeChange = (theme: string) => {
        setCurrentTheme(theme);
        const themeData = THEMES[theme];
        if (themeData) {
            const newCustomizations: Record<RoomType, RoomCustomization> = {} as any;
            rooms.forEach(roomType => {
                newCustomizations[roomType] = {
                    ...customizations[roomType],
                    wallColor1: themeData.rooms[roomType].primary,
                    wallColor2: themeData.rooms[roomType].secondary
                };
            });
            setCustomizations(newCustomizations);
        }
    };

    const handleRoomUpdate = (roomType: RoomType, updates: Partial<RoomCustomization>) => {
        setCustomizations(prev => ({
            ...prev,
            [roomType]: { ...prev[roomType], ...updates }
        }));
    };

    // Get user's furniture inventory
    const userFurniture = user.inventory || [];
    const { placeFurniture, removeFurnitureFromRoom, moveFurnitureToRoom } = useAppStore();

    const handleFurnitureDrop = (roomType: RoomType, furnitureData: any) => {
        // Check if it's a placed furniture being moved
        if (furnitureData.action === 'remove') {
            // Remove furniture from room and return to inventory
            removeFurnitureFromRoom(furnitureData.id);
        } else if (furnitureData.fromRoom) {
            // Moving furniture from another room
            moveFurnitureToRoom(furnitureData.id, roomType);
        } else {
            // Place furniture from inventory in the room
            placeFurniture(furnitureData, 0, 0, roomType);
        }
    };

    // Get furniture placed in each room
    const getRoomFurniture = (roomType: RoomType) => {
        const placedInRoom = user?.placedItems?.filter((item: any) => item.roomType === roomType) || [];
        // Map to furniture with icons
        return placedInRoom.map((placedItem: any, index: number) => {
            const furnitureItem = FURNITURE_ITEMS.find(f => f.id === placedItem.itemId);
            return {
                id: placedItem.id,
                icon: furnitureItem?.icon || '🪑',
                x: 20 + (index * 25), // Spread items horizontally
                y: 10
            };
        });
    };

    return (
        <div className="relative w-full h-full">
            {/* Theme Selector with Helper Text */}
            {!isReadOnly && (
                <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-center gap-6">
                    <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />

                    {/* Helper Text beside gender selector */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border-2 border-purple-200 dark:border-purple-700"
                    >
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            ✨ {t('hq.hover_customize')} <span className="text-purple-600">⚙️</span>
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Dollhouse Grid */}
            <div className="absolute inset-0 pt-24 pb-4 px-4">
                <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4">
                    {rooms.map((roomType, index) => {
                        const customization = customizations[roomType];
                        return (
                            <Room2D
                                key={roomType}
                                roomType={roomType}
                                wallPattern={customization.wallPattern}
                                wallColor1={customization.wallColor1}
                                wallColor2={customization.wallColor2}
                                floorPattern={customization.floorPattern}
                                floorColor={customization.floorColor}
                                characterIcon={characterIcon}
                                showCharacter={index === 0} // Show character in first room (bedroom)
                                furniture={getRoomFurniture(roomType)}
                                onCustomize={() => setCustomizingRoom(roomType)}
                                onDropFurniture={(furnitureData) => handleFurnitureDrop(roomType, furnitureData)}
                                isReadOnly={isReadOnly}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Room Customizer Modal */}
            {customizingRoom && (
                <RoomCustomizer
                    roomType={customizingRoom}
                    wallPattern={customizations[customizingRoom].wallPattern}
                    wallColor1={customizations[customizingRoom].wallColor1}
                    wallColor2={customizations[customizingRoom].wallColor2}
                    floorPattern={customizations[customizingRoom].floorPattern}
                    floorColor={customizations[customizingRoom].floorColor}
                    onClose={() => setCustomizingRoom(null)}
                    onUpdate={(updates) => handleRoomUpdate(customizingRoom, updates)}
                />
            )}
        </div>
    );
};

export default Dollhouse2D;
