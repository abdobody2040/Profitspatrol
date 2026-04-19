/**
 * Security Utility
 * Provides client-side security functions for the MVP local-auth layer.
 *
 * ⚠️  NOTE: These are transitional utilities for the local Zustand auth layer.
 * Production authentication MUST use Supabase Auth (bcrypt, server-side).
 * Once Supabase Auth is the sole auth path, `hashPassword` and `hashPasswordWithSalt`
 * can be removed. Until then, use salted hashing only.
 */

/** Unsalted SHA-256 — kept only for legacy migration compatibility. DO NOT use for new hashes. */
export const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * ✅ SECURITY FIX: Salted SHA-256 — generates a random per-user salt so identical
 * passwords produce different hashes, defeating rainbow-table and credential-stuffing attacks.
 *
 * @returns { hash: string; salt: string } — store both; salt is NOT secret.
 */
export const hashPasswordWithSalt = async (
    password: string
): Promise<{ hash: string; salt: string }> => {
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return { hash, salt };
};

/**
 * Verify a salted password hash.
 * @param password - Plain-text password to test
 * @param storedHash - Hash from `hashPasswordWithSalt`
 * @param salt - Salt from `hashPasswordWithSalt`
 */
export const verifyPassword = async (
    password: string,
    storedHash: string,
    salt: string
): Promise<boolean> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hash === storedHash;
};

/**
 * ⚠️  NOT FOR SECURITY USE — djb2 variant, 32-bit collisions.
 * Acceptable only for non-security purposes: UI color generation, deterministic IDs, etc.
 * Never use for password hashing, token generation, or integrity verification.
 */
export const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
};
