import { create } from 'zustand';
import { useAppStore } from '../../../store';
import { AvatarItem, AvatarCategory, AvatarRarity, WardrobeFilter, ModularAvatarConfig } from '../types/avatar';
import { AVATAR_CATALOG, DEFAULT_AVATAR_CONFIG, resolveAvatarConfigFromEquipped, getAvatarItemById } from '../data/avatarCatalog';
import { Logger } from '../../../services/logger';

interface AvatarStoreState {
    filter: WardrobeFilter;
    selectedItem: AvatarItem | null;
    notificationMsg: string | null;
    
    // Live Preview State (temporary studio configuration)
    previewConfig: ModularAvatarConfig;
    isCustomizing: boolean;

    // Filter Actions
    setCategoryFilter: (cat: AvatarCategory | 'all') => void;
    setRarityFilter: (rarity: AvatarRarity | 'all') => void;
    setSearchQuery: (query: string) => void;
    setOnlyUnlockedFilter: (val: boolean) => void;
    setOnlyOwnedFilter: (val: boolean) => void;
    selectItem: (item: AvatarItem | null) => void;
    setNotification: (msg: string | null) => void;
    
    // Preview Actions (Trying on clothes before buying)
    initPreview: () => void;
    previewItem: (item: AvatarItem) => void;
    resetPreview: () => void;
    saveLoadout: () => { success: boolean; message: string };
    hasUnsavedChanges: () => boolean;

    // Core Wardrobe Operations
    isItemUnlocked: (item: AvatarItem) => boolean;
    isItemOwned: (item: AvatarItem) => boolean;
    isItemEquipped: (item: AvatarItem) => boolean;
    isItemPreviewed: (item: AvatarItem) => boolean;
    purchaseItem: (item: AvatarItem) => { success: boolean; message: string };
    equipItem: (item: AvatarItem) => { success: boolean; message: string };
    unequipItem: (itemId: string) => void;
    resetToDefaultAvatar: () => void;
}

