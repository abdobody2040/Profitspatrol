import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeOfDay, NPCLivingEmotion, NPCRelationshipTier } from '../../../types';
import { NPC_CONFIGS, getTimeOfDay, getNPCById } from '../../hq/data/npcs';
import { useAppStore } from '../../../store';

export interface NPCProgress {
    tier: NPCRelationshipTier;
    trustPoints: number;
    interactionsCount: number;
}

export interface QuestProgress {
    questId: string;
    npcId: string;
    status: 'available' | 'active' | 'completed' | 'claimed';
    progress: number;
    target: number;
}

export interface LivingWorldState {
    timeOfDay: TimeOfDay;
    npcEmotions: Record<string, NPCLivingEmotion>;
    npcRelationships: Record<string, NPCProgress>;
    quests: Record<string, QuestProgress>;

    // Actions
    setTimeOfDay: (time: TimeOfDay) => void;
    setNPCEmotion: (npcId: string, emotion: NPCLivingEmotion) => void;
    talkToNPC: (npcId: string) => { tierChanged: boolean; newTier: NPCRelationshipTier };
    acceptQuest: (questId: string, npcId: string) => void;
    progressQuest: (questId: string, amount?: number) => boolean;
    claimQuestReward: (questId: string) => { xp: number; tokens: number } | null;
    getNPCState: (npcId: string) => {
        emotion: NPCLivingEmotion;
        relationship: NPCProgress;
        currentLocation?: {
            districtId: string;
            locationNameEn: string;
            locationNameAr: string;
            activityEn: string;
            activityAr: string;
        };
    };
    getNPCDialogue: (npcId: string, isArabic?: boolean) => {
        text: string;
        type: 'state' | 'schedule' | 'advice' | 'idle';
    };
    resetLivingWorld: () => void;
}

function computeTier(trustPoints: number): NPCRelationshipTier {
    if (trustPoints >= 300) return 'partner';
    if (trustPoints >= 150) return 'trusted';
    if (trustPoints >= 50) return 'friendly';
    if (trustPoints > 0) return 'introduced';
    return 'unknown';
}

function getInitialEmotions(): Record<string, NPCLivingEmotion> {
    const map: Record<string, NPCLivingEmotion> = {};
    NPC_CONFIGS.forEach(npc => {
        map[npc.id] = npc.defaultEmotion || 'happy';
    });
    return map;
}

function getInitialRelationships(): Record<string, NPCProgress> {
    const map: Record<string, NPCProgress> = {};
    NPC_CONFIGS.forEach(npc => {
        map[npc.id] = { tier: 'unknown', trustPoints: 0, interactionsCount: 0 };
    });
    return map;
}

function getInitialQuests(): Record<string, QuestProgress> {
    const map: Record<string, QuestProgress> = {};
    NPC_CONFIGS.forEach(npc => {
        if (npc.quest) {
            map[npc.quest.id] = {
                questId: npc.quest.id,
                npcId: npc.id,
                status: 'available',
                progress: 0,
                target: 1 // default single objective
            };
        }
    });
    return map;
}

