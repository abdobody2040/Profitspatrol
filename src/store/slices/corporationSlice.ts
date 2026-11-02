import { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { Corporation } from '../../types';
import { Logger } from '../../services/logger';
import { supabaseAdapter } from '../../services/persistence/SupabaseAdapter';
import { isSupabaseConfigured } from '../../lib/supabase';

export interface CorporationSlice {
    corporations: Corporation[];

    createCorporation: (data: { name: string; motto?: string; emoji: string; color: string }) => Promise<void>;
    joinCorporation: (corpId: string) => Promise<void>;
    leaveCorporation: (corpId: string) => Promise<void>;
    loadCorporations: () => Promise<void>;
}

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

export const createCorporationSlice: StateCreator<AppState, [], [], CorporationSlice> = (set, get) => ({
    corporations: [],

    loadCorporations: async () => {
        if (!isSupabaseConfigured()) {
            return;
        }

        try {
            const { data: corpsData, error: corpsErr } = await supabaseAdapter.client!
                .from('corporations')
                .select('*');
            if (corpsErr) {
                Logger.error("Failed to load corporations", corpsErr);
                return;
            }

            const { data: membersData, error: membersErr } = await supabaseAdapter.client!
                .from('corporation_members')
                .select(`
                    corporation_id,
                    user_id,
                    role,
                    joined_at,
                    profiles (
                        id,
                        username,
                        level,
                        xp
                    )
                `);

            if (membersErr) {
                Logger.error("Failed to load corporation members", membersErr);
                return;
            }

            const corporations: Corporation[] = (corpsData || []).map(c => {
                const corpMembers = (membersData || []).filter((m: any) => m.corporation_id === c.id);
                const memberIds = corpMembers.map((m: any) => m.user_id);
                const members = corpMembers.map((m: any) => ({
                    id: m.user_id,
                    name: m.profiles?.username || 'Unknown',
                    level: m.profiles?.level || 1,
                    xp: m.profiles?.xp || 0
                }));
                const totalXP = members.reduce((sum, m) => sum + m.xp, 0);

                return {
                    id: c.id,
                    name: c.name,
                    motto: c.motto,
                    emoji: c.logo_emoji || '🏢',
                    color: c.logo_color || '#6366f1',
                    ownerId: c.founder_id,
                    memberIds,
                    members,
                    totalXP,
                    createdAt: c.created_at
                };
            });

            set({ corporations });
        } catch (error) {
            Logger.error("Failed to load corporations exception", error);
        }
    },

    createCorporation: async ({ name, motto, emoji, color }) => {
        const state = get();
        if (!state.user) return;

        // Check user isn't already in a corp
        if (state.user.corporationId) {
            Logger.warn('User already in a corporation');
            return;
        }

        try {
            if (isSupabaseConfigured()) {
                const corpId = await supabaseAdapter.createCorporation(state.user.id, { name, motto, emoji, color });
                const updatedUser = { ...state.user, corporationId: corpId };
                
                // Reload corporations to update list
                await get().loadCorporations();
                
                set({
                    user: updatedUser,
                    users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                });
            } else {
                // Mock behavior
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

                Logger.info('Corporation created (Mock)', { corpId: newCorp.id, name });
                set({
                    corporations: [...state.corporations, builtCorp],
                    user: updatedUser,
                    users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                });
            }
        } catch (err) {
            Logger.error("Failed to create corporation", err);
        }
    },

    joinCorporation: async (corpId) => {
        const state = get();
        if (!state.user || state.user.corporationId) return;

        try {
            if (isSupabaseConfigured()) {
                await supabaseAdapter.joinCorporation(state.user.id, corpId);
                const updatedUser = { ...state.user, corporationId: corpId };
                
                await get().loadCorporations();
                
                set({
                    user: updatedUser,
                    users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                });
            } else {
                // Mock behavior
                const corp = state.corporations.find(c => c.id === corpId);
                if (!corp) return;

                const updatedCorp: Corporation = {
                    ...corp,
                    memberIds: [...corp.memberIds, state.user.id],
                };
                const updatedUser = { ...state.user, corporationId: corpId };
                const builtCorp = buildMemberList(updatedCorp, [...state.users, updatedUser]);

                Logger.info('User joined corporation (Mock)', { userId: state.user.id, corpId });
                set({
                    corporations: state.corporations.map(c => c.id === corpId ? builtCorp : c),
                    user: updatedUser,
                    users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                });
            }
        } catch (err) {
            Logger.error("Failed to join corporation", err);
        }
    },

    leaveCorporation: async (corpId) => {
        const state = get();
        if (!state.user || state.user.corporationId !== corpId) return;

        try {
            if (isSupabaseConfigured()) {
                await supabaseAdapter.leaveCorporation(state.user.id, corpId);
                const updatedUser = { ...state.user, corporationId: undefined };
                
                await get().loadCorporations();
                
                set({
                    user: updatedUser,
                    users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                });
            } else {
                // Mock behavior
                const corp = state.corporations.find(c => c.id === corpId);
                if (!corp) return;

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

                Logger.info('User left corporation (Mock)', { userId: state.user.id, corpId });
                set({
                    corporations: updatedCorps,
                    user: updatedUser,
                    users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u),
                });
            }
        } catch (err) {
            Logger.error("Failed to leave corporation", err);
        }
    },
});
