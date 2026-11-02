import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Gift, 
  Award, 
  ChevronRight, 
  Clock, 
  Flame,
  Check
} from 'lucide-react';
import { CharacterId, getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { HEROES } from '../data/heroes';
import { RIVAL_REX } from '../data/rivalRex';
import { useStoryQuestStore } from '../store/questStore';
import { useTrustStore } from '../store/trustStore';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import CoinIcon from '../../../components/ui/CoinIcon';

interface CharacterQuestsPanelProps {
  characterId: CharacterId;
}

export const CharacterQuestsPanel: React.FC<CharacterQuestsPanelProps> = ({ characterId }) => {
  const { isArabic, playTap, playSuccess } = useAgeMode();
  const getCharacterQuests = useStoryQuestStore((state) => state.getCharacterQuests);
  const claimQuestReward = useStoryQuestStore((state) => state.claimQuestReward);
  const characterTrust = useTrustStore((state) => state.characters[characterId]);

  const isRex = characterId === 'rex';
  const hero = !isRex ? HEROES[characterId] : null;
  const rival = isRex ? RIVAL_REX : null;
  const charTheme = isRex ? rival?.colors.accent : hero?.colors.primary;
  const charName = isArabic 
    ? (isRex ? rival?.nameAr : hero?.nameAr)
    : (isRex ? rival?.nameEn : hero?.nameEn);

  const questEntries = getCharacterQuests(characterId);

  const handleClaim = (questId: string) => {
    playSuccess?.();
    claimQuestReward(questId);
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Narrative Header Card */}
      <div 
        className="p-4 sm:p-5 rounded-3xl border shadow-sm flex items-center gap-4 relative overflow-hidden"
        style={{ 
          borderColor: `${charTheme}40`,
          background: `linear-gradient(135deg, ${charTheme}12 0%, #ffffff 80%)`
        }}
      >
        <div 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex-shrink-0 flex items-center justify-center p-1 border-2 shadow"
          style={{ borderColor: charTheme, backgroundColor: `${charTheme}20` }}
        >
          <img
            src={getCharacterAsset(characterId, 'happy').path}
            alt={charName || ''}
            className="w-full h-full object-contain"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
        </div>

        <div>
          <span 
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black text-white mb-1 shadow-sm"
            style={{ backgroundColor: charTheme }}
          >
            {isArabic ? `مهمات ${charName} القصصية` : `${charName}'s Storyline Quests`}
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
            {isArabic 
              ? 'مغامرات استراتيجية لفتح أثاث وتذكارات نادرة للمقر الرئيسي (HQ)'
              : 'Hero-driven adventures unlocking rare furniture and trophies for your Headquarters'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {isArabic 
              ? `المستوى الحالي: T${characterTrust?.currentTier || 1} • كلما زادت ثقتك فتحت مهمات أكثر ندرة`
              : `Current Tier: T${characterTrust?.currentTier || 1} • Higher trust unlocks legendary chapters`}
          </p>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        {questEntries.map(({ quest, progress }) => {
          const isLocked = progress.status === 'locked';
          const isCompleted = progress.status === 'completed';
          const isClaimed = progress.status === 'claimed';
          const isActive = progress.status === 'active';

          const progressPercent = Math.min(
            100, 
            Math.round((progress.currentCount / quest.targetCount) * 100)
          );

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all relative overflow-hidden ${
                isClaimed
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-800/40 opacity-90'
                  : isCompleted
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 border-amber-400 dark:border-amber-500 shadow-lg'
                  : isActive
                  ? 'bg-white dark:bg-slate-850 border-indigo-200 dark:border-indigo-900/60 shadow-md'
                  : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              {/* Top Row: Title + Tier requirement */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shadow-sm"
                    style={{ 
                      backgroundColor: `${charTheme}20`,
                      color: charTheme
                    }}
                  >
                    T{quest.requiredTier}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {isArabic ? quest.titleAr : quest.titleEn}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      {isArabic ? `يتطلب المستوى ${quest.requiredTier}` : `Requires Tier ${quest.requiredTier}`}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                      {isArabic ? 'مكتمل ومستلم' : 'Reward Claimed'}
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white animate-pulse shadow">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isArabic ? 'جاهز للاستلام!' : 'Ready to Claim!'}
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      <Clock className="w-3.5 h-3.5" />
                      {isArabic ? 'قيد الإنجاز' : 'In Progress'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      {isArabic ? 'مقفول' : 'Locked'}
                    </span>
                  )}
                </div>
              </div>

              {/* Narrative Lore Speech Bubble */}
              <div className="my-3 p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{isArabic ? quest.narrativeAr : quest.narrativeEn}"
                </p>
              </div>

              {/* Objective & Progress Bar */}
              <div className="my-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    {isArabic ? quest.objectiveAr : quest.objectiveEn}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {progress.currentCount} / {quest.targetCount} ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: isCompleted || isClaimed ? '#10B981' : charTheme }}
                  />
                </div>
              </div>

              {/* Reward Showcase & Claim Action */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Reward elements */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* HQ Item */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-purple-950 dark:text-purple-200">
                    <span className="text-lg">{quest.reward.hqItemIcon}</span>
                    <div className="text-start">
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                        {isArabic ? 'عنصر HQ نادر' : 'Rare HQ Item'}
                      </p>
                      <p className="text-xs font-black">
                        {isArabic ? quest.reward.hqItemNameAr : quest.reward.hqItemNameEn}
                      </p>
                    </div>
                  </div>

                  {/* Tokens & XP */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs font-black">
                      <CoinIcon size={14} />
                      +{quest.reward.ppTokens}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-200 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      +{quest.reward.xp} XP
                    </span>
                  </div>
                </div>

                {/* Claim CTA Button */}
                <div className="flex-shrink-0">
                  {isCompleted && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleClaim(quest.id)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-sm text-white shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 flex items-center justify-center gap-2"
                    >
                      <Gift className="w-4 h-4 animate-bounce" />
                      <span>{isArabic ? 'استلم الجائزة النادرة!' : 'Claim Rare Item!'}</span>
                    </motion.button>
                  )}

                  {isClaimed && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isArabic ? 'موجود في مقرك الرئيسي' : 'Placed in HQ Storage'}</span>
                    </span>
                  )}

                  {isActive && (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <span>{isArabic ? 'المهمة جارية في المقاطعات' : 'Active in Districts'}</span>
                    </span>
                  )}

                  {isLocked && (
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isArabic ? `يتطلب ثقة ${quest.requiredTier}` : `Unlock at Tier ${quest.requiredTier}`}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
