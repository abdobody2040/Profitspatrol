import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { FURNITURE_ITEMS } from '../../features/hq/data/furniture';
import { DEBATE_TOPICS, DebateTopic } from '../../features/debate/data/topics';
import { MORE_BOOKS } from '../../features/library/data/moreBooks';
import { Book, UserRole } from '../../types';
import { Logger } from '../../services/logger';

// ─── Economy Config ────────────────────────────────────────────────────────────
export interface EconomyConfig {
    coinMultiplier: number;        // 0.5 – 3.0  (lesson/game coin awards)
    xpMultiplier: number;          // 0.5 – 3.0
    maxIdleHours: number;          // 1 – 48h cap for idle income
    energyRegenMinutes: number;    // minutes per 1 energy point
    spinPrizes: SpinPrize[];
}

export interface SpinPrize {
    id: string;
    type: 'coins' | 'xp' | 'energy' | 'item';
    label: string;
    value: number;
    emoji: string;
    weight: number;    // relative probability (higher = more common)
}

const DEFAULT_SPIN_PRIZES: SpinPrize[] = [
    { id: 'sp1', type: 'coins', label: '50 Coins',    value: 50,   emoji: '🪙', weight: 30 },
    { id: 'sp2', type: 'coins', label: '100 Coins',   value: 100,  emoji: '💰', weight: 25 },
    { id: 'sp3', type: 'coins', label: '200 Coins',   value: 200,  emoji: '💎', weight: 15 },
    { id: 'sp4', type: 'xp',    label: '25 XP',       value: 25,   emoji: '⭐', weight: 20 },
    { id: 'sp5', type: 'xp',    label: '50 XP',       value: 50,   emoji: '🌟', weight: 8  },
    { id: 'sp6', type: 'energy',label: '+2 Energy',   value: 2,    emoji: '⚡', weight: 2  },
];

export const DEFAULT_ECONOMY_CONFIG: EconomyConfig = {
    coinMultiplier: 1,
    xpMultiplier: 1,
    maxIdleHours: 24,
    energyRegenMinutes: 60,
    spinPrizes: DEFAULT_SPIN_PRIZES,
};

// ─── Feature Flags ─────────────────────────────────────────────────────────────
export interface AppFeatureFlags {
    adventureMap: boolean;
    arcade: boolean;
    debateArena: boolean;
    library: boolean;
    videos: boolean;
    social: boolean;
    hqCustomization: boolean;
    businessTank: boolean;
    gigCentral: boolean;
    realEstate: boolean;
    seasonalEvents: boolean;
    ollieChat: boolean;
    dailySpin: boolean;
    leaderboard: boolean;
    parentDashboard: boolean;
    stripePayments: boolean;
    franchise: boolean;
    corporation: boolean;
}

export const DEFAULT_FEATURE_FLAGS: AppFeatureFlags = {
    adventureMap: true,
    arcade: true,
    debateArena: true,
    library: true,
    videos: true,
    social: true,
    hqCustomization: true,
    businessTank: true,
    gigCentral: true,
    realEstate: true,
    seasonalEvents: true,
    ollieChat: true,
    dailySpin: true,
    leaderboard: true,
    parentDashboard: true,
    stripePayments: true,
    franchise: true,
    corporation: true,
};

// ─── Furniture Overrides ────────────────────────────────────────────────────────
// Map of furniture item ID → override cost (null = use default from furniture.ts)
export type FurnitureOverrides = Record<string, { cost: number }>;

// ─── Badge Definitions ─────────────────────────────────────────────────────────
export interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    icon: string;             // emoji
    xpThreshold?: number;     // auto-award when user reaches this XP
    manualOnly?: boolean;     // only admin can award
}

export const DEFAULT_BADGES: BadgeDefinition[] = [
    { id: 'first_lesson',  name: 'First Step',    description: 'Completed first lesson',         icon: '👣', xpThreshold: 10  },
    { id: 'century_xp',   name: 'Century Club',  description: 'Earned 100 XP',                  icon: '💯', xpThreshold: 100 },
    { id: 'streak_7',     name: 'Week Warrior',  description: '7-day streak',                   icon: '🔥', manualOnly: true  },
    { id: 'entrepreneur',  name: 'Entrepreneur',  description: 'Completed all Season 1 modules', icon: '🚀', manualOnly: true  },
    { id: 'top_earner',   name: 'Top Earner',    description: 'Reached 1000 BizCoins',          icon: '🏆', xpThreshold: 500 },
];

