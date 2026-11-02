import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { formatCompactNumber } from '../../utils/formatters';
import { UserRole } from '../../types';
import {
  Compass,
  Briefcase,
  Gamepad2,
  Bot,
  BookOpen,
  Play,
  Layers,
  Building2,
  Brain,
  User,
  Sparkles,
  Shield,
  LogOut,
  Flame,
  Coins,
  Star,
  Menu,
  X,
  School,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundService } from '../../lib/sound';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageToggle from '../ui/LanguageToggle';
import { useTranslation } from 'react-i18next';
import SettingsModal from '../feedback/SettingsModal';
import InvestorPitchModal from '../../features/game/components/InvestorPitchModal';
import LiveNowWidget from '../../features/education/components/LiveNowWidget';
import ScenarioEngine from '../../features/scenarios/components/ScenarioEngine';
import NewsTicker from '../../features/game/components/NewsTicker';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const { user, logout, setUser, openModal } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = () => {
      if (user?.settings.soundEnabled) SoundService.playClick();
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [user?.settings.soundEnabled]);

  // Listen for modal:open events dispatched from header buttons
  useEffect(() => {
    const handler = (e: Event) => {
      const modal = (e as CustomEvent).detail;
      if (modal) openModal(modal as any);
    };
    window.addEventListener('modal:open', handler);
    return () => window.removeEventListener('modal:open', handler);
  }, [openModal]);

  // Enforce Admin God Mode (Persistence Fix)
  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      const needsBoost = user.ppTokens < 1_000_000_000 || user.level < 100 || user.subscriptionTier !== 'tycoon';
      if (needsBoost) {
        setUser({
          ...user,
          ppTokens: 1_000_000_000,
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
  const isAdmin =
    user.role === UserRole.ADMIN ||
    user.role?.toUpperCase?.() === 'ADMIN' ||
    (user as any)?.isAdmin === true;

  const safeStreak = typeof user.streak === 'number' ? user.streak : 1;
  const safeCoins = typeof user.ppTokens === 'number' ? user.ppTokens : 0;
  const completedStarsCount = user?.completedLessonIds?.length || 0;

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const handleParentDashboardClick = async () => {
    if (isKid) {
      if (user.id?.startsWith('dev_')) {
        useAppStore.getState().login(UserRole.PARENT);
        handleNav('parent_dashboard');
        return;
      }
      alert(t('auth.parent_only_gate', { defaultValue: 'هذه المنطقة مخصصة لأولياء الأمور فقط. يرجى تسجيل الدخول بحساب ولي الأمر.' }));
      return;
    }
    if (['board', 'tycoon'].includes(user.subscriptionTier) || isAdmin || isParent) {
      handleNav('parent_dashboard');
    } else {
      setMobileMenuOpen(false);
      setShowPaywall(true);
    }
  };

  const isTabActive = (tab: string) => {
    if (tab === 'map') return activeTab === 'map';
    if (tab === 'assignments') return ['assignments', 'missions', 'quests', 'tasks'].includes(activeTab);
    if (tab === 'games') return ['games', 'play', 'arcade'].includes(activeTab);
    if (tab === 'debate') return activeTab === 'debate';
    if (tab === 'library') return activeTab === 'library';
    if (tab === 'videos') return activeTab === 'videos';
    if (tab === 'card-academy') return activeTab === 'card-academy';
    if (tab === 'the-tank') return ['the-tank', 'the_tank'].includes(activeTab);
    if (tab === 'real-estate') return activeTab === 'real-estate';
    if (tab === 'skills') return activeTab === 'skills';
    if (tab === 'profile') return ['profile', 'me'].includes(activeTab);
    if (tab === 'parent_dashboard') return activeTab === 'parent_dashboard';
    if (tab === 'admin_dashboard') return activeTab === 'admin_dashboard';
    return activeTab === tab;
  };

  const renderNavItems = (isMobileView = false) => (
    <div>
      {/* Brand Logo & Role Badge */}
      <div className="flex items-center justify-between px-3 py-3 mb-2 gap-2 flex-nowrap">
        <div className="flex items-center gap-2 min-w-0 shrink">
          <img src="/images/logo.png" alt="Profits Patrol" className="w-8 h-8 object-contain shrink-0" />
          <img src="/images/logo_text.png" alt="Profits Patrol" className={`h-5 w-auto max-w-[110px] object-contain shrink min-w-0 ${isMobileView ? 'block' : 'hidden xl:block'}`} />
        </div>
        <span
          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
            isAdmin
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isAdmin ? 'ADMIN' : (user?.subscriptionTier || 'INTERN').toUpperCase()}
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="flex flex-col gap-1 px-1">
        {/* ── Section: LEARN ── */}
        <div className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)] px-3 mt-2 mb-1">
          {t('nav.section_learn', isArabic ? 'التعلم والمغامرة' : 'Learn & Adventure')}
        </div>

        <button
          type="button"
          className={`nav-item ${isTabActive('map') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('map')}
          data-testid="nav-adventure-map"
        >
          <span className="icon-bubble theme-orange">
            <img src="/icons/3d/compass.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.map', isArabic ? 'خريطة المغامرة' : 'Adventure Map')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('assignments') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('assignments')}
          data-testid="nav-assignments"
        >
          <span className="icon-bubble theme-blue">
            <img src="/icons/3d/clipboard.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.assignments', isArabic ? 'المهام' : 'Assignments')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('games') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('games')}
          data-testid="nav-arcade"
        >
          <span className="icon-bubble theme-purple">
            <img src="/icons/3d/gamepad.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.games', isArabic ? 'الألعاب (Arcade)' : 'Arcade Games')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('debate') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('debate')}
          data-testid="nav-debate-dojo"
        >
          <span className="icon-bubble theme-pink">
            <img src="/icons/3d/microphone.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.debate', isArabic ? 'حلبة المناظرات' : 'Debate Dojo')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('library') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('library')}
          data-testid="nav-library"
        >
          <span className="icon-bubble theme-teal">
            <img src="/icons/3d/books.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.library', isArabic ? 'المكتبة' : 'Library')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('videos') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('videos')}
          data-testid="nav-videos"
        >
          <span className="icon-bubble theme-red">
            <img src="/icons/3d/play.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.videos', isArabic ? 'الفيديوهات' : 'Videos')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('card-academy') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('card-academy')}
          data-testid="nav-card-academy"
        >
          <span className="icon-bubble theme-yellow">
            <img src="/icons/3d/cards.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.card_academy', isArabic ? 'أكاديمية البطاقات' : 'Card Academy')}</span>
        </button>

        {/* ── Section: MY VENTURE ── */}
        <div className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)] px-3 mt-4 mb-1">
          {t('nav.section_venture', isArabic ? 'ريادة الأعمال والاستثمار' : 'My Venture')}
        </div>

        <button
          type="button"
          className={`nav-item ${isTabActive('the-tank') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('the-tank')}
          data-testid="nav-the-tank"
        >
          <span className="icon-bubble theme-blue">
            <img src="/icons/3d/shark.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.the_tank', isArabic ? 'حوض الاستثمار' : 'The Tank')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('real-estate') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('real-estate')}
          data-testid="nav-real-estate"
        >
          <span className="icon-bubble theme-green">
            <img src="/icons/3d/house.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.real_estate', isArabic ? 'العقارات' : 'Real Estate')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('skills') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('skills')}
          data-testid="nav-skills"
        >
          <span className="icon-bubble theme-purple">
            <img src="/icons/3d/graduation_cap.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.skills', isArabic ? 'شجرة المهارات' : 'MBA Skills')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('profile') ? 'nav-item--active' : ''}`}
          onClick={() => handleNav('profile')}
          data-testid="nav-profile"
        >
          <span className="icon-bubble theme-orange">
            <img src="/icons/3d/fox.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.profile', isArabic ? 'ملفي الشخصي' : 'My Profile')}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${isTabActive('parent_dashboard') ? 'nav-item--active' : ''}`}
          onClick={handleParentDashboardClick}
        >
          <span className="icon-bubble theme-teal">
            <img src="/icons/3d/family.png" alt="" />
          </span>
          <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.for_parents', isArabic ? 'بوابة أولياء الأمور' : 'For Parents')}</span>
        </button>

        {/* Teacher Mode if Teacher */}
        {isTeacher && (
          <button
            type="button"
            className={`nav-item ${isTabActive('teacher_dashboard') ? 'nav-item--active' : ''}`}
            onClick={() => handleNav('teacher_dashboard')}
          >
            <span className="icon-bubble theme-blue">
              <img src="/icons/3d/books.png" alt="" />
            </span>
            <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.classroom', isArabic ? 'الفصل الدراسي' : 'Classroom')}</span>
          </button>
        )}

        {/* Parent Mode if Parent */}
        {isParent && (
          <button
            type="button"
            className={`nav-item ${isTabActive('parent_dashboard') ? 'nav-item--active' : ''}`}
            onClick={() => handleNav('parent_dashboard')}
          >
            <span className="icon-bubble theme-teal">
              <img src="/icons/3d/family.png" alt="" />
            </span>
            <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.overview', isArabic ? 'لوحة المتابعة' : 'Parent Overview')}</span>
          </button>
        )}

        {/* Admin Console (if admin) */}
        {isAdmin && (
          <button
            type="button"
            className={`nav-item text-[var(--color-danger)] font-black ${isTabActive('admin_dashboard') ? 'nav-item--active' : ''}`}
            onClick={() => handleNav('admin_dashboard')}
          >
            <span className="icon-bubble theme-red">
              <img src="/icons/3d/trophy.png" alt="" />
            </span>
            <span className={isMobileView ? 'inline' : 'hidden xl:inline'}>{t('nav.admin_mode', isArabic ? 'لوحة الإدارة' : 'Admin Console')}</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderBottomToolbar = () => (
    <div className="border-t border-[var(--color-border)] pt-3 mt-4 flex items-center justify-between px-2">
      <ThemeToggle />
      <LanguageToggle />
      <button
        type="button"
        onClick={() => logout()}
        className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-surface)] rounded-full transition-colors cursor-pointer"
        title={isArabic ? 'تسجيل الخروج' : 'Sign Out'}
      >
        <LogOut size={18} />
      </button>
    </div>
  );

  // If map tab, AdventureMap already has its own custom Duolingo layout
  if (activeTab === 'map') {
    return (
      <div className="w-full h-[100dvh] overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        {children}
      </div>
    );
  }

  return (
    <div
      className="flex h-[100dvh] w-full overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP SIDEBAR (Duolingo Style: theme.css)
         ───────────────────────────────────────────────────────────── */}
      <aside className="sidebar hidden lg:flex shrink-0 h-full overflow-y-auto flex-col justify-between">
        {renderNavItems(false)}
        {renderBottomToolbar()}
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE MENU OVERLAY
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/50 flex lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: isArabic ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? '100%' : '-100%' }}
              transition={{ type: 'tween' }}
              className="w-72 max-w-[85vw] h-full bg-[var(--color-bg)] border-e border-[var(--color-border)] shadow-2xl flex flex-col justify-between p-4 overflow-y-auto z-[260]"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-black text-[var(--color-text)]">{t('common.menu', 'القائمة')}</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                  >
                    <X size={20} />
                  </button>
                </div>
                {renderNavItems(true)}
              </div>
              {renderBottomToolbar()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT: Top Bar (3 stats + news) + Children
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP BAR: streak, coins, stars + news */}
        <header className="topbar w-full shrink-0 flex items-center justify-between px-3 sm:px-6 z-20">
          <div className="lg:hidden flex items-center gap-2 min-w-0 flex-nowrap">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-full cursor-pointer hover:bg-[var(--color-surface)] text-[var(--color-primary)] transition-colors shrink-0"
              aria-label="Toggle Menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
              <img src="/images/logo.png" alt="Profits Patrol" className="w-7 h-7 object-contain shrink-0" />
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                  isAdmin
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isAdmin ? 'ADMIN' : (user?.subscriptionTier || 'INTERN').toUpperCase()}
              </span>
            </div>
          </div>

          {/* 3 Stats with 3D Icons */}
          <div className="flex items-center gap-3 sm:gap-6 ms-auto">
            <div className="stat stat--streak" title={isArabic ? 'أيام الاستمرار' : 'Day Streak'}>
              <span className="icon-bubble theme-orange" style={{ width: 28, height: 28 }}>
                <img src="/icons/3d/fire.png" alt="" />
              </span>
              <span>{safeStreak}</span>
            </div>

            <div className="stat stat--coins" title={isArabic ? `العملات الذهبية: ${safeCoins.toLocaleString()} عملة` : `Gold Coins: ${safeCoins.toLocaleString()}`}>
              <span className="icon-bubble theme-yellow" style={{ width: 28, height: 28 }}>
                <img src="/icons/3d/coin.png" alt="coin" />
              </span>
              <span title={safeCoins.toLocaleString()}>{formatCompactNumber(safeCoins)}</span>
            </div>

            <div className="stat stat--stars" title={isArabic ? 'النجوم المكتملة' : 'Completed Stars'}>
              <span className="icon-bubble theme-orange" style={{ width: 28, height: 28 }}>
                <img src="/icons/3d/star.png" alt="" />
              </span>
              <span>{completedStarsCount}</span>
            </div>
          </div>
        </header>

        {/* Live News Ticker Strip */}
        <div className="w-full shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <NewsTicker />
        </div>

        {/* Page Inner Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-24 md:pb-6" style={{ background: 'var(--color-bg)' }}>
          {children}
        </main>

        {/* Mobile Bottom Navigation (5 tabs) */}
        <nav className="bottom-nav">
          <button
            type="button"
            onClick={() => handleNav('map')}
            className={`nav-item ${isTabActive('map') ? 'nav-item--active' : ''}`}
          >
            <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/compass.png" alt="" />
            </span>
            <span>{isArabic ? 'تعلّم' : 'Learn'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('games')}
            className={`nav-item ${isTabActive('games') ? 'nav-item--active' : ''}`}
          >
            <span className="icon-bubble theme-purple" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/gamepad.png" alt="" />
            </span>
            <span>{isArabic ? 'الألعاب' : 'Arcade'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('library')}
            className={`nav-item ${isTabActive('library') ? 'nav-item--active' : ''}`}
          >
            <span className="icon-bubble theme-teal" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/books.png" alt="" />
            </span>
            <span>{isArabic ? 'المكتبة' : 'Library'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('profile')}
            className={`nav-item ${isTabActive('profile') ? 'nav-item--active' : ''}`}
          >
            <span className="icon-bubble theme-orange" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/fox.png" alt="" />
            </span>
            <span>{isArabic ? 'ملفي' : 'Profile'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="nav-item"
          >
            <span className="icon-bubble theme-blue" style={{ width: 30, height: 30 }}>
              <img src="/icons/3d/trophy.png" alt="" />
            </span>
            <span>{isArabic ? 'المزيد' : 'More'}</span>
          </button>
        </nav>
      </div>

      <LiveNowWidget />
      <ScenarioEngine />
    </div>
  );
};

export default Layout;

