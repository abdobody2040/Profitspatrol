import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { Logger } from '../../services/logger';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TournamentQuestion {
  id: string;
  questionText: string;
  correctAnswer: string;
  distractors: string[];
  points: number;
}

export interface TournamentEntry {
  userId: string;
  name: string;
  avatarEmoji: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  finishedAt: string | null;
}

export type TournamentStatus = 'IDLE' | 'LOBBY' | 'ACTIVE' | 'FINISHED';

export interface Tournament {
  id: string;
  code: string;           // 6-char join code (teacher shares this)
  title: string;
  hostName: string;
  questions: TournamentQuestion[];
  currentQuestionIndex: number;
  status: TournamentStatus;
  entries: TournamentEntry[];
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  timePerQuestion: number;  // seconds
  winnerId: string | null;
}

export interface TournamentSlice {
  tournament: Tournament | null;
  // Teacher actions
  createTournament: (title: string, questions: TournamentQuestion[], timePerQuestion?: number) => void;
  startTournament: () => void;
  nextQuestion: () => void;
  endTournament: () => void;
  resetTournament: () => void;
  // Student actions
  joinTournament: (code: string) => boolean;
  submitAnswer: (answer: string, timeTakenMs: number) => { correct: boolean; pointsEarned: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_BONUS_THRESHOLD_MS = 5000; // Answer within 5s for full time bonus
const MAX_TIME_BONUS_POINTS = 50;

// Mock leaderboard peers for demo tournaments
const MOCK_TOURNAMENT_PEERS = [
  { name: 'Zaid K.', emoji: '👦' },
  { name: 'Layla M.', emoji: '👧' },
  { name: 'Omar B.', emoji: '🧑' },
  { name: 'Sara J.', emoji: '👧' },
  { name: 'Adam S.', emoji: '🧒' },
];

function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Default question set (sampled from Season 3 content)
const DEFAULT_QUESTIONS: TournamentQuestion[] = [
  {
    id: 'q1', points: 100,
    questionText: 'What does a VC investor receive in exchange for funding a startup?',
    correctAnswer: 'A share (equity) of the company',
    distractors: ['A monthly salary', 'A product discount', 'A guaranteed profit'],
  },
  {
    id: 'q2', points: 100,
    questionText: 'Which funding round comes FIRST for a new startup?',
    correctAnswer: 'Pre-Seed or Seed round',
    distractors: ['Series B', 'IPO', 'Series A'],
  },
  {
    id: 'q3', points: 100,
    questionText: 'What defines a Blue Ocean market?',
    correctAnswer: 'A new, uncontested market space with no direct competition',
    distractors: ['A market with the most competitors', 'A market in ocean industries', 'Lowest price market'],
  },
  {
    id: 'q4', points: 100,
    questionText: 'Who ultimately pays for import tariffs?',
    correctAnswer: 'Consumers — through higher prices',
    distractors: ['The exporting country', 'The government', 'Shipping companies'],
  },
  {
    id: 'q5', points: 100,
    questionText: 'What is BATNA in negotiation?',
    correctAnswer: 'Your best option if the current deal falls through',
    distractors: ['A type of contract clause', "The opposing party's offer", 'A mediation body'],
  },
  {
    id: 'q6', points: 150,
    questionText: 'After a 20% seed round AND 25% Series A, what % does the original founder own?',
    correctAnswer: '60%',
    distractors: ['55%', '75%', '45%'],
  },
  {
    id: 'q7', points: 100,
    questionText: 'What does OKR stand for?',
    correctAnswer: 'Objectives and Key Results',
    distractors: ['Output and Key Revenue', 'Objectives and Key Reports', 'Operations Key Review'],
  },
  {
    id: 'q8', points: 100,
    questionText: 'What is vertical integration?',
    correctAnswer: 'A company controlling more of its own supply chain',
    distractors: ['Hiring more managers', 'Expanding to more countries', 'Merging with a competitor'],
  },
];

// ─── Initial State ─────────────────────────────────────────────────────────────

function buildMockEntries(): TournamentEntry[] {
  return MOCK_TOURNAMENT_PEERS.map((p, i) => ({
    userId: `mock_${i}`,
    name: p.name,
    avatarEmoji: p.emoji,
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    finishedAt: null,
  }));
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export const createTournamentSlice: StateCreator<AppState, [], [], TournamentSlice> = (set, get) => ({
  tournament: null,

  createTournament: (title, questions, timePerQuestion = 20) => {
    const { user } = get();
    // ✅ SECURITY FIX: Tournament creation is a teacher/admin feature.
    // Without this guard, any KID could create a tournament and manipulate its state.
    if (user?.role !== 'TEACHER' && user?.role !== 'ADMIN') {
        Logger.warn('[Security] tournamentSlice: Non-teacher attempted createTournament — blocked', { userId: user?.id });
        return;
    }
    const entries = buildMockEntries();
    if (user) {
      entries.push({ userId: user.id, name: user.name, avatarEmoji: '⭐', score: 0, correctAnswers: 0, totalAnswers: 0, finishedAt: null });
    }
    set({
      tournament: {
        id: `tourney_${Date.now()}`,
        code: generateCode(),
        title,
        hostName: user?.name ?? 'Host',
        questions: questions.length > 0 ? questions : DEFAULT_QUESTIONS,
        currentQuestionIndex: 0,
        status: 'LOBBY',
        entries,
        createdAt: new Date().toISOString(),
        startedAt: null,
        finishedAt: null,
        timePerQuestion,
        winnerId: null,
      },
    });
    Logger.info('[Tournament] Created', { title });
  },

  startTournament: () => {
    set((state) => {
      if (!state.tournament) return state;
      return { tournament: { ...state.tournament, status: 'ACTIVE', startedAt: new Date().toISOString() } };
    });
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.tournament) return state;
      const next = state.tournament.currentQuestionIndex + 1;
      // Simulate mock peer scores advancing
      const updatedEntries = state.tournament.entries.map((e) => {
        if (e.userId.startsWith('mock_')) {
          const correct = Math.random() > 0.35;
          return {
            ...e,
            score: e.score + (correct ? state.tournament!.questions[state.tournament!.currentQuestionIndex]?.points ?? 0 : 0),
            correctAnswers: e.correctAnswers + (correct ? 1 : 0),
            totalAnswers: e.totalAnswers + 1,
          };
        }
        return e;
      });
      if (next >= state.tournament.questions.length) {
        // All questions done — finish
        const sorted = [...updatedEntries].sort((a, b) => b.score - a.score);
        return {
          tournament: {
            ...state.tournament,
            entries: updatedEntries,
            status: 'FINISHED',
            finishedAt: new Date().toISOString(),
            winnerId: sorted[0]?.userId ?? null,
          },
        };
      }
      return { tournament: { ...state.tournament, currentQuestionIndex: next, entries: updatedEntries } };
    });
  },

  endTournament: () => {
    set((state) => {
      if (!state.tournament) return state;
      const sorted = [...state.tournament.entries].sort((a, b) => b.score - a.score);
      return {
        tournament: {
          ...state.tournament,
          status: 'FINISHED',
          finishedAt: new Date().toISOString(),
          winnerId: sorted[0]?.userId ?? null,
        },
      };
    });
  },

  resetTournament: () => set({ tournament: null }),

  joinTournament: (code) => {
    const { tournament, user } = get();
    if (!tournament || tournament.code !== code.toUpperCase()) return false;
    if (!user) return false;
    const alreadyJoined = tournament.entries.some((e) => e.userId === user.id);
    if (!alreadyJoined) {
      set((state) => ({
        tournament: state.tournament
          ? {
              ...state.tournament,
              entries: [...state.tournament.entries, { userId: user.id, name: user.name, avatarEmoji: '⭐', score: 0, correctAnswers: 0, totalAnswers: 0, finishedAt: null }],
            }
          : null,
      }));
    }
    return true;
  },

  submitAnswer: (answer, timeTakenMs) => {
    const { tournament, user } = get();
    if (!tournament || !user || tournament.status !== 'ACTIVE') return { correct: false, pointsEarned: 0 };

    const q = tournament.questions[tournament.currentQuestionIndex];
    const correct = answer === q.correctAnswer;
    // ✅ FIX: Clamp timeTakenMs to [0, TIME_BONUS_THRESHOLD_MS].
    // Negative values (clock skew) would produce a bonus > MAX_TIME_BONUS_POINTS.
    // Values > 2x threshold would produce a negative bonus (subtracting points).
    const clampedTime = Math.min(TIME_BONUS_THRESHOLD_MS, Math.max(0, timeTakenMs));
    const timeBonus = correct && clampedTime < TIME_BONUS_THRESHOLD_MS
      ? Math.floor(MAX_TIME_BONUS_POINTS * (1 - clampedTime / TIME_BONUS_THRESHOLD_MS))
      : 0;
    const pointsEarned = correct ? q.points + timeBonus : 0;

    set((state) => {
      if (!state.tournament) return state;
      const updatedEntries = state.tournament.entries.map((e) =>
        e.userId === user.id
          ? { ...e, score: e.score + pointsEarned, correctAnswers: e.correctAnswers + (correct ? 1 : 0), totalAnswers: e.totalAnswers + 1 }
          : e
      );
      return { tournament: { ...state.tournament, entries: updatedEntries } };
    });

    return { correct, pointsEarned };
  },
});

export { DEFAULT_QUESTIONS };
