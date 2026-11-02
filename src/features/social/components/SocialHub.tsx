import React, { useState, useEffect } from 'react';
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
        <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl border-4 border-white dark:border-gray-800 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shrink-0 shadow-md z-10 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <h2 className="text-3xl font-black mb-1 flex items-center gap-3 relative z-10 drop-shadow-md">
                    <Users className="text-purple-200" /> {t('socialHub.title')}
                </h2>
                <p className="text-purple-100 text-sm font-medium">{t('socialHub.subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50 dark:bg-gray-800 p-3 gap-2 shrink-0 shadow-inner z-0 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('card')}
                    className={`flex-1 min-w-[120px] py-3 px-2 font-black text-sm rounded-[20px] transition-all duration-300 relative flex items-center justify-center gap-2 ${activeTab === 'card'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg border-b-[4px] border-purple-200 dark:border-purple-900 scale-105'
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                >
                    <CreditCard size={18} /> My Card
                </button>
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`flex-1 min-w-[120px] py-3 px-2 font-black text-sm rounded-[20px] transition-all duration-300 relative flex items-center justify-center gap-2 ${activeTab === 'friends'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg border-b-[4px] border-purple-200 dark:border-purple-900 scale-105'
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                >
                    <Users size={18} /> {t('socialHub.tab_friends')} <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs">{friends.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex-1 min-w-[120px] py-3 px-2 font-black text-sm rounded-[20px] transition-all duration-300 relative flex items-center justify-center gap-2 ${activeTab === 'search'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg border-b-[4px] border-purple-200 dark:border-purple-900 scale-105'
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                >
                    <Search size={18} /> {t('socialHub.tab_find')}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 min-w-[120px] py-3 px-2 font-black text-sm rounded-[20px] transition-all duration-300 relative flex items-center justify-center gap-2 ${activeTab === 'requests'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg border-b-[4px] border-purple-200 dark:border-purple-900 scale-105'
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                >
                    <UserPlus size={18} /> {t('socialHub.tab_requests')}
                    {pendingRequests.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pulse">
                            {pendingRequests.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('refer')}
                    className={`flex-1 min-w-[120px] py-3 px-2 font-black text-sm rounded-[20px] transition-all duration-300 relative flex items-center justify-center gap-2 ${activeTab === 'refer'
                        ? 'bg-white dark:bg-gray-700 text-yellow-500 dark:text-yellow-400 shadow-lg border-b-[4px] border-yellow-200 dark:border-yellow-900 scale-105'
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                >
                    🎁 Get 500 Coins
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
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border-4 border-dashed border-gray-200 dark:border-gray-700 p-8">
                                    <UserPlus size={64} className="mb-4 text-purple-300 dark:text-purple-900 animate-pulse" />
                                    <p className="font-black text-xl text-gray-500 dark:text-gray-400">{t('socialHub.no_friends')}</p>
                                    <p className="text-sm font-bold text-gray-400 mt-2 max-w-sm mx-auto">{t('socialHub.no_friends_desc')}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {friends.map((f, i) => (
                                        <motion.div 
                                            key={f.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white dark:bg-gray-800 p-5 rounded-[24px] shadow-lg border-b-[6px] border-gray-200 dark:border-gray-700 flex items-center gap-5 cursor-pointer"
                                        >
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
                                        </motion.div>
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
