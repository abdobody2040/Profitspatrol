import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Trophy, 
  TrendingUp, 
  BookOpen,
  ShieldCheck,
  X
} from 'lucide-react';
import { 
  COMPETENCY_GROUPS, 
  CompetencyGroup, 
  Competency, 
  CompetencyGroupId, 
  getCompetenciesByGroup, 
  calculateMasteryLevel 
} from '../../../domain/curriculum/competencyModel';
import { useAppStore } from '../../../store';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { SoundService } from '../../../lib/sound';

export interface SkillTreeViewProps {
  onSelectLesson?: (lessonId: string) => void;
  onClose?: () => void;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  onSelectLesson,
  onClose
}) => {
  const { isArabic } = useAgeMode();
  const user = useAppStore((state) => state.user);

  const [activeGroupId, setActiveGroupId] = useState<CompetencyGroupId>('money');
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);

  const activeGroup = useMemo(
    () => COMPETENCY_GROUPS.find((g) => g.id === activeGroupId) || COMPETENCY_GROUPS[0],
    [activeGroupId]
  );

  const groupCompetencies = useMemo(
    () => getCompetenciesByGroup(activeGroupId),
    [activeGroupId]
  );

  const handleGroupChange = (groupId: CompetencyGroupId) => {
    SoundService.playClick();
    setActiveGroupId(groupId);
    setSelectedCompetency(null);
  };

  const handleNodeClick = (comp: Competency) => {
    SoundService.playClick();
    setSelectedCompetency(comp);
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-white"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isArabic ? 'شجرة المهارات القيادية' : 'Leadership Skill Tree'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 font-extrabold border border-violet-800">
                HQ 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {isArabic 
                ? 'طوّر كفاءاتك الـ 6 لتصبح رائد أعمال ورئيس تنفيذي محترف' 
                : 'Master all 6 competency groups to advance as a true CEO'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors self-end sm:self-auto"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── 6 Competency Group Tabs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {COMPETENCY_GROUPS.map((group) => {
          const isActive = group.id === activeGroupId;
          return (
            <button
              key={group.id}
              onClick={() => handleGroupChange(group.id)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-slate-800 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <span className="text-2xl">{group.icon}</span>
              <span className="text-xs font-black text-center line-clamp-1 text-slate-200">
                {isArabic ? group.nameAr : group.nameEn}
              </span>
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active Group Overview Banner ── */}
      <div 
        className="p-5 rounded-3xl mb-8 border-2 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ 
          backgroundColor: `${activeGroup.color}15`,
          borderColor: `${activeGroup.color}40`
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeGroup.icon}</span>
            <h2 className="text-lg font-black text-white">
              {isArabic ? activeGroup.nameAr : activeGroup.nameEn}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {isArabic ? activeGroup.descriptionAr : activeGroup.descriptionEn}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-white/10 flex-shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {isArabic ? 'المهارات المكتملة' : 'Skills in Branch'}
            </span>
            <span className="text-sm font-black text-white">
              {groupCompetencies.length} {isArabic ? 'مهارات أساسية' : 'Core Skills'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Skill Nodes Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {groupCompetencies.map((comp, idx) => {
          const rawScore = user?.competencyMastery?.[comp.id]?.score || 0;
          const mastery = calculateMasteryLevel(rawScore);
          const isSelected = selectedCompetency?.id === comp.id;

          return (
            <motion.div
              key={comp.id}
              data-testid={`skill-card-${comp.id}`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleNodeClick(comp)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-inner"
                    style={{ 
                      backgroundColor: `${activeGroup.color}25`,
                      borderColor: `${activeGroup.color}50`
                    }}
                  >
                    {comp.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {isArabic ? comp.nameAr : comp.nameEn}
                    </h3>
                    <span className="text-xs text-slate-400 block line-clamp-1">
                      {isArabic ? comp.descriptionAr : comp.descriptionEn}
                    </span>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 ${
                  mastery.level === 4
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                    : mastery.level === 3
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
                    : mastery.level === 2
                    ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{isArabic ? mastery.titleAr : mastery.titleEn}</span>
                </div>
              </div>

              {/* Progress to Next Mastery Tier */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                  <span>
                    {isArabic ? `المستوى ${mastery.level} / 4` : `Tier ${mastery.level} / 4`}
                  </span>
                  <span>
                    {mastery.level === 4 
                      ? (isArabic ? 'أقصى مستوى ⭐' : 'Mastered ⭐')
                      : `${mastery.xpInLevel} / ${mastery.xpRequiredForNext} XP`}
                  </span>
                </div>

                <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mastery.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: activeGroup.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Selected Skill Detail Modal / Drawer ── */}
      <AnimatePresence>
        {selectedCompetency && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCompetency.icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {isArabic ? selectedCompetency.nameAr : selectedCompetency.nameEn}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {isArabic ? activeGroup.nameAr : activeGroup.nameEn}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCompetency(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{isArabic ? 'وصف الكفاءة والمهارة' : 'Competency Description'}</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {isArabic ? selectedCompetency.descriptionAr : selectedCompetency.descriptionEn}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isArabic ? 'ميزة القيادة في السوق' : 'Market Leadership Advantage'}</span>
                  </span>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {isArabic 
                      ? 'الوصول لمستوى الخبير في هذه المهارة يزيد من ثقة الزبائن ومقاومة تحديات ريكس في المقاطعة.'
                      : 'Achieving Expert tier in this skill unlocks greater district customer demand and resistance to Rex’s rival moves.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompetency(null)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                {isArabic ? 'تم، العودة للشجرة 🚀' : 'Got it, Back to Tree 🚀'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
