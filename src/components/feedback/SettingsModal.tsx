import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { useTranslation } from 'react-i18next';
import { X, Volume2, VolumeX, Moon, Sun, Download, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrivacySettings } from '../../features/settings/components/PrivacySettings';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserSettings, deleteUser, exportUserData, logout } = useAppStore();
    const { t } = useTranslation();
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!isOpen || !user) return null;

    const handleExport = () => {
        const data = exportUserData(user.id);
        if (!data) return;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profitspatrol_data_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDelete = () => {
        if (confirmDelete) {
            deleteUser(user.id);
            onClose(); // Logout happens in store
        } else {
            setConfirmDelete(true);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded-xl text-gray-700 dark:text-gray-200">
                                    <ShieldCheck size={24} />
                                </div>
                                <h2 className="text-xl font-black text-gray-800 dark:text-white">{t('settings.title', { defaultValue: 'Settings & Privacy' })}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                            {/* Preferences Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('settings.preferences', { defaultValue: 'APP PREFERENCES' })}</h3>

                                {/* Sound Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        {user.settings.soundEnabled ? <Volume2 className="text-blue-500" /> : <VolumeX className="text-gray-400" />}
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('settings.sound', { defaultValue: 'Sound Effects' })}</span>
                                    </div>
                                    <button
                                        onClick={() => updateUserSettings({ soundEnabled: !user.settings.soundEnabled })}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${user.settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${user.settings.soundEnabled ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                {/* Music Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">♫</div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('settings.music', { defaultValue: 'Background Music' })}</span>
                                    </div>
                                    <button
                                        onClick={() => updateUserSettings({ musicEnabled: !user.settings.musicEnabled })}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${user.settings.musicEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${user.settings.musicEnabled ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Data Privacy Section (GDPR) - Only for non-kid users */}
                            {user.role !== 'KID' && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck size={14} />
                                        {t('settings.privacy_zone', { defaultValue: 'DATA & PRIVACY (GDPR)' })}
                                    </h3>

                                    {/* Import PrivacySettings component */}
                                    <PrivacySettings />
                                </div>
                            )}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
