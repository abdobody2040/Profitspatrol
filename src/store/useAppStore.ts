import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import type { AppState } from './types';
import { createUserSlice } from './slices/userSlice';
import { createGameSlice } from './slices/gameSlice';
import { createUiSlice } from './slices/uiSlice';
import { createLibrarySlice } from './slices/librarySlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createScenarioSlice } from './slices/scenarioSlice';
import { createDailyMissionsSlice } from './slices/dailyMissionSlice';
import { createWeeklyChallengeSlice } from './slices/weeklyChallengeSlice';
import { createSeasonalEventSlice } from './slices/seasonalEventSlice';
import { createFranchiseSlice } from './slices/franchiseSlice';
import { createTournamentSlice } from './slices/tournamentSlice';
import { createCorporationSlice } from './slices/corporationSlice';
import { createAdminConfigSlice } from './slices/adminConfigSlice';
import { createNotificationSlice } from './slices/notificationSlice';

export const useAppStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createUserSlice(...a),
            ...createGameSlice(...a),
            ...createUiSlice(...a),
            ...createLibrarySlice(...a),
            ...createSessionSlice(...a),
            ...createScenarioSlice(...a),
            ...createDailyMissionsSlice(...a),
            ...createWeeklyChallengeSlice(...a),
            ...createSeasonalEventSlice(...a),
            ...createFranchiseSlice(...a),
            ...createTournamentSlice(...a),
            ...createCorporationSlice(...a),
            ...createAdminConfigSlice(...a),
            ...createNotificationSlice(...a),
        }),
        {
            name: 'profits-patrol-storage',
            version: 9,
            migrate: (persistedState: any, version: number) => {
                if (version < 2) {
                    delete persistedState.library;
                }
                if (version < 3) {
                    delete persistedState.library;
                }
                if (version < 4) {
                    delete persistedState.exclusiveBooks;
                }
                if (version < 5) {
                    delete persistedState.exclusiveBooks;
                }
                if (version < 6) {
                    delete persistedState.exclusiveBooks;
                }
                if (version < 7) {
                    delete persistedState.library;
                    delete persistedState.exclusiveBooks;
                }
                if (version < 8) {
                    delete persistedState.library;
                    delete persistedState.exclusiveBooks;
                }
                if (version < 9) {
                    delete persistedState.library;
                    delete persistedState.exclusiveBooks;
                }
                return persistedState;
            },
            storage: createJSONStorage(() => localStorageAdapter),
            partialize: (state) => ({
                user: state.user ? {
                    id: state.user.id,
                    name: state.user.name,
                    username: state.user.username,
                    email: state.user.email,
                    role: state.user.role,
                    level: state.user.level,
                    xp: state.user.xp,
                    ppTokens: state.user.ppTokens,
                    streak: state.user.streak,
                    lastActivityDate: state.user.lastActivityDate,
                    lastSpinDate: state.user.lastSpinDate,
                    lastEnergyRefill: state.user.lastEnergyRefill,
                    energy: state.user.energy,
                    completedLessonIds: state.user.completedLessonIds,
                    unlockedSkills: state.user.unlockedSkills,
                    properties: state.user.properties,
                    readBookIds: state.user.readBookIds,
                    badges: state.user.badges,
                    inventory: state.user.inventory,
                    portfolio: state.user.portfolio,
                    placedItems: state.user.placedItems,
                    equippedItems: state.user.equippedItems,
                    hqLevel: state.user.hqLevel,
                    settings: state.user.settings,
                    subscriptionStatus: state.user.subscriptionStatus,
                    subscriptionTier: state.user.subscriptionTier,
                    stockPortfolio: state.user.stockPortfolio,
                    corporationId: state.user.corporationId,
                } : null,
                users: state.users.map(u => ({
                    id: u.id,
                    role: u.role,
                    level: u.level,
                    xp: u.xp,
                    ppTokens: u.ppTokens,
                    subscriptionTier: u.subscriptionTier,
                    subscriptionStatus: u.subscriptionStatus,
                })),
                library: state.library,
                sessions: state.sessions,
                activeScenario: state.activeScenario,
                dailyMissions: state.dailyMissions,
                weeklyChallenge: state.weeklyChallenge,
                seasonalEvent: state.seasonalEvent,
                franchise: state.franchise,
                tournament: state.tournament,
                corporations: state.corporations,
                economyConfig: state.economyConfig,
                featureFlags: state.featureFlags,
                furnitureOverrides: state.furnitureOverrides,
                debateTopicsAdmin: state.debateTopicsAdmin,
                badgeDefinitions: state.badgeDefinitions,
                exclusiveBooks: state.exclusiveBooks,
                notifications: state.notifications,
            })
        }
    )
);
