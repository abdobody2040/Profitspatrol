import { StateCreator } from 'zustand';
import { useAppStore } from '../useAppStore';
import { useSocialStore } from '../socialStore';
import type { EducationState } from '../educationTypes';
import { Video, VideoChallengeSubmission } from '../../types';
import { INITIAL_VIDEOS } from '../../features/education/data/videos';
import { Logger } from '../../services/logger';
import { SoundService } from '../../lib/sound';
import { getLevel, getToday } from '../../utils/gameUtils';

export interface DailyVideoMissionState {
  date: string;
  watchedCount: number;
  quizzesCount: number;
  claimedReward: boolean;
}

export interface VideoSlice {
  videos: Video[];
  activeVideoIndex: number;
  watchedVideoIds: string[];
  completedQuizVideoIds: string[];
  likedVideoIds: string[];
  bookmarkedVideoIds: string[];
  submittedChallenges: Record<string, VideoChallengeSubmission>;
  dailyVideoMissions: DailyVideoMissionState;

  // View state & interaction
  setActiveVideoIndex: (index: number) => void;
  recordWatchCompletion: (videoId: string) => { xp: number; tokens: number } | null;
  submitVideoQuiz: (videoId: string, answerIndex: number) => { isCorrect: boolean; xpReward: number; tokenReward: number };
  toggleLikeVideo: (videoId: string) => void;
  toggleBookmarkVideo: (videoId: string) => void;
  submitChallengeProof: (videoId: string, notes: string, proofUrl?: string) => VideoChallengeSubmission | null;
  approveChallengeSubmission: (submissionId: string) => void;
  claimDailyVideoMissionReward: () => boolean;

  // Admin CRUD
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
}

const getInitialDailyMissions = (): DailyVideoMissionState => ({
  date: getToday(),
  watchedCount: 0,
  quizzesCount: 0,
  claimedReward: false,
});

