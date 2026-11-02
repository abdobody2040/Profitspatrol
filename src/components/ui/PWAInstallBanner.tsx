import React, { useState, useEffect } from 'react';
import { Download } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Add type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export const PWAInstallBanner: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Only show if we haven't dismissed it recently
        const dismissed = localStorage.getItem('pwa_prompt_dismissed');
        if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
            return; // Don't annoy user if dismissed within 7 days
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Cleanup
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        
        // We no longer need the prompt. Clear it up.
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 md:bottom-6 start-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[200]"
                >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 border-2 border-indigo-500/50 flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                            <Download className="text-indigo-600 dark:text-indigo-400" size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-gray-900 dark:text-white text-sm">
                                {t('pwa.install_title', 'Install Profits Patrol')}
                            </h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-tight">
                                {t('pwa.install_desc', 'Get the native app experience!')}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                            <button
                                onClick={handleInstallClick}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-500/30 active:scale-95 transition-all"
                            >
                                {t('pwa.install_button', 'Install')}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="touch-target text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-[10px] font-black uppercase tracking-tighter"
                            >
                                {t('pwa.dismiss_button', 'Not Now')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
