import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { createSideHustleSlice } from './slices/sideHustleSlice';
import { createRealEstateSlice } from './slices/realEstateSlice';
import type { EconomyState } from './economyTypes';

export type { EconomyState };

export const useEconomyStore = create<EconomyState>()(
  persist(
    (...a) => ({
      ...createSideHustleSlice(...a),
      ...createRealEstateSlice(...a),
    }),
    {
      name: 'profits-patrol-economy-storage',
      storage: createJSONStorage(() => localStorageAdapter),
      partialize: (state) => ({
          gigXp: state.gigXp,
      }),
    }
  )
);
