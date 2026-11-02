import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Menu,
  Settings as SettingsIcon,
  LogOut,
  X,
  Map as MapIcon,
  Gamepad2,
  Zap,
  BookOpen,
  Play,
  Layers,
  Bot,
  Mic,
  Building2,
  ShoppingBag,
  Trophy,
  User,
  UserCheck,
  School,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useAgeMode } from '../hooks/useAgeMode';
import { useAppStore } from '../../../store';
import { formatCompactNumber } from '../../../utils/formatters';
import CoinIcon from '../../../components/ui/CoinIcon';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getToday } from '../../../utils/gameUtils';
import SettingsModal from '../../../components/feedback/SettingsModal';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import LanguageToggle from '../../../components/ui/LanguageToggle';
import { UserRole } from '../../../types';

import EnergyBar from '../../game/components/EnergyBar';

export interface TopBarProps {
  minimal?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ minimal = false }) => {
  const { playTap } = useAgeMode();
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isMinimal = minimal || window.location.pathname.includes('/map');

  const coins = user?.ppTokens ?? 50;
  const hearts = Math.min(5, Math.max(0, user?.energy ?? 5));
  const stars = user?.completedLessonIds?.length ?? 0;
  const isFounderOrUnlimited = user?.subscriptionTier === 'founder' || user?.subscriptionTier === 'tycoon';
  const spinReady = user?.lastSpinDate !== getToday();

  const handleLogout = () => {
    playTap();
    if (window.confirm(isArabic ? 'هل تريد بالتأكيد تسجيل الخروج؟' : 'Are you sure you want to sign out?')) {
      logout();
      navigate('/login');
    }
  };

  const navSections = [
    {
      group: isArabic ? '🎓 التعلم والمهام' : '🎓 Learn & Missions',
      items: [
        { label: isArabic ? 'خارطة المغامرة' : 'Adventure Map', icon: MapIcon, route: '/map', color: 'from-amber-400 to-orange-500' },
        { label: isArabic ? 'المهام والتحديات' : 'Missions & Tasks', icon: Zap, route: '/assignments', color: 'from-blue-500 to-indigo-600' },
        { label: isArabic ? 'صالة الألعاب (50 محطة)' : 'Arcade Games', icon: Gamepad2, route: '/games', color: 'from-pink-500 to-rose-600' },
        { label: isArabic ? 'استوديو الفيديوهات' : 'Videos Studio', icon: Play, route: '/videos', color: 'from-purple-500 to-indigo-500' },
        { label: isArabic ? 'المكتبة (198 كتاباً)' : 'Library Books', icon: BookOpen, route: '/library', color: 'from-emerald-400 to-teal-600' },
        { label: isArabic ? 'أكاديمية البطاقات' : 'Card Academy', icon: Layers, route: '/card-academy', color: 'from-cyan-400 to-blue-500' },
        { label: isArabic ? 'حلبة النقاش' : 'Debate Dojo', icon: Bot, route: '/debate', color: 'from-violet-500 to-purple-600' },
      ]
    },
    {
      group: isArabic ? '🚀 عالم الريادة والاستثمار' : '🚀 Venture & Empire',
      items: [
        { label: isArabic ? 'المستثمر الذكي' : 'The Tank', icon: Mic, route: '/the-tank', color: 'from-orange-500 to-amber-600' },
        { label: isArabic ? 'إمبراطورية العقارات' : 'Real Estate', icon: Building2, route: '/real-estate', color: 'from-emerald-500 to-teal-700' },
        { label: isArabic ? 'متجر باترول' : 'Patrol Store', icon: ShoppingBag, route: '/store', color: 'from-yellow-400 to-orange-500' },
        { label: isArabic ? 'لوحة الشرف' : 'Leaderboard', icon: Trophy, route: '/leaderboard', color: 'from-amber-500 to-yellow-600' },
      ]
    },
    {
      group: isArabic ? '👨‍👩‍👧 البوابات والأدوار' : '👨‍👩‍👧 Portals & Roles',
      items: [
        { label: isArabic ? 'ملفي الشخصي' : 'My Profile', icon: User, route: '/profile', color: 'from-blue-400 to-cyan-600' },
        { label: isArabic ? 'بوابة أولياء الأمور' : 'Parents Portal', icon: UserCheck, route: '/dashboard', color: 'from-indigo-500 to-purple-600' },
        { label: isArabic ? 'فصل المعلم' : 'Teacher Classroom', icon: School, route: '/classroom', color: 'from-sky-500 to-blue-600' },
        ...(user?.role === UserRole.ADMIN ? [{ label: isArabic ? 'لوحة الإدارة' : 'Admin Console', icon: Shield, route: '/admin', color: 'from-rose-500 to-red-700' }] : []),
      ]
    }
  ];

  if (isMinimal) {
    return (
      <header className="sticky top-0 z-40 w-full h-14 max-h-[56px] px-3 sm:px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-all">
        {/* Generic logo removed per design spec */}
        <div />

        {/* Resources: Hearts, Coins, Stars */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. Hearts (قلوب) / EnergyBar */}
          {isFounderOrUnlimited ? (
            <div className="scale-90 flex-shrink-0">
              <EnergyBar />
            </div>
          ) : (
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={playTap}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 rounded-full select-none border border-rose-100 dark:border-rose-900/40"
              title={isArabic ? 'القلوب / الطاقة' : 'Hearts / Energy'}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 drop-shadow-sm" />
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 leading-none">
                {hearts}
              </span>
            </motion.div>
          )}

          {/* 2. Coins (عملات) */}
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={playTap}
            className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 dark:bg-orange-950/40 rounded-full select-none border border-orange-100 dark:border-orange-900/40"
            title={isArabic ? 'العملات' : 'Coins'}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <CoinIcon size={14} />
            </div>
            <span className="text-xs font-black text-orange-600 dark:text-orange-400 leading-none">
              {formatCompactNumber(coins)}
            </span>
          </motion.div>

          {/* 3. Stars (نجوم) */}
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={playTap}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-full select-none border border-amber-100 dark:border-amber-900/40"
            title={isArabic ? 'النجوم' : 'Stars'}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 drop-shadow-sm" />
            <span className="text-xs font-black text-amber-700 dark:text-amber-300 leading-none">
              {stars}
            </span>
          </motion.div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3 py-2 sm:px-6 sm:py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border-b border-slate-100 dark:border-slate-800 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left side: Mascot / Brand + Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sections Menu Drawer Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playTap();
                setMenuOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 text-[#F97316] font-black text-xs sm:text-sm border border-orange-200 dark:border-orange-800 transition-colors shadow-sm select-none"
              title={isArabic ? 'فتح قائمة الأقسام' : 'Open Sections Menu'}
            >
              <Menu className="w-5 h-5" />
              <span className="hidden xs:inline">{isArabic ? 'الأقسام' : 'Menu'}</span>
            </motion.button>

            {/* Mascot Brand */}
            <div
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 select-none cursor-pointer group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[18px] bg-gradient-to-tr from-[#FF8A00] to-[#FACC15] p-0.5 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-lg sm:text-xl select-none">🦉</span>
              </div>
              <span className="hidden sm:inline font-black text-base sm:text-lg text-slate-800 dark:text-white tracking-tight">
                Profits<span className="text-[#F97316]">Patrol</span>
              </span>
            </div>
          </div>

          {/* Center: EXACTLY 3 CHIPS: Stars, Coins, Hearts */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* 1. Stars (نجوم) */}
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={playTap}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl shadow-sm select-none border border-amber-100 dark:border-amber-900/40"
              title={isArabic ? 'النجوم' : 'Stars'}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 drop-shadow-sm" />
              <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-300 leading-none">
                {stars}
              </span>
            </motion.div>

            {/* 2. Coins (عملات) */}
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={playTap}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-orange-50 dark:bg-orange-950/40 rounded-2xl shadow-sm select-none border border-orange-100 dark:border-orange-900/40"
              title={isArabic ? 'العملات' : 'Coins'}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                <CoinIcon size={18} />
              </div>
              <span className="text-sm sm:text-base font-black text-orange-600 dark:text-orange-400 leading-none">
                {formatCompactNumber(coins)}
              </span>
            </motion.div>

            {/* 3. Hearts (قلوب) */}
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={playTap}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl shadow-sm select-none border border-rose-100 dark:border-rose-900/40"
              title={isArabic ? 'القلوب / الطاقة' : 'Hearts / Energy'}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 drop-shadow-sm" />
              <span className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 leading-none">
                {hearts}
              </span>
            </motion.div>
          </div>

          {/* Right side: Settings & Logout Direct Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex items-center gap-1">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Settings Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playTap();
                setShowSettings(true);
              }}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={isArabic ? 'الإعدادات' : 'Settings'}
              aria-label="Settings"
            >
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-2 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-black text-xs transition-colors"
              title={isArabic ? 'تسجيل الخروج' : 'Sign Out'}
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'خروج' : 'Logout'}</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Full Sections Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[250] flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: isArabic ? 360 : -360 }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? 360 : -360 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`relative z-10 w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-e border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col p-5 overflow-hidden ${
                isArabic ? 'ms-auto' : 'me-auto'
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF8A00] to-[#FACC15] p-0.5 shadow flex items-center justify-center">
                    <span className="text-2xl select-none">🦉</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-800 dark:text-white leading-tight">
                      {user?.name || (isArabic ? 'رائد الأعمال' : 'Young CEO')}
                    </h3>
                    <div className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                      {isArabic ? `المستوى ${user?.level || 1}` : `Level ${user?.level || 1}`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Navigation Sections List */}
              <div className="flex-1 overflow-y-auto space-y-5 no-scrollbar py-1">
                {navSections.map((sec, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1">
                      {sec.group}
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {sec.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={itemIdx}
                            whileHover={{ scale: 1.01, x: isArabic ? -2 : 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              playTap();
                              setMenuOpen(false);
                              navigate(item.route);
                            }}
                            className="flex items-center justify-between w-full p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-start group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm shrink-0`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-extrabold text-sm text-slate-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                {item.label}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 rtl:rotate-180" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer: Settings, Theme/Lang, and Logout */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0">
                <div className="flex items-center justify-between px-1">
                  <ThemeToggle />
                  <LanguageToggle />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowSettings(true);
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    <span>{isArabic ? 'الإعدادات' : 'Settings'}</span>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-black text-sm border border-red-200 dark:border-red-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
