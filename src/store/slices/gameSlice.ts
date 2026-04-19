
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { BusinessSimulation, LemonadeState, PortfolioItem, SubscriptionTier, FurnitureItem, PlacedItem } from '../../types';
import { GAMES_DB } from '../../features/game/data/games';
import { HQ_LEVELS, SKILLS_DB } from '../../data/constants';
import { getLevel, getToday, getYesterday } from '../../utils/gameUtils';
import { SoundService } from '../../lib/sound';
import { Logger } from '../../services/logger';


const INITIAL_LEMONADE_STATE: LemonadeState = {
    day: 1,
    funds: 20.00,
    inventory: { lemons: 0, sugar: 0, cups: 0 },
    recipe: { lemonsPerCup: 1, sugarPerCup: 1, pricePerCup: 1.00 },
    history: []
};

export interface GameSlice {
    games: BusinessSimulation[];

    completeGame: (score: number, xpReward: number) => void;
    closeLevelUpModal: () => void;
    closeGraduationModal: () => void;

    // content CRUD
    addGame: (game: BusinessSimulation) => void;
    updateGame: (id: string, updates: Partial<BusinessSimulation>) => void;
    deleteGame: (id: string) => void;
    syncGames: () => void;

    // --- MOVED FROM USER SLICE ---
    checkStreak: () => void;
    buyItem: (item: any) => void;
    toggleEquipItem: (itemId: string) => void;
    upgradeHQ: (hqId: string) => void;
    unlockSkill: (skillId: string) => void;
    hireManager: (businessId: string) => void;
    collectIdleIncome: (businessId: string) => number;
    collectAllIdleIncome: () => void;
    getSkillModifiers: () => { xpMultiplier: number, costMultiplier: number, priceMultiplier: number };
    upgradeSubscription: (tier: SubscriptionTier) => void;

    // Energy
    hasUnlimitedEnergy: () => boolean;
    hasAiAccess: () => boolean;
    consumeEnergy: () => boolean;
    completeDebate: (score: number) => void; // Gives XP/Coins

    // HQ Builder
    buyFurniture: (item: FurnitureItem) => void;
    placeFurniture: (item: FurnitureItem, x: number, y: number, roomType?: string) => void;
    moveFurniture: (id: string, x: number, y: number) => void;
    rotateFurniture: (id: string) => void;
    sellFurniture: (instanceId: string, cost: number) => void;
    removeFurnitureFromRoom: (instanceId: string) => void;
    moveFurnitureToRoom: (instanceId: string, newRoomType: string) => void;


    readBook: (bookId: string) => void; // Gives XP/Coins

    // Book Tasks
    completeBookTask: (taskId: string, bookId: string, data?: {
        score?: number;
        response?: string;
        checkpointProgress?: Record<string, boolean>;
    }) => void;
    getBookTaskProgress: (bookId: string) => {
        completed: number;
        total: number;
        percentage: number;
    };

    // Year 2: Daily Spin Wheel
    claimDailySpin: (prize: { type: string; value: number; id: string }) => void;

    // Year 2: Weekly CEO Challenge
    claimWeeklyChallenge: (
        challenge: { id: string; reward: { type: 'coins' | 'xp'; value: number } },
        weekKey: string
    ) => void;

    // Year 2: BizPulse News Feed
    claimBizPulseRead: (articleId: string, xpReward: number, today: string) => void;

    // Year 2: Stock Market
    buyStock: (stockId: string, shares: number, pricePerShare: number) => void;
    sellStock: (stockId: string, shares: number, pricePerShare: number) => void;

    // Year 2: Avatar Customizer
    buyAvatarItem: (itemId: string, cost: number) => void;
    equipAvatarItem: (itemId: string, category: string) => void;

    // Year 2: Seasonal Events
    claimSeasonalChallenge: (challengeId: string, reward: { type: 'coins' | 'xp'; value: number }) => void;
}

