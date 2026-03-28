import { StateCreator } from 'zustand';
import { AppState } from '../types';
import type { SocialState } from '../socialStore';
import { NewsEvent } from '../../types';

export interface NewsSlice {
    news: NewsEvent[];
    addNewsEvent: (event: NewsEvent) => void;
    clearNews: () => void;
}

export const createNewsSlice: StateCreator<SocialState, [], [], NewsSlice> = (set) => ({
    news: [
        {
            id: 'initial_welcome',
            headline: 'Welcome to Profits Patrol! Start your first venture today.',
            type: 'GLOBAL',
            createdAt: new Date().toISOString()
        }
    ],

    addNewsEvent: (event: NewsEvent) =>
        set((state) => {
            const newNews = [event, ...state.news].slice(0, 10); // Keep only last 10
            return { news: newNews };
        }),

    clearNews: () => set({ news: [] }),
});
