
import React, { useState } from 'react';
import { useAppStore, SHOP_ITEMS_MAP, SKILLS_MAP, MOCK_LEADERBOARD } from '../../../store';
import { formatCurrency } from '../../../utils/formatters';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { manageSubscription } from '../../../lib/stripe';
import { Clock, BookOpen, Flame, Bell, Music, RefreshCw, Check, UserPlus, Zap, TrendingUp, Award, Brain, Briefcase, CheckCircle, Users } from 'lucide-react';
import { FamilyManager } from '../../family/components/FamilyManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, UserRole } from '../../../types';
import BountyList from './BountyList';
import CreateBountyModal from './CreateBountyModal';
import YearEndReport from '../../profile/components/YearEndReport';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { resolveSubject, getLinkedChildren } from '../../../utils/userUtils';
import { HeroMentorshipParentCard } from './HeroMentorshipParentCard';

const ParentDashboard: React.FC = () => {
    const { user, users, updateUser, upgradeSubscription, library } = useAppStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showBountyModal, setShowBountyModal] = useState(false);
    const [successPlan, setSuccessPlan] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    React.useEffect(() => {
        if (searchParams.get('payment_success') === 'true') {
            const latestPlan = searchParams.get('plan') || user?.subscriptionTier || 'premium';

            // Optimistic upgrade for mock environments or if webhook arrives late
            if (user?.subscriptionTier !== latestPlan) {
                upgradeSubscription(latestPlan as any);
            }

            setSuccessPlan(latestPlan);
            setShowSuccessToast(true);

            // Clean up URL
            searchParams.delete('payment_success');
            searchParams.delete('plan');
            setSearchParams(searchParams);

            setTimeout(() => setShowSuccessToast(false), 5000);
        }
    }, [searchParams, setSearchParams, user, upgradeSubscription]);

    const handleUpgradeClick = () => {
        navigate('/pricing');
    };

    // Guard: Return null if user doesn't exist
    if (!user) return null;

    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

    // ── Resolve which profile to display (pure util — no mutation) ──────────
    const linkedChildren = getLinkedChildren(user.id, users);
    const hasLinkedChild = linkedChildren.length > 0;
    const isParentUnlinked = user.role === UserRole.PARENT && !hasLinkedChild;

    // Rich sample preview child for parents who have not connected a child yet
    const sampleChild: User = {
        id: 'sample_child_preview',
        name: 'Alex (Sample Explorer)',
        username: 'alex_explorer',
        role: UserRole.KID,
        xp: 2850,
        level: 7,
        streak: 6,
        lastActivityDate: new Date().toISOString().split('T')[0],
        ppTokens: 420,
        currentModuleId: 'module_03',
        completedLessonIds: ['lesson_budget_1', 'lesson_save_1', 'lesson_invest_1', 'lesson_brand_1'],
        readBookIds: ['b1', 'b2'],
        badges: ['badge_first_saver', 'badge_budget_boss'],
        inventory: ['item_desk', 'item_laptop'],
        unlockedSkills: ['STRATEGY', 'CHARISMA', 'EFFICIENCY'],
        portfolio: [],
        equippedItems: [],
        placedItems: [],
        properties: [],
        hqLevel: '3',
        subscriptionStatus: 'PREMIUM',
        subscriptionTier: 'founder',
        energy: 5,
        lastEnergyRefill: Date.now(),
        settings: {
            soundEnabled: true,
            musicEnabled: true,
            dailyGoalMinutes: 15,
            themeColor: 'blue',
            themeMode: 'light',
            ageMode: 'explorer',
        }
    };

    // Pick active subject: explicit child selection -> linked child -> sample child fallback
    let subject: User;
    if (user.role === UserRole.PARENT) {
        if (hasLinkedChild) {
            subject = (selectedChildId ? linkedChildren.find(c => c.id === selectedChildId) : null)
                || resolveSubject(user, users)
                || linkedChildren[0];
        } else {
            subject = sampleChild;
        }
    } else {
        subject = resolveSubject(user, users);
    }

    const isPremium = user.subscriptionStatus === 'PREMIUM';

    // ── Domain stats (all O(1) HashMaps, memoised inside hook) ───────────────
    const { netWorth, rank, strongestSkill, booksRead } = useDashboardStats(
        subject,
        SHOP_ITEMS_MAP,
        SKILLS_MAP,
        MOCK_LEADERBOARD,
        library
    );

    // Derived convenience values for JSX
    const rankLabel = rank.label;
    const percentile = rank.percentile;

    // Mock graph data based on XP
    const xpGraphData = [
        { day: 'Mon', xp: Math.max(0, subject.xp - 300) },
        { day: 'Tue', xp: Math.max(0, subject.xp - 250) },
        { day: 'Wed', xp: Math.max(0, subject.xp - 180) },
        { day: 'Thu', xp: Math.max(0, subject.xp - 100) },
        { day: 'Fri', xp: Math.max(0, subject.xp - 50) },
        { day: 'Sat', xp: subject.xp }, // Today
        { day: 'Sun', xp: 0 },
    ];

    const displayGraph = xpGraphData.map((d, i, arr) => {
        const prev = i > 0 ? arr[i - 1].xp : 0;
        return { day: d.day, xp: Math.max(0, d.xp - prev) };
    });
    displayGraph[5].xp = 50;

    const maxXP = Math.max(...displayGraph.map(d => d.xp), 100);

    const handlePaymentSuccess = () => {
        // Fallback for mock test payments if still used
        upgradeSubscription('tycoon');
        setSuccessPlan('tycoon');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
    };

    const handleManage = async () => {
        setIsProcessing(true);
        const url = await manageSubscription();
        alert(`Opening Billing Portal... \n(Simulated: ${url})`);
        setIsProcessing(false);
    };

    return (
        <>


            {/* SUCCESS TOAST */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-8 start-1/2 -translate-x-1/2 z-[150] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-4 border-green-400"
                    >
                        <div className="bg-white text-green-600 rounded-full p-1"><Check size={24} strokeWidth={4} /></div>
                        <div>
                            <h4 className="font-black text-lg">{t('parent.welcome_premium')}</h4>
                            <p className="font-medium text-sm text-green-100">
                                You have successfully upgraded to the <span className="font-bold uppercase tracking-wider">{successPlan}</span> plan!
                                (Billed Annually)
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border-4 border-white dark:border-gray-700">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <motion.img 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                src="/assets/ollie_head.png" 
                                className="w-24 h-24 object-contain drop-shadow-2xl" 
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight">
                                    {user.role === UserRole.KID ? "CEO Report Card" : user.role === UserRole.ADMIN ? "Admin Preview: Parent View" : t('parent.title')}
                                </h2>
                                {user.role === UserRole.PARENT && (
                                    <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 shadow-sm ${user.subscriptionStatus === 'PREMIUM'
                                        ? 'bg-yellow-400 text-yellow-900 border-white'
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                        {user.subscriptionStatus === 'PREMIUM'
                                            ? `✨ PREMIUM`
                                            : 'FREE PLAN'}
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mt-1">
                                {user.role === UserRole.KID ? t('parent.track_empire_growth') : user.role === UserRole.ADMIN ? "Previewing mock parent interface for Admin." : t('parent.monitoring')}
                                <span className="text-kid-accent font-black ms-2 text-xl">{subject.name}</span>
                                {isParentUnlinked && (
                                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 rounded-full ms-2">
                                        Sample Child Preview
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    {user.role === UserRole.PARENT && (
                        <div className="flex items-center gap-3">
                            {hasLinkedChild && linkedChildren.length > 1 && (
                                <select
                                    value={subject.id}
                                    onChange={(e) => setSelectedChildId(e.target.value)}
                                    className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-2.5 font-bold text-gray-800 dark:text-white outline-none shadow-sm"
                                >
                                    {linkedChildren.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                            <button className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-2xl font-black shadow-[0_4px_0_0_rgba(209,213,219,1)] btn-juicy flex items-center gap-2 transition-all border-2 border-gray-100">
                                <RefreshCw size={18} /> {t('parent.sync')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Connect Child Banner for Unlinked Parents */}
                {isParentUnlinked && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-blue-400/40"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                <UserPlus size={36} className="text-white drop-shadow" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-2xl font-black">{t('parent.connect_child_title', "Connect Your Child's Account")}</h3>
                                    <span className="bg-yellow-400 text-yellow-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                        ACTION NEEDED
                                    </span>
                                </div>
                                <p className="text-blue-100 text-sm md:text-base font-medium mt-1 max-w-2xl">
                                    {t('parent.no_child_desc', "Share your invite code with your child so their live gameplay and learning analytics appear here. You are currently exploring a sample student preview!")}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('family-manager-section');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full md:w-auto bg-white text-indigo-700 hover:bg-blue-50 font-black px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 text-sm btn-juicy"
                            >
                                <Users size={18} /> {t('parent.view_invite_code', 'Get Family Invite Code')}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Premium Upsell Banner for Free Users */}
                {!isPremium && user.role === UserRole.PARENT && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="relative z-10 flex-1">
                            <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                                <Award className="animate-bounce" /> {t('parent.unlock_premium_title')}
                            </h3>
                            <p className="text-lg opacity-90 font-bold leading-relaxed">{t('parent.unlock_premium_desc')}</p>
                        </div>
                        <button
                            onClick={handleUpgradeClick}
                            className="bg-white text-orange-600 font-black py-4 px-10 rounded-2xl shadow-[0_6px_0_0_rgba(255,255,255,0.4)] btn-juicy text-lg relative z-10"
                        >
                            {t('parent.btn_upgrade')}
                        </button>
                        <div className="absolute top-0 end-0 opacity-20 rotate-12 -translate-y-4 translate-x-4 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                            <Award size={180} />
                        </div>
                    </div>
                )}

                {/* CEO REPORT CARD */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 end-0 p-4 opacity-10">
                        <Award size={150} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {/* Net Worth */}
                        <div className="space-y-2">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('parent.net_worth')}</div>
                            <div className="text-4xl font-black text-green-600 dark:text-green-400 truncate" title={formatCurrency(Math.floor(netWorth.total))}>{formatCurrency(Math.floor(netWorth.total))}</div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <TrendingUp size={12} className={percentile > 50 ? "text-green-500" : "text-yellow-500"} /> {rankLabel}
                            </div>
                        </div>

                        {/* CEO Level */}
                        <div className="space-y-2">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('parent.ceo_rank')}</div>
                            <div className="text-4xl font-black text-gray-800 dark:text-white">{t('parent.level')} {subject.level}</div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-3/4"></div>
                            </div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{subject.xp} {t('parent.xp_earned')}</div>
                        </div>

                        {/* Strongest Skill */}
                        <div className="space-y-2">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('parent.top_skill')}</div>
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${
                                    strongestSkill.category === 'NONE' ? 'bg-gray-100 text-gray-400'
                                    : strongestSkill.category === 'CHARISMA' ? 'bg-pink-100 text-pink-600'
                                    : strongestSkill.category === 'EFFICIENCY' ? 'bg-blue-100 text-blue-600'
                                    : 'bg-purple-100 text-purple-600'
                                }`}>
                                    {strongestSkill.category === 'NONE' ? <Zap size={24} />
                                    : strongestSkill.category === 'CHARISMA' ? <Zap size={24} />
                                    : strongestSkill.category === 'EFFICIENCY' ? <Clock size={24} />
                                    : <Brain size={24} />}
                                </div>
                                {strongestSkill.category === 'NONE'
                                    ? t('parent.none_yet')
                                    : t(`skills.cat_${strongestSkill.category.toLowerCase()}` as any)}
                            </div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                {subject.unlockedSkills.length} {t('parent.skills_unlocked')}
                            </div>
                        </div>

                        {/* Reading Stats */}
                        <div className="space-y-2">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('parent.library')}</div>
                            <div className="text-4xl font-black text-yellow-500">{booksRead.length}</div>
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400">{t('parent.books_completed')}</div>
                        </div>
                    </div>
                </div>

                {/* Hero Mentorship & Real-World Learning Moments */}
                <HeroMentorshipParentCard childName={subject.name} />

                {/* Books Read List */}
                {booksRead.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-3xl p-6">
                        <h3 className="text-lg font-black text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                            <BookOpen size={20} /> {t('parent.reading_list')}
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {booksRead.map((book: any) => (
                                <div key={book.id} className="min-w-[200px] bg-white dark:bg-gray-800 p-3 rounded-xl border border-amber-100 dark:border-gray-700 shadow-sm flex gap-3 items-center">
                                    <img src={book.coverUrl} alt="Cover" className="w-10 h-14 object-cover rounded bg-gray-200" loading="lazy" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-800 dark:text-white text-sm truncate">{book.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{book.author}</div>
                                    </div>
                                    <div className="text-green-500"><CheckCircle size={16} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Cards (Legacy) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<Clock className="text-blue-500" />} label={t('parent.stat_xp')} value={subject.xp.toString()} color="bg-blue-50 dark:bg-blue-900/20" />
                    <StatCard icon={<Briefcase className="text-green-500" />} label={t('parent.stat_lessons')} value={subject.completedLessonIds.length.toString()} color="bg-green-50 dark:bg-green-900/20" />
                    <StatCard icon={<Flame className="text-orange-500" />} label={t('parent.stat_streak')} value={`${subject.streak} ${t('stats.days')}`} color="bg-orange-50 dark:bg-orange-900/20" />
                </div>

                {/* Family Management Section */}
                <div 
                    id="family-manager-section" 
                    className={`mb-8 scroll-mt-24 transition-all rounded-3xl ${
                        isParentUnlinked ? 'ring-4 ring-blue-500/30' : ''
                    }`}
                >
                    <FamilyManager />
                </div>

                {/* YEAR-END REPORT CARD */}
                <div className="max-w-full">
                    <YearEndReport />
                </div>

                {/* Family Job Board */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Briefcase className="text-blue-500" /> {t('parent.job_board')}
                        </h3>
                        {user.role === UserRole.PARENT && (
                            <button onClick={() => setShowBountyModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors">
                                <Briefcase size={16} /> {t('parent.post_job')}
                            </button>
                        )}
                    </div>
                    <BountyList role={user.role} />
                </div>

                {/* Activity Graph */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{t('parent.graph_title')}</h3>
                    <div className="h-64 flex items-end justify-between gap-4" dir="ltr">
                        {displayGraph.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full flex justify-end flex-col h-full rounded-t-xl overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
                                    <div
                                        className="w-full bg-kid-primary rounded-t-xl transition-all duration-1000 ease-out relative group-hover:opacity-80"
                                        style={{ height: `${(d.xp / maxXP) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 start-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {d.xp}xp
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings Control Panel (Only if viewing as Parent or if user is owner) */}
                {user.role === UserRole.PARENT && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <span>⚙️</span> {t('parent.settings_title')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('parent.label_goal')}</label>
                                    <select
                                        value={subject.settings.dailyGoalMinutes}
                                        onChange={(e) => updateUser(subject.id, { settings: { ...subject.settings, dailyGoalMinutes: parseInt(e.target.value) } })}
                                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-bold text-gray-700 dark:text-white focus:border-kid-accent outline-none"
                                    >
                                        <option value={10}>10 Min</option>
                                        <option value={15}>15 Min</option>
                                        <option value={30}>30 Min</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300"><Bell size={20} /></div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('parent.label_sound')}</span>
                                    </div>
                                    <Toggle
                                        checked={subject.settings.soundEnabled}
                                        onChange={() => updateUser(subject.id, { settings: { ...subject.settings, soundEnabled: !subject.settings.soundEnabled } })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300"><Music size={20} /></div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('parent.label_music')}</span>
                                    </div>
                                    <Toggle
                                        checked={subject.settings.musicEnabled}
                                        onChange={() => updateUser(subject.id, { settings: { ...subject.settings, musicEnabled: !subject.settings.musicEnabled } })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border-s-4 border-red-400 bg-red-50 dark:bg-red-900/20">
                                    <h4 className="font-bold text-red-700 dark:text-red-400 mb-1">{t('parent.danger_zone')}</h4>
                                    <p className="text-xs text-red-500 dark:text-red-300 mb-4">{t('parent.danger_desc')}</p>
                                    <button className="text-sm bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                        {t('parent.reset_pwd')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <CreateBountyModal isOpen={showBountyModal} onClose={() => setShowBountyModal(false)} />
        </>
    );
};

const StatCard = ({ icon, label, value, color }: any) => (
    <div className={`${color} p-6 rounded-2xl flex items-center gap-4`}>
        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">{icon}</div>
        <div>
            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">{label}</div>
            <div className="text-2xl font-black text-gray-800 dark:text-white">{value}</div>
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: any) => (
    <button
        onClick={onChange}
        className={`w-14 h-8 rounded-full p-1 transition-colors ${checked ? 'bg-kid-secondary' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default ParentDashboard;