// ─── Slice State & Actions ─────────────────────────────────────────────────────
export interface AdminConfigSlice {
    economyConfig: EconomyConfig;
    featureFlags: AppFeatureFlags;
    furnitureOverrides: FurnitureOverrides;
    debateTopicsAdmin: DebateTopic[];
    badgeDefinitions: BadgeDefinition[];
    exclusiveBooks: Book[];

    // Economy
    updateEconomyConfig: (patch: Partial<EconomyConfig>) => void;
    updateSpinPrize: (id: string, patch: Partial<SpinPrize>) => void;
    resetEconomyConfig: () => void;

    // Feature flags
    setFeatureFlag: (flag: keyof AppFeatureFlags, value: boolean) => void;
    resetFeatureFlags: () => void;

    // Furniture overrides
    setFurnitureOverride: (itemId: string, cost: number) => void;
    resetFurnitureOverride: (itemId: string) => void;

    // Debate topics
    addDebateTopic: (topic: DebateTopic) => void;
    updateDebateTopic: (id: string, patch: Partial<DebateTopic>) => void;
    deleteDebateTopic: (id: string) => void;

    // Badges
    addBadgeDefinition: (badge: BadgeDefinition) => void;
    updateBadgeDefinition: (id: string, patch: Partial<BadgeDefinition>) => void;
    deleteBadgeDefinition: (id: string) => void;
    adminAwardBadge: (userId: string, badgeId: string) => void;
    adminGrantCoins: (userId: string, amount: number) => void;

    // Exclusive Books CRUD
    addExclusiveBook: (book: Book) => void;
    updateExclusiveBook: (id: string, patch: Partial<Book>) => void;
    deleteExclusiveBook: (id: string) => void;
    resetExclusiveBooks: () => void;
}

