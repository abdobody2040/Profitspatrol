/**
 * validation.ts
 * ─────────────
 * Shared input validators for all service layers.
 * Centralises guard logic so it is reusable and independently testable.
 *
 * Extracted from SocialService.ts where `assertValidUUID` and `sanitizeSearchQuery`
 * were module-private functions — copy-paste risk for any new service that needs them.
 */

/** UUID v4 regex — validates before embedding in PostgREST filter strings. */
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Asserts that `value` is a well-formed UUID v4.
 *
 * Use before interpolating into PostgREST `.or()` / `.eq()` filter expressions.
 * A malformed ID like `abc),and(1.eq.1` could escape the filter group (PostgREST injection).
 *
 * @throws {Error} if `value` does not match UUID v4 format
 */
export function assertValidUUID(value: string, field: string): void {
    if (!UUID_V4_REGEX.test(value)) {
        throw new Error(`Invalid ${field}: expected UUID v4, got "${value.slice(0, 12)}…"`);
    }
}

/** Returns true if `value` is a well-formed UUID v4. */
export function isValidUUID(value: string): boolean {
    return UUID_V4_REGEX.test(value);
}

/**
 * Sanitises a user-supplied search query for safe embedding in a PostgREST
 * `.ilike()` wildcard expression.
 *
 * Strips everything except alphanumeric characters and underscores, then
 * truncates to `maxLength`. Prevents unbounded wildcard abuse (`%` alone
 * returns the entire table up to the row limit).
 */
export function sanitizeSearchQuery(query: string, maxLength = 50): string {
    return query.replace(/[^a-zA-Z0-9_]/g, '').slice(0, maxLength);
}
