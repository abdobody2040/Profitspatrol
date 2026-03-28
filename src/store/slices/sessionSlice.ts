import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { LiveSession } from '../../types';

export interface SessionSlice {
    sessions: LiveSession[];
    addSession: (session: LiveSession) => void;
    updateSession: (id: string, updates: Partial<LiveSession>) => void;
    deleteSession: (id: string) => void;
}

export const createSessionSlice: StateCreator<AppState, [], [], SessionSlice> = (set) => ({
    sessions: [],

    addSession: (session: LiveSession) =>
        set((state) => ({
            sessions: [...state.sessions, session],
        })),

    updateSession: (id: string, updates: Partial<LiveSession>) =>
        set((state) => ({
            sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

    deleteSession: (id: string) =>
        set((state) => ({
            sessions: state.sessions.filter((s) => s.id !== id),
        })),
});
