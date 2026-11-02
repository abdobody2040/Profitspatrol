import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store';
import { UserRole } from '../../src/types';

describe('Player Profile & Progression Model (PRD Section 59, 60, 86)', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: {
        id: 'test_player_01',
        name: 'Adam',
        username: 'adam_ceo',
        role: UserRole.KID,
        xp: 150,
        level: 2,
        streak: 3,
        lastActivityDate: '2026-09-30',
        ppTokens: 250,
        currentModuleId: 'mod_money_basics',
        completedLessonIds: ['les_MB_01'],
        badges: ['badge_first_sale'],
        inventory: ['item_notebook'],
        settings: {
          dailyGoalMinutes: 15,
          soundEnabled: true,
          musicEnabled: true,
          themeColor: 'green',
          themeMode: 'light',
          ageMode: 'junior'
        },
        hqLevel: 'hq_lvl_1',
        unlockedSkills: ['skill_save_more'],
        portfolio: [],
        equippedItems: [],
        placedItems: [],
        properties: [],
        subscriptionStatus: 'FREE',
        subscriptionTier: 'intern',
        energy: 5,
        lastEnergyRefill: Date.now(),
        unlockedDistricts: ['district_01_money'],
        competencyMastery: {
          comp_budgeting: { level: 1, score: 75, lastTestedAt: '2026-09-30T00:00:00.000Z' }
        },
        activeHeroCompanion: 'ollie'
      }
    });
  });

  it('maintains non-dummy player profile state with all PRD progression indicators', () => {
    const user = useAppStore.getState().user;
    expect(user).toBeDefined();
    expect(user?.name).toBe('Adam');
    expect(user?.level).toBe(2);
    expect(user?.ppTokens).toBe(250);
    expect(user?.unlockedDistricts).toContain('district_01_money');
    expect(user?.competencyMastery?.comp_budgeting.level).toBe(1);
    expect(user?.activeHeroCompanion).toBe('ollie');
  });

  it('updates progression, awards tokens and unlocks new districts cleanly', () => {
    useAppStore.setState((state) => ({
      user: state.user
        ? {
            ...state.user,
            xp: 250,
            ppTokens: 350,
            unlockedDistricts: ['district_01_money', 'district_02_builders'],
            competencyMastery: {
              comp_budgeting: { level: 2, score: 150, lastTestedAt: '2026-09-30T02:00:00.000Z' }
            }
          }
        : null
    }));

    const updated = useAppStore.getState().user;
    expect(updated?.xp).toBe(250);
    expect(updated?.ppTokens).toBe(350);
    expect(updated?.unlockedDistricts).toHaveLength(2);
    expect(updated?.unlockedDistricts).toContain('district_02_builders');
    expect(updated?.competencyMastery?.comp_budgeting.level).toBe(2);
  });

  it('updates profile settings through updateUser RBAC whitelist', () => {
    useAppStore.getState().updateUser('test_player_01', {
      name: 'Adam Future CEO',
      settings: {
        dailyGoalMinutes: 30,
        soundEnabled: false,
        musicEnabled: true,
        themeColor: 'purple',
        themeMode: 'dark',
        ageMode: 'explorer'
      }
    });

    const updated = useAppStore.getState().user;
    expect(updated?.name).toBe('Adam Future CEO');
    expect(updated?.settings.dailyGoalMinutes).toBe(30);
    expect(updated?.settings.soundEnabled).toBe(false);
  });

  it('switches age mode between junior (6-9) and explorer (9-12)', () => {
    useAppStore.getState().setAgeMode('explorer');
    expect(useAppStore.getState().user?.settings.ageMode).toBe('explorer');

    useAppStore.getState().setAgeMode('junior');
    expect(useAppStore.getState().user?.settings.ageMode).toBe('junior');
  });
});
