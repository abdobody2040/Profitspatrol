
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { Users, Search, UserPlus, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FriendSearch from './FriendSearch';
import FriendRequestList from './FriendRequestList';
import BusinessCard from './BusinessCard';
import { ReferralPanel } from './ReferralPanel';
import { useSocialStore } from "../../../store/socialStore";

const SocialHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'card' | 'friends' | 'search' | 'requests' | 'refer'>('card');
    const { pendingRequests, fetchFriends, fetchPendingRequests, friends } = useSocialStore();
    const { t } = useTranslation();

    // Initial load
    useEffect(() => {
        fetchFriends();
        fetchPendingRequests();
    }, [fetchFriends, fetchPendingRequests]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shrink-0">
                <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                    <Users className="text-purple-200" /> {t('socialHub.title')}
                </h2>
                <p className="text-purple-100 text-sm font-medium">{t('socialHub.subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
                <button
                    onClick={() => setActiveTab('card')}
                    className={`flex-1 py-4 font-bold text-sm transition-colors relative flex items-center justify-center gap-1.5 ${activeTab === 'card'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <CreditCard size={14} /> My Card
                    {activeTab === 'card' && (
                        <motion.div
                            layoutId="social-tab"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`flex-1 py-4 font-bold text-sm transition-colors relative ${activeTab === 'friends'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    {t('socialHub.tab_friends')} ({friends.length})
                    {activeTab === 'friends' && (
                        <motion.div
                            layoutId="social-tab"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex-1 py-4 font-bold text-sm transition-colors relative ${activeTab === 'search'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <Search size={16} /> {t('socialHub.tab_find')}
                    </span>
                    {activeTab === 'search' && (
                        <motion.div
                            layoutId="social-tab"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 py-4 font-bold text-sm transition-colors relative ${activeTab === 'requests'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        {t('socialHub.tab_requests')}
                        {pendingRequests.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                {pendingRequests.length}
                            </span>
                        )}
                    </span>
                    {activeTab === 'requests' && (
                        <motion.div
                            layoutId="social-tab"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('refer')}
                    className={`flex-1 py-4 font-bold text-sm transition-colors relative flex items-center justify-center gap-1.5 ${activeTab === 'refer'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    🎁 Get 500 Coins
                    {activeTab === 'refer' && (
                        <motion.div
                            layoutId="social-tab"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"
                        />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 relative bg-gray-50 dark:bg-gray-900/50">
                <AnimatePresence mode="wait">
                    {activeTab === 'card' && (
                        <motion.div
                            key="card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <BusinessCard />
                        </motion.div>
                    )}

                    {activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full overflow-y-auto"
                        >
                            {friends.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                    <UserPlus size={48} className="mb-4 opacity-50" />
                                    <p className="font-bold">{t('socialHub.no_friends')}</p>
                                    <p className="text-sm mt-2">{t('socialHub.no_friends_desc')}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {friends.map(f => (
                                        <div key={f.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                                {f.friend?.avatar_url ? (
                                                    <img src={f.friend.avatar_url} alt={f.friend.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-bold text-xl">
                                                        {f.friend?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-200">
                                                    {f.friend?.username || t('socialHub.unknown_user')}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {t('socialHub.tycoon_since')} {new Date(f.created_at).getFullYear()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <FriendSearch />
                        </motion.div>
                    )}

                    {activeTab === 'requests' && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <FriendRequestList />
                        </motion.div>
                    )}

                    {activeTab === 'refer' && (
                        <motion.div
                            key="refer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <ReferralPanel />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SocialHub;
