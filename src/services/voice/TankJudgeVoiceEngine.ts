import { SoundService } from '../../lib/sound';
import { Offer, Judge } from '../../features/tank/logic/TheTankEngine';

export type JudgeId = 'cash' | 'tech' | 'vision' | 'eco' | 'trend';

export interface JudgeVoiceProfile {
  nameEn: string;
  nameAr: string;
  pitch: number;
  rate: number;
  gender: 'female' | 'male';
}

export const JUDGE_VOICE_PROFILES: Record<JudgeId, JudgeVoiceProfile> = {
  cash: {
    nameEn: 'Judge Cash',
    nameAr: 'المستثمر كاش',
    pitch: 0.82,
    rate: 0.95,
    gender: 'male',
  },
  tech: {
    nameEn: 'Judge Tech',
    nameAr: 'مستثمرة التقنية',
    pitch: 1.25,
    rate: 1.10,
    gender: 'female',
  },
  vision: {
    nameEn: 'Judge Vision',
    nameAr: 'مستثمر الرؤية',
    pitch: 0.95,
    rate: 0.92,
    gender: 'male',
  },
  eco: {
    nameEn: 'Judge Eco',
    nameAr: 'المستثمرة البيئية',
    pitch: 1.10,
    rate: 0.98,
    gender: 'female',
  },
  trend: {
    nameEn: 'Judge Trend',
    nameAr: 'مستثمرة الترند',
    pitch: 1.30,
    rate: 1.15,
    gender: 'female',
  },
};

type JudgeVoiceListener = (state: { isSpeaking: boolean; activeJudgeId: string | null; waveformLevel: number }) => void;

