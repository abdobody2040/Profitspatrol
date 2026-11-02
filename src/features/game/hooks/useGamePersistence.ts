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

function sanitizeSavedSliders(
    savedSliders: Record<string, number> | undefined,
    playerInputs: (string | number)[] | undefined
): Record<string, number> {
    const sanitized: Record<string, number> = {};
    const defaults: Record<string, number> = {};

    playerInputs?.forEach(input => {
        defaults[String(input)] = 50;
    });

    if (savedSliders) {
        for (const [key, val] of Object.entries(savedSliders)) {
            if (typeof val === 'number') {
                sanitized[key] = val;
            }
        }
    }

    for (const [key, val] of Object.entries(defaults)) {
        if (sanitized[key] === undefined) {
            sanitized[key] = val;
        }
    }

    return sanitized;
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
                Logger.warn('useGamePersistence: Corrupted save data detected, ignoring', { gameId });
                return null;
            }

            // Sanitize sliderValues using dedicated pure helper
            saved.sliderValues = sanitizeSavedSliders(saved.sliderValues, gameData.variables?.player_inputs);

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
            Logger.error('useGamePersistence: Failed to save game data', error);
        }
    }, [getSaveKey]);

    // Debounced save wrapper
    const triggerAutoSave = useCallback((data: GameSaveData) => {
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
