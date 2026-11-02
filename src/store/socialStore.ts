import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { createSocialSlice } from './slices/socialSlice';
import { createNewsSlice } from './slices/newsSlice';
import { createBountySlice } from './slices/bountySlice';
import type { SocialState } from './socialTypes';

export type { SocialState };

export const useSocialStore = create<SocialState>()(
  persist(
    (...a) => ({
      ...createSocialSlice(...a),
      ...createNewsSlice(...a),
      ...createBountySlice(...a),
    }),
    {
      name: 'profits-patrol-social-storage',
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
