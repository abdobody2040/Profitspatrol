import { supabase } from '../../lib/supabase';
import { localStorageAdapter } from './LocalStorageAdapter';
import { supabaseAdapter } from './SupabaseAdapter';
import { Logger } from '../logger';
import { isSupabaseConfigured } from '../../lib/supabase';

export const MigrationService = {
    /**
     * Reads all data from LocalStorage and pushes it to Supabase.
     * This is a "One-Way Sync" meant for initial migration.
     */
    migrateToCloud: async () => {
        if (!isSupabaseConfigured()) {
            Logger.warn("Migration Skipped: Supabase not configured");
            return { success: false, message: "Supabase not configured" };
        }

        // ✅ SECURITY FIX: Verify caller is authenticated before writing any data to cloud.
        // Previously any code path could trigger migration without an auth check.
        const { data: { user: authUser }, error: authError } = await supabase!.auth.getUser();
        if (authError || !authUser) {
            Logger.warn("Migration Blocked: Not authenticated");
            return { success: false, message: "Authentication required" };
        }

        try {
            Logger.info("Starting Migration: Local -> Cloud", { userId: authUser.id });

            // 1. Read Local Data
            const raw = localStorage.getItem('profits-patrol-storage') || localStorage.getItem('kidcap-hq-storage');
            if (!raw) {
                Logger.info("Migration Skipped: No local data found");
                return { success: true, message: "No local data to migrate" };
            }

            // ✅ FIX: Parse in its own try-catch to distinguish corrupt JSON from failed saves
            let state: any;
            try {
                const parsed = JSON.parse(raw);
                state = parsed.state;
            } catch {
                Logger.error("Migration Failed: localStorage JSON is corrupt");
                return { success: false, error: "Corrupt local storage data" };
            }

            if (!state) {
                throw new Error("Invalid local storage format — 'state' key missing");
            }

            // 2. Build save promises
            const promises: Promise<any>[] = [];

            if (state.users && Array.isArray(state.users)) {
                for (const user of state.users) {
                    promises.push(supabaseAdapter.saveUser(user));
                }
            }
            if (state.classrooms && Array.isArray(state.classrooms)) {
                for (const classroom of state.classrooms) {
                    promises.push(supabaseAdapter.saveClassroom(classroom));
                }
            }
            if (state.assignments && Array.isArray(state.assignments)) {
                for (const assignment of state.assignments) {
                    promises.push(supabaseAdapter.saveAssignment(assignment));
                }
            }
            if (state.submissions && Array.isArray(state.submissions)) {
                for (const submission of state.submissions) {
                    promises.push(supabaseAdapter.saveSubmission(submission));
                }
            }
            if (state.games && Array.isArray(state.games)) {
                for (const game of state.games) {
                    promises.push(supabaseAdapter.saveGame(game));
                }
            }
            if (state.cmsContent) {
                promises.push(supabaseAdapter.saveCMSContent(state.cmsContent));
            }

            // ✅ FIX: Use Promise.allSettled instead of Promise.all.
            // Promise.all aborts on the first failure, leaving the DB partially migrated.
            // Promise.allSettled completes all saves and lets us report individual failures.
            const results = await Promise.allSettled(promises);
            const failed = results.filter(r => r.status === 'rejected');
            const succeeded = results.length - failed.length;

            if (failed.length > 0) {
                Logger.warn('Migration partially failed', { succeeded, failed: failed.length });
            } else {
                Logger.info("Migration Complete", { itemsMigrated: succeeded });
            }

            return { success: failed.length === 0, count: succeeded, failedCount: failed.length };

        } catch (error: any) {
            Logger.error("Migration Failed", { error: error.message });
            return { success: false, error: error.message };
        }
    }
};