export const useAvatarStore = create<AvatarStoreState>((set, get) => ({
    filter: {
        category: 'all',
        rarity: 'all',
        search: '',
        onlyUnlocked: false,
        onlyOwned: false,
    },
    selectedItem: null,
    notificationMsg: null,
    previewConfig: { ...DEFAULT_AVATAR_CONFIG },
    isCustomizing: false,

    setCategoryFilter: (cat) => set((s) => ({ filter: { ...s.filter, category: cat } })),
    setRarityFilter: (rarity) => set((s) => ({ filter: { ...s.filter, rarity } })),
    setSearchQuery: (search) => set((s) => ({ filter: { ...s.filter, search } })),
    setOnlyUnlockedFilter: (val) => set((s) => ({ filter: { ...s.filter, onlyUnlocked: val } })),
    setOnlyOwnedFilter: (val) => set((s) => ({ filter: { ...s.filter, onlyOwned: val } })),
    selectItem: (item) => set({ selectedItem: item }),
    setNotification: (msg) => set({ notificationMsg: msg }),

    initPreview: () => {
        const { user } = useAppStore.getState();
        const equipped = user?.equippedItems ?? [];
        const currentConfig = resolveAvatarConfigFromEquipped(equipped);
        set({
            previewConfig: currentConfig,
            isCustomizing: true,
        });
    },

    previewItem: (item: AvatarItem) => {
        const current = { ...get().previewConfig };
        
        switch (item.category) {
            case 'skin':
                if (item.filePath?.includes('Tint%20')) {
                    const match = item.filePath.match(/Tint%20(\d)/);
                    if (match) current.skinTone = `Tint ${match[1]}`;
                }
                break;
            case 'face':
                current.faceId = item.id;
                break;
            case 'hair':
                current.hairId = item.id;
                break;
            case 'clothing':
                current.shirtId = item.id;
                break;
            case 'business':
                current.shirtId = item.id;
                // Auto-coordinate matching trousers if user has default pants
                if (!current.pantsId || current.pantsId === 'kenney_pants_light_blue_3') {
                    if (item.id === 'avatar_business_blazer_001') current.pantsId = 'kenney_pants_navy_1';
                    else if (item.id === 'avatar_business_ceo_tux_002') current.pantsId = 'kenney_pants_grey_1';
                    else if (item.id === 'avatar_business_venture_vest_003') current.pantsId = 'kenney_pants_pine_1';
                }
                break;
            case 'pants':
                current.pantsId = item.id;
                break;
            case 'shoes':
                current.shoesId = item.id;
                break;
            case 'accessories':
            case 'district':
            case 'achievement':
                current.accessoryId = current.accessoryId === item.id ? undefined : item.id;
                break;
            case 'background':
                current.backgroundId = item.id;
                break;
            default:
                break;
        }

        set({
            previewConfig: current,
            selectedItem: item,
        });
    },

    resetPreview: () => {
        const { user } = useAppStore.getState();
        const equipped = user?.equippedItems ?? [];
        set({
            previewConfig: resolveAvatarConfigFromEquipped(equipped),
        });
    },

    hasUnsavedChanges: () => {
        const { user } = useAppStore.getState();
        const equipped = user?.equippedItems ?? [];
        const saved = resolveAvatarConfigFromEquipped(equipped);
        const current = get().previewConfig;

        return (
            saved.skinTone !== current.skinTone ||
            saved.faceId !== current.faceId ||
            saved.hairId !== current.hairId ||
            saved.shirtId !== current.shirtId ||
            saved.pantsId !== current.pantsId ||
            saved.shoesId !== current.shoesId ||
            saved.accessoryId !== current.accessoryId ||
            saved.backgroundId !== current.backgroundId
        );
    },

    saveLoadout: () => {
        const { user, users } = useAppStore.getState();
        if (!user) return { success: false, message: 'Please log in first' };

        const preview = get().previewConfig;
        
        // Collect new equipped IDs from preview
        const newEquippedIds: string[] = [];
        
        // Skin
        const skinNum = preview.skinTone.replace(/\D/g, '') || '1';
        newEquippedIds.push(`kenney_skin_tint_${skinNum}`);
        
        // Face
        if (preview.faceId) newEquippedIds.push(preview.faceId);
        // Hair
        if (preview.hairId) newEquippedIds.push(preview.hairId);
        // Shirt / Outfit
        if (preview.shirtId) newEquippedIds.push(preview.shirtId);
        // Pants
        if (preview.pantsId) newEquippedIds.push(preview.pantsId);
        // Shoes
        if (preview.shoesId) newEquippedIds.push(preview.shoesId);
        // Accessory / District / Achievement
        if (preview.accessoryId) newEquippedIds.push(preview.accessoryId);
        // Background
        if (preview.backgroundId) newEquippedIds.push(preview.backgroundId);

        // Keep any other equipped items not conflicting
        const categoriesManaged = new Set(['skin', 'face', 'hair', 'clothing', 'pants', 'shoes', 'accessories', 'business', 'district', 'achievement', 'background']);
        const retainedItems = (user.equippedItems ?? []).filter(id => {
            const item = getAvatarItemById(id);
            return item && !categoriesManaged.has(item.category);
        });

        const updatedEquipped = Array.from(new Set([...newEquippedIds, ...retainedItems]));

        const updatedUser = {
            ...user,
            equippedItems: updatedEquipped,
        };

        useAppStore.setState({
            user: updatedUser,
            users: (users ?? []).map(u => u.id === updatedUser.id ? updatedUser : u),
        });

        Logger.info('Avatar loadout saved', { userId: user.id, equipped: updatedEquipped });
        return { success: true, message: 'Avatar look saved successfully!' };
    },

    isItemUnlocked: (item: AvatarItem) => {
        const { user } = useAppStore.getState();
        if (!user) return false;
        if (!item.unlockRequirement || item.unlockRequirement.type === 'free') return true;

        const req = item.unlockRequirement;
        if (req.type === 'level') {
            const targetLevel = typeof req.target === 'number' ? req.target : parseInt(String(req.target), 10);
            return (user.level ?? 1) >= targetLevel;
        }

        if (req.type === 'district') {
            const targetDistrict = typeof req.target === 'number' ? req.target : parseInt(String(req.target), 10);
            const unlocked = (user.unlockedDistricts ?? [1]) as (string | number)[];
            return unlocked.some(d => String(d) === String(targetDistrict));
        }

        if (req.type === 'achievement') {
            const targetAchieve = String(req.target);
            const userAchieves = ((user.achievements ?? []) as any[]).map(a => typeof a === 'string' ? a : a?.id);
            return userAchieves.includes(targetAchieve) || (user.inventory ?? []).includes(item.id);
        }

        return true;
    },

    isItemOwned: (item: AvatarItem) => {
        const { user } = useAppStore.getState();
        if (!user) return false;
        if (item.cost === 0 && (!item.unlockRequirement || item.unlockRequirement.type === 'free')) {
            return true;
        }
        return (user.inventory ?? []).includes(item.id);
    },

    isItemEquipped: (item: AvatarItem) => {
        const { user } = useAppStore.getState();
        if (!user) return false;
        const equipped = user.equippedItems ?? [];
        if (equipped.includes(item.id)) return true;

        // Default starter items
        if (item.cost === 0 && (!item.unlockRequirement || item.unlockRequirement.type === 'free')) {
            const hasEquippedInCat = AVATAR_CATALOG
                .filter(i => i.category === item.category)
                .some(i => equipped.includes(i.id));
            if (!hasEquippedInCat && (item.id.includes('tint_1') || item.id.includes('red_1') || item.id.includes('man5') || item.id.includes('pants_light_blue_3') || item.id.includes('brown1_5') || item.id.includes('face_complete_1'))) {
                return true;
            }
        }
        return false;
    },

    isItemPreviewed: (item: AvatarItem) => {
        const preview = get().previewConfig;
        switch (item.category) {
            case 'skin':
                return preview.skinTone.endsWith(item.id.replace(/\D/g, ''));
            case 'face':
                return preview.faceId === item.id;
            case 'hair':
                return preview.hairId === item.id;
            case 'clothing':
            case 'business':
                return preview.shirtId === item.id;
            case 'pants':
                return preview.pantsId === item.id;
            case 'shoes':
                return preview.shoesId === item.id;
            case 'accessories':
            case 'district':
            case 'achievement':
                return preview.accessoryId === item.id;
            case 'background':
                return preview.backgroundId === item.id;
            default:
                return false;
        }
    },

    purchaseItem: (item: AvatarItem) => {
        const { user, users } = useAppStore.getState();
        if (!user) {
            return { success: false, message: 'Please log in to purchase avatar gear.' };
        }

        if (!get().isItemUnlocked(item)) {
            return { success: false, message: 'This item is locked! Complete the prerequisite first.' };
        }

        if (get().isItemOwned(item)) {
            return { success: false, message: 'You already own this item!' };
        }

        if (user.ppTokens < item.cost) {
            return { success: false, message: 'Not enough P-Tokens! Earn more through missions and games.' };
        }

        const updatedInventory = [...(user.inventory ?? []), item.id];
        
        // Remove prior equipped item in the same slot (clothing and business both occupy torso)
        const isTorso = item.category === 'business' || item.category === 'clothing';
        const isAcc = item.category === 'accessories' || item.category === 'district' || item.category === 'achievement';
        const catalogItemsInCat = AVATAR_CATALOG
            .filter(c => isTorso ? (c.category === 'business' || c.category === 'clothing') : isAcc ? (c.category === 'accessories' || c.category === 'district' || c.category === 'achievement') : c.category === item.category)
            .map(c => c.id);
        const filteredEquipped = (user.equippedItems ?? []).filter(id => !catalogItemsInCat.includes(id));
        const updatedEquipped = [...filteredEquipped, item.id];

        const updatedUser = {
            ...user,
            ppTokens: user.ppTokens - item.cost,
            inventory: updatedInventory,
            equippedItems: updatedEquipped,
        };

        useAppStore.setState({
            user: updatedUser,
            users: (users ?? []).map(u => u.id === updatedUser.id ? updatedUser : u),
        });

        // Also update preview
        get().previewItem(item);

        Logger.info('Avatar item purchased & equipped', { itemId: item.id, cost: item.cost, userId: user.id });
        return { success: true, message: `Acquired and equipped ${item.name}!` };
    },

    equipItem: (item: AvatarItem) => {
        const { user, users } = useAppStore.getState();
        if (!user) {
            return { success: false, message: 'Please log in first.' };
        }

        if (!get().isItemOwned(item)) {
            return { success: false, message: 'You do not own this item yet.' };
        }

        const isTorso = item.category === 'business' || item.category === 'clothing';
        const isAcc = item.category === 'accessories' || item.category === 'district' || item.category === 'achievement';
        const catalogItemsInCat = AVATAR_CATALOG
            .filter(c => isTorso ? (c.category === 'business' || c.category === 'clothing') : isAcc ? (c.category === 'accessories' || c.category === 'district' || c.category === 'achievement') : c.category === item.category)
            .map(c => c.id);
        const filteredEquipped = (user.equippedItems ?? []).filter(id => !catalogItemsInCat.includes(id));
        const updatedEquipped = [...filteredEquipped, item.id];

        const updatedUser = {
            ...user,
            equippedItems: updatedEquipped,
        };

        useAppStore.setState({
            user: updatedUser,
            users: (users ?? []).map(u => u.id === updatedUser.id ? updatedUser : u),
        });

        // Also update preview
        get().previewItem(item);

        Logger.info('Avatar item equipped', { itemId: item.id, userId: user.id });
        return { success: true, message: `Equipped ${item.name}!` };
    },

    unequipItem: (itemId: string) => {
        const { user, users } = useAppStore.getState();
        if (!user) return;

        const updatedUser = {
            ...user,
            equippedItems: (user.equippedItems ?? []).filter(id => id !== itemId),
        };

        useAppStore.setState({
            user: updatedUser,
            users: (users ?? []).map(u => u.id === updatedUser.id ? updatedUser : u),
        });

        // Re-init preview
        get().initPreview();
    },

    resetToDefaultAvatar: () => {
        const { user, users } = useAppStore.getState();
        if (!user) return;

        const defaultIds = [
            'kenney_skin_tint_1',
            'kenney_face_complete_1',
            'kenney_hair_brown2_man5',
            'kenney_shirt_red_1',
            'kenney_pants_light_blue_3',
            'kenney_shoe_brown1_5',
            'avatar_bg_office_clean_001',
        ];

        const updatedUser = {
            ...user,
            equippedItems: defaultIds,
        };

        useAppStore.setState({
            user: updatedUser,
            users: (users ?? []).map(u => u.id === updatedUser.id ? updatedUser : u),
        });

        set({
            previewConfig: { ...DEFAULT_AVATAR_CONFIG },
        });
    },
}));
