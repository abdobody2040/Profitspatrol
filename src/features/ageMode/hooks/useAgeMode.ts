import { useCallback, useMemo } from 'react';
import { useAppStore } from '../../../store';
import { DESIGN_TOKENS, AgeMode } from '../tokens/designTokens';
import { SoundService } from '../../../lib/sound';
import { useTranslation } from 'react-i18next';

export const useAgeMode = () => {
  const user = useAppStore((state) => state.user);
  const setAgeModeStore = useAppStore((state) => state.setAgeMode);
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Determine age mode from settings or kid's age; default to 'junior' for kid accounts
  const mode: AgeMode = useMemo(() => {
    if (user?.settings?.ageMode) {
      return user.settings.ageMode;
    }
    if (user?.age && user.age > 9) {
      return 'explorer';
    }
    return 'junior';
  }, [user?.settings?.ageMode, user?.age]);

  const isJunior = mode === 'junior';
  const isExplorer = mode === 'explorer';

  const setAgeMode = useCallback((newMode: AgeMode) => {
    setAgeModeStore(newMode);
  }, [setAgeModeStore]);

  // Touch targets and typography classes
  const touchClass = isJunior ? 'min-h-[64px] min-w-[64px]' : 'min-h-[48px] min-w-[48px]';
  const bodyTextClass = isJunior ? DESIGN_TOKENS.typography.junior.body : DESIGN_TOKENS.typography.explorer.body;
  const headingTextClass = isJunior ? DESIGN_TOKENS.typography.junior.heading : DESIGN_TOKENS.typography.explorer.heading;

  // Sound + Haptics (toggleable via user.settings)
  const soundEnabled = user?.settings?.soundEnabled ?? true;
  const hapticsEnabled = user?.settings?.hapticsEnabled ?? true;

  const playTap = useCallback(() => {
    if (soundEnabled) {
      SoundService.playClick();
    }
    if (hapticsEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Safe fallback
      }
    }
  }, [soundEnabled, hapticsEnabled]);

  const playSuccess = useCallback(() => {
    if (soundEnabled) {
      SoundService.playSuccess();
    }
    if (hapticsEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25, 40, 35]);
      } catch {
        // Safe fallback
      }
    }
  }, [soundEnabled, hapticsEnabled]);

  // Spoken narration helper for Ollie hints
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isArabic ? 'ar-SA' : 'en-US';
      utterance.rate = isJunior ? 0.9 : 1.0;
      utterance.pitch = 1.15; // Friendly energetic pitch
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isArabic, isJunior]);

  // UI labels adapted by age
  const labels = useMemo(() => ({
    primaryCta: isJunior
      ? (isArabic ? 'هيا نلعب!' : "Let's play!")
      : (isArabic ? 'ابدأ الدرس' : 'Start lesson'),
    wealth: isArabic ? 'ثروتي' : 'My Wealth',
    earnings: isArabic ? 'أرباحي' : 'Earnings',
    collectCoins: isArabic ? 'جمع العملات' : 'Collect Coins',
    goodJob: isArabic ? 'عمل رائع يا بطل!' : 'Great job!',
    mapTitle: isJunior
      ? (isArabic ? 'رحلة المغامرة' : 'Adventure Path')
      : (isArabic ? 'خريطة الأعمال' : 'Business Journey')
  }), [isJunior, isArabic]);

  return {
    mode,
    isJunior,
    isExplorer,
    setAgeMode,
    tokens: DESIGN_TOKENS,
    touchClass,
    bodyTextClass,
    headingTextClass,
    playTap,
    playSuccess,
    speakText,
    labels,
    isArabic
  };
};
