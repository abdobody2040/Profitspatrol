import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, MapPin, Sparkles, Sun, Moon, Sunrise, ChevronRight } from 'lucide-react';
import { NPCConfig, TimeOfDay } from '../../../types';
import { NPC_CONFIGS, getNPCsByDistrictAndTime } from '../../hq/data/npcs';
import { useLivingWorldStore } from '../store/livingWorldStore';
import { NPCDialogueModal } from './NPCDialogueModal';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { SoundService } from '../../../lib/sound';

interface DistrictLivingWorldBarProps {
    districtId: string;
    districtNameEn?: string;
    districtNameAr?: string;
}

export const DistrictLivingWorldBar: React.FC<DistrictLivingWorldBarProps> = ({
    districtId,
    districtNameEn = 'Money District',
    districtNameAr = 'حي النقود'
}) => {
    const { isArabic } = useAgeMode();
    const { timeOfDay, setTimeOfDay, getNPCState } = useLivingWorldStore();
    const [selectedNPC, setSelectedNPC] = useState<NPCConfig | null>(null);
    const [showDirectory, setShowDirectory] = useState(false);

    const activeNPCs = getNPCsByDistrictAndTime(districtId, timeOfDay);

    const timeButtons: { time: TimeOfDay; labelEn: string; labelAr: string; icon: any }[] = [
        { time: 'morning', labelEn: 'Morning', labelAr: 'صباحاً', icon: Sunrise },
        { time: 'afternoon', labelEn: 'Afternoon', labelAr: 'ظهيرة', icon: Sun },
        { time: 'night', labelEn: 'Evening', labelAr: 'مساءً', icon: Moon }
    ];

    return (
        <div className="w-full my-3 px-2 sm:px-4" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-indigo-100 dark:border-indigo-950/60 p-4 shadow-lg">
                {/* Header row: Time of day selector & District presence */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Users size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white m-0">
                                    {isArabic ? 'شخصيات العالم الحي في هذا الحي' : 'Living World Residents in District'}
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                    {activeNPCs.length} {isArabic ? 'متواجدون' : 'present'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 m-0">
                                {isArabic 
                                    ? `الجدول الزمني للحي: ${districtNameAr}` 
                                    : `Schedule for: ${districtNameEn}`}
                            </p>
                        </div>
                    </div>

                    {/* Time of Day Cycle Control */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
                        {timeButtons.map(({ time, labelEn, labelAr, icon: Icon }) => (
                            <button
                                key={time}
                                onClick={() => {
                                    SoundService.playClick();
                                    setTimeOfDay(time);
                                }}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                                    timeOfDay === time
                                        ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            >
                                <Icon size={13} />
                                <span>{isArabic ? labelAr : labelEn}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active NPCs in this district */}
                <div className="pt-3">
                    {activeNPCs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {activeNPCs.map(npc => {
                                const { emotion, relationship, currentLocation } = getNPCState(npc.id);
                                return (
                                    <div
                                        key={npc.id}
                                        onClick={() => {
                                            SoundService.playClick();
                                            setSelectedNPC(npc);
                                        }}
                                        className="cursor-pointer group flex items-center justify-between gap-3 p-3 rounded-2xl bg-indigo-50/40 hover:bg-indigo-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-indigo-100/60 hover:border-indigo-300 dark:border-slate-700/50 transition-all hover:scale-[1.02] shadow-sm"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-xl flex-shrink-0 shadow-sm border border-white dark:border-slate-700">
                                                {npc.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-black text-slate-800 dark:text-white truncate">
                                                    {isArabic ? (npc.nameAr || npc.arabicRole) : (npc.nameEn || npc.role)}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                                    {isArabic ? currentLocation?.activityAr : currentLocation?.activityEn}
                                                </div>
                                            </div>
                                        </div>

                                        <button className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-black text-[11px] flex items-center gap-1 shadow-sm transition-colors">
                                            <Sparkles size={12} />
                                            <span>{isArabic ? 'تحدث' : 'Talk'}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-4 text-center">
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium m-0">
                                {isArabic
                                    ? 'لا يوجد تجار أو رواد أعمال في هذا الحي في هذا التوقيت. جرّب تغيير الفترة الزمنية (صباحاً / ظهيرة / مساءً) أو تفقد باقي الأحياء.'
                                    : 'No residents currently roaming this district at this hour. Try toggling the time of day above!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedNPC && (
                <NPCDialogueModal
                    npc={selectedNPC}
                    isOpen={!!selectedNPC}
                    onClose={() => setSelectedNPC(null)}
                />
            )}
        </div>
    );
};
