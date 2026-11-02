import { api } from '../lib/api';
import { Friend, Profile } from '../types';
import { Logger } from './logger';

export const SocialService = {
    /**
     * Send a friend request to another user by ID, username, or invite code
     */
    async sendFriendRequest(target: string): Promise<{ success: boolean; error?: string }> {
        const reqId = crypto.randomUUID();
        try {
            if (!target) return { success: false, error: 'Invalid user or invite code provided' };

            const res: any = await api.post('/friends/request', { query: target });
            if (res?.error) {
                return { success: false, error: res.error };
            }
            return { success: true };
        } catch (error: any) {
            Logger.error('Failed to send friend request', { reqId, error: error?.message });
            return { success: false, error: error?.message || 'Failed to send friend request' };
        }
    },

    /**
     * Accept an incoming friend request
     */
    async acceptFriendRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
        const reqId = crypto.randomUUID();
        try {
            if (!requestId) return { success: false, error: 'Invalid request ID' };
            await api.post(`/friends/${requestId}/accept`);
            return { success: true };
        } catch (error: any) {
            Logger.error('Failed to accept request', { reqId, error: error?.message });
            return { success: false, error: error?.message || 'Failed to accept request' };
        }
    },

    /**
     * Decline / reject a friend request
     */
    async declineFriendRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
        const reqId = crypto.randomUUID();
        try {
            if (!requestId) return { success: false, error: 'Invalid request ID' };
            await api.post(`/friends/${requestId}/reject`);
            return { success: true };
        } catch (error: any) {
            Logger.error('Failed to decline friend request', { reqId, error: error?.message });
            return { success: false, error: error?.message || 'Failed to decline request' };
        }
    },

    /**
     * Get accepted friends list
     */
    async getFriends(): Promise<Friend[]> {
        const reqId = crypto.randomUUID();
        try {
            const res: any = await api.get('/friends');
            const friends = res?.friends || [];
            return friends.map((f: any) => ({
                id: f.id,
                user_id: f.user_id,
                friend_id: f.friend_id,
                status: f.status,
                created_at: f.created_at,
                friend: f.friend ? {
                    id: f.friend.id,
                    username: f.friend.username || f.friend.name,
                    avatar_url: f.friend.avatar,
                    level: f.friend.level
                } : (f.user ? {
                    id: f.user.id,
                    username: f.user.username || f.user.name,
                    avatar_url: f.user.avatar,
                    level: f.user.level
                } : undefined)
            }));
        } catch (error: any) {
            Logger.error('Failed to fetch friends', { reqId, error: error?.message });
            return [];
        }
    },

    /**
     * Get pending friend requests received by current user
     */
    async getPendingRequests(): Promise<Friend[]> {
        const reqId = crypto.randomUUID();
        try {
            const res: any = await api.get('/friends');
            const requests = res?.pending_requests || [];
            return requests.map((r: any) => ({
                id: r.id,
                user_id: r.user_id,
                friend_id: r.friend_id,
                status: r.status,
                created_at: r.created_at,
                friend: r.user ? {
                    id: r.user.id,
                    username: r.user.username || r.user.name,
                    avatar_url: r.user.avatar,
                    level: r.user.level
                } : undefined
            }));
        } catch (error: any) {
            Logger.error('Failed to fetch pending requests', { reqId, error: error?.message });
            return [];
        }
    },

    /**
     * Search for users
     */
    async searchUsers(query: string): Promise<Profile[]> {
        if (!query || query.length < 2) return [];

        const reqId = crypto.randomUUID();
        try {
            const res: any = await api.get('/leaderboard');
            const leaders = res?.leaderboard || [];
            const filtered = leaders.filter((u: any) => 
                (u.username && u.username.toLowerCase().includes(query.toLowerCase())) ||
                (u.name && u.name.toLowerCase().includes(query.toLowerCase()))
            );
            return filtered.map((u: any) => ({
                id: u.id,
                username: u.username || u.name,
                level: u.level || 1,
                role: 'kid',
                created_at: new Date().toISOString()
            }));
        } catch (error: any) {
            Logger.error('User search failed', { reqId, error: error?.message });
            return [];
        }
    }
};
