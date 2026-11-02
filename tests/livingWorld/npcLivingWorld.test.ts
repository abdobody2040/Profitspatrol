import { describe, it, expect, beforeEach } from 'vitest';
import { useLivingWorldStore } from '../../src/features/livingWorld/store/livingWorldStore';
import { getTimeOfDay, getNPCsByDistrictAndTime, getNPCById } from '../../src/features/hq/data/npcs';
import { useAppStore } from '../../src/store';

describe('Living World & NPC Schedules System (Part 1)', () => {
    beforeEach(() => {
        useLivingWorldStore.getState().resetLivingWorld();
        // Reset user in appStore
        useAppStore.setState({
            user: {
                id: 'test_user',
                name: 'Young CEO',
                xp: 100,
                ppTokens: 200,
                level: 1,
                role: 'kid'
            } as any
        });
    });

    it('1. Computes correct time of day based on hour', () => {
        expect(getTimeOfDay(8)).toBe('morning');
        expect(getTimeOfDay(14)).toBe('afternoon');
        expect(getTimeOfDay(20)).toBe('night');
        expect(getTimeOfDay(2)).toBe('night');
    });

    it('2. Correctly places NPCs in districts based on time of day schedules', () => {
        // Tariq (entrepreneur) is in 'money' in the morning, 'builders' in afternoon, 'innovation' at night
        const morningMoneyNPCs = getNPCsByDistrictAndTime('money', 'morning');
        expect(morningMoneyNPCs.some(n => n.id === 'npc_entrepreneur')).toBe(true);

        const afternoonBuildersNPCs = getNPCsByDistrictAndTime('builders', 'afternoon');
        expect(afternoonBuildersNPCs.some(n => n.id === 'npc_entrepreneur')).toBe(true);

        const nightInnovationNPCs = getNPCsByDistrictAndTime('innovation', 'night');
        expect(nightInnovationNPCs.some(n => n.id === 'npc_entrepreneur')).toBe(true);

        // Laila (marketer) is in 'builders' in morning
        const morningBuildersNPCs = getNPCsByDistrictAndTime('builders', 'morning');
        expect(morningBuildersNPCs.some(n => n.id === 'npc_marketer')).toBe(true);

        // Captain Sami (driver) is in 'operations' in morning
        const morningOpsNPCs = getNPCsByDistrictAndTime('operations', 'morning');
        expect(morningOpsNPCs.some(n => n.id === 'npc_driver')).toBe(true);
    });

    it('3. Advances NPC relationship tiers and trust points upon interaction', () => {
        const store = useLivingWorldStore.getState();
        expect(store.npcRelationships['npc_entrepreneur']?.tier).toBe('unknown');

        // Talk 1
        const res1 = store.talkToNPC('npc_entrepreneur');
        expect(res1.tierChanged).toBe(true);
        expect(res1.newTier).toBe('introduced');
        expect(useLivingWorldStore.getState().npcRelationships['npc_entrepreneur'].trustPoints).toBe(15);

        // Talk multiple times to reach 'friendly' (threshold: 50)
        store.talkToNPC('npc_entrepreneur'); // 30
        store.talkToNPC('npc_entrepreneur'); // 45
        const res4 = store.talkToNPC('npc_entrepreneur'); // 60
        expect(res4.tierChanged).toBe(true);
        expect(res4.newTier).toBe('friendly');
    });

    it('4. Updates NPC emotional states and generates contextual dialogue', () => {
        const store = useLivingWorldStore.getState();

        // Check default dialogue
        const initialDial = store.getNPCDialogue('npc_entrepreneur', false);
        expect(initialDial.text).toBeDefined();

        // Switch emotion to 'needs_help'
        store.setNPCEmotion('npc_entrepreneur', 'needs_help');
        const helpDialEn = store.getNPCDialogue('npc_entrepreneur', false);
        expect(helpDialEn.type).toBe('state');
        expect(typeof helpDialEn.text).toBe('string');
        expect(helpDialEn.text.length).toBeGreaterThan(15);

        const helpDialAr = store.getNPCDialogue('npc_entrepreneur', true);
        expect(helpDialAr.type).toBe('state');
        expect(typeof helpDialAr.text).toBe('string');
        expect(helpDialAr.text.length).toBeGreaterThan(15);
    });

    it('5. Manages NPC quest lifecycle: accept -> progress -> complete -> claim reward', () => {
        const store = useLivingWorldStore.getState();
        const questId = 'qst_budget_sheet';
        const npcId = 'npc_entrepreneur';

        // 1. Initial status
        expect(store.quests[questId]?.status).toBe('available');

        // 2. Accept
        store.acceptQuest(questId, npcId);
        expect(useLivingWorldStore.getState().quests[questId].status).toBe('active');

        // 3. Progress
        const isDone = store.progressQuest(questId, 1);
        expect(isDone).toBe(true);
        expect(useLivingWorldStore.getState().quests[questId].status).toBe('completed');

        // 4. Claim reward
        const initialXP = useAppStore.getState().user?.xp || 0;
        const initialTokens = useAppStore.getState().user?.ppTokens || 0;

        const claimed = store.claimQuestReward(questId);
        expect(claimed).not.toBeNull();
        expect(claimed?.tokens).toBe(100);
        expect(claimed?.xp).toBe(50);

        // Verify user received rewards
        const updatedUser = useAppStore.getState().user;
        expect(updatedUser?.xp).toBe(initialXP + 50);
        expect(updatedUser?.ppTokens).toBe(initialTokens + 100);

        // Verify quest is marked claimed and NPC is celebrating
        const updatedLivingWorld = useLivingWorldStore.getState();
        expect(updatedLivingWorld.quests[questId].status).toBe('claimed');
        expect(updatedLivingWorld.npcEmotions[npcId]).toBe('celebrating');
    });
});
