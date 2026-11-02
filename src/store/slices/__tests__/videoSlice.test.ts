import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createVideoSlice } from '../videoSlice';
import { INITIAL_VIDEOS } from '../../../features/education/data/videos';

// Mock logger
vi.mock('../../../services/logger', () => ({
  Logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Mock SoundService
vi.mock('../../../lib/sound', () => ({
  SoundService: {
    playClick: vi.fn(),
    playCoin: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playLevelUp: vi.fn(),
  },
}));

// Mock useAppStore
let mockUser: any = null;
vi.mock('../../../store', () => ({
  useAppStore: {
    getState: vi.fn(() => ({
      user: mockUser,
      getSkillModifiers: () => ({ xpMultiplier: 1, costMultiplier: 1, priceMultiplier: 1 }),
    })),
    setState: vi.fn((updater: any) => {
      if (typeof updater === 'function') {
        const next = updater({ user: mockUser });
        if (next.user) mockUser = next.user;
      } else if (updater.user) {
        mockUser = updater.user;
      }
    }),
  },
}));

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

  const slice = createVideoSlice(set, get, {} as any);
  storeState = {
    ...slice,
  };

  return { slice: storeState, set, get };
}

describe('videoSlice', () => {
  let ctx: ReturnType<typeof buildSlice>;

  beforeEach(() => {
    mockUser = {
      id: 'test_user_1',
      name: 'Hero Tycoon',
      role: 'KID',
      xp: 100,
      level: 2,
      ppTokens: 50,
      badges: [],
      inventory: [],
      settings: { soundEnabled: true },
    };
    ctx = buildSlice();
  });

  it('should initialize with enriched catalog of learning shorts and challenges', () => {
    expect(ctx.slice.videos.length).toBeGreaterThanOrEqual(10);
    expect(ctx.slice.videos.some((v: any) => v.category === 'Shorts')).toBe(true);
    expect(ctx.slice.videos.some((v: any) => v.category === 'OllieExplains')).toBe(true);
    expect(ctx.slice.videos.some((v: any) => v.category === 'Challenge')).toBe(true);
    expect(ctx.slice.videos.some((v: any) => v.category === 'Parent')).toBe(true);
  });

  it('should clamp active video index within valid bounds', () => {
    ctx.slice.setActiveVideoIndex(2);
    expect(ctx.get().activeVideoIndex).toBe(2);

    ctx.slice.setActiveVideoIndex(-5);
    expect(ctx.get().activeVideoIndex).toBe(0);

    ctx.slice.setActiveVideoIndex(9999);
    expect(ctx.get().activeVideoIndex).toBe(ctx.slice.videos.length - 1);
  });

  it('should award XP and PP tokens upon 90% watch completion and update daily mission', () => {
    const video = ctx.slice.videos[0];
    const reward = ctx.slice.recordWatchCompletion(video.id);

    expect(reward).not.toBeNull();
    expect(reward?.xp).toBe(10);
    expect(reward?.tokens).toBe(5);

    expect(ctx.get().watchedVideoIds).toContain(video.id);
    expect(ctx.get().dailyVideoMissions.watchedCount).toBe(1);
    expect(mockUser.xp).toBe(110);
    expect(mockUser.ppTokens).toBe(55);

    // Subsequent watch does not double award
    const repeatReward = ctx.slice.recordWatchCompletion(video.id);
    expect(repeatReward?.xp).toBe(0);
    expect(mockUser.xp).toBe(110);
  });

  it('should verify quiz answers and award quiz rewards on correct answer', () => {
    const videoWithQuiz = ctx.slice.videos.find((v: any) => v.quiz);
    expect(videoWithQuiz).toBeDefined();

    const correctIdx = videoWithQuiz.quiz.correctIndex;
    const wrongIdx = (correctIdx + 1) % videoWithQuiz.quiz.options.length;

    // Wrong answer
    const failRes = ctx.slice.submitVideoQuiz(videoWithQuiz.id, wrongIdx);
    expect(failRes.isCorrect).toBe(false);
    expect(failRes.xpReward).toBe(0);

    // Correct answer
    const successRes = ctx.slice.submitVideoQuiz(videoWithQuiz.id, correctIdx);
    expect(successRes.isCorrect).toBe(true);
    expect(successRes.xpReward).toBe(20);
    expect(successRes.tokenReward).toBe(15);

    expect(ctx.get().completedQuizVideoIds).toContain(videoWithQuiz.id);
    expect(ctx.get().dailyVideoMissions.quizzesCount).toBe(1);
    expect(mockUser.xp).toBe(120);
    expect(mockUser.ppTokens).toBe(65);
  });

  it('should toggle like and bookmark states on videos', () => {
    const videoId = ctx.slice.videos[0].id;
    const initialLikes = ctx.slice.videos[0].likesCount || 0;

    // Like
    ctx.slice.toggleLikeVideo(videoId);
    expect(ctx.get().likedVideoIds).toContain(videoId);
    expect(ctx.get().videos.find((v: any) => v.id === videoId).likesCount).toBe(initialLikes + 1);

    // Unlike
    ctx.slice.toggleLikeVideo(videoId);
    expect(ctx.get().likedVideoIds).not.toContain(videoId);
    expect(ctx.get().videos.find((v: any) => v.id === videoId).likesCount).toBe(initialLikes);

    // Bookmark
    ctx.slice.toggleBookmarkVideo(videoId);
    expect(ctx.get().bookmarkedVideoIds).toContain(videoId);

    // Unbookmark
    ctx.slice.toggleBookmarkVideo(videoId);
    expect(ctx.get().bookmarkedVideoIds).not.toContain(videoId);
  });

  it('should submit real-world action challenges and award tokens and badges', () => {
    const challengeVideo = ctx.slice.videos.find((v: any) => v.challenge);
    expect(challengeVideo).toBeDefined();

    const sub = ctx.slice.submitChallengeProof(
      challengeVideo.id,
      'Built a recycled cardboard Ollie bank!',
      'https://example.com/photo.jpg'
    );

    expect(sub).not.toBeNull();
    expect(sub.status).toBe('APPROVED');
    expect(mockUser.badges).toContain(challengeVideo.challenge.badgeReward);
    expect(mockUser.xp).toBe(150); // 100 initial + 50 reward
  });

  it('should unlock daily video mission chest bonus when goals are met', () => {
    // Before goals are met
    expect(ctx.slice.claimDailyVideoMissionReward()).toBe(false);

    // Satisfy goals: 2 watched, 1 quiz
    ctx.slice.recordWatchCompletion(ctx.slice.videos[0].id);
    ctx.slice.recordWatchCompletion(ctx.slice.videos[1].id);
    const quizVideo = ctx.slice.videos.find((v: any) => v.quiz);
    ctx.slice.submitVideoQuiz(quizVideo.id, quizVideo.quiz.correctIndex);

    // Claim bonus
    const claimed = ctx.slice.claimDailyVideoMissionReward();
    expect(claimed).toBe(true);
    expect(ctx.get().dailyVideoMissions.claimedReward).toBe(true);

    // Re-claiming should return false
    expect(ctx.slice.claimDailyVideoMissionReward()).toBe(false);
  });
});
