
import React, { useState } from 'react';
import { useAppStore, SHOP_ITEMS_MAP, SKILLS_MAP, MOCK_LEADERBOARD } from '../../../store';
import { formatCurrency } from '../../../utils/formatters';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { manageSubscription } from '../../../lib/stripe';
import { Clock, BookOpen, Flame, Bell, Music, RefreshCw, Check, UserPlus, Zap, TrendingUp, Award, Brain, Briefcase, CheckCircle, Users } from 'lucide-react';
import { FamilyManager } from '../../family/components/FamilyManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../../../types';
import BountyList from './BountyList';
import CreateBountyModal from './CreateBountyModal';
import YearEndReport from '../../profile/components/YearEndReport';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { resolveSubject, getLinkedChildren } from '../../../utils/userUtils';

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

    // ── Resolve which profile to display (pure util — no mutation) ──────────
    const subject = resolveSubject(user, users);
    const linkedChildren = getLinkedChildren(user.id, users);
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

    // Fallback UI for parent with no linked child (after all hooks are called)
    if (user.role === UserRole.PARENT && linkedChildren.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserPlus size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4">{t('parent.connect_child_title')}</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        {t('parent.no_child_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left: Invite Code Manager */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Users size={120} />
                        </div>
                        <FamilyManager />
                    </div>

                    {/* Right: Steps & Upgrades */}
                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">How to Connect:</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold shrink-0">1</div>
                                    <p className="text-blue-800 dark:text-blue-200 font-medium">{t('parent.connect_step_1')}</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold shrink-0">2</div>
                                    <p className="text-blue-800 dark:text-blue-200 font-medium">{t('parent.connect_step_2')}</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold shrink-0">3</div>
                                    <p className="text-blue-800 dark:text-blue-200 font-medium">{t('parent.connect_step_3')}</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                                    <Award /> {t('parent.unlock_premium_title')}
                                </h3>
                                <p className="mb-6 opacity-90 font-medium">{t('parent.unlock_premium_desc')}</p>
                                <button
                                    onClick={handleUpgradeClick}
                                    className="bg-white text-orange-600 font-black py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform w-full"
                                >
                                    {t('parent.btn_upgrade')}
                                </button>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-20 rotate-12">
                                <Award size={120} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>


            {/* SUCCESS TOAST */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-4 border-green-400"
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                                {user.role === UserRole.KID ? "CEO Report Card" : user.role === UserRole.ADMIN ? "Admin Preview: Parent View" : t('parent.title')}
                            </h2>
                            {user.role === UserRole.PARENT && (
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 ${user.subscriptionStatus === 'PREMIUM'
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50'
                                    : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                    }`}>
                                    {user.subscriptionStatus === 'PREMIUM'
                                        ? `Premium: ${user.subscriptionTier?.replace('tier_', '') || 'Active'} ${user.billingCycle ? `(${user.billingCycle})` : ''}`
                                        : 'Free Plan'}
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {user.role === UserRole.KID ? t('parent.track_empire_growth') : user.role === UserRole.ADMIN ? "Previewing mock parent interface for Admin." : t('parent.monitoring')}
                            <span className="text-kid-accent font-bold ml-1">{subject.name}</span>
                        </p>
                    </div>
                    {user.role === UserRole.PARENT && (
                        <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                            <RefreshCw size={18} /> {t('parent.sync')}
                        </button>
                    )}
                </div>

                {/* Premium Upsell Banner for Free Users */}
                {!isPremium && user.role === UserRole.PARENT && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="relative z-10 flex-1">
                            <h3 className="text-2xl font-black mb-1 flex items-center gap-2">
                                <Award /> {t('parent.unlock_premium_title')}
                            </h3>
                            <p className="opacity-90 font-medium">{t('parent.unlock_premium_desc')}</p>
                        </div>
                        <button
                            onClick={handleUpgradeClick}
                            className="bg-white text-orange-600 font-black py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform whitespace-nowrap relative z-10"
                        >
                            {t('parent.btn_upgrade')}
                        </button>
                        <div className="absolute top-0 right-0 opacity-20 rotate-12 -translate-y-4 translate-x-4 pointer-events-none">
                            <Award size={120} />
                        </div>
                    </div>
                )}

                {/* CEO REPORT CARD */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
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
                <div className="mb-8">
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
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <div className="p-4 rounded-xl border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20">
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
