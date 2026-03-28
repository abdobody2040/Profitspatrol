/**
 * userUtils.test.ts
 * ──────────────────
 * Unit tests for the pure user resolution utilities in userUtils.ts.
 */

import { describe, it, expect } from 'vitest';
import { resolveSubject, getLinkedChildren } from '../userUtils';
import type { User } from '../../types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeUser = (overrides: Partial<User>): User => ({
    id: 'default_id',
    name: 'Default',
    role: 'KID' as any,
    xp: 0,
    level: 1,
    bizCoins: 0,
    inventory: [],
    badges: [],
    settings: {} as any,
    hqLevel: 'GARAGE' as any,
    portfolio: [],
    placedItems: [],
    properties: [],
    streak: 0,
    lastActivityDate: '2026-01-01',   // required string field
    currentModuleId: 'module_1',       // required string field
    completedLessonIds: [],
    subscriptionStatus: 'FREE',
    subscriptionTier: 'intern' as any,
    energy: 5,
    lastEnergyRefill: 0,
    equippedItems: [],
    unlockedSkills: [],
    ...overrides,
});

const PARENT = makeUser({ id: 'parent_1', role: 'PARENT' as any, linkedChildId: 'child_1' });
const CHILD_1 = makeUser({ id: 'child_1', parentId: 'parent_1', role: 'KID' as any });
const CHILD_2 = makeUser({ id: 'child_2', parentId: 'parent_1', role: 'KID' as any });
const KID = makeUser({ id: 'kid_1', role: 'KID' as any });
const ALL_USERS = [PARENT, CHILD_1, CHILD_2, KID];

// ---------------------------------------------------------------------------
// resolveSubject
// ---------------------------------------------------------------------------

describe('resolveSubject', () => {
    it('returns the KID themselves when they are not a PARENT', () => {
        const result = resolveSubject(KID, ALL_USERS);
        expect(result.id).toBe(KID.id);
    });

    it('resolves to the explicitly linked child when linkedChildId is set', () => {
        const result = resolveSubject(PARENT, ALL_USERS);
        expect(result.id).toBe('child_1');
    });

    it('falls back to the first child in the users array if linkedChildId is absent', () => {
        const parentNoLink = makeUser({ id: 'parent_1', role: 'PARENT' as any });
        const result = resolveSubject(parentNoLink, ALL_USERS);
        expect(result.id).toBe('child_1');
    });

    it('returns the parent itself if they have no children', () => {
        const loneParent = makeUser({ id: 'parent_orphan', role: 'PARENT' as any });
        const result = resolveSubject(loneParent, [loneParent]);
        expect(result.id).toBe('parent_orphan');
    });

    it('does NOT mutate the parent object (no linkedChildId side-effect)', () => {
        const parentNoLink = makeUser({ id: 'parent_1', role: 'PARENT' as any });
        const before = { ...parentNoLink };
        resolveSubject(parentNoLink, ALL_USERS);
        // The original object must be unchanged
        expect(parentNoLink.linkedChildId).toBe(before.linkedChildId);
    });
});

// ---------------------------------------------------------------------------
// getLinkedChildren
// ---------------------------------------------------------------------------

describe('getLinkedChildren', () => {
    it('returns all children for a given parent ID', () => {
        const children = getLinkedChildren('parent_1', ALL_USERS);
        expect(children).toHaveLength(2);
        expect(children.map(c => c.id)).toEqual(['child_1', 'child_2']);
    });

    it('returns an empty array when the parent has no children', () => {
        const children = getLinkedChildren('nonexistent_parent', ALL_USERS);
        expect(children).toHaveLength(0);
    });
});
