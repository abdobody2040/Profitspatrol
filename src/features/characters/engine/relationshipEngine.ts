/**
 * ProfitsPatrol Relationship Engine (PRD Section 4, 5, 7, 109)
 * Calculates progression dynamics and routes in-game achievements to hero trust and story quests.
 */

import { CharacterId } from '../../../lib/assets/assetRegistry';
import { TrustTierLevel, TrustTierInfo } from '../types/relationships';
import { TRUST_TIERS, REX_RESPECT_TIERS, getTierForPoints } from '../data/trustPerks';
import { useTrustStore } from '../store/trustStore';
import { useStoryQuestStore } from '../store/questStore';

export interface TierProgressDetails {
  currentTier: TrustTierInfo;
  nextTier: TrustTierInfo | null;
  progressPercent: number; // 0 to 100
  pointsInCurrentTier: number;
  pointsNeededForNextTier: number;
}

/**
 * Calculates current tier progress percentage and points needed for next tier
 */
export function calculateTierProgress(points: number, isRival = false): TierProgressDetails {
  const tiers = isRival ? REX_RESPECT_TIERS : TRUST_TIERS;
  const currentTier = getTierForPoints(points, isRival);

  if (currentTier.tier === 5) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      pointsInCurrentTier: points - currentTier.minPoints,
      pointsNeededForNextTier: 0
    };
  }

  const nextTierLevel = (currentTier.tier + 1) as TrustTierLevel;
  const nextTier = tiers[nextTierLevel];

  const tierSpan = nextTier.minPoints - currentTier.minPoints;
  const pointsEarnedInTier = points - currentTier.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((pointsEarnedInTier / tierSpan) * 100)));
  const pointsNeeded = Math.max(0, nextTier.minPoints - points);

  return {
    currentTier,
    nextTier,
    progressPercent,
    pointsInCurrentTier: pointsEarnedInTier,
    pointsNeededForNextTier: pointsNeeded
  };
}

/**
 * Maps gameplay events to appropriate hero trust awards and story quest objectives
 */
export const RelationshipEngine = {
  /**
   * Awards trust and increments story quests when a lesson is completed
   */
  onLessonCompleted(competencyGroup: string, score = 100) {
    const store = useTrustStore.getState();
    const questStore = useStoryQuestStore.getState();
    const multiplier = score >= 90 ? 1.5 : 1.0;

    switch (competencyGroup) {
      case 'money':
      case 'strategy':
        store.addTrust(
          'ollie',
          Math.round(25 * multiplier),
          'Completed Strategic Planning Lesson',
          'إتمام درس التخطيط والاستراتيجية'
        );
        questStore.incrementQuestMetric('lessons_completed', 'ollie', 1);
        break;

      case 'marketing':
      case 'communication':
        store.addTrust(
          'reema',
          Math.round(25 * multiplier),
          'Completed Marketing & Connection Lesson',
          'إتمام درس التسويق والتواصل'
        );
        questStore.incrementQuestMetric('marketing_campaign', 'reema', 1);
        break;

      case 'risk_ethics':
      case 'operations':
        store.addTrust(
          'filo',
          Math.round(25 * multiplier),
          'Completed Financial Protection & Risk Lesson',
          'إتمام درس الحماية المالية وإدارة المخاطر'
        );
        questStore.incrementQuestMetric('savings_milestone', 'filo', 1);
        break;

      case 'innovation':
      case 'launch':
        store.addTrust(
          'kami',
          Math.round(25 * multiplier),
          'Completed Innovation & Experimentation Lesson',
          'إتمام درس الابتكار والتجربة'
        );
        questStore.incrementQuestMetric('prototypes_crafted', 'kami', 1);
        break;

      default:
        // Balanced distribution for general business
        store.addTrust('ollie', 15, 'Business Study Progress', 'التقدم في دراسات الأعمال');
        questStore.incrementQuestMetric('lessons_completed', 'ollie', 1);
        break;
    }
  },

  /**
   * Awards trust to Kami and increments prototyping quests when player crafts a prototype in Kami's Lab
   */
  onPrototypeCrafted(demandRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIRAL') {
    const store = useTrustStore.getState();
    const questStore = useStoryQuestStore.getState();

    const pointsMap = {
      LOW: 15,
      MEDIUM: 25,
      HIGH: 40,
      VIRAL: 60
    };
    const pts = pointsMap[demandRating] || 20;

    store.addTrust(
      'kami',
      pts,
      `Crafted ${demandRating} Demand Prototype in Lab`,
      `صناعة نموذج ابتكاري بتقييم طلب (${demandRating})`
    );

    // Story quest tracking
    questStore.incrementQuestMetric('prototypes_crafted', 'kami', 1);
    if (demandRating === 'HIGH' || demandRating === 'VIRAL') {
      questStore.incrementQuestMetric('high_demand_prototype', 'kami', 1);
    }
  },

  /**
   * Awards respect points to Rex and advances rivalry quests when player engages in a showdown
   */
  onRivalConfrontation(outcome: 'victory' | 'defeat' | 'tactical_draw') {
    const store = useTrustStore.getState();
    const questStore = useStoryQuestStore.getState();

    const pointsMap = {
      victory: 35, // Winning earns Rex's begrudging respect
      tactical_draw: 25,
      defeat: 15 // Even losing shows courage to compete!
    };
    const pts = pointsMap[outcome];

    store.addTrust(
      'rex',
      pts,
      `Challenged Rex in District Showdown (${outcome})`,
      `خوض نزال الحصة السوقية ضد ريكس (${outcome === 'victory' ? 'فوز' : outcome === 'defeat' ? 'تعلم' : 'تعادل'})`
    );

    // Story quest tracking
    questStore.incrementQuestMetric('rex_confrontation', 'rex', 1);
    if (outcome === 'victory' || outcome === 'tactical_draw') {
      questStore.incrementQuestMetric('rex_victory', 'rex', 1);
    }
  },

  /**
   * Awards trust to Filo when player maintains savings without taking emergency debt
   */
  onPrudentSavingsMaintained() {
    const store = useTrustStore.getState();
    store.addTrust(
      'filo',
      20,
      'Maintained Prudent Cash Reserves',
      'الحفاظ على احتياطي مالي آمن وتجنب الديون'
    );
    useStoryQuestStore.getState().incrementQuestMetric('savings_milestone', 'filo', 1);
  },

  /**
   * Awards trust to Reema when player runs a successful marketing campaign
   */
  onMarketingCampaignSuccess(roiPercent: number) {
    if (roiPercent > 100) {
      const store = useTrustStore.getState();
      store.addTrust(
        'reema',
        25,
        'High ROI Marketing Campaign Executed',
        'تنفيذ حملة تسويقية ناجحة بعائد استثماري مرتفع'
      );
      useStoryQuestStore.getState().incrementQuestMetric('marketing_campaign', 'reema', 1);
    }
  }
};
