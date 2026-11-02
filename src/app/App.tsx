import React, { useState, useEffect, Suspense } from 'react';
import { useAppStore } from '../store';
import { useSocialStore } from '../store/socialStore';
import { useGameStore } from '../store/gameStore';
import { UserRole } from '../types';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, Star, Loader2 } from "lucide-react";
import '../lib/i18n';
import { useTranslation } from 'react-i18next';
import { useAppSound } from '../contexts/SoundContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Logger } from '../services/logger';
import { ProtectedRoute, RoleProtectedRoute, DynamicPageWrapper } from '../routes/ProtectedRoute';
import { useEducationStore } from '../store/educationStore';

// Lazy Load ALL Components (including Auth, LandingPage, and Game modules)
const Auth = React.lazy(() => import('../features/auth/components/Auth'));
const LandingPage = React.lazy(() => import('../features/marketing/components/LandingPage'));
const KidMap = React.lazy(() => import('../features/hq/components/KidMap'));
const LessonSession = React.lazy(() => import('./LessonSession'));
const ArcadeGameShellWrapper = React.lazy(() => import('./ArcadeGameShellWrapper'));
const CertificateModal = React.lazy(() => import('./CertificateModal'));
const LemonadeStand = React.lazy(() => import('../features/game/components/LemonadeStand'));
const BrandBuilder = React.lazy(() => import('../features/game/components/BrandBuilder'));
const PizzaDelivery = React.lazy(() => import('../features/game/components/PizzaDelivery'));
const CoffeeCart = React.lazy(() => import('../features/game/components/CoffeeCart'));
const GameEngine = React.lazy(() => import('../features/game/components/GameEngine'));
const GameMenu = React.lazy(() => import('../features/game/components/GameMenu'));
const BizStore = React.lazy(() => import('../features/store/components/BizStore'));
const Leaderboard = React.lazy(() => import('../features/game/components/Leaderboard'));
const LevelUpModal = React.lazy(() => import('../features/game/components/LevelUpModal'));
const ParentDashboard = React.lazy(() => import('../features/dashboard/components/ParentDashboard'));
const TeacherDashboard = React.lazy(() => import('../features/education/components/TeacherDashboard'));
const PrincipalDashboard = React.lazy(() => import('../features/education/components/PrincipalDashboard'));
const AdminDashboard = React.lazy(() => import('../features/admin/components/AdminDashboard'));
const SocialHub = React.lazy(() => import('../features/social/components/SocialHub'));
const JoinClassModal = React.lazy(() => import('../features/education/components/JoinClassModal'));
const Headquarters = React.lazy(() => import('../features/hq/components/Headquarters'));
const DebateArena = React.lazy(() => import('../features/debate/components/DebateArena'));
const SkillTree = React.lazy(() => import('../features/education/components/SkillTree'));
const Portfolio = React.lazy(() => import('../features/dashboard/components/Portfolio'));
const CurriculumPage = React.lazy(() => import('../features/education/components/CurriculumPage'));
const PricingPage = React.lazy(() => import('../features/marketing/components/PricingPage'));
const FeaturesPage = React.lazy(() => import('../features/marketing/components/FeaturesPage'));
const DynamicPage = React.lazy(() => import('../features/marketing/components/DynamicPage'));
const OllieChat = React.lazy(() => import('../features/game/components/OllieChat'));
const PlayHubFAB = React.lazy(() => import('../components/ui/PlayHubFAB'));
const StudentAssignmentDashboard = React.lazy(() => import('../features/education/components/StudentAssignmentDashboard'));
const BookLibrary = React.lazy(() => import('../features/library/components/BookLibrary'));
const VideoLibrary = React.lazy(() => import('../features/education/components/VideoLibrary'));
const SideHustleApp = React.lazy(() => import('../features/venture/components/SideHustleApp'));
const RealEstateApp = React.lazy(() => import('../features/venture/components/RealEstateApp'));
const AdminBookManager = React.lazy(() => import('../features/admin/components/AdminBookManager'));
const CheckoutPage = React.lazy(() => import('../features/marketing/components/CheckoutPage'));
const ReloadPrompt = React.lazy(() => import('../components/feedback/ReloadPrompt'));
const TheTankPage = React.lazy(() => import('../features/tank/components/TheTankPage'));
const TournamentPage = React.lazy(() => import('../features/education/components/TournamentPage'));
const UserProfile = React.lazy(() => import('../features/dashboard/components/UserProfile'));
const ScenarioEngine = React.lazy(() => import('../features/scenarios/components/ScenarioEngine'));
const PrivacyPolicyPage = React.lazy(() => import('../features/marketing/components/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('../features/marketing/components/TermsOfServicePage'));
const RefundPolicyPage = React.lazy(() => import('../features/marketing/components/RefundPolicyPage'));
const CheckoutSuccess = React.lazy(() => import('../features/marketing/components/CheckoutSuccess'));
const GraduationModal = React.lazy(() => import('../features/game/components/GraduationModal'));
const DailySpinWheel = React.lazy(() => import('../features/game/components/DailySpinWheel'));
const WeeklyCEOChallenge = React.lazy(() => import('../features/game/components/CEOChallengeWidget'));
const BizPulseNewsFeed = React.lazy(() => import('../features/game/components/BizPulseNewsFeed'));
const CorporationHub = React.lazy(() => import('../features/game/components/CorporationHub'));
const StockMarket = React.lazy(() => import('../features/game/components/StockMarket'));
const AvatarCustomizer = React.lazy(() => import('../features/game/components/AvatarCustomizer'));
const SeasonalEvent = React.lazy(() => import('../features/game/components/SeasonalEvent'));
const ParentReport = React.lazy(() => import('../features/game/components/ParentReport'));
const RealEstateTycoon = React.lazy(() => import('../features/game/components/RealEstateTycoon'));
const CardGamePage = React.lazy(() => import('../pages/CardGamePage'));
import { GlobalModalManager } from '../components/modals/GlobalModalManager';
import { SkeletonPageLoader } from '../components/ui/SkeletonPageLoader';

import { PWAInstallBanner } from '../components/ui/PWAInstallBanner';
import { usePassiveIncome } from '../hooks/usePassiveIncome';
import { PassiveIncomeModal } from '../components/modals/PassiveIncomeModal';

// Simple Loading Spinner for Suspense fallback
const PageLoader = SkeletonPageLoader;

const App = () => {
    const { user, toggleEquipItem, syncGames, cmsContent, activeScenario, showCertificateId, setShowCertificateId, openModal, isAuthLoading, loadCorporations } = useAppStore();
    const { activeGameId, setActiveGameId } = useGameStore();
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [showJoinClass, setShowJoinClass] = useState(false);
    const lessons = useEducationStore(state => state.lessons);

    const { playClick } = useAppSound();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { accruedAmount, isModalOpen, closeModal, propertyCount } = usePassiveIncome();

    // Global Sound Listener
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Play sound if clicking button, link, or interactive element
            if (target.closest('button') || target.closest('a') || target.getAttribute('role') === 'button') {
                playClick();
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [playClick]);

    // Handle RTL/LTR based on language
    useEffect(() => {
        const isArabic = i18n.language.startsWith('ar');
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        document.documentElement.lang = isArabic ? 'ar' : 'en';
    }, [i18n.language]);

    // Initialize Data on Mount for authenticated users only
    useEffect(() => {
        if (!user) return;
        syncGames();
        loadCorporations().catch(err => Logger.error("Failed to load corporations", err));
        // refreshRecurringBounties lives in the separate useSocialStore (BountySlice)
        useSocialStore.getState().refreshRecurringBounties();
        // Initialize content moderation patterns (non-blocking)
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
                import('../services/ContentModerationService').then(({ ContentModerationService }) => {
                    ContentModerationService.loadPatterns();
                });
            });
        }
    }, [user, syncGames, loadCorporations]);

    // Theme Switching Effect
    useEffect(() => {
        if (user?.settings.themeMode === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, [user?.settings.themeMode]);

    // Redirect logic based on role if logged in and at public routes.
    // ✅ BUG FIX — Auto-Login to Admin:
    // Guard on isAuthLoading so we never redirect based on stale localStorage data.
    // The redirect only fires once the Supabase session check has resolved.
    useEffect(() => {
        if (isAuthLoading) return; // Wait for session check to complete
        if (user && ['/', '/login', '/register'].includes(location.pathname)) {
            if (user.role === UserRole.PARENT) navigate('/dashboard', { replace: true });
            else if (user.role === UserRole.TEACHER) {
                if (user.subscriptionTier?.startsWith('school_')) {
                    navigate('/principal', { replace: true });
                } else {
                    navigate('/classroom', { replace: true });
                }
            }
            else if (user.role === UserRole.ADMIN) navigate('/admin', { replace: true });
            else navigate('/map', { replace: true });
        }
    }, [user, isAuthLoading, location.pathname, navigate]);

    // Navigation Handlers (Shim for old props if needed)
    const handleNavigate = (path: string) => {
        const raw = path.trim();
        const clean = raw.startsWith('/') ? raw.slice(1) : raw;
        // Map legacy "tabs" to routes
        const routeMap: Record<string, string> = {
            'the_tank': '/the-tank',
            'the-tank': '/the-tank',
            'map': '/map',
            'assignments': '/assignments',
            'missions': '/assignments',
            'quests': '/assignments',
            'tasks': '/assignments',
            'games': '/games',
            'play': '/games',
            'arcade': '/games',
            'library': '/library',
            'store': '/store',
            'leaderboard': '/leaderboard',
            'hq': '/hq',
            'skills': '/skills',
            'portfolio': '/portfolio',
            'profile': '/profile',
            'me': '/profile',
            'parent_dashboard': '/dashboard',
            'teacher_dashboard': user?.subscriptionTier?.startsWith('school_') ? '/principal' : '/classroom',
            'admin_dashboard': '/admin',
            'debate': '/debate',
            'videos': '/videos',
            'card-academy': '/card-academy',
            'side-hustle': '/side-hustle',
            'real-estate': '/real-estate',
            'social': '/social'
        };
        const destination = routeMap[clean] || (raw.startsWith('/') ? raw : `/${clean}`);
        navigate(destination);
        setActiveLessonId(null);
        setActiveGameId(null);
    };

    // Helper to determine active tab for Layout
    const getActiveTab = () => {
        const path = location.pathname.substring(1); // remove leading slash
        if (path === 'dashboard') return 'parent_dashboard';
        if (path === 'classroom' || path === 'principal') return 'teacher_dashboard';
        if (path === 'admin') return 'admin_dashboard';
        if (path === '') return 'map';
        return path;
    };

    const renderGame = () => {
        // Legacy Custom Games
        if (activeGameId === 'lemonade') return <LemonadeStand onBack={() => setActiveGameId(null)} />;
        if (activeGameId === 'brand') return <BrandBuilder onBack={() => setActiveGameId(null)} />;
        if (activeGameId === 'pizza') return <PizzaDelivery onBack={() => setActiveGameId(null)} />;
        // Dynamic Game Engine
        if (activeGameId && activeGameId.startsWith('BIZ_')) {
            return <GameEngine gameId={activeGameId} onExit={() => setActiveGameId(null)} />;
        }

        // Integrated Canonical 50 Arcade Stations
        if (activeGameId) {
            return (
                <Suspense fallback={<PageLoader />}>
                    <ArcadeGameShellWrapper gameId={activeGameId} onExit={() => setActiveGameId(null)} />
                </Suspense>
            );
        }

        if (activeScenario) {
            return <ScenarioEngine />;
        }

        return <GameMenu onSelectGame={setActiveGameId} />;
    };

    if (activeLessonId) {
        return (
            <Suspense fallback={<PageLoader />}>
                <LessonSession
                    activeLessonId={activeLessonId}
                    lessons={lessons}
                    activeTab={getActiveTab()}
                    onNavigate={handleNavigate}
                    onExit={() => setActiveLessonId(null)}
                    onCompleteModule={(moduleId) => {
                        setShowCertificateId(moduleId);
                        setActiveLessonId(null);
                    }}
                />
            </Suspense>
        );
    }

    return (
        <>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/" element={<LandingPage
                        onGetStarted={() => navigate('/register')}
                        onLogin={() => navigate('/login')}
                        onRegister={() => navigate('/register')}
                        onViewCurriculum={() => navigate('/curriculum')}
                        onViewPricing={() => navigate('/pricing')}
                        onViewFeatures={() => navigate('/features')}
                        onNavigateToPage={(slug) => navigate(`/page/${slug}`)}
                        onViewPrivacy={() => navigate('/privacy')}
                        onViewTerms={() => navigate('/terms')}
                        onViewRefund={() => navigate('/refund')}
                    />} />
                    <Route path="/login" element={<Auth initialMode="LOGIN" />} />
                    <Route path="/register" element={<Auth initialMode="REGISTER" />} />

                    {/* Invite Link Redirect */}
                    <Route path="/invite/:code" element={
                        (() => {
                            const { code } = useParams();
                            return <Navigate to={`/register?invite=${code}`} replace />;
                        })()
                    } />

                    <Route path="/curriculum" element={<CurriculumPage
                        onHome={() => navigate('/')}
                        onFeatures={() => navigate('/features')}
                        onCurriculum={() => navigate('/curriculum')}
                        onPricing={() => navigate('/pricing')}
                        onLogin={() => navigate('/login')}
                        onRegister={() => navigate('/register')}
                    />} />
                    <Route path="/pricing" element={
                        // Redirect kids away from pricing page - only parents/teachers can upgrade
                        user && user.role === 'KID' ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <PricingPage
                                onHome={() => navigate('/')}
                                onFeatures={() => navigate('/features')}
                                onCurriculum={() => navigate('/curriculum')}
                                onPricing={() => navigate('/pricing')}
                                onLogin={() => navigate('/login')}
                                onRegister={() => navigate('/register')}
                                onGetStarted={(planId: string | undefined) => navigate(`/checkout/${planId || 'founder'}`)} // Pass planId, default if undefined
                            />
                        )
                    } />
                    <Route path="/checkout/:planId" element={
                        // Redirect kids away from checkout - only parents/teachers can purchase
                        user && user.role === 'KID' ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <CheckoutPage />
                        )
                    } />
                    <Route path="/features" element={<FeaturesPage
                        onHome={() => navigate('/')}
                        onFeatures={() => navigate('/features')}
                        onCurriculum={() => navigate('/curriculum')}
                        onPricing={() => navigate('/pricing')}
                        onLogin={() => navigate('/login')}
                        onRegister={() => navigate('/register')}
                    />} />
                    <Route path="/success" element={<CheckoutSuccess />} />
                    <Route path="/page/:slug" element={
                        <DynamicPageWrapper cmsContent={cmsContent} onBack={() => navigate('/')} />
                    } />
                    <Route path="/privacy" element={<PrivacyPolicyPage onBack={() => navigate('/')} />} />
                    <Route path="/terms" element={<TermsOfServicePage onBack={() => navigate('/')} />} />
                    <Route path="/refund" element={<RefundPolicyPage onBack={() => navigate('/')} />} />

                    {/* PROTECTED ROUTES */}
                    <Route path="/map" element={user?.role === UserRole.PARENT ? <Navigate to="/dashboard" replace /> : <ProtectedRoute onNavigate={handleNavigate}><KidMap onStartLesson={(id) => setActiveLessonId(id)} onNavigate={handleNavigate} /></ProtectedRoute>} />
                    <Route path="/assignments" element={<ProtectedRoute onNavigate={handleNavigate}><StudentAssignmentDashboard /></ProtectedRoute>} />
                    <Route path="/games" element={user?.role === UserRole.PARENT ? <Navigate to="/dashboard" replace /> : <ProtectedRoute onNavigate={handleNavigate} lockoutEnabled>{renderGame()}</ProtectedRoute>} />
                    <Route path="/library" element={<ProtectedRoute onNavigate={handleNavigate}><BookLibrary /></ProtectedRoute>} />
                    <Route path="/videos" element={<ProtectedRoute onNavigate={handleNavigate}><VideoLibrary /></ProtectedRoute>} />
                    <Route path="/card-academy" element={<ProtectedRoute onNavigate={handleNavigate} lockoutEnabled><CardGamePage /></ProtectedRoute>} />
                    <Route path="/real-estate" element={<ProtectedRoute onNavigate={handleNavigate} lockoutEnabled><RealEstateApp /></ProtectedRoute>} />
                    <Route path="/the-tank" element={<ProtectedRoute onNavigate={handleNavigate}><TheTankPage /></ProtectedRoute>} />
                    <Route path="/tournaments" element={<ProtectedRoute onNavigate={handleNavigate}><TournamentPage /></ProtectedRoute>} />
                    <Route path="/side-hustle" element={<ProtectedRoute onNavigate={handleNavigate} lockoutEnabled><SideHustleApp /></ProtectedRoute>} />
                    <Route path="/store" element={<ProtectedRoute onNavigate={handleNavigate} lockoutEnabled><BizStore /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute onNavigate={handleNavigate}><Leaderboard /></ProtectedRoute>} />
                    <Route path="/hq" element={<ProtectedRoute onNavigate={handleNavigate}><Headquarters /></ProtectedRoute>} />
                    <Route path="/debate" element={<ProtectedRoute onNavigate={handleNavigate}><DebateArena /></ProtectedRoute>} />
                    <Route path="/skills" element={<ProtectedRoute onNavigate={handleNavigate}><SkillTree /></ProtectedRoute>} />
                    <Route path="/portfolio" element={<ProtectedRoute onNavigate={handleNavigate}><Portfolio /></ProtectedRoute>} />
                    <Route path="/social" element={<ProtectedRoute onNavigate={handleNavigate} lockoutEnabled><SocialHub /></ProtectedRoute>} />

                    {/* User Profile Route */}
                    <Route path="/profile" element={
                        <ProtectedRoute onNavigate={handleNavigate}>
                            <UserProfile />
                        </ProtectedRoute>
                    } />

                    {/* ROLE-PROTECTED ROUTES — authentication + role checked */}
                    {/* ✅ SECURITY FIX: These routes now use RoleProtectedRoute which
                         blocks access unless the user has an allowed role, preventing
                         a KID from mounting the AdminDashboard shell by typing /admin */}
                    <Route path="/dashboard" element={
                        <RoleProtectedRoute onNavigate={handleNavigate} allowedRoles={[UserRole.PARENT, UserRole.ADMIN]}>
                            <ParentDashboard />
                        </RoleProtectedRoute>
                    } />
                    <Route path="/classroom" element={
                        <RoleProtectedRoute onNavigate={handleNavigate} allowedRoles={[UserRole.TEACHER, UserRole.ADMIN]}>
                            <TeacherDashboard />
                        </RoleProtectedRoute>
                    } />
                    <Route path="/principal" element={
                        <RoleProtectedRoute onNavigate={handleNavigate} allowedRoles={[UserRole.TEACHER, UserRole.ADMIN]}>
                            <PrincipalDashboard onLogout={() => { useAppStore.getState().logout(); navigate('/'); }} />
                        </RoleProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <RoleProtectedRoute onNavigate={handleNavigate} allowedRoles={[UserRole.ADMIN]}>
                            <AdminDashboard />
                        </RoleProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>

                {user?.role === UserRole.ADMIN && <AdminBookManager />}
            </Suspense>

            <Suspense fallback={null}>
                {user && (
                    <>
                        <LevelUpModal />
                        <PlayHubFAB />
                        <OllieChat />
                    </>
                )}
                <ReloadPrompt />
                {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}

                <GlobalModalManager />
                <PWAInstallBanner />
                {user && user.role !== UserRole.KID && (
                    <PassiveIncomeModal 
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        amount={accruedAmount}
                        propertyCount={propertyCount}
                    />
                )}

                {showCertificateId && (
                    <CertificateModal
                        showCertificateId={showCertificateId}
                        onClose={() => setShowCertificateId(null)}
                        onAdvanceLesson={(nextLessonId) => setActiveLessonId(nextLessonId)}
                    />
                )}
            </Suspense>
        </>
    );
};

// Wrap App with ErrorBoundary for crash protection
import { AuthProvider } from '../features/auth/components/AuthProvider';


const AppWithErrorBoundary = () => (
    <ErrorBoundary>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ErrorBoundary>
);

export default AppWithErrorBoundary;
