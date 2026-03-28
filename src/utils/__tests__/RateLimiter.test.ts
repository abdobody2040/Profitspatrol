/**
 * RateLimiter Tests
 * Tests for the RateLimiter utility class
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '../RateLimiter';

describe('RateLimiter', () => {
    let limiter: RateLimiter;

    beforeEach(() => {
        // Create limiter: 3 requests per 1000ms
        limiter = new RateLimiter(3, 1000);
    });

    it('should allow requests within limit', () => {
        expect(limiter.canMakeRequest('user1')).toBe(true);
        expect(limiter.canMakeRequest('user1')).toBe(true);
        expect(limiter.canMakeRequest('user1')).toBe(true);
    });

    it('should block requests exceeding limit', () => {
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');

        // 4th request should be blocked
        expect(limiter.canMakeRequest('user1')).toBe(false);
    });

    it('should track different users separately', () => {
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');

        // user1 is at limit, but user2 should be allowed
        expect(limiter.canMakeRequest('user2')).toBe(true);
    });

    it('should return remaining time when rate limited', () => {
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');

        const remainingTime = limiter.getRemainingTime('user1');
        expect(remainingTime).toBeGreaterThan(0);
        expect(remainingTime).toBeLessThanOrEqual(1000);
    });

    it('should reset after clearing', () => {
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');
        limiter.canMakeRequest('user1');

        expect(limiter.canMakeRequest('user1')).toBe(false);

        limiter.reset('user1');
        expect(limiter.canMakeRequest('user1')).toBe(true);
    });

    it('should return request count', () => {
        expect(limiter.getRequestCount('user1')).toBe(0);

        limiter.canMakeRequest('user1');
        expect(limiter.getRequestCount('user1')).toBe(1);

        limiter.canMakeRequest('user1');
        expect(limiter.getRequestCount('user1')).toBe(2);
    });
});
