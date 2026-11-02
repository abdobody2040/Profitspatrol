import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store';
import { useAvatarStore } from '../../src/features/avatar/store/avatarStore';
import { AVATAR_CATALOG } from '../../src/features/avatar/data/avatarCatalog';
import { User, UserRole } from '../../src/types';

describe('Avatar Wardrobe & Entrepreneurial Accessories System (PRD Section 56)', () => {
    beforeEach(() => {
        const mockUser: User = {
            id: 'test-kid-ceo-1',
            email: 'kid@profitspatrol.com',
            name: 'Young Tycoon',
            role: UserRole.KID,
            level: 1,
            xp: 100,
            ppTokens: 500,
            streak: 3,
            inventory: ['avatar_business_blazer_001'],
            equippedItems: ['avatar_business_blazer_001'],
            unlockedDistricts: ['1'],
            achievements: [],
            badges: [],
            lastActivityDate: '2026-03-30',
            currentModuleId: 'mod_01',
            completedLessonIds: [],
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                themeColor: 'green',
                ageMode: 'junior',
                dailyGoalMinutes: 15,
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
        };

        useAppStore.setState({
            user: mockUser,
            users: [mockUser],
        });

        useAvatarStore.setState({
            filter: {
                category: 'all',
                onlyUnlocked: false,
                onlyOwned: false,
            },
            selectedItem: null,
            notificationMsg: null,
        });
    });

    describe('1. Catalog Integrity & Categorization', () => {
        it('contains items for all required avatar categories', () => {
            expect(AVATAR_CATALOG.length).toBeGreaterThan(0);

            const categories = new Set(AVATAR_CATALOG.map(i => i.category));
            expect(categories.has('business')).toBe(true);
            expect(categories.has('accessories')).toBe(true);
            expect(categories.size).toBeGreaterThanOrEqual(2);
        });

        it('ensures each catalog item has valid entrepreneurial unlock conditions', () => {
            for (const item of AVATAR_CATALOG) {
                expect(item.id).toBeTruthy();
                expect(item.name).toBeTruthy();
                expect(item.nameAr).toBeTruthy();
                expect(item.cost).toBeGreaterThanOrEqual(0);
                expect(item.unlockRequirement).toBeDefined();
            }
        });
    });

    describe('2. Unlock Conditions Evaluation', () => {
        it('evaluates level unlock conditions correctly', () => {
            const { isItemUnlocked } = useAvatarStore.getState();
            const level2Blazer = AVATAR_CATALOG.find(i => i.id === 'avatar_business_blazer_001')!;

            // User is level 1, requirement is level 2
            expect(isItemUnlocked(level2Blazer)).toBe(false);

            // Level up user to level 2
            const currentUser = useAppStore.getState().user!;
            useAppStore.setState({ user: { ...currentUser, level: 2 } });
            expect(isItemUnlocked(level2Blazer)).toBe(true);
        });

        it('evaluates district unlock requirements correctly', () => {
            const { isItemUnlocked } = useAvatarStore.getState();
            const districtItem = AVATAR_CATALOG.find(i => i.unlockRequirement?.type === 'district');
            if (districtItem && districtItem.unlockRequirement) {
                const targetDistrict = String(districtItem.unlockRequirement.target);
                const currentUser = useAppStore.getState().user!;
                useAppStore.setState({ user: { ...currentUser, unlockedDistricts: [targetDistrict] } });
                expect(isItemUnlocked(districtItem)).toBe(true);
            }
        });
    });

    describe('3. Purchasing & Equipping Flow', () => {
        it('blocks purchase when user has insufficient P-Tokens', () => {
            const currentUser = useAppStore.getState().user!;
            useAppStore.setState({ user: { ...currentUser, ppTokens: 10 } });

            const tux = AVATAR_CATALOG.find(i => i.id === 'avatar_business_ceo_tux_002')!; // Cost: 350
            const { purchaseItem } = useAvatarStore.getState();

            const res = purchaseItem(tux);
            expect(res.success).toBe(false);

            const userAfter = useAppStore.getState().user!;
            expect(userAfter.inventory).not.toContain(tux.id);
            expect(userAfter.ppTokens).toBe(10);
        });

        it('successfully purchases and equips affordable, unlocked items', () => {
            const vest = AVATAR_CATALOG.find(i => i.id === 'avatar_business_venture_vest_003')!; // Cost: 200, Lvl 3
            const currentUser = useAppStore.getState().user!;
            useAppStore.setState({ user: { ...currentUser, level: 3, ppTokens: 500 } });

            const { purchaseItem, equipItem, isItemEquipped } = useAvatarStore.getState();

            const res = purchaseItem(vest);
            expect(res.success).toBe(true);

            const userAfter = useAppStore.getState().user!;
            expect(userAfter.inventory).toContain(vest.id);
            expect(userAfter.ppTokens).toBe(500 - 200);

            const equipRes = equipItem(vest);
            expect(equipRes.success).toBe(true);
            expect(isItemEquipped(vest)).toBe(true);
        });

        it('can unequip items', () => {
            const blazer = AVATAR_CATALOG.find(i => i.id === 'avatar_business_blazer_001')!;
            const { unequipItem, isItemEquipped } = useAvatarStore.getState();

            unequipItem(blazer.id);
            expect(isItemEquipped(blazer)).toBe(false);
        });
    });
});
