import { StateCreator } from 'zustand';
import { useAppStore } from '../index';
import type { EconomyState } from '../economyStore';
import { Property, UserProperty, TenantEvent } from '../../types';
import { INITIAL_PROPERTIES } from '../../features/venture/data/properties';

// ─── Pure utility — single source of truth for income calculation ─────────────
export function calculatePropertyIncome(
    baseProp: Property,
    level: number,
    renovationLevel = 0
): number {
    const base = baseProp.initialIncome + baseProp.incomeGrowthRate * (level - 1);
    return Math.floor(base * (1 + renovationLevel * 0.10));
}

// ─── Date helper (pure, mockable) ────────────────────────────────────────────
const getToday = (): string => new Date().toISOString().slice(0, 10);

// ─── Safe Date parser — guards against corrupted lastCollected values ────────
function safeParseDateMs(isoStr: string): number {
    const ms = new Date(isoStr).getTime();
    return isNaN(ms) ? 0 : ms;
}

// ─── Tenant event pools ──────────────────────────────────────────────────────
const TENANT_EVENTS_BONUS = [
    { description: 'Tenant paid 2 months early!', amount: 50 },
    { description: 'Viral social media post boosted visitors!', amount: 75 },
    { description: 'Government grant received!', amount: 100 },
    { description: 'Star tenant signed a long-term lease!', amount: 60 },
    { description: 'Holiday weekend surge in traffic!', amount: 40 },
] as const;

const TENANT_EVENTS_COST = [
    { description: 'Burst pipe — emergency repair needed.', amount: 30 },
    { description: 'Pest control required.', amount: 25 },
    { description: 'Elevator maintenance overdue.', amount: 50 },
    { description: 'A/C unit broke down.', amount: 40 },
    { description: 'Vandalism repair.', amount: 20 },
] as const;

function rollTenantEvent(insured: boolean): TenantEvent {
    // Insurance guarantees a bonus event; otherwise 50/50
    const isBonus = insured || Math.random() > 0.5;
    const pool = isBonus ? TENANT_EVENTS_BONUS : TENANT_EVENTS_COST;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return {
        type: isBonus ? 'BONUS' : 'COST',
        description: pick.description,
        amount: pick.amount,
        date: getToday(),
    };
}

// ─── Action return type — allows callers to react to failures ────────────────
export type ActionResult = { success: true } | { success: false; error: string };

// ─── Slice Interface ─────────────────────────────────────────────────────────
export interface RealEstateSlice {
    availableProperties: Property[];
    buyProperty: (id: string) => ActionResult;
    upgradeProperty: (id: string) => ActionResult;
    collectRent: (id: string) => ActionResult;
    collectAllRent: () => void;
    sellProperty: (id: string) => ActionResult;
    renovateProperty: (id: string) => ActionResult;
    toggleInsurance: (id: string) => ActionResult;
    applyTenantEvent: (id: string) => void;
}

