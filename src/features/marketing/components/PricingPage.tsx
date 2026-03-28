
import React, { useState } from 'react';
import { Check, Crown, Star, Shield, Users, Rocket, School, BookOpen, GraduationCap } from 'lucide-react';
import { useAppStore, SUBSCRIPTION_PLANS } from '../../../store';
import { useTranslation } from 'react-i18next';
import PublicNavbar from '../../../components/layout/PublicNavbar';
import { SubscriptionTier } from '../../../types';

interface PricingPageProps {
    onHome: () => void;
    onFeatures: () => void;
    onCurriculum: () => void;
    onPricing: () => void;
    onLogin: () => void;
    onRegister: () => void;
    onGetStarted: (planId?: string) => void;
}

const PLAN_FEATURES_KEYS: Record<SubscriptionTier, string[]> = {
    intern: ['feat_1_biz_slot', 'feat_standard_energy', 'feat_core_lessons', 'feat_standard_avatar'],
    founder: ['feat_unlimited_energy', 'feat_3_biz_slots', 'feat_custom_hq', 'feat_offline_mode', 'feat_no_ads'],
    board: ['feat_3_child_accounts', 'feat_parent_dash_pro', 'feat_all_founder_perks'],
    tycoon: ['feat_hire_ollie', 'feat_gold_skin', 'feat_advanced_modules', 'feat_beta_access'],
    classroom: ['feat_classroom_mgmt', 'feat_curriculum_mode', 'feat_gradebook'],
    teacher_solo: ['feat_class_mgmt', 'feat_curriculum_mode', 'feat_basic_gradebook', 'feat_school_hours'],
    teacher_pro: ['feat_unlimited_classrooms', 'feat_advanced_gradebook', 'feat_data_export', 'feat_priority_support'],
    school_small: ['feat_lms_sync', 'feat_school_leaderboard', 'feat_admin_dash_school', 'feat_unlocked_content'],
    school_medium: ['feat_lms_sync', 'feat_school_leaderboard', 'feat_admin_dash_school', 'feat_unlocked_content', 'feat_priority_support'],
    school_large: ['feat_lms_sync', 'feat_school_leaderboard', 'feat_admin_dash_school', 'feat_unlocked_content', 'feat_dedicated_manager']
};

