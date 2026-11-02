import { describe, it, expect, beforeEach } from 'vitest';
import { useTrustStore } from '../../src/features/characters/store/trustStore';
import { 
  TRUST_TIERS, 
  REX_RESPECT_TIERS, 
  getTierForPoints, 
  getPerksForCharacter 
} from '../../src/features/characters/data/trustPerks';
import { 
  RelationshipEngine, 
  calculateTierProgress 
} from '../../src/features/characters/engine/relationshipEngine';

describe('Character Relationship & Trust System (Option 1)', () => {
  beforeEach(() => {
    // Reset trust store before each test
    useTrustStore.getState().resetAllTrust();
  });

  describe('1. Store Initialization & Initial Perks', () => {
    it('initializes all 4 heroes and Rival Rex with Tier 1 and baseline perks', () => {
      const state = useTrustStore.getState().characters;
      const charIds = Object.keys(state);

      expect(charIds).toHaveLength(5);
      expect(charIds).toContain('ollie');
      expect(charIds).toContain('reema');
      expect(charIds).toContain('filo');
      expect(charIds).toContain('kami');
      expect(charIds).toContain('rex');

      // Ollie initial state
      const ollie = state['ollie'];
      expect(ollie.trustPoints).toBe(0);
      expect(ollie.currentTier).toBe(1);
      expect(ollie.totalInteractions).toBe(0);
      expect(ollie.unlockedPerkIds).toContain('ollie_p1');

      // Rex initial state
      const rex = state['rex'];
      expect(rex.trustPoints).toBe(0);
      expect(rex.currentTier).toBe(1);
      expect(rex.unlockedPerkIds).toContain('rex_p1');
    });

    it('hasPerk returns true for unlocked perks and false for locked perks', () => {
      const store = useTrustStore.getState();
      expect(store.hasPerk('ollie_p1')).toBe(true);
      expect(store.hasPerk('ollie_p5')).toBe(false);
    });
  });

  describe('2. Trust Accumulation & Tier Progression', () => {
    it('adds trust points and advances tier when threshold is reached', () => {
      const store = useTrustStore.getState();

      // Adding 50 points (still Tier 1, needs 100 for Tier 2)
      const res1 = store.addTrust('ollie', 50, 'Completed mini quiz', 'إتمام اختبار قصير');
      expect(res1.newTier).toBe(1);
      expect(res1.tierChanged).toBe(false);
      expect(useTrustStore.getState().characters.ollie.trustPoints).toBe(50);
      expect(useTrustStore.getState().characters.ollie.totalInteractions).toBe(1);

      // Adding 60 more points (total 110 >= 100 -> advances to Tier 2: Ally)
      const res2 = store.addTrust('ollie', 60, 'Completed Budgeting Unit', 'إتمام وحدة الميزانية');
      expect(res2.newTier).toBe(2);
      expect(res2.tierChanged).toBe(true);
      expect(res2.unlockedPerks.some(p => p.id === 'ollie_p2')).toBe(true);

      const updatedOllie = useTrustStore.getState().characters.ollie;
      expect(updatedOllie.currentTier).toBe(2);
      expect(updatedOllie.unlockedPerkIds).toContain('ollie_p2');
      expect(store.hasPerk('ollie_p2')).toBe(true);
    });

    it('records entries in recentLogs when trust is added', () => {
      const store = useTrustStore.getState();
      store.addTrust('reema', 25, 'Viral Reel Launch', 'إطلاق فيديو انتشار سريع');

      const logs = useTrustStore.getState().recentLogs;
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].characterId).toBe('reema');
      expect(logs[0].pointsAdded).toBe(25);
      expect(logs[0].reasonEn).toBe('Viral Reel Launch');
    });

    it('handles multiple tier jumps if large trust points are awarded', () => {
      const store = useTrustStore.getState();
      // Award 550 points directly -> should jump to Tier 4: Strategic Partner (min 500)
      const res = store.addTrust('kami', 550, 'Master Invention Surge', 'طفرة اختراعات خارقة');
      expect(res.newTier).toBe(4);
      expect(res.tierChanged).toBe(true);

      const kamiState = useTrustStore.getState().characters.kami;
      expect(kamiState.currentTier).toBe(4);
      expect(kamiState.unlockedPerkIds).toContain('kami_p1');
      expect(kamiState.unlockedPerkIds).toContain('kami_p2');
      expect(kamiState.unlockedPerkIds).toContain('kami_p3');
      expect(kamiState.unlockedPerkIds).toContain('kami_p4');
    });
  });

  describe('3. Rex Respect Dynamics', () => {
    it('promotes Rex from Challenger to Respectful Rival and unlocks perks', () => {
      const store = useTrustStore.getState();
      const rexTier1 = getTierForPoints(0, true);
      expect(rexTier1.tier).toBe(1);
      expect(rexTier1.nameEn).toBe('Challenger');

      // Add 120 points to Rex (Tier 2 min is 100)
      const res = store.addTrust('rex', 120, 'Beat Rex in District Showdown', 'الفوز على ريكس في الحي');
      expect(res.newTier).toBe(2);
      expect(res.tierChanged).toBe(true);

      const rexTier2 = getTierForPoints(120, true);
      expect(rexTier2.nameEn).toBe('Respectful Rival');
      expect(store.hasPerk('rex_p2')).toBe(true);
    });

    it('unlocks The Tank Co-Op Pitch perk at Tier 3 (250 points)', () => {
      const store = useTrustStore.getState();
      store.addTrust('rex', 260, 'Dominated District Market', 'السيطرة على سوق الحي');

      const rexState = useTrustStore.getState().characters.rex;
      expect(rexState.currentTier).toBe(3);
      expect(rexState.unlockedPerkIds).toContain('rex_p3');
      expect(store.hasPerk('rex_p3')).toBe(true);
    });
  });

  describe('4. RelationshipEngine Gameplay Triggers', () => {
    it('onLessonCompleted routes trust based on curriculum competency group', () => {
      // Money -> Ollie
      RelationshipEngine.onLessonCompleted('money', 100);
      expect(useTrustStore.getState().characters.ollie.trustPoints).toBeGreaterThan(0);

      // Marketing -> Reema
      RelationshipEngine.onLessonCompleted('marketing', 100);
      expect(useTrustStore.getState().characters.reema.trustPoints).toBeGreaterThan(0);

      // Risk -> Filo
      RelationshipEngine.onLessonCompleted('risk_ethics', 100);
      expect(useTrustStore.getState().characters.filo.trustPoints).toBeGreaterThan(0);

      // Innovation -> Kami
      RelationshipEngine.onLessonCompleted('innovation', 100);
      expect(useTrustStore.getState().characters.kami.trustPoints).toBeGreaterThan(0);
    });

    it('onPrototypeCrafted awards trust points based on prototype demand score', () => {
      RelationshipEngine.onPrototypeCrafted('VIRAL');
      expect(useTrustStore.getState().characters.kami.trustPoints).toBe(60);

      RelationshipEngine.onPrototypeCrafted('HIGH');
      expect(useTrustStore.getState().characters.kami.trustPoints).toBe(100);
    });

    it('onRivalConfrontation awards respect points based on showdown outcome', () => {
      RelationshipEngine.onRivalConfrontation('victory');
      expect(useTrustStore.getState().characters.rex.trustPoints).toBe(35);

      RelationshipEngine.onRivalConfrontation('defeat');
      expect(useTrustStore.getState().characters.rex.trustPoints).toBe(50); // 35 + 15
    });

    it('onPrudentSavingsMaintained awards Filo trust', () => {
      RelationshipEngine.onPrudentSavingsMaintained();
      expect(useTrustStore.getState().characters.filo.trustPoints).toBe(20);
    });

    it('onMarketingCampaignSuccess awards Reema trust only if ROI > 100%', () => {
      RelationshipEngine.onMarketingCampaignSuccess(80);
      expect(useTrustStore.getState().characters.reema.trustPoints).toBe(0);

      RelationshipEngine.onMarketingCampaignSuccess(150);
      expect(useTrustStore.getState().characters.reema.trustPoints).toBe(25);
    });
  });

  describe('5. calculateTierProgress Math Verification', () => {
    it('calculates progress percentage and points needed accurately for heroes', () => {
      // Tier 1: 0 to 99 (span 100). Points = 50 -> 50%
      const prog1 = calculateTierProgress(50, false);
      expect(prog1.currentTier.tier).toBe(1);
      expect(prog1.nextTier?.tier).toBe(2);
      expect(prog1.progressPercent).toBe(50);
      expect(prog1.pointsInCurrentTier).toBe(50);
      expect(prog1.pointsNeededForNextTier).toBe(50);

      // Tier 2: 100 to 249 (span 150). Points = 175 -> (75/150)*100 = 50%
      const prog2 = calculateTierProgress(175, false);
      expect(prog2.currentTier.tier).toBe(2);
      expect(prog2.nextTier?.tier).toBe(3);
      expect(prog2.progressPercent).toBe(50);
      expect(prog2.pointsInCurrentTier).toBe(75);
      expect(prog2.pointsNeededForNextTier).toBe(75);
    });

    it('caps progress at 100% when at Tier 5', () => {
      const progMax = calculateTierProgress(950, false);
      expect(progMax.currentTier.tier).toBe(5);
      expect(progMax.nextTier).toBeNull();
      expect(progMax.progressPercent).toBe(100);
      expect(progMax.pointsNeededForNextTier).toBe(0);
    });
  });
});
