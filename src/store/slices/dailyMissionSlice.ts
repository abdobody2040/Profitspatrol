import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { DailyMission, DailyMissionsState, DailyMissionCompletion } from '../../types';

// ─── Mission Pool ──────────────────────────────────────────────────────────────
// We keep a large pool and pick 3 per day deterministically (based on date seed)
const MISSION_POOL: DailyMission[] = [
  {
    id: 'dm_lesson_1',
    icon: '📚',
    title: 'Student Mindset',
    description: 'Complete 1 lesson today',
    actionType: 'COMPLETE_LESSON',
    targetCount: 1,
    xpReward: 30,
    coinReward: 50,
  },
  {
    id: 'dm_lesson_2',
    icon: '🎓',
    title: 'Power Learner',
    description: 'Complete 3 lessons today',
    actionType: 'COMPLETE_LESSON',
    targetCount: 3,
    xpReward: 100,
    coinReward: 150,
  },
  {
    id: 'dm_gig_1',
    icon: '💼',
    title: 'Hustle Time',
    description: 'Complete 1 gig in Gig Central',
    actionType: 'PLAY_GIG',
    targetCount: 1,
    xpReward: 25,
    coinReward: 40,
  },
  {
    id: 'dm_gig_2',
    icon: '⚡',
    title: 'Side Hustle Pro',
    description: 'Complete 3 gigs in Gig Central',
    actionType: 'PLAY_GIG',
    targetCount: 3,
    xpReward: 80,
    coinReward: 120,
  },
  {
    id: 'dm_book_1',
    icon: '📖',
    title: 'Bookworm',
    description: 'Read a book in the library',
    actionType: 'READ_BOOK',
    targetCount: 1,
    xpReward: 20,
    coinReward: 30,
  },
  {
    id: 'dm_game_1',
    icon: '🎮',
    title: 'Game On!',
    description: 'Complete 1 business game',
    actionType: 'COMPLETE_GAME',
    targetCount: 1,
    xpReward: 30,
    coinReward: 50,
  },
  {
    id: 'dm_game_2',
    icon: '🏆',
    title: 'Arcade Boss',
    description: 'Complete 2 business games',
    actionType: 'COMPLETE_GAME',
    targetCount: 2,
    xpReward: 70,
    coinReward: 100,
  },
  {
    id: 'dm_debate_1',
    icon: '🎤',
    title: 'Debate Master',
    description: 'Win a Debate Dojo round',
    actionType: 'COMPLETE_DEBATE',
    targetCount: 1,
    xpReward: 50,
    coinReward: 75,
  },
  {
    id: 'dm_coins_1',
    icon: '💰',
    title: 'Money Maker',
    description: 'Earn 200 BizCoins from activities',
    actionType: 'EARN_COINS',
    targetCount: 200,
    xpReward: 40,
    coinReward: 60,
  },
  {
    id: 'dm_coins_2',
    icon: '🤑',
    title: 'Coin Collector',
    description: 'Earn 500 BizCoins from activities',
    actionType: 'EARN_COINS',
    targetCount: 500,
    xpReward: 90,
    coinReward: 0, // reward is the coins themselves
  },
  {
    id: 'dm_lesson_3',
    icon: '🧠',
    title: 'Knowledge Grind',
    description: 'Complete 5 lessons today',
    actionType: 'COMPLETE_LESSON',
    targetCount: 5,
    xpReward: 200,
    coinReward: 300,
  },
  {
    id: 'dm_gig_3',
    icon: '🚀',
    title: 'Gig Legend',
    description: 'Complete 5 gigs in Gig Central',
    actionType: 'PLAY_GIG',
    targetCount: 5,
    xpReward: 150,
    coinReward: 200,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Deterministic daily seed — same 3 missions for everyone on the same day */
function pickTodaysMissions(today: string): DailyMission[] {
  // Simple hash: sum char codes of date string
  const hash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pool = [...MISSION_POOL];
  const picked: DailyMission[] = [];
  let seed = hash;
  for (let i = 0; i < 3; i++) {
    const idx = seed % pool.length;
    picked.push(pool[idx]);
    pool.splice(idx, 1);
    seed = Math.floor(seed * 1.37 + 7) % 9999;
  }
  return picked;
}

function buildInitialCompletions(missions: DailyMission[]): DailyMissionCompletion[] {
  return missions.map((m) => ({
    missionId: m.id,
    progress: 0,
    completed: false,
    claimedReward: false,
  }));
}

function freshDailyState(): DailyMissionsState {
  const today = getTodayISO();
  const missions = pickTodaysMissions(today);
  return {
    date: today,
    missions,
    completions: buildInitialCompletions(missions),
  };
}

// ─── Slice Definition ──────────────────────────────────────────────────────────

export interface DailyMissionsSlice {
  dailyMissions: DailyMissionsState;
  /** Called by action handlers (completeLesson, completeSideHustle, etc.) */
  trackMissionProgress: (actionType: DailyMission['actionType'], amount?: number) => void;
  claimMissionReward: (missionId: string) => void;
  /** Called on app mount to reset if day changed */
  refreshDailyMissions: () => void;
}

export const createDailyMissionsSlice: StateCreator<AppState, [], [], DailyMissionsSlice> = (set, get) => ({
  dailyMissions: freshDailyState(),

  refreshDailyMissions: () => {
    const today = getTodayISO();
    const current = get().dailyMissions;
    if (current.date !== today) {
      set({ dailyMissions: freshDailyState() });
    }
  },

  trackMissionProgress: (actionType, amount = 1) => {
    const today = getTodayISO();
    set((state) => {
      // Auto-reset if new day
      const dm = state.dailyMissions.date !== today ? freshDailyState() : state.dailyMissions;

      const updatedCompletions = dm.completions.map((c) => {
        const mission = dm.missions.find((m) => m.id === c.missionId);
        // ✅ FIX: Skip if already completed — previously progress kept accumulating
        // past targetCount on completed missions (with no practical consequence today,
        // but opens the door to reward stacking bugs if claimedReward logic changes).
        if (!mission || mission.actionType !== actionType || c.completed) return c;
        const newProgress = c.progress + amount;
        return {
          ...c,
          progress: newProgress,
          completed: newProgress >= mission.targetCount,
        };
      });

      return {
        dailyMissions: {
          ...dm,
          completions: updatedCompletions,
        },
      };
    });
  },

  claimMissionReward: (missionId) => {
    set((state) => {
      const dm = state.dailyMissions;
      const completion = dm.completions.find((c) => c.missionId === missionId);
      const mission = dm.missions.find((m) => m.id === missionId);
      if (!completion || !mission || !completion.completed || completion.claimedReward) return {};

      const user = state.user;
      if (!user) return {};

      const updatedCompletions = dm.completions.map((c) =>
        c.missionId === missionId ? { ...c, claimedReward: true } : c
      );

      return {
        dailyMissions: { ...dm, completions: updatedCompletions },
        user: {
          ...user,
          xp: user.xp + mission.xpReward,
          bizCoins: user.bizCoins + mission.coinReward,
        },
      };
    });
  },
});
