

import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from "../../../store/socialStore";

const FriendSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const { searchResults, searchUsers, clearSearchResults, sendFriendRequest, friends, loadingStates } = useSocialStore();
    const [requestSent, setRequestSent] = useState<Record<string, boolean>>({});

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.length >= 3) {
            searchUsers(query);
        }
    };

    const handleSendRequest = async (userId: string) => {
        const success = await sendFriendRequest(userId);
        if (success) {
            setRequestSent(prev => ({ ...prev, [userId]: true }));
        }
    };

    // Check if a user is already a friend
    const isFriend = (userId: string) => {
        return friends.some(f => f.friend_id === userId || f.user_id === userId);
    };

    return (
        <div className="h-full flex flex-col">
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for username..."
                        className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 pl-12 pr-4 py-4 rounded-xl border-2 border-transparent focus:border-purple-500 outline-none transition-all shadow-sm"
                        // ✅ SECURITY FIX: Cap at 30 chars (username registration limit)
                        // prevents oversized queries from hitting Supabase ilike scan
                        maxLength={30}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    {query.length > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                clearSearchResults();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>

            <div className="flex-1 overflow-y-auto">
                {loadingStates.searching ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
                        <p>Searching...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {searchResults.map(user => {
                                const alreadySent = requestSent[user.id];
                                const alreadyFriends = isFriend(user.id);

                                return (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xl">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    (user.username?.[0] || '?').toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-100">{user.username}</div>
                                                <div className="text-xs text-gray-500">KidCap Tycoon</div>
                                            </div>
                                        </div>

                                        <div>
                                            {alreadyFriends ? (
                                                <span className="text-green-500 font-bold text-sm px-4 flex items-center gap-1">
                                                    <Check size={16} /> Friends
                                                </span>
                                            ) : alreadySent ? (
                                                <span className="text-gray-400 font-bold text-sm px-4 flex items-center gap-1">
                                                    <Check size={16} /> Sent
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSendRequest(user.id)}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                                >
                                                    <UserPlus size={16} /> Add
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {query.length >= 3 && searchResults.length === 0 && !loadingStates.searching && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No tycoons found with that name.</p>
                            </div>
                        )}

                        {query.length < 3 && searchResults.length === 0 && (
                            <div className="text-center py-12 text-gray-400 opacity-60">
                                <Search size={48} className="mx-auto mb-4" />
                                <p>Type at least 3 characters to search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendSearch;
