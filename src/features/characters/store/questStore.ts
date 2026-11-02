/**
 * ProfitsPatrol Character Story Quests Store
 * Persists storyline quests, objectives progression, and exclusive HQ item claims.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterId } from '../../../lib/assets/assetRegistry';
import { QuestStatus, QuestProgressState, CharacterStoryQuest } from '../types/quests';
import { CHARACTER_STORY_QUESTS, getQuestById } from '../data/storyQuests';
import { useTrustStore } from './trustStore';
import { useAppStore } from '../../../store/useAppStore';
import { SoundService } from '../../../lib/sound';
import { Logger } from '../../../services/logger';

interface StoryQuestsState {
  questProgress: Record<string, QuestProgressState>;

  // Actions
  syncQuestUnlocks: () => void;
  incrementQuestMetric: (
    metricType: CharacterStoryQuest['metricType'],
    characterId?: CharacterId,
    amount?: number
  ) => void;
  claimQuestReward: (questId: string) => { success: boolean; quest?: CharacterStoryQuest; error?: string };
  getCharacterQuests: (characterId: CharacterId) => { quest: CharacterStoryQuest; progress: QuestProgressState }[];
  getActiveQuestCount: () => number;
  getClaimableQuestCount: () => number;
  resetAllQuests: () => void;
}

const getInitialQuestProgress = (): Record<string, QuestProgressState> => {
  const result: Record<string, QuestProgressState> = {};
  const trustCharacters = useTrustStore.getState?.()?.characters || {};

  CHARACTER_STORY_QUESTS.forEach((q) => {
    const charTrust = trustCharacters[q.characterId];
    const currentTier = charTrust?.currentTier || 1;
    const isUnlocked = currentTier >= q.requiredTier;

    result[q.id] = {
      questId: q.id,
      currentCount: 0,
      status: isUnlocked ? 'active' : 'locked',
      startedAt: isUnlocked ? new Date().toISOString() : undefined
    };
  });

  return result;
};

export const useStoryQuestStore = create<StoryQuestsState>()(
  persist(
    (set, get) => ({
      questProgress: getInitialQuestProgress(),

      syncQuestUnlocks: () => {
        const state = get();
        const trustState = useTrustStore.getState();
        let changed = false;
        const updatedProgress = { ...state.questProgress };

        CHARACTER_STORY_QUESTS.forEach((quest) => {
          const charTrust = trustState.characters[quest.characterId];
          const currentTier = charTrust?.currentTier || 1;
          const currentProg = updatedProgress[quest.id] || {
            questId: quest.id,
            currentCount: 0,
            status: 'locked'
          };

          if (currentProg.status === 'locked' && currentTier >= quest.requiredTier) {
            updatedProgress[quest.id] = {
              ...currentProg,
              status: 'active',
              startedAt: new Date().toISOString()
            };
            changed = true;
          }
        });

        if (changed) {
          set({ questProgress: updatedProgress });
        }
      },

      incrementQuestMetric: (metricType, characterId, amount = 1) => {
        get().syncQuestUnlocks();
        const state = get();
        const updatedProgress = { ...state.questProgress };
        let changed = false;

        CHARACTER_STORY_QUESTS.forEach((quest) => {
          if (quest.metricType !== metricType) return;
          if (characterId && quest.characterId !== characterId) return;

          const currentProg = updatedProgress[quest.id] || {
            questId: quest.id,
            currentCount: 0,
            status: 'locked'
          };

          if (currentProg.status === 'active') {
            const newCount = Math.min(quest.targetCount, currentProg.currentCount + amount);
            const isFinished = newCount >= quest.targetCount;

            updatedProgress[quest.id] = {
              ...currentProg,
              currentCount: newCount,
              status: isFinished ? 'completed' : 'active',
              completedAt: isFinished ? new Date().toISOString() : currentProg.completedAt
            };
            changed = true;

            if (isFinished) {
              Logger.info(`Story Quest Completed: ${quest.id}`, { title: quest.titleEn });
              try {
                SoundService.playSuccess();
              } catch (_) {}
            }
          }
        });

        if (changed) {
          set({ questProgress: updatedProgress });
        }
      },

      claimQuestReward: (questId) => {
        const state = get();
        const quest = getQuestById(questId);
        if (!quest) {
          return { success: false, error: 'Quest not found' };
        }

        const prog = state.questProgress[questId];
        if (!prog || prog.status !== 'completed') {
          return { success: false, error: 'Quest is not completed or already claimed' };
        }

        // Add reward items to user profile in AppStore
        const { hqItemId, xp, ppTokens, badgeTitleEn } = quest.reward;
        const appStore = useAppStore.getState();
        const currentUser = appStore.user;

        if (currentUser) {
          const currentInventory = currentUser.inventory || [];
          const updatedInventory = currentInventory.includes(hqItemId)
            ? currentInventory
            : [...currentInventory, hqItemId];

          useAppStore.setState({
            user: {
              ...currentUser,
              xp: (currentUser.xp || 0) + xp,
              ppTokens: (currentUser.ppTokens || 0) + ppTokens,
              inventory: updatedInventory
            }
          });
        }

        // Mark quest as claimed
        const updatedProg: QuestProgressState = {
          ...prog,
          status: 'claimed',
          claimedAt: new Date().toISOString()
        };

        set({
          questProgress: {
            ...state.questProgress,
            [questId]: updatedProg
          }
        });

        Logger.info(`Story Quest Claimed: ${questId}`, {
          rewardItem: hqItemId,
          xpGained: xp,
          tokensGained: ppTokens
        });

        try {
          SoundService.playSuccess();
        } catch (_) {}

        return { success: true, quest };
      },

      getCharacterQuests: (characterId) => {
        get().syncQuestUnlocks();
        const state = get();
        const quests = CHARACTER_STORY_QUESTS.filter((q) => q.characterId === characterId);

        return quests.map((quest) => ({
          quest,
          progress: state.questProgress[quest.id] || {
            questId: quest.id,
            currentCount: 0,
            status: 'locked'
          }
        }));
      },

      getActiveQuestCount: () => {
        const state = get();
        return Object.values(state.questProgress).filter((p) => p.status === 'active').length;
      },

      getClaimableQuestCount: () => {
        const state = get();
        return Object.values(state.questProgress).filter((p) => p.status === 'completed').length;
      },

      resetAllQuests: () => {
        set({ questProgress: getInitialQuestProgress() });
      }
    }),
    {
      name: 'pp_character_story_quests',
      version: 1
    }
  )
);
