/**
 * SECURITY TEST SUITE — Pillar #4: Game Economy Integrity
 * BizCoins atomicity, idle income clock-skew, purchase validation,
 * daily-spin idempotency, subscription escalation surface
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store';
import { UserRole } from '../../src/types';
import { Logger } from '../../src/services/logger';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../src/lib/supabase', () => ({
    supabase: null,
    isSupabaseConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock('../../src/services/persistence/SupabaseAdapter', () => ({
    supabaseAdapter: { client: null, saveUser: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock('../../src/services/logger', () => ({
    Logger: {
        info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
        logSecurityEvent: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('../../src/services/SoundService', () => ({
    SoundService: { playClick: vi.fn(), playCoin: vi.fn(), playSuccess: vi.fn(), playError: vi.fn(), playLevelUp: vi.fn() },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeKidUser = (overrides: Record<string, unknown> = {}) => ({
    id: 'kid_1',
    role: UserRole.KID,
    name: 'Leo',
    bizCoins: 500,
    xp: 0, level: 1, streak: 1,
    lastActivityDate: new Date().toISOString().split('T')[0],
    completedLessonIds: [],
    readBookIds: [],
    badges: [], inventory: [] as string[], settings: { soundEnabled: false },
    hqLevel: 'hq_garage',
    unlockedSkills: [], portfolio: [] as any[], equippedItems: [], placedItems: [],
    subscriptionStatus: 'FREE', subscriptionTier: 'intern',
    energy: 5, lastEnergyRefill: Date.now(), properties: [],
    ...overrides,
});

beforeEach(() => {
    useAppStore.setState({ user: null, users: [], classrooms: [], classroom: null });
    vi.clearAllMocks();
});

// ─── Purchase Integrity ───────────────────────────────────────────────────────

describe('buyItem() — purchase atomicity (Pillar #4)', () => {
    it('ECONOMY: buying deducts exact cost from bizCoins', () => {
        const user = makeKidUser({ bizCoins: 500 });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const item = { id: 'item_hat', type: 'AVATAR', cost: 200, name: 'Hat' } as any;
        useAppStore.getState().buyItem(item);

        expect(useAppStore.getState().user?.bizCoins).toBe(300);
        expect(useAppStore.getState().user?.inventory).toContain('item_hat');
    });

    it('ECONOMY: purchase blocked when insufficient funds', () => {
        const user = makeKidUser({ bizCoins: 100 });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const item = { id: 'item_expensive', type: 'AVATAR', cost: 500, name: 'Expensive' } as any;
        useAppStore.getState().buyItem(item);

        expect(useAppStore.getState().user?.bizCoins).toBe(100);
        expect(useAppStore.getState().user?.inventory).not.toContain('item_expensive');
    });

    it('ECONOMY: duplicate avatar purchase is idempotent (no double-charge)', () => {
        const user = makeKidUser({ bizCoins: 1000, inventory: ['item_sunglasses'] });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const item = { id: 'item_sunglasses', type: 'AVATAR', cost: 100, name: 'Sunglasses' } as any;
        useAppStore.getState().buyItem(item);

        expect(useAppStore.getState().user?.bizCoins).toBe(1000); // no deduction
        const inv = useAppStore.getState().user?.inventory ?? [];
        expect(inv.filter((i: string) => i === 'item_sunglasses').length).toBe(1); // no duplicate
    });
});

// ─── Idle Income & Clock Skew ─────────────────────────────────────────────────

describe('collectIdleIncome() — clock-skew protection (Pillar #4)', () => {
    it('ECONOMY: backward clock skew yields 0 income and warns', () => {
        const futureDate = new Date(Date.now() + 9_999_999).toISOString();
        const user = makeKidUser({
            bizCoins: 100,
            portfolio: [{ businessId: 'BIZ_01_LEMONADE', managerLevel: 1, lastCollected: futureDate }],
        });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const income = useAppStore.getState().collectIdleIncome('BIZ_01_LEMONADE');

        expect(income).toBe(0);
        expect(useAppStore.getState().user?.bizCoins).toBe(100);
        expect(Logger.warn).toHaveBeenCalledWith(
            expect.stringContaining('Clock Skew'),
            expect.any(Object)
        );
    });

    it('ECONOMY: income is capped at 6h (conservative) when >25h claimed without server check', () => {
        // CRIT-05 defence: when client claims >25h elapsed, conservative 6h cap is applied
        // without a server-time confirmation (Supabase not configured in tests).
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        const user = makeKidUser({
            bizCoins: 0,
            portfolio: [{ businessId: 'BIZ_01_LEMONADE', managerLevel: 1, lastCollected: twoDaysAgo }],
        });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const income = useAppStore.getState().collectIdleIncome('BIZ_01_LEMONADE');
        const max6h = 50 * 1 * 6; // rate=50 × level=1 × 6h conservative cap

        // With CRIT-05: >25h claim → capped at 6h (not 24h) without server confirmation
        expect(income).toBeLessThanOrEqual(max6h);
        expect(income).toBe(max6h);
    });

    it('ECONOMY: income is capped at 24h when exactly 24h elapsed (under server-check threshold)', () => {
        // 24h elapsed is under the 25h threshold — no server check, full 24h cap applies.
        const justOver24h = new Date(Date.now() - 24 * 60 * 60 * 1000 - 60_000).toISOString();
        const user = makeKidUser({
            bizCoins: 0,
            portfolio: [{ businessId: 'BIZ_01_LEMONADE', managerLevel: 1, lastCollected: justOver24h }],
        });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const income = useAppStore.getState().collectIdleIncome('BIZ_01_LEMONADE');
        const max24h = 50 * 1 * 24; // rate=50 × level=1 × 24h

        expect(income).toBe(max24h);
    });


    it('ECONOMY: no income when only 1 second has passed', () => {
        const justNow = new Date(Date.now() - 1_000).toISOString();
        const user = makeKidUser({
            bizCoins: 100,
            portfolio: [{ businessId: 'BIZ_01_LEMONADE', managerLevel: 1, lastCollected: justNow }],
        });
        useAppStore.setState({ user: user as any, users: [user as any] });

        const income = useAppStore.getState().collectIdleIncome('BIZ_01_LEMONADE');

        expect(income).toBe(0);
        expect(useAppStore.getState().user?.bizCoins).toBe(100);
    });
});

// ─── Daily Spin Idempotency ───────────────────────────────────────────────────

describe('claimDailySpin() — idempotency (Pillar #4)', () => {
    it('ECONOMY: second spin claim on same day yields no coins', () => {
        const today = new Date().toISOString().split('T')[0];
        const user = makeKidUser({ bizCoins: 0, lastSpinDate: today });
        useAppStore.setState({ user: user as any, users: [user as any] });

        useAppStore.getState().claimDailySpin({ type: 'coins', value: 500, id: 'coins_500' });

        expect(useAppStore.getState().user?.bizCoins).toBe(0);
    });

    it('ECONOMY: first spin of the day awards the correct amount', () => {
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
        const user = makeKidUser({ bizCoins: 0, lastSpinDate: yesterday });
        useAppStore.setState({ user: user as any, users: [user as any] });

        useAppStore.getState().claimDailySpin({ type: 'coins', value: 200, id: 'coins_200' });

        expect(useAppStore.getState().user?.bizCoins).toBe(200);
    });
});

// ─── Subscription Attack Surface ─────────────────────────────────────────────

describe('upgradeSubscription() — attack surface documentation (Pillar #5)', () => {
    it('AUDIT: upgradeSubscription mutates local state (CRIT-02 — needs webhook fix)', () => {
        const user = makeKidUser({ subscriptionTier: 'intern', subscriptionStatus: 'FREE' });
        useAppStore.setState({ user: user as any, users: [user as any] });

        // This call SHOULD require server-verified payment. Currently it doesn't.
        // This test documents the attack surface rather than asserting safe behavior.
        useAppStore.getState().upgradeSubscription('tycoon');

        // Document: local state IS changed (the vulnerability)
        expect(useAppStore.getState().user?.subscriptionTier).toBe('tycoon');
        // TODO CRIT-02: Remove Supabase write from this action — only webhooks should set tier
    });
});
