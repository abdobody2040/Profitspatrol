import { describe, it, expect, beforeEach } from 'vitest';
import { useStoryQuestStore } from '../../src/features/characters/store/questStore';
import { useTrustStore } from '../../src/features/characters/store/trustStore';
import { useAppStore } from '../../src/store';
import { CHARACTER_STORY_QUESTS, getQuestById } from '../../src/features/characters/data/storyQuests';
import { RelationshipEngine } from '../../src/features/characters/engine/relationshipEngine';

describe('Character-Driven Story Quests System', () => {
  beforeEach(() => {
    // Reset stores and mock user
    useTrustStore.getState().resetAllTrust();
    useStoryQuestStore.getState().resetAllQuests();

    useAppStore.setState({
      user: {
        id: 'test_student',
        name: 'Patrol Agent',
        role: 'kid',
        xp: 100,
        ppTokens: 50,
        inventory: ['desk_basic']
      } as any
    });
  });

  describe('1. Quests Catalog & Initialization', () => {
    it('defines 15 storyline quests across Ollie, Reema, Filo, Kami, and Rex', () => {
      expect(CHARACTER_STORY_QUESTS).toHaveLength(15);

      const ollieQuests = CHARACTER_STORY_QUESTS.filter(q => q.characterId === 'ollie');
      const reemaQuests = CHARACTER_STORY_QUESTS.filter(q => q.characterId === 'reema');
      const filoQuests = CHARACTER_STORY_QUESTS.filter(q => q.characterId === 'filo');
      const kamiQuests = CHARACTER_STORY_QUESTS.filter(q => q.characterId === 'kami');
      const rexQuests = CHARACTER_STORY_QUESTS.filter(q => q.characterId === 'rex');

      expect(ollieQuests).toHaveLength(3);
      expect(reemaQuests).toHaveLength(3);
      expect(filoQuests).toHaveLength(3);
      expect(kamiQuests).toHaveLength(3);
      expect(rexQuests).toHaveLength(3);
    });

    it('initializes Tier 1 quests as active and Tier 2+ as locked', () => {
      const questStore = useStoryQuestStore.getState();
      const ollieQuests = questStore.getCharacterQuests('ollie');

      const tier1Quest = ollieQuests.find(q => q.quest.requiredTier === 1)!;
      const tier2Quest = ollieQuests.find(q => q.quest.requiredTier === 2)!;
      const tier3Quest = ollieQuests.find(q => q.quest.requiredTier === 3)!;

      expect(tier1Quest.progress.status).toBe('active');
      expect(tier2Quest.progress.status).toBe('locked');
      expect(tier3Quest.progress.status).toBe('locked');
    });
  });

  describe('2. Dynamic Quest Gating via Trust Tiers', () => {
    it('automatically unlocks Tier 2 quests when hero trust reaches Tier 2', () => {
      const trustStore = useTrustStore.getState();
      const questStore = useStoryQuestStore.getState();

      // Before tier up, quest_ollie_2 is locked
      expect(questStore.questProgress['quest_ollie_2'].status).toBe('locked');

      // Add 110 trust points to Ollie -> reaches Tier 2
      trustStore.addTrust('ollie', 110, 'Major Study Unit', 'إتمام وحدة كبرى');

      // Sync quest unlocks
      questStore.syncQuestUnlocks();

      expect(useStoryQuestStore.getState().questProgress['quest_ollie_2'].status).toBe('active');
      expect(useStoryQuestStore.getState().questProgress['quest_ollie_3'].status).toBe('locked');
    });
  });

  describe('3. Quest Progression & Completion', () => {
    it('increments quest progress and marks completed when target count is achieved', () => {
      const questStore = useStoryQuestStore.getState();

      // quest_kami_1: Synthesize 1 prototype (target = 1)
      expect(questStore.questProgress['quest_kami_1'].status).toBe('active');
      expect(questStore.questProgress['quest_kami_1'].currentCount).toBe(0);

      // Increment prototype crafted metric
      questStore.incrementQuestMetric('prototypes_crafted', 'kami', 1);

      const updatedKamiQuest = useStoryQuestStore.getState().questProgress['quest_kami_1'];
      expect(updatedKamiQuest.currentCount).toBe(1);
      expect(updatedKamiQuest.status).toBe('completed');
    });

    it('does not increment progress for locked quests', () => {
      const questStore = useStoryQuestStore.getState();
      // quest_rex_2 is locked (requires Tier 2)
      expect(questStore.questProgress['quest_rex_2'].status).toBe('locked');

      questStore.incrementQuestMetric('rex_victory', 'rex', 1);

      expect(useStoryQuestStore.getState().questProgress['quest_rex_2'].currentCount).toBe(0);
      expect(useStoryQuestStore.getState().questProgress['quest_rex_2'].status).toBe('locked');
    });
  });

  describe('4. Claiming Rewards & HQ Inventory Integration', () => {
    it('fails to claim reward if quest is not completed', () => {
      const questStore = useStoryQuestStore.getState();
      const res = questStore.claimQuestReward('quest_ollie_1');
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('claims reward, adds item to user inventory, and awards tokens and XP', () => {
      const questStore = useStoryQuestStore.getState();

      // Complete quest_ollie_1 (targetCount = 2)
      questStore.incrementQuestMetric('lessons_completed', 'ollie', 2);
      expect(useStoryQuestStore.getState().questProgress['quest_ollie_1'].status).toBe('completed');

      // Initial user stats
      const initialUser = useAppStore.getState().user!;
      const initialXp = initialUser.xp;
      const initialTokens = initialUser.ppTokens;

      // Claim reward
      const res = useStoryQuestStore.getState().claimQuestReward('quest_ollie_1');
      expect(res.success).toBe(true);
      expect(res.quest?.id).toBe('quest_ollie_1');

      // Verify user inventory & currency updates
      const updatedUser = useAppStore.getState().user!;
      expect(updatedUser.inventory).toContain('decor_ollie_clock');
      expect(updatedUser.xp).toBe(initialXp + 75);
      expect(updatedUser.ppTokens).toBe(initialTokens + 50);

      // Status should now be claimed
      expect(useStoryQuestStore.getState().questProgress['quest_ollie_1'].status).toBe('claimed');

      // Cannot claim a second time
      const secondClaim = useStoryQuestStore.getState().claimQuestReward('quest_ollie_1');
      expect(secondClaim.success).toBe(false);
    });
  });

  describe('5. RelationshipEngine Integration with Story Quests', () => {
    it('routes onLessonCompleted to hero storyline quests', () => {
      // Reema marketing lesson
      RelationshipEngine.onLessonCompleted('marketing', 100);

      const reemaQuest = useStoryQuestStore.getState().questProgress['quest_reema_1'];
      expect(reemaQuest.currentCount).toBe(1);
    });

    it('routes onPrototypeCrafted to Kami lab quests', () => {
      // Craft high demand prototype
      RelationshipEngine.onPrototypeCrafted('HIGH');

      const kamiQuest1 = useStoryQuestStore.getState().questProgress['quest_kami_1'];
      expect(kamiQuest1.currentCount).toBe(1);
      expect(kamiQuest1.status).toBe('completed');
    });

    it('routes onRivalConfrontation to Rex rivalry quests', () => {
      RelationshipEngine.onRivalConfrontation('defeat');

      const rexQuest1 = useStoryQuestStore.getState().questProgress['quest_rex_1'];
      expect(rexQuest1.currentCount).toBe(1);
      expect(rexQuest1.status).toBe('completed');
    });
  });
});
