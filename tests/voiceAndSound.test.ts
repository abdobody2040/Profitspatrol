import { describe, it, expect } from 'vitest';
import { CharacterVoiceEngine, CHARACTER_VOICE_PROFILES } from '../src/services/voice/CharacterVoiceEngine';
import { SoundService } from '../src/lib/sound';

describe('Voice & Sound System (Roadmap Step 3)', () => {
  it('defines distinct character voice profiles for all 5 characters', () => {
    const characters = ['ollie', 'reema', 'filo', 'kami', 'rex'] as const;
    
    for (const charId of characters) {
      const profile = CharacterVoiceEngine.getProfile(charId);
      expect(profile).toBeDefined();
      expect(profile.nameEn).toBeTruthy();
      expect(profile.nameAr).toBeTruthy();
      expect(profile.rate).toBeGreaterThan(0.5);
      expect(profile.pitch).toBeGreaterThan(0.5);
    }

    // Rex is the deeper-voiced rival
    expect(CHARACTER_VOICE_PROFILES.rex.pitch).toBeLessThan(1.0);
    // Kami is energetic tech innovator
    expect(CHARACTER_VOICE_PROFILES.kami.pitch).toBeGreaterThan(1.1);
  });

  it('cleans markdown, code blocks, and symbols from speech text', () => {
    const raw = '# Welcome!\nHere is **important** information about *investing* `code` and emojis 🚀💰!';
    const cleaned = CharacterVoiceEngine.prepareTextForSpeech(raw);
    
    expect(cleaned).not.toContain('#');
    expect(cleaned).not.toContain('**');
    expect(cleaned).not.toContain('*');
    expect(cleaned).not.toContain('`');
    expect(cleaned).toContain('Welcome!');
    expect(cleaned).toContain('important');
    expect(cleaned).toContain('investing');
  });

  it('exposes synthesized earcons and sound effects in SoundService', () => {
    expect(typeof SoundService.playCharacterEarcon).toBe('function');
    expect(typeof SoundService.playCashRegister).toBe('function');
    expect(typeof SoundService.playBadgeUnlock).toBe('function');
    expect(typeof SoundService.playWhoosh).toBe('function');
    expect(typeof SoundService.playStreakFlame).toBe('function');
    expect(typeof SoundService.playReward).toBe('function');

    // Executing shouldn'\''t throw in Node/Vitest environment
    expect(() => SoundService.playCharacterEarcon('ollie')).not.toThrow();
    expect(() => SoundService.playCharacterEarcon('rex')).not.toThrow();
    expect(() => SoundService.playCashRegister()).not.toThrow();
    expect(() => SoundService.playBadgeUnlock()).not.toThrow();
    expect(() => SoundService.playReward()).not.toThrow();
  });
});
