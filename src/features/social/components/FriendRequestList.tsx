

import React, { useEffect } from 'react';
import { useAppStore } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { UserPlus, X, Check, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from "../../../store/socialStore";

const FriendRequestList: React.FC = () => {
    const { pendingRequests, declineFriendRequest, fetchPendingRequests, loadingStates, acceptFriendRequest } = useSocialStore();
    const { user } = useAppStore();

    const isLoading = loadingStates.requests;

    useEffect(() => {
        // Initial load
        fetchPendingRequests();

        if (!supabase || !user?.id) return;

        // ✅ R6d: Supabase realtime subscription replaces the 30s polling interval.
        // Replication is enabled on the `friends` table (confirmed in DB Publications).
        // This pushes updates instantly without needing a timer.
        const channel = supabase
            .channel(`friend-requests:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'friends',
                    filter: `friend_id=eq.${user.id}`,
                },
                () => {
                    fetchPendingRequests();
                }
            )
            .subscribe();

        return () => {
            supabase?.removeChannel(channel);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleAccept = async (requestId: string) => {
        await acceptFriendRequest(requestId);
    };

    const handleIgnore = async (requestId: string) => {
        await declineFriendRequest(requestId);
    };

    if (pendingRequests.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
                <Users size={48} className="mb-4 opacity-50" />
                <p className="font-bold">No pending requests</p>
                <p className="text-sm mt-2">All caught up!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 px-2">
                Pending Requests ({pendingRequests.length})
            </h3>

            <AnimatePresence>
                {pendingRequests.map(request => (
                    <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shrink-0">
                                {request.friend?.avatar_url ? (
                                    <img src={request.friend.avatar_url} alt={request.friend.username} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    (request.friend?.username?.[0] || '?').toUpperCase()
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    {request.friend?.username || 'Unknown User'}
                                    <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Pending</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Sent {new Date(request.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => handleAccept(request.id)}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                <Check size={16} /> Accept
                            </button>
                            <button
                                onClick={() => handleIgnore(request.id)}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <X size={16} /> Ignore
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FriendRequestList;
