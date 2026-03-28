
import React, { useState, useEffect, Suspense } from 'react';
import { useAppStore } from '../store';
import { useGameStore } from '../store/gameStore';
import { useEducationStore } from '../store/educationStore';
import { SHOP_ITEMS } from '../data/constants';
import { COURSE_MAP, getLessonBatch } from '../features/education/data/curriculum';
import { UserRole } from '../types';
import Layout from '../components/layout/Layout';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, Rocket, Pizza, Star, Smile, Lightbulb, Coffee, Music, Camera, Globe, Anchor, Cpu, Car, Zap, ArrowLeft, Loader2, Lock } from 'lucide-react';
import '../lib/i18n';
import { useTranslation } from 'react-i18next';
import { useAppSound } from '../contexts/SoundContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Logger } from '../services/logger';
import { ProtectedRoute, RoleProtectedRoute, DynamicPageWrapper } from '../routes/ProtectedRoute';

// Lazy Load ALL Components (including Auth and LandingPage)
const Auth = React.lazy(() => import('../features/auth/components/Auth'));
const LandingPage = React.lazy(() => import('../features/marketing/components/LandingPage'));
const KidMap = React.lazy(() => import('../features/hq/components/KidMap'));
const UniversalLessonEngine = React.lazy(() => import('../features/education/components/UniversalLessonEngine'));
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
const ModuleRecap = React.lazy(() => import('../features/education/components/ModuleRecap'));
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
import { PlayHubFAB } from '../components/ui/PlayHubFAB';
import { GlobalModalManager } from '../components/modals/GlobalModalManager';
import { SkeletonPageLoader } from '../components/ui/SkeletonPageLoader';
import { BottomNavigation } from '../components/layout/BottomNavigation';

// Simple Loading Spinner for Suspense fallback
const PageLoader = SkeletonPageLoader;

const ICON_MAP: Record<string, any> = {
    rocket: Rocket,
    pizza: Pizza,
    star: Star,
    smile: Smile,
    bulb: Lightbulb,
    coffee: Coffee,
    music: Music,
    camera: Camera,
    globe: Globe,
    anchor: Anchor,
    cpu: Cpu,
    car: Car,
    zap: Zap
};


