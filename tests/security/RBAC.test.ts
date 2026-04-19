/**
 * SECURITY TEST SUITE — Pillar #2: Authentication & RBAC
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store';
import { UserRole } from '../../src/types';
import { Logger } from '../../src/services/logger';
import { supabaseAdapter } from '../../src/services/persistence/SupabaseAdapter';
import { MOCK_USER, MOCK_PARENT, MOCK_TEACHER, MOCK_ADMIN } from '../../src/data/mocks';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../src/lib/supabase', () => ({
    supabase: {
        auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    isSupabaseConfigured: vi.fn().mockReturnValue(true),
}));

vi.mock('../../src/services/persistence/SupabaseAdapter', () => ({
    supabaseAdapter: {
        client: {
            auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
        },
        saveUser: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('../../src/services/logger', () => ({
    Logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        logSecurityEvent: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('../../src/services/SoundService', () => ({
    SoundService: { playClick: vi.fn(), playCoin: vi.fn(), playSuccess: vi.fn(), playError: vi.fn(), playLevelUp: vi.fn() },
}));

// Reset store between tests
beforeEach(() => {
    useAppStore.setState({ user: null, users: [], classrooms: [], classroom: null });
    vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RBAC — impersonateUser()', () => {
    it('SECURITY: non-admin (KID) cannot impersonate another user', () => {
        const kidUser = { id: 'kid_1', role: UserRole.KID, name: 'Leo' } as any;
        const adminUser = { id: 'admin_1', role: UserRole.ADMIN, name: 'Admin' } as any;
        useAppStore.setState({ user: kidUser, users: [kidUser, adminUser] });

        useAppStore.getState().impersonateUser('admin_1');

        expect(useAppStore.getState().user?.id).toBe('kid_1');
        expect(useAppStore.getState().user?.role).toBe(UserRole.KID);
        expect(Logger.warn).toHaveBeenCalledWith(
            expect.stringContaining('Unauthorized impersonation attempt blocked'),
            expect.objectContaining({ actorId: 'kid_1', targetId: 'admin_1' })
        );
    });

    it('SECURITY: parent cannot impersonate a teacher', () => {
        const parentUser = { id: 'parent_1', role: UserRole.PARENT, name: 'Mom' } as any;
        const teacherUser = { id: 'teacher_1', role: UserRole.TEACHER, name: 'Mr. Stark' } as any;
        useAppStore.setState({ user: parentUser, users: [parentUser, teacherUser] });

        useAppStore.getState().impersonateUser('teacher_1');

        expect(useAppStore.getState().user?.id).toBe('parent_1');
    });

    it('SECURITY: unauthenticated call (no user) is silently blocked', () => {
        useAppStore.setState({ user: null, users: [{ id: 'admin_1', role: UserRole.ADMIN } as any] });

        expect(() => useAppStore.getState().impersonateUser('admin_1')).not.toThrow();
        expect(useAppStore.getState().user).toBeNull();
    });

    it('SECURITY: ADMIN user CAN impersonate (valid admin tool)', () => {
        const adminUser = { id: 'admin_1', role: UserRole.ADMIN, name: 'Admin' } as any;
        const kidUser = { id: 'kid_1', role: UserRole.KID, name: 'Leo', classId: undefined } as any;
        useAppStore.setState({ user: adminUser, users: [adminUser, kidUser], classrooms: [] });

        useAppStore.getState().impersonateUser('kid_1');

        expect(useAppStore.getState().user?.id).toBe('kid_1');
    });
});

describe('RBAC — updateUser() whitelist', () => {
    it('SECURITY: kid cannot escalate their own role via updateUser()', () => {
        const kidUser = {
            id: 'kid_1', role: UserRole.KID, name: 'Leo',
            bizCoins: 100, settings: { soundEnabled: true }, xp: 0, level: 1
        } as any;
        useAppStore.setState({ user: kidUser, users: [kidUser] });

        useAppStore.getState().updateUser('kid_1', { role: UserRole.ADMIN } as any);

        expect(useAppStore.getState().user?.role).toBe(UserRole.KID);
    });

    it('SECURITY: kid cannot arbitrarily increase own bizCoins via updateUser()', () => {
        const kidUser = {
            id: 'kid_1', role: UserRole.KID, name: 'Leo',
            bizCoins: 100, settings: { soundEnabled: true }
        } as any;
        useAppStore.setState({ user: kidUser, users: [kidUser] });

        useAppStore.getState().updateUser('kid_1', { bizCoins: 9_999_999 } as any);

        expect(useAppStore.getState().user?.bizCoins).toBe(100);
    });

    it('SECURITY: user cannot update a different user without admin rights', () => {
        const kidUser = { id: 'kid_1', role: UserRole.KID, name: 'Leo', bizCoins: 100 } as any;
        const otherKid = { id: 'kid_2', role: UserRole.KID, name: 'Sam', bizCoins: 200 } as any;
        useAppStore.setState({ user: kidUser, users: [kidUser, otherKid] });

        useAppStore.getState().updateUser('kid_2', { bizCoins: 0 } as any);

        const samCoins = useAppStore.getState().users.find((u: any) => u.id === 'kid_2')?.bizCoins;
        expect(samCoins).toBe(200);
        expect(Logger.warn).toHaveBeenCalledWith(
            expect.stringContaining('[Security] Unauthorized Update Attempt'),
            expect.any(Object)
        );
    });

    it('SECURITY: admin CAN update another user', () => {
        const adminUser = { id: 'admin_1', role: UserRole.ADMIN, name: 'Admin' } as any;
        const kidUser = { id: 'kid_1', role: UserRole.KID, name: 'Leo', bizCoins: 100, settings: {} } as any;
        useAppStore.setState({ user: adminUser, users: [adminUser, kidUser] });

        useAppStore.getState().updateUser('kid_1', { name: 'Leonardo' } as any);

        const updatedName = useAppStore.getState().users.find((u: any) => u.id === 'kid_1')?.name;
        expect(updatedName).toBe('Leonardo');
    });
});

describe('RBAC — logout() session cleanup', () => {
    it('SECURITY: logout clears user state completely', async () => {
        useAppStore.setState({ user: { id: 'kid_1', role: UserRole.KID } as any });

        await useAppStore.getState().logout();

        expect(useAppStore.getState().user).toBeNull();
        expect(useAppStore.getState().users).toHaveLength(0);
    });
});

describe('Mock data — no hardcoded passwords', () => {
    it('SECURITY: none of the mock users have a password field', () => {
        expect((MOCK_USER as any).password).toBeUndefined();
        expect((MOCK_PARENT as any).password).toBeUndefined();
        expect((MOCK_TEACHER as any).password).toBeUndefined();
        expect((MOCK_ADMIN as any).password).toBeUndefined();
    });
});