// ─── Slice Implementation ────────────────────────────────────────────────────
export const createRealEstateSlice: StateCreator<EconomyState, [], [], RealEstateSlice> = (set, get) => ({
    availableProperties: INITIAL_PROPERTIES,

    buyProperty: (id) => {
        const { availableProperties } = get();
        const user = useAppStore.getState().user;
        if (!user) return { success: false, error: 'Not authenticated' };

        const property = availableProperties.find(p => p.id === id);
        if (!property) return { success: false, error: `Property "${id}" not found` };
        if (user.properties?.some(p => p.propertyId === id))
            return { success: false, error: 'Already owned' };
        if (user.bizCoins < property.cost)
            return { success: false, error: `Need $${(property.cost - user.bizCoins).toLocaleString()} more BizCoins` };

        const newProperty: UserProperty = {
            propertyId: id,
            level: 1,
            lastCollected: new Date().toISOString(),
            renovationLevel: 0,
            hasInsurance: false,
        };

        useAppStore.setState(state => ({
            user: state.user ? {
                ...state.user,
                bizCoins: state.user.bizCoins - property.cost,
                properties: [...(state.user.properties ?? []), newProperty],
            } : null,
        }));
        return { success: true };
    },

    upgradeProperty: (id) => {
        const { availableProperties } = get(); const user = useAppStore.getState().user;
        if (!user) return { success: false, error: 'Not authenticated' };

        const userPropIndex = user.properties?.findIndex(p => p.propertyId === id) ?? -1;
        if (userPropIndex === -1) return { success: false, error: 'Property not owned' };

        const userProp = user.properties![userPropIndex];
        const baseProp = availableProperties.find(p => p.id === id);
        if (!baseProp) return { success: false, error: 'Base property data missing' };
        if (userProp.level >= baseProp.maxLevel)
            return { success: false, error: 'Already at max level' };

        const upgradeCost = Math.floor(baseProp.cost * 0.5 * userProp.level);
        if (user.bizCoins < upgradeCost)
            return { success: false, error: `Need $${(upgradeCost - user.bizCoins).toLocaleString()} more BizCoins` };

        const reachedMax = userProp.level + 1 >= baseProp.maxLevel;

        useAppStore.setState(state => {
            if (!state.user) return {};
            const props = [...state.user.properties!];
            props[userPropIndex] = { ...userProp, level: userProp.level + 1 };
            return { user: { ...state.user, bizCoins: state.user.bizCoins - upgradeCost, properties: props } };
        });

        return { success: true };
    },

    collectRent: (id) => {
        const { availableProperties } = get(); const user = useAppStore.getState().user;
        if (!user) return { success: false, error: 'Not authenticated' };

        const userPropIndex = user.properties?.findIndex(p => p.propertyId === id) ?? -1;
        if (userPropIndex === -1) return { success: false, error: 'Property not owned' };

        const userProp = user.properties![userPropIndex];
        const baseProp = availableProperties.find(p => p.id === id);
        if (!baseProp) return { success: false, error: 'Base property data missing' };

        const now = Date.now();
        const lastMs = safeParseDateMs(userProp.lastCollected);
        const diffMinutes = (now - lastMs) / 60_000;

        if (diffMinutes < 1) return { success: false, error: 'Too soon to collect' };

        const incomePerDay = calculatePropertyIncome(baseProp, userProp.level, userProp.renovationLevel);
        const earned = Math.floor((incomePerDay / (24 * 60)) * Math.min(diffMinutes, 1440));
        if (earned <= 0) return { success: false, error: 'No income accrued yet' };

        useAppStore.setState(state => {
            if (!state.user) return {};
            const props = [...state.user.properties!];
            props[userPropIndex] = { ...userProp, lastCollected: new Date().toISOString() };
            return { user: { ...state.user, bizCoins: state.user.bizCoins + earned, properties: props } };
        });
        return { success: true };
    },

    // ✅ FIX: Atomic collectAllRent — single set() call instead of N calls
    collectAllRent: () => {
        const { availableProperties } = get(); const user = useAppStore.getState().user;
        if (!user?.properties?.length) return;

        const now = Date.now();
        let totalEarned = 0;
        const updatedProps = user.properties.map(userProp => {
            const baseProp = availableProperties.find(p => p.id === userProp.propertyId);
            if (!baseProp) return userProp;

            const lastMs = safeParseDateMs(userProp.lastCollected);
            const diffMinutes = (now - lastMs) / 60_000;
            if (diffMinutes < 1) return userProp;

            const incomePerDay = calculatePropertyIncome(baseProp, userProp.level, userProp.renovationLevel);
            const earned = Math.floor((incomePerDay / (24 * 60)) * Math.min(diffMinutes, 1440));
            if (earned <= 0) return userProp;

            totalEarned += earned;
            return { ...userProp, lastCollected: new Date().toISOString() };
        });

        if (totalEarned > 0) {
            useAppStore.setState({ user: { ...user, bizCoins: user.bizCoins + totalEarned, properties: updatedProps } });
        }
    },

    sellProperty: (id) => {
        const { availableProperties } = get(); const user = useAppStore.getState().user;
        if (!user) return { success: false, error: 'Not authenticated' };

        const baseProp = availableProperties.find(p => p.id === id);
        if (!baseProp) return { success: false, error: 'Property data missing' };
        if (!user.properties?.some(p => p.propertyId === id))
            return { success: false, error: 'Property not owned' };

        const refund = Math.floor(baseProp.cost * 0.6);
        useAppStore.setState(state => ({
            user: state.user ? {
                ...state.user,
                bizCoins: state.user.bizCoins + refund,
                properties: (state.user.properties ?? []).filter(p => p.propertyId !== id),
            } : null,
        }));
        return { success: true };
    },

    renovateProperty: (id) => {
        const { availableProperties } = get(); const user = useAppStore.getState().user;
        if (!user) return { success: false, error: 'Not authenticated' };

        const baseProp = availableProperties.find(p => p.id === id);
        if (!baseProp) return { success: false, error: 'Property data missing' };

        const userPropIndex = user.properties?.findIndex(p => p.propertyId === id) ?? -1;
        if (userPropIndex === -1) return { success: false, error: 'Property not owned' };

        const userProp = user.properties![userPropIndex];
        const maxRenovSkins = Math.max(0, (baseProp.renovationSkins?.length ?? 1) - 1);
        const currentLevel = userProp.renovationLevel ?? 0;

        if (currentLevel >= maxRenovSkins)
            return { success: false, error: 'Already fully renovated' };

        const renovCost = Math.floor(baseProp.cost * 0.2);
        if (user.bizCoins < renovCost)
            return { success: false, error: `Need $${(renovCost - user.bizCoins).toLocaleString()} more BizCoins` };

        useAppStore.setState(state => {
            if (!state.user) return {};
            const props = [...state.user.properties!];
            props[userPropIndex] = { ...userProp, renovationLevel: currentLevel + 1 };
            return { user: { ...state.user, bizCoins: state.user.bizCoins - renovCost, properties: props } };
        });
        return { success: true };
    },

    toggleInsurance: (id) => {
        const { availableProperties } = get(); const user = useAppStore.getState().user;
        if (!user) return { success: false, error: 'Not authenticated' };

        const baseProp = availableProperties.find(p => p.id === id);
        if (!baseProp) return { success: false, error: 'Property data missing' };

        const userPropIndex = user.properties?.findIndex(p => p.propertyId === id) ?? -1;
        if (userPropIndex === -1) return { success: false, error: 'Property not owned' };

        const userProp = user.properties![userPropIndex];
        const alreadyInsured = userProp.hasInsurance ?? false;

        if (!alreadyInsured) {
            const insuranceCost = Math.floor(baseProp.cost * 0.15);
            if (user.bizCoins < insuranceCost)
                return { success: false, error: `Need $${(insuranceCost - user.bizCoins).toLocaleString()} more BizCoins` };

            useAppStore.setState(state => {
                if (!state.user) return {};
                const props = [...state.user.properties!];
                props[userPropIndex] = { ...userProp, hasInsurance: true };
                return { user: { ...state.user, bizCoins: state.user.bizCoins - insuranceCost, properties: props } };
            });
        } else {
            useAppStore.setState(state => {
                if (!state.user) return {};
                const props = [...state.user.properties!];
                props[userPropIndex] = { ...userProp, hasInsurance: false };
                return { user: { ...state.user, properties: props } };
            });
        }
        return { success: true };
    },

    applyTenantEvent: (id) => {
        const user = useAppStore.getState().user;
        if (!user) return;

        const userPropIndex = user.properties?.findIndex(p => p.propertyId === id) ?? -1;
        if (userPropIndex === -1) return;

        const userProp = user.properties![userPropIndex];
        const today = getToday();
        if (userProp.tenantEvent?.date === today) return; // Already applied today

        const event = rollTenantEvent(userProp.hasInsurance ?? false);
        const coinsDelta = event.type === 'BONUS' ? event.amount : -event.amount;

        useAppStore.setState(state => {
            if (!state.user) return {};
            const props = [...state.user.properties!];
            props[userPropIndex] = { ...userProp, tenantEvent: event };
            return {
                user: {
                    ...state.user,
                    bizCoins: Math.max(0, state.user.bizCoins + coinsDelta),
                    properties: props,
                },
            };
        });
    },
});
