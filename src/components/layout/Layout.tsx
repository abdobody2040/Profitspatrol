import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { formatCompactNumber } from '../../utils/formatters';
import { TIER_KEYS } from '../../utils/translationMappings';
import { LEVEL_THRESHOLDS } from '../../data/constants';
import { UserRole } from '../../types';
import { Trophy, Flame, Coins, Map as MapIcon, Gamepad2, LayoutDashboard, LogOut, ShoppingBag, Medal, School, Settings, Building2, Brain, Briefcase, Snowflake, Shield, Menu, X, ClipboardList, Book, UserCheck, Crown, Mic, Bot, Play, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundService } from '../../lib/sound';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';
import { useTranslation } from 'react-i18next';
import SettingsModal from '../feedback/SettingsModal';
import InvestorPitchModal from '../../features/game/components/InvestorPitchModal';
import EnergyBar from '../../features/game/components/EnergyBar';
import LiveNowWidget from '../../features/education/components/LiveNowWidget';
import NewsTicker from '../../features/game/components/NewsTicker';
import ScenarioEngine from '../../features/scenarios/components/ScenarioEngine';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const { user, logout, setUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClick = () => {
      if (user?.settings.soundEnabled) SoundService.playClick();
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [user?.settings.soundEnabled]);

  // Enforce Admin God Mode (Persistence Fix)
  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      const needsBoost = user.bizCoins < 1_000_000_000 || user.level < 100 || user.subscriptionTier !== 'tycoon';
      if (needsBoost) {
        setUser({
          ...user,
          bizCoins: 1_000_000_000,
          level: 100,
          xp: 1_000_000,
          subscriptionTier: 'tycoon',
          subscriptionStatus: 'PREMIUM'
        });
      }
    }
  }, [user, setUser]);

  if (!user) return <>{children}</>;

  const isKid = user.role === UserRole.KID;
  const isParent = user.role === UserRole.PARENT;
  const isTeacher = user.role === UserRole.TEACHER;
  const isAdmin = user.role === UserRole.ADMIN;

  const safeLevel = typeof user.level === 'number' ? user.level : 1;
  const safeXP = typeof user.xp === 'number' ? user.xp : 0;
  const safeStreak = typeof user.streak === 'number' ? user.streak : 0;
  const safeCoins = typeof user.bizCoins === 'number' ? user.bizCoins : 0;

  const currentLevelBase = LEVEL_THRESHOLDS[safeLevel - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[safeLevel] || safeXP * 1.5;
  const progressPercent = Math.min(100, Math.max(0, ((safeXP - currentLevelBase) / (nextLevelThreshold - currentLevelBase)) * 100));

  const hasFreeze = user.inventory.includes('item_freeze');
  const isIntern = user.subscriptionTier === 'intern';

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const handleParentDashboardClick = () => {
    if (isKid || ['board', 'tycoon'].includes(user.subscriptionTier) || isAdmin) {
      handleNav('parent_dashboard');
    } else {
      setMobileMenuOpen(false);
      setShowPaywall(true);
    }
  };

  const NavContent = () => (
    <>
      {/* Header - Hidden on Mobile */}
      <div className="flex items-center justify-between mb-8 px-2 md:block hidden shrink-0">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain bg-transparent" />
          <div>
            <h1 className="h-10 flex items-center"><img src="/images/logo_text.png" alt="Profits Patrol" className="h-full w-auto object-contain" /></h1>
            <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit
                    ${isAdmin ? 'bg-red-100 text-red-800' :
                isParent ? 'bg-blue-100 text-blue-800' :
                  user.subscriptionTier === 'tycoon' ? 'bg-yellow-400 text-yellow-900' :
                    user.subscriptionTier === 'board' ? 'bg-purple-100 text-purple-800' :
                      user.subscriptionTier === 'founder' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}
                `}>
              {isAdmin ? 'ADMIN' : isParent ? t('auth.role_parent') : `${t(TIER_KEYS[user.subscriptionTier as keyof typeof TIER_KEYS] || 'the_tank.tier_intern')} ${t('common.plan')}`}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Nav Items */}
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-1">
        {(isKid || isAdmin) && (
          <>
            <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-4 mb-2">{t('nav.section_learn')}</div>
            <NavItem icon={<MapIcon size={24} />} label={t('nav.map')} active={activeTab === 'map'} onClick={() => handleNav('map')} data-testid="nav-adventure-map" />
            <NavItem icon={<ClipboardList size={24} />} label={t('nav.assignments')} active={activeTab === 'assignments'} onClick={() => handleNav('assignments')} data-testid="nav-assignments" />
            <NavItem icon={<Gamepad2 size={24} />} label={t('nav.games')} active={activeTab === 'games'} onClick={() => handleNav('games')} data-testid="nav-arcade" />
            <NavItem icon={<Bot size={24} />} label={t('nav.debate')} active={activeTab === 'debate'} onClick={() => handleNav('debate')} data-testid="nav-debate-dojo" />
            <NavItem icon={<Book size={24} />} label={t('nav.library')} active={activeTab === 'library'} onClick={() => handleNav('library')} data-testid="nav-library" />
            <NavItem icon={<Play size={24} />} label={t('nav.videos')} active={activeTab === 'videos'} onClick={() => handleNav('videos')} data-testid="nav-videos" />
            <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">{t('nav.section_venture')}</div>
            <NavItem icon={<Mic size={24} />} label={t('the_tank.title')} active={activeTab === 'the-tank'} onClick={() => handleNav('the_tank')} data-testid="nav-the-tank" />
            <NavItem icon={<Zap size={24} />} label={t('nav.gig_central')} active={activeTab === 'side-hustle'} onClick={() => handleNav('side-hustle')} data-testid="nav-gig-central" />
            <NavItem icon={<Building2 size={24} />} label={t('nav.real_estate')} active={activeTab === 'real-estate'} onClick={() => handleNav('real-estate')} data-testid="nav-real-estate" />

            <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">{t('nav.section_empire')}</div>
            <NavItem icon={<Building2 size={24} />} label={t('nav.hq')} active={activeTab === 'hq'} onClick={() => handleNav('hq')} data-testid="nav-hq" />
            <NavItem icon={<Brain size={24} />} label={t('nav.skills')} active={activeTab === 'skills'} onClick={() => handleNav('skills')} data-testid="nav-skills" />
            <NavItem icon={<Briefcase size={24} />} label={t('nav.portfolio')} active={activeTab === 'portfolio'} onClick={() => handleNav('portfolio')} data-testid="nav-portfolio" />

            <div className="text-xs font-bold text-gray-400 uppercase px-4 mt-6 mb-2">{t('nav.section_social')}</div>
            <NavItem icon={<Users size={24} />} label={t('nav.social_hub')} active={activeTab === 'social'} onClick={() => handleNav('social')} data-testid="nav-social-hub" />
            <NavItem icon={<ShoppingBag size={24} />} label={t('nav.store')} active={activeTab === 'store'} onClick={() => handleNav('store')} data-testid="nav-store" />
            <NavItem icon={<Medal size={24} />} label={t('nav.leaderboard')} active={activeTab === 'leaderboard'} onClick={() => handleNav('leaderboard')} data-testid="nav-leaderboard" />
            <NavItem icon={<Trophy size={24} />} label={t('nav.profile')} active={activeTab === 'profile'} onClick={() => handleNav('profile')} data-testid="nav-profile" />

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <NavItem icon={<UserCheck size={24} />} label={t('nav.for_parents')} active={activeTab === 'parent_dashboard'} onClick={handleParentDashboardClick} />
            </div>
          </>
        )}

        {isParent && <NavItem icon={<LayoutDashboard size={24} />} label={t('nav.overview')} active={activeTab === 'parent_dashboard'} onClick={() => handleNav('parent_dashboard')} />}
        {isTeacher && <NavItem icon={<School size={24} />} label={t('nav.classroom')} active={activeTab === 'teacher_dashboard'} onClick={() => handleNav('teacher_dashboard')} />}
        {isAdmin && <NavItem icon={<Shield size={24} />} label={t('nav.admin')} active={activeTab === 'admin_dashboard'} onClick={() => handleNav('admin_dashboard')} />}
      </div>

      {/* Stats - Desktop Only */}
      {isKid && (
        <div className="mb-4 space-y-3 px-2 mt-4 hidden md:block shrink-0">
          <div className="flex justify-center pb-2"><EnergyBar /></div>
          <div className="flex items-center justify-between text-orange-500 font-bold p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl relative overflow-hidden">
            <div className="flex items-center gap-2 relative z-10"><Flame size={20} className="fill-current" /> {t('stats.streak')}</div>
            <span className="relative z-10">{safeStreak} {t('stats.days')}</span>
            {hasFreeze && <div className="absolute end-0 top-0 bottom-0 bg-blue-100 dark:bg-blue-900/30 w-8 flex items-center justify-center border-s border-blue-200 dark:border-blue-800"><Snowflake size={16} className="text-blue-500" /></div>}
          </div>
          <div className="flex items-center justify-between text-yellow-600 dark:text-yellow-400 font-bold p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="flex items-center gap-2"><Coins size={20} className="fill-yellow-400" /> {t('stats.bizcoins')}</div>
            <span>{safeCoins}</span>
          </div>
          <div className="space-y-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between text-blue-500 font-bold text-sm">
              <div className="flex items-center gap-2">{t('stats.level')} {safeLevel}</div>
              <span>{safeXP} XP</span>
            </div>
            <div className="h-3 w-full bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden" dir="ltr">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Footer (Logout) */}
      <div className="border-t dark:border-gray-700 pt-4 mt-auto shrink-0 pb-safe">
        {isTeacher && <div className="px-4 py-2 mb-2 text-sm font-bold text-gray-500">{t('nav.teacher_mode')}</div>}
        {isAdmin && <div className="px-4 py-2 mb-2 text-sm font-bold text-red-500">{t('nav.admin_mode')}</div>}

        <div className="flex items-center justify-between px-4 mb-2">
          <ThemeToggle />
          <LanguageToggle />
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
          <LogOut size={24} /> {t('nav.signout')}
        </button>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-green-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans overflow-hidden transition-colors duration-200">
      <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* MOBILE TOP BAR */}
      <div className="md:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between shrink-0 z-30 fixed top-0 start-0 end-0 w-full">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain bg-transparent" />
          <img src="/images/logo_text.png" alt="Profit Patrol" className="h-10 w-auto object-contain hidden sm:block" />
        </div>
        <div className="flex items-center gap-3">
          <EnergyBar />
          <ThemeToggle />
          <LanguageToggle />
          {isKid && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-bold text-yellow-800 dark:text-yellow-300">
              <Coins size={14} className="fill-yellow-500 text-yellow-600 dark:text-yellow-400" /> {formatCompactNumber(safeCoins)}
            </div>
          )}
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300"><Menu /></button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <nav className={`hidden md:flex w-64 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 p-4 flex-col h-full overflow-hidden z-20 ${isIntern ? 'pb-16' : ''}`}>
        <NavContent />
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween' }}
            className="fixed inset-0 z-[200] bg-white dark:bg-gray-800 flex flex-col p-4 md:hidden h-[100dvh]"
          >
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-black text-gray-800 dark:text-white">{t('common.menu')}</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"><X /></button>
            </div>
            <NavContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className={`flex-1 flex flex-col overflow-hidden relative bg-green-50 dark:bg-gray-900 transition-colors duration-200`}>
        <div className={`flex-1 overflow-y-auto scroll-smooth ${['the-tank', 'map'].includes(activeTab) ? 'p-0 pt-16 md:pt-0' : 'p-4 md:p-8 pt-20 pb-36 md:pt-8'}`}>
          <div className={`${['the-tank', 'map'].includes(activeTab) ? 'w-full h-full' : 'max-w-4xl mx-auto h-full'}`}>
            {children}
          </div>
        </div>
        {/* News Ticker Fixed Bottom on Desktop within Main Area */}
        {isKid && <div className="hidden md:block shrink-0"><NewsTicker /></div>}
        <LiveNowWidget />
        <ScenarioEngine />
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 flex justify-around items-center shrink-0 z-30 fixed bottom-0 start-0 end-0 pb-safe transition-colors duration-200">
        <MobileNavItem icon={<MapIcon size={24} />} label={t('nav.map')} active={activeTab === 'map'} onClick={() => handleNav('map')} />
        <MobileNavItem icon={<Gamepad2 size={24} />} label={t('nav.games')} active={activeTab === 'games'} onClick={() => handleNav('games')} />
        <MobileNavItem icon={<ShoppingBag size={24} />} label={t('nav.store')} active={activeTab === 'store'} onClick={() => handleNav('store')} />
        <MobileNavItem icon={<Medal size={24} />} label={t('nav.leaderboard')} active={activeTab === 'leaderboard'} onClick={() => handleNav('leaderboard')} />
        <MobileNavItem icon={<Trophy size={24} />} label={t('nav.profile')} active={activeTab === 'profile'} onClick={() => handleNav('profile')} />
      </div>

      {(isIntern && !isAdmin) && (
        <div className="fixed bottom-20 md:bottom-0 start-0 end-0 h-12 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 z-40 border-t border-gray-300 dark:border-gray-700">
          {t('common.ads_support')}
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, 'data-testid': testId }: { icon: any, label: string, active: boolean, onClick: () => void, 'data-testid'?: string }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold text-lg transition-all border-b-4 text-start
      ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'}`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${active ? 'text-kid-secondary' : 'text-gray-400 dark:text-gray-500'}`}>
    <div className={`p-1 rounded-xl transition-all ${active ? 'bg-green-50 dark:bg-green-900/20 -translate-y-1' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold uppercase truncate max-w-[60px]">{label}</span>
  </button>
);

export default Layout;
