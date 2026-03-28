
import { useState, useCallback, useRef } from 'react';
import { Logger } from '../../../services/logger';
import { BusinessSimulation, User } from '../../../types';

export interface GameSaveData {
    day: number;
    funds: number;
    upgrades: string[];
    sliderValues: Record<string, number>;
    timestamp: number;
}

interface UseGamePersistenceProps {
    gameId: string;
    user: User | null;
    gameData: BusinessSimulation | undefined;
}

export const useGamePersistence = ({ gameId, user, gameData }: UseGamePersistenceProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getSaveKey = useCallback(() => {
        if (!user || !gameId) return null;
        return `profitspatrol_save_${user.id}_${gameId}`;
    }, [user, gameId]);

    const loadGameData = useCallback((): GameSaveData | null => {
        const saveKey = getSaveKey();
        if (!saveKey || !gameData) return null;

        try {
            const savedString = localStorage.getItem(saveKey);
            if (!savedString) return null;

            const saved: GameSaveData = JSON.parse(savedString);

            // Validate save data structure
            if (typeof saved.day !== 'number' || typeof saved.funds !== 'number') {
                // ✅ SECURITY FIX: Route through structured Logger (was bare console.warn)
                Logger.warn('useGamePersistence: Corrupted save data detected, ignoring', { gameId });
                return null;
            }

            // Sanitize sliderValues
            const sanitizedSliders: Record<string, number> = {};

            // Merge saved sliders with defaults to ensure all keys exist
            const defaultSliders: Record<string, number> = {};
            gameData.variables?.player_inputs?.forEach(input => {
                defaultSliders[String(input)] = 50;
            });

            // If we have saved sliders, respect them, otherwise use default
            if (saved.sliderValues) {
                Object.keys(saved.sliderValues).forEach(key => {
                    const val = saved.sliderValues[key];
                    if (typeof val === 'number') {
                        sanitizedSliders[key] = val;
                    }
                });
            }

            // Fill in any missing keys from defaults
            // (This handles cases where game config changed/added new sliders)
            Object.keys(defaultSliders).forEach(key => {
                if (sanitizedSliders[key] === undefined) {
                    sanitizedSliders[key] = defaultSliders[key];
                }
            });

            // Update the saved object with sanitized sliders
            saved.sliderValues = sanitizedSliders;

            Logger.info("Game loaded successfully", { gameId });
            return saved;

        } catch (error) {
            Logger.error('useGamePersistence: Failed to load save data', error);
            return null;
        }
    }, [getSaveKey, gameData]);

    const saveGameData = useCallback((data: GameSaveData) => {
        const saveKey = getSaveKey();
        if (!saveKey) return;

        try {
            localStorage.setItem(saveKey, JSON.stringify(data));

            setIsSaving(true);
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(() => {
                setIsSaving(false);
            }, 1000);

        } catch (error) {
            // Note: localStorage quota exceeded (QuotaExceededError) is the most common cause here
            Logger.error('useGamePersistence: Failed to save game data', error);
        }
    }, [getSaveKey]);

    // Debounced save wrapper
    const triggerAutoSave = useCallback((data: GameSaveData) => {
        // Don't save if it's the initial empty state (day 1, funds 100, no upgrades)
        // BUT: This check is better done by the caller or we duplicate default logic here.
        // We will leave the "should save" logic to the caller or just debounce everything.

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveGameData(data);
        }, 500);

    }, [saveGameData]);

    return {
        loadGameData,
        saveGameData,
        triggerAutoSave,
        isSaving
    };
};