export const createGameSlice: StateCreator<AppState, [], [], GameSlice> = (set, get) => ({
    games: GAMES_DB,

    completeGame: (score, xpReward) => {
        const state = get();
        if (!state.user) return;

        const modifiers = state.getSkillModifiers();
        const newXp = state.user.xp + Math.round(xpReward * modifiers.xpMultiplier);
        const oldLevel = state.user.level;
        const newLevel = getLevel(newXp);
        const leveledUp = newLevel > oldLevel;
        const coinReward = Math.floor(xpReward / 5);

        let newInventory = [...state.user.inventory];
        let newBadges = [...state.user.badges];
        let hasGraduated = state.user.hasGraduated || false;

        // Level 10 Graduation Logic
        if (newLevel >= 10 && !hasGraduated && state.user.role === 'KID') {
            hasGraduated = true;
            if (!newInventory.includes('alumni_desk_trophy')) newInventory.push('alumni_desk_trophy');
            if (!newBadges.includes('Alumni Gold')) newBadges.push('Alumni Gold');
            Logger.info("User Graduated!", { userId: state.user.id });
        }

        if (leveledUp && state.user.settings.soundEnabled) SoundService.playLevelUp();
        else if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = {
            ...state.user,
            xp: newXp,
            level: newLevel,
            bizCoins: state.user.bizCoins + coinReward,
            inventory: newInventory,
            badges: newBadges,
            hasGraduated
        };

        set({
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
            showLevelUpModal: leveledUp,
            showGraduationModal: newLevel >= 10 && state.user.level < 10, // Trigger modal specifically on the boundary
            levelUpData: leveledUp ? { level: newLevel, xp: newXp } : null
        });
    },

    closeLevelUpModal: () => set({ showLevelUpModal: false, levelUpData: null }),
    closeGraduationModal: () => set({ showGraduationModal: false }),

    addGame: (game) => set((state) => ({ games: [...state.games, game] })),

    updateGame: (id, updates) => set((state) => ({
        games: state.games.map(g => g.business_id === id ? { ...g, ...updates } : g)
    })),

    deleteGame: (id) => set((state) => ({
        games: state.games.filter(g => g.business_id !== id)
    })),

    syncGames: () => set({ games: GAMES_DB }),

    // --- MOVED LOGIC ---

    checkStreak: () => set((state) => {
        if (!state.user) return {};
        const today = getToday();
        const yesterday = getYesterday();

        if (state.user.lastActivityDate === today) return {};

        let newStreak = state.user.streak;
        let newInventory = [...state.user.inventory];
        let bonusXp = 0;
        let bonusCoins = 0;
        let streakShieldUsed = false;

        if (state.user.lastActivityDate === yesterday) {
            // ✅ Consecutive day — extend streak
            newStreak += 1;
        } else {
            // ❌ Missed a day — check defences in order: item_freeze first, then streakShield
            const freezeIndex = newInventory.indexOf('item_freeze');
            if (freezeIndex !== -1) {
                Logger.info("Streak Freeze Activated", { userId: state.user.id });
                newInventory.splice(freezeIndex, 1);
            } else if (state.user.streakShield && state.user.streakShieldUsedDate !== today) {
                // 🛡️ Use the premium streak shield
                Logger.info("Streak Shield Activated", { userId: state.user.id });
                streakShieldUsed = true;
            } else {
                newStreak = 1;
            }
        }

        // 🔥 7-Day Streak Bonus: award at every 7-streak milestone, once per bonus date
        const bonusAlreadyGivenToday = state.user.streakLastBonusDate === today;
        if (!bonusAlreadyGivenToday && newStreak > 0 && newStreak % 7 === 0) {
            bonusXp = 300;
            bonusCoins = 200;
            Logger.info(`7-day streak bonus! Streak: ${newStreak}`, { userId: state.user.id });
        }

        const updatedUser = {
            ...state.user,
            lastActivityDate: today,
            streak: newStreak,
            inventory: newInventory,
            xp: state.user.xp + bonusXp,
            bizCoins: state.user.bizCoins + bonusCoins,
            ...(bonusXp > 0 ? { streakLastBonusDate: today } : {}),
            ...(streakShieldUsed ? { streakShieldUsedDate: today } : {}),
        };

        const updatedUsers = state.users.map(u => u.id === state.user!.id ? updatedUser : u);
        return { user: updatedUser, users: updatedUsers };
    }),

    buyItem: (item) => set((state) => {
        if (!state.user) return {};
        if (state.user.bizCoins < item.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }

        const isUnique = item.type === 'AVATAR';
        if (isUnique && state.user.inventory.includes(item.id)) return {};

        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins - item.cost,
            inventory: [...state.user.inventory, item.id]
        };

        return {
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
    }),

    toggleEquipItem: (itemId: string) => set((state) => {
        if (!state.user) return {};
        if (state.user.settings.soundEnabled) SoundService.playClick();

        const isEquipped = state.user.equippedItems.includes(itemId);
        let newEquipped = [...state.user.equippedItems];

        const getSlot = (id: string) => {
            if (id.includes('hat') || id.includes('crown') || id.includes('helmet') || id.includes('cap') || id.includes('beret') || id.includes('tiara')) return 'head';
            if (id.includes('sunglasses') || id.includes('monocle')) return 'eyes';
            if (id.includes('suit') || id.includes('cape') || id.includes('gear')) return 'body';
            return 'misc';
        };

        if (isEquipped) {
            newEquipped = newEquipped.filter(id => id !== itemId);
        } else {
            const targetSlot = getSlot(itemId);
            newEquipped = newEquipped.filter(id => getSlot(id) !== targetSlot);
            newEquipped.push(itemId);
        }

        const updatedUser = { ...state.user, equippedItems: newEquipped };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    upgradeHQ: (hqId) => set((state) => {
        if (!state.user) return {};
        const hq = HQ_LEVELS.find(h => h.id === hqId);
        if (!hq) return {};
        if (state.user.bizCoins < hq.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }
        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = { ...state.user, bizCoins: state.user.bizCoins - hq.cost, hqLevel: hqId };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    unlockSkill: (skillId) => set((state) => {
        if (!state.user) return {};
        const skill = SKILLS_DB.find(s => s.id === skillId);
        if (!skill) return {};
        if (state.user.bizCoins < skill.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }
        if (state.user.unlockedSkills.includes(skillId)) return {};
        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins - skill.cost,
            unlockedSkills: [...state.user.unlockedSkills, skillId]
        };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    hireManager: (businessId) => set((state) => {
        if (!state.user) return {};
        const hireCost = 500;
        if (state.user.bizCoins < hireCost) return {};
        if (state.user.portfolio.some(p => p.businessId === businessId)) return {};
        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const newItem: PortfolioItem = { businessId, managerLevel: 1, lastCollected: new Date().toISOString() };
        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins - hireCost,
            portfolio: [...state.user.portfolio, newItem]
        };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    collectIdleIncome: (businessId) => {
        const state = get();
        if (!state.user) return 0;

        const itemIndex = state.user.portfolio.findIndex(p => p.businessId === businessId);
        if (itemIndex === -1) return 0;

        const item = state.user.portfolio[itemIndex];
        const now = new Date();
        const last = new Date(item.lastCollected);

        let diffMs = now.getTime() - last.getTime();

        if (diffMs < 0) {
            Logger.warn('Clock Skew Detected: User moved time backwards', { userId: state.user?.id, businessId });
            const fixedItem = { ...item, lastCollected: now.toISOString() };
            const fixedPortfolio = [...state.user.portfolio];
            fixedPortfolio[itemIndex] = fixedItem;
            const fixedUser = { ...state.user, portfolio: fixedPortfolio };
            set({ user: fixedUser, users: state.users.map(u => u.id === fixedUser.id ? fixedUser : u) });
            return 0;
        }

        // ✅ SECURITY FIX (CRIT-05): Validate forward clock-skew against server time.
        // If the client claims >25h have elapsed, check with get_server_time() RPC.
        // On mismatch >1h, use server time. On network error, cap at 6h.
        const FORWARD_SKEW_THRESHOLD_MS = 25 * 60 * 60 * 1000;
        if (diffMs > FORWARD_SKEW_THRESHOLD_MS) {
            import('../../lib/supabase').then(async ({ supabase, isSupabaseConfigured }) => {
                if (!isSupabaseConfigured() || !supabase) return;
                try {
                    const { data: serverMs } = await supabase.rpc('get_server_time');
                    if (typeof serverMs === 'number') {
                        const serverDiff = serverMs - last.getTime();
                        const discrepancyMs = diffMs - serverDiff;
                        if (discrepancyMs > 60 * 60 * 1000) { // >1h discrepancy
                            Logger.warn('Forward clock skew detected', {
                                userId: state.user?.id, businessId,
                                clientDiffH: +(diffMs / 3_600_000).toFixed(2),
                                serverDiffH: +(serverDiff / 3_600_000).toFixed(2),
                            });
                            void Logger.logSecurityEvent('suspicious_activity', 'high', {
                                action: 'clock_skew_forward', businessId, discrepancyMs,
                            });
                        }
                    }
                } catch { /* Server unreachable — cap already applied below. */ }
            });
            // Conservative cap: trust at most 6h without server confirmation
            diffMs = Math.min(diffMs, 6 * 60 * 60 * 1000);
        }

        const diffHours = diffMs / (1000 * 60 * 60);
        const rate = 50 * item.managerLevel;
        const income = Math.floor(Math.min(rate * diffHours, rate * 24));

        if (income >= 1) {
            if (state.user.settings.soundEnabled) SoundService.playCoin();

            const updatedItem = { ...item, lastCollected: now.toISOString() };
            const updatedPortfolio = [...state.user.portfolio];
            updatedPortfolio[itemIndex] = updatedItem;

            const updatedUser = {
                ...state.user,
                bizCoins: state.user.bizCoins + income,
                portfolio: updatedPortfolio
            };

            set({ user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) });
            return income;
        }
        return 0;
    },

    collectAllIdleIncome: () => {
        const state = get();
        if (!state.user || state.user.portfolio.length === 0) return;

        const now = new Date();
        const nowIso = now.toISOString();
        let totalIncome = 0;
        // ✅ PERFORMANCE FIX: Compute all income deltas in one pass, then commit
        // a single set() instead of one set() per business (N re-renders → 1).
        const updatedPortfolio = state.user.portfolio.map(item => {
            const last = new Date(item.lastCollected);
            let diffMs = now.getTime() - last.getTime();
            if (diffMs <= 0) return item; // backward skew or already collected

            // Apply conservative cap: trust at most 6h without server confirmation
            // (same policy as collectIdleIncome)
            const CAP_MS = 6 * 60 * 60 * 1000;
            const THRESHOLD_MS = 25 * 60 * 60 * 1000;
            if (diffMs > THRESHOLD_MS) diffMs = Math.min(diffMs, CAP_MS);

            const diffHours = diffMs / (1000 * 60 * 60);
            const rate = 50 * item.managerLevel;
            const income = Math.floor(Math.min(rate * diffHours, rate * 24));

            if (income >= 1) {
                totalIncome += income;
                return { ...item, lastCollected: nowIso };
            }
            return item;
        });

        if (totalIncome === 0) return; // Nothing collected — skip the set()

        if (state.user.settings.soundEnabled) SoundService.playCoin();
        Logger.info('collectAllIdleIncome: batch complete', { totalIncome, userId: state.user.id });

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins + totalIncome,
            portfolio: updatedPortfolio,
        };
        // ✅ Single set() — one React re-render regardless of portfolio size
        set({ user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) });
    },

    getSkillModifiers: () => {
        const state = get();
        let xpMultiplier = 1;
        let costMultiplier = 1;
        let priceMultiplier = 1;

        if (!state.user) return { xpMultiplier, costMultiplier, priceMultiplier };

        state.user.unlockedSkills.forEach(skillId => {
            const skill = SKILLS_DB.find(s => s.id === skillId);
            if (skill && skill.effect) {
                if (skill.effect.type === 'PASSIVE_XP') xpMultiplier += skill.effect.value;
                if (skill.effect.type === 'PASSIVE_COST') costMultiplier -= skill.effect.value;
                if (skill.effect.type === 'PASSIVE_PRICE') priceMultiplier += skill.effect.value;
            }
        });

        return { xpMultiplier, costMultiplier, priceMultiplier };
    },

    upgradeSubscription: (tier) => set((state) => {
        if (!state.user) return {};
        const newStatus = tier === 'intern' ? 'FREE' : 'PREMIUM';
        const newBillingCycle: 'YEARLY' | undefined = tier === 'intern' ? undefined : 'YEARLY';
        const updatedUser = { 
            ...state.user, 
            subscriptionTier: tier, 
            subscriptionStatus: newStatus as 'FREE' | 'PREMIUM', 
            billingCycle: newBillingCycle 
        };

        // ✅ SECURITY FIX (CRIT-02): Removed direct Supabase profile update.
        // Previously this action wrote subscription_tier directly to the DB, meaning
        // ANY user could call upgradeSubscription('tycoon') from the browser console
        // and get a free subscription upgrade persisted to Supabase.
        //
        // The Supabase profile write has been REMOVED. subscription_tier in the DB
        // is now ONLY updated by the verified Stripe webhook Edge Function
        // (stripe-webhook), which validates the stripe-signature header before
        // making any changes. This local state update is kept only to provide
        // immediate UI feedback after a legitimate Stripe checkout redirect.
        //
        // See: supabase/functions/stripe-webhook/index.ts

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),


    hasUnlimitedEnergy: () => {
        const user = get().user;
        if (!user) return false;
        return ['founder', 'board', 'tycoon', 'teacher_solo', 'school_license'].includes(user.subscriptionTier) || user.role === 'ADMIN';
    },

    hasAiAccess: () => {
        const user = get().user;
        if (!user) return false;
        return user.subscriptionTier === 'tycoon' || user.role === 'ADMIN';
    },

    consumeEnergy: () => {
        const state = get();
        if (state.hasUnlimitedEnergy()) return true;
        if (!state.user) return false;

        if (state.user.energy > 0) {
            const updatedUser = { ...state.user, energy: state.user.energy - 1 };
            set({ user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) });
            return true;
        }
        return false;
    },

    buyFurniture: (item: FurnitureItem) => set((state) => {
        if (!state.user) return {};
        if (state.user.bizCoins < item.cost) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }
        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins - item.cost,
            inventory: [...state.user.inventory, item.id]
        };

        return {
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
    }),


    placeFurniture: (item: FurnitureItem, x: number, y: number, roomType?: string) => set((state) => {
        if (!state.user) return {};

        const inventoryIndex = state.user.inventory.indexOf(item.id);
        if (inventoryIndex === -1) {
            if (state.user.settings.soundEnabled) SoundService.playError();
            return {};
        }

        if (state.user.settings.soundEnabled) SoundService.playClick();

        const newPlacedItem: PlacedItem = {
            id: self.crypto.randomUUID(),
            itemId: item.id,
            x,
            y,
            rotation: 0,
            roomType
        };

        const newInventory = [...state.user.inventory];
        newInventory.splice(inventoryIndex, 1);

        const updatedUser = {
            ...state.user,
            inventory: newInventory,
            placedItems: [...(state.user.placedItems || []), newPlacedItem]
        };

        return {
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
    }),

    moveFurniture: (id: string, x: number, y: number) => set((state) => {
        if (!state.user) return {};
        const updatedPlaced = state.user.placedItems?.map(p =>
            p.id === id ? { ...p, x, y } : p
        ) || [];

        const updatedUser = { ...state.user, placedItems: updatedPlaced };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    rotateFurniture: (id: string) => set((state) => {
        if (!state.user) return {};
        if (state.user.settings.soundEnabled) SoundService.playClick();

        const updatedPlaced = state.user.placedItems?.map(p => {
            if (p.id === id) {
                const newRot = (p.rotation + 90) % 360;
                return { ...p, rotation: newRot as 0 | 90 | 180 | 270 };
            }
            return p;
        }) || [];

        const updatedUser = { ...state.user, placedItems: updatedPlaced };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    sellFurniture: (instanceId: string, cost: number) => set((state) => {
        if (!state.user) return {};
        if (state.user.settings.soundEnabled) SoundService.playCoin();

        const refund = Math.floor(cost * 0.5);
        const updatedPlaced = state.user.placedItems?.filter(p => p.id !== instanceId) || [];

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins + refund,
            placedItems: updatedPlaced
        };

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    removeFurnitureFromRoom: (instanceId: string) => set((state) => {
        if (!state.user) return {};
        if (state.user.settings.soundEnabled) SoundService.playClick();

        // Find the placed item
        const placedItem = state.user.placedItems?.find(p => p.id === instanceId);
        if (!placedItem) return {};

        // Remove from placed items
        const updatedPlaced = state.user.placedItems?.filter(p => p.id !== instanceId) || [];

        // Add back to inventory
        const updatedInventory = [...state.user.inventory, placedItem.itemId];

        const updatedUser = {
            ...state.user,
            inventory: updatedInventory,
            placedItems: updatedPlaced
        };

        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    moveFurnitureToRoom: (instanceId: string, newRoomType: string) => set((state) => {
        if (!state.user) return {};
        if (state.user.settings.soundEnabled) SoundService.playClick();

        // Update the room type of the placed item
        const updatedPlaced = state.user.placedItems?.map(p =>
            p.id === instanceId ? { ...p, roomType: newRoomType } : p
        ) || [];

        const updatedUser = { ...state.user, placedItems: updatedPlaced };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    readBook: (bookId) => set((state) => {
        if (!state.user) return {};
        if (state.user.readBookIds?.includes(bookId)) return {};

        if (state.user.settings.soundEnabled) SoundService.playSuccess();
        const updatedUser = {
            ...state.user,
            readBookIds: [...(state.user.readBookIds || []), bookId],
            bizCoins: state.user.bizCoins + 10,
            xp: state.user.xp + 20
        };
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    completeDebate: (score: number) => set((state) => {
        if (!state.user) return {};
        if (score < 70) return {};
        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins + 100,
            xp: state.user.xp + 50
        };

        return {
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
    }),

    completeBookTask: (taskId, bookId, data) => set((state) => {
        if (!state.user) return {};

        // Check if already completed
        const alreadyCompleted = state.user.completedBookTasks?.some(c => c.taskId === taskId);
        if (alreadyCompleted) return {};

        // Find the task from library
        const book = state.library.find(b => b.id === bookId);
        const task = book?.tasks?.find(t => t.id === taskId);
        if (!task) return {};

        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        // Create completion record
        const completion = {
            taskId,
            bookId,
            completedAt: new Date().toISOString(),
            ...data
        };

        // Award XP and coins
        const newXp = state.user.xp + task.rewards.xp;
        const newCoins = state.user.bizCoins + task.rewards.coins;
        const newLevel = getLevel(newXp);
        const leveledUp = newLevel > state.user.level;

        // Update streak
        const today = getToday();
        const lastTaskDate = state.user.lastBookTaskDate;
        const yesterday = getYesterday();
        let newStreak = state.user.bookTaskStreak || 0;

        if (lastTaskDate === today) {
            // Already completed a task today, keep streak
        } else if (lastTaskDate === yesterday) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset streak
        }

        // Check for badge awards
        const newBadges = [...state.user.badges];
        const completedTasks = [...(state.user.completedBookTasks || []), completion];

        // Badge: Early Riser
        if (task.rewards.badge === "Early Riser" && !newBadges.includes("Early Riser")) {
            newBadges.push("Early Riser");
        }

        // Badge: Habit Builder
        if (task.rewards.badge === "Habit Builder" && !newBadges.includes("Habit Builder")) {
            newBadges.push("Habit Builder");
        }

        // Badge: Knowledge Seeker (20 quizzes)
        const quizCount = completedTasks.filter(c => {
            const b = state.library.find(book => book.id === c.bookId);
            const t = b?.tasks?.find(task => task.id === c.taskId);
            return t?.type === 'quiz';
        }).length;
        if (quizCount >= 20 && !newBadges.includes("Knowledge Seeker")) {
            newBadges.push("Knowledge Seeker");
        }

        // Badge: Action Taker (10 action challenges)
        const actionCount = completedTasks.filter(c => {
            const b = state.library.find(book => book.id === c.bookId);
            const t = b?.tasks?.find(task => task.id === c.taskId);
            return t?.type === 'action_challenge';
        }).length;
        if (actionCount >= 10 && !newBadges.includes("Action Taker")) {
            newBadges.push("Action Taker");
        }

        // Badge: Deep Thinker (15 reflections)
        const reflectionCount = completedTasks.filter(c => {
            const b = state.library.find(book => book.id === c.bookId);
            const t = b?.tasks?.find(task => task.id === c.taskId);
            return t?.type === 'reflection';
        }).length;
        if (reflectionCount >= 15 && !newBadges.includes("Deep Thinker")) {
            newBadges.push("Deep Thinker");
        }

        // Badge: Bookworm (read 10 books - all tasks completed)
        const booksCompleted = state.library.filter(book => {
            if (!book.tasks || book.tasks.length === 0) return false;
            return book.tasks.every(t => completedTasks.some(c => c.taskId === t.id));
        }).length;
        if (booksCompleted >= 10 && !newBadges.includes("Bookworm")) {
            newBadges.push("Bookworm");
        }

        if (leveledUp && state.user.settings.soundEnabled) SoundService.playLevelUp();

        const updatedUser = {
            ...state.user,
            xp: newXp,
            level: newLevel,
            bizCoins: newCoins,
            completedBookTasks: completedTasks,
            bookTaskStreak: newStreak,
            lastBookTaskDate: today,
            badges: newBadges
        };

        return {
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
            showLevelUpModal: leveledUp,
            levelUpData: leveledUp ? { level: newLevel, xp: newXp } : null
        };
    }),

    getBookTaskProgress: (bookId) => {
        const state = get();
        const book = state.library.find(b => b.id === bookId);
        if (!book || !book.tasks) return { completed: 0, total: 0, percentage: 0 };

        const total = book.tasks.length;
        const completed = book.tasks.filter(task =>
            state.user?.completedBookTasks?.some(c => c.taskId === task.id)
        ).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
    },

    claimDailySpin: (prize) => set((state) => {
        if (!state.user) return {};
        const today = getToday();
        if (state.user.lastSpinDate === today) return {}; // Already spun today

        if (state.user.settings.soundEnabled) SoundService.playSuccess();

        let updatedUser = {
            ...state.user,
            lastSpinDate: today,
            totalSpins: (state.user.totalSpins ?? 0) + 1,
        };

        if (prize.type === 'coins' || prize.type === 'jackpot') {
            updatedUser = { ...updatedUser, bizCoins: updatedUser.bizCoins + prize.value };
        } else if (prize.type === 'xp') {
            const newXp = updatedUser.xp + prize.value;
            updatedUser = { ...updatedUser, xp: newXp, level: getLevel(newXp) };
        } else if (prize.type === 'shield') {
            updatedUser = { ...updatedUser, streakShield: true };
        } else if (prize.type === 'item') {
            if (!updatedUser.inventory.includes(prize.id)) {
                updatedUser = { ...updatedUser, inventory: [...updatedUser.inventory, prize.id] };
            }
        }

        Logger.info('Daily Spin claimed', { userId: state.user.id, prize: prize.id });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    claimWeeklyChallenge: (challenge, weekKey) => set((state) => {
        if (!state.user) return {};

        // Reset if new week
        const existing = state.user.weeklyChallenges?.weekKey === weekKey
            ? state.user.weeklyChallenges
            : { weekKey, completed: [], bonusClaimed: false };

        // Already completed this challenge
        if (existing.completed.includes(challenge.id)) return {};

        const newCompleted = [...existing.completed, challenge.id];
        const allDone = newCompleted.length >= 3;
        const bonusClaimed = existing.bonusClaimed || allDone;

        let updatedUser = {
            ...state.user,
            weeklyChallenges: { weekKey, completed: newCompleted, bonusClaimed },
        };

        // Apply individual reward
        if (challenge.reward.type === 'coins') {
            updatedUser = { ...updatedUser, bizCoins: updatedUser.bizCoins + challenge.reward.value };
        } else {
            const newXp = updatedUser.xp + challenge.reward.value;
            updatedUser = { ...updatedUser, xp: newXp, level: getLevel(newXp) };
        }

        // Apply completion bonus (500 coins) if all 3 done and bonus not yet claimed
        if (allDone && !existing.bonusClaimed) {
            updatedUser = { ...updatedUser, bizCoins: updatedUser.bizCoins + 500 };
            if (state.user.settings.soundEnabled) SoundService.playSuccess();
        }

        Logger.info('Weekly challenge claimed', { userId: state.user.id, challengeId: challenge.id, weekKey });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    claimBizPulseRead: (articleId, xpReward, today) => set((state) => {
        if (!state.user) return {};

        const existing = state.user.bizPulseRead?.date === today
            ? state.user.bizPulseRead
            : { date: today, articleIds: [] };

        if (existing.articleIds.includes(articleId)) return {};

        const newXp = state.user.xp + xpReward;
        const updatedUser = {
            ...state.user,
            xp: newXp,
            level: getLevel(newXp),
            bizPulseRead: { date: today, articleIds: [...existing.articleIds, articleId] },
        };

        Logger.info('BizPulse article read', { userId: state.user.id, articleId });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    buyStock: (stockId, shares, pricePerShare) => set((state) => {
        if (!state.user) return {};
        const cost = Math.round(pricePerShare * shares);
        if (state.user.bizCoins < cost) return {};

        const portfolio = [...(state.user.stockPortfolio ?? [])];
        const idx = portfolio.findIndex(h => h.stockId === stockId);
        if (idx >= 0) {
            const existing = portfolio[idx];
            const totalShares = existing.shares + shares;
            portfolio[idx] = {
                stockId,
                shares: totalShares,
                avgBuyPrice: (existing.avgBuyPrice * existing.shares + pricePerShare * shares) / totalShares,
            };
        } else {
            portfolio.push({ stockId, shares, avgBuyPrice: pricePerShare });
        }

        const updatedUser = { ...state.user, bizCoins: state.user.bizCoins - cost, stockPortfolio: portfolio };
        Logger.info('Stock bought', { userId: state.user.id, stockId, shares });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    sellStock: (stockId, shares, pricePerShare) => set((state) => {
        if (!state.user) return {};
        const portfolio = [...(state.user.stockPortfolio ?? [])];
        const idx = portfolio.findIndex(h => h.stockId === stockId);
        if (idx < 0 || portfolio[idx].shares < shares) return {};

        const proceeds = Math.round(pricePerShare * shares);
        if (portfolio[idx].shares === shares) {
            portfolio.splice(idx, 1);
        } else {
            portfolio[idx] = { ...portfolio[idx], shares: portfolio[idx].shares - shares };
        }

        const updatedUser = { ...state.user, bizCoins: state.user.bizCoins + proceeds, stockPortfolio: portfolio };
        Logger.info('Stock sold', { userId: state.user.id, stockId, shares });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    buyAvatarItem: (itemId, cost) => set((state) => {
        if (!state.user || state.user.bizCoins < cost) return {};
        if (state.user.inventory.includes(itemId)) return {};
        const updatedUser = {
            ...state.user,
            bizCoins: state.user.bizCoins - cost,
            inventory: [...state.user.inventory, itemId],
        };
        Logger.info('Avatar item bought', { userId: state.user.id, itemId });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    equipAvatarItem: (itemId, category) => set((state) => {
        if (!state.user) return {};
        // Remove any previously equipped item from same category by filtering via AVATAR_ITEMS
        // We keep ids from other categories and add itemId
        const updatedUser = {
            ...state.user,
            equippedItems: [
                ...state.user.equippedItems.filter(id => {
                    // Keep items not in the same category as itemId
                    // We can detect category by checking the prefix (h/o/a/bg)
                    return !id.startsWith(itemId[0] === 'b' ? 'bg' : itemId[0]);
                }),
                itemId,
            ],
        };
        Logger.info('Avatar item equipped', { userId: state.user.id, itemId });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),

    claimSeasonalChallenge: (challengeId, reward) => set((state) => {
        if (!state.user) return {};
        const already = state.user.completedSeasonalChallenges ?? [];
        if (already.includes(challengeId)) return {};

        const updatedUser = {
            ...state.user,
            completedSeasonalChallenges: [...already, challengeId],
            ...(reward.type === 'coins'
                ? { bizCoins: state.user.bizCoins + reward.value }
                : { xp: state.user.xp + reward.value, level: getLevel(state.user.xp + reward.value) }
            ),
        };
        Logger.info('Seasonal challenge claimed', { userId: state.user.id, challengeId });
        return { user: updatedUser, users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
    }),
});
