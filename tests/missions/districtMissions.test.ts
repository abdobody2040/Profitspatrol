import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store';
import { DISTRICT_CONTRACTS_POOL } from '../../src/store/slices/dailyMissionSlice';

describe('Mission Engine District Competency Integration (Part 2)', () => {
  beforeEach(() => {
    // Reset appStore user and daily missions
    useAppStore.setState({
      user: {
        id: 'test_student',
        name: 'Alex Founder',
        xp: 100,
        ppTokens: 200,
        level: 1,
        role: 'kid',
        competencyMastery: {}
      } as any
    });
    useAppStore.getState().refreshDailyMissions();
  });

  it('1. Initializes 3 daily goals and 2 district competency contracts deterministically', () => {
    const dm = useAppStore.getState().dailyMissions;
    expect(dm.missions).toHaveLength(3);
    expect(dm.districtContracts).toBeDefined();
    expect(dm.districtContracts).toHaveLength(2);

    // Each district contract has required fields
    dm.districtContracts?.forEach(contract => {
      expect(contract.isContract).toBe(true);
      expect(contract.districtId).toBeDefined();
      expect(contract.competencyId).toBeDefined();
      expect(contract.competencyXpReward).toBeGreaterThan(0);
      expect(contract.titleAr).toBeDefined();
    });
  });

  it('2. Tracks progress accurately when district matches', () => {
    const { dailyMissions, trackMissionProgress } = useAppStore.getState();
    const contract = dailyMissions.districtContracts?.[0];
    if (!contract) throw new Error('No district contract generated');

    const completionBefore = dailyMissions.completions.find(c => c.missionId === contract.id);
    expect(completionBefore?.progress).toBe(0);
    expect(completionBefore?.completed).toBe(false);

    // Action with mismatched district should NOT advance it
    trackMissionProgress(contract.actionType, 1, 'non_matching_district');
    const compAfterMismatch = useAppStore.getState().dailyMissions.completions.find(c => c.missionId === contract.id);
    expect(compAfterMismatch?.progress).toBe(0);

    // Action with MATCHING district SHOULD advance it
    trackMissionProgress(contract.actionType, 1, contract.districtId);
    const compAfterMatch = useAppStore.getState().dailyMissions.completions.find(c => c.missionId === contract.id);
    expect(compAfterMatch?.progress).toBe(1);
    expect(compAfterMatch?.completed).toBe(true);
  });

  it('3. Claiming contract reward awards XP, Tokens, and advances Competency Mastery', () => {
    const { dailyMissions, trackMissionProgress, claimMissionReward } = useAppStore.getState();
    const contract = dailyMissions.districtContracts?.[0];
    if (!contract) throw new Error('No district contract generated');

    // Complete the contract
    trackMissionProgress(contract.actionType, contract.targetCount, contract.districtId);

    const initialUser = useAppStore.getState().user;
    const initialXP = initialUser?.xp || 0;
    const initialTokens = initialUser?.ppTokens || 0;

    // Claim the contract reward
    claimMissionReward(contract.id);

    const updatedUser = useAppStore.getState().user;
    expect(updatedUser?.xp).toBe(initialXP + contract.xpReward);
    expect(updatedUser?.ppTokens).toBe(initialTokens + contract.coinReward);

    // Check competency mastery update
    const competencyId = contract.competencyId!;
    const mastery = updatedUser?.competencyMastery?.[competencyId];
    expect(mastery).toBeDefined();
    expect(mastery?.score).toBe(contract.competencyXpReward);
    expect(mastery?.level).toBeGreaterThanOrEqual(1);
  });

  it('4. Pool of district contracts covers key competencies across world districts', () => {
    const districtIds = DISTRICT_CONTRACTS_POOL.map(c => c.districtId);
    expect(districtIds).toContain('money');
    expect(districtIds).toContain('builders');
    expect(districtIds).toContain('risk');
    expect(districtIds).toContain('operations');
    expect(districtIds).toContain('innovation');
    expect(districtIds).toContain('leadership');
    expect(districtIds).toContain('strategy');
    expect(districtIds).toContain('launch');
  });
});
