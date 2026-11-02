/**
 * Secure cryptographic utilities for game logic and sensitive operations.
 */

/**
 * Returns a cryptographically secure random number between 0 (inclusive) and 1 (exclusive).
 * Equivalent to Math.random() but using the Web Crypto API.
 */
export const secureRandom = (): number => {
    const array = new Uint32Array(1);
    self.crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
};

/**
 * Returns a secure random integer between min (inclusive) and max (inclusive).
 */
export const secureRandomInt = (min: number, max: number): number => {
    const range = max - min + 1;
    const array = new Uint32Array(1);
    self.crypto.getRandomValues(array);
    return min + (array[0] % range);
};
