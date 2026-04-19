import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { createSideHustleSlice, SideHustleSlice } from './slices/sideHustleSlice';
import { createRealEstateSlice, RealEstateSlice } from './slices/realEstateSlice';

export type EconomyState = SideHustleSlice & RealEstateSlice;

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
