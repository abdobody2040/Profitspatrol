
import { StateCreator } from 'zustand';
import { AppState } from '../types';
import type { SocialState } from '../socialStore';
import { SocialService } from '../../services/SocialService';
import { Friend, Profile } from '../../types';
import { Logger } from '../../services/logger';

/** Granular per-operation loading flags — replaces the single isLoadingSocial boolean
 *  to prevent flag-corruption race conditions when multiple actions run concurrently. */
export interface SocialLoadingStates {
    friends: boolean;
    requests: boolean;
    sending: boolean;
    searching: boolean;
}

export interface SocialSlice {
    friends: Friend[];
    pendingRequests: Friend[];
    searchResults: Profile[];
    /** @deprecated Use loadingStates instead. Kept for backward-compat with any legacy reads. */
    isLoadingSocial: boolean;
    loadingStates: SocialLoadingStates;

    // Actions
    fetchFriends: () => Promise<void>;
    fetchPendingRequests: () => Promise<void>;
    sendFriendRequest: (friendId: string) => Promise<boolean>;
    acceptFriendRequest: (requestId: string) => Promise<boolean>;
    declineFriendRequest: (requestId: string) => Promise<boolean>;
    searchUsers: (query: string) => Promise<void>;
    clearSearchResults: () => void;
}

export const createSocialSlice: StateCreator<SocialState, [], [], SocialSlice> = (set, get) => ({
    friends: [],
    pendingRequests: [],
    searchResults: [],
    // Backward-compat computed flag — true if any sub-operation is loading
    get isLoadingSocial() {
        const ls = (this as any).loadingStates as SocialLoadingStates;
        return ls.friends || ls.requests || ls.sending || ls.searching;
    },
    loadingStates: { friends: false, requests: false, sending: false, searching: false },

    fetchFriends: async () => {
        set(s => ({ loadingStates: { ...s.loadingStates, friends: true } }));
        try {
            const friends = await SocialService.getFriends();
            set(s => ({ friends, loadingStates: { ...s.loadingStates, friends: false } }));
        } catch (error) {
            Logger.error('fetchFriends failed', error);
            set(s => ({ loadingStates: { ...s.loadingStates, friends: false } }));
        }
    },

    fetchPendingRequests: async () => {
        set(s => ({ loadingStates: { ...s.loadingStates, requests: true } }));
        try {
            const pendingRequests = await SocialService.getPendingRequests();
            set(s => ({ pendingRequests, loadingStates: { ...s.loadingStates, requests: false } }));
        } catch (error) {
            Logger.error('fetchPendingRequests failed', error);
            set(s => ({ loadingStates: { ...s.loadingStates, requests: false } }));
        }
    },

    sendFriendRequest: async (friendId: string) => {
        set(s => ({ loadingStates: { ...s.loadingStates, sending: true } }));
        try {
            const { success, error } = await SocialService.sendFriendRequest(friendId);
            if (!success) {
                Logger.warn('Friend request failed', { error });
            }
            set(s => ({ loadingStates: { ...s.loadingStates, sending: false } }));
            return success;
        } catch (error) {
            Logger.error('sendFriendRequest error', error);
            set(s => ({ loadingStates: { ...s.loadingStates, sending: false } }));
            return false;
        }
    },

    acceptFriendRequest: async (requestId: string) => {
        set(s => ({ loadingStates: { ...s.loadingStates, requests: true } }));
        try {
            const { success } = await SocialService.acceptFriendRequest(requestId);
            if (success) {
                // Refresh both lists; only clear loading flag after both complete
                await get().fetchFriends();
                await get().fetchPendingRequests();
            } else {
                set(s => ({ loadingStates: { ...s.loadingStates, requests: false } }));
            }
            return success;
        } catch (error) {
            Logger.error('acceptFriendRequest error', error);
            set(s => ({ loadingStates: { ...s.loadingStates, requests: false } }));
            return false;
        }
    },

    declineFriendRequest: async (requestId: string) => {
        try {
            const { success } = await SocialService.declineFriendRequest(requestId);
            if (success) {
                // Optimistic removal — no need to re-fetch the whole list
                set(s => ({
                    pendingRequests: s.pendingRequests.filter(r => r.id !== requestId)
                }));
            }
            return success;
        } catch (error) {
            Logger.error('declineFriendRequest error', error);
            return false;
        }
    },

    searchUsers: async (query: string) => {
        set(s => ({ loadingStates: { ...s.loadingStates, searching: true } }));
        try {
            const results = await SocialService.searchUsers(query);
            set(s => ({ searchResults: results, loadingStates: { ...s.loadingStates, searching: false } }));
        } catch (error) {
            Logger.error('searchUsers error', error);
            set(s => ({ searchResults: [], loadingStates: { ...s.loadingStates, searching: false } }));
        }
    },

    clearSearchResults: () => {
        set({ searchResults: [] });
    }
});
