import React from 'react';
import { useAppStore } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationCenterProps {
    position?: 'top' | 'bottom';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ position = 'bottom' }) => {
    const { notifications, markAsRead, clearNotifications } = useAppStore();
    const unreadCount = notifications.filter(n => !n.read).length;
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="text-green-500" size={18} />;
            case 'WARNING': return <AlertTriangle className="text-amber-500" size={18} />;
            case 'ERROR': return <AlertCircle className="text-red-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
                aria-label="Notifications"
            >
                <Bell size={24} className="text-gray-500 dark:text-gray-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-[100]" 
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.95 }}
                            className={`absolute md:start-0 end-0 ${position === 'top' ? 'mt-2 top-full' : 'bottom-full mb-2'} w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[101] overflow-hidden`}
                        >
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                                <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2">
                                    <Bell size={18} className="text-blue-500" /> {t('common.notifications', 'Notifications')}
                                </h3>
                                <button 
                                    onClick={clearNotifications}
                                    className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {t('common.clear_all', 'Clear All')}
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-sm font-bold">All caught up!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n.id}
                                                onClick={() => markAsRead(n.id)}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-black text-gray-800 dark:text-gray-100 leading-tight">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    {!n.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            {/* Global Toast for newest notification */}
            <AnimatePresence>
                {notifications.length > 0 && !notifications[0].read && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.8 }}
                        className="fixed bottom-24 end-4 md:bottom-8 md:end-8 z-[200] bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700 dark:border-gray-200 min-w-[280px] max-w-sm pointer-events-none md:pointer-events-auto"
                    >
                        <div className="shrink-0">{getIcon(notifications[0].type)}</div>
                        <div className="flex-1">
                            <p className="text-xs font-black leading-tight">{notifications[0].title}</p>
                            <p className="text-[10px] opacity-80 line-clamp-1">{notifications[0].message}</p>
                        </div>
                        <X size={14} className="opacity-40" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