class TankJudgeVoiceEngineService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private activeJudgeId: string | null = null;
  private waveformLevel: number = 0;
  private waveformTimer: number | null = null;
  private listeners: Set<JudgeVoiceListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];
  private voiceEnabled: boolean = true;

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

  public subscribe(listener: JudgeVoiceListener): () => void {
    this.listeners.add(listener);
    listener({
      isSpeaking: this.isSpeaking,
      activeJudgeId: this.activeJudgeId,
      waveformLevel: this.waveformLevel,
    });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) =>
      listener({
        isSpeaking: this.isSpeaking,
        activeJudgeId: this.activeJudgeId,
        waveformLevel: this.waveformLevel,
      })
    );
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  public cleanTextForSpeech(text: string): string {
    return text
      .replace(/\$([0-9,]+)/g, '$1 dollars')
      .replace(/%/g, ' percent')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/[•–—#]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private startWaveformSimulation() {
    if (this.waveformTimer) clearInterval(this.waveformTimer);
    this.waveformTimer = window.setInterval(() => {
      if (!this.isSpeaking) {
        this.waveformLevel = 0;
        this.notify();
        return;
      }
      this.waveformLevel = Math.floor(Math.random() * 80) + 20;
      this.notify();
    }, 120);
  }

  private stopWaveformSimulation() {
    if (this.waveformTimer) {
      clearInterval(this.waveformTimer);
      this.waveformTimer = null;
    }
    this.waveformLevel = 0;
    this.notify();
  }

  public speakAsJudge(
    judgeId: string,
    rawText: string,
    lang: string = 'en',
    onEnd?: () => void
  ): boolean {
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return false;
    }

    this.stop();

    const text = this.cleanTextForSpeech(rawText);
    if (!text) return false;

    const profile = JUDGE_VOICE_PROFILES[judgeId as JudgeId] || JUDGE_VOICE_PROFILES.cash;
    const isArabic = lang.startsWith('ar');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isArabic ? 'ar-SA' : 'en-US';
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;

    if (this.voices.length > 0) {
      const targetLang = isArabic ? 'ar' : 'en';
      const candidateVoices = this.voices.filter((v) =>
        v.lang.toLowerCase().startsWith(targetLang)
      );

      if (candidateVoices.length > 0) {
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
      this.activeJudgeId = judgeId;
      this.startWaveformSimulation();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.activeJudgeId = null;
      this.currentUtterance = null;
      this.stopWaveformSimulation();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.activeJudgeId = null;
      this.currentUtterance = null;
      this.stopWaveformSimulation();
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public speakOffer(offer: Offer, isArabic: boolean): void {
    const judge = offer.judge;
    const valFormatted = offer.valuation.toLocaleString();
    const eq = offer.equity;

    let speechText = '';
    if (isArabic) {
      if (judge.id === 'cash') {
        speechText = `أنا ريكس، وأنا معجب بالأرقام والأرباح! أعرض عليك ${valFormatted} دولار مقابل ${eq} بالمئة من شركتك!`;
      } else if (judge.id === 'tech') {
        speechText = `أنا كامي، وهذا الاختراع التقني فريد من نوعه! إليك عرضي: ${valFormatted} دولار مقابل ${eq} بالمئة!`;
      } else if (judge.id === 'vision') {
        speechText = `أنا أولي، وأرى استراتيجية مستقبلية واعدة ومدروسة! عرضي هو ${valFormatted} دولار مقابل ${eq} بالمئة!`;
      } else if (judge.id === 'eco') {
        speechText = `أنا فيلو، ومشروعك آمن ومسؤول بيئياً ومالياً! أستثمر معك ${valFormatted} دولار مقابل ${eq} بالمئة!`;
      } else {
        speechText = `أنا ريما، وعلامتك التجارية ستكتسح السوق بانتشار فيروسي! أعطيك ${valFormatted} دولار مقابل ${eq} بالمئة!`;
      }
    } else {
      if (judge.id === 'cash') {
        speechText = `I am Rex. I like bold cash flow. Here is my deal: $${valFormatted} for ${eq}% equity!`;
      } else if (judge.id === 'tech') {
        speechText = `I am Kami. This tech prototype has massive scale! I offer $${valFormatted} for ${eq}% equity!`;
      } else if (judge.id === 'vision') {
        speechText = `I am Ollie. I see a powerful long-term business strategy. My offer is $${valFormatted} for ${eq}% equity!`;
      } else if (judge.id === 'eco') {
        speechText = `I am Filo. I love sustainable, risk-protected businesses. I will invest $${valFormatted} for ${eq}% equity!`;
      } else {
        speechText = `I am Reema. This brand is going to go totally viral! My offer is $${valFormatted} for ${eq}% equity!`;
      }
    }

    this.speakAsJudge(judge.id, speechText, isArabic ? 'ar' : 'en');
  }

  public speakRejection(judge: Judge, isArabic: boolean): void {
    const speechText = isArabic
      ? `الفكرة فيها مخاطرة كبيرة بالنسبة لي في الوقت الحالي. أنا منسحب!`
      : `The valuation does not make sense for me. I am OUT!`;
    this.speakAsJudge(judge.id, speechText, isArabic ? 'ar' : 'en');
  }

  public speakDealAccepted(judgeId: string, isArabic: boolean): void {
    const speechText = isArabic
      ? `لقد فاوضت بذكاء وبراعة. قبلت عرضك، ولدينا صفقة ناجحة!`
      : `You drove a hard bargain, young founder. We have a DEAL!`;
    this.speakAsJudge(judgeId, speechText, isArabic ? 'ar' : 'en');
  }

  public speakCounterResponse(judgeId: string, isArabic: boolean): void {
    const speechText = isArabic
      ? `لا يمكنني قبول ذلك العرض، لكن سألتقي معك في منتصف الطريق!`
      : `I cannot accept that valuation, but I will meet you in the middle!`;
    this.speakAsJudge(judgeId, speechText, isArabic ? 'ar' : 'en');
  }

  public speakWalkAway(judgeId: string, isArabic: boolean): void {
    const speechText = isArabic
      ? `لقد بالغت في طلبك كثيراً. لقد خسرت الصفقة، وأنا منسحب تماماً!`
      : `You pushed too hard on equity. You lost the deal, and I am OUT!`;
    this.speakAsJudge(judgeId, speechText, isArabic ? 'ar' : 'en');
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.activeJudgeId = null;
    this.currentUtterance = null;
    this.stopWaveformSimulation();
  }
}

export const TankJudgeVoiceEngine = new TankJudgeVoiceEngineService();
