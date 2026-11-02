import { useState, useEffect, useCallback } from 'react';
import { CharacterVoiceEngine, CharacterId } from './CharacterVoiceEngine';
import { useTranslation } from 'react-i18next';

export const useCharacterVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingCharacter, setSpeakingCharacter] = useState<CharacterId | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    return CharacterVoiceEngine.subscribe((speaking, character) => {
      setIsSpeaking(speaking);
      setSpeakingCharacter(character);
    });
  }, []);

  const speak = useCallback(
    (characterId: CharacterId, text: string, onEnd?: () => void) => {
      return CharacterVoiceEngine.speak(characterId, text, i18n.language, onEnd);
    },
    [i18n.language]
  );

  const stop = useCallback(() => {
    CharacterVoiceEngine.stop();
  }, []);

  const toggle = useCallback(
    (characterId: CharacterId, text: string) => {
      if (isSpeaking && speakingCharacter === characterId) {
        stop();
      } else {
        speak(characterId, text);
      }
    },
    [isSpeaking, speakingCharacter, speak, stop]
  );

  return {
    speak,
    stop,
    toggle,
    isSpeaking,
    speakingCharacter,
  };
};
