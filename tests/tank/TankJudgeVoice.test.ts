import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TankJudgeVoiceEngine,
  JUDGE_VOICE_PROFILES,
  JudgeId,
} from '../../src/services/voice/TankJudgeVoiceEngine';
import { Offer, Judge } from '../../src/features/tank/logic/TheTankEngine';

describe('TankJudgeVoiceEngine (Upgrade 9: AI Voice Interaction for The Tank)', () => {
  beforeEach(() => {
    TankJudgeVoiceEngine.stop();
    TankJudgeVoiceEngine.setVoiceEnabled(true);
  });

  it('defines distinct voice profiles for all 5 canonical tank judges', () => {
    const judgeIds: JudgeId[] = ['cash', 'tech', 'vision', 'eco', 'trend'];
    
    judgeIds.forEach((id) => {
      const profile = JUDGE_VOICE_PROFILES[id];
      expect(profile).toBeDefined();
      expect(profile.nameEn).toBeTruthy();
      expect(profile.nameAr).toBeTruthy();
      expect(profile.pitch).toBeGreaterThan(0.5);
      expect(profile.pitch).toBeLessThan(1.6);
      expect(profile.rate).toBeGreaterThan(0.7);
      expect(profile.rate).toBeLessThan(1.4);
      expect(['male', 'female']).toContain(profile.gender);
    });
  });

  it('sanitizes currencies and percentages in cleanTextForSpeech', () => {
    const text = 'I offer $50,000 for 15% of your business! **Huge** deal.';
    const cleaned = TankJudgeVoiceEngine.cleanTextForSpeech(text);
    expect(cleaned).toContain('50,000 dollars');
    expect(cleaned).toContain('15 percent');
    expect(cleaned).toContain('Huge deal');
    expect(cleaned).not.toContain('**');
    expect(cleaned).not.toContain('$');
    expect(cleaned).not.toContain('%');
  });

  it('allows enabling and disabling voice narration', () => {
    expect(TankJudgeVoiceEngine.isVoiceEnabled()).toBe(true);
    TankJudgeVoiceEngine.setVoiceEnabled(false);
    expect(TankJudgeVoiceEngine.isVoiceEnabled()).toBe(false);

    // When disabled, speakAsJudge immediately returns false
    const spoken = TankJudgeVoiceEngine.speakAsJudge('cash', 'Hello founders');
    expect(spoken).toBe(false);
  });

  it('supports subscriber notifications for voice state and waveforms', () => {
    let capturedState: any = null;
    const unsub = TankJudgeVoiceEngine.subscribe((state) => {
      capturedState = state;
    });

    expect(capturedState).toBeDefined();
    expect(capturedState.isSpeaking).toBe(false);
    expect(capturedState.activeJudgeId).toBeNull();
    expect(typeof capturedState.waveformLevel).toBe('number');

    unsub();
  });

  it('handles bilingual offers gracefully without exceptions', () => {
    const mockJudge: Judge = {
      id: 'tech',
      nameKey: 'tank.judge_tech',
      styleKey: 'tank.style_tech',
      color: 'bg-blue-600',
      minEquity: 15,
      maxValuationMultiplier: 1.5,
      patience: 5,
    };

    const mockOffer: Offer = {
      judge: mockJudge,
      valuation: 75000,
      equity: 12,
      comment: 'GREAT',
    };

    expect(() => TankJudgeVoiceEngine.speakOffer(mockOffer, false)).not.toThrow();
    expect(() => TankJudgeVoiceEngine.speakOffer(mockOffer, true)).not.toThrow();
    expect(() => TankJudgeVoiceEngine.speakRejection(mockJudge, true)).not.toThrow();
    expect(() => TankJudgeVoiceEngine.speakDealAccepted('tech', false)).not.toThrow();
    expect(() => TankJudgeVoiceEngine.speakCounterResponse('tech', true)).not.toThrow();
    expect(() => TankJudgeVoiceEngine.speakWalkAway('tech', false)).not.toThrow();
  });
});