export const createAdminConfigSlice: StateCreator<AppState, [], [], AdminConfigSlice> = (set, get) => ({
    economyConfig: DEFAULT_ECONOMY_CONFIG,
    featureFlags: DEFAULT_FEATURE_FLAGS,
    furnitureOverrides: {},
    debateTopicsAdmin: DEBATE_TOPICS,
    badgeDefinitions: DEFAULT_BADGES,
    exclusiveBooks: MORE_BOOKS,

    // ── Shared RBAC guard ────────────────────────────────────────────────────────
    // ✅ SECURITY FIX: All admin mutations now call this guard at entry.
    // Without it any authenticated user could call e.g.
    // useAppStore.getState().setFeatureFlag('stripePayments', false) from the browser console
    // to disable Stripe or manipulate game economy — the UI gate was the only protection.
    // Helper is inlined per-function (not extracted) because StateCreator closures
    // don't support shared private methods — each function gets access to `get()`.

    // ── Economy ─────────────────────────────────────────────────────────────────
    updateEconomyConfig: (patch) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] updateEconomyConfig blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ economyConfig: { ...s.economyConfig, ...patch } }));
    },

    updateSpinPrize: (id, patch) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] updateSpinPrize blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({
            economyConfig: {
                ...s.economyConfig,
                spinPrizes: s.economyConfig.spinPrizes.map(p =>
                    p.id === id ? { ...p, ...patch } : p
                )
            }
        }));
    },

    resetEconomyConfig: () => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] resetEconomyConfig blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set({ economyConfig: DEFAULT_ECONOMY_CONFIG });
    },

    // ── Feature Flags ────────────────────────────────────────────────────────────
    setFeatureFlag: (flag, value) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] setFeatureFlag blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ featureFlags: { ...s.featureFlags, [flag]: value } }));
    },

    resetFeatureFlags: () => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] resetFeatureFlags blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set({ featureFlags: DEFAULT_FEATURE_FLAGS });
    },

    // ── Furniture Overrides ──────────────────────────────────────────────────────
    setFurnitureOverride: (itemId, cost) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] setFurnitureOverride blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ furnitureOverrides: { ...s.furnitureOverrides, [itemId]: { cost } } }));
    },

    resetFurnitureOverride: (itemId) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] resetFurnitureOverride blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => {
            const next = { ...s.furnitureOverrides };
            delete next[itemId];
            return { furnitureOverrides: next };
        });
    },

    // ── Debate Topics ────────────────────────────────────────────────────────────
    addDebateTopic: (topic) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] addDebateTopic blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ debateTopicsAdmin: [...s.debateTopicsAdmin, topic] }));
    },

    updateDebateTopic: (id, patch) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] updateDebateTopic blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({
            debateTopicsAdmin: s.debateTopicsAdmin.map(t =>
                t.id === id ? { ...t, ...patch } : t
            )
        }));
    },

    deleteDebateTopic: (id) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] deleteDebateTopic blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ debateTopicsAdmin: s.debateTopicsAdmin.filter(t => t.id !== id) }));
    },

    // ── Badges ──────────────────────────────────────────────────────────────────
    addBadgeDefinition: (badge) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] addBadgeDefinition blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ badgeDefinitions: [...s.badgeDefinitions, badge] }));
    },

    updateBadgeDefinition: (id, patch) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] updateBadgeDefinition blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({
            badgeDefinitions: s.badgeDefinitions.map(b =>
                b.id === id ? { ...b, ...patch } : b
            )
        }));
    },

    deleteBadgeDefinition: (id) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] deleteBadgeDefinition blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ badgeDefinitions: s.badgeDefinitions.filter(b => b.id !== id) }));
    },

    adminAwardBadge: (userId, badgeId) => {
        const state = get();
        // ✅ SECURITY FIX: RBAC guard — adminAwardBadge() was callable by any user from the
        // browser console (e.g. useAppStore.getState().adminAwardBadge('any-id', 'any-badge')).
        // Without this guard the admin panel UI was the only gate, which is security theater.
        if (state.user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] adminAwardBadge blocked: caller is not ADMIN', { callerId: state.user?.id });
            void Logger.logSecurityEvent('unauthorized_access', 'high', {
                action: 'adminAwardBadge', callerId: state.user?.id, targetId: userId,
            });
            return;
        }
        const targetUser = state.users.find(u => u.id === userId);
        if (!targetUser) return;
        if (targetUser.badges?.includes(badgeId)) return; // already awarded
        const updatedBadges = [...(targetUser.badges || []), badgeId];
        state.updateUserAdmin(userId, { badges: updatedBadges });
    },

    adminGrantCoins: (userId, amount) => {
        const state = get();
        // ✅ SECURITY FIX: RBAC guard (same issue as adminAwardBadge)
        if (state.user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] adminGrantCoins blocked: caller is not ADMIN', { callerId: state.user?.id });
            return;
        }
        const targetUser = state.users.find(u => u.id === userId);
        if (!targetUser) return;
        // ✅ SECURITY FIX: Cap grant amount to prevent integer overflow abuse
        const MAX_GRANT = 1_000_000;
        const safeAmount = Math.min(Math.max(-MAX_GRANT, amount), MAX_GRANT);
        const newCoins = Math.max(0, Math.min((targetUser.bizCoins || 0) + safeAmount, MAX_GRANT));
        state.updateUserAdmin(userId, { bizCoins: newCoins });
    },

    // ── Exclusive Books ──────────────────────────────────────────────────────────
    addExclusiveBook: (book) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] addExclusiveBook blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ exclusiveBooks: [...s.exclusiveBooks, book] }));
    },

    updateExclusiveBook: (id, patch) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] updateExclusiveBook blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({
            exclusiveBooks: s.exclusiveBooks.map(b =>
                b.id === id ? { ...b, ...patch } : b
            )
        }));
    },

    deleteExclusiveBook: (id) => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] deleteExclusiveBook blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set(s => ({ exclusiveBooks: s.exclusiveBooks.filter(b => b.id !== id) }));
    },

    resetExclusiveBooks: () => {
        if (get().user?.role !== UserRole.ADMIN) {
            Logger.warn('[Security] resetExclusiveBooks blocked: caller is not ADMIN', { callerId: get().user?.id });
            return;
        }
        set({ exclusiveBooks: MORE_BOOKS });
    },
});
