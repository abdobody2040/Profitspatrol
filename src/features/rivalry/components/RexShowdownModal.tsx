import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Coins, 
  Trophy, 
  ArrowRight, 
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Lightbulb
} from 'lucide-react';
import { DistrictId, getDistrict, CANONICAL_DISTRICTS } from '../../../domain/world/districts';
import { getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { RIVAL_REX } from '../../characters/data/rivalRex';
import { getHero } from '../../characters/data/heroes';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { useRivalryStore } from '../store/rivalryStore';
import { SoundService } from '../../../lib/sound';
import { VoiceNarrationButton } from '../../../components/ui/VoiceNarrationButton';
import { RivalChallenge, PlayerStrategicOption, RivalryResolution } from '../types/rivalry';
import { RelationshipEngine } from '../../characters/engine/relationshipEngine';
import { useAppStore } from '../../../store';

export interface RexShowdownModalProps {
  districtId: DistrictId;
  onClose: () => void;
  onShowdownCompleted?: (resolution: RivalryResolution) => void;
}

export const RexShowdownModal: React.FC<RexShowdownModalProps> = ({
  districtId,
  onClose,
  onShowdownCompleted
}) => {
  const { isArabic } = useAgeMode();
  const district = getDistrict(districtId) || CANONICAL_DISTRICTS[0];

  const {
    getDistrictStatus,
    startDistrictChallenge,
    resolveChallenge,
    clearActiveChallenge
  } = useRivalryStore();

  const districtStatus = getDistrictStatus(districtId);
  const [challenge] = useState<RivalChallenge>(() => startDistrictChallenge(districtId));
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resolution, setResolution] = useState<RivalryResolution | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (option: PlayerStrategicOption) => {
    SoundService.playClick();
    setSelectedOptionId(option.id);
  };

  const handleExecuteStrategy = () => {
    if (!selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = resolveChallenge(selectedOptionId);
      setResolution(res);

      // Award Rex respect points based on confrontation outcome
      RelationshipEngine.onRivalConfrontation(res.outcome);
      try {
        useAppStore.getState().trackMissionProgress('RIVAL_SHOWDOWN', 1, 'strategy');
      } catch (_) {}

      if (res.outcome === 'victory') {
        SoundService.playSuccess();
      } else if (res.outcome === 'defeat') {
        SoundService.playError();
      } else {
        SoundService.playClick();
      }

      if (onShowdownCompleted) {
        onShowdownCompleted(res);
      }
    } catch (err) {
      console.error('Error resolving challenge:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    SoundService.playClick();
    clearActiveChallenge();
    onClose();
  };

  const rexAvatar = getCharacterAsset('rex', resolution ? resolution.rexEmotion : challenge.rexEmotion);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-white my-auto"
      >
        {/* Top Header Banner */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-amber-600/30 via-slate-800 to-rose-600/30 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {isArabic ? 'تحدي المنافس الإقليمي' : 'District Rival Showdown'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                  {isArabic ? district.nameAr : district.nameEn}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {isArabic ? challenge.titleAr : challenge.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market Share Tug-of-War Bar */}
        <div className="px-6 pt-4 pb-2 bg-slate-950/60 border-b border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-black mb-1.5">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{isArabic ? 'حصتك في السوق:' : 'Your Market Share:'}</span>
              <span className="text-sm font-black text-emerald-300">
                {resolution ? resolution.playerMarketShareAfter : districtStatus.playerMarketShare}%
              </span>
            </span>
            <span className="text-rose-400 flex items-center gap-1.5">
              <span className="text-sm font-black text-rose-300">
                {resolution ? (100 - resolution.playerMarketShareAfter) : districtStatus.rexMarketShare}%
              </span>
              <span>{isArabic ? 'حصة ريكس:' : "Rex's Share:"}</span>
              <span>🦖</span>
            </span>
          </div>

          <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            <motion.div 
              initial={false}
              animate={{ 
                width: `${resolution ? resolution.playerMarketShareAfter : districtStatus.playerMarketShare}%` 
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            />
            <div className="flex-1 h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-r-full shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Rex Speech & Taunt Bubble */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-md">
            <div className="relative flex-shrink-0">
              <img 
                src={rexAvatar.path} 
                alt="Rex the Dinosaur" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/characters_clean/rex_idle.png';
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-slate-900 p-1 border-2 border-rose-500/50 shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 text-xs px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold uppercase tracking-wider">
                {isArabic ? RIVAL_REX.nameAr : RIVAL_REX.nameEn}
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-rose-400 italic">
                  &ldquo;{isArabic ? RIVAL_REX.philosophyAr : RIVAL_REX.philosophyEn}&rdquo;
                </span>
                <VoiceNarrationButton
                  characterId="rex"
                  textToSpeak={resolution 
                    ? (isArabic ? resolution.rexResponseAr : resolution.rexResponseEn)
                    : (isArabic ? challenge.rexTauntAr : challenge.rexTauntEn)}
                  size="sm"
                />
              </div>
              <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                {resolution 
                  ? (isArabic ? resolution.rexResponseAr : resolution.rexResponseEn)
                  : (isArabic ? challenge.rexTauntAr : challenge.rexTauntEn)}
              </p>
            </div>
          </div>

          {/* Scenario Details */}
          {!resolution && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{isArabic ? challenge.scenarioAr : challenge.scenarioEn}</span>
            </div>
          )}

          {/* Strategic Choices or Resolution View */}
          {!resolution ? (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                {isArabic ? 'اختر خطتك الاستراتيجية:' : 'Choose Your Strategic Response:'}
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {challenge.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const advisor = getHero(option.advisorRecommendation);

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-start p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]' 
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-sm sm:text-base text-white">
                          {isArabic ? option.titleAr : option.titleEn}
                        </span>

                        <div className="flex items-center gap-2">
                          {option.cashCost > 0 ? (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 font-bold border border-slate-700">
                              -${option.cashCost}
                            </span>
                          ) : (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                              {isArabic ? 'مجاني' : 'Free'}
                            </span>
                          )}

                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-600'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">
                        {isArabic ? option.descriptionAr : option.descriptionEn}
                      </p>

                      {/* Advisor Tip Bubble */}
                      <div className="mt-1 pt-2 border-t border-slate-700/40 flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-base">{advisor.animalAr.includes('بومة') ? '🦉' : advisor.animalAr.includes('ثعلب') ? '🦊' : advisor.animalAr.includes('فيل') ? '🐘' : '🦎'}</span>
                        <span className="italic text-slate-300">
                          {isArabic ? option.advisorTipAr : option.advisorTipEn}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  onClick={handleExecuteStrategy}
                  disabled={!selectedOptionId || isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                    selectedOptionId && !isSubmitting
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/25 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  <span>{isArabic ? 'تنفيذ الخطة ومواجهة ريكس ⚡' : 'Execute Plan & Face Rex ⚡'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Resolution View */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Outcome Badge Banner */}
              <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${
                resolution.outcome === 'victory'
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                  : resolution.outcome === 'tactical_draw'
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  resolution.outcome === 'victory' 
                    ? 'bg-emerald-500 text-slate-950' 
                    : resolution.outcome === 'tactical_draw'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-rose-500 text-white'
                }`}>
                  {resolution.outcome === 'victory' ? (
                    <Trophy className="w-7 h-7" />
                  ) : resolution.outcome === 'tactical_draw' ? (
                    <Shield className="w-7 h-7" />
                  ) : (
                    <AlertTriangle className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1">
                  <span className="text-xs uppercase font-black tracking-widest opacity-80">
                    {resolution.outcome === 'victory' 
                      ? (isArabic ? 'انتصار استراتيجي ساحق!' : 'Strategic Victory!') 
                      : resolution.outcome === 'tactical_draw'
                      ? (isArabic ? 'تعادل تكتيكي متماسك' : 'Tactical Draw')
                      : (isArabic ? 'درس اقتصادي قاسٍ' : 'Tough Learning Moment')}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    {resolution.outcome === 'victory'
                      ? (isArabic ? 'لقد تفوقت على تكتيك ريكس بذكاء!' : 'You Outsmarted Rex\'s Aggressive Move!')
                      : resolution.outcome === 'tactical_draw'
                      ? (isArabic ? 'صمدت في السوق وحافظت على موقعك' : 'You Held Your Ground in the Market')
                      : (isArabic ? 'ريكس استغل الخطأ لمصلحته مؤقتاً' : 'Rex Took Advantage of the Tactical Error')}
                  </h4>
                </div>
              </div>

              {/* Economic Consequence & Reasoning */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>{isArabic ? 'لماذا حدث ذلك؟ (رؤية المدير التنفيذي)' : 'Why Did This Happen? (CEO Insight)'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {isArabic ? resolution.educationalReasoningAr : resolution.educationalReasoningEn}
                </p>
              </div>

              {/* Stat Deltas & Rewards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400 block font-bold mb-1">
                    {isArabic ? 'تغير الحصة' : 'Market Share'}
                  </span>
                  <span className={`text-base sm:text-lg font-black flex items-center justify-center gap-1 ${
                    resolution.marketShareDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {resolution.marketShareDelta >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {resolution.marketShareDelta >= 0 ? `+${resolution.marketShareDelta}%` : `${resolution.marketShareDelta}%`}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400 block font-bold mb-1">
                    {isArabic ? 'توكنز الفوز' : 'P-Tokens'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                    <Coins className="w-4 h-4" />
                    +{resolution.tokensEarned}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400 block font-bold mb-1">
                    {isArabic ? 'خبرة قيادية' : 'Leadership XP'}
                  </span>
                  <span className="text-base sm:text-lg font-black text-cyan-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    +{resolution.xpEarned}
                  </span>
                </div>
              </div>

              {/* Done CTA */}
              <button
                onClick={handleClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {isArabic ? 'متابعة إدارة الأعمال 🚀' : 'Continue Managing Business 🚀'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
