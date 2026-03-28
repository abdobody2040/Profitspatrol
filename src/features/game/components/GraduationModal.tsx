import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { AppState } from '../../../store/types';
import { Trophy, Star, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundService } from '../../../lib/sound';

const GraduationModal: React.FC = () => {
    const { t } = useTranslation();
    const { user, showGraduationModal } = useAppStore((state: AppState) => ({
        user: state.user,
        showGraduationModal: state.showGraduationModal
    }));

    // Local override to hide if the user dismisses it before the store syncs
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showGraduationModal && user?.role === 'KID') {
            setIsVisible(true);

            // Grand celebration sounds
            if (user.settings.soundEnabled) {
                SoundService.playLevelUp();
                setTimeout(() => SoundService.playSuccess(), 500);
            }

            // Confetti Cannon
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }, [showGraduationModal, user]);

    if (!isVisible || !user) return null;

    const onClose = () => {
        setIsVisible(false);
        // Dispatch to store if we had `closeGraduationModal` action
        // For now, we just rely on local state since it only fires once anyway
        if (user.settings.soundEnabled) SoundService.playClick();
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 p-1 rounded-[3rem] shadow-2xl max-w-2xl w-full animate-in zoom-in duration-500">
                <div className="bg-white dark:bg-gray-900 rounded-[2.8rem] p-10 text-center relative overflow-hidden">

                    {/* Decorative Background Rays */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <div className="w-[800px] h-[800px] bg-yellow-400 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        {/* Golden Trophy Icon */}
                        <div className="mx-auto w-32 h-32 bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white dark:border-gray-800">
                            <Trophy className="text-yellow-600 drop-shadow-md" size={64} />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">
                            Congratulations!
                        </h2>

                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
                            <span className="font-bold text-kid-primary">{user.name}</span>, you have reached <span className="text-yellow-500 font-bold uppercase tracking-wider">Level 10 (Tycoon)</span>. You are officially a Profits Patrol Alumni!
                        </p>

                        {/* Unlocked Rewards List */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 mb-8 mt-6 max-w-md mx-auto">
                            <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">
                                Unlocked Alumni Rewards
                            </h3>

                            <div className="flex flex-col gap-3 text-left">
                                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
                                    <Shield className="text-yellow-500" size={24} />
                                    <span className="font-bold text-gray-700 dark:text-white">Alumni Gold Badge</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
                                    <Star className="text-blue-500" size={24} />
                                    <span className="font-bold text-gray-700 dark:text-white">Alumni HQ Trophy (Furniture)</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="bg-gray-900 text-white dark:bg-yellow-400 dark:text-gray-900 px-8 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto shadow-xl"
                        >
                            Claim Rewards <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraduationModal;
