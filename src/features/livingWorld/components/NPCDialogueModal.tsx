import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Clock, Award, CheckCircle2, MessageCircle, Gift, ChevronRight } from 'lucide-react';
import { NPCConfig, NPCLivingEmotion, NPCRelationshipTier, TimeOfDay } from '../../../types';
import { useLivingWorldStore } from '../store/livingWorldStore';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { SoundService } from '../../../lib/sound';

interface NPCDialogueModalProps {
    npc: NPCConfig;
    isOpen: boolean;
    onClose: () => void;
}

const EMOTION_MAP: Record<NPCLivingEmotion, { labelEn: string; labelAr: string; icon: string; color: string; bg: string }> = {
    happy: { labelEn: 'Joyful', labelAr: 'مبتهج', icon: '😊', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300' },
    celebrating: { labelEn: 'Celebrating', labelAr: 'يحتفل بإنجاز', icon: '🎉', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300' },
    growing: { labelEn: 'Growing', labelAr: 'في نمو مستمر', icon: '📈', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300' },
    busy: { labelEn: 'Busy At Work', labelAr: 'منشغل بالعمل', icon: '⚡', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300' },
    worried: { labelEn: 'Market Alert', labelAr: 'مترقب للسوق', icon: '😟', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-300' },
    struggling: { labelEn: 'Struggling', labelAr: 'يواجه عقبات', icon: '🌧️', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300' },
    needs_help: { labelEn: 'Needs Help', labelAr: 'يحتاج للمساعدة', icon: '🆘', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/40 border-red-300' }
};

const TIER_MAP: Record<NPCRelationshipTier, { labelEn: string; labelAr: string; badge: string }> = {
    unknown: { labelEn: 'New Acquaintance', labelAr: 'معرفة جديدة', badge: '⚪' },
    introduced: { labelEn: 'Introduced', labelAr: 'تم التعارف', badge: '🌱' },
    friendly: { labelEn: 'Friendly Advisor', labelAr: 'صديق ناصح', badge: '🤝' },
    trusted: { labelEn: 'Trusted Partner', labelAr: 'شريك موثوق', badge: '🛡️' },
    partner: { labelEn: 'Master Ally', labelAr: 'حليف استراتيجي', badge: '👑' }
};

const TIME_MAP: Record<TimeOfDay, { labelEn: string; labelAr: string; icon: string }> = {
    morning: { labelEn: 'Morning Routine', labelAr: 'فترة الصباح', icon: '🌅' },
    afternoon: { labelEn: 'Afternoon Rush', labelAr: 'فترة الظهيرة', icon: '☀️' },
    night: { labelEn: 'Evening Market', labelAr: 'فترة المساء', icon: '🌙' }
};

export const NPCDialogueModal: React.FC<NPCDialogueModalProps> = ({ npc, isOpen, onClose }) => {
    const { isArabic } = useAgeMode();
    const {
        timeOfDay,
        getNPCState,
        getNPCDialogue,
        talkToNPC,
        acceptQuest,
        claimQuestReward,
        quests
    } = useLivingWorldStore();

    const [activeTab, setActiveTab] = useState<'dialogue' | 'quest'>('dialogue');
    const [dialogueOverride, setDialogueOverride] = useState<string | null>(null);

    if (!isOpen) return null;

    const { emotion, relationship, currentLocation } = getNPCState(npc.id);
    const emotionInfo = EMOTION_MAP[emotion] || EMOTION_MAP.happy;
    const tierInfo = TIER_MAP[relationship.tier] || TIER_MAP.unknown;
    const timeInfo = TIME_MAP[timeOfDay];

    const currentDialogue = dialogueOverride || getNPCDialogue(npc.id, isArabic).text;
    const quest = npc.quest;
    const questState = quest ? quests[quest.id] : undefined;

    const handleTalk = () => {
        SoundService.playClick();
        const result = talkToNPC(npc.id);
        const newDialogue = getNPCDialogue(npc.id, isArabic).text;
        setDialogueOverride(newDialogue);
        if (result.tierChanged) {
            SoundService.playLevelUp();
        }
    };

    const handleAcceptQuest = () => {
        if (!quest) return;
        SoundService.playSuccess();
        acceptQuest(quest.id, npc.id);
    };

    const handleClaimReward = () => {
        if (!quest) return;
        SoundService.playReward();
        claimQuestReward(quest.id);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl"
                    dir={isArabic ? 'rtl' : 'ltr'}
                >
                    {/* Header Banner */}
                    <div className="relative p-6 pb-4 bg-gradient-to-br from-indigo-50 via-slate-50 to-amber-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                SoundService.playClick();
                                onClose();
                            }}
                            className="absolute top-4 end-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-start gap-4">
                            {/* Avatar Bubble */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 border-2 border-white dark:border-slate-800">
                                    {npc.avatar}
                                </div>
                                <span className="absolute -bottom-1 -end-1 text-sm bg-white dark:bg-slate-800 rounded-full px-1 shadow border border-slate-200 dark:border-slate-700">
                                    {tierInfo.badge}
                                </span>
                            </div>

                            {/* Name & Identity */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white m-0">
                                        {isArabic ? (npc.nameAr || npc.arabicRole) : (npc.nameEn || npc.role)}
                                    </h2>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                        {isArabic ? npc.arabicRole : npc.role}
                                    </span>
                                </div>

                                {/* Status & Schedule chips */}
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {/* Emotion Chip */}
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${emotionInfo.bg} ${emotionInfo.color}`}>
                                        <span>{emotionInfo.icon}</span>
                                        <span>{isArabic ? emotionInfo.labelAr : emotionInfo.labelEn}</span>
                                    </span>

                                    {/* Time of Day */}
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                        <span>{timeInfo.icon}</span>
                                        <span>{isArabic ? timeInfo.labelAr : timeInfo.labelEn}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Location Bar */}
                        {currentLocation && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                                <MapPin size={14} className="text-rose-500 flex-shrink-0" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {isArabic ? currentLocation.locationNameAr : currentLocation.locationNameEn}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <button
                            onClick={() => {
                                SoundService.playClick();
                                setActiveTab('dialogue');
                            }}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border-b-2 ${
                                activeTab === 'dialogue'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                        >
                            <MessageCircle size={15} />
                            {isArabic ? 'الحوار والمشورة' : 'Dialogue & Advice'}
                        </button>

                        {quest && (
                            <button
                                onClick={() => {
                                    SoundService.playClick();
                                    setActiveTab('quest');
                                }}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border-b-2 ${
                                    activeTab === 'quest'
                                        ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            >
                                <Award size={15} />
                                {isArabic ? 'مهمة الحي' : 'District Quest'}
                                {questState?.status === 'completed' && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-5">
                        {activeTab === 'dialogue' ? (
                            <div className="space-y-4">
                                {/* Dialogue Speech Bubble */}
                                <div className="relative p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900/40">
                                    <div className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                                        "{currentDialogue}"
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-indigo-100/60 dark:border-indigo-900/40 pt-2">
                                        <span>
                                            {isArabic ? 'مستوى الثقة:' : 'Relationship:'} {isArabic ? tierInfo.labelAr : tierInfo.labelEn}
                                        </span>
                                        <span>{relationship.trustPoints} {isArabic ? 'نقطة ثقة' : 'Trust Pts'}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleTalk}
                                        className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={16} />
                                        {isArabic ? 'تحدث واكسب ثقة (+15)' : 'Talk & Earn Trust (+15)'}
                                    </button>

                                    {quest && (
                                        <button
                                            onClick={() => {
                                                SoundService.playClick();
                                                setActiveTab('quest');
                                            }}
                                            className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5"
                                        >
                                            <Award size={16} />
                                            {isArabic ? 'المهمة' : 'Quest'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Quest Tab */
                            quest && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/40">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white m-0">
                                                {isArabic ? quest.titleAr : quest.title}
                                            </h3>
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                                                +{quest.rewardTokens} PP · +{quest.rewardXp} XP
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                            {isArabic ? quest.descriptionAr : quest.description}
                                        </p>

                                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {isArabic ? 'المتطلب: ' : 'Requirement: '}
                                            </span>
                                            {isArabic ? quest.requirementTextAr : quest.requirementText}
                                        </div>
                                    </div>

                                    {/* Quest State CTA */}
                                    {(!questState || questState.status === 'available') && (
                                        <button
                                            onClick={handleAcceptQuest}
                                            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} />
                                            {isArabic ? 'قبول المهمة والبدء' : 'Accept Quest & Begin'}
                                        </button>
                                    )}

                                    {questState?.status === 'active' && (
                                        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold text-center border border-indigo-200 dark:border-indigo-800">
                                            ⚡ {isArabic ? 'المهمة جارية... تابع التقدم من خلال أنشطة الحي!' : 'Quest In Progress... complete district activities to advance!'}
                                        </div>
                                    )}

                                    {questState?.status === 'completed' && (
                                        <button
                                            onClick={handleClaimReward}
                                            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all shadow-md shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2 animate-bounce"
                                        >
                                            <Gift size={16} />
                                            {isArabic ? 'استلام المكافأة (+100 PP، +50 XP)' : 'Claim Reward (+100 PP, +50 XP)'}
                                        </button>
                                    )}

                                    {questState?.status === 'claimed' && (
                                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center border border-emerald-200 dark:border-emerald-800">
                                            ✅ {isArabic ? 'تم إنجاز واستلام هذه المهمة بنجاح!' : 'Quest Completed & Reward Claimed!'}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
