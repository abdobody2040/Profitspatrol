import { SoundService } from '../../lib/sound';

export type CharacterId = 'ollie' | 'reema' | 'filo' | 'kami' | 'rex' | 'narrator';

export interface CharacterVoiceProfile {
  nameEn: string;
  nameAr: string;
  pitch: number;
  rate: number;
  gender: 'female' | 'male';
}

export const CHARACTER_VOICE_PROFILES: Record<CharacterId, CharacterVoiceProfile> = {
  ollie: {
    nameEn: 'Ollie',
    nameAr: 'أولي',
    pitch: 1.05,
    rate: 0.95,
    gender: 'male',
  },
  reema: {
    nameEn: 'Reema',
    nameAr: 'ريما',
    pitch: 1.25,
    rate: 1.05,
    gender: 'female',
  },
  filo: {
    nameEn: 'Filo',
    nameAr: 'فيلو',
    pitch: 0.85,
    rate: 0.90,
    gender: 'male',
  },
  kami: {
    nameEn: 'Kami',
    nameAr: 'كامي',
    pitch: 1.35,
    rate: 1.10,
    gender: 'female',
  },
  rex: {
    nameEn: 'Rex',
    nameAr: 'ريكس',
    pitch: 0.95,
    rate: 1.12,
    gender: 'male',
  },
  narrator: {
    nameEn: 'Profits Patrol',
    nameAr: 'المرشد',
    pitch: 1.0,
    rate: 1.0,
    gender: 'female',
  },
};

type VoiceListener = (isSpeaking: boolean, characterId: CharacterId | null) => void;

class CharacterVoiceEngineService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentSpeaker: CharacterId | null = null;
  private isSpeaking: boolean = false;
  private listeners: Set<VoiceListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  public subscribe(listener: VoiceListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeaking, this.currentSpeaker);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isSpeaking, this.currentSpeaker));
  }

  /**
   * Strip markdown syntax, symbols, and URLs to ensure clean text-to-speech output
   */
  public getProfile(id: CharacterId): CharacterVoiceProfile {
    return CHARACTER_VOICE_PROFILES[id] || CHARACTER_VOICE_PROFILES.ollie;
  }

  public prepareTextForSpeech(text: string): string {
    return this.cleanTextForSpeech(text);
  }

  public cleanTextForSpeech(text: string): string {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // bold **text**
      .replace(/\*([^*]+)\*/g, '$1') // italic *text*
      .replace(/#+\s/g, '') // headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/`([^`]+)`/g, '$1') // inline code
      .replace(/[•–—]/g, ' ') // bullets and dashes
      .replace(/\s+/g, ' ') // multiple spaces
      .trim();
  }

  /**
   * Play character intro sound and speak dialogue
   */
  public speak(
    characterId: CharacterId,
    rawText: string,
    lang: string = 'ar',
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    this.stop();

    const text = this.cleanTextForSpeech(rawText);
    if (!text) return false;

    // Play character audio earcon before speaking
    SoundService.playCharacterEarcon(characterId);

    const profile = CHARACTER_VOICE_PROFILES[characterId] || CHARACTER_VOICE_PROFILES.narrator;
    const isArabic = lang.startsWith('ar');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isArabic ? 'ar-SA' : 'en-US';
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;

    // Best effort: select matching voice if available in user's OS
    if (this.voices.length > 0) {
      const targetLang = isArabic ? 'ar' : 'en';
      const candidateVoices = this.voices.filter((v) =>
        v.lang.toLowerCase().startsWith(targetLang)
      );

      if (candidateVoices.length > 0) {
        // Preferred gender matching or fallback to first matching voice
        const genderMatch = candidateVoices.find((v) =>
          profile.gender === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('tarik')
        );
        utterance.voice = genderMatch || candidateVoices[0];
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentSpeaker = characterId;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentSpeaker = null;
      this.currentUtterance = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentSpeaker = null;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentSpeaker = null;
    this.currentUtterance = null;
    this.notify();
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      currentSpeaker: this.currentSpeaker,
    };
  }
}

export const CharacterVoiceEngine = new CharacterVoiceEngineService();
