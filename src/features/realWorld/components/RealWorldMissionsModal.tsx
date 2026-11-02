import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  MessageSquare, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { REAL_WORLD_MISSIONS } from '../data/realWorldMissionsData';
import { RealWorldMission } from '../types/realWorld';
import { useRealWorldStore } from '../store/realWorldStore';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { SoundService } from '../../../lib/sound';

interface RealWorldMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealWorldMissionsModal: React.FC<RealWorldMissionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isArabic } = useAgeMode();
  const { submissions, saveSubmissionNotes, parentApproveMission } = useRealWorldStore();

  const [selectedMissionId, setSelectedMissionId] = useState<string>(REAL_WORLD_MISSIONS[0].id);
  const [notesInput, setNotesInput] = useState<string>('');

  if (!isOpen) return null;

  const currentMission = REAL_WORLD_MISSIONS.find((m) => m.id === selectedMissionId) || REAL_WORLD_MISSIONS[0];
  const submission = submissions[currentMission.id];
  const isApproved = !!submission?.parentApproved;

  const handleSelectMission = (mission: RealWorldMission) => {
    SoundService.playClick();
    setSelectedMissionId(mission.id);
    setNotesInput(submissions[mission.id]?.childNotes || '');
  };

  const handleSaveNotes = () => {
    SoundService.playClick();
    saveSubmissionNotes(currentMission.id, notesInput);
  };

  const handleParentApprove = () => {
    SoundService.playReward();
    parentApproveMission(currentMission.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex justify-between items-start flex-shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
                <Home size={14} />
                <span>{isArabic ? 'مهام العالم الواقعي العائلية' : 'Real-World Family Missions'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black m-0">
                {isArabic ? 'انقل مهارات ريادة الأعمال خارج الشاشة إلى منزلك!' : 'Take Your Entrepreneurship Skills Beyond the Screen!'}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
                {isArabic 
                  ? 'مهام تطبيقية ممتعة تشاركها مع عائلتك في السوبرماركت والمنزل، وتكسب أوسمة ورموز PP بتوقيع ولي الأمر.' 
                  : 'Practical, safe offline missions to complete with parents and siblings.'}
              </p>
            </div>

            <button
              onClick={() => {
                SoundService.playClick();
                onClose();
              }}
              className="p-2 rounded-full text-white/80 hover:text-white bg-black/20 hover:bg-black/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Grid: Sidebar + Details */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-800">
            {/* Mission Selector Sidebar */}
            <div className="p-4 space-y-2.5 overflow-y-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {isArabic ? 'قائمة المهام الأسرية' : 'Available Missions'}
              </span>

              {REAL_WORLD_MISSIONS.map((m) => {
                const isSelected = selectedMissionId === m.id;
                const mSub = submissions[m.id];
                const done = !!mSub?.parentApproved;

                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMission(m)}
                    className={`w-full p-3 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                        : done
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-200 dark:border-emerald-900/40 text-slate-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl flex-shrink-0">{m.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white truncate m-0">
                          {isArabic ? m.titleAr : m.titleEn}
                        </h4>
                        {done && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                        +{m.rewardTokens} PP · +{m.rewardXp} XP
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mission Detail View */}
            <div className="p-6 md:col-span-2 space-y-6 overflow-y-auto">
              {/* Mission Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                    {currentMission.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white m-0">
                      {isArabic ? currentMission.titleAr : currentMission.titleEn}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        🏅 {isArabic ? currentMission.badgeNameAr : currentMission.badgeNameEn}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        +{currentMission.rewardTokens} PP · +{currentMission.rewardXp} XP
                      </span>
                    </div>
                  </div>
                </div>

                {isApproved && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-sm flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>{isArabic ? 'معتمدة من ولي الأمر ✓' : 'Parent Approved ✓'}</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 m-0">
                {isArabic ? currentMission.descriptionAr : currentMission.descriptionEn}
              </p>

              {/* Action Steps Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {isArabic ? 'خطوات التنفيذ العائلية:' : 'Action Steps Checklist:'}
                </h4>
                <div className="space-y-2">
                  {(isArabic ? currentMission.stepsAr : currentMission.stepsEn).map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Discussion Prompt */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/40">
                <div className="flex items-center gap-2 mb-1.5 text-amber-700 dark:text-amber-400 font-black text-xs">
                  <MessageSquare size={16} />
                  <span>{isArabic ? 'سؤال للنقاش مع العائلة أثناء العشاء:' : 'Dinner Discussion Question:'}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 m-0">
                  "{isArabic ? currentMission.discussionQuestionAr : currentMission.discussionQuestionEn}"
                </p>
              </div>

              {/* Child Reflection Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  {isArabic ? 'ملاحظات الطفل وما تعلمه من المهمة:' : 'Learner Reflections & Discoveries:'}
                </label>
                <textarea
                  rows={3}
                  disabled={isApproved}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder={isArabic ? 'اكتب ما لاحظته خلال التجربة هنا...' : 'Write down what you discovered during this activity...'}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
                />
                {!isApproved && (
                  <button
                    onClick={handleSaveNotes}
                    className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    {isArabic ? 'حفظ الملاحظات' : 'Save Notes'}
                  </button>
                )}
              </div>

              {/* Parent Approval Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/30 dark:to-emerald-950/30 border-2 border-indigo-100 dark:border-indigo-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={28} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white m-0">
                        {isArabic ? 'اعتماد وموافقة ولي الأمر' : 'Parent Signature & Approval'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
                        {isArabic 
                          ? 'يؤكد ولي الأمر مشاركة الطفل وإتمام المهمة لمنحه الوسام ورموز المكافأة.' 
                          : 'Parent verifies completion to release rewards and badge.'}
                      </p>
                    </div>
                  </div>

                  {!isApproved ? (
                    <button
                      onClick={handleParentApprove}
                      className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                      <Sparkles size={16} />
                      <span>{isArabic ? 'توقيع واعتماد ولي الأمر ✓' : 'Parent Approve ✓'}</span>
                    </button>
                  ) : (
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                      ✓ {isArabic ? 'تم منح المكافأة والوسام بنجاح!' : 'Rewards and badge awarded!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
