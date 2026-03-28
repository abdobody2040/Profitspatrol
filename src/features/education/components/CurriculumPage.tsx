
import React from 'react';
import { COURSE_MAP } from '../data/curriculum';
import { BookOpen, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNavbar from '../../../components/layout/PublicNavbar';
import { useTranslation } from 'react-i18next';

interface CurriculumPageProps {
    onHome: () => void;
    onFeatures: () => void;
    onCurriculum: () => void;
    onPricing: () => void;
    onLogin: () => void;
    onRegister: () => void;
}

const CurriculumPage: React.FC<CurriculumPageProps> = ({
    onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister
}) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-32 overflow-hidden">
            <PublicNavbar
                onHome={onHome}
                onFeatures={onFeatures}
                onCurriculum={onCurriculum}
                onPricing={onPricing}
                onLogin={onLogin}
                onRegister={onRegister}
            />

            {/* CLEAN HERO SECTION (MATCHING PRICING PAGE) */}
            <div className="bg-gradient-to-b from-blue-50 to-white p-8 border-b border-blue-100 pt-32">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-bold text-sm mb-6 shadow-sm border border-blue-200"
                    >
                        <BookOpen size={16} />
                        <span>The Ultimate Learning Journey</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-black mb-6 text-gray-900"
                    >
                        {t('curriculum.page_title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto"
                    >
                        {t('curriculum.page_desc')}
                    </motion.p>
                </div>
            </div>

            {/* TIMELINE ROADMAP */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="relative">

                    {/* Vertical Dashed Line (Desktop Only) */}
                    <div className="absolute left-8 top-10 bottom-10 w-1 border-l-4 border-dashed border-indigo-200 hidden md:block z-0"></div>

                    <div className="grid gap-12 relative z-10">
                        {COURSE_MAP.map((module, index) => {
                            // Alternate colors for variety
                            const colors = [
                                'from-blue-400 to-blue-600',
                                'from-green-400 to-emerald-600',
                                'from-purple-400 to-indigo-600',
                                'from-orange-400 to-red-500'
                            ];
                            const badgeColor = colors[index % colors.length];

                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                                    className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center relative group"
                                >
                                    {/* Timeline Node (Desktop) */}
                                    <div className="hidden md:flex absolute -left-4 w-6 h-6 bg-white border-4 border-indigo-500 rounded-full z-20 shadow-md group-hover:scale-150 group-hover:bg-indigo-500 group-hover:border-white transition-all duration-300"></div>

                                    {/* Icon Container with Gradient */}
                                    <div className={`w-24 h-24 md:w-32 md:h-32 md:ml-12 rounded-3xl shrink-0 flex items-center justify-center text-5xl md:text-6xl text-white shadow-xl shadow-indigo-200/50 bg-gradient-to-br ${badgeColor} transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 border-4 border-white`}>
                                        {module.icon}
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-indigo-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full relative overflow-hidden">

                                        {/* Decorative faint icon in background */}
                                        <div className="absolute -right-8 -top-8 text-9xl opacity-5 pointer-events-none transform -rotate-12">
                                            {module.icon}
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-xs font-black text-white uppercase tracking-widest bg-gradient-to-r ${badgeColor} px-3 py-1 rounded-full shadow-sm`}>
                                                        {t('curriculum.module')} {index + 1}
                                                    </span>
                                                </div>
                                                <h2 className="text-3xl font-black text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {t(`curriculum.${module.id}` as any)}
                                                </h2>
                                            </div>

                                            {/* Level Badge */}
                                            <div className="shrink-0 flex items-center gap-2 bg-gradient-to-br from-yellow-300 to-amber-500 px-4 py-2 rounded-2xl shadow-md border-2 border-white transform group-hover:scale-110 transition-transform">
                                                <Star className="text-white fill-current" size={20} />
                                                <span className="font-black text-white text-lg drop-shadow-sm uppercase tracking-wide">{t('curriculum.level')} {index + 1}</span>
                                            </div>
                                        </div>

                                        {/* Module Brief */}
                                        <div className="mt-4 text-gray-600">
                                            <p className="leading-relaxed">
                                                {t(`curriculum.${module.id}_brief` as any)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurriculumPage;
