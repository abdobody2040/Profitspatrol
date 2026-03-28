/**
 * userUtils.ts
 * ─────────────
 * Pure utilities for resolving the "active subject" in the app — i.e.
 * determining which user profile should currently be displayed.
 *
 * Design Rules:
 *   1. No side-effects — inputs are never mutated.
 *   2. No React / Zustand imports at this layer.
 *   3. Fully unit-testable in isolation.
 */

import type { User, UserRole } from '../types';

// ---------------------------------------------------------------------------
// resolveSubject
// ---------------------------------------------------------------------------

/**
 * Determines the "subject" user whose data should be displayed —
 * resolves parent-views-child relationships without mutating the input objects.
 *
 * Rules:
 *  - If `user` is a KID or TEACHER, they are always their own subject.
 *  - If `user` is a PARENT with `linkedChildId`, resolve to that child.
 *  - If `user` is a PARENT without `linkedChildId`, fall back to the first
 *    child in `allUsers` whose `parentId` matches this parent.
 *  - If no child is found at all, the parent themselves is returned.
 *
 * @param user     - The currently logged-in user.
 * @param allUsers - All users available in the store (used to resolve child).
 * @returns        - The resolved subject (never mutates the input objects).
 */
export function resolveSubject(user: User, allUsers: readonly User[]): User {
    // Non-parent roles are always their own subject
    if (user.role !== ('PARENT' as UserRole)) {
        return user;
    }

    // Parent with an explicit active-child link
    if (user.linkedChildId) {
        const child = allUsers.find(u => u.id === user.linkedChildId);
        if (child) return child;
    }

    // Fallback: first child belonging to this parent
    const firstChild = allUsers.find(u => u.parentId === user.id);
    return firstChild ?? user;
}

// ---------------------------------------------------------------------------
// getLinkedChildren
// ---------------------------------------------------------------------------

/**
 * Returns all child accounts whose `parentId` matches the given parent's id.
 * Pure — does not depend on Zustand or React.
 */
export function getLinkedChildren(parentId: string, allUsers: readonly User[]): User[] {
    return allUsers.filter(u => u.parentId === parentId);
}
