import React from 'react';
import { AvatarWardrobeModal } from '../../avatar/components/AvatarWardrobeModal';

export type AvatarCategory = 'hair' | 'outfit' | 'accessory' | 'background';

export interface AvatarItem {
    id: string;
    name: string;
    category: AvatarCategory;
    emoji: string;
    cost: number;
    rarity: 'common' | 'rare' | 'epic';
    color?: string;
}

export interface AvatarCustomizerProps { 
    onClose?: () => void; 
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ onClose }) => {
    return <AvatarWardrobeModal onClose={onClose} />;
};

export default AvatarCustomizer;
