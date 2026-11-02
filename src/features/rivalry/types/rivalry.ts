/**
 * ProfitsPatrol Rivalry & Living World Types (PRD Section 5, 7, 28, 109)
 * High-stakes business rivalry against Rex the Raccoon across all 8 districts.
 */

import { DistrictId } from '../../../domain/world/districts';
import { CharacterEmotion } from '../../../lib/assets/assetRegistry';
import { QualityTier } from '../../business/types/business';

export type RivalChallengeType = 
  | 'price_war' 
  | 'quality_showdown' 
  | 'hype_marketing' 
  | 'innovation_sprint' 
  | 'ethics_test';

export interface PlayerStrategicOption {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  cashCost: number;
  requiredQuality?: QualityTier;
  advisorRecommendation: 'ollie' | 'reema' | 'filo' | 'kami';
  advisorTipEn: string;
  advisorTipAr: string;
  outcomeType: 'victory' | 'defeat' | 'tactical_draw';
  marketShareDelta: number; // e.g. +15, -10, +5
  reputationDelta: number;
  educationalReasoningEn: string;
  educationalReasoningAr: string;
  rexReactionEn: string;
  rexReactionAr: string;
  rexReactionEmotion: CharacterEmotion;
}

export interface RivalChallenge {
  id: string;
  districtId: DistrictId;
  type: RivalChallengeType;
  titleEn: string;
  titleAr: string;
  scenarioEn: string;
  scenarioAr: string;
  rexTauntEn: string;
  rexTauntAr: string;
  rexEmotion: CharacterEmotion;
  options: PlayerStrategicOption[];
  rewardTokens: number;
  rewardXp: number;
}

export interface RivalryDistrictStatus {
  districtId: DistrictId;
  playerMarketShare: number; // 0 to 100 (defaults to 50)
  rexMarketShare: number;    // 100 - playerMarketShare
  confrontationsTotal: number;
  playerWins: number;
  rexWins: number;
  isDistrictDominated: boolean; // true if playerMarketShare >= 75
  activeChallenge: RivalChallenge | null;
}

export interface RivalryResolution {
  challengeId: string;
  districtId: DistrictId;
  chosenOptionId: string;
  outcome: 'victory' | 'defeat' | 'tactical_draw';
  playerMarketShareBefore: number;
  playerMarketShareAfter: number;
  marketShareDelta: number;
  cashSpent: number;
  tokensEarned: number;
  xpEarned: number;
  rexResponseEn: string;
  rexResponseAr: string;
  rexEmotion: CharacterEmotion;
  educationalReasoningEn: string;
  educationalReasoningAr: string;
  isDistrictDominated: boolean;
}
