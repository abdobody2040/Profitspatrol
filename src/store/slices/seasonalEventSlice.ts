import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import type {
  SeasonalEvent,
  SeasonalEventEntry,
  SeasonalEventState,
  SeasonalEventType,
} from '../../types';
import { Logger } from '../../services/logger';

// ─── Event Pool ───────────────────────────────────────────────────────────────
// 4 events per quarter; each runs for 7 days on a monthly cycle

const EVENT_POOL: SeasonalEvent[] = [
  {
    id: 'spring_market_festival',
    icon: '🌸',
    title: 'Spring Market Festival',
    description: 'Complete the most lessons this week to claim the exclusive Cherry Blossom avatar item!',
    theme: 'linear-gradient(135deg, #f9a8d4 0%, #ec4899 50%, #9333ea 100%)',
    type: 'LESSON_MARATHON',
    startDate: '',   // set dynamically
    endDate: '',
    xpReward: 1000,
    coinReward: 1500,
    exclusiveItems: ['avatar_cherry_blossom', 'hq_sakura_wallpaper'],
    bossId: 'boss_fashion_fiasco',
  },
  {
    id: 'eid_entrepreneur_challenge',
    icon: '🌙',
    title: 'Eid Entrepreneur Challenge',
    description: 'Earn the most BizCoins from gigs to win the golden crescent badge + HQ mosque lamp!',
    theme: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #92400e 100%)',
    type: 'GIG_RUSH',
    startDate: '',
    endDate: '',
    xpReward: 1200,
    coinReward: 2000,
    exclusiveItems: ['avatar_golden_crescent', 'hq_mosque_lamp', 'hq_lantern_string'],
  },
  {
    id: 'back_to_school_blast',
    icon: '📚',
    title: 'Back to School Blast',
    description: 'Keep your streak alive every single day this week. Top streaks win the Scholar Crown!',
    theme: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e1b4b 100%)',
    type: 'STREAK_KEEPER',
    startDate: '',
    endDate: '',
    xpReward: 900,
    coinReward: 1200,
    exclusiveItems: ['avatar_scholar_crown', 'hq_bookshelf_gold'],
  },
  {
    id: 'summer_hustle_championship',
    icon: '☀️',
    title: 'Summer Hustle Championship',
    description: 'Earn the most total BizCoins from ANY source. Top earners win the Summer CEO trophy!',
    theme: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)',
    type: 'COIN_SPRINT',
    startDate: '',
    endDate: '',
    xpReward: 1500,
    coinReward: 3000,
    exclusiveItems: ['avatar_summer_ceo_crown', 'hq_gold_desk', 'hq_yacht_poster'],
    bossId: 'boss_startup_crunch',
  },
];

// Mock leaderboard peers (seeded from pool — gives each event life)
const MOCK_PEERS: Array<{ name: string; emoji: string }> = [
  { name: 'Sofia R.', emoji: '👩' },
  { name: 'Amir K.', emoji: '🧑' },
  { name: 'Yuki T.', emoji: '👦' },
  { name: 'Lena M.', emoji: '👧' },
  { name: 'Omar B.', emoji: '🧒' },
  { name: 'Zara P.', emoji: '👩‍💼' },
  { name: 'Diego N.', emoji: '👨' },
  { name: 'Mia J.', emoji: '🧑‍🎓' },
  { name: 'Kai L.', emoji: '👩‍🏫' },
];

function generateMockLeaderboard(eventId: string, myScore: number, myName: string): SeasonalEventEntry[] {
  // Deterministic scores seeded from event id
  const seed = eventId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const scores = MOCK_PEERS.map((p, i) => ({
    userId: `mock_${i}`,
    name: p.name,
    avatarEmoji: p.emoji,
    score: Math.max(1, ((seed * (i + 3)) % 120) + 10),
  })).sort((a, b) => b.score - a.score);

  // Insert real user
  const allEntries: SeasonalEventEntry[] = [
    ...scores,
    { userId: 'me', name: myName || 'You', score: myScore },
  ].sort((a, b) => b.score - a.score);

  return allEntries.slice(0, 10).map((e, i) => ({ ...e, rank: i + 1 }));
}

