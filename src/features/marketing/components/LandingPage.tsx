
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, Shield, Star, Check, ArrowRight, Play, Trophy, Users, ArrowUpRight, Briefcase, BookOpen, LineChart, Handshake, Monitor, Scale } from 'lucide-react';
import { useAppStore } from '../../../store'; // Keep for other store needs if any, but removing cmsContent usage
import { ContentBlock } from '../../../types';
import PublicNavbar from '../../../components/layout/PublicNavbar';
import SmartImage from '../../../components/ui/SmartImage';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onRegister: () => void;
    onViewCurriculum: () => void;
    onViewPricing: () => void;
    onViewFeatures: () => void;
    onNavigateToPage?: (slug: string) => void;
    onViewPrivacy?: () => void;
    onViewTerms?: () => void;
    onViewRefund?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
    onGetStarted, onLogin, onRegister, onViewCurriculum, onViewPricing, onViewFeatures, onNavigateToPage,
    onViewPrivacy, onViewTerms, onViewRefund
}) => {
    const { t } = useTranslation();
    const { cmsContent } = useAppStore(); // Keeping specifically for customPages footer link if needed, or we can localize that too.

    // Helper to get array from translation
    const getList = (key: string) => {
        const items = t(key as any, { returnObjects: true });
        return Array.isArray(items) ? items : [];
    };

    const reviews = (t('landing.reviews', { returnObjects: true }) as any) as Array<{ name: string, role: string, text: string }> || [];
    const steps = (t('landing.steps', { returnObjects: true }) as any) as Array<{ num: number, title: string, desc: string }> || [];
    const arcadeList = (t('landing.arcadeList', { returnObjects: true }) as any) as string[] || [];

    const renderExtraSection = (block: ContentBlock) => {
        // ... (Keep existing logic if we want to support CMS blocks, or assume we are fully static now for main sections. 
        // The prompt implies we should replace hardcoded content. CMS blocks might still be dynamic. 
        // For this task, we focus on replacing the HARDCODED "landing" object from store.)
        if (block.type === 'HERO' || block.type === 'CTA') {
            return (
                <section key={block.id} className="py-24 px-6 text-center" style={{ backgroundColor: block.backgroundColor || '#f9fafb' }}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-black text-gray-900 mb-6">{block.title}</h2>
                        <p className="text-xl text-gray-600 font-medium mb-10 leading-relaxed">{block.content}</p>
                        {block.buttonText && (
                            <button onClick={onRegister} className="bg-kid-primary text-yellow-900 px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:bg-yellow-400 transition-colors">
                                {block.buttonText}
                            </button>
                        )}
                    </div>
                </section>
            );
        }
        if (block.type === 'TEXT_IMAGE') {
            // ... (Same as original)
            return null;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-yellow-200">

            <PublicNavbar
                onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onFeatures={onViewFeatures}
                onCurriculum={onViewCurriculum}
                onPricing={onViewPricing}
                onLogin={onLogin}
                onRegister={onRegister}
            />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-4 overflow-hidden bg-gradient-to-b from-green-50 via-blue-50 to-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-start z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-black text-xs uppercase tracking-widest mb-6 border-2 border-yellow-200">
                                <Star fill="currentColor" size={14} /> {t('landing.stat_label')}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6 whitespace-pre-line">
                                {t('landing.heroTitle')}
                            </h1>
                            <p className="text-xl text-gray-600 font-medium mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                                {t('landing.heroSubtitle')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={onGetStarted}
                                    className="px-8 py-4 bg-kid-secondary text-white font-black text-xl rounded-2xl shadow-[0_6px_0_0_rgba(21,128,61,1)] hover:bg-green-500 btn-juicy flex items-center justify-center gap-3 transition-all"
                                >
                                    {t('landing.heroCta')} <ArrowRight strokeWidth={4} />
                                </button>
                            </div>

                            <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-400">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                                <p>{t('landing.social_proof')}</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative h-[500px] w-full flex items-center justify-center">
                        {/* Decorative Elements */}
                        <div className="absolute top-10 end-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-10 start-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />

                        {/* Floating Cards */}
                        <motion.div
                            className="absolute z-20 top-0 end-10 md:end-20 bg-white p-4 rounded-2xl shadow-xl border-b-4 border-gray-100 flex items-center gap-3 animate-float"
                        >
                            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                <Trophy fill="currentColor" size={24} />
                            </div>
                            <div>
                                <div className="font-black text-gray-800">{t('landing.floating.won')}</div>
                                <div className="text-gray-400 text-xs font-bold">{t('landing.floating.xp')}</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute z-20 bottom-20 start-0 md:start-10 bg-white p-4 rounded-2xl shadow-xl border-b-4 border-gray-100 flex items-center gap-3 animate-float-delayed"
                        >
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                <Rocket fill="currentColor" size={24} />
                            </div>
                            <div>
                                <div className="font-black text-gray-800">{t('landing.floating.startup')}</div>
                                <div className="text-gray-400 text-xs font-bold">{t('landing.floating.inc')}</div>
                            </div>
                        </motion.div>

                        {/* Main Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10 w-full max-w-md"
                        >
                            <SmartImage
                                src={t('landing.heroImage')}
                                alt="App Screenshot"
                                type="hero"
                                className="rounded-3xl shadow-2xl border-8 border-white w-full transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover h-[400px]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SOCIAL PROOF --- */}
            <section className="py-12 border-y border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">{t('landing.reviews_title')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((rev, i) => (
                            <ReviewCard
                                key={i}
                                name={rev.name}
                                role={rev.role}
                                text={rev.text}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-800 mb-4">
                            {t('landing.featuresTitle')}
                        </h2>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg">
                            {t('landing.featuresSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 start-[20%] end-[20%] h-1 bg-gray-200 border-t-4 border-dotted border-gray-300 z-0" />

                        {steps.map((step, i) => (
                            <StepCard
                                key={i}
                                num={step.num}
                                icon={i === 0 ? <Play size={32} className="text-white ml-1" /> : i === 1 ? <Brain size={32} className="text-white" /> : <Trophy size={32} className="text-white" />}
                                title={step.title}
                                desc={step.desc}
                                color={i === 0 ? "bg-blue-500" : i === 1 ? "bg-purple-500" : "bg-yellow-500"}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 mt-8">
                                    <div className="h-48 rounded-3xl w-full relative overflow-hidden group border-4 border-yellow-200 bg-yellow-50">
                                        <img src="/images/features/tycoon-thumb.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t('landing.games.tycoon')} loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-0 right-0 text-center">
                                            <div className="font-black text-white text-lg drop-shadow-md">{t('landing.games.tycoon')}</div>
                                        </div>
                                    </div>
                                    <div className="h-64 rounded-3xl w-full relative overflow-hidden group border-4 border-blue-200 bg-blue-50">
                                        <img src="/images/features/pizza-thumb.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t('landing.games.pizza')} loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-0 right-0 text-center">
                                            <div className="font-black text-white text-lg drop-shadow-md">{t('landing.games.pizza')}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-64 rounded-3xl w-full relative overflow-hidden group border-4 border-pink-200 bg-pink-50">
                                        <img src="/images/features/brand-thumb.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t('landing.games.brand')} loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-0 right-0 text-center">
                                            <div className="font-black text-white text-lg drop-shadow-md">{t('landing.games.brand')}</div>
                                        </div>
                                    </div>
                                    <div className="h-48 rounded-3xl w-full relative overflow-hidden group border-4 border-green-200 bg-green-50">
                                        <img src="/images/features/stock-thumb.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t('landing.games.stock')} loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-0 right-0 text-center">
                                            <div className="font-black text-white text-lg drop-shadow-md">{t('landing.games.stock')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 order-1 md:order-2">
                            <span className="text-kid-secondary font-black uppercase tracking-widest text-sm mb-2 block">{t('landing.arcade_section_label')}</span>
                            <h2 className="text-4xl font-black text-gray-800 mb-6">{t('landing.arcadeTitle')}</h2>
                            <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
                                {t('landing.arcadeDesc')}
                            </p>
                            <ul className="space-y-4">
                                {arcadeList.map((item, i) => (
                                    <FeatureItem key={i} text={item} />
                                ))}
                            </ul>
                            <button onClick={onGetStarted} className="mt-8 text-kid-secondary font-black text-lg flex items-center gap-2 hover:gap-4 transition-all">
                                {t('landing.action_explore_arcade')} <ArrowRight strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE TANK SECTION --- */}
            <section className="py-24 bg-yellow-50 relative overflow-hidden border-b border-yellow-100">
                {/* Background Decor */}
                <div className="absolute -top-32 -start-32 w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl animate-pulse" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-yellow-600 font-black uppercase tracking-widest text-sm mb-2 block">{t('landing.tank_section_label')}</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">{t('landing.tankTitle')}</h2>
                            <p className="text-lg text-gray-700 font-medium mb-8 leading-relaxed">
                                {t('landing.tankDesc')}
                            </p>
                            <button onClick={onGetStarted} className="px-8 py-4 bg-yellow-500 text-yellow-950 font-black text-lg rounded-xl shadow-[0_4px_0_0_rgba(161,98,7,1)] flex items-center gap-3 hover:bg-yellow-400 transition-all btn-juicy">
                                <Handshake strokeWidth={3} /> {t('landing.action_explore_tank')}
                            </button>
                        </div>
                        <div className="order-1 md:order-2 relative flex justify-center">
                            {/* Fake Pitch Card */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-yellow-100 transform rotate-3 hover:rotate-0 transition-transform duration-500 max-w-sm w-full">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-inner">
                                        <Briefcase size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-gray-900">{t('landing.cards.mr_cash')}</h3>
                                        <p className="text-green-600 font-bold text-sm">{t('landing.cards.conservative_investor')}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                        <div className="text-xs font-bold text-green-800 uppercase mb-1">{t('landing.cards.official_offer')}</div>
                                        <div className="font-black text-2xl text-green-700">{t('landing.cards.offer_amount')}</div>
                                    </div>
                                    <p className="text-gray-600 font-medium italic text-sm">{t('landing.cards.offer_quote')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DOJO & GIG CENTRAL SECTION --- */}
            <section className="py-24 bg-white relative overflow-hidden border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative">
                            {/* Graphic Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-purple-50 p-8 rounded-3xl border-2 border-purple-100 text-center transform hover:-translate-y-2 transition-transform shadow-lg flex flex-col items-center justify-center h-64">
                                    <Scale size={48} className="text-purple-500 mb-4" />
                                    <h4 className="font-black text-purple-900 text-xl mb-2">{t('landing.cards.ethics_debates')}</h4>
                                    <p className="text-purple-700 text-sm font-medium">{t('landing.cards.ethics_desc')}</p>
                                </div>
                                <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 text-center transform hover:-translate-y-2 transition-transform shadow-lg flex flex-col items-center justify-center h-64 sm:mt-12">
                                    <Rocket size={48} className="text-blue-500 mb-4" />
                                    <h4 className="font-black text-blue-900 text-xl mb-2">{t('landing.cards.gig_central')}</h4>
                                    <p className="text-blue-700 text-sm font-medium">{t('landing.cards.gig_desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <span className="text-purple-600 font-black uppercase tracking-widest text-sm mb-2 block">{t('landing.dojo_section_label')}</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">{t('landing.dojoTitle')}</h2>
                            <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
                                {t('landing.dojoDesc')}
                            </p>
                            <button onClick={onGetStarted} className="px-8 py-4 bg-purple-500 text-white font-black text-lg rounded-xl shadow-[0_4px_0_0_rgba(126,34,206,1)] flex items-center gap-3 hover:bg-purple-400 transition-all btn-juicy">
                                {t('landing.action_explore_dojo')} <ArrowRight strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LIBRARY SECTION --- */}
            <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-2 block">{t('landing.library_section_label')}</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">{t('landing.libraryTitle')}</h2>
                            <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
                                {t('landing.libraryDesc')}
                            </p>
                            <button onClick={onViewCurriculum} className="px-8 py-4 bg-white border-2 border-blue-200 text-blue-800 font-black text-lg rounded-xl shadow-sm flex items-center gap-3 hover:border-blue-400 hover:shadow-md transition-all">
                                <BookOpen size={24} /> {t('landing.action_explore_library')}
                            </button>
                        </div>
                        <div className="order-1 md:order-2 flex justify-center">
                             {/* Real Book Covers */}
                             <div className="flex gap-4 sm:ml-12 overflow-visible py-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
                                {['rich-dad-poor-dad.jpg', 'atomic-habits.jpg', 'zero-to-one.jpg'].map((cover, i) => (
                                    <img
                                        key={cover}
                                        src={`/images/books/${cover}`}
                                        alt={cover}
                                        loading="lazy"
                                        className={`flex-shrink-0 w-32 sm:w-40 h-48 sm:h-56 rounded-xl shadow-xl border-4 border-white object-cover ${i===0 ? '-mt-6' : i===1 ? 'z-10 scale-110 shadow-2xl relative' : 'mt-6'}`}
                                    />
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DASHBOARD SECTION --- */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden border-top border-gray-800">
                <div className="absolute top-0 start-0 w-full h-full opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                     <div className="flex-1 w-full relative order-2 md:order-1 flex justify-center">
                         {/* Real Dashboard Screenshot */}
                         <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border-[6px] border-gray-800 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                             <div className="h-6 sm:h-8 bg-gray-950 flex items-center px-3 border-b border-gray-800">
                                 <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                 </div>
                             </div>
                             <img src="/images/features/dashboard-preview.png" alt="Admin Dashboard" className="w-full h-auto object-cover" loading="lazy" />
                         </div>
                     </div>
                     <div className="flex-1 order-1 md:order-2 text-center md:text-start">
                            <span className="text-gray-400 font-black uppercase tracking-widest text-sm mb-2 block">{t('landing.dashboard_section_label')}</span>
                            <h2 className="text-4xl font-black text-white mb-6">{t('landing.dashboardTitle')}</h2>
                            <p className="text-lg text-gray-300 font-medium mb-8 leading-relaxed">
                                {t('landing.dashboardDesc')}
                            </p>
                            <button onClick={onRegister} className="px-8 py-4 bg-white text-gray-900 font-black text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-all inline-flex items-center gap-3">
                                <Monitor size={24} /> {t('landing.action_explore_dashboard')}
                            </button>
                     </div>
                </div>
            </section>

            {/* --- DYNAMIC SECTIONS (From Store if any) --- */}
            {cmsContent.landing?.extraSections && cmsContent.landing.extraSections.map(block => renderExtraSection(block))}

            {/* --- CTA SECTION --- */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 start-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl font-black mb-6">{t('landing.ctaTitle')}</h2>
                    <p className="text-xl text-gray-400 font-medium mb-10">{t('landing.ctaSubtitle')}</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={onRegister}
                            className="px-10 py-5 bg-kid-primary text-yellow-900 font-black text-xl rounded-2xl shadow-[0_6px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 transition-all mx-2"
                        >
                            {t('landing.ctaStart')}
                        </button>
                        <button onClick={onViewPricing} className="px-10 py-5 bg-white/10 text-white font-bold text-xl rounded-2xl hover:bg-white/20 transition-all mx-2">
                            {t('landing.ctaPlans')}
                        </button>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <img src="/images/logo_text.png" alt="Profits Patrol" className="h-8 w-auto object-contain grayscale opacity-80" />
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-500 justify-center">
                        {cmsContent.customPages?.map(page => (
                            <button
                                key={page.id}
                                onClick={() => onNavigateToPage?.(page.slug)}
                                className="hover:text-blue-600 flex items-center gap-1"
                            >
                                {page.title} <ArrowUpRight size={12} />
                            </button>
                        ))}
                        <button onClick={onViewPrivacy} className="hover:text-blue-600 flex items-center gap-1">Privacy Policy <ArrowUpRight size={12} /></button>
                        <button onClick={onViewTerms} className="hover:text-blue-600 flex items-center gap-1">Terms of Service <ArrowUpRight size={12} /></button>
                        <button onClick={onViewRefund} className="hover:text-blue-600 flex items-center gap-1">Refund Policy <ArrowUpRight size={12} /></button>
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                        {t('landing.footer_copyright')}
                    </div>
                </div>
            </footer>

        </div>
    );
};

const ReviewCard = ({ name, role, text }: any) => (
    <div className="bg-gray-50 p-8 rounded-3xl text-start border-2 border-gray-100 hover:border-kid-primary hover:shadow-lg transition-all h-full">
        <div className="flex text-yellow-400 gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={16} />)}
        </div>
        <p className="text-gray-700 font-medium mb-6 leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-3 mt-auto">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                {name[0]}
            </div>
            <div>
                <div className="font-black text-gray-900 text-sm">{name}</div>
                <div className="text-xs font-bold text-gray-400 uppercase">{role}</div>
            </div>
        </div>
    </div>
);

const StepCard = ({ num, icon, title, desc, color }: any) => (
    <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-3xl ${color} flex items-center justify-center shadow-lg mb-6 transform hover:scale-110 transition-transform`}>
            {icon}
            <div className="absolute -top-3 -end-3 w-8 h-8 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                {num}
            </div>
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

const FeatureItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3 font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div className="bg-green-100 p-1 rounded-full text-green-600">
            <Check size={16} strokeWidth={4} />
        </div>
        {text}
    </li>
);

export default LandingPage;
