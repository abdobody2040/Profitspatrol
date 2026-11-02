import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEducationStore } from '../../src/store/educationStore';
import { useAppStore } from '../../src/store/index';
import { useSocialStore } from '../../src/store/socialStore';
import { INITIAL_VIDEOS } from '../../src/features/education/data/videos';

describe('Learning Shorts & Video Section System', () => {
  beforeEach(() => {
    // Reset Zustand stores
    useAppStore.setState({
      user: {
        id: 'kid_test_1',
        name: 'Little Tycoon',
        email: 'kid@profitspatrol.local',
        role: 'CHILD',
        xp: 100,
        level: 1,
        ppTokens: 50,
        badges: [],
        avatar: 'avatar_1',
        streak: 1,
        lastLogin: new Date().toISOString(),
        settings: { soundEnabled: false, musicEnabled: false, language: 'en', notificationsEnabled: true },
        createdAt: new Date().toISOString(),
        parentId: 'parent_1',
      },
      getSkillModifiers: () => ({ xpMultiplier: 1, costMultiplier: 1, priceMultiplier: 1 }),
    } as any);

    useEducationStore.setState({
      videos: INITIAL_VIDEOS,
      activeVideoIndex: 0,
      watchedVideoIds: [],
      completedQuizVideoIds: [],
      likedVideoIds: [],
      bookmarkedVideoIds: [],
      submittedChallenges: {},
      dailyVideoMissions: {
        date: new Date().toISOString().split('T')[0],
        watchedCount: 0,
        quizzesCount: 0,
        claimedReward: false,
      },
    });

    useSocialStore.setState({
      bounties: [],
    } as any);
  });

  it('includes Ollie Explains concept short "vid_ollie_business_moat"', () => {
    const store = useEducationStore.getState();
    const moatVideo = store.videos.find((v) => v.id === 'vid_ollie_business_moat');

    expect(moatVideo).toBeDefined();
    expect(moatVideo?.speaker).toBe('Ollie');
    expect(moatVideo?.title).toContain('Business Moat');
    expect(moatVideo?.titleAr).toContain('خندقاً');
    expect(moatVideo?.animationConfig?.scenes).toBeDefined();
    expect(moatVideo?.animationConfig?.scenes?.length).toBeGreaterThanOrEqual(4);
    expect(moatVideo?.quiz).toBeDefined();

    const challengeVideo = store.videos.find((v) => v.id === 'vid_challenge_ollie_bank');
    expect(challengeVideo).toBeDefined();
    expect(challengeVideo?.challenge).toBeDefined();
    expect(challengeVideo?.challenge?.id).toBe('ch_ollie_bank');
  });

  it('awards +10 XP and +5 PP tokens on watch completion and prevents duplicate awards', () => {
    const eduStore = useEducationStore.getState();
    const videoId = eduStore.videos[0].id;

    const reward1 = eduStore.recordWatchCompletion(videoId);
    expect(reward1).toEqual({ xp: 10, tokens: 5 });

    const userAfterFirstWatch = useAppStore.getState().user;
    expect(userAfterFirstWatch?.xp).toBe(110);
    expect(userAfterFirstWatch?.ppTokens).toBe(55);

    // Watch again should not award tokens/XP again (anti-cheat)
    const reward2 = useEducationStore.getState().recordWatchCompletion(videoId);
    expect(reward2).toEqual({ xp: 0, tokens: 0 });

    const userAfterSecondWatch = useAppStore.getState().user;
    expect(userAfterSecondWatch?.xp).toBe(110);
    expect(userAfterSecondWatch?.ppTokens).toBe(55);
  });

  it('awards +20 XP and +15 PP tokens for answering post-video quiz correctly', () => {
    const eduStore = useEducationStore.getState();
    const videoWithQuiz = eduStore.videos.find((v) => v.quiz !== undefined);
    expect(videoWithQuiz).toBeDefined();

    if (!videoWithQuiz || !videoWithQuiz.quiz) return;

    // Wrong answer
    const wrongAnswerIdx = (videoWithQuiz.quiz.correctIndex + 1) % videoWithQuiz.quiz.options.length;
    const failResult = eduStore.submitVideoQuiz(videoWithQuiz.id, wrongAnswerIdx);
    expect(failResult.isCorrect).toBe(false);
    expect(failResult.xpReward).toBe(0);

    // Correct answer
    const passResult = eduStore.submitVideoQuiz(videoWithQuiz.id, videoWithQuiz.quiz.correctIndex);
    expect(passResult.isCorrect).toBe(true);
    expect(passResult.xpReward).toBe(20);
    expect(passResult.tokenReward).toBe(15);

    const user = useAppStore.getState().user;
    expect(user?.xp).toBe(120);
    expect(user?.ppTokens).toBe(65);
  });

  it('submits real-world action challenge and creates a pending Family Bounty chore', () => {
    const eduStore = useEducationStore.getState();
    const video = eduStore.videos.find((v) => v.id === 'vid_ollie_business_moat') || eduStore.videos[0];

    const submission = eduStore.submitChallengeProof(
      video.id,
      'I created a secret family cookie recipe packaging!',
      'https://example.com/moat-proof.jpg'
    );

    expect(submission).not.toBeNull();
    expect(submission?.videoId).toBe(video.id);
    expect(submission?.notes).toBe('I created a secret family cookie recipe packaging!');
    expect(submission?.proofUrl).toBe('https://example.com/moat-proof.jpg');

    // Verify it automatically populated the Family Bounty list
    const socialBounties = useSocialStore.getState().bounties;
    expect(socialBounties.length).toBeGreaterThan(0);
    const createdBounty = socialBounties.find((b) => b.id.includes(submission!.id));
    expect(createdBounty).toBeDefined();
    expect(createdBounty?.title).toContain('Video Mission');
    expect(createdBounty?.status).toBe('PENDING_APPROVAL');
    expect(createdBounty?.requiresPhoto).toBe(true);
    expect(createdBounty?.photoUrl).toBe('https://example.com/moat-proof.jpg');
  });

  it('supports active video index navigation safely', () => {
    const eduStore = useEducationStore.getState();
    const total = eduStore.videos.length;

    eduStore.setActiveVideoIndex(1);
    expect(useEducationStore.getState().activeVideoIndex).toBe(1);

    // Clamp upper bound
    eduStore.setActiveVideoIndex(9999);
    expect(useEducationStore.getState().activeVideoIndex).toBe(total - 1);

    // Clamp lower bound
    eduStore.setActiveVideoIndex(-5);
    expect(useEducationStore.getState().activeVideoIndex).toBe(0);
  });
});
