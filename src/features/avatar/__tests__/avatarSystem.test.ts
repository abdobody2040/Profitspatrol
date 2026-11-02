import { describe, it, expect, beforeEach } from 'vitest';
import {
    AVATAR_CATALOG,
    DEFAULT_AVATAR_CONFIG,
    DEFAULT_EQUIPPED_ITEM_IDS,
    getAvatarItemById,
    resolveAvatarConfigFromEquipped,
} from '../data/avatarCatalog';
import { useAvatarStore } from '../store/avatarStore';
import { useAppStore } from '../../../store';
import { UserRole } from '../../../types';

describe('Avatar Customization System', () => {
    describe('Catalog Integrity', () => {
        it('contains items in all required categories', () => {
            const categories = new Set(AVATAR_CATALOG.map((item) => item.category));
            expect(categories.has('skin')).toBe(true);
            expect(categories.has('face')).toBe(true);
            expect(categories.has('hair')).toBe(true);
            expect(categories.has('clothing')).toBe(true);
            expect(categories.has('pants')).toBe(true);
            expect(categories.has('shoes')).toBe(true);
            expect(categories.has('accessories')).toBe(true);
            expect(categories.has('background')).toBe(true);
        });

        it('has unique stable IDs for every asset in catalog', () => {
            const ids = AVATAR_CATALOG.map((item) => item.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('provides free starter items with 0 PP Tokens cost', () => {
            const starterSkin = getAvatarItemById('kenney_skin_tint_1');
            expect(starterSkin).toBeDefined();
            expect(starterSkin?.cost).toBe(0);

            const starterShirt = getAvatarItemById('kenney_shirt_red_1');
            expect(starterShirt).toBeDefined();
            expect(starterShirt?.cost).toBe(0);

            const starterPants = getAvatarItemById('kenney_pants_light_blue_3');
            expect(starterPants).toBeDefined();
            expect(starterPants?.cost).toBe(0);

            const starterShoes = getAvatarItemById('kenney_shoe_brown1_5');
            expect(starterShoes).toBeDefined();
            expect(starterShoes?.cost).toBe(0);
        });

        it('correctly maps items by ID', () => {
            const item = getAvatarItemById('kenney_hair_brown2_man5');
            expect(item).toBeDefined();
            expect(item?.name).toBe('Junior Executive Crop');
            expect(item?.category).toBe('hair');
        });
    });

    describe('resolveAvatarConfigFromEquipped', () => {
        it('returns default avatar config when no items are equipped', () => {
            const config = resolveAvatarConfigFromEquipped([]);
            expect(config.skinTone).toBe('Tint 1');
            expect(config.shirtId).toBe('kenney_shirt_red_1');
            expect(config.pantsId).toBe('kenney_pants_light_blue_3');
        });

        it('correctly resolves custom equipped items', () => {
            const customEquipped = [
                'kenney_skin_tint_5',
                'kenney_hair_black_man1',
                'kenney_shirt_navy_1',
                'kenney_pants_navy_1',
                'kenney_shoe_black_1',
            ];
            const config = resolveAvatarConfigFromEquipped(customEquipped);
            expect(config.skinTone).toBe('Tint 5');
            expect(config.hairId).toBe('kenney_hair_black_man1');
            expect(config.shirtId).toBe('kenney_shirt_navy_1');
            expect(config.pantsId).toBe('kenney_pants_navy_1');
            expect(config.shoesId).toBe('kenney_shoe_black_1');
        });
    });

    describe('Avatar Store Operations', () => {
        beforeEach(() => {
            useAppStore.setState({
                user: {
                    id: 'test_founder_1',
                    name: 'Test Founder',
                    email: 'founder@profitspatrol.com',
                    role: UserRole.KID,
                    level: 5,
                    xp: 1200,
                    ppTokens: 500,
                    streak: 3,
                    inventory: ['kenney_skin_tint_1', 'kenney_shirt_red_1'],
                    equippedItems: [...DEFAULT_EQUIPPED_ITEM_IDS],
                    unlockedDistricts: ['1', '2', '3'],
                    achievements: ['first_sale'],
                    lastActivityDate: '2026-10-12',
                    currentModuleId: 'module_1',
                    completedLessonIds: [],
                    badges: [],
                    settings: {
                        dailyGoalMinutes: 30,
                        soundEnabled: false,
                        musicEnabled: false,
                        themeColor: 'indigo',
                        themeMode: 'light',
                    },
                    hqLevel: '1',
                    unlockedSkills: [],
                    portfolio: [],
                    placedItems: [],
                    properties: [],
                    subscriptionStatus: 'FREE',
                    subscriptionTier: 'intern',
                    energy: 5,
                    lastEnergyRefill: Date.now(),
                },
            });
            useAvatarStore.getState().initPreview();
        });

        it('previews items without altering equipped state immediately', () => {
            const store = useAvatarStore.getState();
            const navyShirt = getAvatarItemById('kenney_shirt_navy_1')!;

            expect(store.isItemEquipped(navyShirt)).toBe(false);

            // Preview item
            store.previewItem(navyShirt);
            expect(useAvatarStore.getState().previewConfig.shirtId).toBe('kenney_shirt_navy_1');

            // Unsaved changes flag is active
            expect(useAvatarStore.getState().hasUnsavedChanges()).toBe(true);

            // User equippedItems in app store should NOT have changed yet
            expect(useAppStore.getState().user?.equippedItems.includes('kenney_shirt_navy_1')).toBe(false);

            // Resetting preview restores original look
            useAvatarStore.getState().resetPreview();
            expect(useAvatarStore.getState().previewConfig.shirtId).toBe('kenney_shirt_red_1');
            expect(useAvatarStore.getState().hasUnsavedChanges()).toBe(false);
        });

        it('saves loadout when confirmed', () => {
            const store = useAvatarStore.getState();
            const navyShirt = getAvatarItemById('kenney_shirt_navy_1')!;

            store.previewItem(navyShirt);
            const res = store.saveLoadout();

            expect(res.success).toBe(true);
            expect(useAppStore.getState().user?.equippedItems).toContain('kenney_shirt_navy_1');
        });

        it('handles purchasing with PP Tokens deduction', () => {
            const store = useAvatarStore.getState();
            const pitchBlazer = getAvatarItemById('kenney_shirt_blue_4')!; // cost 130, level 3

            const initialTokens = useAppStore.getState().user?.ppTokens || 0;
            const res = store.purchaseItem(pitchBlazer);

            expect(res.success).toBe(true);
            const updatedUser = useAppStore.getState().user!;
            expect(updatedUser.ppTokens).toBe(initialTokens - pitchBlazer.cost);
            expect(updatedUser.inventory).toContain('kenney_shirt_blue_4');
            expect(updatedUser.equippedItems).toContain('kenney_shirt_blue_4');
        });

        it('prevents purchase when player does not have enough PP Tokens', () => {
            // Set user tokens low
            useAppStore.setState({
                user: {
                    ...useAppStore.getState().user!,
                    ppTokens: 10,
                },
            });

            const store = useAvatarStore.getState();
            const luxuryCrown = getAvatarItemById('avatar_achieve_tycoon_crown_003')!; // cost 1000

            const res = store.purchaseItem(luxuryCrown);
            expect(res.success).toBe(false);
            expect(useAppStore.getState().user?.ppTokens).toBe(10);
        });
    });
});
