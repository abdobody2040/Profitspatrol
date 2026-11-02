import React, { useEffect } from 'react';
import { useAppStore } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { X, Check, Users } from "lucide-react";
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
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-gray-800 p-5 rounded-[24px] shadow-lg border-b-[6px] border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-inner border-2 border-white dark:border-gray-700">
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

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => handleAccept(request.id)}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none btn-juicy bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_0_0_#16a34a] hover:shadow-[0_2px_0_0_#16a34a] hover:translate-y-[2px]"
                            >
                                <Check size={18} /> Accept
                            </button>
                            <button
                                onClick={() => handleIgnore(request.id)}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none btn-juicy bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_0_0_#d1d5db] dark:shadow-[0_4px_0_0_#374151] hover:shadow-[0_2px_0_0_#d1d5db] dark:hover:shadow-[0_2px_0_0_#374151] hover:translate-y-[2px]"
                            >
                                <X size={18} /> Ignore
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FriendRequestList;
