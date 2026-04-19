import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { Corporation } from '../../types';
import { Logger } from '../../services/logger';

// ─── Slice Interface ──────────────────────────────────────────────────────────
export interface CorporationSlice {
    corporations: Corporation[];

    createCorporation: (data: { name: string; motto?: string; emoji: string; color: string }) => Promise<void>;
    joinCorporation: (corpId: string) => void;
    leaveCorporation: (corpId: string) => void;
    loadCorporations: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildMemberList(corp: Corporation, users: AppState['users']): Corporation {
    const members = corp.memberIds
        .map(id => {
            const u = users.find(u => u.id === id);
            return u ? { id: u.id, name: u.name, level: u.level, xp: u.xp } : null;
        })
        .filter(Boolean) as Corporation['members'];
    const totalXP = members?.reduce((sum, m) => sum + m.xp, 0) ?? 0;
    return { ...corp, members, totalXP };
}

// ─── Slice Implementation ─────────────────────────────────────────────────────
export const createCorporationSlice: StateCreator<AppState, [], [], CorporationSlice> = (set, get) => ({
    corporations: [],

    loadCorporations: () => {
        // In production, this would fetch from Supabase.
        // For now corporations are kept in Zustand state (persisted with localStorage).
    },

    createCorporation: async ({ name, motto, emoji, color }) => {
        const state = get();
        if (!state.user) return;

        // Check user isn't already in a corp
        if (state.user.corporationId) {
            Logger.warn('User already in a corporation');
            return;
        }

        const newCorp: Corporation = {
            id: `corp_${Date.now()}`,
            name,
            motto,
            emoji,
            color,
            ownerId: state.user.id,
            memberIds: [state.user.id],
            totalXP: state.user.xp,
            createdAt: new Date().toISOString().split('T')[0],
        };

        const updatedUser = { ...state.user, corporationId: newCorp.id };
        const builtCorp = buildMemberList(newCorp, [...state.users, updatedUser]);

        Logger.info('Corporation created', { corpId: newCorp.id, name });
        set({
            corporations: [...state.corporations, builtCorp],
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        });
    },

    joinCorporation: (corpId) => set((state) => {
        if (!state.user || state.user.corporationId) return {};

        const corp = state.corporations.find(c => c.id === corpId);
        if (!corp) return {};

        const updatedCorp: Corporation = {
            ...corp,
            memberIds: [...corp.memberIds, state.user.id],
        };
        const updatedUser = { ...state.user, corporationId: corpId };
        const builtCorp = buildMemberList(updatedCorp, [...state.users, updatedUser]);

        Logger.info('User joined corporation', { userId: state.user.id, corpId });
        return {
            corporations: state.corporations.map(c => c.id === corpId ? builtCorp : c),
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        };
    }),

    leaveCorporation: (corpId) => set((state) => {
        if (!state.user || state.user.corporationId !== corpId) return {};

        const corp = state.corporations.find(c => c.id === corpId);
        if (!corp) return {};

        const updatedCorp: Corporation = {
            ...corp,
            memberIds: corp.memberIds.filter(id => id !== state.user!.id),
        };
        const updatedUser = { ...state.user, corporationId: undefined };
        const builtCorp = buildMemberList(updatedCorp, state.users);

        // If no members left, delete the corp
        const updatedCorps = updatedCorp.memberIds.length === 0
            ? state.corporations.filter(c => c.id !== corpId)
            : state.corporations.map(c => c.id === corpId ? builtCorp : c);

        Logger.info('User left corporation', { userId: state.user.id, corpId });
        return {
            corporations: updatedCorps,
            user: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        };
    }),
});
