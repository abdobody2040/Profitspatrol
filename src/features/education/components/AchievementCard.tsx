import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Check, Star, Download, Share2, Loader2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User, UniversalLessonUnit } from '../../../types';

interface AchievementCardProps {
    moduleTitle: string;
    user: User | null;
    lessons: UniversalLessonUnit[];
    totalXp: number;
    isGenerating: boolean;
    isIntern: boolean;
    onDownload: () => void;
    onShare?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
    moduleTitle,
    user,
    lessons,
    totalXp,
    isGenerating,
    isIntern,
    onDownload,
    onShare
}) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-yellow-500 max-w-sm w-full text-center relative overflow-hidden mx-auto"
        >
            {/* Visual Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#F59E0B 2px, transparent 2px)', backgroundSize: '16px 16px' }}
            />

            <div className="relative z-10">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                >
                    {t('certificate_modal.completion')}
                </motion.div>

                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-white">
                    <Trophy size={40} className="text-yellow-900" />
                </div>

                <h2 className="text-2xl font-black text-gray-800 mb-1">{moduleTitle}</h2>
                <p className="text-gray-500 font-bold mb-6 text-sm">{t('certificate_modal.mastered_by')} {user?.name || 'Future CEO'}</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 rtl:text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">{t('certificate_modal.key_takeaways')}</h3>
                    {lessons.slice(0, 3).map((lesson, idx) => (
                        <div key={lesson.id} className="flex items-start gap-3">
                            <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1 min-w-[20px] h-[20px] flex items-center justify-center">
                                <Check size={12} strokeWidth={4} />
                            </div>
                            <span className="text-sm font-bold text-gray-700 leading-tight">
                                {t(`lesson_${lesson.id}_title`, { defaultValue: lesson.lesson_payload.headline })}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-6 mb-6 border-t border-gray-100 pt-4">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase">{t('certificate_modal.total_xp')}</div>
                        <div className="text-2xl font-black text-blue-600">+{totalXp}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase">{t('certificate_modal.skill_rating')}</div>
                        <div className="flex text-yellow-400 gap-1 mt-1 justify-center">
                            <Star fill="currentColor" size={16} />
                            <Star fill="currentColor" size={16} />
                            <Star fill="currentColor" size={16} />
                            <Star fill="currentColor" size={16} />
                            <Star fill="currentColor" size={16} />
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <button
                        onClick={onDownload}
                        disabled={isGenerating}
                        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-wait shadow-lg active:scale-95 text-base
                                ${isIntern
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
                            }
                            `}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : isIntern ? <Lock size={20} /> : <Download size={20} strokeWidth={3} />}
                        {isGenerating ? t('certificate_modal.saving') : t('certificate_modal.download_pdf')}
                    </button>
                    {isIntern && (
                        <p className="text-xs text-red-500 font-bold mt-2">
                            {t('common.subscriber_only', { defaultValue: 'Subscribers Only' })}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
