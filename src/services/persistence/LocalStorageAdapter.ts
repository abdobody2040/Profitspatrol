import { StateStorage } from 'zustand/middleware';
import { User, Classroom, UniversalLessonUnit, BusinessSimulation, Book, CMSContent, Assignment, Submission, StudentGroup, Rubric } from '../../types';
import { ALL_LESSONS } from '../../features/education/data/curriculum';
import { GAMES_DB } from '../../features/game/data/games';
import { INITIAL_LIBRARY } from '../../features/library/data/libraryBooks';
import { Logger } from '../logger';

const STORAGE_KEY = 'profitspatrol-storage';

export class LocalStorageAdapter implements StateStorage {

    // --- Zustand PersistStorage Implementation ---

    getItem(name: string): string | null {
        try {
            return localStorage.getItem(name);
        } catch (e) {
            Logger.error(`LocalStorageAdapter: Failed to getItem ${name}`, e);
            return null;
        }
    }

    setItem(name: string, value: string): void {
        try {
            localStorage.setItem(name, value);
        } catch (e) {
            // ✅ AUDIT FIX: Detect QuotaExceededError specifically.
            // When localStorage is full, silently swallowing would cause data-loss
            // that the user cannot see (they think the save succeeded).
            const isQuotaError =
                e instanceof DOMException &&
                (e.name === 'QuotaExceededError' ||
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
                    e.code === 22); // Legacy browsers

            if (isQuotaError) {
                Logger.warn('LocalStorageAdapter: Quota exceeded — attempting emergency prune', {
                    key: name,
                    valueSize: value.length,
                });

                // --- Emergency: delete the largest game-save key and retry ---
                let largestKey: string | null = null;
                let largestSize = 0;

                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (!k) continue;
                    // Only prune game-save blobs, never the primary app state
                    if (!k.startsWith('profitspatrol_save_')) continue;
                    const size = (localStorage.getItem(k) || '').length;
                    if (size > largestSize) {
                        largestSize = size;
                        largestKey = k;
                    }
                }

                if (largestKey) {
                    localStorage.removeItem(largestKey);
                    Logger.info('LocalStorageAdapter: Pruned stale game save to free space', {
                        prunedKey: largestKey,
                        freedBytes: largestSize,
                    });

                    // Retry once after pruning
                    try {
                        localStorage.setItem(name, value);
                        return; // Success after pruning — done
                    } catch (retryErr) {
                        // Retry also failed — storage critically full
                        Logger.error('LocalStorageAdapter: Retry after prune also failed', retryErr);
                    }
                }

                // Notify the UI layer so a toast can be shown to the user
                // Listen with: window.addEventListener('storage-quota-exceeded', handler)
                window.dispatchEvent(new CustomEvent('storage-quota-exceeded', {
                    detail: { key: name, message: 'Local storage is full. Some progress may not be saved.' }
                }));
            } else {
                Logger.error(`LocalStorageAdapter: Failed to setItem ${name}`, e);
            }
        }
    }

    removeItem(name: string): void {
        try {
            localStorage.removeItem(name);
        } catch (e) {
            Logger.error(`LocalStorageAdapter: Failed to removeItem ${name}`, e);
        }
    }

    // --- Legacy / Direct Data Access Pattern (Deprecated but kept for reference) ---
    // If we want to return specific typed data, we can keep these, but for Zustand persist
    // we primarily utilize the generic string-based storage methods above.

    async initialize(): Promise<void> {
        return Promise.resolve();
    }
}

export const localStorageAdapter = new LocalStorageAdapter();

