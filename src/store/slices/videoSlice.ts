import { StateCreator } from 'zustand';
import { useAppStore } from '../index';
import type { EducationState } from '../educationStore';
import { Video } from '../../types';
import { INITIAL_VIDEOS } from '../../features/education/data/videos';
import { Logger } from '../../services/logger';

export interface VideoSlice {
    videos: Video[];
    addVideo: (video: Video) => void;
    updateVideo: (id: string, updates: Partial<Video>) => void;
    deleteVideo: (id: string) => void;
}

export const createVideoSlice: StateCreator<EducationState, [], [], VideoSlice> = (set, get) => ({
    videos: INITIAL_VIDEOS,

    addVideo: (video: Video) => {
        // ✅ SECURITY FIX: Only ADMIN can add curriculum videos.
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
        set((state) => ({ videos: state.videos.map((v) => (v.id === id ? { ...v, ...updates } : v)) }));
    },

    deleteVideo: (id: string) => {
        if (useAppStore.getState().user?.role !== 'ADMIN') {
            Logger.warn('[Security] videoSlice: Non-admin attempted deleteVideo — blocked');
            return;
        }
        set((state) => ({ videos: state.videos.filter((v) => v.id !== id) }));
    },
});
