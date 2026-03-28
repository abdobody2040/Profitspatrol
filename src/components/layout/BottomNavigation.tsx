import React from 'react';
import { useAppStore } from '../../store';
import { UserRole } from '../../types';
import { LayoutDashboard, Compass, Store, Gamepad2, Settings, Trophy, Newspaper, Building2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BottomNavigation = () => {
    const { user, openModal } = useAppStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Only render for kids (parents have a side-nav or top-nav via Layout)
    if (user?.role !== UserRole.KID) return null;

    // Don't show on games or scenarios where we want full immersion
    if (['/games', '/the-tank', '/scenarios'].some(path => location.pathname.startsWith(path))) {
        return null;
    }

    const spinReady = user.lastSpinDate !== new Date().toISOString().slice(0, 10);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)] border-t border-gray-100 dark:border-gray-700 pb-safe">
            <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* 1. Map (Home) */}
                <button 
                    onClick={() => navigate('/map')} 
                    className={`flex flex-col items-center justify-center w-16 h-16 ${location.pathname === '/map' ? 'text-kid-accent' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'}`}
                >
                    <Compass size={24} strokeWidth={location.pathname === '/map' ? 3 : 2} />
                    <span className="text-[10px] font-bold mt-1">Map</span>
                </button>

                {/* 2. Leaderboard */}
                <button 
                    onClick={() => openModal('weeklyChallenge')} 
                    className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-gray-600 dark:text-gray-500"
                >
                    <Trophy size={24} strokeWidth={2} />
                    <span className="text-[10px] font-bold mt-1">Quests</span>
                </button>

                {/* 3. Primary Action (Spin / Avatar) */}
                <div className="relative -top-6">
                    <button 
                        onClick={() => openModal('spin')} 
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transform transition-transform hover:scale-105 active:scale-95 ${spinReady ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600'}`}
                    >
                        <span className="text-2xl">🎰</span>
                    </button>
                    {spinReady && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 z-10"></div>
                    )}
                </div>

                {/* 4. News / Pulse */}
                <button 
                    onClick={() => openModal('bizPulse')} 
                    className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-gray-600 dark:text-gray-500"
                >
                    <Newspaper size={24} strokeWidth={2} />
                    <span className="text-[10px] font-bold mt-1">News</span>
                </button>

                {/* 5. Avatar / Profile */}
                <button 
                    onClick={() => openModal('avatar')} 
                    className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-gray-600 dark:text-gray-500"
                >
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mb-1">
                        <span className="text-xs">💅</span>
                    </div>
                    <span className="text-[10px] font-bold">Avatar</span>
                </button>

            </div>
        </div>
    );
};