// Pick active event based on current month (deterministic, cycles through pool)
function getActiveEvent(): SeasonalEvent {
  const now = new Date();
  const monthIndex = now.getMonth(); // 0–11
  const event = { ...EVENT_POOL[monthIndex % EVENT_POOL.length] };
  // Set event window: current Monday → Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  event.startDate = monday.toISOString();
  event.endDate = sunday.toISOString();
  return event;
}

// ─── Slice Interface ──────────────────────────────────────────────────────────

export interface SeasonalEventSlice {
  seasonalEvent: SeasonalEventState;
  joinSeasonalEvent: () => void;
  claimSeasonalEventReward: () => void;
  trackSeasonalProgress: (type: SeasonalEventType, amount: number) => void;
  refreshSeasonalEvent: () => void;
}

const INITIAL_STATE: SeasonalEventState = {
  activeEvent: null,
  myScore: 0,
  myRank: null,
  leaderboard: [],
  joined: false,
  rewardClaimed: false,
};

export const createSeasonalEventSlice: StateCreator<AppState, [], [], SeasonalEventSlice> = (set, get) => ({
  seasonalEvent: INITIAL_STATE,

  refreshSeasonalEvent: () => {
    const event = getActiveEvent();
    const { seasonalEvent, user } = get();

    // If active event changed, reset score
    const currentId = seasonalEvent.activeEvent?.id;
    const isNewEvent = currentId !== event.id;

    const myScore = isNewEvent ? 0 : seasonalEvent.myScore;
    const rewardClaimed = isNewEvent ? false : seasonalEvent.rewardClaimed;
    const joined = isNewEvent ? false : seasonalEvent.joined;

    const leaderboard = generateMockLeaderboard(event.id, myScore, user?.name ?? 'You');
    const myRank = leaderboard.find(e => e.userId === 'me')?.rank ?? null;

    set({
      seasonalEvent: {
        activeEvent: event,
        myScore,
        myRank,
        leaderboard,
        joined,
        rewardClaimed,
      },
    });
  },

  joinSeasonalEvent: () => {
    const { seasonalEvent, user } = get();
    if (!user || seasonalEvent.joined) return;
    Logger.info('Joined Seasonal Event', { eventId: seasonalEvent.activeEvent?.id });
    set({
      seasonalEvent: { ...seasonalEvent, joined: true },
    });
  },

  claimSeasonalEventReward: () => {
    const { seasonalEvent, user } = get();
    if (!user || !seasonalEvent.activeEvent || seasonalEvent.rewardClaimed) return;
    // Must be in top 10 or have participated
    if (!seasonalEvent.joined) return;

    const { xpReward, coinReward, exclusiveItems, id } = seasonalEvent.activeEvent;
    const updatedUser = {
      ...user,
      xp: user.xp + xpReward,
      bizCoins: user.bizCoins + coinReward,
      inventory: [...user.inventory, ...exclusiveItems],
    };
    const updatedUsers = get().users.map(u => u.id === user.id ? updatedUser : u);
    Logger.info('Seasonal Event Reward Claimed', { eventId: id, xpReward, coinReward });
    set({
      user: updatedUser,
      users: updatedUsers,
      seasonalEvent: { ...seasonalEvent, rewardClaimed: true },
    });
  },

  trackSeasonalProgress: (type: SeasonalEventType, amount: number) => {
    const { seasonalEvent, user } = get();
    if (!seasonalEvent.activeEvent || !seasonalEvent.joined) return;
    if (seasonalEvent.activeEvent.type !== type) return;

    const newScore = seasonalEvent.myScore + amount;
    const leaderboard = generateMockLeaderboard(
      seasonalEvent.activeEvent.id,
      newScore,
      user?.name ?? 'You'
    );
    const myRank = leaderboard.find(e => e.userId === 'me')?.rank ?? null;
    set({
      seasonalEvent: { ...seasonalEvent, myScore: newScore, leaderboard, myRank },
    });
  },
});
