import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, ChevronRight, Award, Heart } from 'lucide-react';
import { VoiceNarrationButton } from '../../../components/ui/VoiceNarrationButton';
import { CharacterId, CharacterEmotion, getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { getHero } from '../data/heroes';
import { RIVAL_REX } from '../data/rivalRex';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { useTrustStore } from '../store/trustStore';
import { calculateTierProgress } from '../engine/relationshipEngine';

export interface CharacterDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: CharacterId;
  emotion?: CharacterEmotion;
  titleEn?: string;
  titleAr?: string;
  dialogueEn: string;
  dialogueAr: string;
  primaryActionLabelEn?: string;
  primaryActionLabelAr?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabelEn?: string;
  secondaryActionLabelAr?: string;
  onSecondaryAction?: () => void;
  badgeTextEn?: string;
  badgeTextAr?: string;
  onOpenRelationships?: (characterId: CharacterId) => void;
}

export const CharacterDialogueModal: React.FC<CharacterDialogueModalProps> = ({
  isOpen,
  onClose,
  characterId,
  emotion = 'talking',
  titleEn,
  titleAr,
  dialogueEn,
  dialogueAr,
  primaryActionLabelEn = 'Got it!',
  primaryActionLabelAr = 'فهمت!',
  onPrimaryAction,
  secondaryActionLabelEn,
  secondaryActionLabelAr,
  onSecondaryAction,
  badgeTextEn,
  badgeTextAr,
  onOpenRelationships
}) => {
  const { isArabic, isJunior, playTap, playSuccess } = useAgeMode();
  const trustState = useTrustStore((state) => state.characters[characterId]);

  if (!isOpen) return null;

  const isRex = characterId === 'rex';
  const hero = !isRex ? getHero(characterId) : null;
  const rival = isRex ? RIVAL_REX : null;

  const charName = isArabic
    ? (isRex ? rival?.nameAr : hero?.nameAr)
    : (isRex ? rival?.nameEn : hero?.nameEn);

  const charRole = isArabic
    ? (isRex ? rival?.roleAr : hero?.roleAr)
    : (isRex ? rival?.roleEn : hero?.roleEn);

  const pillarText = !isRex && hero
    ? (isArabic ? hero.pillarAr : hero.pillarEn)
    : (isArabic ? 'منافس' : 'RIVAL');

  const themePrimary = isRex ? rival!.colors.accent : hero!.colors.primary;
  const themeSecondary = isRex ? rival!.colors.secondary : hero!.colors.secondary;

  const asset = getCharacterAsset(characterId, emotion);
  const tierProgress = calculateTierProgress(trustState?.trustPoints || 0, isRex);

  const handlePrimary = () => {
    playSuccess?.();
    // Award mentorship trust on dialogue interaction
    useTrustStore.getState().addTrust(
      characterId,
      10,
      'Hero Consultation & Mentorship',
      'جلسة استشارية وتوجيه مع البطل'
    );
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  const handleSecondary = () => {
    playTap?.();
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header Strip with Character Theme */}
          <div 
            className="h-3 w-full"
            style={{ backgroundColor: themePrimary }}
          />

          {/* Close button */}
          <button
            onClick={() => { playTap?.(); onClose(); }}
            className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors z-10`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            {/* Character Info Bar */}
            <div className="flex items-center gap-4 mb-5">
              <div 
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border-2 shadow-md"
                style={{ borderColor: themePrimary, backgroundColor: `${themePrimary}15` }}
              >
                <img
                  src={asset.path}
                  alt={charName || 'Character'}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    // Fallback to emoji avatar if image asset fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-1 right-1 text-xs px-1.5 py-0.5 rounded-full font-bold bg-white dark:bg-slate-800 shadow text-slate-700 dark:text-slate-300">
                  {pillarText}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white truncate">
                    {charName}
                  </h3>
                  {badgeTextEn && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: themePrimary }}
                    >
                      {isArabic ? (badgeTextAr || badgeTextEn) : badgeTextEn}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {charRole}
                </p>
                
                {/* Relationship / Trust Status Pill */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div 
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: themePrimary }}
                  >
                    <Heart className="w-3 h-3 fill-current" />
                    <span>T{tierProgress.currentTier.tier}: {isArabic ? tierProgress.currentTier.nameAr : tierProgress.currentTier.nameEn}</span>
                    <span className="opacity-80 text-[10px]">({trustState?.trustPoints || 0} TP)</span>
                  </div>

                  {onOpenRelationships && (
                    <button
                      onClick={() => {
                        playTap?.();
                        onOpenRelationships(characterId);
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>{isArabic ? 'عرض المزايا' : 'View Perks'}</span>
                      <ChevronRight className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="relative mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-inner">
                {(titleEn || titleAr) && (
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isArabic ? (titleAr || titleEn) : (titleEn || titleAr)}</span>
                  </h4>
                )}
                <p className={`text-slate-700 dark:text-slate-200 leading-relaxed ${isJunior ? 'text-lg font-medium' : 'text-base'}`}>
                  {isArabic ? dialogueAr : dialogueEn}
                </p>
                <div className="mt-3 flex justify-end">
                  <VoiceNarrationButton 
                    characterId={characterId} 
                    textToSpeak={isArabic ? dialogueAr : dialogueEn} 
                    size="sm" 
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {secondaryActionLabelEn && (
                <button
                  onClick={handleSecondary}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-h-[48px]"
                >
                  {isArabic ? (secondaryActionLabelAr || secondaryActionLabelEn) : secondaryActionLabelEn}
                </button>
              )}

              <button
                onClick={handlePrimary}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl text-white font-extrabold shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                style={{ backgroundColor: themePrimary }}
              >
                <span>{isArabic ? primaryActionLabelAr : primaryActionLabelEn}</span>
                <ChevronRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