const PricingPage: React.FC<PricingPageProps> = ({
    onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister, onGetStarted
}) => {
    const { t } = useTranslation();
    const { user } = useAppStore();
    const [billingCycle, setBillingCycle] = useState<'mo' | 'yr'>('yr');
    const [audience, setAudience] = useState<'family' | 'school'>('family'); // B2C vs B2B

    const getPriceDisplay = (planId: string, basePrice: number, interval: string) => {
        if (basePrice === 0) return { price: 0, text: '$0' };

        // Custom Logic for overrides
        if (billingCycle === 'mo') {
            if (planId === 'founder') return { price: 9.99, text: '$9.99', suffix: t('pricing_page.per_mo') };
            if (planId === 'board') return { price: 14.99, text: '$14.99', suffix: t('pricing_page.per_mo') };
            if (planId === 'tycoon') return { price: 89.99, text: '$89.99', suffix: t('pricing_page.billed_yearly'), note: t('pricing_page.annual_only') }; // Tycoon is annual only
        } else {
            // Yearly Billing (Show monthly equivalent)
            if (planId === 'founder') return { price: 8.25, text: '$8.25', suffix: t('pricing_page.per_mo'), note: t('pricing_page.billed_yearly') }; // $99/yr
            if (planId === 'board') return { price: 9.99, text: '$9.99', suffix: t('pricing_page.per_mo'), note: t('pricing_page.billed_yearly') }; // $119/yr
            if (planId === 'tycoon') return { price: 7.50, text: '$7.50', suffix: t('pricing_page.per_mo'), note: t('pricing_page.billed_yearly') }; // $89.99/yr
        }

        let defaultSuffix = '';
        if (basePrice > 0) {
            defaultSuffix = interval === 'yr' ? t('pricing_page.billed_yearly') : t('pricing_page.per_mo');
        }

        return { price: basePrice, text: `$${basePrice}`, suffix: defaultSuffix };
    };

    const getButtonText = (planId: string, price: number) => {
        if (price === 0 && planId === 'intern') return t('pricing_page.btn_start_free');
        if (price === 0 && planId === 'classroom') return t('pricing_page.btn_start_teaching');
        if (price === 0 && planId === 'teacher_solo') return t('pricing_page.btn_start_teaching');
        if (planId === 'founder') return t('pricing_page.btn_build_empire');
        if (planId === 'board') return t('pricing_page.btn_join_board');
        if (planId === 'tycoon') return t('pricing_page.btn_hire_ollie');
        if (planId === 'teacher_pro') return t('pricing_page.btn_upgrade_pro');
        if (planId.startsWith('school_')) return t('pricing_page.btn_get_license');
        return t('pricing_page.btn_select');
    };

    // Filter plans based on Audience
    const visiblePlans = SUBSCRIPTION_PLANS.filter(p => {
        const schoolPlans = ['teacher_solo', 'teacher_pro', 'school_small', 'school_medium', 'school_large'];
        if (audience === 'school') return schoolPlans.includes(p.id);
        return !schoolPlans.includes(p.id);
    });

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
            <PublicNavbar
                onHome={onHome}
                onFeatures={onFeatures}
                onCurriculum={onCurriculum}
                onPricing={onPricing}
                onLogin={onLogin}
                onRegister={onRegister}
            />

            <div className="bg-gradient-to-b from-blue-50 to-white p-8 border-b border-blue-100 pt-32">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-black mb-6 text-gray-900">{t('pricing_page.title')}</h1>
                    <p className="text-xl text-gray-500 font-medium mb-10">{t('pricing_page.subtitle')}</p>

                    {/* AUDIENCE TOGGLE */}
                    <div className="flex justify-center gap-4 mb-8">
                        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                            <button
                                onClick={() => setAudience('family')}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${audience === 'family' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t('pricing_page.toggle_families')}
                            </button>
                            <button
                                onClick={() => setAudience('school')}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${audience === 'school' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t('pricing_page.toggle_schools')}
                            </button>
                        </div>
                    </div>

                    {/* BILLING TOGGLE (Only for Families) */}
                    {audience === 'family' && (
                        <div className="flex justify-center items-center gap-3 mb-8" dir="ltr">
                            <span className={`text-sm font-bold ${billingCycle === 'mo' ? 'text-gray-900' : 'text-gray-400'}`}>{t('pricing_page.per_mo')}</span>
                            <button
                                onClick={() => setBillingCycle(prev => prev === 'mo' ? 'yr' : 'mo')}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${billingCycle === 'yr' ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yr' ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-bold ${billingCycle === 'yr' ? 'text-gray-900' : 'text-gray-400'}`}>
                                {t('pricing_page.billed_yearly')} <span className="text-green-500 text-xs ml-1">(-20%)</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${audience === 'school' ? 'xl:grid-cols-3 justify-center max-w-5xl mx-auto' : 'lg:grid-cols-4'}`}>

                    {visiblePlans.map((plan) => {
                        const isRecommended = (plan as any).recommended;
                        const Icon = getPlanIcon(plan.id);
                        const featureKeys = PLAN_FEATURES_KEYS[plan.tier] || [];
                        const { text: priceText, note: priceNote, suffix: priceSuffix } = getPriceDisplay(plan.id, plan.price, plan.interval);

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-6 flex flex-col h-full transition-all duration-300
                            ${plan.color} ${isRecommended ? 'shadow-xl scale-105 z-10 border-2' : 'border shadow-sm hover:shadow-md'}
                        `}
                            >
                                {isRecommended && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                                        {t('pricing_page.most_popular')}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-xl bg-white shadow-sm text-gray-700`}>
                                        {Icon}
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800">{t(`pricing_page.tier_${plan.id}` as any)}</h3>
                                </div>

                                <div className="mb-2">
                                    <span className="text-4xl font-black text-gray-900">{priceText}</span>
                                    {priceSuffix && <span className="text-gray-500 font-bold ml-1">{priceSuffix}</span>}
                                </div>
                                {
                                    priceNote && (
                                        <p className="text-xs text-green-600 font-bold mb-4">{priceNote}</p>
                                    )
                                }
                                {!priceNote && <div className="mb-8"></div>}

                                <p className="text-sm text-gray-500 font-medium mb-6 min-h-[40px]">
                                    {t(`pricing_page.desc_${plan.id}` as any)}
                                </p>

                                <div className="space-y-3 mb-8 flex-1">
                                    {featureKeys.map((key) => (
                                        <div key={key} className="flex items-start gap-2 text-sm font-bold text-gray-700">
                                            <Check size={16} className="text-green-500 shrink-0 mt-0.5" strokeWidth={3} />
                                            {t(`pricing_page.${key}` as any)}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => onGetStarted(plan.id)}
                                    disabled={user?.role === 'KID' && plan.price > 0}
                                    className={`w-full py-3 rounded-xl font-black transition-all shadow-sm ${user?.role === 'KID' && plan.price > 0
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : plan.buttonColor
                                        }`}
                                >
                                    {user?.role === 'KID' && plan.price > 0
                                        ? t('pricing_page.ask_parent')
                                        : getButtonText(plan.id, plan.price)
                                    }
                                </button>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

// Helper to get icon based on ID
const getPlanIcon = (id: string) => {
    switch (id) {
        case 'intern': return <Shield size={24} />;
        case 'founder': return <Rocket size={24} className="text-blue-500" />;
        case 'board': return <Users size={24} className="text-purple-500" />;
        case 'tycoon': return <Crown size={24} className="text-yellow-500" />;
        case 'classroom': return <School size={24} className="text-green-500" />;
        case 'teacher_solo': return <BookOpen size={24} className="text-green-600" />;
        case 'teacher_pro': return <Star size={24} className="text-teal-600" />;
        case 'school_small': return <GraduationCap size={24} className="text-indigo-500" />;
        case 'school_medium': return <School size={24} className="text-indigo-600" />;
        case 'school_large': return <Crown size={24} className="text-indigo-800" />;
        default: return <Star size={24} />;
    }
};

export default PricingPage;
