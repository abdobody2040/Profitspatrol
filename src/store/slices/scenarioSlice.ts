import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { TurnaroundScenario } from '../../types';
import { COURSE_MAP } from '../../features/education/data/curriculum';

export interface ScenarioSlice {
    activeScenario: TurnaroundScenario | null;
    startScenario: (scenario: TurnaroundScenario) => void;
    updateScenarioState: (updates: Partial<TurnaroundScenario>) => void;
    endScenario: (success: boolean) => void;
}

export const createScenarioSlice: StateCreator<AppState, [], [], ScenarioSlice> = (set, get) => ({
    activeScenario: null,

    startScenario: (scenario: TurnaroundScenario) => set({ activeScenario: scenario }),

    updateScenarioState: (updates: Partial<TurnaroundScenario>) =>
        set((state) => ({
            activeScenario: state.activeScenario ? { ...state.activeScenario, ...updates } : null,
        })),

    endScenario: (success: boolean) => {
        const state = get();
        if (success && state.activeScenario && state.user) {
            // Build updated completedLessonIds
            const newCompletedIds = state.activeScenario.completionId
                ? [...(state.user.completedLessonIds || []), state.activeScenario.completionId]
                : (state.user.completedLessonIds || []);

            // ✅ FIX: Check if a certificate should be shown before clearing activeScenario
            let showCertificateId: string | null = null;
            if (state.activeScenario.completionId?.includes('BOSS')) {
                const parts = state.activeScenario.completionId.split('_');
                const sectionIndex = parseInt(parts[1]);
                if (!isNaN(sectionIndex) && sectionIndex < COURSE_MAP.length) {
                    showCertificateId = COURSE_MAP[sectionIndex].id;
                }
            }

            // ✅ FIX: Single atomic set() instead of two sequential calls.
            // The original code called set() twice in sequence: once for user rewards,
            // then again for the certificate. This creates a brief intermediate state
            // where the reward is applied but the scenario is still active.
            set({
                user: {
                    ...state.user,
                    xp: (state.user.xp || 0) + 500,
                    bizCoins: (state.user.bizCoins || 0) + 1000,
                    completedLessonIds: newCompletedIds,
                },
                activeScenario: null,
                ...(showCertificateId ? { showCertificateId } : {}),
            });
        } else {
            set({ activeScenario: null });
        }
    }
});
