
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { localStorageAdapter } from '../services/persistence/LocalStorageAdapter';
import { AppState } from './types';
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

// Re-export constants for backward compatibility during refactor
export * from '../data/constants';
export * from '../types'; // Re-export types if convenient, though direct import is better. 
// Many files import { UserRole } from '../store' ?? No, usually from types.
// But some might.

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
        }),
        {
            name: 'profits-patrol-storage',
            version: 3,
            migrate: (persistedState: any, version: number) => {
                if (version < 2) {
                    // Delete the stale library so Zustand re-initializes from INITIAL_LIBRARY
                    delete persistedState.library;
                }
                if (version < 3) {
                    // Re-clear library to force re-sync with the expanded INITIAL_LIBRARY
                    // (classicBooks were added after the initial release)
                    delete persistedState.library;
                }
                return persistedState;
            },
            storage: createJSONStorage(() => localStorageAdapter),
            partialize: (state) => ({
                // ✅ SECURITY FIX: PII fields (name, email, parentId, avatarUrl) are
                // intentionally excluded from localStorage persistence (COPPA/GDPR data minimization).
                // These are fetched from Supabase Auth on every session start.
                // Only game-state and non-identifiable progress data is stored locally.
                user: state.user ? {
                    id: state.user.id,
                    role: state.user.role,
                    level: state.user.level,
                    xp: state.user.xp,
                    bizCoins: state.user.bizCoins,
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
                    // ❌ Intentionally excluded from localStorage (fetched from Supabase Auth on login):
                    // name, email, username, password, avatar, parentId, linkedChildId, classId
                } : null,
                // ✅ COPPA/GDPR FIX: users[] was previously persisted wholesale, including
                // name, email, username, parentId, and linkedChildId for all loaded users.
                // Only the minimal non-PII subset needed for the admin panel is stored locally.
                // PII fields (name, email, username, parentId) are re-hydrated from Supabase on login.
                users: state.users.map(u => ({
                    id: u.id,
                    role: u.role,
                    level: u.level,
                    xp: u.xp,
                    bizCoins: u.bizCoins,
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
            })
        }
    )
);
