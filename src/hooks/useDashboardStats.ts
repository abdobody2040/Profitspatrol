/**
 * useDashboardStats.ts
 * ─────────────────────
 * Custom hook that wires domain functions to Zustand state and memoises the
 * output so components never re-compute on unrelated renders.
 *
 * Components import this hook in a single line and get a typed result object.
 * All heavy lifting lives in statsCalculator.ts — this file is glue only.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { User, LeaderboardEntry } from '../types';
import type { ShopItem } from '../data/constants';
import {
    calculateNetWorth,
    calculatePercentileRank,
    calculateStrongestSkill,
} from '../domain/statsCalculator';
import type {
    NetWorthBreakdown,
    PercentileResult,
    StrongestSkillResult,
} from '../domain/statsCalculator';

// --------------------------------------------------------------------------
// Public Types
// --------------------------------------------------------------------------

export interface DashboardStats {
    /** Full net worth breakdown (bizCoins + inventory + portfolio). */
    readonly netWorth: NetWorthBreakdown;
    /** Percentile rank result with a translated label. */
    readonly rank: PercentileResult & { readonly label: string };
    /** Which skill category is strongest and by how much. */
    readonly strongestSkill: StrongestSkillResult;
    /** Books the user has read, resolved from the library. */
    readonly booksRead: readonly Book[];
}

// Import Book type for the booksRead field
import type { Book } from '../types';

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------

/**
 * @param subject      - The user whose stats to compute (the "active" profile).
 * @param shopItemsMap - O(1) HashMap of ShopItems (from constants).
 * @param skillsMap    - O(1) HashMap of Skills (from constants).
 * @param leaderboard  - Leaderboard array for percentile calc.
 * @param library      - Full book library to resolve read book titles.
 */
export function useDashboardStats(
    subject: User,
    shopItemsMap: ReadonlyMap<string, Pick<ShopItem, 'id' | 'cost'>>,
    skillsMap: ReadonlyMap<string, { id: string; category: string }>,
    leaderboard: ReadonlyArray<Pick<LeaderboardEntry, 'xp'>>,
    library: ReadonlyArray<Book>
): DashboardStats {
    const { t } = useTranslation();

    // Build a O(1) book lookup map from the library once per library change
    const libraryMap = useMemo(
        () => new Map(library.map(b => [b.id, b])),
        [library]
    );

    return useMemo(() => {
        const netWorth = calculateNetWorth(subject, shopItemsMap);
        const rank = calculatePercentileRank(subject.xp, leaderboard);
        const strongestSkill = calculateStrongestSkill(
            subject.unlockedSkills ?? [],
            skillsMap
        );

        // Resolve read books via the pre-built O(1) map
        const booksRead = (subject.readBookIds ?? [])
            .map(id => libraryMap.get(id))
            .filter((b): b is Book => b !== undefined);

        return {
            netWorth,
            rank: {
                ...rank,
                label: t(rank.rankKey),
            },
            strongestSkill,
            booksRead,
        };
    }, [
        // Only re-compute when relevant data actually changes
        subject.bizCoins,
        subject.inventory,
        subject.portfolio,
        subject.xp,
        subject.unlockedSkills,
        subject.readBookIds,
        leaderboard,
        libraryMap,
        shopItemsMap,
        skillsMap,
        t,
    ]);
}
