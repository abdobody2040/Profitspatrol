import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { createSocialSlice, SocialSlice } from './slices/socialSlice';
import { createNewsSlice, NewsSlice } from './slices/newsSlice';
import { createBountySlice, BountySlice } from './slices/bountySlice';

export type SocialState = SocialSlice & NewsSlice & BountySlice;

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
