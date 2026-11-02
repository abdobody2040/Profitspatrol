export type AvatarCategory = 
    | 'skin'
    | 'face'
    | 'hair'
    | 'clothing' 
    | 'pants'
    | 'shoes'
    | 'accessories' 
    | 'business' 
    | 'district' 
    | 'achievement' 
    | 'background';

export type AvatarRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type UnlockRequirementType = 'free' | 'level' | 'district' | 'achievement' | 'business_revenue';

export interface UnlockRequirement {
    type: UnlockRequirementType;
    target?: number | string;
    description: string;
    descriptionAr: string;
}

export type RenderingMode = 'layered_parts' | 'complete_character' | 'standalone_item';

export interface AvatarItem {
    id: string; // Structured Asset ID (e.g. kenney_shirt_blue_1, avatar_business_blazer_001)
    name: string;
    nameAr: string;
    category: AvatarCategory;
    subcategory?: string; // 'skin' | 'face' | 'hair' | 'shirt' | 'pants' | 'shoes' | 'accessory' | 'background'
    source?: 'kenney' | 'custom' | 'generated';
    renderingMode?: RenderingMode;
    filePath?: string; // Relative asset path in public (e.g. /images/personal%20profile/PNG/...)
    thumbnailPath?: string;
    armFilePath?: string; // Corresponding sleeve/arm asset for shirts
    legFilePath?: string; // Corresponding pant leg asset for bottoms
    emoji?: string;
    description: string;
    descriptionAr: string;
    cost: number; // PP Tokens (0 = starter / reward)
    rarity: AvatarRarity;
    color?: string; // Theme/accent color
    unlockRequirement?: UnlockRequirement;
    perkText?: string;
    perkTextAr?: string;
    tags?: string[];
    isPurchasable?: boolean;
    isEquippable?: boolean;
    isVisible?: boolean;
    releaseStatus?: 'published' | 'draft' | 'archived';
    layer?: number;
    zIndex?: number;
}

export interface ModularAvatarConfig {
    skinTone: string; // 'Tint 1' .. 'Tint 8'
    faceId: string;   // e.g. 'kenney_face_complete_1'
    hairId?: string;  // e.g. 'kenney_hair_brown2_man5'
    shirtId?: string; // e.g. 'kenney_shirt_red_1'
    pantsId?: string; // e.g. 'kenney_pants_light_blue_3'
    shoesId?: string; // e.g. 'kenney_shoe_brown1_5'
    accessoryId?: string; // e.g. 'avatar_acc_cool_shades_001'
    backgroundId?: string; // e.g. 'avatar_bg_office_clean_001'
    completeCharacterUrl?: string;
}

export const DEFAULT_AVATAR_CONFIG: ModularAvatarConfig = {
    skinTone: 'Tint 1',
    faceId: 'kenney_face_complete_1',
    hairId: 'kenney_hair_brown2_man5',
    shirtId: 'kenney_shirt_red_1',
    pantsId: 'kenney_pants_light_blue_3',
    shoesId: 'kenney_shoe_brown1_5',
    backgroundId: 'avatar_bg_office_clean_001',
};

export interface WardrobeFilter {
    category: AvatarCategory | 'all';
    rarity?: AvatarRarity | 'all';
    search?: string;
    onlyUnlocked: boolean;
    onlyOwned: boolean;
}
