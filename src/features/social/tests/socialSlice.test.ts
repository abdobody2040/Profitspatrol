
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSocialSlice } from '../../../store/slices/socialSlice';
import { SocialService } from '../../../services/SocialService';

// Mock SocialService
vi.mock('../../../services/SocialService', () => ({
    SocialService: {
        getFriends: vi.fn(),
        getPendingRequests: vi.fn(),
        sendFriendRequest: vi.fn(),
        acceptFriendRequest: vi.fn(),
        declineFriendRequest: vi.fn(),
        searchUsers: vi.fn()
    }
}));

// Mock Logger
vi.mock('../../../utils/Logger', () => ({
    Logger: {
        error: vi.fn(),
        warn: vi.fn()
    }
}));

const INITIAL_LOADING = { friends: false, requests: false, sending: false, searching: false };

describe('socialSlice', () => {
    let store: any;
    let set: any;
    let get: any;

    beforeEach(() => {
        set = vi.fn((updater: any) => {
            const update = typeof updater === 'function' ? updater(store) : updater;
            store = { ...store, ...update };
        });
        get = vi.fn(() => store);
        store = createSocialSlice(set, get, {} as any);
    });

    it('should have initial state', () => {
        expect(store.friends).toEqual([]);
        expect(store.pendingRequests).toEqual([]);
        expect(store.searchResults).toEqual([]);
        expect(store.loadingStates).toEqual(INITIAL_LOADING);
    });

    it('should fetch friends successfully', async () => {
        const mockFriends = [{ id: '1', user_id: 'u1', friend_id: 'f1', status: 'accepted', created_at: '' }];
        (SocialService.getFriends as any).mockResolvedValue(mockFriends);

        await store.fetchFriends();

        expect(SocialService.getFriends).toHaveBeenCalled();
        expect(store.friends).toEqual(mockFriends);
        expect(store.loadingStates.friends).toBe(false);
    });

    it('should handle fetch friends error', async () => {
        (SocialService.getFriends as any).mockRejectedValue(new Error('Network error'));

        await store.fetchFriends();

        expect(store.loadingStates.friends).toBe(false);
    });

    it('should send friend request successfully', async () => {
        (SocialService.sendFriendRequest as any).mockResolvedValue({ success: true });

        const result = await store.sendFriendRequest('friend-123');

        expect(result).toBe(true);
        expect(SocialService.sendFriendRequest).toHaveBeenCalledWith('friend-123');
        expect(store.loadingStates.sending).toBe(false);
    });

    it('should handle search users', async () => {
        const mockUsers = [{ id: 'u2', username: 'testuser' }];
        (SocialService.searchUsers as any).mockResolvedValue(mockUsers);

        await store.searchUsers('test');

        expect(SocialService.searchUsers).toHaveBeenCalledWith('test');
        expect(store.searchResults).toEqual(mockUsers);
        expect(store.loadingStates.searching).toBe(false);
    });

    it('should decline friend request and remove it optimistically', async () => {
        store.pendingRequests = [
            { id: 'req-1', user_id: 'u1', friend_id: 'me', status: 'pending', created_at: '' },
            { id: 'req-2', user_id: 'u2', friend_id: 'me', status: 'pending', created_at: '' },
        ];
        (SocialService.declineFriendRequest as any).mockResolvedValue({ success: true });

        const result = await store.declineFriendRequest('req-1');

        expect(result).toBe(true);
        expect(store.pendingRequests).toHaveLength(1);
        expect(store.pendingRequests[0].id).toBe('req-2');
    });
});
