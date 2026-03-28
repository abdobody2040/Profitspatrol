export interface ColorTheme {
    name: string;
    rooms: {
        bedroom: { primary: string; secondary: string };
        bathroom: { primary: string; secondary: string };
        kitchen: { primary: string; secondary: string };
        living: { primary: string; secondary: string };
        office: { primary: string; secondary: string };
        game: { primary: string; secondary: string };
    };
}

export const THEMES: Record<string, ColorTheme> = {
    girls: {
        name: 'Girls Theme',
        rooms: {
            bedroom: { primary: '#FFB6C1', secondary: '#DDA0DD' },
            bathroom: { primary: '#E6E6FA', secondary: '#98FF98' },
            kitchen: { primary: '#FFDAB9', secondary: '#FF7F50' },
            living: { primary: '#FFC0CB', secondary: '#FFFACD' },
            office: { primary: '#C8A2C8', secondary: '#FFFFFF' },
            game: { primary: '#FF69B4', secondary: '#FFB6C1' }
        }
    },
    boys: {
        name: 'Boys Theme',
        rooms: {
            bedroom: { primary: '#4169E1', secondary: '#000080' },
            bathroom: { primary: '#008080', secondary: '#00CED1' },
            kitchen: { primary: '#FF8C00', secondary: '#8B4513' },
            living: { primary: '#228B22', secondary: '#808000' },
            office: { primary: '#708090', secondary: '#4682B4' },
            game: { primary: '#DC143C', secondary: '#2F4F4F' }
        }
    },
    neutral: {
        name: 'Neutral Theme',
        rooms: {
            bedroom: { primary: '#F5F5DC', secondary: '#D2B48C' },
            bathroom: { primary: '#7FFFD4', secondary: '#FFFFFF' },
            kitchen: { primary: '#FFD700', secondary: '#FFFACD' },
            living: { primary: '#90EE90', secondary: '#A0522D' },
            office: { primary: '#D3D3D3', secondary: '#FFFFFF' },
            game: { primary: '#9370DB', secondary: '#FFA500' }
        }
    }
};

export type RoomType = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'office' | 'game';

export const ROOM_NAMES: Record<RoomType, string> = {
    bedroom: 'Bedroom',
    bathroom: 'Bathroom',
    kitchen: 'Kitchen',
    living: 'Living Room',
    office: 'Office',
    game: 'Game Room'
};

export const ROOM_ICONS: Record<RoomType, string> = {
    bedroom: '🛏️',
    bathroom: '🚿',
    kitchen: '🍳',
    living: '🛋️',
    office: '💼',
    game: '🎮'
};