const App = () => {
    const { user, toggleEquipItem, syncGames, cmsContent, activeScenario, showCertificateId, setShowCertificateId, openModal } = useAppStore();
    const { classrooms, lessons } = useEducationStore();
    const { activeGameId, setActiveGameId } = useGameStore();
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [showJoinClass, setShowJoinClass] = useState(false);

    const { playClick } = useAppSound();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

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

    // Initialize Data on Mount
    useEffect(() => {
        syncGames();
        // Initialize content moderation patterns (non-blocking)
        import('../services/ContentModerationService').then(({ ContentModerationService }) => {
            ContentModerationService.loadPatterns();
        });
    }, [syncGames]);

    // Theme Switching Effect
    useEffect(() => {
        if (user?.settings.themeMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user?.settings.themeMode]);

    // Redirect logic based on role if logged in and at public routes
    useEffect(() => {
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
    }, [user, location.pathname, navigate]);

    // Navigation Handlers (Shim for old props if needed)
    const handleNavigate = (path: string) => {
        // Map legacy "tabs" to routes
        const routeMap: Record<string, string> = {
            'the_tank': '/the-tank',
            'map': '/map',
            'assignments': '/assignments',
            'games': '/games',
            'library': '/library',
            'store': '/store',
            'leaderboard': '/leaderboard',
            'hq': '/hq',
            'skills': '/skills',
            'portfolio': '/portfolio',
            'profile': '/profile',
            'parent_dashboard': '/dashboard',
            'teacher_dashboard': user?.subscriptionTier?.startsWith('school_') ? '/principal' : '/classroom',
            'admin_dashboard': '/admin',
            'debate': '/debate',
            'videos': '/videos',
            'side-hustle': '/side-hustle',
            'real-estate': '/real-estate',
            'social': '/social'
        };
        navigate(routeMap[path] || '/');
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
        if (activeGameId === 'coffee') return <CoffeeCart onBack={() => setActiveGameId(null)} />;
        if (activeGameId === 'coffee') return <CoffeeCart onBack={() => setActiveGameId(null)} />;
        // 'the_tank' is now a standard route, no longer an overlay game here.

        // Dynamic Game Engine
        if (activeGameId && activeGameId.startsWith('BIZ_')) {
            return <GameEngine gameId={activeGameId} onExit={() => setActiveGameId(null)} />;
        }

        if (activeScenario) {
            return <ScenarioEngine />;
        }

        return <GameMenu onSelectGame={setActiveGameId} />;
    };

    const getActiveBatch = () => {
        if (!activeLessonId) return [];
        const targetLesson = lessons.find(l => l.id === activeLessonId);
        if (!targetLesson) return [];
        return lessons.filter(l => l.topic_tag === targetLesson.topic_tag);
    };

    const activeUnits = getActiveBatch();
    const LogoIcon = user?.businessLogo ? ICON_MAP[user.businessLogo.icon] || Rocket : Rocket;


    const handleNextModule = (fromModuleId?: string) => {
        let currentModuleIndex = -1;

        if (fromModuleId) {
            currentModuleIndex = COURSE_MAP.findIndex(m => m.id === fromModuleId);
        } else if (activeLessonId) {
            currentModuleIndex = COURSE_MAP.findIndex(m => m.lessonIds.includes(activeLessonId));
        }

        // 🎓 Fire certificate for the COMPLETED module (full-app certificate enable)
        if (currentModuleIndex !== -1) {
            const completedModule = COURSE_MAP[currentModuleIndex];
            if (completedModule) {
                setShowCertificateId(completedModule.id);
                setActiveLessonId(null);
                return; // ModuleRecap/certificate modal will call onNextModule again to advance
            }
        }

        setActiveLessonId(null); // Fallback to map
        setShowCertificateId(null);
    };


    const activeLessonView = activeLessonId && activeUnits.length > 0 ? (
        <UniversalLessonEngine
            key={activeUnits[0]?.id}
            units={activeUnits}
            onExit={() => setActiveLessonId(null)}
            onNextModule={handleNextModule}
            hasProject={COURSE_MAP.find(m => m.lessonIds.includes(activeLessonId))?.hasProject}
            initialLessonId={activeLessonId}
            bossGameId={COURSE_MAP.findIndex(m => m.lessonIds.includes(activeLessonId)) !== -1
                ? `SEC_${COURSE_MAP.findIndex(m => m.lessonIds.includes(activeLessonId))}_BOSS`
                : undefined}
        />
    ) : null;

    if (activeLessonView) {
        return (
            <Layout activeTab={getActiveTab()} onNavigate={handleNavigate}>
                {activeLessonView}
            </Layout>
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
                    <Route path="/login" element={<Auth onBack={() => navigate('/')} initialMode="LOGIN" />} />
                    <Route path="/register" element={<Auth onBack={() => navigate('/')} initialMode="REGISTER" />} />

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
                    <Route path="/map" element={<ProtectedRoute onNavigate={handleNavigate}><KidMap onStartLesson={(id) => setActiveLessonId(id)} /></ProtectedRoute>} />
                    <Route path="/assignments" element={<ProtectedRoute onNavigate={handleNavigate}><StudentAssignmentDashboard /></ProtectedRoute>} />
                    <Route path="/games" element={<ProtectedRoute onNavigate={handleNavigate} lockoutEnabled>{renderGame()}</ProtectedRoute>} />
                    <Route path="/library" element={<ProtectedRoute onNavigate={handleNavigate}><BookLibrary /></ProtectedRoute>} />
                    <Route path="/videos" element={<ProtectedRoute onNavigate={handleNavigate}><VideoLibrary /></ProtectedRoute>} />
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

                <AdminBookManager />
            </Suspense>

            <LevelUpModal />
            <Suspense fallback={null}>
                <OllieChat />
                <ReloadPrompt />
                {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}

                <BottomNavigation />
                <GlobalModalManager />


                {showCertificateId && (
                    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <Suspense fallback={<div className="text-white"><Loader2 className="animate-spin" /></div>}>
                            <ModuleRecap
                                moduleTitle={COURSE_MAP.find(m => m.id === showCertificateId)?.title || "Module Complete"}
                                lessons={getLessonBatch(showCertificateId)}
                                totalXp={500}
                                onClose={() => setShowCertificateId(null)}
                                onNextModule={() => {
                                    // Advance to the NEXT module after the certificate is dismissed
                                    const completedIndex = COURSE_MAP.findIndex(m => m.id === showCertificateId);
                                    setShowCertificateId(null);
                                    if (completedIndex !== -1 && completedIndex < COURSE_MAP.length - 1) {
                                        const nextModule = COURSE_MAP[completedIndex + 1];
                                        if (nextModule?.lessonIds?.length > 0) {
                                            setActiveLessonId(nextModule.lessonIds[0]);
                                            return;
                                        }
                                    }
                                    setActiveLessonId(null); // Last module — back to map
                                }}
                            />
                        </Suspense>
                    </div>
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
