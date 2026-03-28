import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { createEducationSlice, EducationSlice } from './slices/educationSlice';
import { createVideoSlice, VideoSlice } from './slices/videoSlice';

export type EducationState = EducationSlice & VideoSlice;

export const useEducationStore = create<EducationState>()(
  persist(
    (...a) => ({
      ...createEducationSlice(...a),
      ...createVideoSlice(...a),
    }),
    {
      name: 'profits-patrol-education-storage',
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
