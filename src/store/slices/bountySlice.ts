import { StateCreator } from 'zustand';
import { useAppStore } from '../index';
import type { SocialState } from '../socialStore';
import { Bounty } from '../../types';
import { Logger } from '../../services/logger';

export interface BountySlice {
    bounties: Bounty[];
    addBounty: (bounty: Bounty) => void;
    updateBounty: (id: string, updates: Partial<Bounty>) => void;
    deleteBounty: (id: string) => void;
    approveBounty: (id: string) => void;
}

export const createBountySlice: StateCreator<SocialState, [], [], BountySlice> = (set, get) => ({
    bounties: [],

    addBounty: (bounty: Bounty) => set((state) => ({
        bounties: [...state.bounties, bounty]
    })),

    updateBounty: (id: string, updates: Partial<Bounty>) => set((state) => ({
        bounties: state.bounties.map(b => b.id === id ? { ...b, ...updates } : b)
    })),

    deleteBounty: (id: string) => set((state) => ({
        bounties: state.bounties.filter(b => b.id !== id)
    })),

    approveBounty: (id: string) => {
        const state = get();
        const appState = useAppStore.getState();

        // ✅ SECURITY FIX: Only PARENT or ADMIN can approve bounties.
        const callerRole = appState.user?.role;
        if (callerRole !== 'PARENT' && callerRole !== 'ADMIN') {
            Logger.warn('[Security] bountySlice: Non-parent attempted approveBounty — blocked', {
                userId: appState.user?.id, role: callerRole
            });
            return;
        }

        const bounty = state.bounties.find(b => b.id === id);
        if (!bounty || bounty.status === 'COMPLETED') return;

        // 1. Mark as completed
        const completedBounty = {
            ...bounty,
            status: 'COMPLETED' as const,
            completedAt: new Date().toISOString()
        };

        // 2. Find assignee (Kid) and pay them
        // If assigneeId is specifically set, pay them. 
        // If not set, we assume the current user claimed it or we need logic to know WHO completed it.
        // For MVP, we assume the parent clicks "Approve" knowing who did it, 
        // OR the assigneeId was set when the kid "Claimed" it.

        let updatedUsers = appState.users;
        let currentUserUpdates = {};

        if (bounty.assigneeId) {
            updatedUsers = appState.users.map(u => {
                if (u.id === bounty.assigneeId) {
                    return {
                        ...u,
                        bizCoins: (u.bizCoins || 0) + bounty.reward,
                        xp: (u.xp || 0) + 50 // Flat 50 XP for a chore
                    };
                }
                return u;
            });

            if (appState.user && appState.user.id === bounty.assigneeId) {
                currentUserUpdates = {
                    bizCoins: (appState.user.bizCoins || 0) + bounty.reward,
                    xp: (appState.user.xp || 0) + 50
                };
            }
        }

        set((state) => ({
            bounties: state.bounties.map(b => b.id === id ? completedBounty : b)
        }));

        useAppStore.setState({
            users: updatedUsers,
            user: appState.user ? { ...appState.user, ...currentUserUpdates } : null
        });
    }
});
