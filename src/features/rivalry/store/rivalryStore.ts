/**
 * ProfitsPatrol Rivalry Store (PRD Section 5, 7, 28, 109)
 * Persistent store tracking Rex competition across all 8 districts.
 * Integrates with LocalStorageAdapter (offline-first, no Supabase dependency).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../../../services/persistence/LocalStorageAdapter';
import { DistrictId, CANONICAL_DISTRICTS } from '../../../domain/world/districts';
import { 
  RivalChallenge, 
  RivalryDistrictStatus, 
  RivalryResolution 
} from '../types/rivalry';
import { 
  getChallengeForDistrict, 
  resolveRivalChallenge 
} from '../engine/rexCompetition';
import { useAppStore } from '../../../store';
import { useBusinessStore } from '../../business/store/businessStore';

export interface RivalryStoreState {
  districtStatuses: Record<DistrictId, RivalryDistrictStatus>;
  activeChallenge: RivalChallenge | null;
  lastResolution: RivalryResolution | null;
  
  getDistrictStatus: (districtId: DistrictId) => RivalryDistrictStatus;
  startDistrictChallenge: (districtId: DistrictId) => RivalChallenge;
  resolveChallenge: (optionId: string) => RivalryResolution;
  clearActiveChallenge: () => void;
  resetRivalry: () => void;
}

const buildDefaultStatuses = (): Record<DistrictId, RivalryDistrictStatus> => {
  const statuses = {} as Record<DistrictId, RivalryDistrictStatus>;
  CANONICAL_DISTRICTS.forEach((d) => {
    statuses[d.id] = {
      districtId: d.id,
      playerMarketShare: 50,
      rexMarketShare: 50,
      confrontationsTotal: 0,
      playerWins: 0,
      rexWins: 0,
      isDistrictDominated: false,
      activeChallenge: null
    };
  });
  return statuses;
};

export const useRivalryStore = create<RivalryStoreState>()(
  persist(
    (set, get) => ({
      districtStatuses: buildDefaultStatuses(),
      activeChallenge: null,
      lastResolution: null,

      getDistrictStatus: (districtId: DistrictId) => {
        const statuses = get().districtStatuses;
        if (statuses[districtId]) {
          return statuses[districtId];
        }
        return {
          districtId,
          playerMarketShare: 50,
          rexMarketShare: 50,
          confrontationsTotal: 0,
          playerWins: 0,
          rexWins: 0,
          isDistrictDominated: false,
          activeChallenge: null
        };
      },

      startDistrictChallenge: (districtId: DistrictId) => {
        const challenge = getChallengeForDistrict(districtId);
        set({ activeChallenge: challenge, lastResolution: null });
        return challenge;
      },

      resolveChallenge: (optionId: string) => {
        const { activeChallenge, districtStatuses } = get();
        if (!activeChallenge) {
          throw new Error('No active challenge to resolve');
        }

        const currentStatus = districtStatuses[activeChallenge.districtId] || {
          districtId: activeChallenge.districtId,
          playerMarketShare: 50,
          rexMarketShare: 50,
          confrontationsTotal: 0,
          playerWins: 0,
          rexWins: 0,
          isDistrictDominated: false,
          activeChallenge: null
        };

        const resolution = resolveRivalChallenge(
          activeChallenge, 
          optionId, 
          currentStatus.playerMarketShare
        );

        // Update district status
        const isWin = resolution.outcome === 'victory';
        const isLoss = resolution.outcome === 'defeat';

        const updatedStatus: RivalryDistrictStatus = {
          ...currentStatus,
          playerMarketShare: resolution.playerMarketShareAfter,
          rexMarketShare: 100 - resolution.playerMarketShareAfter,
          confrontationsTotal: currentStatus.confrontationsTotal + 1,
          playerWins: currentStatus.playerWins + (isWin ? 1 : 0),
          rexWins: currentStatus.rexWins + (isLoss ? 1 : 0),
          isDistrictDominated: resolution.isDistrictDominated,
          activeChallenge: null
        };

        // Synchronize rewards with player's profile in useAppStore
        if (resolution.tokensEarned > 0 || resolution.xpEarned > 0) {
          useAppStore.setState((state) => {
            if (!state.user) return state;
            return {
              user: {
                ...state.user,
                xp: (state.user.xp || 0) + resolution.xpEarned,
                ppTokens: (state.user.ppTokens || 0) + resolution.tokensEarned
              }
            };
          });
        }

        // Deduct tactical cash cost from business venture if player has an active venture
        if (resolution.cashSpent > 0) {
          const currentVenture = useBusinessStore.getState().venture;
          if (currentVenture && currentVenture.cash >= resolution.cashSpent) {
            useBusinessStore.setState({
              venture: {
                ...currentVenture,
                cash: Math.max(0, currentVenture.cash - resolution.cashSpent)
              }
            });
          }
        }

        set({
          districtStatuses: {
            ...districtStatuses,
            [activeChallenge.districtId]: updatedStatus
          },
          lastResolution: resolution
        });

        return resolution;
      },

      clearActiveChallenge: () => {
        set({ activeChallenge: null, lastResolution: null });
      },

      resetRivalry: () => {
        set({
          districtStatuses: buildDefaultStatuses(),
          activeChallenge: null,
          lastResolution: null
        });
      }
    }),
    {
      name: 'profits-patrol-rivalry',
      storage: createJSONStorage(() => localStorageAdapter)
    }
  )
);