export const createVideoSlice: StateCreator<EducationState, [], [], VideoSlice> = (set, get) => ({
  videos: INITIAL_VIDEOS,
  activeVideoIndex: 0,
  watchedVideoIds: [],
  completedQuizVideoIds: [],
  likedVideoIds: [],
  bookmarkedVideoIds: [],
  submittedChallenges: {},
  dailyVideoMissions: getInitialDailyMissions(),

  setActiveVideoIndex: (index: number) => {
    const total = get().videos.length;
    if (total === 0) return;
    const safeIndex = Math.max(0, Math.min(index, total - 1));
    set({ activeVideoIndex: safeIndex });
  },

  recordWatchCompletion: (videoId: string) => {
    const state = get();
    const appState = useAppStore.getState();
    const user = appState.user;
    if (!user) return null;

    const alreadyWatched = state.watchedVideoIds.includes(videoId);
    const today = getToday();

    // Check & update daily missions
    const currentMissions = state.dailyVideoMissions.date === today
      ? state.dailyVideoMissions
      : getInitialDailyMissions();

    const newWatchedCount = currentMissions.watchedCount + 1;

    set({
      watchedVideoIds: alreadyWatched ? state.watchedVideoIds : [...state.watchedVideoIds, videoId],
      dailyVideoMissions: {
        ...currentMissions,
        watchedCount: newWatchedCount,
      },
    });

    if (alreadyWatched) {
      return { xp: 0, tokens: 0 };
    }

    const baseXp = 10;
    const baseTokens = 5;
    const modifiers = appState.getSkillModifiers?.() || { xpMultiplier: 1, costMultiplier: 1, priceMultiplier: 1 };
    const xpReward = Math.round(baseXp * modifiers.xpMultiplier);
    const tokenReward = baseTokens;

    const newXp = user.xp + xpReward;
    const newLevel = getLevel(newXp);

    if (user.settings?.soundEnabled) {
      SoundService.playCoin();
    }

    useAppStore.setState({
      user: {
        ...user,
        xp: newXp,
        level: newLevel,
        ppTokens: user.ppTokens + tokenReward,
      },
    });

    Logger.info('[VideoSlice] Watch completion awarded', { videoId, xpReward, tokenReward });
    return { xp: xpReward, tokens: tokenReward };
  },

  submitVideoQuiz: (videoId: string, answerIndex: number) => {
    const state = get();
    const appState = useAppStore.getState();
    const user = appState.user;
    const video = state.videos.find((v) => v.id === videoId);

    if (!video || !video.quiz) {
      return { isCorrect: false, xpReward: 0, tokenReward: 0 };
    }

    const isCorrect = answerIndex === video.quiz.correctIndex;
    if (!isCorrect) {
      if (user?.settings?.soundEnabled) {
        SoundService.playError();
      }
      return { isCorrect: false, xpReward: 0, tokenReward: 0 };
    }

    const alreadyCompleted = state.completedQuizVideoIds.includes(videoId);
    const today = getToday();

    const currentMissions = state.dailyVideoMissions.date === today
      ? state.dailyVideoMissions
      : getInitialDailyMissions();

    set({
      completedQuizVideoIds: alreadyCompleted ? state.completedQuizVideoIds : [...state.completedQuizVideoIds, videoId],
      dailyVideoMissions: {
        ...currentMissions,
        quizzesCount: currentMissions.quizzesCount + 1,
      },
    });

    if (alreadyCompleted || !user) {
      if (user?.settings?.soundEnabled) {
        SoundService.playSuccess();
      }
      return { isCorrect: true, xpReward: 0, tokenReward: 0 };
    }

    const baseXp = video.quiz.xpReward || 20;
    const baseTokens = video.quiz.tokenReward || 15;
    const modifiers = appState.getSkillModifiers?.() || { xpMultiplier: 1, costMultiplier: 1, priceMultiplier: 1 };
    const xpReward = Math.round(baseXp * modifiers.xpMultiplier);
    const tokenReward = baseTokens;

    const newXp = user.xp + xpReward;
    const newLevel = getLevel(newXp);

    if (user.settings?.soundEnabled) {
      SoundService.playSuccess();
    }

    useAppStore.setState({
      user: {
        ...user,
        xp: newXp,
        level: newLevel,
        ppTokens: user.ppTokens + tokenReward,
      },
    });

    Logger.info('[VideoSlice] Quiz completed successfully', { videoId, xpReward, tokenReward });
    return { isCorrect: true, xpReward, tokenReward };
  },

  toggleLikeVideo: (videoId: string) => {
    const { likedVideoIds, videos } = get();
    const isLiked = likedVideoIds.includes(videoId);

    const newLiked = isLiked
      ? likedVideoIds.filter((id) => id !== videoId)
      : [...likedVideoIds, videoId];

    const updatedVideos = videos.map((v) => {
      if (v.id === videoId) {
        const currentLikes = v.likesCount || 0;
        return { ...v, likesCount: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 };
      }
      return v;
    });

    if (!isLiked) {
      SoundService.playClick();
    }

    set({ likedVideoIds: newLiked, videos: updatedVideos });
  },

  toggleBookmarkVideo: (videoId: string) => {
    const { bookmarkedVideoIds } = get();
    const isBookmarked = bookmarkedVideoIds.includes(videoId);

    const newBookmarked = isBookmarked
      ? bookmarkedVideoIds.filter((id) => id !== videoId)
      : [...bookmarkedVideoIds, videoId];

    SoundService.playClick();
    set({ bookmarkedVideoIds: newBookmarked });
  },

  submitChallengeProof: (videoId: string, notes: string, proofUrl?: string) => {
    const appState = useAppStore.getState();
    const user = appState.user;
    if (!user) return null;

    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const submission: VideoChallengeSubmission = {
      id: submissionId,
      videoId,
      userId: user.id,
      userName: user.name || 'Hero Tycoon',
      notes,
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
      status: 'APPROVED', // Instant gratification with badges for kid empowerment
      submittedAt: new Date().toISOString(),
    };

    const currentSubmissions = { ...get().submittedChallenges, [submissionId]: submission };

    // Award initial challenge completion reward
    const video = get().videos.find((v) => v.id === videoId);
    const baseXp = video?.challenge?.rewardXp || 50;
    const baseTokens = video?.challenge?.rewardTokens || 30;
    const badgeReward = video?.challenge?.badgeReward;

    const modifiers = appState.getSkillModifiers?.() || { xpMultiplier: 1, costMultiplier: 1, priceMultiplier: 1 };
    const xpReward = Math.round(baseXp * modifiers.xpMultiplier);

    const newXp = user.xp + xpReward;
    const newLevel = getLevel(newXp);
    const updatedBadges = badgeReward && !user.badges.includes(badgeReward)
      ? [...user.badges, badgeReward]
      : user.badges;

    if (user.settings?.soundEnabled) {
      SoundService.playSuccess();
    }

    useAppStore.setState({
      user: {
        ...user,
        xp: newXp,
        level: newLevel,
        ppTokens: user.ppTokens + baseTokens,
        badges: updatedBadges,
      },
    });

    set({ submittedChallenges: currentSubmissions });

    // Link Action Challenge to Family Job Board (Bounty System) for parent verification
    try {
      const socialStore = useSocialStore.getState();
      if (socialStore && typeof socialStore.addBounty === 'function') {
        const bountyId = `bounty_video_${submissionId}`;
        socialStore.addBounty({
          id: bountyId,
          creatorId: user.parentId || 'parent_guardian',
          assigneeId: user.id,
          title: `🎯 Video Mission: ${video?.title || 'Action Challenge'}`,
          description: notes || 'Submitted proof photo for real-world challenge',
          reward: baseTokens,
          status: 'PENDING_APPROVAL',
          createdAt: new Date().toISOString(),
          requiresPhoto: true,
          photoUrl: submission.proofUrl,
          frequency: 'ONCE',
        });
      }
    } catch {
      // Graceful fallback if socialStore is not initialized
    }

    Logger.info('[VideoSlice] Challenge proof submitted and approved', { submissionId, videoId });
    return submission;
  },

  approveChallengeSubmission: (submissionId: string) => {
    const submissions = { ...get().submittedChallenges };
    if (!submissions[submissionId]) return;

    submissions[submissionId] = {
      ...submissions[submissionId],
      status: 'APPROVED',
    };

    set({ submittedChallenges: submissions });
    SoundService.playLevelUp();
  },

  claimDailyVideoMissionReward: () => {
    const state = get();
    const missions = state.dailyVideoMissions;
    const appState = useAppStore.getState();
    const user = appState.user;

    if (missions.watchedCount < 2 || missions.quizzesCount < 1 || missions.claimedReward || !user) {
      return false;
    }

    const bonusXp = 50;
    const bonusTokens = 30;
    const newXp = user.xp + bonusXp;
    const newLevel = getLevel(newXp);

    SoundService.playLevelUp();

    useAppStore.setState({
      user: {
        ...user,
        xp: newXp,
        level: newLevel,
        ppTokens: user.ppTokens + bonusTokens,
      },
    });

    set({
      dailyVideoMissions: {
        ...missions,
        claimedReward: true,
      },
    });

    Logger.info('[VideoSlice] Daily Video Mission bonus claimed', { bonusXp, bonusTokens });
    return true;
  },

  addVideo: (video: Video) => {
    if (useAppStore.getState().user?.role !== 'ADMIN') {
      Logger.warn('[Security] videoSlice: Non-admin attempted addVideo — blocked');
      return;
    }
    set((state) => ({ videos: [...state.videos, video] }));
  },

  updateVideo: (id: string, updates: Partial<Video>) => {
    if (useAppStore.getState().user?.role !== 'ADMIN') {
      Logger.warn('[Security] videoSlice: Non-admin attempted updateVideo — blocked');
      return;
    }
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  },

  deleteVideo: (id: string) => {
    if (useAppStore.getState().user?.role !== 'ADMIN') {
      Logger.warn('[Security] videoSlice: Non-admin attempted deleteVideo — blocked');
      return;
    }
    set((state) => ({ videos: state.videos.filter((v) => v.id !== id) }));
  },
});
