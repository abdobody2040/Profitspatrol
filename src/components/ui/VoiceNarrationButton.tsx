import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useCharacterVoice } from '../../services/voice/useCharacterVoice';
import { CharacterId, CHARACTER_VOICE_PROFILES } from '../../services/voice/CharacterVoiceEngine';
import { useTranslation } from 'react-i18next';

export interface VoiceNarrationButtonProps {
  size?: 'sm' | 'md' | 'lg';
  characterId: CharacterId;
  textToSpeak: string;
  className?: string;
  variant?: 'pill' | 'compact' | 'icon';
}

export const VoiceNarrationButton: React.FC<VoiceNarrationButtonProps> = ({
  characterId,
  textToSpeak,
  className = '',
  variant = 'pill',
  size = 'md',
}) => {
  const { toggle, isSpeaking, speakingCharacter } = useCharacterVoice();
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  const active = isSpeaking && speakingCharacter === characterId;
  const profile = CHARACTER_VOICE_PROFILES[characterId];
  const charName = isArabic ? profile?.nameAr : profile?.nameEn;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(characterId, textToSpeak);
  };

  if (variant === 'icon') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`p-2 rounded-2xl transition-all flex items-center justify-center ${
          active
            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-300'
            : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 text-[#F97316] border border-orange-200 dark:border-orange-800'
        } ${className}`}
        title={active ? (isArabic ? 'إيقاف الصوت' : 'Stop voice') : (isArabic ? `استمع إلى ${charName}` : `Listen to ${charName}`)}
      >
        {active ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl font-black text-xs transition-all shadow-sm select-none ${
        active
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-300'
          : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 text-[#F97316] border border-orange-200 dark:border-orange-800/80'
      } ${className}`}
    >
      {active ? (
        <>
          {/* Animated audio waveform bars */}
          <div className="flex items-center gap-0.5 h-3.5">
            {[0, 1, 2, 3].map((bar) => (
              <motion.span
                key={bar}
                animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + bar * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-1 bg-white rounded-full inline-block"
              />
            ))}
          </div>
          <span>{isArabic ? 'إيقاف القراءة' : 'Stop Narration'}</span>
        </>
      ) : (
        <>
          <Volume2 size={16} className="text-orange-500" />
          <span>{isArabic ? `استمع إلى ${charName}` : `Listen to ${charName}`}</span>
        </>
      )}
    </motion.button>
  );
};

export default VoiceNarrationButton;
