/**
 * statsCalculator.test.ts
 * ─────────────────────────
 * Unit tests for the pure domain functions in statsCalculator.ts.
 * These tests run without React, Zustand, or browser APIs.
 */

import { describe, it, expect } from 'vitest';
import type { PortfolioItem } from '../../types';
import {
    calculateNetWorth,
    calculatePercentileRank,
    calculateStrongestSkill,
} from '../statsCalculator';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_SHOP_MAP = new Map([
    ['item_hat', { id: 'item_hat', cost: 80 }],
    ['item_crown', { id: 'item_crown', cost: 500 }],
    ['item_suit', { id: 'item_suit', cost: 150 }],
]);

const MOCK_SKILLS_MAP = new Map([
    ['skl_silver_tongue', { id: 'skl_silver_tongue', category: 'CHARISMA' }],
    ['skl_negotiator',    { id: 'skl_negotiator',    category: 'CHARISMA' }],
    ['skl_fast_hands',    { id: 'skl_fast_hands',    category: 'EFFICIENCY' }],
    ['skl_fast_learner',  { id: 'skl_fast_learner',  category: 'WISDOM' }],
]);

const MOCK_LEADERBOARD = [
    { xp: 5200 },
    { xp: 4800 },
    { xp: 3500 },
    { xp: 2100 },
    { xp: 1250 },
];

const EMPTY_PORTFOLIO: PortfolioItem[] = [];

const makePortfolio = (...levels: number[]): PortfolioItem[] =>
    levels.map((managerLevel, i) => ({
        businessId: `biz_${i}`,
        managerLevel,
        lastCollected: '2026-01-01T00:00:00Z',
    }));

// ---------------------------------------------------------------------------
// calculateNetWorth
// ---------------------------------------------------------------------------

describe('calculateNetWorth', () => {
    it('returns correct total for a user with coins, inventory, and portfolio', () => {
        const subject = {
            bizCoins: 1000,
            inventory: ['item_hat', 'item_crown'],   // (80 + 500) * 0.5 = 290
            portfolio: makePortfolio(2, 3),           // 2000 + 3000 = 5000
        };

        const result = calculateNetWorth(subject, MOCK_SHOP_MAP);

        expect(result.bizCoins).toBe(1000);
        expect(result.inventoryValue).toBe(290);
        expect(result.businessValue).toBe(5000);
        expect(result.total).toBe(6290);
    });

    it('handles empty inventory and portfolio', () => {
        const subject = { bizCoins: 500, inventory: [], portfolio: EMPTY_PORTFOLIO };
        const result = calculateNetWorth(subject, MOCK_SHOP_MAP);

        expect(result.total).toBe(500);
        expect(result.inventoryValue).toBe(0);
        expect(result.businessValue).toBe(0);
    });

    it('gracefully skips unknown item IDs (O(1) Map miss returns undefined)', () => {
        const subject = {
            bizCoins: 100,
            inventory: ['unknown_item_id'],
            portfolio: EMPTY_PORTFOLIO,
        };
        const result = calculateNetWorth(subject, MOCK_SHOP_MAP);
        expect(result.inventoryValue).toBe(0);
        expect(result.total).toBe(100);
    });
});

// ---------------------------------------------------------------------------
// calculatePercentileRank
// ---------------------------------------------------------------------------

describe('calculatePercentileRank', () => {
    it('returns top_10 for a high XP score', () => {
        const { percentile, rankKey } = calculatePercentileRank(9999, MOCK_LEADERBOARD);
        expect(percentile).toBeGreaterThanOrEqual(90);
        expect(rankKey).toBe('dashboard.ranks.top_10');
    });

    it('returns rising_star for a very low XP score', () => {
        const { percentile, rankKey } = calculatePercentileRank(0, MOCK_LEADERBOARD);
        expect(percentile).toBeLessThan(50);
        expect(rankKey).toBe('dashboard.ranks.rising_star');
    });

    it('returns top_50 for a mid-range XP score', () => {
        const { rankKey } = calculatePercentileRank(3200, MOCK_LEADERBOARD);
        expect(rankKey).toBe('dashboard.ranks.top_50');
    });

    it('injects the subject into the comparison pool', () => {
        const { percentile } = calculatePercentileRank(99999, MOCK_LEADERBOARD);
        expect(percentile).toBe(100);
    });
});

// ---------------------------------------------------------------------------
// calculateStrongestSkill
// ---------------------------------------------------------------------------

describe('calculateStrongestSkill', () => {
    it('returns NONE for a user with no skills', () => {
        const result = calculateStrongestSkill([], MOCK_SKILLS_MAP);
        expect(result.category).toBe('NONE');
        expect(result.count).toBe(0);
    });

    it('correctly identifies the dominant category', () => {
        // 2x CHARISMA, 1x EFFICIENCY
        const result = calculateStrongestSkill(
            ['skl_silver_tongue', 'skl_negotiator', 'skl_fast_hands'],
            MOCK_SKILLS_MAP
        );
        expect(result.category).toBe('CHARISMA');
        expect(result.count).toBe(2);
    });

    it('handles a tie by returning one of the tied categories', () => {
        // 1x CHARISMA, 1x WISDOM
        const result = calculateStrongestSkill(
            ['skl_silver_tongue', 'skl_fast_learner'],
            MOCK_SKILLS_MAP
        );
        expect(['CHARISMA', 'WISDOM']).toContain(result.category);
    });

    it('ignores unknown skill IDs gracefully', () => {
        const result = calculateStrongestSkill(['unknown_skill_xyz'], MOCK_SKILLS_MAP);
        expect(result.count).toBe(0);
    });

    it('ignores skill entries with invalid category strings (security guard)', () => {
        const maliciousMap = new Map([
            ['skl_evil', { id: 'skl_evil', category: 'ADMIN' }],
        ]);
        const result = calculateStrongestSkill(['skl_evil'], maliciousMap);
        expect(result.count).toBe(0);
    });
});
