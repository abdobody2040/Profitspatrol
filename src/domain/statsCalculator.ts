/**
 * statsCalculator.ts
 * ──────────────────
 * Pure domain functions for user/performance statistics.
 *
 * Design Rules:
 *   1. ZERO React / Zustand / Supabase imports — this layer has no side-effects.
 *   2. All functions are deterministic: same inputs → same output, always.
 *   3. All inputs are read-only; nothing is mutated.
 *   4. Every function is independently unit-testable via Vitest.
 */

import type { User, Skill, LeaderboardEntry } from '../types';
import type { ShopItem } from '../data/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NetWorthBreakdown {
    readonly bizCoins: number;
    readonly inventoryValue: number;  // at 50-cent on-the-dollar liquidation rate
    readonly businessValue: number;
    readonly total: number;
}

export interface PercentileResult {
    readonly percentile: number;
    /**
     * Human-readable rank label key (pass to i18n t() at the call site).
     * One of: 'dashboard.ranks.top_10' | 'dashboard.ranks.top_50' | 'dashboard.ranks.rising_star'
     */
    readonly rankKey: 'dashboard.ranks.top_10' | 'dashboard.ranks.top_50' | 'dashboard.ranks.rising_star';
}

export type SkillCategory = 'CHARISMA' | 'EFFICIENCY' | 'WISDOM';

export interface StrongestSkillResult {
    readonly category: SkillCategory | 'NONE';
    readonly count: number;
}

// ---------------------------------------------------------------------------
// Net Worth
// ---------------------------------------------------------------------------

/**
 * Calculates a user's net worth using O(1) HashMap lookups.
 *
 * @param subject     - The user whose worth is being calculated.
 * @param shopItemsMap - Pre-built Map<id, ShopItem> from constants (O(1) lookup).
 */
export function calculateNetWorth(
    subject: Readonly<Pick<User, 'bizCoins' | 'inventory' | 'portfolio'>>,
    shopItemsMap: ReadonlyMap<string, Pick<ShopItem, 'id' | 'cost'>>
): NetWorthBreakdown {
    const inventoryValue = subject.inventory.reduce<number>((sum, id) => {
        const item = shopItemsMap.get(id);
        return sum + (item?.cost ?? 0);
    }, 0);

    const businessValue = subject.portfolio.reduce<number>(
        (sum, p) => sum + (p.managerLevel * 1_000),
        0
    );

    return {
        bizCoins: subject.bizCoins,
        inventoryValue: inventoryValue * 0.5,   // 50-cent liquidation rate
        businessValue,
        total: subject.bizCoins + (inventoryValue * 0.5) + businessValue,
    };
}

// ---------------------------------------------------------------------------
// Percentile Rank
// ---------------------------------------------------------------------------

/**
 * Calculates where `subjectXp` percentile-ranks among the leaderboard.
 * The subject is injected into the dataset so they always appear in the ranking.
 */
export function calculatePercentileRank(
    subjectXp: number,
    leaderboard: ReadonlyArray<Pick<LeaderboardEntry, 'xp'>>
): PercentileResult {
    // Inject subject into the pool for a fair relative comparison
    const allScores = [...leaderboard.map(e => e.xp), subjectXp].sort((a, b) => a - b);

    // findIndex accounts for duplicate scores correctly (first occurrence)
    const rankIndex = allScores.findIndex(s => s === subjectXp);
    const percentile = Math.round(((rankIndex + 1) / allScores.length) * 100);

    let rankKey: PercentileResult['rankKey'];
    if (percentile >= 90) {
        rankKey = 'dashboard.ranks.top_10';
    } else if (percentile >= 50) {
        rankKey = 'dashboard.ranks.top_50';
    } else {
        rankKey = 'dashboard.ranks.rising_star';
    }

    return { percentile, rankKey };
}

// ---------------------------------------------------------------------------
// Strongest Skill
// ---------------------------------------------------------------------------

/**
 * Determines which skill category (`CHARISMA` | `EFFICIENCY` | `WISDOM`) the
 * user has invested in the most, using O(1) HashMap lookups.
 *
 * @param unlockedSkillIds - Array of skill IDs the user has purchased.
 * @param skillsMap        - Pre-built Map<id, Skill> from constants (O(1) lookup).
 */
export function calculateStrongestSkill(
    unlockedSkillIds: ReadonlyArray<string>,
    skillsMap: ReadonlyMap<string, { id: string; category: string }>
): StrongestSkillResult {
    if (unlockedSkillIds.length === 0) {
        return { category: 'NONE', count: 0 };
    }

    const VALID_CATEGORIES = new Set<string>(['CHARISMA', 'EFFICIENCY', 'WISDOM']);

    const counts: Record<SkillCategory, number> = {
        CHARISMA: 0,
        EFFICIENCY: 0,
        WISDOM: 0,
    };

    for (const id of unlockedSkillIds) {
        const skill = skillsMap.get(id);
        if (skill && VALID_CATEGORIES.has(skill.category)) {
            counts[skill.category as SkillCategory]++;
        }
    }

    const strongestCategory = (Object.keys(counts) as SkillCategory[]).reduce(
        (best, cat) => (counts[cat] > counts[best] ? cat : best),
        'CHARISMA' as SkillCategory
    );

    return { category: strongestCategory, count: counts[strongestCategory] };
}
