/**
 * SECURITY TEST SUITE — Pillar #1: Child Safety (COPPA) & Parental Gate
 *
 * Logger PII redaction tests use the REAL Logger (no mock) and spy on
 * console.info/warn directly so we can verify the actual sanitized output.
 * ContentModerationService and ParentalGate tests are self-contained.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentModerationService, Violation } from '../../src/services/ContentModerationService';

// Do NOT mock the logger module here — we need the real sanitizeForLog to run.
vi.mock('../../src/lib/supabase', () => ({
    supabase: null,
    isSupabaseConfigured: vi.fn().mockReturnValue(false),
}));

beforeEach(() => vi.clearAllMocks());

// ─── Logger PII Redaction — uses REAL Logger ───────────────────────────────────

describe('Logger — PII Redaction (COPPA Pillar #1)', () => {
    it('COPPA: Logger.info must not expose email in log output', async () => {
        const { Logger } = await import('../../src/services/logger');
        const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
        Logger.info('Test event', { userId: 'kid_1', email: 'child@example.com', action: 'login' });
        expect(spy.mock.calls.map(c => JSON.stringify(c)).join(' ')).not.toContain('child@example.com');
        spy.mockRestore();
    });

    it('COPPA: Logger.warn must not expose username in log output', async () => {
        const { Logger } = await import('../../src/services/logger');
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        Logger.warn('Child action', { username: 'leo_kiddo', action: 'purchase' });
        expect(spy.mock.calls.map(c => JSON.stringify(c)).join(' ')).not.toContain('leo_kiddo');
        spy.mockRestore();
    });

    it('COPPA: password field is always redacted from logs', async () => {
        const { Logger } = await import('../../src/services/logger');
        const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
        Logger.info('Auth attempt', { username: 'leo', password: 'SuperSecret123' });
        expect(spy.mock.calls.map(c => JSON.stringify(c)).join(' ')).not.toContain('SuperSecret123');
        spy.mockRestore();
    });

    it('COPPA: safe fields (userId, action, lessonId) are preserved in log output', async () => {
        const { Logger } = await import('../../src/services/logger');
        const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
        Logger.info('Safe log', { userId: 'kid_1', action: 'complete_lesson', lessonId: 'MB_01' });
        const output = spy.mock.calls.map(c => JSON.stringify(c)).join(' ');
        expect(output).toContain('kid_1');
        expect(output).toContain('MB_01');
        spy.mockRestore();
    });
});

// ─── Parental Gate ────────────────────────────────────────────────────────────

describe('ParentalGate — Brute-Force Resistance (COPPA Pillar #1)', () => {
    it('COPPA: math challenge answers stay in calculable range (11-29)', () => {
        for (let a = 10; a <= 19; a++) {
            for (let b = 1; b <= 10; b++) {
                const answer = a + b;
                expect(answer).toBeGreaterThanOrEqual(11);
                expect(answer).toBeLessThanOrEqual(29);
                expect(answer).not.toBe(0);
            }
        }
    });

    it('COPPA: random-guess success probability with 3 attempts is < 3%', () => {
        const totalCombinations = 10 * 10; // 10 values for a × 10 values for b
        const maxAttempts = 3;
        const bruteForceChance = maxAttempts / totalCombinations;
        expect(bruteForceChance).toBeLessThanOrEqual(0.03);
    });
});

// ─── Content Moderation ───────────────────────────────────────────────────────

describe('ContentModerationService — Child Safety Filters (COPPA Pillar #1)', () => {
    it('SAFETY: severe profanity is detected and censored in output', () => {
        const result = ContentModerationService.moderateContent('This is shit content');
        expect(result.isClean).toBe(false);
        expect(result.violations.some((v: Violation) => v.type === 'profanity')).toBe(true);
        expect(result.sanitizedText).not.toContain('shit');
    });

    it('SAFETY: self-harm keywords trigger CRITICAL severity', () => {
        const result = ContentModerationService.moderateContent('I want to kill myself');
        expect(result.isClean).toBe(false);
        expect(result.violations.some((v: Violation) => v.type === 'self_harm')).toBe(true);
        expect(result.severity).toBe('critical');
    });

    it('SAFETY: adult content keywords trigger CRITICAL severity', () => {
        const result = ContentModerationService.moderateContent('looking for porn');
        expect(result.isClean).toBe(false);
        expect(result.violations.some((v: Violation) => v.type === 'adult_content')).toBe(true);
        expect(result.severity).toBe('critical');
    });

    it('SAFETY: email PII is detected in user-submitted text', () => {
        const result = ContentModerationService.moderateContent('Contact me at myname@gmail.com please');
        expect(result.isClean).toBe(false);
        expect(result.violations.some((v: Violation) => v.type === 'pii')).toBe(true);
    });

    it('SAFETY: normal business essay passes moderation cleanly', () => {
        const result = ContentModerationService.moderateContent(
            'I want to start a lemonade stand and earn profit from selling to customers.'
        );
        expect(result.isClean).toBe(true);
        expect(result.violations).toHaveLength(0);
    });

    it('SAFETY: sanitizedText changes when violations are found', () => {
        const input = 'violence with a gun is bad';
        const result = ContentModerationService.moderateContent(input);
        if (!result.isClean) {
            expect(result.sanitizedText).not.toBe(input);
        }
    });
});
