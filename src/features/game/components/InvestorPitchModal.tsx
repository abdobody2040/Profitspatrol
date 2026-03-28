import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, SUBSCRIPTION_PLANS } from '../../../store';
import { X, Check, Loader2, Shield, Rocket, Users, Crown, Star } from 'lucide-react';
import { SubscriptionTier } from '../../../types';
import { useTranslation } from 'react-i18next';
import { Logger } from '../../../services/logger';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// Map Plan IDs to Translation Keys for Features
const PLAN_FEATURES_KEYS: Record<string, string[]> = {
    intern: ['feat_limited_energy', 'feat_standard_lessons', 'feat_ads'],
    founder: ['feat_unlimited', 'feat_offline', 'feat_custom_hq'],
    board: ['feat_family', 'feat_parent_dash', 'feat_founder_perks'],
    tycoon: ['feat_ai_consultant', 'feat_negotiation', 'feat_board_perks']
};

const InvestorPitchModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, upgradeSubscription } = useAppStore();
    const [processingTier, setProcessingTier] = useState<string | null>(null);
    const { t } = useTranslation();

    // Invite Code State
    const [inviteCode, setInviteCode] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);

    if (!user) return null;

    const handleUpgrade = (tier: string) => {
        if (tier === user.subscriptionTier) return;

        setProcessingTier(tier);

        // Simulate API / Payment delay (1 second)
        setTimeout(() => {
            upgradeSubscription(tier as SubscriptionTier);
            setProcessingTier(null);
            onClose();
            alert(t('common.save') + "! " + t(`pricing_page.tier_${tier}` as any) + " Active.");
        }, 1000);
    };

    const handleInviteSubmit = async () => {
        if (!inviteCode.trim()) return;
        setInviteLoading(true);
        setInviteError(null);

        try {
            // 1. Verify Code
            const { data: parent, error: findError } = await import('../../../lib/supabase').then(({ supabase }) =>
                supabase!.rpc('get_profile_by_invite_code', { code: inviteCode.trim().toUpperCase() }).single()
            ) as { data: { id: string } | null, error: any };

            if (findError || !parent) {
                throw new Error("Invalid invite code.");
            }

            // 2. Link Account
            const { error: linkError } = await import('../../../lib/supabase').then(({ supabase }) =>
                supabase!.from('profiles').update({ parent_id: parent.id }).eq('id', user.id)
            );

            if (linkError) throw linkError;

            // 3. Refresh & Close
            onClose();
            alert("Success! You are now linked to a Parent Account.");
            window.location.reload();

        } catch (err) {
            // ✅ SECURITY FIX: Raw Supabase errors could expose DB schema in prod console
            Logger.error('InvestorPitchModal: Invite code link failed', err);
            setInviteError('Invalid code. Please try again.');
        } finally {
            setInviteLoading(false);
        }
    };

    const getButtonText = (planId: string, price: number) => {
        if (price === 0) return t('pricing_page.btn_current' as any);
        if (planId === 'founder') return `${t('pricing_page.btn_get_funded' as any)} ($${price})`;
        if (planId === 'board') return `${t('pricing_page.btn_start_family' as any)} ($${price})`;
        if (planId === 'tycoon') return `${t('pricing_page.btn_hire_ollie' as any)} ($${price})`;
        return `${t('pricing_page.btn_select' as any)}`;
    };

    const getIcon = (id: string) => {
        switch (id) {
            case 'intern': return <Shield size={28} className="text-gray-400" />;
            case 'founder': return <Rocket size={28} className="text-blue-500" />;
            case 'board': return <Users size={28} className="text-purple-500" />;
            case 'tycoon': return <Crown size={28} className="text-yellow-500" />;
            default: return <Star size={28} />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-7xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border-2 border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 text-center bg-gray-900 dark:bg-black text-white relative shrink-0">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-3xl md:text-4xl font-black mb-2">
                                {user.role === 'KID' ? "Content Locked" : t('pricing_page.title')}
                            </h2>
                            <p className="text-gray-400 font-medium text-lg">
                                {user.role === 'KID' ? t('pricing_page.kid_locked_subtitle' as any, { defaultValue: 'A premium subscription is required.' }) : t('pricing_page.subtitle')}
                            </p>
                        </div>

                        {/* Invite Code Section (For Kids) - Hidden as per instruction */}
                        {/* {user.role === 'KID' && !user.parentId && (
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800 flex flex-col md:flex-row items-center justify-center gap-4">
                                <div className="text-indigo-800 dark:text-indigo-200 font-bold text-sm md:text-base flex items-center gap-2">
                                    <Users size={20} />
                                    Have a Parent Invite Code?
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl px-4 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-300 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-48"
                                    />
                                    <button
                                        onClick={handleInviteSubmit}
                                        disabled={inviteLoading || !inviteCode}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {inviteLoading ? <Loader2 className="animate-spin" size={20} /> : 'Link Account'}
                                    </button>
                                </div>
                                {inviteError && <div className="text-red-500 font-bold text-xs">{inviteError}</div>}
                            </div>
                        )} */}

                        {/* Grid */}
                        <div className="p-6 md:p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-1 flex flex-col items-center justify-center">
                            {user.role === 'KID' ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-6 rounded-full mb-6 text-yellow-500 shadow-inner">
                                        <Crown size={64} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">
                                        Premium Content
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">
                                        {user.parentId
                                            ? "Tell your parent to upgrade the Family Plan to unlock this!"
                                            : "Ask your parents to link your account and upgrade the Family Plan to unlock this!"}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {SUBSCRIPTION_PLANS.map((plan) => {
                                        const isCurrent = user.subscriptionTier === plan.id;
                                        const isProcessing = processingTier === plan.id;
                                        const isTycoon = plan.id === 'tycoon';
                                        const featureKeys = PLAN_FEATURES_KEYS[plan.id] || [];

                                        return (
                                            <div
                                                key={plan.id}
                                                className={`relative flex flex-col p-6 rounded-2xl border-4 transition-all duration-200
                                    ${plan.color} dark:bg-gray-800 dark:border-gray-700
                                    ${isCurrent ? 'opacity-70 ring-0 grayscale-[0.5]' : 'hover:scale-[1.02] shadow-sm hover:shadow-xl'}
                                    ${isTycoon ? 'shadow-lg border-yellow-400 dark:border-yellow-500' : ''}
                                `}
                                            >
                                                {isTycoon && (
                                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap flex items-center gap-1">
                                                        <Star size={12} fill="currentColor" /> {t('pricing_page.most_popular')}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
                                                        {getIcon(plan.id)}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-gray-900 dark:text-white">${plan.price}</div>
                                                        {plan.price > 0 && <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t(`pricing_page.per_${plan.interval}` as any)}</div>}
                                                    </div>
                                                </div>

                                                {/* Dynamic Translation of Tier Name */}
                                                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">{t(`pricing_page.tier_${plan.id}` as any)}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-6 min-h-[40px] leading-snug">
                                                    {t(`pricing_page.desc_${plan.id}` as any)}
                                                </p>

                                                <div className="space-y-3 mb-8 flex-1">
                                                    {featureKeys.map((key, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" strokeWidth={4} />
                                                            <span className="leading-tight">{t(`pricing_page.${key}` as any)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => handleUpgrade(plan.id)}
                                                    disabled={isCurrent || isProcessing || (processingTier !== null)}
                                                    className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md
                                        ${isCurrent
                                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default shadow-none'
                                                            : plan.buttonColor}
                                        ${isProcessing ? 'opacity-80 cursor-wait' : ''}
                                    `}
                                                >
                                                    {isProcessing ? (
                                                        <><Loader2 size={18} className="animate-spin" /> {t('pricing_page.processing')}</>
                                                    ) : isCurrent ? (
                                                        t('pricing_page.btn_current')
                                                    ) : (
                                                        getButtonText(plan.id, plan.price)
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer (Hide for Kids) */}
                        {user.role !== 'KID' && (
                            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-center text-xs font-bold text-gray-500 shrink-0 flex items-center justify-center gap-2">
                                <Shield size={16} className="text-green-500" />
                                Secure payment via Stripe
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InvestorPitchModal;
