import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { WeeklyChallenge, WeeklyChallengeState, WeeklyChallengeEntry } from '../../types';

// ─── Challenge Pool ───────────────────────────────────────────────────────────
const CHALLENGE_POOL: WeeklyChallenge[] = [
    {
        id: 'wc_lesson_sprint',
        icon: '📚',
        title: 'Lesson Sprint',
        description: 'Complete 10 lessons this week to claim your prize!',
        type: 'LESSON_SPRINT',
        targetCount: 10,
        xpReward: 500,
        coinReward: 800,
        prizeItems: ['badge_gold_scholar'],
    },
    {
        id: 'wc_gig_marathon',
        icon: '⚡',
        title: 'Gig Marathon',
        description: 'Complete 15 gigs in Gig Central this week!',
        type: 'GIG_MARATHON',
        targetCount: 15,
        xpReward: 450,
        coinReward: 750,
        prizeItems: ['badge_hustle_king'],
    },
    {
        id: 'wc_boss_battle',
        icon: '⚔️',
        title: 'Boss Slayer',
        description: 'Defeat a Boss Battle in any scenario this week!',
        type: 'BOSS_BATTLE',
        targetCount: 1,
        xpReward: 600,
        coinReward: 1000,
        prizeItems: ['badge_dragon_slayer'],
    },
    {
        id: 'wc_coin_grind',
        icon: '💰',
        title: 'Coin Collector',
        description: 'Earn 2,000 BizCoins from ANY activity this week!',
        type: 'COIN_GRIND',
        targetCount: 2000,
        xpReward: 400,
        coinReward: 500,
        prizeItems: ['badge_money_magnet'],
    },
    {
        id: 'wc_quiz_blitz',
        icon: '🧠',
        title: 'Quiz Blitz',
        description: 'Answer 20 quiz questions correctly across lessons!',
        type: 'QUIZ_BLITZ',
        targetCount: 20,
        xpReward: 480,
        coinReward: 700,
        prizeItems: ['badge_genius'],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getThisMonday(): string {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    // ✅ FIX: Create a fresh Date copy before calling setDate.
    // The original code did `new Date(now.setDate(...))` which mutated `now` in place
    // — this produces incorrect results during DST boundary weeks.
    const monday = new Date(now);
    monday.setDate(diff);
    return monday.toISOString().split('T')[0];
}

/** Pick a challenge deterministically based on the week's Monday date */
function pickWeeklyChallenge(weekStart: string): WeeklyChallenge {
    const hash = weekStart.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return CHALLENGE_POOL[hash % CHALLENGE_POOL.length];
}

function freshWeeklyState(userId: string, name: string): WeeklyChallengeState {
    const weekStart = getThisMonday();
    const challenge = pickWeeklyChallenge(weekStart);
    return {
        weekStart,
        challenge,
        myEntry: {
            userId,
            name,
            progress: 0,
            completed: false,
            claimedReward: false,
        },
    };
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export interface WeeklyChallengeSlice {
    weeklyChallenge: WeeklyChallengeState | null;
    refreshWeeklyChallenge: () => void;
    trackWeeklyChallengeProgress: (type: WeeklyChallenge['type'], amount?: number) => void;
    claimWeeklyChallengeReward: () => void;
}

export const createWeeklyChallengeSlice: StateCreator<AppState, [], [], WeeklyChallengeSlice> = (set, get) => ({
    weeklyChallenge: null,

    refreshWeeklyChallenge: () => {
        const user = get().user;
        if (!user) return;

        const currentMonday = getThisMonday();
        const existing = get().weeklyChallenge;

        // Init or rotate if week has changed
        if (!existing || existing.weekStart !== currentMonday) {
            set({ weeklyChallenge: freshWeeklyState(user.id, user.name) });
        }
    },

    trackWeeklyChallengeProgress: (type, amount = 1) => {
        set((state) => {
            const wc = state.weeklyChallenge;
            if (!wc || !wc.myEntry) return {};

            // Rotate if new week
            const currentMonday = getThisMonday();
            const current = wc.weekStart !== currentMonday
                ? freshWeeklyState(state.user?.id ?? '', state.user?.name ?? '')
                : wc;

            if (current.challenge.type !== type) return wc.weekStart !== currentMonday ? { weeklyChallenge: current } : {};

            const entry = current.myEntry!;
            if (entry.completed) return {};

            const newProgress = entry.progress + amount;
            const completed = newProgress >= current.challenge.targetCount;

            return {
                weeklyChallenge: {
                    ...current,
                    myEntry: { ...entry, progress: newProgress, completed },
                },
            };
        });
    },

    claimWeeklyChallengeReward: () => {
        set((state) => {
            const wc = state.weeklyChallenge;
            if (!wc || !wc.myEntry) return {};
            const entry = wc.myEntry;
            if (!entry.completed || entry.claimedReward) return {};

            const user = state.user;
            if (!user) return {};

            const { xpReward, coinReward } = wc.challenge;

            return {
                weeklyChallenge: {
                    ...wc,
                    myEntry: { ...entry, claimedReward: true },
                },
                user: {
                    ...user,
                    xp: user.xp + xpReward,
                    bizCoins: user.bizCoins + coinReward,
                },
            };
        });
    },
});
