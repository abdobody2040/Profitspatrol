import { describe, it, expect, beforeEach } from 'vitest';
import { useRealWorldStore } from '../../src/features/realWorld/store/realWorldStore';
import { REAL_WORLD_MISSIONS } from '../../src/features/realWorld/data/realWorldMissionsData';
import { useAppStore } from '../../src/store';

describe('Real-World Family Missions System (Phase B - Section 66)', () => {
  beforeEach(() => {
    useRealWorldStore.getState().resetRealWorldStore();
    useAppStore.setState({
      user: {
        id: 'real_world_kid',
        name: 'Adam Explorer',
        xp: 200,
        ppTokens: 150,
        level: 2,
        role: 'kid',
        badges: []
      } as any
    });
  });

  it('1. Provides 5 rich offline real-world missions with family discussion prompts', () => {
    expect(REAL_WORLD_MISSIONS).toHaveLength(5);

    const grocery = REAL_WORLD_MISSIONS.find(m => m.id === 'rwm_grocery');
    expect(grocery).toBeDefined();
    expect(grocery?.stepsEn.length).toBeGreaterThanOrEqual(3);
    expect(grocery?.discussionQuestionEn).toBeDefined();
    expect(grocery?.discussionQuestionAr).toBeDefined();
    expect(grocery?.badgeId).toBe('badge_grocery_detective');

    const savings = REAL_WORLD_MISSIONS.find(m => m.id === 'rwm_savings_jar');
    expect(savings).toBeDefined();
    expect(savings?.rewardTokens).toBe(150);
  });

  it('2. Saves child reflections and observation notes', () => {
    const store = useRealWorldStore.getState();
    const missionId = 'rwm_grocery';

    store.saveSubmissionNotes(missionId, 'Brand A was $3.50 for 500g while Brand B was $4.00 for 1kg! Brand B is cheaper per gram!');

    const submission = useRealWorldStore.getState().submissions[missionId];
    expect(submission).toBeDefined();
    expect(submission.childNotes).toContain('Brand B is cheaper per gram');
    expect(submission.parentApproved).toBe(false);
  });

  it('3. Parent approval verifies mission, awards XP and tokens, and grants badge', () => {
    const store = useRealWorldStore.getState();
    const missionId = 'rwm_grocery';

    store.saveSubmissionNotes(missionId, 'Checked cereal prices at store.');
    const result = store.parentApproveMission(missionId);

    expect(result).not.toBeNull();
    expect(result?.tokensAwarded).toBe(120);
    expect(result?.xpAwarded).toBe(80);
    expect(result?.badgeId).toBe('badge_grocery_detective');

    // Check submission state
    const sub = useRealWorldStore.getState().submissions[missionId];
    expect(sub.parentApproved).toBe(true);
    expect(sub.parentApprovedAt).toBeDefined();

    // Check user state in appStore
    const user = useAppStore.getState().user;
    expect(user?.xp).toBe(280); // 200 + 80
    expect(user?.ppTokens).toBe(270); // 150 + 120
    expect(user?.badges).toContain('badge_grocery_detective');
  });

  it('4. Prevents duplicate reward claims for already approved missions', () => {
    const store = useRealWorldStore.getState();
    const missionId = 'rwm_grocery';

    store.parentApproveMission(missionId);
    const initialXP = useAppStore.getState().user?.xp;

    // Second approval attempt should return null
    const secondTry = store.parentApproveMission(missionId);
    expect(secondTry).toBeNull();
    expect(useAppStore.getState().user?.xp).toBe(initialXP);
  });
});
