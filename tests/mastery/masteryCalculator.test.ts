import { describe, it, expect } from 'vitest';
import { 
  calculateCompetencyDelta, 
  calculateAdaptiveDifficulty 
} from '../../src/domain/mastery/masteryCalculator';

describe('Mastery & Adaptive Engine (Phase 4)', () => {
  it('calculates competency XP delta and level progression correctly', () => {
    // 0 XP -> add 60 XP -> still level 1 Novice
    const update1 = calculateCompetencyDelta('comp_budgeting', 0, 60);
    expect(update1.newXp).toBe(60);
    expect(update1.newLevel).toBe(1);
    expect(update1.levelUp).toBe(false);

    // 90 XP -> add 50 XP (total 140) -> level up to Level 2 Apprentice
    const update2 = calculateCompetencyDelta('comp_budgeting', 90, 50);
    expect(update2.newXp).toBe(140);
    expect(update2.newLevel).toBe(2);
    expect(update2.levelUp).toBe(true);
  });

  it('recommends upgrading difficulty when accuracy >= 85% with minimal mistakes', () => {
    const rec1 = calculateAdaptiveDifficulty('rookie', {
      accuracy: 95,
      mistakes: 0,
      score: 190,
      maxScore: 200
    });
    expect(rec1.recommendedDifficulty).toBe('founder');
    expect(rec1.shouldReviewLesson).toBe(false);

    const rec2 = calculateAdaptiveDifficulty('founder', {
      accuracy: 90,
      mistakes: 1,
      score: 180,
      maxScore: 200
    });
    expect(rec2.recommendedDifficulty).toBe('tycoon');
  });

  it('recommends review and downgrades difficulty when struggling (accuracy < 60% or >= 3 mistakes)', () => {
    const rec1 = calculateAdaptiveDifficulty('founder', {
      accuracy: 45,
      mistakes: 4,
      score: 50,
      maxScore: 200
    });
    expect(rec1.recommendedDifficulty).toBe('rookie');
    expect(rec1.shouldReviewLesson).toBe(true);

    const rec2 = calculateAdaptiveDifficulty('tycoon', {
      accuracy: 55,
      mistakes: 3,
      score: 80,
      maxScore: 200
    });
    expect(rec2.recommendedDifficulty).toBe('founder');
    expect(rec2.shouldReviewLesson).toBe(true);
  });

  it('maintains current difficulty when performance is steady', () => {
    const rec = calculateAdaptiveDifficulty('founder', {
      accuracy: 75,
      mistakes: 2,
      score: 140,
      maxScore: 200
    });
    expect(rec.recommendedDifficulty).toBe('founder');
    expect(rec.shouldReviewLesson).toBe(false);
  });
});
