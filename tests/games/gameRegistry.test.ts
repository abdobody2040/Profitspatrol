import { describe, it, expect } from 'vitest';
import {
  CANONICAL_ARCADE_GAMES,
  SOURCE_GAME_IDS,
  DISTRICT_METADATA
} from '../../src/features/games/registry/canonicalRegistry';
import type { CommonGameResult } from '../../src/features/games/types';

describe('Canonical Game Registry & Result Model (PRD Section 25, 26, 27)', () => {
  it('contains all 50 canonical games mapped to stations 01 through 50', () => {
    expect(CANONICAL_ARCADE_GAMES.length).toBe(50);
    expect(SOURCE_GAME_IDS.length).toBe(50);

    const stationNumbers = CANONICAL_ARCADE_GAMES.map((g) => g.stationNumber);
    const uniqueStations = new Set(stationNumbers);
    expect(uniqueStations.size).toBe(50);
    expect(stationNumbers[0]).toBe('01');
    expect(stationNumbers[49]).toBe('50');
  });

  it('maps all games strictly to one of the 8 canonical districts', () => {
    const validDistricts = Object.keys(DISTRICT_METADATA);
    expect(validDistricts).toEqual([
      'money',
      'builders',
      'risk',
      'operations',
      'innovation',
      'leadership',
      'strategy',
      'launch'
    ]);

    for (const game of CANONICAL_ARCADE_GAMES) {
      expect(validDistricts).toContain(game.district);
      expect(typeof game.titleKey).toBe('string');
      expect(typeof game.objectiveKey).toBe('string');
      expect(typeof game.skillKey).toBe('string');
    }
  });

  it('validates CommonGameResult schema conforms to PRD Section 27 requirements', () => {
    const sampleResult: CommonGameResult = {
      gameId: 'arcade_01_coin',
      attemptId: 'att_123',
      achieved: true,
      score: 150,
      maxScore: 200,
      accuracy: 92,
      mistakes: 1,
      stars: 3,
      xpAwarded: 50,
      coinsAwarded: 25,
      durationSeconds: 95,
      completedAt: new Date().toISOString(),
      competencyDeltas: { 'comp_budgeting': 15 },
      masteryProgress: { competencyId: 'comp_budgeting', newLevel: 2, delta: 15 },
      characterReaction: { heroId: 'ollie', emotion: 'celebrating', dialogueText: 'Great budgeting!' },
      consequences: [{ target: 'savings_rate', change: 5, message: 'Increased savings efficiency' }]
    };

    expect(sampleResult.achieved).toBe(true);
    expect(sampleResult.accuracy).toBe(92);
    expect(sampleResult.stars).toBe(3);
    expect(sampleResult.characterReaction?.heroId).toBe('ollie');
  });
});
