
import { LEVEL_THRESHOLDS } from '../data/constants';

// Helper: Calculate Level
export const getLevel = (xp: number) => {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    }
    return level;
};

// Helper: Date string YYYY-MM-DD
export const getToday = () => new Date().toISOString().split('T')[0];

export const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
};
