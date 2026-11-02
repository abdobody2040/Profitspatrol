import { StateCreator } from 'zustand';
import { useAppStore } from '../useAppStore';
import type { SocialState } from '../socialTypes';
import { Bounty } from '../../types';
import { Logger } from '../../services/logger';

export interface BountySlice {
    bounties: Bounty[];
    addBounty: (bounty: Bounty) => void;
    updateBounty: (id: string, updates: Partial<Bounty>) => void;
    deleteBounty: (id: string) => void;
    approveBounty: (id: string) => void;
    submitBountyForApproval: (id: string, photoUrl?: string) => void;
    refreshRecurringBounties: () => void;
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
                        ppTokens: (u.ppTokens || 0) + bounty.reward,
                        xp: (u.xp || 0) + 50 // Flat 50 XP for a chore
                    };
                }
                return u;
            });

            if (appState.user && appState.user.id === bounty.assigneeId) {
                currentUserUpdates = {
                    ppTokens: (appState.user.ppTokens || 0) + bounty.reward,
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

        // Notify Kid
        useAppStore.getState().addNotification({
            title: 'Bounty Approved! 💰',
            message: `Your work on "${bounty.title}" has been approved. You earned ${bounty.reward} P Tokens!`,
            type: 'SUCCESS'
        });
    },

    submitBountyForApproval: (id: string, photoUrl?: string) => {
        const state = get();
        const bounty = state.bounties.find(b => b.id === id);
        if (!bounty) return;

        set((state) => ({
            bounties: state.bounties.map(b => 
                b.id === id ? { ...b, status: 'PENDING_APPROVAL', photoUrl, completedAt: new Date().toISOString() } : b
            )
        }));

        // Notify Parent
        useAppStore.getState().addNotification({
            title: 'Task Pending Review 📋',
            message: `A kid has submitted "${bounty.title}" for approval.`,
            type: 'INFO'
        });
    },

    refreshRecurringBounties: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => {
            const updatedBounties = [...state.bounties];
            let changed = false;

            state.bounties.forEach(b => {
                if (!b.frequency || b.frequency === 'ONCE') return;

                const lastGen = b.lastGeneratedAt ? b.lastGeneratedAt.split('T')[0] : '';
                
                if (lastGen !== today) {
                    // Check if it's DAILY or WEEKLY
                    let shouldReset = false;
                    if (b.frequency === 'DAILY') {
                        shouldReset = true;
                    } else if (b.frequency === 'WEEKLY') {
                        // Simple weekly check: if lastGen was > 7 days ago or different week number
                        // For MVP, we'll just check if it's a different date and hope the user doesn't open it twice a day
                        // A better check would be comparing week numbers
                        const lastDate = new Date(b.lastGeneratedAt || b.createdAt);
                        const diff = (new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
                        if (diff >= 7) shouldReset = true;
                    }

                    if (shouldReset) {
                        const idx = updatedBounties.findIndex(ob => ob.id === b.id);
                        updatedBounties[idx] = {
                            ...b,
                            status: 'OPEN',
                            assigneeId: undefined,
                            photoUrl: undefined,
                            completedAt: undefined,
                            lastGeneratedAt: new Date().toISOString()
                        };
                        changed = true;
                    }
                }
            });

            return changed ? { bounties: updatedBounties } : {};
        });
    }
});
