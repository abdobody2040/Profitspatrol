import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { createEducationSlice } from './slices/educationSlice';
import { createVideoSlice } from './slices/videoSlice';
import { INITIAL_VIDEOS } from '../features/education/data/videos';
import type { EducationState } from './educationTypes';

export type { EducationState };

export const useEducationStore = create<EducationState>()(
  persist(
    (...a) => ({
      ...createEducationSlice(...a),
      ...createVideoSlice(...a),
    }),
    {
      name: 'profits-patrol-education-storage',
      version: 2,
      storage: createJSONStorage(() => localStorageAdapter),
      migrate: (persistedState: any) => {
        if (persistedState && persistedState.videos) {
          // Re-hydrate videos with fresh INITIAL_VIDEOS metadata
          const freshVideos = INITIAL_VIDEOS.map((initV) => {
            const existing = persistedState.videos.find((pv: any) => pv.id === initV.id);
            return existing ? { ...initV, ...existing, thumbnailUrl: initV.thumbnailUrl, fullPosterUrl: initV.fullPosterUrl } : initV;
          });
          return {
            ...persistedState,
            videos: freshVideos,
          };
        }
        return persistedState;
      },
      merge: (persistedState: any, currentState: any) => {
        if (!persistedState) return currentState;
        const persistedVideos = (persistedState as any).videos || [];
        const mergedVideos = INITIAL_VIDEOS.map((initV) => {
          const existing = persistedVideos.find((pv: any) => pv.id === initV.id);
          return existing
            ? { ...initV, ...existing, thumbnailUrl: initV.thumbnailUrl, fullPosterUrl: initV.fullPosterUrl }
            : initV;
        });

        return {
          ...currentState,
          ...persistedState,
          videos: mergedVideos,
        };
      },
    }
  )
);

