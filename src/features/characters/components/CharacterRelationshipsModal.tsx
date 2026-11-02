import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Shield, 
  Sparkles, 
  History, 
  Zap, 
  Lock, 
  CheckCircle2, 
  Award,
  ChevronRight,
  TrendingUp,
  Scroll,
  Gift
} from 'lucide-react';
import { CharacterId, getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { HEROES } from '../data/heroes';
import { RIVAL_REX } from '../data/rivalRex';
import { TRUST_TIERS, REX_RESPECT_TIERS, getPerksForCharacter } from '../data/trustPerks';
import { useTrustStore } from '../store/trustStore';
import { useStoryQuestStore } from '../store/questStore';
import { calculateTierProgress } from '../engine/relationshipEngine';
import { CharacterTrustCard } from './CharacterTrustCard';
import { CharacterQuestsPanel } from './CharacterQuestsPanel';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';

export interface CharacterRelationshipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCharacterId?: CharacterId;
}

const ALL_ROSTER: CharacterId[] = ['ollie', 'reema', 'filo', 'kami', 'rex'];

export const CharacterRelationshipsModal: React.FC<CharacterRelationshipsModalProps> = ({
  isOpen,
  onClose,
  initialCharacterId = 'ollie'
}) => {
  const { isArabic, playTap } = useAgeMode();
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>(initialCharacterId);
  const [activeTab, setActiveTab] = useState<'profile' | 'quests' | 'all_perks' | 'history'>('profile');

  const charactersState = useTrustStore((state) => state.characters);
  const recentLogs = useTrustStore((state) => state.recentLogs);
  const claimableQuestsCount = useStoryQuestStore((state) => state.getClaimableQuestCount());

  if (!isOpen) return null;

  // Selected character details
  const isRex = selectedCharId === 'rex';
  const hero = !isRex ? HEROES[selectedCharId] : null;
  const rival = isRex ? RIVAL_REX : null;
  const selectedState = charactersState[selectedCharId];
  const charTheme = isRex ? rival?.colors.accent : hero?.colors.primary;

  // Filter logs for selected character
  const charLogs = recentLogs.filter((log) => log.characterId === selectedCharId);

  // Compute total perks unlocked across all characters
  const totalPerksUnlocked = Object.values(charactersState).reduce(
    (sum, char) => sum + (char.unlockedPerkIds?.length || 0),
    0
  );

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="relative px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/60 via-purple-50/60 to-amber-50/60 dark:from-slate-800/80 dark:to-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {isArabic ? 'مقر علاقات الأبطال والخصوم' : 'Hero Trust & Rivalry HQ'}
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    <Sparkles className="w-3 h-3" />
                    {totalPerksUnlocked} {isArabic ? 'ميزة مفعلة' : 'Perks Active'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {isArabic 
                    ? 'ابنِ الثقة مع الأبطال واكسب احترام ريكس لفتح مزايا استراتيجية حصرية'
                    : 'Deepen bonds with your mentor heroes and earn rival respect to unlock exclusive passive perks'}
                </p>
              </div>
            </div>

            <button
              onClick={() => { playTap?.(); onClose(); }}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Character Roster Tabs */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {ALL_ROSTER.map((charId) => {
              const isSelected = selectedCharId === charId;
              const charIsRex = charId === 'rex';
              const cHero = !charIsRex ? HEROES[charId] : null;
              const cRival = charIsRex ? RIVAL_REX : null;
              const charName = isArabic 
                ? (charIsRex ? cRival?.nameAr : cHero?.nameAr)
                : (charIsRex ? cRival?.nameEn : cHero?.nameEn);
              const charState = charactersState[charId];
              const progress = calculateTierProgress(charState.trustPoints, charIsRex);
              const asset = getCharacterAsset(charId, isSelected ? 'happy' : 'idle');
              const tierName = isArabic ? progress.currentTier.nameAr : progress.currentTier.nameEn;

              return (
                <button
                  key={charId}
                  onClick={() => {
                    playTap?.();
                    setSelectedCharId(charId);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all flex-shrink-0 text-start ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-md border-indigo-300 dark:border-indigo-600 scale-[1.02]'
                      : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 border"
                    style={{ 
                      borderColor: charIsRex ? cRival?.colors.accent : cHero?.colors.primary,
                      backgroundColor: `${charIsRex ? cRival?.colors.accent : cHero?.colors.primary}15`
                    }}
                  >
                    <img 
                      src={asset.path} 
                      alt={charName || ''} 
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {charName}
                      </span>
                      {charIsRex && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                          {isArabic ? 'منافس' : 'Rival'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      <span>T{charState.currentTier}:</span>
                      <span className="truncate max-w-[80px]">{tierName}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub-navigation inside modal */}
          <div className="px-6 pt-3 flex items-center gap-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => { playTap?.(); setActiveTab('profile'); }}
              className={`pb-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isArabic ? 'بطاقة الثقة والمزايا' : 'Trust Card & Perks'}</span>
            </button>

            <button
              onClick={() => { playTap?.(); setActiveTab('quests'); }}
              className={`pb-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'quests'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>{isArabic ? 'مهمات القصة والـ HQ' : 'Story Quests & HQ'}</span>
              {claimableQuestsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black animate-bounce shadow">
                  {claimableQuestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { playTap?.(); setActiveTab('all_perks'); }}
              className={`pb-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'all_perks'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isArabic ? 'شجرة كل المزايا' : 'All Perks Directory'}</span>
            </button>

            <button
              onClick={() => { playTap?.(); setActiveTab('history'); }}
              className={`pb-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{isArabic ? 'سجل التفاعلات' : 'Recent Log'}</span>
              {charLogs.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
                  {charLogs.length}
                </span>
              )}
            </button>
          </div>

          {/* Modal Main Content Area */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <CharacterTrustCard characterId={selectedCharId} />
              </div>
            )}

            {activeTab === 'quests' && (
              <div className="space-y-6">
                <CharacterQuestsPanel characterId={selectedCharId} />
              </div>
            )}

            {activeTab === 'all_perks' && (
              <div className="space-y-6">
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                  <h4 className="text-base font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>{isArabic ? 'كتالوج المزايا الشامل لجميع الأبطال' : 'Complete Hero Perks Catalog'}</span>
                  </h4>
                  <p className="text-xs text-indigo-800/80 dark:text-indigo-300 mt-1">
                    {isArabic 
                      ? 'كل ميزة تفتحها تبقى مفعلة دائماً في تجارتك ودروسك وتحديات السوق'
                      : 'All unlocked perks stay permanently active across your shops, lessons, and market encounters'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ALL_ROSTER.map((charId) => {
                    const cIsRex = charId === 'rex';
                    const cHero = !cIsRex ? HEROES[charId] : null;
                    const cRival = cIsRex ? RIVAL_REX : null;
                    const cName = isArabic 
                      ? (cIsRex ? cRival?.nameAr : cHero?.nameAr)
                      : (cIsRex ? cRival?.nameEn : cHero?.nameEn);
                    const perks = getPerksForCharacter(charId);
                    const charState = charactersState[charId];

                    return (
                      <div 
                        key={charId}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                            {cName}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {charState.unlockedPerkIds.length} / {perks.length} {isArabic ? 'مفتوح' : 'Unlocked'}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {perks.map((perk) => {
                            const isUnlocked = charState.unlockedPerkIds.includes(perk.id);
                            return (
                              <div
                                key={perk.id}
                                className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                                  isUnlocked
                                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                                    : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {isUnlocked ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                  <div className="font-extrabold flex items-center gap-1.5">
                                    <span>{isArabic ? perk.titleAr : perk.titleEn}</span>
                                    <span className="text-[10px] px-1 py-0.2 rounded font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                      T{perk.tierRequired}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                                    {isArabic ? perk.descriptionAr : perk.descriptionEn}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    <span>{isArabic ? 'سجل تفاعلات النقاط والثقة' : 'Trust Points Log'}</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    {charLogs.length} {isArabic ? 'حدث مسجل' : 'events logged'}
                  </span>
                </div>

                {charLogs.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-400 animate-bounce" />
                    <p className="font-bold">
                      {isArabic ? 'لا توجد تفاعلات مسجلة مع هذا البطل بعد!' : 'No interaction events recorded with this character yet!'}
                    </p>
                    <p className="text-xs mt-1">
                      {isArabic 
                        ? 'أكمل الدروس، اصنع نماذج في معمل كامي، أو واجه ريكس لكسب النقاط.'
                        : 'Complete lessons, craft prototypes in Kami Lab, or challenge Rex to build trust.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {charLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                            +{log.pointsAdded}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                              {isArabic ? log.reasonAr : log.reasonEn}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                          +{log.pointsAdded} TP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
            <button
              onClick={() => { playTap?.(); onClose(); }}
              className="px-6 py-2.5 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              {isArabic ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
