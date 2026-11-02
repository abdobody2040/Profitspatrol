import { StateCreator } from 'zustand';
import type { AppState } from '../types';
import { AppNotification } from '../../types';

export interface NotificationSlice {
    notifications: AppNotification[];
    addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
    markAsRead: (id: string) => void;
    clearNotifications: () => void;
}

export const createNotificationSlice: StateCreator<AppState, [], [], NotificationSlice> = (set) => ({
    notifications: [],

    addNotification: (notification) => set((state) => ({
        notifications: [
            {
                ...notification,
                id: Math.random().toString(36).substring(2, 9),
                read: false,
                createdAt: new Date().toISOString()
            },
            ...state.notifications
        ].slice(0, 20) // Keep last 20
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        )
    })),

    clearNotifications: () => set({ notifications: [] })
});
