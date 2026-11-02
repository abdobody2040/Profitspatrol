import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  DISTRICT_CHALLENGES, 
  getChallengeForDistrict, 
  resolveRivalChallenge,
  calculateMarketShareBonus
} from '../../src/features/rivalry/engine/rexCompetition';
import { useRivalryStore } from '../../src/features/rivalry/store/rivalryStore';
import { CANONICAL_DISTRICTS, DistrictId } from '../../src/domain/world/districts';

describe('Rex Rivalry Engine & Competition Logic', () => {
  beforeEach(() => {
    useRivalryStore.getState().resetRivalry();
  });

  it('provides comprehensive bilingual challenges for all canonical districts', () => {
    CANONICAL_DISTRICTS.forEach((d) => {
      const challenge = getChallengeForDistrict(d.id);
      expect(challenge).toBeDefined();
      expect(challenge.titleEn.length).toBeGreaterThan(0);
      expect(challenge.titleAr.length).toBeGreaterThan(0);
      expect(challenge.scenarioEn.length).toBeGreaterThan(0);
      expect(challenge.scenarioAr.length).toBeGreaterThan(0);
      expect(challenge.rexTauntEn.length).toBeGreaterThan(0);
      expect(challenge.rexTauntAr.length).toBeGreaterThan(0);
      expect(challenge.options.length).toBeGreaterThanOrEqual(3);

      challenge.options.forEach((opt) => {
        expect(opt.titleEn.length).toBeGreaterThan(0);
        expect(opt.titleAr.length).toBeGreaterThan(0);
        expect(opt.educationalReasoningEn.length).toBeGreaterThan(0);
        expect(opt.educationalReasoningAr.length).toBeGreaterThan(0);
        expect(opt.rexReactionEn.length).toBeGreaterThan(0);
        expect(opt.rexReactionAr.length).toBeGreaterThan(0);
      });
    });
  });

  it('correctly resolves a strategic victory option with rewards and positive market share', () => {
    const challenge = getChallengeForDistrict('money');
    const winningOption = challenge.options.find(o => o.outcomeType === 'victory')!;
    expect(winningOption).toBeDefined();

    const resolution = resolveRivalChallenge(challenge, winningOption.id, 50);

    expect(resolution.outcome).toBe('victory');
    expect(resolution.playerMarketShareAfter).toBeGreaterThan(50);
    expect(resolution.tokensEarned).toBe(challenge.rewardTokens);
    expect(resolution.xpEarned).toBe(challenge.rewardXp);
    expect(resolution.rexResponseEn).toBe(winningOption.rexReactionEn);
  });

  it('correctly resolves a reckless defeat option with consequence reasoning and reduced market share', () => {
    const challenge = getChallengeForDistrict('money');
    const defeatOption = challenge.options.find(o => o.outcomeType === 'defeat')!;
    expect(defeatOption).toBeDefined();

    const resolution = resolveRivalChallenge(challenge, defeatOption.id, 50);

    expect(resolution.outcome).toBe('defeat');
    expect(resolution.playerMarketShareAfter).toBeLessThan(50);
    expect(resolution.tokensEarned).toBe(5); // Consolation learning tokens
    expect(resolution.educationalReasoningEn.length).toBeGreaterThan(20);
  });

  it('bounds market share strictly between 5% and 95%', () => {
    const challenge = getChallengeForDistrict('money');
    const winningOption = challenge.options.find(o => o.outcomeType === 'victory')!;

    // Resolving when already at 90%
    const cappedHigh = resolveRivalChallenge(challenge, winningOption.id, 92);
    expect(cappedHigh.playerMarketShareAfter).toBe(95);

    // Resolving defeat when already at 8%
    const defeatOption = challenge.options.find(o => o.outcomeType === 'defeat')!;
    const cappedLow = resolveRivalChallenge(challenge, defeatOption.id, 8);
    expect(cappedLow.playerMarketShareAfter).toBe(5);
  });

  it('evaluates district market share bonuses correctly based on dominance tiers', () => {
    const dominator = calculateMarketShareBonus(80);
    expect(dominator.revenueMultiplier).toBe(1.25);
    expect(dominator.customerDemandMultiplier).toBe(1.30);

    const leader = calculateMarketShareBonus(60);
    expect(leader.revenueMultiplier).toBe(1.10);

    const balanced = calculateMarketShareBonus(50);
    expect(balanced.revenueMultiplier).toBe(1.0);

    const underdog = calculateMarketShareBonus(35);
    expect(underdog.revenueMultiplier).toBe(0.85);
  });

  it('tracks rivalry state and updates district records in useRivalryStore', () => {
    const store = useRivalryStore.getState();

    // Start challenge
    const chal = store.startDistrictChallenge('money');
    expect(chal.id).toBe(DISTRICT_CHALLENGES.money.id);

    // Choose winning option
    const winningOption = chal.options.find(o => o.outcomeType === 'victory')!;
    const resolution = store.resolveChallenge(winningOption.id);

    expect(resolution.outcome).toBe('victory');

    // Verify district status update
    const updatedStatus = store.getDistrictStatus('money');
    expect(updatedStatus.confrontationsTotal).toBe(1);
    expect(updatedStatus.playerWins).toBe(1);
    expect(updatedStatus.rexWins).toBe(0);
    expect(updatedStatus.playerMarketShare).toBe(resolution.playerMarketShareAfter);
    expect(updatedStatus.rexMarketShare).toBe(100 - resolution.playerMarketShareAfter);
  });
});
