import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Lightbulb, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { BusinessConsequence } from '../types/business';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { getHero } from '../../characters/data/heroes';
import { getCharacterAsset } from '../../../lib/assets/assetRegistry';

export interface WhyExplanationModalProps {
  consequence: BusinessConsequence | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyExplanationModal: React.FC<WhyExplanationModalProps> = ({
  consequence,
  isOpen,
  onClose
}) => {
  const { isArabic, isJunior, playTap } = useAgeMode();

  if (!isOpen || !consequence) return null;

  const hero = consequence.heroAdvisorId !== 'rex' ? getHero(consequence.heroAdvisorId as any) : null;
  const heroName = isArabic ? hero?.nameAr : hero?.nameEn;
  const heroAsset = hero ? getCharacterAsset(hero.id, consequence.type === 'celebration' ? 'celebrating' : 'thinking') : null;

  const isWarning = consequence.type === 'warning' || consequence.type === 'critical';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header Bar */}
          <div className={`h-3 w-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />

          <button
            onClick={() => { playTap?.(); onClose(); }}
            className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors z-10`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            {/* Advisor & Title */}
            <div className="flex items-center gap-4 mb-6">
              {heroAsset && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 p-1 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                  <img
                    src={heroAsset.path}
                    alt={heroName || 'Hero'}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                  {isArabic ? `تحليل المستشار: ${heroName}` : `${heroName}'s Business Analysis`}
                </span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {isArabic ? consequence.titleAr : consequence.titleEn}
                </h3>
              </div>
            </div>

            {/* "Why This Happened" Card */}
            <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-200 font-black text-sm">
                <HelpCircle className="w-4 h-4 text-sky-500" />
                <span>{isArabic ? 'لماذا حدث هذا؟ (السبب والنتيجة)' : 'Why did this happen? (Cause & Effect)'}</span>
              </div>
              <p className={`text-slate-600 dark:text-slate-300 leading-relaxed ${isJunior ? 'text-base font-medium' : 'text-sm'}`}>
                {isArabic ? consequence.whyExplanationAr : consequence.whyExplanationEn}
              </p>
            </div>

            {/* "Suggested Action" Card */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/70">
              <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 font-black text-sm">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{isArabic ? 'ماذا تفعل كقائد أعمال؟' : 'What to do next as a CEO?'}</span>
              </div>
              <p className={`text-indigo-950 dark:text-indigo-200 leading-relaxed font-semibold ${isJunior ? 'text-base' : 'text-sm'}`}>
                {isArabic ? consequence.suggestedActionAr : consequence.suggestedActionEn}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => { playTap?.(); onClose(); }}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{isArabic ? 'فهمت الدرس، دعنا نطور المشروع!' : 'Understood, Let Us Optimize!'}</span>
              <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
