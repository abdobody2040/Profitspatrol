/**
 * ProfitsPatrol Character Trust & Relationship Store (PRD Section 4, 5, 7, 109)
 * Persisted state of player relationships with Ollie, Reema, Filo, Kami, and Rex.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterId } from '../../../lib/assets/assetRegistry';
import { 
  CharacterTrustState, 
  TrustTierLevel, 
  TrustLogEntry,
  TrustPerk 
} from '../types/relationships';
import { 
  getTierForPoints, 
  getPerksForCharacter 
} from '../data/trustPerks';
import { Logger } from '../../../services/logger';

const ALL_CHARACTERS: CharacterId[] = ['ollie', 'reema', 'filo', 'kami', 'rex'];

interface TrustState {
  characters: Record<CharacterId, CharacterTrustState>;
  recentLogs: TrustLogEntry[];
  lastTierUpCharacter: CharacterId | null;
  lastTierUpLevel: TrustTierLevel | null;

  // Actions
  addTrust: (
    characterId: CharacterId, 
    points: number, 
    reasonEn: string, 
    reasonAr: string
  ) => { newTier: TrustTierLevel; tierChanged: boolean; unlockedPerks: TrustPerk[] };

  getCharacterTrust: (characterId: CharacterId) => CharacterTrustState;
  hasPerk: (perkId: string) => boolean;
  getUnlockedPerksForCharacter: (characterId: CharacterId) => TrustPerk[];
  clearTierUpNotice: () => void;
  resetAllTrust: () => void;
}

const createInitialCharacterState = (id: CharacterId): CharacterTrustState => ({
  characterId: id,
  trustPoints: 0,
  currentTier: 1,
  unlockedPerkIds: getPerksForCharacter(id)
    .filter(p => p.tierRequired === 1)
    .map(p => p.id),
  totalInteractions: 0,
  lastInteractionDate: new Date().toISOString()
});

const getInitialCharactersMap = (): Record<CharacterId, CharacterTrustState> => {
  return ALL_CHARACTERS.reduce((acc, id) => {
    acc[id] = createInitialCharacterState(id);
    return acc;
  }, {} as Record<CharacterId, CharacterTrustState>);
};

export const useTrustStore = create<TrustState>()(
  persist(
    (set, get) => ({
      characters: getInitialCharactersMap(),
      recentLogs: [],
      lastTierUpCharacter: null,
      lastTierUpLevel: null,

      addTrust: (characterId, points, reasonEn, reasonAr) => {
        const state = get();
        const currentChar = state.characters[characterId] || createInitialCharacterState(characterId);
        const isRival = characterId === 'rex';

        const previousTier = currentChar.currentTier;
        const newPoints = Math.max(0, currentChar.trustPoints + points);
        const newTierInfo = getTierForPoints(newPoints, isRival);
        const newTier = newTierInfo.tier;
        const tierChanged = newTier > previousTier;

        // Calculate all perks that should be unlocked up to newTier
        const allCharacterPerks = getPerksForCharacter(characterId);
        const qualifiedPerks = allCharacterPerks.filter(p => p.tierRequired <= newTier);
        const newUnlockedPerkIds = Array.from(new Set([
          ...currentChar.unlockedPerkIds,
          ...qualifiedPerks.map(p => p.id)
        ]));

        const newlyUnlockedPerks = allCharacterPerks.filter(
          p => p.tierRequired <= newTier && !currentChar.unlockedPerkIds.includes(p.id)
        );

        const updatedChar: CharacterTrustState = {
          ...currentChar,
          trustPoints: newPoints,
          currentTier: newTier,
          unlockedPerkIds: newUnlockedPerkIds,
          totalInteractions: currentChar.totalInteractions + 1,
          lastInteractionDate: new Date().toISOString()
        };

        const newLog: TrustLogEntry = {
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          characterId,
          pointsAdded: points,
          reasonEn,
          reasonAr,
          timestamp: Date.now()
        };

        Logger.info(`Trust updated for ${characterId}`, {
          pointsAdded: points,
          total: newPoints,
          tier: newTier,
          tierChanged
        });

        set({
          characters: {
            ...state.characters,
            [characterId]: updatedChar
          },
          recentLogs: [newLog, ...state.recentLogs.slice(0, 19)], // Keep last 20 logs
          lastTierUpCharacter: tierChanged ? characterId : state.lastTierUpCharacter,
          lastTierUpLevel: tierChanged ? newTier : state.lastTierUpLevel
        });

        return {
          newTier,
          tierChanged,
          unlockedPerks: newlyUnlockedPerks
        };
      },

      getCharacterTrust: (characterId) => {
        return get().characters[characterId] || createInitialCharacterState(characterId);
      },

      hasPerk: (perkId) => {
        const chars = get().characters;
        return Object.values(chars).some(char => char.unlockedPerkIds.includes(perkId));
      },

      getUnlockedPerksForCharacter: (characterId) => {
        const charState = get().characters[characterId];
        if (!charState) return [];
        const allPerks = getPerksForCharacter(characterId);
        return allPerks.filter(p => charState.unlockedPerkIds.includes(p.id));
      },

      clearTierUpNotice: () => set({ lastTierUpCharacter: null, lastTierUpLevel: null }),

      resetAllTrust: () => set({
        characters: getInitialCharactersMap(),
        recentLogs: [],
        lastTierUpCharacter: null,
        lastTierUpLevel: null
      })
    }),
    {
      name: 'pp_character_relationships',
      version: 1
    }
  )
);
