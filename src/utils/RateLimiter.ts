/**
 * RateLimiter - Client-side rate limiting utility
 * Uses sliding window algorithm to prevent abuse
 */

export class RateLimiter {
    private requests = new Map<string, number[]>();
    private limit: number;
    private window: number;
    // ✅ FIX: Track check count to trigger periodic pruning without performance overhead
    private checkCount = 0;
    private static readonly PRUNE_INTERVAL = 100;

    /**
     * @param limit - Maximum number of requests allowed
     * @param windowMs - Time window in milliseconds
     */
    constructor(limit: number, windowMs: number) {
        this.limit = limit;
        this.window = windowMs;
    }

    /**
     * Check if a request can be made
     * @param key - Unique identifier (e.g., userId, action name)
     * @returns true if request is allowed, false if rate limited
     */
    canMakeRequest(key: string): boolean {
        const now = Date.now();

        // ✅ FIX: Periodic prune to prevent the Map growing unbounded in long sessions.
        // Without this, keys that are checked once and never again leak indefinitely.
        this.checkCount++;
        if (this.checkCount % RateLimiter.PRUNE_INTERVAL === 0) {
            this.prune();
        }

        const timestamps = this.requests.get(key) || [];

        // Remove old timestamps outside the window
        const validTimestamps = timestamps.filter(t => now - t < this.window);

        if (validTimestamps.length >= this.limit) {
            return false;
        }

        validTimestamps.push(now);
        this.requests.set(key, validTimestamps);

        return true;
    }

    /**
     * Get remaining time until next request is allowed
     * @param key - Unique identifier
     * @returns milliseconds until next request allowed, or 0 if allowed now
     */
    getRemainingTime(key: string): number {
        const timestamps = this.requests.get(key) || [];
        if (timestamps.length === 0) return 0;

        const oldest = Math.min(...timestamps);
        const timeElapsed = Date.now() - oldest;
        return Math.max(0, this.window - timeElapsed);
    }

    /**
     * Reset rate limit for a specific key
     * @param key - Unique identifier
     */
    reset(key: string): void {
        this.requests.delete(key);
    }

    clearAll(): void {
        this.requests.clear();
    }

    /**
     * Remove all entries with no active timestamps in the current window.
     * Called automatically every PRUNE_INTERVAL checks, or manually if desired.
     */
    prune(): void {
        const now = Date.now();
        for (const [key, timestamps] of this.requests.entries()) {
            const active = timestamps.filter(t => now - t < this.window);
            if (active.length === 0) {
                this.requests.delete(key);
            } else {
                this.requests.set(key, active);
            }
        }
    }

    /**
     * Get current request count for a key
     * @param key - Unique identifier
     * @returns number of requests in current window
     */
    getRequestCount(key: string): number {
        const now = Date.now();
        const timestamps = this.requests.get(key) || [];
        return timestamps.filter(t => now - t < this.window).length;
    }
}
