import { CharacterId } from '../../../lib/assets/assetRegistry';
import { TrustTierLevel } from './relationships';

export type QuestStatus = 'locked' | 'active' | 'completed' | 'claimed';

export interface QuestReward {
  hqItemId: string;
  hqItemNameEn: string;
  hqItemNameAr: string;
  hqItemIcon: string;
  xp: number;
  ppTokens: number;
  badgeId?: string;
  badgeTitleEn?: string;
  badgeTitleAr?: string;
}

export interface CharacterStoryQuest {
  id: string;
  characterId: CharacterId;
  requiredTier: TrustTierLevel;
  titleEn: string;
  titleAr: string;
  narrativeEn: string;
  narrativeAr: string;
  objectiveEn: string;
  objectiveAr: string;
  metricType: 'lessons_completed' | 'prototypes_crafted' | 'high_demand_prototype' | 'rex_confrontation' | 'rex_victory' | 'savings_milestone' | 'marketing_campaign';
  targetCount: number;
  reward: QuestReward;
}

export interface QuestProgressState {
  questId: string;
  currentCount: number;
  status: QuestStatus;
  startedAt?: string;
  completedAt?: string;
  claimedAt?: string;
}
