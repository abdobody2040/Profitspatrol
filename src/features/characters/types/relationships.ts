/**
 * ProfitsPatrol Character Relationship & Trust Engine Types (PRD Section 4, 5, 7, 109)
 * Manages affinity, trust levels, and progressive gameplay perks with the 4 Heroes and Rival Rex.
 */

import { CharacterId } from '../../../lib/assets/assetRegistry';

export type TrustTierLevel = 1 | 2 | 3 | 4 | 5;

export interface TrustTierInfo {
  tier: TrustTierLevel;
  nameEn: string;
  nameAr: string;
  minPoints: number;
  badge: string;
  color: string;
}

export type PerkEffectType = 
  | 'xp_boost'
  | 'discount'
  | 'special_action'
  | 'cosmetic'
  | 'scam_protection'
  | 'retention_boost'
  | 'research_boost'
  | 'market_share_bonus';

export interface TrustPerk {
  id: string;
  characterId: CharacterId;
  tierRequired: TrustTierLevel;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string; // Lucide icon name or emoji
  effectType: PerkEffectType;
  effectValue: number | string;
}

export interface CharacterTrustState {
  characterId: CharacterId;
  trustPoints: number;
  currentTier: TrustTierLevel;
  unlockedPerkIds: string[];
  totalInteractions: number;
  lastInteractionDate: string;
}

export interface TrustLogEntry {
  id: string;
  characterId: CharacterId;
  pointsAdded: number;
  reasonEn: string;
  reasonAr: string;
  timestamp: number;
}