export const useLivingWorldStore = create<LivingWorldState>()(
    persist(
        (set, get) => ({
            timeOfDay: getTimeOfDay(),
            npcEmotions: getInitialEmotions(),
            npcRelationships: getInitialRelationships(),
            quests: getInitialQuests(),

            setTimeOfDay: (time) => set({ timeOfDay: time }),

            setNPCEmotion: (npcId, emotion) => set((state) => ({
                npcEmotions: { ...state.npcEmotions, [npcId]: emotion }
            })),

            talkToNPC: (npcId) => {
                let tierChanged = false;
                let newTier: NPCRelationshipTier = 'unknown';

                set((state) => {
                    const current = state.npcRelationships[npcId] || {
                        tier: 'unknown',
                        trustPoints: 0,
                        interactionsCount: 0
                    };
                    const newTrust = current.trustPoints + 15;
                    newTier = computeTier(newTrust);
                    tierChanged = newTier !== current.tier;

                    return {
                        npcRelationships: {
                            ...state.npcRelationships,
                            [npcId]: {
                                tier: newTier,
                                trustPoints: newTrust,
                                interactionsCount: current.interactionsCount + 1
                            }
                        }
                    };
                });

                return { tierChanged, newTier };
            },

            acceptQuest: (questId, npcId) => {
                set((state) => {
                    const current = state.quests[questId] || {
                        questId,
                        npcId,
                        status: 'available',
                        progress: 0,
                        target: 1
                    };

                    return {
                        quests: {
                            ...state.quests,
                            [questId]: { ...current, status: 'active' }
                        }
                    };
                });
            },

            progressQuest: (questId, amount = 1) => {
                let justCompleted = false;

                set((state) => {
                    const current = state.quests[questId];
                    if (!current || current.status !== 'active') return state;

                    const newProg = current.progress + amount;
                    const isDone = newProg >= current.target;
                    if (isDone) {
                        justCompleted = true;
                    }

                    return {
                        quests: {
                            ...state.quests,
                            [questId]: {
                                ...current,
                                progress: newProg,
                                status: isDone ? 'completed' : 'active'
                            }
                        }
                    };
                });

                return justCompleted;
            },

            claimQuestReward: (questId) => {
                const questData = get().quests[questId];
                if (!questData || questData.status !== 'completed') return null;

                const npc = getNPCById(questData.npcId);
                const quest = npc?.quest;
                if (!quest) return null;

                const xp = quest.rewardXp || 50;
                const tokens = quest.rewardTokens || 100;

                // Award user in useAppStore
                const appState = useAppStore.getState();
                const user = appState.user;
                if (user) {
                    useAppStore.setState({
                        user: {
                            ...user,
                            xp: (user.xp || 0) + xp,
                            ppTokens: (user.ppTokens || 0) + tokens
                        }
                    });
                }

                // Update quest status to claimed and boost NPC trust
                set((state) => {
                    const rel = state.npcRelationships[questData.npcId] || {
                        tier: 'unknown',
                        trustPoints: 0,
                        interactionsCount: 0
                    };
                    const bonusTrust = rel.trustPoints + 35;
                    const newTier = computeTier(bonusTrust);

                    return {
                        quests: {
                            ...state.quests,
                            [questId]: { ...questData, status: 'claimed' }
                        },
                        npcRelationships: {
                            ...state.npcRelationships,
                            [questData.npcId]: {
                                ...rel,
                                trustPoints: bonusTrust,
                                tier: newTier
                            }
                        },
                        npcEmotions: {
                            ...state.npcEmotions,
                            [questData.npcId]: 'celebrating'
                        }
                    };
                });

                return { xp, tokens };
            },

            getNPCState: (npcId) => {
                const state = get();
                const emotion = state.npcEmotions[npcId] || 'happy';
                const relationship = state.npcRelationships[npcId] || {
                    tier: 'unknown',
                    trustPoints: 0,
                    interactionsCount: 0
                };

                const npc = getNPCById(npcId);
                const currentLocation = npc?.schedule?.find(s => s.timeOfDay === state.timeOfDay);

                return { emotion, relationship, currentLocation };
            },

            getNPCDialogue: (npcId, isArabic = false) => {
                const state = get();
                const npc = getNPCById(npcId);
                if (!npc) return { text: '...', type: 'idle' };

                const currentEmotion = state.npcEmotions[npcId] || npc.defaultEmotion || 'happy';

                // Check emotion-specific dialogues first
                const emotionPool = npc.stateDialogues?.[currentEmotion];
                if (emotionPool) {
                    const list = isArabic ? emotionPool.ar : emotionPool.en;
                    if (list && list.length > 0) {
                        const randomLine = list[Math.floor(Math.random() * list.length)];
                        return { text: randomLine, type: 'state' };
                    }
                }

                // Check schedule activity
                const currentSlot = npc.schedule?.find(s => s.timeOfDay === state.timeOfDay);
                if (currentSlot) {
                    const actText = isArabic 
                        ? `أنا الآن في ${currentSlot.locationNameAr}، وأقوم بـ: ${currentSlot.activityAr}.`
                        : `I'm currently at ${currentSlot.locationNameEn}, ${currentSlot.activityEn}.`;
                    return { text: actText, type: 'schedule' };
                }

                // Fallback to advice
                const advicePool = isArabic ? npc.dialoguePoolAr?.advice : npc.dialoguePool.advice;
                if (advicePool && advicePool.length > 0) {
                    return { text: advicePool[0], type: 'advice' };
                }

                return { text: npc.dialoguePool.idle[0], type: 'idle' };
            },

            resetLivingWorld: () => set({
                timeOfDay: getTimeOfDay(),
                npcEmotions: getInitialEmotions(),
                npcRelationships: getInitialRelationships(),
                quests: getInitialQuests()
            })
        }),
        {
            name: 'pp_living_world_store'
        }
    )
);
