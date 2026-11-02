import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RealWorldSubmission } from '../types/realWorld';
import { REAL_WORLD_MISSIONS } from '../data/realWorldMissionsData';
import { useAppStore } from '../../../store';

export interface RealWorldStoreState {
  submissions: Record<string, RealWorldSubmission>;

  // Actions
  saveSubmissionNotes: (missionId: string, notes: string) => void;
  parentApproveMission: (missionId: string) => { xpAwarded: number; tokensAwarded: number; badgeId: string } | null;
  resetRealWorldStore: () => void;
}

export const useRealWorldStore = create<RealWorldStoreState>()(
  persist(
    (set, get) => ({
      submissions: {},

      saveSubmissionNotes: (missionId, notes) => set((state) => {
        const current = state.submissions[missionId] || {
          missionId,
          childNotes: '',
          parentApproved: false,
          submittedAt: new Date().toISOString()
        };

        return {
          submissions: {
            ...state.submissions,
            [missionId]: {
              ...current,
              childNotes: notes,
              submittedAt: new Date().toISOString()
            }
          }
        };
      }),

      parentApproveMission: (missionId) => {
        const mission = REAL_WORLD_MISSIONS.find((m) => m.id === missionId);
        if (!mission) return null;

        const current = get().submissions[missionId];
        if (current?.parentApproved) return null; // Already approved & rewarded

        const now = new Date().toISOString();

        // Award in AppStore
        const appStore = useAppStore.getState();
        const user = appStore.user;

        if (user) {
          const currentBadges = user.badges || [];
          const updatedBadges = currentBadges.includes(mission.badgeId)
            ? currentBadges
            : [...currentBadges, mission.badgeId];

          useAppStore.setState({
            user: {
              ...user,
              xp: (user.xp || 0) + mission.rewardXp,
              ppTokens: (user.ppTokens || 0) + mission.rewardTokens,
              badges: updatedBadges
            }
          });
        }

        set((state) => ({
          submissions: {
            ...state.submissions,
            [missionId]: {
              missionId,
              childNotes: current?.childNotes || 'Completed with family',
              parentApproved: true,
              parentApprovedAt: now,
              submittedAt: current?.submittedAt || now
            }
          }
        }));

        return {
          xpAwarded: mission.rewardXp,
          tokensAwarded: mission.rewardTokens,
          badgeId: mission.badgeId
        };
      },

      resetRealWorldStore: () => set({ submissions: {} })
    }),
    {
      name: 'pp_real_world_missions_store'
    }
  )
);
