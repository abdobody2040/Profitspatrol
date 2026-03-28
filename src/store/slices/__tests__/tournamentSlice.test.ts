import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTournamentSlice, DEFAULT_QUESTIONS } from '../tournamentSlice';

// Mock logger to suppress console noise in tests
vi.mock('../../../services/logger', () => ({
  Logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSlice() {
  let storeState: any = {};
  const set = vi.fn((updater: any) => {
    if (typeof updater === 'function') {
      storeState = { ...storeState, ...updater(storeState) };
    } else {
      storeState = { ...storeState, ...updater };
    }
  });
  const get = vi.fn(() => storeState);

  // Initialise with the slice defaults + a mock user
  const slice = createTournamentSlice(set, get, {} as any);
  storeState = {
    ...slice,
    tournament: null,
    user: { id: 'player_1', name: 'Test Teacher', role: 'TEACHER' },
  };

  return { slice: storeState, set, get };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('tournamentSlice', () => {
  let ctx: ReturnType<typeof buildSlice>;

  beforeEach(() => {
    ctx = buildSlice();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it('should start with no active tournament', () => {
    expect(ctx.slice.tournament).toBeNull();
  });

  // ── createTournament ───────────────────────────────────────────────────────

  describe('createTournament', () => {
    it('creates a tournament in LOBBY status', () => {
      ctx.slice.createTournament('Math Masters', DEFAULT_QUESTIONS);
      const t = ctx.get().tournament;
      expect(t).not.toBeNull();
      expect(t!.status).toBe('LOBBY');
      expect(t!.title).toBe('Math Masters');
    });

    it('generates a 6-char uppercase code', () => {
      ctx.slice.createTournament('Code Test', DEFAULT_QUESTIONS);
      const code = ctx.get().tournament!.code;
      expect(code).toHaveLength(6);
      expect(code).toBe(code.toUpperCase());
    });

    it('falls back to DEFAULT_QUESTIONS when no questions provided', () => {
      ctx.slice.createTournament('Default Q Test', []);
      const t = ctx.get().tournament;
      expect(t!.questions).toEqual(DEFAULT_QUESTIONS);
    });

    it('includes mock peers + real user in entries', () => {
      ctx.slice.createTournament('Entries Test', DEFAULT_QUESTIONS);
      const entries = ctx.get().tournament!.entries;
      // 5 mock peers + 1 real user
      expect(entries.length).toBe(6);
      const userEntry = entries.find((e: any) => e.userId === 'player_1');
      expect(userEntry).toBeDefined();
      expect(userEntry!.score).toBe(0);
    });

    it('sets currentQuestionIndex to 0', () => {
      ctx.slice.createTournament('Index Test', DEFAULT_QUESTIONS);
      expect(ctx.get().tournament!.currentQuestionIndex).toBe(0);
    });
  });

  // ── startTournament ────────────────────────────────────────────────────────

  describe('startTournament', () => {
    beforeEach(() => ctx.slice.createTournament('Start Test', DEFAULT_QUESTIONS));

    it('transitions from LOBBY → ACTIVE', () => {
      ctx.slice.startTournament();
      expect(ctx.get().tournament!.status).toBe('ACTIVE');
    });

    it('records startedAt timestamp', () => {
      ctx.slice.startTournament();
      expect(ctx.get().tournament!.startedAt).toBeTruthy();
    });

    it('does nothing when tournament is null', () => {
      ctx.get().tournament = null; // simulate no tournament
      // Should not throw
      expect(() => ctx.slice.startTournament()).not.toThrow();
    });
  });

  // ── submitAnswer ───────────────────────────────────────────────────────────

  describe('submitAnswer', () => {
    beforeEach(() => {
      ctx.slice.createTournament('Answer Test', DEFAULT_QUESTIONS);
      ctx.slice.startTournament();
    });

    it('returns correct=true and points for a correct answer', () => {
      const q = ctx.get().tournament!.questions[0];
      const result = ctx.slice.submitAnswer(q.correctAnswer, 3000);
      expect(result.correct).toBe(true);
      expect(result.pointsEarned).toBeGreaterThan(0);
    });

    it('awards time bonus when answered within 5 seconds', () => {
      const q = ctx.get().tournament!.questions[0];
      const fast = ctx.slice.submitAnswer(q.correctAnswer, 1000);   // fast
      const slow = ctx.slice.submitAnswer(q.correctAnswer, 4800);   // just under threshold

      expect(fast.pointsEarned).toBeGreaterThan(slow.pointsEarned);
    });

    it('returns correct=false and 0 points for wrong answer', () => {
      const result = ctx.slice.submitAnswer('completely_wrong_answer', 1000);
      expect(result.correct).toBe(false);
      expect(result.pointsEarned).toBe(0);
    });

    it('updates the user score in entries on correct answer', () => {
      const q = ctx.get().tournament!.questions[0];
      ctx.slice.submitAnswer(q.correctAnswer, 1000);
      const entry = ctx.get().tournament!.entries.find((e: any) => e.userId === 'player_1');
      expect(entry!.score).toBeGreaterThan(0);
      expect(entry!.correctAnswers).toBe(1);
      expect(entry!.totalAnswers).toBe(1);
    });

    it('increments totalAnswers even on wrong answer', () => {
      ctx.slice.submitAnswer('wrong', 1000);
      const entry = ctx.get().tournament!.entries.find((e: any) => e.userId === 'player_1');
      expect(entry!.totalAnswers).toBe(1);
      expect(entry!.correctAnswers).toBe(0);
    });

    it('returns {correct:false, pointsEarned:0} if tournament is not ACTIVE', () => {
      ctx.get().tournament!.status = 'LOBBY';
      const result = ctx.slice.submitAnswer('any', 1000);
      expect(result).toEqual({ correct: false, pointsEarned: 0 });
    });
  });

  // ── nextQuestion ───────────────────────────────────────────────────────────

  describe('nextQuestion', () => {
    beforeEach(() => {
      ctx.slice.createTournament('Next Q Test', DEFAULT_QUESTIONS);
      ctx.slice.startTournament();
    });

    it('advances currentQuestionIndex', () => {
      const before = ctx.get().tournament!.currentQuestionIndex;
      ctx.slice.nextQuestion();
      expect(ctx.get().tournament!.currentQuestionIndex).toBe(before + 1);
    });

    it('finishes tournament when last question is passed', () => {
      const total = ctx.get().tournament!.questions.length;
      // Advance to last question
      for (let i = 0; i < total - 1; i++) ctx.slice.nextQuestion();
      expect(ctx.get().tournament!.status).toBe('ACTIVE');
      // One more — should finish
      ctx.slice.nextQuestion();
      expect(ctx.get().tournament!.status).toBe('FINISHED');
    });

    it('sets finishedAt when finished', () => {
      const total = ctx.get().tournament!.questions.length;
      for (let i = 0; i < total; i++) ctx.slice.nextQuestion();
      expect(ctx.get().tournament!.finishedAt).toBeTruthy();
    });

    it('sets a winnerId when finished', () => {
      const total = ctx.get().tournament!.questions.length;
      for (let i = 0; i < total; i++) ctx.slice.nextQuestion();
      expect(ctx.get().tournament!.winnerId).not.toBeUndefined();
    });
  });

  // ── endTournament ──────────────────────────────────────────────────────────

  describe('endTournament', () => {
    beforeEach(() => {
      ctx.slice.createTournament('End Test', DEFAULT_QUESTIONS);
      ctx.slice.startTournament();
    });

    it('sets status to FINISHED immediately', () => {
      ctx.slice.endTournament();
      expect(ctx.get().tournament!.status).toBe('FINISHED');
    });

    it('picks the highest-scoring entry as winner', () => {
      // Manually bump a mock entry's score
      ctx.get().tournament!.entries[0].score = 9999;
      ctx.get().tournament!.entries[0].userId = 'mock_winner';
      ctx.slice.endTournament();
      expect(ctx.get().tournament!.winnerId).toBe('mock_winner');
    });
  });

  // ── resetTournament ────────────────────────────────────────────────────────

  describe('resetTournament', () => {
    it('sets tournament back to null', () => {
      ctx.slice.createTournament('Reset Test', DEFAULT_QUESTIONS);
      ctx.slice.resetTournament();
      expect(ctx.get().tournament).toBeNull();
    });
  });

  // ── joinTournament ─────────────────────────────────────────────────────────

  describe('joinTournament', () => {
    let tournamentCode: string;

    beforeEach(() => {
      ctx.slice.createTournament('Join Test', DEFAULT_QUESTIONS);
      tournamentCode = ctx.get().tournament!.code;
      // Remove the user from entries so joinTournament can add them
      ctx.get().tournament!.entries = ctx.get().tournament!.entries.filter(
        (e: any) => e.userId !== 'player_1'
      );
    });

    it('returns true with a valid code', () => {
      const result = ctx.slice.joinTournament(tournamentCode);
      expect(result).toBe(true);
    });

    it('is case-insensitive (lowercase code should work)', () => {
      const result = ctx.slice.joinTournament(tournamentCode.toLowerCase());
      expect(result).toBe(true);
    });

    it('returns false with an invalid code', () => {
      const result = ctx.slice.joinTournament('BADCOD');
      expect(result).toBe(false);
    });

    it('adds the user entry to tournament entries', () => {
      ctx.slice.joinTournament(tournamentCode);
      const joined = ctx.get().tournament!.entries.some((e: any) => e.userId === 'player_1');
      expect(joined).toBe(true);
    });

    it('does not add duplicate entries if already joined', () => {
      ctx.slice.joinTournament(tournamentCode);
      ctx.slice.joinTournament(tournamentCode); // join again
      const count = ctx.get().tournament!.entries.filter((e: any) => e.userId === 'player_1').length;
      expect(count).toBe(1);
    });
  });
});
