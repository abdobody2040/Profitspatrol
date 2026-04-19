import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { LemonadeState } from '../types';

export const INITIAL_LEMONADE_STATE: LemonadeState = {
    day: 1,
    funds: 20.00,
    inventory: { lemons: 0, sugar: 0, cups: 0 },
    recipe: { lemonsPerCup: 1, sugarPerCup: 1, pricePerCup: 1.00 },
    history: []
};

export interface GameStore {
    lemonadeState: LemonadeState;
    activeGameId: string | null;

    updateLemonadeState: (newState: Partial<LemonadeState>) => void;
    setActiveGameId: (id: string | null) => void;
}

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            lemonadeState: INITIAL_LEMONADE_STATE,
            activeGameId: null,

            updateLemonadeState: (newState) => set((state) => ({
                lemonadeState: { ...state.lemonadeState, ...newState }
            })),

            setActiveGameId: (id) => set({ activeGameId: id }),
        }),
        {
            name: 'profits-patrol-game-storage',
            version: 1,
            storage: createJSONStorage(() => localStorageAdapter),
            partialize: (state) => ({
                lemonadeState: state.lemonadeState,
                // Do not persist activeGameId to avoid getting stuck in a game
            })
        }
    )
);
