import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Gamepad2, Zap, User, Bot, Layers, Mic, BookOpen, X, Sparkles } from "lucide-react";
import { useAgeMode } from '../hooks/useAgeMode';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../../store';
import { useGameStore } from '../../../store/gameStore';

interface BottomNavProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  hasUnfinishedMissions?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, hasUnfinishedMissions = true }) => {
  const { playTap, isArabic } = useAgeMode();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeGameId } = useGameStore();
  const { activeScenario, openModal } = useAppStore();

  const [playHubOpen, setPlayHubOpen] = useState(false);

  // Hide in active mini-games or interactive scenarios so game controls are never covered
  if (activeGameId || activeScenario) {
    return null;
  }

  const currentTab = (() => {
    const raw = activeTab || '';
    if (raw === 'map' || (!raw && location.pathname.includes('/map'))) return 'map';
    if (['games', 'play', 'arcade', 'the-tank', 'the_tank', 'real-estate'].includes(raw) || (!raw && (location.pathname.includes('/games') || location.pathname.includes('/the-tank') || location.pathname.includes('/real-estate')))) return 'play';
    if (['assignments', 'missions', 'quests', 'tasks'].includes(raw) || (!raw && (location.pathname.includes('/assignments') || location.pathname.includes('/missions')))) return 'missions';
    if (['profile', 'me'].includes(raw) || (!raw && location.pathname.includes('/profile'))) return 'me';
    return raw || 'map';
  })();

  const handleTabClick = (tabId: string, route: string) => {
    playTap();
    if (tabId === 'play') {
      // Toggle play drawer or navigate
      if (location.pathname === '/games') {
        setPlayHubOpen(prev => !prev);
        return;
      }
    }
    setPlayHubOpen(false);
    if (onNavigate) {
      onNavigate(tabId);
    }
    navigate(route);
  };

  interface NavItemDef {
    id: string;
    label: string;
    icon: any;
    route: string;
    hasDot?: boolean;
  }

  // Exactly 4 tabs only: الخريطة (Map)، العب (Play)، المهام (Missions)، ملفي (Me)
  const navItems: NavItemDef[] = [
    { id: 'map', label: isArabic ? 'الخريطة' : t('bottomNav.map', { defaultValue: 'Map' }), icon: Map, route: '/map' },
    { id: 'play', label: isArabic ? 'العب' : t('nav.games', { defaultValue: 'Play' }), icon: Gamepad2, route: '/games' },
    { id: 'missions', label: isArabic ? 'المهام' : t('bottomNav.quests', { defaultValue: 'Missions' }), icon: Zap, route: '/assignments', hasDot: hasUnfinishedMissions },
    { id: 'me', label: isArabic ? 'ملفي' : t('bottomNav.profile', { defaultValue: 'Me' }), icon: User, route: '/profile' }
  ];

  const playHubItems = [
    { id: 'spin', label: isArabic ? 'عجلة الحظ اليومية' : 'Daily Spin', icon: Sparkles, desc: isArabic ? 'جوائز يومية مجانية' : 'Free daily rewards', action: () => openModal('spin') },
    { id: 'arcade', label: isArabic ? 'صالة الألعاب' : 'Arcade Games', icon: Gamepad2, desc: isArabic ? '50 لعبة أعمال' : '50 Business simulations', route: '/games' },
    { id: 'library', label: isArabic ? 'المكتبة' : 'Library', icon: BookOpen, desc: isArabic ? '198 كتاباً مبسطاً' : '198 Summarized books', route: '/library' },
    { id: 'debate', label: isArabic ? 'حلبة النقاش' : 'Debate Dojo', icon: Bot, desc: isArabic ? 'طور التفكير المنطقي' : 'Critical logic practice', route: '/debate' },
    { id: 'cards', label: isArabic ? 'أكاديمية البطاقات' : 'Card Academy', icon: Layers, desc: isArabic ? 'بطاقات المفاهيم' : 'Finance flashcards', route: '/card-academy' },
    { id: 'tank', label: isArabic ? 'المستثمر الذكي' : 'The Tank', icon: Mic, desc: isArabic ? 'اعرض فكرتك' : 'Pitch your startup', route: '/the-tank' }
  ];

  return (
    <>
      {/* Play Hub Modal Drawer (if opened from Play) */}
      <AnimatePresence>
        {playHubOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-0 bottom-24 z-50 max-w-lg mx-auto p-4 px-6"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[24px] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-[#F97316]" />
                  <span>{isArabic ? 'مركز الألعاب والتحديات' : 'Play & Learning Hub'}</span>
                </h3>
                <button
                  onClick={() => setPlayHubOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
                {playHubItems.map((tile) => {
                  const TileIcon = tile.icon;
                  return (
                    <motion.button
                      key={tile.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playTap();
                        setPlayHubOpen(false);
                        if ((tile as any).action) {
                          (tile as any).action();
                        } else if ((tile as any).route) {
                          navigate((tile as any).route);
                        }
                      }}
                      className="flex items-center gap-3.5 p-3 rounded-[20px] bg-slate-50 hover:bg-orange-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-start transition-all"
                    >
                      <div className="w-11 h-11 rounded-[16px] bg-gradient-to-tr from-[#FF8A00] to-[#FACC15] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <TileIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-800 dark:text-white text-[15px]">
                          {tile.label}
                        </div>
                        <div className="text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {tile.desc}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bottom Navigation Bar: Exactly 4 Tabs */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)] h-[72px] sm:h-[80px]"
      >
        <div className="max-w-xl mx-auto h-full flex items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTabClick(item.id, item.route)}
                className={`relative flex flex-col items-center justify-center transition-all select-none rounded-[20px] min-h-[64px] min-w-[64px] px-3 ${
                  isActive
                    ? 'text-[#F97316]'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-orange-50 dark:bg-orange-950/40 rounded-[20px] -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative">
                  {/* Icon ~28px */}
                  <Icon
                    className={`w-7 h-7 ${isActive ? 'stroke-[2.6px]' : 'stroke-2'}`}
                  />
                  {/* Small red dot for unfinished missions */}
                  {item.hasDot && (
                    <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                  )}
                </div>

                {/* Label 14px+ */}
                <span
                  className="tracking-tight font-black leading-tight mt-1 text-[14px]"
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
