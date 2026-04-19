
import { supabase } from '../lib/supabase';
import { Friend, Profile } from '../types';
import { Logger } from './logger';
import { assertValidUUID, sanitizeSearchQuery } from '../utils/validation';

// ─── Typed row shape returned by getFriends PostgREST join ───────────────────
interface FriendProfileRow {
    id: string;
    username: string;
    avatar_url?: string;
    level?: number;
}

interface FriendshipRow {
    id: string;
    user_id: string;
    friend_id: string;
    status: string;
    created_at: string;
    sender: FriendProfileRow | null;
    receiver: FriendProfileRow | null;
}

/** Maps a raw friendship row to a Friend, picking the "other" user as .friend */
function mapFriendship(row: FriendshipRow, userId: string): Friend {
    const friendProfile = row.user_id === userId ? row.receiver : row.sender;
    return {
        id: row.id,
        user_id: row.user_id,
        friend_id: row.friend_id,
        status: row.status as Friend['status'],
        created_at: row.created_at,
        friend: friendProfile ?? undefined,
    };
}

// ─── SRE: Circuit Breaker & Timeout Resiliency ──────────────────────────────
class CircuitBreakerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CircuitBreakerError';
    }
}

/** Wraps a promise with a timeout to prevent hung connections from freezing the UI */
async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = 8000): Promise<T> {
    return Promise.race([
        Promise.resolve(promise),
        new Promise<T>((_, reject) => 
            setTimeout(() => reject(new CircuitBreakerError(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
}
// ─────────────────────────────────────────────────────────────────────────────

export const SocialService = {
    /**
     * Send a friend request to another user
     */
    async sendFriendRequest(friendId: string): Promise<{ success: boolean; error?: string }> {
        const reqId = crypto.randomUUID();
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            if (!friendId) return { success: false, error: 'Invalid friend ID provided' };

            // SEC-04: Validate UUID before embedding in .or() filter string
            assertValidUUID(friendId, 'friendId');
            
            // SEC-06: Secondary safety net against PostgREST injection
            // Aggressively strip everything except alphanumeric and hyphens
            const safeFriendId = friendId.replace(/[^a-f0-9-]/gi, '');

            const { data: { user } } = await withTimeout(supabase.auth.getUser());
            if (!user) throw new Error('Not authenticated');

            // Self-request guard
            if (safeFriendId === user.id) return { success: false, error: 'Cannot send request to yourself' };
            const { data: existing } = await withTimeout(supabase
                .from('friends')
                .select('id, status')
                .or(`and(user_id.eq.${user.id},friend_id.eq.${safeFriendId}),and(user_id.eq.${safeFriendId},friend_id.eq.${user.id})`)
                .maybeSingle());

            if (existing) {
                if (existing.status === 'blocked') return { success: false, error: 'Cannot send request' };
                if (existing.status === 'accepted') return { success: false, error: 'Already friends' };
                if (existing.status === 'pending') return { success: false, error: 'Request pending' };
            }

            const { error } = await withTimeout(supabase
                .from('friends')
                .insert({
                    user_id: user.id,
                    friend_id: safeFriendId,
                    status: 'pending'
                }));

            if (error) {
                // SEC-07: Handle Check-Then-Act duplicate insert race conditions
                if (error.code === '23505') { // Postgres unique violation (if constraint exists)
                    return { success: false, error: 'Request already exists' };
                }
                throw error;
            }
            return { success: true };
        } catch (error: any) {
            // SEC-08 & SRE: Mask raw errors and log correlation ID
            Logger.error('Failed to send friend request', { reqId, code: error?.code, name: error?.name });
            const isTimeout = error?.name === 'CircuitBreakerError';
            return { success: false, error: isTimeout ? 'Service temporarily unavailable, please try again.' : 'Failed to send request due to a server error' };
        }
    },

    /**
     * Accept a friend request.
     * IDOR-guarded: only the intended receiver (friend_id) may accept.
     */
    async acceptFriendRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
        const reqId = crypto.randomUUID();
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            if (!requestId) return { success: false, error: 'Invalid request ID' };
            
            const { data: { user } } = await withTimeout(supabase.auth.getUser());
            if (!user) return { success: false, error: 'Not authenticated' };

            const { data: request, error: fetchErr } = await withTimeout(supabase
                .from('friends')
                .select('id, friend_id, status')
                .eq('id', requestId)
                .single());

            if (fetchErr || !request) {
                return { success: false, error: 'Friend request not found' };
            }
            if (request.friend_id !== user.id) {
                Logger.warn('[Security] SocialService: IDOR attempt on acceptFriendRequest blocked', {
                    callerId: user.id, requestId,
                });
                void Logger.logSecurityEvent('unauthorized_access', 'high', {
                    action: 'accept_friend_request_idor', callerId: user.id, requestId,
                });
                return { success: false, error: 'Not authorized' };
            }
            if (request.status !== 'pending') {
                return { success: false, error: 'Request is no longer pending' };
            }

            // SEC-09: Atomic Compare-and-Swap (CAS) Update
            // Fixes TOCTOU race condition if another thread declines at the same time
            const { error, data: updatedObj } = await withTimeout(supabase
                .from('friends')
                .update({ status: 'accepted', updated_at: new Date().toISOString() })
                .eq('id', requestId)
                .eq('status', 'pending') // Enforce state hasn't changed concurrently
                .select('id'));

            if (error) throw error;
            
            if (!updatedObj || updatedObj.length === 0) {
                 return { success: false, error: 'Request was already processed' };
            }
            
            return { success: true };
        } catch (error: any) {
            Logger.error('Failed to accept request', { reqId, code: error?.code, name: error?.name });
            const isTimeout = error?.name === 'CircuitBreakerError';
            return { success: false, error: isTimeout ? 'Request timed out, please refresh.' : 'Failed to accept request due to a server error' };
        }
    },

    /**
     * Decline / ignore a friend request (soft-delete: sets status → 'declined').
     * IDOR-guarded: only the intended receiver (friend_id) may decline.
     */
    async declineFriendRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
        const reqId = crypto.randomUUID();
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            if (!requestId) return { success: false, error: 'Invalid request ID' };
            
            const { data: { user } } = await withTimeout(supabase.auth.getUser());
            if (!user) return { success: false, error: 'Not authenticated' };

            const { data: request, error: fetchErr } = await withTimeout(supabase
                .from('friends')
                .select('id, friend_id, status')
                .eq('id', requestId)
                .single());

            if (fetchErr || !request) {
                return { success: false, error: 'Friend request not found' };
            }
            if (request.friend_id !== user.id) {
                Logger.warn('[Security] SocialService: IDOR attempt on declineFriendRequest blocked', {
                    callerId: user.id, requestId,
                });
                void Logger.logSecurityEvent('unauthorized_access', 'high', {
                    action: 'decline_friend_request_idor', callerId: user.id, requestId,
                });
                return { success: false, error: 'Not authorized' };
            }
            if (request.status !== 'pending') {
                return { success: false, error: 'Request is no longer pending' };
            }

            // SEC-09: Atomic Compare-and-Swap (CAS) Update
            // Fixes TOCTOU race condition if another thread accepts at the same time
            const { error, data: updatedObj } = await withTimeout(supabase
                .from('friends')
                .update({ status: 'declined', updated_at: new Date().toISOString() })
                .eq('id', requestId)
                .eq('status', 'pending') // Enforce state hasn't changed concurrently
                .select('id'));

            if (error) throw error;
            
            if (!updatedObj || updatedObj.length === 0) {
                 return { success: false, error: 'Request was already processed' };
            }
            
            return { success: true };
        } catch (error: any) {
            Logger.error('Failed to decline friend request', { reqId, code: error?.code, name: error?.name });
            const isTimeout = error?.name === 'CircuitBreakerError';
            return { success: false, error: isTimeout ? 'Request timed out, please try again.' : 'Failed to decline request due to a server error' };
        }
    },

    /**
     * Get accepted friends list.
     * Uses explicit column projection (no select('*')) and a typed mapper
     * to avoid forced `as Friend` casts and leaked `any` types.
     */
    async getFriends(): Promise<Friend[]> {
        const reqId = crypto.randomUUID();
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data: { user } } = await withTimeout(supabase.auth.getUser());
            if (!user) return [];

            const { data: friendships, error } = await withTimeout(supabase
                .from('friends')
                .select(`
                    id, user_id, friend_id, status, created_at,
                    sender:user_id ( id, username, avatar_url, level ),
                    receiver:friend_id ( id, username, avatar_url, level )
                `)
                .eq('status', 'accepted')
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`));

            if (error) throw error;

            return (friendships as unknown as FriendshipRow[]).map(f => mapFriendship(f, user.id));

        } catch (error: any) {
            Logger.error('Failed to fetch friends', { reqId, code: error?.code, name: error?.name });
            if (error?.name === 'CircuitBreakerError') {
                Logger.warn('getFriends degraded: returning empty list due to timeout', { reqId });
            }
            return [];
        }
    },

    /**
     * Get pending friend requests received by the current user.
     * Uses explicit column projection and typed mapper.
     */
    async getPendingRequests(): Promise<Friend[]> {
        const reqId = crypto.randomUUID();
        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data: { user } } = await withTimeout(supabase.auth.getUser());
            if (!user) return [];

            const { data: requests, error } = await withTimeout(supabase
                .from('friends')
                .select(`
                    id, user_id, friend_id, status, created_at,
                    sender:user_id ( id, username, avatar_url, level )
                `)
                .eq('friend_id', user.id)
                .eq('status', 'pending'));

            if (error) throw error;

            // For pending requests, the receiver field is null (we didn't select it),
            // but mapFriendship handles it correctly: sender is the "other" person.
            return (requests as unknown as FriendshipRow[]).map(r => ({
                ...mapFriendship(r, user.id),
                // Ensure friend always points to the sender for pending requests
                friend: r.sender ?? undefined,
            }));

        } catch (error: any) {
            Logger.error('Failed to fetch pending requests', { reqId, code: error?.code, name: error?.name });
            if (error?.name === 'CircuitBreakerError') {
                Logger.warn('getPendingRequests degraded: returning empty list due to timeout', { reqId });
            }
            return [];
        }
    },

    /**
     * Search for users by username.
     * Minimum 3 characters required; query is sanitized before use.
     */
    async searchUsers(query: string): Promise<Profile[]> {
        if (!query || query.length < 3) return [];

        // SEC-05: Sanitise before embedding in wildcard expression
        const safeQuery = sanitizeSearchQuery(query);
        if (safeQuery.length < 3) return [];

        const reqId = crypto.randomUUID();

        try {
            if (!supabase) throw new Error('Supabase not initialized');
            const { data, error } = await withTimeout(supabase
                .from('profiles')
                // ✅ PRIVACY FIX: Column allowlist instead of select('*').
                .select('id, username, level, role, created_at')
                .ilike('username', `%${safeQuery}%`)
                .limit(10));

            if (error) throw error;
            return data as Profile[];
        } catch (error: any) {
            Logger.error('User search failed', { reqId, code: error?.code, name: error?.name });
             if (error?.name === 'CircuitBreakerError') {
                Logger.warn('searchUsers degraded: returning empty list due to timeout', { reqId });
            }
            return [];
        }
    }
};
