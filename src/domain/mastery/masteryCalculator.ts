/**
 * ProfitsPatrol Mastery & Adaptive Difficulty Engine (PRD Sections 2, 27, 4.2)
 * Calculates competency mastery progression and dynamic difficulty recommendations.
 */

import { calculateMasteryLevel, MasteryLevelResult } from '../curriculum/competencyModel';

export type AdaptiveDifficulty = 'rookie' | 'founder' | 'tycoon';

export interface PerformanceSnapshot {
  accuracy: number; // 0 to 100 percentage
  mistakes: number;
  durationSeconds?: number;
  score: number;
  maxScore?: number;
}

export interface CompetencyProgressUpdate {
  competencyId: string;
  previousLevel: number;
  newLevel: number;
  previousXp: number;
  newXp: number;
  levelUp: boolean;
  masteryInfo: MasteryLevelResult;
}

export interface AdaptiveRecommendation {
  currentDifficulty: AdaptiveDifficulty;
  recommendedDifficulty: AdaptiveDifficulty;
  reasonEn: string;
  reasonAr: string;
  shouldReviewLesson: boolean;
  suggestedActionEn: string;
  suggestedActionAr: string;
}

/**
 * Calculates updated competency progress after a game or lesson.
 */
export function calculateCompetencyDelta(
  competencyId: string,
  currentXp: number = 0,
  xpEarned: number
): CompetencyProgressUpdate {
  const previousMastery = calculateMasteryLevel(currentXp);
  const newXp = Math.max(0, currentXp + xpEarned);
  const newMastery = calculateMasteryLevel(newXp);

  return {
    competencyId,
    previousLevel: previousMastery.level,
    newLevel: newMastery.level,
    previousXp: currentXp,
    newXp,
    levelUp: newMastery.level > previousMastery.level,
    masteryInfo: newMastery
  };
}

/**
 * Recommends adaptive game or quiz difficulty based on recent performance.
 */
export function calculateAdaptiveDifficulty(
  currentDifficulty: AdaptiveDifficulty,
  performance: PerformanceSnapshot
): AdaptiveRecommendation {
  const { accuracy, mistakes } = performance;

  // High mastery: Upgrade difficulty
  if (accuracy >= 85 && mistakes <= 1) {
    if (currentDifficulty === 'rookie') {
      return {
        currentDifficulty,
        recommendedDifficulty: 'founder',
        reasonEn: 'Exceptional accuracy! You are ready for the Founder challenge.',
        reasonAr: 'دقة استثنائية! أنت جاهز الآن لخوض تحديات رواد الأعمال (Founder).',
        shouldReviewLesson: false,
        suggestedActionEn: 'Step up to Founder mode',
        suggestedActionAr: 'الترقية لمستوى رواد الأعمال'
      };
    }
    if (currentDifficulty === 'founder') {
      return {
        currentDifficulty,
        recommendedDifficulty: 'tycoon',
        reasonEn: 'Masterful business execution! You unlocked Tycoon difficulty.',
        reasonAr: 'أداء قيادي مبهر! لقد فتحت الآن أعلى مستويات التحدي (Tycoon).',
        shouldReviewLesson: false,
        suggestedActionEn: 'Test yourself in Tycoon mode',
        suggestedActionAr: 'خوض تحدي كبار رجال الأعمال'
      };
    }
  }

  // Struggling: Downgrade or suggest review
  if (accuracy < 60 || mistakes >= 3) {
    if (currentDifficulty === 'tycoon') {
      return {
        currentDifficulty,
        recommendedDifficulty: 'founder',
        reasonEn: 'Markets got tough. Let us stabilize operations in Founder mode first.',
        reasonAr: 'تقلبات السوق كانت صعبة. دعنا نوازن عملياتنا في مستوى المؤسسين أولاً.',
        shouldReviewLesson: true,
        suggestedActionEn: 'Review concepts in Founder mode',
        suggestedActionAr: 'مراجعة المبادئ في مستوى المؤسسين'
      };
    }
    if (currentDifficulty === 'founder') {
      return {
        currentDifficulty,
        recommendedDifficulty: 'rookie',
        reasonEn: 'Reviewing the fundamentals with Ollie will reinforce your strategy!',
        reasonAr: 'مراجعة الأساسيات مع أولي ستعزز خطتك الاستراتيجية للمرة القادمة!',
        shouldReviewLesson: true,
        suggestedActionEn: 'Review fundamentals in Rookie mode',
        suggestedActionAr: 'مراجعة الأساسيات في مستوى المبتدئين'
      };
    }

    return {
      currentDifficulty: 'rookie',
      recommendedDifficulty: 'rookie',
      reasonEn: 'Take your time to understand each step. Practice makes great CEOs!',
      reasonAr: 'خذ وقتك في فهم كل خطوة. كثرة الممارسة تصنع أفضل القادة!',
      shouldReviewLesson: true,
      suggestedActionEn: 'Practice Rookie challenges again',
      suggestedActionAr: 'إعادة التدريب على مستوى المبتدئين'
    };
  }

  // Stable performance: maintain current level
  return {
    currentDifficulty,
    recommendedDifficulty: currentDifficulty,
    reasonEn: 'Solid work! Keep practicing to reach the next tier.',
    reasonAr: 'عمل متزن وممتاز! واصل الممارسة لتصل إلى المستوى التالي.',
    shouldReviewLesson: false,
    suggestedActionEn: 'Continue at current difficulty',
    suggestedActionAr: 'الاستمرار في نفس المستوى'
  };
}
